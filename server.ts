import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Use body parsers
  app.use(express.json({ limit: '50mb' })); // support large file payloads for report uploads
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // API proxy route for Google Apps Script to bypass browser Content Security Policy
  app.post("/api/proxy-apps-script", async (req, res) => {
    const { url, payload } = req.body;
    if (!url) {
      return res.status(400).json({ error: "Missing Apps Script url" });
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
