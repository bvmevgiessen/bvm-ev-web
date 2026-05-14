"""
Fetches RSS feeds from BVM partner organizations and writes a normalized
`src/data/latest_updates.json` file consumed by the React frontend.

Sources are configured in SOURCES below. Each item is mapped to one of the
BVM categories: Integration, Dialog, Community, Jugend.

Run locally:
    pip install feedparser beautifulsoup4 lxml
    python scripts/fetch_feeds.py
"""

from __future__ import annotations

import hashlib
import html
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

import feedparser
from bs4 import BeautifulSoup

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

SOURCES = [
    {
        "id": "sdub",
        "feed": "https://sdub.de/feed/",
        "partner_name": "Stiftung Dialog und Bildung",
        "partner_url": "https://sdub.de/",
        "category": "Integration",
    },
    {
        "id": "fidev",
        # Wix-hosted site -> blog-feed.xml (NOT /feed/ which 404s)
        "feed": "https://www.fidev.org/blog-feed.xml",
        "partner_name": "Forum für Interkulturellen Dialog",
        "partner_url": "https://www.fidev.org/",
        "category": "Dialog",
    },
    {
        "id": "timetohelp",
        "feed": "https://timetohelp.eu/feed/",
        "partner_name": "Time to Help e.V.",
        "partner_url": "https://timetohelp.eu/",
        "category": "Community",
    },
    {
        "id": "ldk",
        "feed": "https://ldk-ev.de/feed/",
        "partner_name": "LDK e.V.",
        "partner_url": "https://ldk-ev.de/",
        "category": "Jugend",
    },
]

# Max items per source (keeps the JSON small + frontend snappy)
MAX_PER_SOURCE = 6
# Overall cap after merging + sorting
MAX_TOTAL = 24

# Fallback image per category (Unsplash, royalty free) if a post has none.
FALLBACK_IMAGES = {
    "Integration": "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=1200",
    "Dialog": "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200",
    "Community": "https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?auto=format&fit=crop&q=80&w=1200",
    "Jugend": "https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&q=80&w=1200",
}

OUTPUT_PATH = Path(__file__).resolve().parent.parent / "src" / "data" / "latest_updates.json"


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _strip_html(raw: str) -> str:
    """Return plain text from an HTML snippet, collapsed whitespace."""
    if not raw:
        return ""
    text = BeautifulSoup(raw, "html.parser").get_text(separator=" ")
    text = html.unescape(text)
    return re.sub(r"\s+", " ", text).strip()


def _extract_image(entry: dict) -> str | None:
    """Try several common RSS fields to find a representative image URL."""
    # 1. <media:content> or <media:thumbnail>
    for key in ("media_content", "media_thumbnail"):
        media = entry.get(key)
        if media and isinstance(media, list) and media[0].get("url"):
            return media[0]["url"]

    # 2. <enclosure> (Wix uses this)
    enclosures = entry.get("enclosures") or []
    for enc in enclosures:
        url = enc.get("href") or enc.get("url")
        if url and re.search(r"\.(jpg|jpeg|png|webp|gif)", url, re.I):
            return url
        if url and "image" in (enc.get("type") or ""):
            return url

    # 3. First <img> inside content:encoded or summary
    for field in ("content", "summary", "description"):
        value = entry.get(field)
        if isinstance(value, list) and value:
            value = value[0].get("value", "")
        if isinstance(value, str) and "<img" in value:
            soup = BeautifulSoup(value, "html.parser")
            img = soup.find("img")
            if img and img.get("src"):
                return img["src"]
    return None


def _excerpt(entry: dict, length: int = 200) -> str:
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
        text = text[: length - 1].rstrip() + "…"
    return text


def _parse_date(entry: dict) -> str:
    """Return ISO-8601 string (UTC) or now() as fallback."""
    for key in ("published_parsed", "updated_parsed", "created_parsed"):
        struct = entry.get(key)
        if struct:
            try:
                dt = datetime(*struct[:6], tzinfo=timezone.utc)
                return dt.isoformat()
            except (TypeError, ValueError):
                continue
    return datetime.now(timezone.utc).isoformat()


def _tags(entry: dict, category: str) -> list[str]:
    """Pick up to 2 short, human-friendly tags. Always include the BVM category."""
    tags: list[str] = [category]
    skip_lower = {
        category.lower(),
        "aktuelles", "uncategorized", "allgemein", "unkategorisiert",
        "news", "blog", "post", "presseschau", "veranstaltungshinweise",
    }
    raw = entry.get("tags") or []
    for t in raw:
        name = (t.get("term") or "").strip()
        if not name or len(name) > 24 or name.lower() in skip_lower:
            continue
        tags.append(name)
        if len(tags) >= 3:
            break
    # Dedupe while preserving order
    seen, deduped = set(), []
    for t in tags:
        if t.lower() not in seen:
            seen.add(t.lower())
            deduped.append(t)
    return deduped


def _stable_id(prefix: str, entry: dict) -> str:
    """Deterministic ID so the same post keeps the same id between runs."""
    seed = entry.get("id") or entry.get("guid") or entry.get("link") or entry.get("title", "")
    digest = hashlib.sha1(seed.encode("utf-8", errors="ignore")).hexdigest()[:10]
    return f"{prefix}-{digest}"


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def fetch_source(source: dict) -> list[dict]:
    print(f"-> Fetching {source['feed']}", flush=True)
    parsed = feedparser.parse(source["feed"], agent="bvm-ev.de feed bot/1.0")

    if parsed.bozo and not parsed.entries:
        print(f"   !! parse error: {parsed.bozo_exception}", file=sys.stderr)
        return []

    items: list[dict] = []
    for entry in parsed.entries[:MAX_PER_SOURCE]:
        title = _strip_html(entry.get("title", "")).strip()
        link = entry.get("link") or ""
        if not title or not link:
            continue

        image = _extract_image(entry) or FALLBACK_IMAGES.get(source["category"])

        items.append(
            {
                "id": _stable_id(source["id"], entry),
                "title": title,
                "author": source["partner_name"],
                "partnerName": source["partner_name"],
                "partnerUrl": source["partner_url"],
                "category": source["category"],
                "date": _parse_date(entry),
                "image": image,
                "excerpt": _excerpt(entry),
                "tags": _tags(entry, source["category"]),
                "link": link,
                "external": True,
                "sourceId": source["id"],
            }
        )

    print(f"   <- {len(items)} item(s)", flush=True)
    return items


def main() -> int:
    all_items: list[dict] = []
    for src in SOURCES:
        try:
            all_items.extend(fetch_source(src))
        except Exception as exc:  # noqa: BLE001
            print(f"!! failed for {src['feed']}: {exc}", file=sys.stderr)

    # Newest first
    all_items.sort(key=lambda x: x["date"], reverse=True)
    all_items = all_items[:MAX_TOTAL]

    if not all_items:
        print("No items fetched – aborting without overwriting existing file.", file=sys.stderr)
        return 1

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(
        json.dumps(all_items, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"\nWrote {len(all_items)} items to {OUTPUT_PATH.relative_to(OUTPUT_PATH.parent.parent.parent)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
