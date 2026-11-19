#!/usr/bin/env python3
"""Verify served Monolith HTML with curl; use --live-canonicals after release."""
import argparse
import json
import subprocess
from html.parser import HTMLParser
from pathlib import Path

ORIGIN = "https://monolithproject.com"
SHOW = "https://sunsets.fm/radio-shows/chasing-sunsets"
EPISODES = {
    "ep-01-benchek": "real-chasing-ccsep010-chapter-iii-chasing-sunsets-special-nye-by-benchek",
    "ep-02-ewerseen": "real-chasing-ewerseen-chasing-sunsets-mix-vol3",
    "ep-03-terranova": "real-chasing-terranova",
    "ep-04-radian": "real-chasing-radianofc-set",
    "ep-004-benchek-part-2": "real-chasing-benchek-chasing-sunsets-collab-ep02-live-from-marbella",
    "ch-02-radian-no-sleep": "real-chasing-radian-x-chasing-sunsets-chapter-ii-x-no-sleep",
}


class Page(HTMLParser):
    def __init__(self, html):
        super().__init__()
        self.canonicals, self.og_urls, self.links = [], [], []
        self.iframes, self.images = [], []
        self.title, self.in_title, self.anchor = "", False, None
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "link" and attrs.get("rel") == "canonical":
            self.canonicals.append(attrs.get("href"))
        if tag == "meta" and attrs.get("property") == "og:url":
            self.og_urls.append(attrs.get("content"))
        if tag == "a":
            self.anchor = {**attrs, "text": ""}
            self.links.append(self.anchor)
        if tag == "title":
            self.in_title = True
        if tag == "iframe":
            self.iframes.append(attrs)
        if tag == "img":
            self.images.append(attrs)

    def handle_endtag(self, tag):
        if tag == "a":
            self.anchor = None
        if tag == "title":
            self.in_title = False

    def handle_data(self, text):
        if self.anchor is not None:
            self.anchor["text"] += text
        if self.in_title:
            self.title += text


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--base", default=ORIGIN)
    parser.add_argument("--live-canonicals", action="store_true")
    parser.add_argument("--out", type=Path)
    args = parser.parse_args()
    report = {"base": args.base, "cross_domain_canonicals": args.live_canonicals, "pages": [], "failures": []}
    routes = {"/sunsets-fm": ORIGIN + "/sunsets-fm", "/sunsets": ORIGIN + "/sunsets", "/": ORIGIN + "/"}
    routes["/radio"] = SHOW if args.live_canonicals else ORIGIN + "/radio"
    for slug, destination in EPISODES.items():
        routes["/radio/" + slug] = "https://sunsets.fm/sets/" + destination if args.live_canonicals else ORIGIN + "/radio/" + slug

    def check(condition, route, message):
        if not condition:
            report["failures"].append(f"{route}: {message}")

    for route, canonical in routes.items():
        result = subprocess.run(["curl", "--fail-with-body", "--silent", "--show-error", "--location", "--max-time", "40", "--write-out", "\n%{http_code}\n%{url_effective}", args.base.rstrip("/") + route], capture_output=True, text=True)
        if result.returncode:
            report["failures"].append(f"{route}: curl failed: {result.stderr.strip()}")
            continue
        html, status, effective = result.stdout.rsplit("\n", 2)
        page = Page(html)
        check(status == "200", route, "expected HTTP 200")
        check(page.canonicals == [canonical], route, f"canonical {page.canonicals!r} != {canonical}")
        if route != "/":
            check(page.og_urls == [canonical], route, f"og:url {page.og_urls!r} != {canonical}")
        outbound = [link for link in page.links if link.get("href", "").startswith("https://sunsets.fm")]
        check(all("nofollow" not in link.get("rel", "").lower().split() for link in outbound), route, "nofollow on SUNSETS.FM link")
        if route == "/radio" or route.startswith("/radio/"):
            destination = SHOW if route == "/radio" else "https://sunsets.fm/sets/" + EPISODES[route.split("/")[-1]]
            check(any(link.get("href") == destination and "Listen on SUNSETS.FM" in link["text"] for link in outbound), route, "missing visible listening link")
        if route == "/sunsets":
            check(any(link.get("href") == "https://sunsets.fm" and "SUNSETS.FM Radio & Releases" in link["text"] for link in outbound), route, "missing Radio & Releases link")
        if route == "/sunsets-fm":
            check(page.title == "SUNSETS.FM | The Monolith Project", route, "wrong title")
            check(not page.iframes, route, "doorway must have no embedded player")
            for destination in EPISODES.values():
                check(any(link.get("href") == "https://sunsets.fm/sets/" + destination for link in outbound), route, "missing episode link " + destination)
        if route == "/":
            check(any(link.get("href") in ["/sunsets-fm", ORIGIN + "/sunsets-fm"] and link["text"].strip() == "SUNSETS.FM" for link in page.links), route, "missing crawlable doorway link")
        if route == "/radio/ch-02-radian-no-sleep":
            check("soundcloud.com/chasing-sun-sets/radian-x-chasing-sunsets-chapter-ii-x-no-sleep" in html, route, "missing corrected No Sleep recording")
        report["pages"].append({"path": route, "status": int(status), "effective_url": effective, "canonical": page.canonicals, "og_url": page.og_urls, "sunsets_links": [{"href": link.get("href"), "text": link["text"].strip(), "rel": link.get("rel", "")} for link in outbound]})
    text = json.dumps(report, indent=2) + "\n"
    if args.out:
        args.out.write_text(text)
    print(text)
    raise SystemExit(bool(report["failures"]))


if __name__ == "__main__":
    main()
