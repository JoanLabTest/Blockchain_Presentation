"""Baseline structured data for indexable FR/EN pages.

- Pages without any JSON-LD get a WebPage node linked to the site's WebSite and
  Organization (@id https://dcmcore.com/#organization).
- Article-type nodes without dateModified get dateModified = datePublished
  (no content change is known; never invent a later date).
- Deprecated HowTo nodes are removed.

Run from the repository root:
    python3 generate_page_schema.py --write
"""
import glob
import html
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from generate_localized_sitemaps import indexable

BASE = "https://dcmcore.com/"
ORG = {"@id": BASE + "#organization"}
ARTICLE_TYPES = {"Article", "NewsArticle", "BlogPosting", "ScholarlyArticle", "TechArticle", "Report", "AnalysisNewsArticle"}
LD_RE = re.compile(r'(<script[^>]*type=["\']application/ld\+json["\'][^>]*>)(.*?)(</script>)', re.S | re.I)


def types_of(node):
    t = node.get("@type", [])
    return set(t if isinstance(t, list) else [t])


def walk_fix(node, stats):
    """Return the node with HowTo removed and Article dateModified filled."""
    if isinstance(node, list):
        out = []
        for n in node:
            n = walk_fix(n, stats)
            if n is not None:
                out.append(n)
        return out
    if isinstance(node, dict):
        if types_of(node) & {"HowTo"}:
            stats["howto"] += 1
            return None
        if types_of(node) & ARTICLE_TYPES and "dateModified" not in node and node.get("datePublished"):
            node["dateModified"] = node["datePublished"]
            stats["datemod"] += 1
        return {k: walk_fix(v, stats) if isinstance(v, (dict, list)) else v for k, v in node.items()}
    return node


def process(path, write, stats):
    s = open(path, encoding="utf-8").read()
    if not indexable(path, s):
        return
    new = s
    blocks = list(LD_RE.finditer(s))
    for m in reversed(blocks):
        try:
            data = json.loads(m.group(2))
        except ValueError:
            continue
        before = json.dumps(data, sort_keys=True)
        fixed = walk_fix(data, stats)
        if json.dumps(fixed, sort_keys=True) == before:
            continue
        if fixed in (None, [], {}) or (isinstance(fixed, dict) and set(fixed) <= {"@context"}):
            new = new[: m.start()] + new[m.end():]
        else:
            body = "\n" + json.dumps(fixed, ensure_ascii=False, indent=2) + "\n"
            new = new[: m.start()] + m.group(1) + body + m.group(3) + new[m.end():]

    if not blocks:
        head = new[: new.lower().find("</head>")]
        canon = re.search(r'<link[^>]*rel="canonical"[^>]*href="([^"]+)"', head)
        title = re.search(r"<title[^>]*>(.*?)</title>", head, re.S)
        desc = None
        for tag in re.findall(r"<meta\b[^>]*>", head, re.I):
            if re.search(r'name=["\']description["\']', tag, re.I):
                c = re.search(r'content="([^"]*)"', tag)
                desc = html.unescape(c.group(1)) if c else None
                break
        if canon and title:
            lang = "fr" if path.startswith("fr/") else "en"
            node = {
                "@context": "https://schema.org",
                "@type": "WebPage",
                "@id": canon.group(1) + "#webpage",
                "url": canon.group(1),
                "name": html.unescape(" ".join(title.group(1).split())),
                "inLanguage": lang,
                "isPartOf": {"@type": "WebSite", "@id": f"{BASE}{lang}/#website", "url": f"{BASE}{lang}/",
                             "name": "DCM Core Institute"},
                "publisher": ORG,
            }
            if desc:
                node["description"] = desc
            block = ('    <script type="application/ld+json">\n'
                     + json.dumps(node, ensure_ascii=False, indent=2) + "\n    </script>\n")
            i = new.lower().find("</head>")
            new = new[:i] + block + new[i:]
            stats["webpage"] += 1

    if new != s:
        stats["files"] += 1
        if write:
            open(path, "w", encoding="utf-8").write(new)


def main(write):
    stats = {"files": 0, "webpage": 0, "datemod": 0, "howto": 0}
    for lang in ("fr", "en"):
        for path in glob.glob(f"{lang}/**/*.html", recursive=True):
            process(path, write, stats)
    print(stats)


if __name__ == "__main__":
    main("--write" in sys.argv)
