import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import fs from "fs";

async function startServer() {
  const app = express();
  const PORT = 3000;

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

  // API endpoint to fetch survey settings config via server-side REST call
  // This bypasses any client-side Firestore/iframe restriction completely.
  app.get("/api/survey-settings/config", async (req, res) => {
    try {
      const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/survey_settings/config`;
      console.log(`[Proxy] Fetching config from Firestore REST API: ${url}`);
      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 404) {
          // Document does not exist yet, return a structured empty state instead of crashing
          return res.status(200).json({
            taetigkeitsberichtGasUrl: "",
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
      const config = {
        taetigkeitsberichtGasUrl: fields.taetigkeitsberichtGasUrl?.stringValue || "",
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

  // API proxy route for Google Apps Script to bypass browser Content Security Policy
  app.post("/api/proxy-apps-script", async (req, res) => {
    const { url, payload } = req.body;
    if (!url) {
      return res.status(400).json({ error: "Missing Apps Script url" });
    }

    let safeUrl: string;

    // SSRF Prevention: Restrict forwarded requests strictly to verified Google Apps Script endpoints
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.protocol !== "https:") {
        return res.status(400).json({ error: "Invalid protocol. Only HTTPS is allowed." });
      }
      if (parsedUrl.hostname !== "script.google.com") {
        return res.status(400).json({ error: "Invalid target host. Only script.google.com is allowed." });
      }
      if (!/^\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(parsedUrl.pathname)) {
        return res.status(400).json({ error: "Invalid Apps Script path structure." });
      }

      // Build a canonical trusted URL from validated components (do not use raw user input at sink).
      const canonicalUrl = new URL(`https://script.google.com${parsedUrl.pathname}`);
      canonicalUrl.search = parsedUrl.search;
      safeUrl = canonicalUrl.toString();
    } catch (e) {
      return res.status(400).json({ error: "Malformed URL provided." });
    }

    try {
      console.log(`[Proxy] Forwarding request to Google Apps Script: ${safeUrl.slice(0, 50)}...`);
      const response = await fetch(safeUrl, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(payload)
      });
      
      // Resolve response. Since Apps Script redirects, native fetch on node follows redirects automatically.
      // We return a simple success indicator.
      res.status(200).json({ status: "success" });
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
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
