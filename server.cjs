var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_helmet = __toESM(require("helmet"), 1);
var import_express_rate_limit = __toESM(require("express-rate-limit"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_fs = __toESM(require("fs"), 1);
var import_genai = require("@google/genai");
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  const limiter = (0, import_express_rate_limit.default)({
    windowMs: 15 * 60 * 1e3,
    // 15 minutes
    max: 300,
    // Limit each IP to 300 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests, please try again later." }
  });
  app.use("/api/", limiter);
  app.use(
    (0, import_helmet.default)({
      frameguard: { action: "sameorigin" },
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
            "https://human-rights-hub-14.preview.emergentagent.com",
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
  let projectId = "composite-advice-ljcsn";
  try {
    const configPath = import_path.default.join(process.cwd(), "firebase-applet-config.json");
    if (import_fs.default.existsSync(configPath)) {
      const config = JSON.parse(import_fs.default.readFileSync(configPath, "utf-8"));
      if (config.projectId) {
        projectId = config.projectId;
      }
    }
  } catch (e) {
    console.error("[Server] Error reading firebase config:", e);
  }
  app.use(import_express.default.json({ limit: "50mb" }));
  app.use(import_express.default.urlencoded({ limit: "50mb", extended: true }));
  const DEFAULT_GAS_URL = "https://script.google.com/macros/s/AKfycbVB7mpSdQpm-QvzoJCTLn74BqLNdUD99ILxAoD9I7_kU3WPxNYLxF4luvr7kyDSTiE/exec";
  app.get("/api/survey-settings/config", async (req, res) => {
    try {
      const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/survey_settings/config`;
      console.log(`[Proxy] Fetching config from Firestore REST API: ${url}`);
      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 404 || response.status === 403) {
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
      const fields = data.fields || {};
      let fetchedGasUrl = fields.taetigkeitsberichtGasUrl?.stringValue || DEFAULT_GAS_URL;
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
    } catch (err) {
      console.error("[Server] Error fetching Firestore config:", err);
      res.status(500).json({ error: err.message || "Failed to fetch config" });
    }
  });
  app.post("/api/survey-settings/config", async (req, res) => {
    try {
      const { taetigkeitsberichtGasUrl, googleSpreadsheetUrl, adminPasscodeHash } = req.body;
      const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/survey_settings/config`;
      const fields = {
        updatedAt: { stringValue: (/* @__PURE__ */ new Date()).toISOString() }
      };
      let maskParams = ["updateMask.fieldPaths=updatedAt"];
      if (taetigkeitsberichtGasUrl !== void 0) {
        fields.taetigkeitsberichtGasUrl = { stringValue: taetigkeitsberichtGasUrl };
        maskParams.push("updateMask.fieldPaths=taetigkeitsberichtGasUrl");
      }
      if (googleSpreadsheetUrl !== void 0) {
        fields.googleSpreadsheetUrl = { stringValue: googleSpreadsheetUrl };
        maskParams.push("updateMask.fieldPaths=googleSpreadsheetUrl");
      }
      if (adminPasscodeHash !== void 0) {
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
    } catch (err) {
      console.error("[Server] Error updating Firestore config via REST:", err);
      res.status(500).json({ error: err.message || "Failed to save config" });
    }
  });
  app.post("/api/proxy-apps-script", async (req, res) => {
    const { url, payload } = req.body;
    if (!url) {
      return res.status(400).json({ error: "Missing Apps Script url" });
    }
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
          error: "Die konfigurierte Google Apps Script Web-App URL ist ung\xFCltig oder existiert nicht mehr (HTML 404 / Page Not Found). Bitte erstellen Sie eine neue Web-App Bereitstellung in Google Apps Script und hinterlegen Sie die URL in den Einstellungen."
        });
      }
      res.status(200).json({ status: "success", response: responseText.slice(0, 200) });
    } catch (err) {
      console.error("[Proxy] Error forwarding request:", err);
      res.status(500).json({ error: err.message });
    }
  });
  let aiClient = null;
  function getGeminiClient() {
    if (!aiClient && process.env.GEMINI_API_KEY) {
      try {
        aiClient = new import_genai.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      } catch (err) {
        console.error("[Gemini] Initialization error:", err);
      }
    }
    return aiClient;
  }
  app.get("/api/social-monitor/feed", (req, res) => {
    try {
      const publicPath = import_path.default.join(process.cwd(), "public", "data", "social_posts.json");
      const srcPath = import_path.default.join(process.cwd(), "src", "data", "social_posts.json");
      let data = null;
      if (import_fs.default.existsSync(publicPath)) {
        data = JSON.parse(import_fs.default.readFileSync(publicPath, "utf-8"));
      } else if (import_fs.default.existsSync(srcPath)) {
        data = JSON.parse(import_fs.default.readFileSync(srcPath, "utf-8"));
      }
      if (!data) {
        return res.status(404).json({ error: "Social posts data not found." });
      }
      res.set("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
      res.status(200).json(data);
    } catch (err) {
      console.error("[Server] Error reading social posts feed:", err);
      res.status(500).json({ error: "Failed to read social feed data." });
    }
  });
  app.get("/api/social-monitor/config", (req, res) => {
    try {
      const configPath = import_path.default.join(process.cwd(), "src", "data", "social_monitor_config.json");
      if (import_fs.default.existsSync(configPath)) {
        const config = JSON.parse(import_fs.default.readFileSync(configPath, "utf-8"));
        return res.status(200).json(config);
      }
      res.status(404).json({ error: "Config not found." });
    } catch (err) {
      res.status(500).json({ error: "Failed to read config." });
    }
  });
  app.post("/api/social-monitor/translate", async (req, res) => {
    const { text, targetLang = "de" } = req.body;
    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Missing or invalid 'text' field." });
    }
    const ai = getGeminiClient();
    if (!ai) {
      return res.status(200).json({
        translatedText: null,
        fallback: true,
        message: "Gemini API-Schl\xFCssel nicht auf dem Server hinterlegt. Bitte nutzen Sie die hinterlegte redaktionelle \xDCbersetzung oder konfigurieren Sie GEMINI_API_KEY."
      });
    }
    try {
      const prompt = `Du bist ein professioneller juristischer und menschenrechtlicher Fach\xFCbersetzer. \xDCbersetze den folgenden Social-Media-Beitrag (in der Regel auf T\xFCrkisch) pr\xE4zise, sachlich, neutral und respektvoll ins Deutsche. 
Wichtige Konventionen:
- Behalte Namen von Personen unver\xE4ndert bei.
- \xDCbersetze rechtliche Fachbegriffe verst\xE4ndlich und nenne ggf. das deutsche \xC4quivalent (z. B. A\u0130HM = EGMR, AYM = Verfassungsgericht, KHK = Notstandsdekret, Adli T\u0131p = Gerichtsmedizin).
- Behalte Twitter-/Instagram-Hashtags und Erw\xE4hnungen sinngem\xE4\xDF oder im Original bei.
- Gib ausschlie\xDFlich den \xFCbersetzten deutschen Text aus, ohne Metakommentare, Anf\xFChrungszeichen oder Erkl\xE4rungen.

Zu \xFCbersetzender Text:
${text}`;
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
      });
      const translatedText = response.text ? response.text.trim() : null;
      return res.status(200).json({
        translatedText,
        sourceLanguage: "tr",
        targetLanguage: targetLang,
        provider: "gemini-2.5-flash"
      });
    } catch (err) {
      console.error("[Gemini Translate] Error:", err);
      return res.status(500).json({
        error: "Fehler bei der automatischen \xDCbersetzung.",
        details: err?.message
      });
    }
  });
  app.use(import_express.default.static(import_path.default.join(process.cwd(), "public")));
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.use((req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
