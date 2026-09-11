"""
JusticeSquare Feed-System.

Holt aktuelle Nachrichten über Menschenrechtsverletzungen gegen die
Gülen-/Hizmet-Bewegung aus RSS-Feeds von Exil- und internationalen Medien,
filtert strikt nach direkter Relevanz, dedupliziert, sortiert nach Datum und
schreibt zusammen mit kuratierten Berichten, Infografiken und Multimedia-Karten
eine einzige Datei: `public/data/justice_feeds.json`.

Redaktionelle Leitlinie:
  * Nur Kurz-Zusammenfassungen, keine Volltexte (Copyright).
  * Nur Inhalte mit direktem Bezug zu Gülen/Hizmet-Menschenrechtsfragen.
  * Quelle + exakter Artikel-/Urteil-Link immer erhalten.

Nutzung:
    pip install -r scripts/requirements.txt
    python scripts/fetch_justice_feeds.py --sections news     # wöchentlich
    python scripts/fetch_justice_feeds.py --sections monthly  # monatlich
    python scripts/fetch_justice_feeds.py --sections all      # alles (Default)
"""

from __future__ import annotations

import argparse
import html as html_module
import json
import re
import sys
import unicodedata
from datetime import datetime, timezone
from pathlib import Path

import feedparser
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parent.parent
SEED_PATH = Path(__file__).resolve().parent / "justice_seed.json"
OUTPUT_PATH = ROOT / "public" / "data" / "justice_feeds.json"

MAX_PER_SOURCE = 8
MAX_NEWS_TOTAL = 48

# ---------------------------------------------------------------------------
# News-Quellen (RSS)
# ---------------------------------------------------------------------------
NEWS_SOURCES = [
    # --- Exil-Medien (verpflichtend) ---
    {"id": "stockholmcf", "feed": "https://stockholmcf.org/feed/",
     "name": "Stockholm Center for Freedom", "url": "https://stockholmcf.org/news/", "kind": "exil"},
    {"id": "ija", "feed": "https://internationaljournalists.org/feed/",
     "name": "International Journalists (IJA)", "url": "https://internationaljournalists.org/de/nachrichten/", "kind": "exil"},
    {"id": "tr724", "feed": "https://www.tr724.com/feed/",
     "name": "TR724", "url": "https://www.tr724.com/", "kind": "exil"},
    {"id": "boldmedya", "feed": "https://boldmedya.com/feed/",
     "name": "Bold Medya", "url": "https://boldmedya.com/", "kind": "exil"},
    {"id": "zamanamerika", "feed": "https://zamanamerika.com/feed/",
     "name": "Zaman Amerika", "url": "https://zamanamerika.com/", "kind": "exil"},
    {"id": "zamanaustralia", "feed": "https://zamanaustralia.com/feed/",
     "name": "Zaman Australia", "url": "https://zamanaustralia.com/", "kind": "exil"},
    {"id": "turkishminute", "feed": "https://turkishminute.com/feed/",
     "name": "Turkish Minute", "url": "https://turkishminute.com/", "kind": "exil"},
    # --- Internationale Medien (Themen-/Länder-Feeds, streng gefiltert) ---
    {"id": "guardian", "feed": "https://www.theguardian.com/world/turkey/rss",
     "name": "The Guardian", "url": "https://www.theguardian.com/world/turkey", "kind": "international"},
    {"id": "bbc", "feed": "https://feeds.bbci.co.uk/news/world-europe/rss.xml",
     "name": "BBC News", "url": "https://www.bbc.com/news/world/europe", "kind": "international"},
    {"id": "aljazeera", "feed": "https://www.aljazeera.com/xml/rss/all.xml",
     "name": "Al Jazeera", "url": "https://www.aljazeera.com/", "kind": "international"},
    {"id": "dw", "feed": "https://rss.dw.com/rdf/rss-en-all",
     "name": "Deutsche Welle", "url": "https://www.dw.com/en/top-stories/s-9097", "kind": "international"},
]

# Identitäts-Schlüsselwörter: mindestens EINES muss vorkommen -> garantiert direkten Bezug.
IDENTITY_KEYWORDS = (
    "gulen", "gülen", "gulenist", "gülenist", "hizmet", "bylock", "by lock",
    "feto", "fetö", "fethullah", "gulen movement", "hizmet movement",
    "gülen-bewegung", "hizmet-bewegung",
)

# Zusätzliche Menschenrechts-/Kontext-Begriffe (nicht allein ausreichend, aber unterstützend).
CONTEXT_KEYWORDS = (
    "khk", "decree", "dekret", "purge", "purged", "torture", "folter",
    "arrest", "festnahme", "detention", "haft", "abduction", "enforced disappearance",
    "verschwinden", "prison", "gefängnis", "trial", "prozess", "acquit", "freispruch",
    "human rights", "menschenrechte", "asylum", "asyl", "refugee", "flüchtling",
)

# Begriffe, die eine News als Gerichtsurteil kennzeichnen.
COURT_KEYWORDS = (
    "echr", "ecthr", "egmr", "european court of human rights", "strasbourg",
    "constitutional court", "supreme court", "court rules", "court ruling",
    "verdict", "acquit", "gericht", "urteil", "verfassungsgericht", "cassation",
)


def _norm(text: str) -> str:
    text = text.lower()
    text = unicodedata.normalize("NFKD", text)
    return "".join(c for c in text if not unicodedata.combining(c))


