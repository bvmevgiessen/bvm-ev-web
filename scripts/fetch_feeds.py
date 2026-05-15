"""
Fetches the latest posts from BVM partner organizations and writes a normalized
`src/data/latest_updates.json` consumed by the React frontend.

Key features (2026-Q2 refresh):
  * RSS via `feedparser` for sources that publish a feed.
  * Headless Chromium via Playwright for sites without a feed (House of One).
  * German-only filter using `langdetect` – any post detected as non-German is
    skipped (covers Turkish content on Time to Help / AFSV, English on JWF, …).
  * Keyword-based category assignment (Integration | Dialog | Community | Jugend).

Run locally:
    pip install -r scripts/requirements.txt
    python -m playwright install --with-deps chromium    # only for House of One
    python scripts/fetch_feeds.py
"""

from __future__ import annotations

import hashlib
import html as html_module
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

import feedparser
from bs4 import BeautifulSoup

# langdetect is non-deterministic by default – seed it for reproducible runs.
from langdetect import DetectorFactory, LangDetectException, detect

DetectorFactory.seed = 0

# ---------------------------------------------------------------------------
# Sources
# ---------------------------------------------------------------------------

SOURCES = [
    {
        "id": "sdub",
        "feed": "https://sdub.de/feed/",
        "source_name": "Stiftung Dialog und Bildung",
        "url": "https://sdub.de/",
        "type": "rss",
    },
    {
        "id": "fidev",
        "feed": "https://www.fidev.org/blog-feed.xml",  # Wix
        "source_name": "Forum für Interkulturellen Dialog",
        "url": "https://www.fidev.org/",
        "type": "rss",
    },
    {
        "id": "timetohelp",
        # Try the German sub-directory feed first, fall back to the main feed.
        "feed": "https://timetohelp.eu/de/feed/",
        "fallback_feed": "https://timetohelp.eu/feed/",
        "source_name": "Time to Help e.V.",
        "url": "https://timetohelp.eu/",
        "type": "rss",
    },
    {
        "id": "afsv",
        "feed": "https://afsv.org/feed/",
        "source_name": "AFSV",
        "url": "https://afsv.org/",
        "type": "rss",
    },
    {
        "id": "jwf",
        "feed": "https://jwf.org/feed/",
        "source_name": "Journalists and Writers Foundation",
        "url": "https://jwf.org/",
        "type": "rss",
    },
    {
        "id": "bddi",
        "feed": "https://bddi.org/feed/",
        "source_name": "Bund Deutscher Dialog Institutionen",
        "url": "https://bddi.org/",
        "type": "rss",
    },
    {
        "id": "house-of-one",
        "feed": "https://house-of-one.org/de/news",  # rendered, scraped via Playwright
        "source_name": "House of One",
        "url": "https://house-of-one.org/",
        "type": "scrape",
    },
]

MAX_PER_SOURCE = 6
MAX_TOTAL = 30

# ---------------------------------------------------------------------------
# Keyword-based category mapping
# ---------------------------------------------------------------------------
CATEGORY_KEYWORDS: dict[str, tuple[str, ...]] = {
    "Integration": (
        "integration", "flüchtling", "fluechtling", "asylbewerber",
        "integrationskurs", "sprachkurs", "fördern", "förderung",
        "aufnahmegesellschaft", "migrationshintergrund", "migration",
        "migrant", "geflüchtet", "gefluechtet", "einwanderung",
        "ankommen", "willkommen", "einbürgerung", "asyl",
        "neuzugewanderte", "teilhabe", "interkulturelle öffnung",
        "ankunftsgesellschaft",
    ),
    "Dialog": (
        "interreligiös", "interreligioes", "interkulturell",
        "völkerverständigung", "voelkerverstaendigung",
        "toleranz", "respekt", "abrahamitisch", "friedliches zusammenleben",
        "dialog", "begegnung", "interfaith", "moschee", "kirche",
        "synagoge", "christen", "muslime", "juden", "verständigung",
        "verstaendigung", "ramadan", "iftar", "fastenbrechen",
        "religion", "religiös", "religioes", "house of one",
        "abrahamische religionen",
    ),
    "Community": (
        "hilfsorganisation", "wohlfahrt", "wohlfahrtsverband", "ngo",
        "gemeinde", "ehrenamt", "ehrenamtlich", "bürgerinitiative",
        "buergerinitiative", "nachbarschaftshilfe", "freiwillig",
        "freiwilligenarbeit", "gemeinnützig", "gemeinnuetzig",
        "engagement", "spende", "solidarität", "solidaritaet",
        "verein", "soziales", "zusammenhalt", "community",
        "helfen", "kampagne", "stiftung", "wohltätigkeit",
        "wohltaetigkeit",
    ),
    "Jugend": (
        "jugend", "jugendlich", "jugendliche", "kinder", "kind",
        "schule", "schüler", "schueler", "gymnasium", "universität",
        "universitaet", "studierende", "studenten", "nachhilfe",
        "sport", "turnen", "feriencamp", "ferienreise",
        "hausaufgabenbetreuung", "kulturreisen", "spielabend",
        "jugendarbeit", "jugendforum", "junge menschen", "jugendprojekt",
        "jugendhilfe", "azubi", "kinderfest",
    ),
}

