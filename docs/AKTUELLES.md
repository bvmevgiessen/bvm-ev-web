# Aktuelles – Architektur & Erweiterung

Neue Seite `/aktuelles` (verlinkt in Header & Footer, erstes Element auf der Startseite).
Bündelt drei Bereiche mit 3D-Karten und „Letzte Aktualisierung" je Bereich.

## Datenfluss

```
scripts/aktuelles_seed.json (News) ┐
src/data/events.json (Events)      ├─► scripts/build_aktuelles_feeds.py ─► public/data/aktuelles_feeds.json ─► Frontend (fetch)
src/data/blogs.json  (Blogs)       ┘        (+ Kopie nach src/data/aktuelles_feeds.json als Build-Fallback)
```

- **News**: kuratiert in `scripts/aktuelles_seed.json` (Rückblick + Vorschau; erste News = Treffen mit CDU-Abg. Michelle Kraft inkl. Highlights, Sprechtext & Delegation).
- **Events**: aus `events.json`, Zeitfenster ±31 Tage (Fallback: zeitnächste 8).
- **Blogs**: aus `blogs.json`, Zeitfenster letzte 31 Tage (Fallback: neueste 8).
- Dedupe, Sortierung nach Datum (neueste zuerst), `lastUpdated` je Bereich.

## Aktualisierung (monatlich)

Workflow: `.github/workflows/aktuelles-feeds-monthly.yml` (Cron am 1. des Monats).
Lokal:
```bash
python scripts/build_aktuelles_feeds.py                 # alles
python scripts/build_aktuelles_feeds.py --sections events blogs
```
Der Workflow committet die JSON; `deploy.yml` veröffentlicht auf GitHub Pages.

## Erweitern

- **Neue Vereins-News**: Eintrag in `scripts/aktuelles_seed.json` → `--sections news` ausführen.
  Felder: `category` (`Rückblick` | `Vorschau` | …), `date`, `title`, `image`, `location`,
  `shortText`, `highlights[]`, `speech`, `persons[{name, role}]`.
- **Zeitfenster ändern**: `WINDOW_DAYS` / `MAX_ITEMS` in `scripts/build_aktuelles_feeds.py`.
- **3D-Karten**: `src/components/aktuelles/Card3D.tsx` (Pointer-Tilt, respektiert
  `prefers-reduced-motion`).

## Dateien

| Datei | Zweck |
|-------|-------|
| `src/pages/AktuellesPage.tsx` | Seite: Hero (3D-Karten), News (Modal), Events, Blog-3D-Slider |
| `src/components/AktuellesTeaser.tsx` | Startseiten-Teaser (erstes Element) |
| `src/components/aktuelles/Card3D.tsx` | 3D-Tilt-Karte |
| `src/data/aktuelles.ts` | Typen, `useAktuelles`-Hook, URL, Datum-Helper |
| `src/data/aktuelles_feeds.json` | Build-Fallback (Kopie der öffentlichen Datei) |
| `public/data/aktuelles_feeds.json` | Zur Laufzeit geladene, monatlich aktualisierte Feeds |
| `scripts/build_aktuelles_feeds.py` | Feed-Builder (News + Events + Blogs → JSON) |
| `scripts/aktuelles_seed.json` | Kuratierte Vereins-News |
| `.github/workflows/aktuelles-feeds-monthly.yml` | Monatlicher Update-Workflow |
