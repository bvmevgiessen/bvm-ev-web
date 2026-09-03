import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import { createServer as createViteServer } from "vite";
import fs from "fs";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Rate limiting middleware to prevent DoS attacks on API endpoints
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300, // Limit each IP to 300 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests, please try again later." }
  });

  // Apply rate limiting strictly to API endpoints so static assets and HTML are never blocked
  app.use("/api/", limiter);

  // Security headers using Helmet
  app.use(
    helmet({
      frameguard: false, // Allow iframe embedding in preview environments via CSP frame-ancestors
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          baseUri: ["'self'"],
          objectSrc: ["'none'"],
          frameAncestors: ["'self'", "https:", "http://localhost:*"],
          frameSrc: [
            "'self'",
            "https://challenges.cloudflare.com",
            "https://*.cloudflare.com",
            "https://*.firebaseapp.com",
            "https://*.jotform.com",
            "https://script.google.com",
            "https://script.googleusercontent.com"
          ],
          formAction: [
            "'self'",
            "https://*.jotform.com",
            "https://formspree.io",
            "https://bvm-newsletter-api.onrender.com",
            "https://*.onrender.com",
            "https://newsletter.bvm-ev.de",
            "https://script.google.com",
            "https://script.googleusercontent.com"
          ],
          scriptSrc: [
            "'self'",
            "'unsafe-inline'",
            "https://*.jotform.com",
            "https://challenges.cloudflare.com",
            "https://*.cloudflare.com"
          ],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
          imgSrc: ["'self'", "data:", "blob:", "https:"],
          connectSrc: [
            "'self'",
            "https://formspree.io",
            "https://bvm-newsletter-api.onrender.com",
            "https://*.onrender.com",
            "https://newsletter.bvm-ev.de",
            "https://events-blog-brief.preview.emergentagent.com",
            "https://challenges.cloudflare.com",
            "https://*.cloudflare.com",
            "https://*.googleapis.com",
            "https://*.firebaseio.com",
            "https://*.firebaseapp.com",
            "https://script.google.com",
            "https://script.googleusercontent.com",
            "https://*.jotform.com"
          ],
          workerSrc: ["'self'", "blob:", "https://challenges.cloudflare.com", "https://*.cloudflare.com"],
          childSrc: ["'self'", "blob:", "https://challenges.cloudflare.com", "https://*.cloudflare.com"]
        }
      },
      crossOriginResourcePolicy: { policy: "cross-origin" }
    })
  );

  // Read Firebase project config
  let projectId = "composite-advice-ljcsn"; // Default fallback
  try {
    const configPath = path.join(process.cwd(), "firebase-applet-config.json");
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      if (config.projectId) {
        projectId = config.projectId;
      }
    }
  } catch (e) {
    console.error("[Server] Error reading firebase config:", e);
  }

  // Use body parsers
  app.use(express.json({ limit: '50mb' })); // support large file payloads for report uploads
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  const DEFAULT_GAS_URL = "https://script.google.com/macros/s/AKfycbVB7mpSdQpm-QvzoJCTLn74BqLNdUD99ILxAoD9I7_kU3WPxNYLxF4luvr7kyDSTiE/exec";

  // API endpoint to fetch survey settings config via server-side REST call
  // This bypasses any client-side Firestore/iframe restriction completely.
  app.get("/api/survey-settings/config", async (req, res) => {
    try {
      const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/survey_settings/config`;
      console.log(`[Proxy] Fetching config from Firestore REST API: ${url}`);
      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 404 || response.status === 403) {
          // Document does not exist yet or unauthenticated, return default config instead of error
          return res.status(200).json({
            taetigkeitsberichtGasUrl: DEFAULT_GAS_URL,
            googleSpreadsheetUrl: "",
            adminPasscodeHash: "",
            updatedAt: ""
          });
        }
        throw new Error(`Firestore REST API returned status ${response.status}`);
      }
      
      const data = await response.json();
      
      // Map Firestore REST format to simple flat object
      const fields = data.fields || {};
      let fetchedGasUrl = fields.taetigkeitsberichtGasUrl?.stringValue || DEFAULT_GAS_URL;
      
      // Filter out any obsolete Apps Script URL
      if (fetchedGasUrl.includes("AKfycb_j2093")) {
        fetchedGasUrl = DEFAULT_GAS_URL;
      }

      const config = {
        taetigkeitsberichtGasUrl: fetchedGasUrl,
        googleSpreadsheetUrl: fields.googleSpreadsheetUrl?.stringValue || "",
        adminPasscodeHash: fields.adminPasscodeHash?.stringValue || "",
        updatedAt: fields.updatedAt?.stringValue || ""
      };
      
      res.status(200).json(config);
    } catch (err: any) {
      console.error("[Server] Error fetching Firestore config:", err);
      res.status(500).json({ error: err.message || "Failed to fetch config" });
    }
  });

  // API endpoint to update survey settings config via server-side REST call
  app.post("/api/survey-settings/config", async (req, res) => {
    try {
      const { taetigkeitsberichtGasUrl, googleSpreadsheetUrl, adminPasscodeHash } = req.body;
      const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/survey_settings/config`;
      
      const fields: any = {
        updatedAt: { stringValue: new Date().toISOString() }
      };
      let maskParams: string[] = ["updateMask.fieldPaths=updatedAt"];

      if (taetigkeitsberichtGasUrl !== undefined) {
        fields.taetigkeitsberichtGasUrl = { stringValue: taetigkeitsberichtGasUrl };
        maskParams.push("updateMask.fieldPaths=taetigkeitsberichtGasUrl");
      }
      if (googleSpreadsheetUrl !== undefined) {
        fields.googleSpreadsheetUrl = { stringValue: googleSpreadsheetUrl };
        maskParams.push("updateMask.fieldPaths=googleSpreadsheetUrl");
      }
      if (adminPasscodeHash !== undefined) {
        fields.adminPasscodeHash = { stringValue: adminPasscodeHash };
        maskParams.push("updateMask.fieldPaths=adminPasscodeHash");
      }

      const patchUrl = `${url}?${maskParams.join("&")}`;
      console.log(`[Proxy] Updating config in Firestore REST API: ${patchUrl}`);

      const response = await fetch(patchUrl, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fields })
      });

      if (!response.ok) {
        console.warn(`[Server] Firestore REST API PATCH returned status ${response.status}`);
      }
      res.status(200).json({ status: "success", taetigkeitsberichtGasUrl: taetigkeitsberichtGasUrl || DEFAULT_GAS_URL });
    } catch (err: any) {
      console.error("[Server] Error updating Firestore config via REST:", err);
      res.status(500).json({ error: err.message || "Failed to save config" });
    }
  });

  // API proxy route for Google Apps Script to bypass browser Content Security Policy
  app.post("/api/proxy-apps-script", async (req, res) => {
    const { url, payload } = req.body;
    if (!url) {
      return res.status(400).json({ error: "Missing Apps Script url" });
    }

    // SSRF Prevention: Restrict forwarded requests strictly to verified Google Apps Script endpoints
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.protocol !== "https:") {
        return res.status(400).json({ error: "Invalid protocol. Only HTTPS is allowed." });
      }
      if (parsedUrl.hostname !== "script.google.com") {
        return res.status(400).json({ error: "Invalid target host. Only script.google.com is allowed." });
      }
      if (!parsedUrl.pathname.startsWith("/macros/s/") || !parsedUrl.pathname.endsWith("/exec")) {
        return res.status(400).json({ error: "Invalid Apps Script path structure." });
      }
    } catch (e) {
      return res.status(400).json({ error: "Malformed URL provided." });
    }

    try {
      console.log(`[Proxy] Forwarding request to Google Apps Script: ${url.slice(0, 50)}...`);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(payload)
      });
      
      const responseText = await response.text();

      if (!response.ok || responseText.includes("Page not found") || responseText.includes("does not exist")) {
        console.warn(`[Proxy] Google Apps Script returned status ${response.status} or HTML error page.`);
        return res.status(404).json({
          error: "Die konfigurierte Google Apps Script Web-App URL ist ungültig oder existiert nicht mehr (HTML 404 / Page Not Found). Bitte erstellen Sie eine neue Web-App Bereitstellung in Google Apps Script und hinterlegen Sie die URL in den Einstellungen."
        });
      }
      
      res.status(200).json({ status: "success", response: responseText.slice(0, 200) });
    } catch (err: any) {
      console.error("[Proxy] Error forwarding request:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.use((req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
