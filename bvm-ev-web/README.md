<div align="center">
  <img src="public/bvm-logo.png" alt="Bildung und Verständigung Mittelhessen e.V." width="420" />

  <h1>bvm-ev.de</h1>
  <p>
    Offizielle Website von <strong>Bildung und Verständigung Mittelhessen e.V.</strong> –
    einer Plattform für Integration, Dialog, Community und Jugend in der
    Mittelhessen-Region.
  </p>

  <p>
    <a href="https://bvm-ev.de">🌐 bvm-ev.de</a>
  </p>
</div>

---

## ✨ Was ist drin?

- **Statisches Frontend** (React 19 + Vite + Tailwind v4), gehostet auf GitHub Pages
- **Latest Updates** – die Blog-Seite aggregiert täglich automatisch RSS-Feeds
  unserer Partnerorganisationen (Stiftung Dialog und Bildung, FID, BDDI,
  Time to Help, AFSV, JWF, House of One)
- **Keyword-basierte Kategorisierung** in *Integration · Dialog · Community · Jugend*
- **German-only Filter** über `langdetect` – nicht-deutsche Posts werden
  automatisch übersprungen

## 🗂️ Projekt-Struktur

```
.
├── .github/workflows/
│   ├── deploy.yml          # Build & Deploy bei jedem Push auf main
│   └── update-feeds.yml    # Täglicher Cron: Feeds holen + commit + deploy
├── scripts/
│   ├── fetch_feeds.py      # RSS-Parser + Headless-Scraper (Playwright)
│   └── requirements.txt
├── public/                 # Favicons, Logo, Manifest
└── src/
    ├── components/         # React-Komponenten (Hero, Blog, Footer …)
    ├── pages/              # Routen (Home, Blog, Events, Dialog …)
    └── data/
        ├── events.json
        └── latest_updates.json   # ← wird vom Cron-Workflow aktualisiert
```

## 🚀 Lokal entwickeln

**Voraussetzungen:** Node.js 20+ und (optional) Python 3.11 für den Feed-Updater.

```bash
# 1. Dependencies installieren
npm install

# 2. Dev-Server starten
npm run dev          # → http://localhost:3000

# 3. Optional: Feeds frisch ziehen
pip install -r scripts/requirements.txt
python -m playwright install --with-deps chromium   # nur für House of One
python scripts/fetch_feeds.py
```

## 🏗️ Build & Deployment

GitHub Pages serviert den Custom-Domain-Build automatisch.

| Trigger | Workflow | Was passiert |
| --- | --- | --- |
| Push auf `main` | `deploy.yml` | Vite-Build → Upload zu GitHub Pages |
| Täglich 05:00 UTC | `update-feeds.yml` | Feeds aktualisieren → commit → re-build → deploy |
| Manuell | `update-feeds.yml` | Über *Actions → Run workflow* sofort anstoßen |

> **Hinweis:** Damit der Cron-Workflow committen darf, muss unter
> *Settings → Actions → General → Workflow permissions* die Option
> **„Read and write permissions"** aktiv sein.

## 🤝 Partner-Feeds

| Quelle | Typ | Default-Kategorie* |
| --- | --- | --- |
| [sdub.de](https://sdub.de) | RSS | Dialog |
| [fidev.org](https://www.fidev.org) | RSS (Wix) | Dialog |
| [bddi.org](https://bddi.org) | RSS | Dialog |
| [timetohelp.eu](https://timetohelp.eu) | RSS *(DE-Filter)* | Community |
| [afsv.org](https://afsv.org) | RSS *(DE-Filter)* | Community |
| [jwf.org](https://jwf.org) | RSS *(DE-Filter)* | Community |
| [house-of-one.org](https://house-of-one.org) | HTML-Scrape (Playwright) | Dialog |

\* Die tatsächliche Kategorie wird per Keyword-Scoring aus Titel und Excerpt bestimmt.

## 📄 Lizenz

© Bildung und Verständigung Mittelhessen e.V. – Inhalt unter Vorbehalt aller Rechte.
