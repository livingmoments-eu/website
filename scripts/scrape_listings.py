#!/usr/bin/env python3
"""
Syncs Julia Gehring's active E&V listings to assets/data/listings.json.
Uses Firecrawl API for JS-rendered scraping.
Requires: FIRECRAWL_API_KEY env var (free tier: ~500 credits/month, 9/run)
"""

import json
import os
import re
import sys
from datetime import date, datetime
from pathlib import Path

ADVISOR_URL = "https://www.engelvoelkers.com/de/de/advisors/julia-gehring"
LISTINGS_PATH = Path(__file__).parent.parent / "assets" / "data" / "listings.json"
NEW_THRESHOLD_DAYS = 21  # listings within 21 days count as NEU on our site


def load_existing():
    if LISTINGS_PATH.exists():
        with open(LISTINGS_PATH, encoding="utf-8") as f:
            data = json.load(f)
        return {l["id"]: l for l in data.get("listings", [])}
    return {}


def extract_expose_id(url):
    m = re.search(r"/exposes/([a-f0-9-]{36})", url or "")
    return m.group(1) if m else None


def days_since(date_str):
    try:
        return (date.today() - datetime.strptime(date_str, "%Y-%m-%d").date()).days
    except Exception:
        return 999


def clean_location(raw):
    return (
        raw.replace(", Deutschland", "")
           .replace(", Bayern, Deutschland", "")
           .replace(", Bayern", "")
           .strip()
    )


def scrape():
    from firecrawl import FirecrawlApp  # pip install firecrawl-py

    api_key = os.environ.get("FIRECRAWL_API_KEY")
    if not api_key:
        print("ERROR: FIRECRAWL_API_KEY not set", file=sys.stderr)
        sys.exit(1)

    app = FirecrawlApp(api_key=api_key)
    print(f"Scraping {ADVISOR_URL} ...")

    schema = {
        "type": "object",
        "properties": {
            "listings": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "title":     {"type": "string"},
                        "location":  {"type": "string"},
                        "price":     {"type": "string"},
                        "rooms":     {"type": "string"},
                        "bathrooms": {"type": "string"},
                        "sqm":       {"type": "string"},
                        "isNew":     {"type": "boolean"},
                        "url":       {"type": "string"},
                    },
                },
            }
        },
    }

    result = app.scrape_url(
        ADVISOR_URL,
        formats=["json"],
        wait_for=8000,
        json_options={
            "prompt": (
                "Extract all property listings on this real estate advisor page. "
                "For each listing: title (full headline text), location (full location string), "
                "price (e.g. '1.745.000 €'), rooms (e.g. '2 Zimmer'), "
                "bathrooms (e.g. '2 Badezimmer'), sqm (e.g. '~125 m² Wohnfläche'), "
                "isNew (true if a green NEU badge is visible on the card), "
                "url (full https URL to the expose page, contains /exposes/)."
            ),
            "schema": schema,
        },
    )

    return result.get("json", {}).get("listings", [])


def merge(scraped, existing):
    today = date.today().isoformat()
    result = []

    for s in scraped:
        url = s.get("url", "")
        expose_id = extract_expose_id(url)
        if not expose_id:
            print(f"  Skipping (no expose ID): {s.get('title', '')[:60]}")
            continue

        old = existing.get(expose_id, {})
        first_seen = old.get("firstSeen", today)
        is_new_by_age = days_since(first_seen) <= NEW_THRESHOLD_DAYS
        is_new = s.get("isNew", False) or is_new_by_age

        result.append({
            "id":        expose_id,
            "title":     s.get("title", "").strip(),
            "location":  clean_location(s.get("location", "")),
            "price":     s.get("price", "").strip(),
            "rooms":     s.get("rooms", "").strip(),
            "bathrooms": s.get("bathrooms", "").strip(),
            "sqm":       s.get("sqm", "").strip(),
            "isNew":     is_new,
            "url":       url,
            "firstSeen": first_seen,
        })

    result.sort(key=lambda x: (not x["isNew"], x.get("firstSeen", "")))
    return result


def main():
    existing = load_existing()
    print(f"Existing listings: {len(existing)}")

    scraped = scrape()
    print(f"Scraped listings:  {len(scraped)}")

    if not scraped:
        print("No listings returned - keeping existing data unchanged.")
        sys.exit(0)

    merged = merge(scraped, existing)

    output = {
        "lastUpdated": date.today().isoformat(),
        "source":      ADVISOR_URL,
        "listings":    merged,
    }

    LISTINGS_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(LISTINGS_PATH, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"Saved {len(merged)} listings -> {LISTINGS_PATH}")

    removed = set(existing.keys()) - {l["id"] for l in merged}
    if removed:
        print(f"Removed {len(removed)} listings no longer on E&V: {removed}")


if __name__ == "__main__":
    main()
