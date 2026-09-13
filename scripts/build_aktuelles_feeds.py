"""
Aktuelles Feed-System.

Bündelt drei Quellen zu einer Datei `public/data/aktuelles_feeds.json`:
  * NEWS   – kuratierte Vereins-News aus `scripts/aktuelles_seed.json`
  * EVENTS – aus `src/data/events.json` (aktuell, innerhalb ~1 Monat)
  * BLOGS  – aus `src/data/blogs.json`  (aktuell, innerhalb ~1 Monat)

Dedupliziert, sortiert nach Datum (neueste zuerst) und ergänzt
`lastUpdated` je Bereich. Fällt ein Zeitfenster leer aus, werden die
zeitnächsten Einträge als Fallback verwendet, damit keine Sektion leer ist.

Nutzung:
    python scripts/build_aktuelles_feeds.py            # alles
    python scripts/build_aktuelles_feeds.py --sections events blogs
"""

from __future__ import annotations

import argparse
import json
from datetime import datetime, timedelta, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
NEWS = ROOT / "src" / "data" / "news.json"
SEED = Path(__file__).resolve().parent / "aktuelles_seed.json"
EVENTS = ROOT / "src" / "data" / "events.json"
BLOGS = ROOT / "src" / "data" / "latest_updates.json"
OUTPUT = ROOT / "public" / "data" / "aktuelles_feeds.json"

WINDOW_DAYS = 31
MAX_ITEMS = 8


def parse_date(value: str) -> datetime:
    if not value:
        return datetime.now(timezone.utc)
    v = value.replace("Z", "+00:00")
    try:
        dt = datetime.fromisoformat(v)
    except ValueError:
        try:
            dt = datetime.strptime(value[:10], "%Y-%m-%d")
        except ValueError:
            dt = datetime.now(timezone.utc)
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt


def within_window(items, now):
    """Einträge strikt im Fenster [now - 31 Tage, now + 31 Tage] (1 Monat vor und nach heute)."""
    lo = now - timedelta(days=WINDOW_DAYS)
    hi = now + timedelta(days=WINDOW_DAYS)
    return [it for it in items if lo <= it["_dt"] <= hi]


def build_events(now):
    raw = json.loads(EVENTS.read_text(encoding="utf-8"))
    items = []
    for e in raw:
        dt = parse_date(e.get("date", ""))
        items.append({
            "_dt": dt,
            "id": e.get("id"),
            "title": e.get("title"),
            "date": e.get("date"),
            "location": e.get("location", ""),
            "category": e.get("category", "Event"),
            "image": e.get("image", ""),
            "description": (e.get("description") or "")[:220],
            "link": f"/events/{e.get('id')}",
        })
    # Nur bevorstehende/aktuelle Events ab heute (keine vergangenen Events als Rückblick)
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    upcoming = [it for it in items if it["_dt"] >= today_start]
    upcoming.sort(key=lambda it: it["_dt"])
    return [{k: v for k, v in it.items() if k != "_dt"} for it in upcoming[:MAX_ITEMS]]


def build_blogs(now):
    raw = json.loads(BLOGS.read_text(encoding="utf-8"))
    items = []
    for b in raw:
        dt = parse_date(b.get("date", ""))
        items.append({
            "_dt": dt,
            "id": b.get("id"),
            "title": b.get("title"),
            "date": b.get("date"),
            "author": b.get("author") or b.get("partnerName", ""),
            "partnerName": b.get("partnerName") or b.get("author", ""),
            "partnerUrl": b.get("partnerUrl", ""),
            "category": b.get("category", "Blog"),
            "image": b.get("image") or b.get("image_url", ""),
            "excerpt": b.get("excerpt", ""),
            "link": b.get("link", ""),
        })
    # Nur Blogs innerhalb von 1 Monat vor und nach heute
    sel = within_window(items, now)
    if len(sel) < 3:
        sel = sorted(items, key=lambda it: it["_dt"], reverse=True)[:MAX_ITEMS]
    else:
        sel.sort(key=lambda it: it["_dt"], reverse=True)
    return [{k: v for k, v in it.items() if k != "_dt"} for it in sel[:MAX_ITEMS]]


def build_news():
    if NEWS.exists():
        raw = json.loads(NEWS.read_text(encoding="utf-8"))
        news = raw if isinstance(raw, list) else raw.get("news", [])
    elif SEED.exists():
        seed = json.loads(SEED.read_text(encoding="utf-8"))
        news = seed.get("news", [])
    else:
        news = []
    # Bereinigung: News des Vereins sind echte Nachrichten (Kategorie 'News')
    for n in news:
        if n.get("category") in ("Rückblick", "Vorschau", None, ""):
            n["category"] = "News"
    news.sort(key=lambda n: parse_date(n.get("date", "")), reverse=True)
    return news


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--sections", nargs="+",
                    choices=["news", "events", "blogs"],
                    default=["news", "events", "blogs"])
    args = ap.parse_args()

    now = datetime.now(timezone.utc)
    iso = now.isoformat()

    existing = {}
    if OUTPUT.exists():
        try:
            existing = json.loads(OUTPUT.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            existing = {}

    out = {
        "generatedAt": iso,
        "lastUpdated": dict(existing.get("lastUpdated") or {}),
        "news": existing.get("news") or [],
        "events": existing.get("events") or [],
        "blogs": existing.get("blogs") or [],
    }

    if "news" in args.sections:
        out["news"] = build_news()
        out["lastUpdated"]["news"] = iso
    if "events" in args.sections:
        out["events"] = build_events(now)
        out["lastUpdated"]["events"] = iso
    if "blogs" in args.sections:
        out["blogs"] = build_blogs(now)
        out["lastUpdated"]["blogs"] = iso

    for k in ("news", "events", "blogs"):
        out["lastUpdated"].setdefault(k, iso)

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (ROOT / "src" / "data" / "aktuelles_feeds.json").write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    # Sync public/data json feeds for standalone consumption
    (ROOT / "public" / "data" / "news.json").write_text(json.dumps(out["news"], ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (ROOT / "public" / "data" / "events.json").write_text(EVENTS.read_text(encoding="utf-8"), encoding="utf-8")
    (ROOT / "public" / "data" / "blogs.json").write_text(BLOGS.read_text(encoding="utf-8"), encoding="utf-8")

    print(f"Geschrieben: {OUTPUT.relative_to(ROOT)}")
    print(f"  news={len(out['news'])} events={len(out['events'])} blogs={len(out['blogs'])}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
