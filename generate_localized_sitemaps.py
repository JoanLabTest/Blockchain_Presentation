"""Generate sitemap.xml (index), sitemap-fr.xml and sitemap-en.xml.

- Only indexable pages: redirect stubs, noindex pages and utility pages are skipped.
- <loc> is the page's canonical URL (directory index.html -> trailing slash).
- <lastmod> is the date of the file's last git commit.
- <xhtml:link rel="alternate" hreflang=...> entries mirror the page's own hreflang
  tags, limited to targets that are themselves in the sitemaps.

Run from the repository root:  python3 generate_localized_sitemaps.py
"""
import glob
import os
import re
import subprocess
from datetime import datetime
from xml.sax.saxutils import escape

BASE = "https://dcmcore.com/"
LANGS = ("fr", "en")

# Exact basenames (without .html) that must never be listed.
EXCLUDED_NAMES = {
    "admin", "login", "investor-login", "dashboard", "auth-callback", "update-password",
    "org-settings", "webhook_test", "quiz-review", "diploma", "certificate", "report",
    "index_en", "index-simple_en", "investor-relations", "series-a-narrative",
    "vc-tear-sheet", "pilot-intake", "legal_pilot_demo",
    # legal / policy pages: crawlable but not worth listing
    "cgu", "cgv", "privacy", "cookies", "terms-of-service", "terms-of-use",
    "mentions-legales", "legal-mentions",
}
EXCLUDED_PATTERNS = [re.compile(r"^google[0-9a-f]+$"), re.compile(r"backup")]


def git_lastmod(path):
    try:
        out = subprocess.run(["git", "log", "-1", "--format=%cs", "--", path],
                             capture_output=True, text=True, check=True).stdout.strip()
        if out:
            return out
    except Exception:
        pass
    return datetime.fromtimestamp(os.path.getmtime(path)).strftime("%Y-%m-%d")


def page_url(path):
    url = BASE + path.replace(os.sep, "/")
    return url[: -len("index.html")] if url.endswith("/index.html") else url


def indexable(path, html):
    name = os.path.splitext(os.path.basename(path))[0]
    if name in EXCLUDED_NAMES or any(p.search(name) for p in EXCLUDED_PATTERNS):
        return False
    head = html[:20000]
    if re.search(r'http-equiv=["\']refresh["\']', head, re.I) or "window.location.replace" in html:
        return False
    for tag in re.findall(r'<meta\b[^>]*>', head, re.I):
        if re.search(r'name=["\']robots["\']', tag, re.I) and re.search(r'noindex', tag, re.I):
            return False
    return True


def collect():
    pages = {}
    for lang in LANGS:
        for path in sorted(glob.glob(f"{lang}/**/*.html", recursive=True)):
            if not os.path.isfile(path):
                continue
            html = open(path, encoding="utf-8", errors="ignore").read()
            if not indexable(path, html):
                continue
            url = page_url(path)
            canon = re.search(r'<link[^>]*rel="canonical"[^>]*href="([^"]+)"', html)
            if canon and canon.group(1).strip() != url:
                continue  # page declares another URL as canonical
            alts = {}
            for hl, href in re.findall(r'<link[^>]*hreflang="([^"]+)"[^>]*href="([^"]+)"', html[:20000]):
                alts[hl] = href.strip()
            pages[url] = {"lang": lang, "path": path, "lastmod": git_lastmod(path), "alts": alts}
    return pages


def write_urlset(filename, entries, all_urls, pages):
    lines = ['<?xml version="1.0" encoding="UTF-8"?>',
             '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" '
             'xmlns:xhtml="http://www.w3.org/1999/xhtml">']
    for url, info in entries:
        lines.append("  <url>")
        lines.append(f"    <loc>{escape(url)}</loc>")
        lines.append(f"    <lastmod>{info['lastmod']}</lastmod>")
        # keep only reciprocal alternates whose target is listed (x-default kept if listed)
        alts = {hl: href for hl, href in info["alts"].items()
                if href in all_urls and (hl == "x-default" or href == url
                                         or url in pages[href]["alts"].values())}
        # an alternate set is only meaningful with at least two languages incl. self
        if len([h for h in alts if h != "x-default"]) >= 2:
            for hl in sorted(alts):
                lines.append(f'    <xhtml:link rel="alternate" hreflang="{hl}" href="{escape(alts[hl])}"/>')
        lines.append("  </url>")
    lines.append("</urlset>")
    open(filename, "w", encoding="utf-8").write("\n".join(lines) + "\n")
    print(f"Generated {filename}: {len(entries)} URLs")


def main():
    pages = collect()
    all_urls = set(pages)
    for lang in LANGS:
        entries = sorted((u, i) for u, i in pages.items() if i["lang"] == lang)
        write_urlset(f"sitemap-{lang}.xml", entries, all_urls, pages)
    today = max(i["lastmod"] for i in pages.values())
    idx = ['<?xml version="1.0" encoding="UTF-8"?>',
           '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for lang in LANGS:
        lm = max(i["lastmod"] for i in pages.values() if i["lang"] == lang)
        idx += ["  <sitemap>", f"    <loc>{BASE}sitemap-{lang}.xml</loc>", f"    <lastmod>{lm}</lastmod>", "  </sitemap>"]
    idx.append("</sitemapindex>")
    open("sitemap.xml", "w", encoding="utf-8").write("\n".join(idx) + "\n")
    print(f"Generated sitemap.xml (index, latest lastmod {today})")


if __name__ == "__main__":
    main()
    # keep the site search index in sync with the sitemaps
    import generate_search_index
    generate_search_index.main()