def _strip_html(raw: str) -> str:
    if not raw:
        return ""
    text = BeautifulSoup(raw, "html.parser").get_text(separator=" ")
    return re.sub(r"\s+", " ", html_module.unescape(text)).strip()


def _summary(entry: dict, length: int = 340) -> str:
    raw = ""
    if entry.get("summary"):
        raw = entry["summary"]
    elif entry.get("description"):
        raw = entry["description"]
    elif entry.get("content"):
        content = entry["content"]
        if isinstance(content, list) and content:
            raw = content[0].get("value", "")
    text = _strip_html(raw)
    if len(text) > length:
        cut = text[:length]
        # an Satzgrenze kürzen
        dot = cut.rfind(". ")
        text = (cut[: dot + 1] if dot > 120 else cut.rstrip()) + " …"
    return text


def _date(entry: dict) -> str:
    for key in ("published_parsed", "updated_parsed", "created_parsed"):
        struct = entry.get(key)
        if struct:
            try:
                return datetime(*struct[:6], tzinfo=timezone.utc).isoformat()
            except (TypeError, ValueError):
                continue
    return datetime.now(timezone.utc).isoformat()


def _is_relevant(title: str, summary: str) -> bool:
    hay = _norm(f"{title} {summary}")
    return any(_norm(k) in hay for k in IDENTITY_KEYWORDS)


def _categorize(source: dict, title: str, summary: str) -> str:
    hay = _norm(f"{title} {summary}")
    if any(_norm(k) in hay for k in COURT_KEYWORDS):
        return "Gerichtsurteil"
    return "Exil-Medien" if source["kind"] == "exil" else "Internationale Medien"


def fetch_news() -> list[dict]:
    items: list[dict] = []
    for src in NEWS_SOURCES:
        print(f"-> {src['id']}: {src['feed']}", flush=True)
        try:
            parsed = feedparser.parse(src["feed"], agent="justicesquare feed bot/1.0")
        except Exception as exc:  # noqa: BLE001
            print(f"   !! {src['id']} error: {exc}", file=sys.stderr)
            continue
        count = 0
        for entry in parsed.entries:
            title = _strip_html(entry.get("title", "")).strip()
            link = (entry.get("link") or "").strip()
            if not title or not link or len(title) < 10:
                continue
            summary = _summary(entry)
            if not _is_relevant(title, summary):
                continue
            items.append({
                "id": f"{src['id']}-{abs(hash((title, link))) % (10**10)}",
                "title": title,
                "date": _date(entry),
                "source": src["name"],
                "category": _categorize(src, title, summary),
                "summary": summary or title,
                "url": link,
            })
            count += 1
            if count >= MAX_PER_SOURCE:
                break
        print(f"   <- {count} relevante Beiträge", flush=True)
    return items


def _dedupe(items: list[dict]) -> list[dict]:
    seen: set[tuple] = set()
    out: list[dict] = []
    for it in items:
        key = (_norm(it["title"])[:80], it["url"].split("?")[0].rstrip("/"))
        if key in seen:
            continue
        seen.add(key)
        out.append(it)
    return out


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--sections", choices=["news", "monthly", "all"], default="all")
    args = ap.parse_args()

    seed = json.loads(SEED_PATH.read_text(encoding="utf-8"))
    now = datetime.now(timezone.utc).isoformat()

    existing = {}
    if OUTPUT_PATH.exists():
        try:
            existing = json.loads(OUTPUT_PATH.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            existing = {}

    out = {
        "generatedAt": now,
        "lastUpdated": dict(existing.get("lastUpdated") or {}),
        "news": existing.get("news") or [],
        "reports": existing.get("reports") or seed["reports"],
        "infographics": existing.get("infographics") or seed["infographics"],
        "multimedia": existing.get("multimedia") or seed["multimedia"],
    }

    refresh_news = args.sections in ("news", "all")
    refresh_monthly = args.sections in ("monthly", "all")

    if refresh_news:
        fetched = fetch_news()
        merged = _dedupe(fetched + seed.get("news_fallback", []))
        merged.sort(key=lambda x: x["date"], reverse=True)
        out["news"] = merged[:MAX_NEWS_TOTAL]
        out["lastUpdated"]["news"] = now
        print(f"\nNews gesamt: {len(out['news'])}", flush=True)

    if refresh_monthly:
        out["reports"] = seed["reports"]
        out["infographics"] = seed["infographics"]
        out["multimedia"] = seed["multimedia"]
        out["lastUpdated"]["reports"] = now
        out["lastUpdated"]["infographics"] = now
        out["lastUpdated"]["multimedia"] = now

    # Fallbacks für lastUpdated
    for k in ("news", "reports", "infographics", "multimedia"):
        out["lastUpdated"].setdefault(k, now)

    # Falls News noch leer sind (z. B. Netzwerkfehler), Fallback verwenden.
    if not out["news"]:
        out["news"] = _dedupe(seed.get("news_fallback", []))

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(
        json.dumps(out, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(f"Geschrieben: {OUTPUT_PATH.relative_to(ROOT)}", flush=True)
    print(f"  news={len(out['news'])} reports={len(out['reports'])} "
          f"infographics={len(out['infographics'])} multimedia={len(out['multimedia'])}", flush=True)
    return 0


if __name__ == "__main__":
    sys.exit(main())
