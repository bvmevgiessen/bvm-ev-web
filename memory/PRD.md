# JusticeSquare – PRD

## Original Problem Statement
Modern, seriöse, interaktive Sonderseite „JusticeSquare" für die Vereins-Website (BVM e.V.).
Ziel: faktenbasierte, journalistisch saubere Dokumentation von Menschenrechtsverletzungen gegen
die Gülen-Bewegung. Vier Hauptbereiche: NEWS, REPORTS, INFOGRAFIKEN, MULTIMEDIA + nützliche Links.

## Architecture / Tech Stack
- Existing site: Vite + React 19 + TypeScript + Tailwind v4 + Firebase, served via Express (`server.ts`) on port 3000, deployed to GitHub Pages.
- JusticeSquare is a **frontend-only** feature (no FastAPI/MongoDB used). Content is curated/static.
- Route: `/justicesquare` (registered in `src/App.tsx`), nav link in `src/components/Navbar.tsx`.

## User Choices (2026-06)
- Content: redaktionell kuratierte Beispiel-Zusammenfassungen (statisch).
- Infografiken: interaktive Diagramme (Hover-Tooltips).
- Umfang: dynamisch wirkend, jedoch statische kuratierte Daten (kein Backend nötig).
- Design: Blau/Anthrazit/Weiß, seriös; integriert mit bestehender BVM-Navbar/Footer.
- Sprache: Deutsch.

## Implemented (2026-06)
- `src/data/justiceSquare.ts` — kuratierte Daten: 8 News, 6 Reports, 5 Infografik-Datensätze, 6 Multimedia, 10 nützliche Links, Hero-Stats. Enthält reales EGMR-Grundsatzurteil (Yalçınkaya v. Türkiye 2023).
- `src/components/justicesquare/InteractiveChart.tsx` — abhängigkeitsfreies SVG-Diagramm (Bar/Line) mit Hover-Tooltip.
- `src/pages/JusticeSquarePage.tsx` — Hero, NEWS (Filter), REPORTS (Institutionsfilter), INFOGRAFIKEN (Dataset-Tabs), MULTIMEDIA (Typfilter), Nützliche Links, redaktionelle Leitlinie. Scroll-Animationen (motion), responsive, data-testids.
- Merriweather-Serif-Font-Token in `src/index.css`.
- Tested: testing agent iteration_1 → 37/37 UI assertions passed, keine Bugs.

## Notes
- App wird via `yarn dev` (tsx server.ts) auf Port 3000 ausgeführt (Supervisor-Config passt nicht zu diesem Repo-Layout).
- Infografik-Zahlen sind aggregierte, illustrative Richtwerte (in der Leitlinie transparent gemacht).

## Backlog / Next
- P1: JusticeSquare in Footer verlinken; Home-Teaser-Sektion.
- P1: Admin-Pflege der Inhalte (falls gewünscht) statt statischer Datei.
- P2: YouTube-Einbettung im Modal (erfordert CSP frameSrc-Anpassung in server.ts).
- P2: PDF-/Teilen-Export einzelner Berichte.