DEFAULT_CATEGORY = "Community"

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
    if not raw:
        return ""
    text = BeautifulSoup(raw, "html.parser").get_text(separator=" ")
    return re.sub(r"\s+", " ", html_module.unescape(text)).strip()


def _is_german(*chunks: str) -> bool:
    """Return True if the concatenated text is detected as German.

    Robust against very short snippets: anything < 25 chars is accepted (no
    signal to detect language on)."""
    sample = " ".join(c for c in chunks if c).strip()
    if len(sample) < 25:
        return True
    try:
        return detect(sample) == "de"
    except LangDetectException:
        return True  # be permissive on detector failure


def categorize(title: str, excerpt: str) -> str:
    """Pick the category with the most keyword hits across title + excerpt."""
    title_l = title.lower()
    haystack = f" {title_l} {excerpt.lower()} "
    scores: dict[str, int] = {}
    for category, keywords in CATEGORY_KEYWORDS.items():
        score = 0
        for kw in keywords:
            kw_l = kw.lower()
            if kw_l in title_l:
                score += 2  # title hits weigh double
            elif kw_l in haystack:
                score += 1
        if score:
            scores[category] = score

    if not scores:
        return DEFAULT_CATEGORY

    priority = list(CATEGORY_KEYWORDS.keys())  # tie-break order
    return max(scores, key=lambda c: (scores[c], -priority.index(c)))


def _extract_image_from_entry(entry: dict) -> str | None:
    for key in ("media_content", "media_thumbnail"):
        media = entry.get(key)
        if media and isinstance(media, list) and media[0].get("url"):
            return media[0]["url"]

    for enc in entry.get("enclosures") or []:
        url = enc.get("href") or enc.get("url")
        if url and (
            re.search(r"\.(jpg|jpeg|png|webp|gif)", url, re.I)
            or "image" in (enc.get("type") or "")
        ):
            return url

    for field in ("content", "summary", "description"):
        value = entry.get(field)
        if isinstance(value, list) and value:
            value = value[0].get("value", "")
        if isinstance(value, str) and "<img" in value:
            img = BeautifulSoup(value, "html.parser").find("img")
            if img and img.get("src"):
                return img["src"]
    return None


def _excerpt_from_entry(entry: dict, length: int = 220) -> str:
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


def _parse_date_from_entry(entry: dict) -> str:
    for key in ("published_parsed", "updated_parsed", "created_parsed"):
        struct = entry.get(key)
        if struct:
            try:
                return datetime(*struct[:6], tzinfo=timezone.utc).isoformat()
            except (TypeError, ValueError):
                continue
    return datetime.now(timezone.utc).isoformat()


def _tags_from_entry(entry: dict, category: str) -> list[str]:
    """Up to 3 short, human-friendly tags. Always includes the BVM category."""
    skip_lower = {
        category.lower(),
        "aktuelles", "uncategorized", "allgemein", "unkategorisiert",
        "news", "blog", "post", "presseschau", "veranstaltungshinweise",
    }
    tags = [category]
    for t in entry.get("tags") or []:
        name = (t.get("term") or "").strip()
        if not name or len(name) > 24 or name.lower() in skip_lower:
            continue
        tags.append(name)
        if len(tags) >= 3:
            break

    seen, deduped = set(), []
    for t in tags:
        if t.lower() not in seen:
            seen.add(t.lower())
            deduped.append(t)
    return deduped


