"""Rewrite the hreflang block of every indexable FR/EN page from one pair map.

Pairs come from the pages' own hreflang declarations:
- a reciprocal FR<->EN declaration is always accepted;
- a one-way declaration is accepted only if the target does not declare a
  different counterpart and no other page claims the same target;
- otherwise the page is left unpaired (no hreflang tags).
Every pair gets: hreflang=fr, hreflang=en, hreflang=x-default (the FR page).

Run from the repository root, then regenerate the sitemaps:
    python3 sync_hreflang.py && python3 generate_localized_sitemaps.py
"""
import glob
import os
import re
import sys

BASE = "https://dcmcore.com/"
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from generate_localized_sitemaps import indexable  # same rules as the sitemaps


def url_of(path):
    u = BASE + path
    return u[: -len("index.html")] if u.endswith("/index.html") else u


def file_of(url):
    p = url[len(BASE):] if url.startswith(BASE) else url.lstrip("/")
    return p + "index.html" if p.endswith("/") or p == "" else p


def main(write):
    pages, decl = {}, {}
    for lang in ("fr", "en"):
        for path in glob.glob(f"{lang}/**/*.html", recursive=True):
            html = open(path, encoding="utf-8", errors="ignore").read()
            if not indexable(path, html):
                continue
            canon = re.search(r'<link[^>]*rel="canonical"[^>]*href="([^"]+)"', html)
            u = url_of(path)
            if canon and canon.group(1).strip() != u:
                continue
            pages[u] = (lang, path)
            alts = dict(re.findall(r'<link[^>]*hreflang="([^"]+)"[^>]*href="([^"]+)"', html[:30000]))
            decl[u] = {k: (v[:-len("index.html")] if v.endswith("/index.html") else v) for k, v in alts.items()}

    def other(u):
        lang = pages[u][0]
        tgt = decl[u].get("en" if lang == "fr" else "fr")
        return tgt if tgt in pages and pages[tgt][0] != lang else None

    claims = {}
    for u in pages:
        t = other(u)
        if t:
            claims.setdefault(t, set()).add(u)

    pair = {}
    for u in pages:
        t = other(u)
        if not t or u in pair:
            continue
        back = other(t)
        if back == u or (back is None and claims.get(t) == {u}):
            pair[u], pair[t] = t, u

    # explicit pairs (hreflang_pairs.json) for translations that do not declare each other
    extra = os.path.join(os.path.dirname(os.path.abspath(__file__)), "hreflang_pairs.json")
    if os.path.exists(extra):
        import json
        for fr_path, en_path in json.load(open(extra))["pairs"]:
            fu, eu = url_of(fr_path), url_of(en_path)
            if fu in pages and eu in pages and fu not in pair and eu not in pair:
                pair[fu], pair[eu] = eu, fu

    changed = 0
    for u, (lang, path) in pages.items():
        html = open(path, encoding="utf-8").read()
        head_end = html.lower().find("</head>")
        head, rest = html[:head_end], html[head_end:]
        new_head = re.sub(r'[ \t]*<link[^>]*rel="alternate"[^>]*hreflang="[^"]*"[^>]*>[ \t]*(?:\n|(?=<))', "", head)
        if u in pair:
            fr = u if lang == "fr" else pair[u]
            en = pair[u] if lang == "fr" else u
            block = (f'    <link rel="alternate" hreflang="fr" href="{fr}" />\n'
                     f'    <link rel="alternate" hreflang="en" href="{en}" />\n'
                     f'    <link rel="alternate" hreflang="x-default" href="{fr}" />\n')
            m = re.search(r'<link[^>]*rel="canonical"[^>]*>[ \t]*\n?', new_head)
            if m:
                new_head = new_head[:m.end()] + block + new_head[m.end():]
            else:
                new_head = new_head + block
        if new_head != head:
            changed += 1
            if write:
                open(path, "w", encoding="utf-8").write(new_head + rest)
    print(f"{len(pages)} indexable pages, {len(pair) // 2} FR/EN pairs, {changed} files updated")


if __name__ == "__main__":
    main("--write" in sys.argv)
