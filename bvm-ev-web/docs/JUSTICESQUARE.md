# JusticeSquare – Architektur & Erweiterung

Sonderseite `/justicesquare` der BVM-Website. Vier Bereiche: **Aktuelle News**,
**Berichte & Analysen**, **Interaktive Infografiken & Statistiken**, **Multimedia**.

## Datenfluss (automatisiert)

```
RSS-Feeds ─┐
           ├─► scripts/fetch_justice_feeds.py ─► public/data/justice_feeds.json ─► Frontend (fetch)
Seed-Daten ┘        (+ Kopie nach src/data/justice_feeds.json als Build-Fallback)
```

- **News**: aus RSS-Feeds der Exil- und internationalen Medien, streng nach
  Gülen/Hizmet-Identitäts-Schlüsselwörtern gefiltert (nur direkte Relevanz),
  dedupliziert (Titel + Link), nach Datum sortiert. Links zeigen exakt auf den
  Artikel.
- **Reports / Infografiken / Multimedia**: kuratiert in
  `scripts/justice_seed.json` (redaktionell gepflegt, keine zuverlässigen Feeds).
- Jede Sektion hat eine „Letzte Aktualisierung"-Anzeige (`lastUpdated`).

## Aktualisierung

| Bereich      | Rhythmus     | Workflow                                   | Befehl                                              |
|--------------|--------------|--------------------------------------------|-----------------------------------------------------|
| News         | wöchentlich  | `.github/workflows/justice-feeds-news.yml` | `python scripts/fetch_justice_feeds.py --sections news` |
| Reports      | monatlich    | `.github/workflows/justice-feeds-monthly.yml` | `python scripts/fetch_justice_feeds.py --sections monthly` |
| Infografiken | monatlich    | (siehe monthly)                            | (siehe monthly)                                     |
| Multimedia   | monatlich    | (siehe monthly)                            | (siehe monthly)                                     |

Die Workflows committen die aktualisierte JSON; `deploy.yml` baut & veröffentlicht
die Seite auf GitHub Pages beim Push auf `main`.

Lokal ausführen:
```bash
pip install feedparser beautifulsoup4 lxml
python scripts/fetch_justice_feeds.py --sections all
```

## Erweitern

- **Neue News-Quelle**: Eintrag in `NEWS_SOURCES` in `scripts/fetch_justice_feeds.py`
  (`id`, `feed` = RSS-URL, `name`, `url`, `kind` = `exil` | `international`).
- **Relevanzfilter anpassen**: `IDENTITY_KEYWORDS` (mindestens eines muss
  vorkommen). `COURT_KEYWORDS` steuert die Einordnung als „Gerichtsurteil".
- **Report/Infografik/Multimedia hinzufügen**: `scripts/justice_seed.json` bearbeiten,
  danach `--sections monthly` ausführen.
- **Diagrammtypen**: `bar` oder `line` im Infografik-Datensatz
  (`type`), gerendert von `src/components/justicesquare/InteractiveChart.tsx`.

## Dateien

| Datei | Zweck |
|-------|-------|
| `src/pages/JusticeSquarePage.tsx` | Seite, lädt Feeds zur Laufzeit (Fallback: Build-Import) |
| `src/components/justicesquare/InteractiveChart.tsx` | Abhängigkeitsfreies SVG-Diagramm mit Hover-Tooltip |
| `src/data/justiceSquare.ts` | Typen, statische Links/Hero-Stats, Feed-Fallback |
| `src/data/justice_feeds.json` | Build-Fallback (Kopie der öffentlichen Datei) |
| `public/data/justice_feeds.json` | Zur Laufzeit geladene, automatisiert aktualisierte Feeds |
| `scripts/fetch_justice_feeds.py` | Feed-Fetcher (RSS + Seed → JSON) |
| `scripts/justice_seed.json` | Kuratierte Reports/Infografiken/Multimedia |

## Editoriale Standards
Neutral, faktenbasiert, menschenrechtsorientiert. Keine politischen Parolen.
Keine Volltexte (Copyright) – nur Kurz-Zusammenfassungen. Quellen immer sichtbar.
Fokus auf Menschenrechtsverletzungen gegen die Gülen-/Hizmet-Bewegung.
