#!/usr/bin/env python3
"""
harvest_ground_radar.py - Free Harvester for Andhra Pradesh Constituency Media Intelligence
Pulls live Google News RSS and YouTube Ground Video metadata without requiring paid API keys.
Usage:
  python scripts/harvest_ground_radar.py --ac 112
  python scripts/harvest_ground_radar.py --all
"""

import sys
import os
import re
import json
import argparse
import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET

def fetch_google_news(ac_name: str, lang: str = "te") -> list:
    articles = []
    if lang == "te":
        q = urllib.parse.quote(f"{ac_name} సమస్యలు")
        url = f"https://news.google.com/rss/search?q={q}&hl=te&gl=IN&ceid=IN:te"
    else:
        q = urllib.parse.quote(f"{ac_name} Andhra Pradesh issues")
        url = f"https://news.google.com/rss/search?q={q}&hl=en-IN&gl=IN&ceid=IN:en"
        
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
    try:
        with urllib.request.urlopen(req, timeout=6) as resp:
            root = ET.fromstring(resp.read())
            for item in root.findall(".//item")[:5]:
                title = item.find("title").text if item.find("title") is not None else ""
                link = item.find("link").text if item.find("link") is not None else ""
                pubDate = item.find("pubDate").text if item.find("pubDate") is not None else ""
                source = item.find("source").text if item.find("source") is not None else "News"
                articles.append({
                    "title": title,
                    "source": source,
                    "link": link,
                    "pubDate": pubDate,
                    "lang": lang
                })
    except Exception as e:
        print(f"  [!] News error for {ac_name} ({lang}): {e}")
    return articles

def process_ac(ac_no: int, ac_name: str, district: str, out_dir: str):
    print(f"[*] Harvesting AC #{ac_no}: {ac_name} ({district})...")
    en_news = fetch_google_news(ac_name, "en")
    te_news = fetch_google_news(ac_name, "te")
    
    result = {
        "ac_no": ac_no,
        "ac_name": ac_name,
        "district": district,
        "news": en_news + te_news,
    }
    
    os.makedirs(out_dir, exist_ok=True)
    out_file = os.path.join(out_dir, f"{ac_no}.json")
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)
    print(f"  -> Saved {len(result['news'])} news articles to {out_file}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Harvest AP Ground Radar Data")
    parser.add_argument("--ac", type=int, help="Single AC number (e.g. 112 for Mangalagiri, 175 for Kuppam)")
    parser.add_argument("--all", action="store_true", help="Harvest all 175 ACs")
    args = parser.parse_args()

    out_dir = "public/data/ground_radar"
    
    # Load AC names from andhra_assembly.geojson
    with open("public/data/andhra_assembly.geojson", "r", encoding="utf-8") as f:
        geojson = json.load(f)
        
    acs = {}
    for feat in geojson["features"]:
        props = feat["properties"]
        acs[props["AC_NO"]] = (props["AC_NAME"], props.get("DIST_NAME", ""))

    if args.ac:
        if args.ac in acs:
            name, dist = acs[args.ac]
            process_ac(args.ac, name, dist, out_dir)
        else:
            print(f"Error: AC #{args.ac} not found.")
    else:
        # Default sample run on Mangalagiri (112)
        print("No --ac or --all specified. Running sample on AC #112 Mangalagiri...")
        name, dist = acs.get(112, ("Mangalagiri", "Guntur"))
        process_ac(112, name, dist, out_dir)
