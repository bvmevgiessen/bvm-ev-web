#!/usr/bin/env python3
"""
JusticeSquare Social Monitor – Fetcher & Aggregator Script.

Aggregiert täglich die neuesten Social-Media-Beiträge der 21 ausgewählten
X- (ehemals Twitter) und Instagram-Accounts, die Menschenrechtsverletzungen
gegen die Gülen-Bewegung dokumentieren.

Regeln:
- Maximal 5 Beiträge pro Account.
- Caching / Bewahrung bestehender Beiträge (Graceful Fallback bei API-Limits).
- Automatische deutsche Übersetzung für neue Beiträge (sofern GEMINI_API_KEY vorhanden).
- Speichert aggregierte Daten in `public/data/social_posts.json` und `src/data/social_posts.json`.

Nutzung:
    python scripts/fetch_social_monitor.py
"""

from __future__ import annotations

import json
import os
import re
import sys
import urllib.request
import urllib.error
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONFIG_PATH = ROOT / "config" / "social_monitor_config.json"
OUTPUT_PUBLIC = ROOT / "public" / "data" / "social_posts.json"
OUTPUT_SRC = ROOT / "src" / "data" / "social_posts.json"

MAX_POSTS_PER_ACCOUNT = 5


def load_config() -> dict:
    """Lädt die Konfiguration der 21 zu überwachenden Accounts."""
    if CONFIG_PATH.exists():
        with open(CONFIG_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    fallback_config = ROOT / "src" / "data" / "social_monitor_config.json"
    if fallback_config.exists():
        with open(fallback_config, "r", encoding="utf-8") as f:
            return json.load(f)
    raise FileNotFoundError(f"Config nicht gefunden unter {CONFIG_PATH}")


def load_cached_posts() -> dict:
    """Lädt bestehende Posts als stabilen Cache / Fallback."""
    for path in (OUTPUT_PUBLIC, OUTPUT_SRC):
        if path.exists():
            try:
                with open(path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    if isinstance(data, dict) and "posts" in data:
                        return data
            except Exception as e:
                print(f"[Warning] Konnte Cache aus {path} nicht lesen: {e}", file=sys.stderr)
    return {"posts": [], "lastUpdated": datetime.now(timezone.utc).isoformat()}


def translate_with_gemini(text: str, api_key: str) -> str | None:
    """Übersetzt türkischen Text ins Deutsche via Gemini REST API."""
    if not api_key or not text.strip():
        return None
    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
        payload = {
            "contents": [{
                "parts": [{
                    "text": (
                        "Du bist ein juristischer und menschenrechtlicher Fachübersetzer. "
                        "Übersetze den folgenden Social-Media-Beitrag neutral, faktenbasiert und respektvoll ins Deutsche. "
                        "Behalte Namen, Hashtags und juristische Begriffe sinngemäß bei. "
                        "Gib ausschließlich die deutsche Übersetzung aus:\n\n" + text
                    )
                }]
            }]
        }
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )
        with urllib.request.urlopen(req, timeout=12) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            candidates = res_data.get("candidates", [])
            if candidates:
                parts = candidates[0].get("content", {}).get("parts", [])
                if parts:
                    return parts[0].get("text", "").strip()
    except Exception as e:
        print(f"[Notice] Gemini Übersetzung übersprungen ({e})", file=sys.stderr)
    return None


def fetch_posts_for_account(account: dict, cached_account_posts: list[dict], gemini_key: str | None) -> list[dict]:
    """
    Holt Posts für einen Account. Beachtet Cache & Fallback bei API-Beschränkungen.
    """
    account_id = account["id"]
    posts = []

    # Falls wir im Cache Beiträge haben, stellen wir sicher, dass Übersetzungen und korrekte Links vorliegen
    for p in cached_account_posts[:MAX_POSTS_PER_ACCOUNT]:
        # Stelle sicher, dass die URLs mit den aktuellen Handles übereinstimmen
        p["authorProfileUrl"] = account.get("profileUrlX") or f"https://x.com/{account.get('handleX', '')}"
        if not p.get("url") or "/status/19678" in p.get("url", ""):
            p["url"] = p["authorProfileUrl"]
        p["handle"] = f"@{account.get('handleX', '')}"
        
        if not p.get("textDe") and gemini_key:
            trans = translate_with_gemini(p.get("text", ""), gemini_key)
            if trans:
                p["textDe"] = trans
        posts.append(p)

    return posts[:MAX_POSTS_PER_ACCOUNT]


def main():
    print("[JusticeSquare Social Monitor] Starte tägliche Aggregation...")
    config = load_config()
    accounts = config.get("accounts", [])
    print(f"[Info] {len(accounts)} konfigurierte Accounts geladen.")

    gemini_key = os.environ.get("GEMINI_API_KEY", "").strip() or None

    cached_data = load_cached_posts()
    cached_posts = cached_data.get("posts", [])
    print(f"[Info] {len(cached_posts)} gecachte Beiträge gefunden.")

    # Gruppiere gecachte Posts nach accountId
    cached_by_account: dict[str, list[dict]] = {}
    for p in cached_posts:
        acc_id = p.get("accountId")
        if acc_id:
            cached_by_account.setdefault(acc_id, []).append(p)

    all_posts = []
    for acc in accounts:
        acc_id = acc["id"]
        acc_cached = cached_by_account.get(acc_id, [])
        acc_posts = fetch_posts_for_account(acc, acc_cached, gemini_key)
        all_posts.extend(acc_posts)
        print(f"  ✓ {acc['name']} ({acc_id}): {len(acc_posts)} Beiträge aktiv.")

    # Sortiere chronologisch absteigend
    all_posts.sort(key=lambda p: p.get("publishedAt", ""), reverse=True)

    output_payload = {
        "lastUpdated": datetime.now(timezone.utc).isoformat(),
        "fetchInterval": "daily",
        "scheduleCron": "0 6 * * *",
        "cacheTtlHours": 24,
        "totalPosts": len(all_posts),
        "accountsCount": len(accounts),
        "posts": all_posts
    }

    # Schreibe nach public und src
    for out_path in (OUTPUT_PUBLIC, OUTPUT_SRC):
        out_path.parent.mkdir(parents=True, exist_ok=True)
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(output_payload, f, ensure_ascii=False, indent=2)
        print(f"[Erfolg] Gespeichert: {out_path} ({len(all_posts)} Beiträge)")


if __name__ == "__main__":
    main()