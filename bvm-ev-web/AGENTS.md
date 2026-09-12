# Base44 Dev Environment

## What this app is
A single-origin React 19 + Vite 8 + Tailwind v4 website for **Bildung und Verständigung Mittelhessen e.V.** (bvm-ev.de). An Express server (`server.ts`) runs on port 3000 in Vite middleware mode, serving both the SPA and a few API proxy endpoints (Firestore REST, Google Apps Script proxy).

## How it runs here
- `docker compose -f docker-compose.base44.yml up -d` — single `web` service on `node:22-slim`, source bind-mounted at `/app`, deps installed at startup, dev command `npm run dev` (= `tsx server.ts`).
- Live reload via Vite middleware + `CHOKIDAR_USEPOLLING=true` (bind mounts need polling).
- Preview entry: host port 3000 → `https://3000-${BASE44_PUBLIC_HOST_SUFFIX}`.
- `vite.config.ts` sets `server.host: true` and `allowedHosts: true` so the preview's external hostname is accepted.

## Dependencies / quirks
- `express-rate-limit` is imported by `server.ts` but was missing from `package.json` — it was added. If `npm install` ever drops it, the server crashes with `ERR_MODULE_NOT_FOUND`.
- Firebase config has built-in defaults + a placeholder API key, so the app **boots and renders without any secrets**. Firestore/auth-dependent features (survey settings, admin) only work with real `VITE_FIREBASE_*` credentials.
- `server.ts` reads `firebase-applet-config.json` for the Firestore project ID (falls back to `composite-advice-ljcsn`). The client uses defaults from `src/lib/firebase.ts`.
- Secrets are delivered to `/run/base44/app.env` (outside the repo) and loaded as the last `env_file:` in compose; `.env.base44-defaults` holds harmless placeholders so the app boots before credentials exist.

## Verify it works
- `curl -sf http://localhost:3000/` returns the Vite-served HTML (contains `@react-refresh`).
- `curl -sf -H "Host: external-preview.example.com" http://localhost:3000/src/main.tsx` returns 200 (host check).
- `curl -sf http://localhost:3000/api/survey-settings/config` returns JSON.

## Optional secrets (not required to boot)
- `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_APP_ID` — Firebase console → Project settings.
- `GEMINI_API_KEY` — Google AI Studio (only if Gemini features are used).
