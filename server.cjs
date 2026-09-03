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
  app.use(limiter);
  const isDev = process.env.NODE_ENV !== "production";
  app.use(
    (0, import_helmet.default)({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          baseUri: ["'self'"],
          objectSrc: ["'none'"],
          frameAncestors: isDev ? ["*"] : ["'self'"],
          frameSrc: ["'self'", "https://*.jotform.com"],
          formAction: ["'self'", "https://*.jotform.com", "https://formspree.io"],
          scriptSrc: ["'self'", "'unsafe-inline'", "https://*.jotform.com"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'", "https://formspree.io", "https://*.jotform.com"]
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
        if (response.status === 404) {
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
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
