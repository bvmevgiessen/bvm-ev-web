/**
 * Google Apps Script Web App - doPost Handler
 * Features:
 * 1. Cloudflare Turnstile token verification via https://challenges.cloudflare.com/turnstile/v0/siteverify
 * 2. Per-IP + per-form rate limiting using CacheService (60s TTL)
 * 3. Server-side sanitization and abuse detection (scripts, control chars, >5 URLs)
 * 4. Abuse logging to 'abuse_log' sheet
 * 5. Automated email alert (MailApp) when same IP triggers 3+ abuse events in 1 hour
 * 6. Blocked-IP check against 'blocked_ips' sheet
 */

function doPost(e) {
  try {
    // 1. Extract raw payload
    var postData = "";
    if (e && e.postData && e.postData.contents) {
      postData = e.postData.contents;
    } else if (e && e.parameter && e.parameter.postData) {
      postData = e.parameter.postData;
    }

    if (!postData) {
      return createJsonResponse({ status: "error", message: "Leere Anfrage erhalten." }, 400);
    }

    var payload = {};
    try {
      payload = JSON.parse(postData);
    } catch (err) {
      // Fallback for form-encoded submissions
      payload = e.parameter || {};
    }

    var clientIp = (payload.clientIp || (e && e.parameter && e.parameter.ip) || "unknown").trim();
    var formName = (payload.form || payload.formKey || "taetigkeitsbericht").trim();

    // 2. Check Blocked-IP list
    if (isIpBlocked(clientIp)) {
      logAbuse(clientIp, formName, "blocked_ip_rejected", JSON.stringify(payload).slice(0, 200));
      return createJsonResponse({ status: "error", message: "Zugriff verweigert (403)." }, 403);
    }

    // 3. Rate Limiting via CacheService (60s window per IP + form)
    var cache = CacheService.getScriptCache();
    var rateLimitKey = "rl_" + clientIp.replace(/[^a-zA-Z0-9_]/g, "_") + "_" + formName;
    if (clientIp !== "unknown" && cache.get(rateLimitKey)) {
      logAbuse(clientIp, formName, "rate_limit_exceeded", "Too many requests in 60s");
      return createJsonResponse({ status: "error", message: "Zu viele Anfragen. Bitte warten Sie 60 Sekunden." }, 429);
    }
    // Set 60-second cache marker
    cache.put(rateLimitKey, "1", 60);

    // 4. Cloudflare Turnstile Verification
    var turnstileToken = payload.turnstileToken || payload["cf-turnstile-response"] || "";
    var turnstileSecret = PropertiesService.getScriptProperties().getProperty("TURNSTILE_SECRET");

    if (turnstileSecret && turnstileToken) {
      var isTokenValid = verifyTurnstileToken(turnstileToken, turnstileSecret, clientIp);
      if (!isTokenValid) {
        logAbuse(clientIp, formName, "invalid_turnstile_token", "Turnstile verification failed");
        return createJsonResponse({ status: "error", message: "Bot-Schutz-Verifizierung fehlgeschlagen." }, 400);
      }
    }

    // 5. Server-side Content Validation & Sanitization
    var validationError = validatePayload(payload);
    if (validationError) {
      logAbuse(clientIp, formName, "validation_failed", validationError + " | " + JSON.stringify(payload).slice(0, 200));
      return createJsonResponse({ status: "error", message: "Ungültige Formulareingabe: " + validationError }, 400);
    }

    // 6. Process the valid submission (e.g. append to main sheet / save report)
    var result = handleValidSubmission(payload);

    return createJsonResponse({
      status: "success",
      message: "Erfolgreich übermittelt.",
      data: result
    }, 200);

  } catch (error) {
    return createJsonResponse({
      status: "error",
      message: error.toString()
    }, 500);
  }
}

/**
 * Verify Cloudflare Turnstile token via Cloudflare API
 */