def _stable_id(prefix: str, *seed_parts: str) -> str:
    seed = "|".join(p for p in seed_parts if p) or prefix
    digest = hashlib.sha1(seed.encode("utf-8", errors="ignore")).hexdigest()[:10]
    return f"{prefix}-{digest}"


# ---------------------------------------------------------------------------
# Source readers
# ---------------------------------------------------------------------------

def fetch_rss(source: dict) -> list[dict]:
    feed_url = source["feed"]
    print(f"-> RSS: {feed_url}", flush=True)

    parsed = feedparser.parse(feed_url, agent="bvm-ev.de feed bot/1.0")
    if (parsed.bozo and not parsed.entries) or not parsed.entries:
        fallback = source.get("fallback_feed")
        if fallback:
            print(f"   primary empty – trying fallback {fallback}", flush=True)
            parsed = feedparser.parse(fallback, agent="bvm-ev.de feed bot/1.0")

    if parsed.bozo and not parsed.entries:
        print(f"   !! parse error: {parsed.bozo_exception}", file=sys.stderr)
        return []

    items: list[dict] = []
    skipped_lang = 0
    skipped_junk = 0
    for entry in parsed.entries:
        title = _strip_html(entry.get("title", "")).strip()
        link = entry.get("link") or ""
        if not title or not link:
            continue

        # Skip obvious test posts / placeholder content.
        if len(title) < 8 or title.lower() in {"test", "hello world", "lorem ipsum"}:
            skipped_junk += 1
            continue

        excerpt = _excerpt_from_entry(entry)

        if not _is_german(title, excerpt):
            skipped_lang += 1
            continue

        category = categorize(title, excerpt)
        image = _extract_image_from_entry(entry) or FALLBACK_IMAGES.get(category)

        items.append(
            {
                "id": _stable_id(source["id"], entry.get("id") or entry.get("guid") or link),
                "title": title,
                "link": link,
                "date": _parse_date_from_entry(entry),
                "source_name": source["source_name"],
                "image_url": image,
                "category": category,
                # Frontend-friendly aliases (kept for backwards compatibility)
                "author": source["source_name"],
                "partnerName": source["source_name"],
                "partnerUrl": source["url"],
                "image": image,
                "excerpt": excerpt,
                "tags": _tags_from_entry(entry, category),
                "external": True,
                "sourceId": source["id"],
            }
        )
        if len(items) >= MAX_PER_SOURCE:
            break

    msg = f"   <- {len(items)} item(s)"
    if skipped_lang:
        msg += f"  (skipped {skipped_lang} non-German"
        if skipped_junk:
            msg += f", {skipped_junk} junk"
        msg += ")"
    elif skipped_junk:
        msg += f"  (skipped {skipped_junk} junk)"
    print(msg, flush=True)
    return items


def fetch_scrape(source: dict) -> list[dict]:
    """Headless scrape for sites without a feed (House of One)."""
    print(f"-> SCRAPE: {source['feed']}", flush=True)
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        print("   !! playwright not installed – skipping", file=sys.stderr)
        return []

    items: list[dict] = []

    with sync_playwright() as p:
        try:
            browser = p.chromium.launch(headless=True)
        except Exception as exc:  # noqa: BLE001
            print(f"   !! could not launch chromium ({exc}) – skipping", file=sys.stderr)
            return []

        context = browser.new_context(user_agent="Mozilla/5.0 bvm-ev.de feed bot/1.0")
        page = context.new_page()
        try:
            page.goto(source["feed"], wait_until="networkidle", timeout=30000)
            page.wait_for_selector("a[href*='/news/']", timeout=10000)
        except Exception as exc:  # noqa: BLE001
            print(f"   !! page load issue: {exc}", file=sys.stderr)

        cards = page.eval_on_selector_all(
            "a[href*='/news/']",
            """nodes => {
                const seen = new Set();
                return nodes.flatMap(a => {
                    const href = a.href;
                    // skip the listing page itself + newsletter signups
                    if (/\\/news\\/?$/.test(href) || /newsletter/i.test(href)) return [];
                    if (seen.has(href)) return [];
                    seen.add(href);
                    const text = (a.innerText || '').trim();
                    if (text.length < 12) return [];
                    let img = a.querySelector('img');
                    if (!img) {
                        const card = a.closest('article, li, div');
                        if (card) img = card.querySelector('img');
                    }
                    return [{
                        href,
                        text,
                        img: img ? img.src : null,
                        date: (text.match(/\\d{1,2}\\.\\s*[A-ZÄÖÜa-zäöü]+\\.?\\s*\\d{4}/) || [null])[0]
                    }];
                });
            }""",
        )
        browser.close()

    months = {
        "januar": 1, "jan": 1, "februar": 2, "feb": 2,
        "märz": 3, "maerz": 3, "mär": 3, "mar": 3,
        "april": 4, "apr": 4, "mai": 5,
        "juni": 6, "jun": 6, "juli": 7, "jul": 7,
        "august": 8, "aug": 8, "september": 9, "sep": 9, "sept": 9,
        "oktober": 10, "okt": 10, "november": 11, "nov": 11,
        "dezember": 12, "dez": 12,
    }

    def parse_de_date(text: str | None) -> str:
        if not text:
            return datetime.now(timezone.utc).isoformat()
        m = re.match(r"(\d{1,2})\.\s*([A-Za-zÄÖÜäöü]+)\.?\s*(\d{4})", text)
        if not m:
            return datetime.now(timezone.utc).isoformat()
        day, month_name, year = m.group(1), m.group(2).lower().rstrip("."), m.group(3)
        month = months.get(month_name, 1)
        try:
            return datetime(int(year), month, int(day), tzinfo=timezone.utc).isoformat()
        except ValueError:
            return datetime.now(timezone.utc).isoformat()

    seen_links: set[str] = set()
    weekdays_re = re.compile(
        r"^(montag|dienstag|mittwoch|donnerstag|freitag|samstag|sonntag)\b",
        re.I,
    )
    for card in cards:
        href = card.get("href")
        text = (card.get("text") or "").strip()
        if not href or href in seen_links:
            continue
        seen_links.add(href)

        lines = [ln.strip() for ln in text.split("\n") if ln.strip()]
        # House of One cards start with "<Weekday>, <date>" – skip that line.
        clean_lines = [
            ln for ln in lines
            if not weekdays_re.match(ln) and not re.match(r"^\d{1,2}\.\s*[A-Za-zÄÖÜäöü]+\s*\d{4}", ln)
        ]
        title = next(
            (ln for ln in clean_lines if len(ln) > 15),
            (clean_lines[0] if clean_lines else ""),
        )
        excerpt = " ".join(clean_lines[1:])[:220] if len(clean_lines) > 1 else ""

        if not title or len(title) < 10 or not _is_german(title, excerpt):
            continue

        category = categorize(title, excerpt)
        image = card.get("img") or FALLBACK_IMAGES.get(category)

        items.append(
            {
                "id": _stable_id(source["id"], href),
                "title": title,
                "link": href,
                "date": parse_de_date(card.get("date")),
                "source_name": source["source_name"],
                "image_url": image,
                "category": category,
                "author": source["source_name"],
                "partnerName": source["source_name"],
                "partnerUrl": source["url"],
                "image": image,
                "excerpt": excerpt or title,
                "tags": [category],
                "external": True,
                "sourceId": source["id"],
            }
        )
        if len(items) >= MAX_PER_SOURCE:
            break

    print(f"   <- {len(items)} item(s)", flush=True)
    return items


# ---------------------------------------------------------------------------
# Orchestrator
# ---------------------------------------------------------------------------

def fetch_source(source: dict) -> list[dict]:
    try:
        if source["type"] == "rss":
            return fetch_rss(source)
        if source["type"] == "scrape":
            return fetch_scrape(source)
    except Exception as exc:  # noqa: BLE001
        print(f"!! {source['id']} failed: {exc}", file=sys.stderr)
    return []


def main() -> int:
    all_items: list[dict] = []
    for src in SOURCES:
        all_items.extend(fetch_source(src))

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

    from collections import Counter
    by_cat = Counter(i["category"] for i in all_items)
    by_src = Counter(i["sourceId"] for i in all_items)
    print()
    print(f"Wrote {len(all_items)} items to {OUTPUT_PATH.relative_to(OUTPUT_PATH.parent.parent.parent)}")
    print(f"  by category: {dict(by_cat)}")
    print(f"  by source  : {dict(by_src)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