function verifyTurnstileToken(token, secret, clientIp) {
  try {
    var url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
    var payloadData = {
      secret: secret,
      response: token
    };
    if (clientIp && clientIp !== "unknown") {
      payloadData.remoteip = clientIp;
    }

    var options = {
      method: "post",
      payload: payloadData,
      muteHttpExceptions: true
    };

    var response = UrlFetchApp.fetch(url, options);
    var json = JSON.parse(response.getContentText());
    return json.success === true;
  } catch (e) {
    Logger.log("Turnstile verify exception: " + e);
    return false;
  }
}

/**
 * Validate and sanitize form payloads
 */
function validatePayload(payload) {
  var str = JSON.stringify(payload);

  // Check for dangerous script injection patterns
  if (/<script|<iframe|javascript:|onerror\s*=|onload\s*=/i.test(str)) {
    return "Verdächtige Script-Elemente erkannt.";
  }

  // Check URL count (> 5 URLs in single submission indicates link-farming spam)
  var urlMatches = str.match(/(https?:\/\/|www\.)/gi);
  if (urlMatches && urlMatches.length > 5) {
    return "Zu viele URLs in den Formularfeldern.";
  }

  return null;
}

/**
 * Check if IP is in 'blocked_ips' sheet tab
 */
function isIpBlocked(clientIp) {
  if (!clientIp || clientIp === "unknown") return false;
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("blocked_ips");
    if (!sheet) return false;

    var values = sheet.getDataRange().getValues();
    for (var i = 0; i < values.length; i++) {
      if (values[i][0] && values[i][0].toString().trim() === clientIp) {
        return true;
      }
    }
  } catch (e) {
    Logger.log("Error checking blocked_ips: " + e);
  }
  return false;
}

/**
 * Log abuse to 'abuse_log' sheet tab and trigger email alert if >= 3 abuse events in 1h
 */
function logAbuse(ip, form, reason, payloadSnippet) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("abuse_log");
    if (!sheet) {
      sheet = ss.insertSheet("abuse_log");
      sheet.appendRow(["timestamp", "ip", "form", "reason", "payload_snippet"]);
    }

    var timestamp = new Date().toISOString();
    sheet.appendRow([timestamp, ip, form, reason, (payloadSnippet || "").slice(0, 500)]);

    // Check recent abuse count for this IP
    if (ip && ip !== "unknown") {
      var cache = CacheService.getScriptCache();
      var countKey = "abuse_cnt_" + ip.replace(/[^a-zA-Z0-9_]/g, "_");
      var currentCount = parseInt(cache.get(countKey) || "0", 10) + 1;
      cache.put(countKey, currentCount.toString(), 3600); // 1 hour TTL

      if (currentCount >= 3) {
        var alertSentKey = "abuse_alert_sent_" + ip.replace(/[^a-zA-Z0-9_]/g, "_");
        if (!cache.get(alertSentKey)) {
          cache.put(alertSentKey, "1", 3600);
          try {
            MailApp.sendEmail(
              "admin@bvm-ev.de",
              "BVM Abuse Alert - Verdächtige Formularaktivität",
              "Warnung: Die IP-Adresse " + ip + " hat innerhalb von 1 Stunde mehrfach (" + currentCount + "x) den Missbrauchsschutz ausgelöst.\n\n" +
              "Formular: " + form + "\n" +
              "Letzter Grund: " + reason + "\n" +
              "Zeitpunkt: " + timestamp + "\n\n" +
              "Prüfen Sie das Google Sheet 'abuse_log' für weitere Details."
            );
          } catch (mailErr) {
            Logger.log("MailApp error: " + mailErr);
          }
        }
      }
    }
  } catch (e) {
    Logger.log("Error writing abuse log: " + e);
  }
}

/**
 * Handle valid submissions - store in primary data sheet
 */
function handleValidSubmission(payload) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("submissions") || ss.getActiveSheet();
  var timestamp = new Date().toISOString();
  
  sheet.appendRow([timestamp, JSON.stringify(payload)]);
  return { id: timestamp };
}

/**
 * Utility to output clean JSON response
 */
function createJsonResponse(data, statusCode) {
  var output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}