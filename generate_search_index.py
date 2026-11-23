"""Build the site search index used by js/dcm-search-engine.js.

Writes search/index-fr.json and search/index-en.json from the pages listed in
sitemap-fr.xml / sitemap-en.xml (run generate_localized_sitemaps.py first), so
the search covers exactly the indexable pages.

Each entry: u = URL path, t = title, d = description, h = H1, k = section headings,
s = section label.

Run from the repository root:  python3 generate_search_index.py
"""
import html
import json
import os
import re

BASE = "https://dcmcore.com"
SECTIONS = {
    "research": ("Recherche", "Research"),
    "research-papers": ("Working papers", "Working papers"),
    "research-programs": ("Programmes", "Programmes"),
    "observatory": ("Observatoire", "Observatory"),
    "observatoire": ("Observatoire", "Observatory"),
    "insights": ("Analyses", "Insights"),
    "glossary": ("Glossaire", "Glossary"),
    "glossaire": ("Glossaire", "Glossary"),
    "knowledge": ("Base de connaissances", "Knowledge base"),
    "policy-library": ("Bibliothèque réglementaire", "Policy library"),
    "policy-briefs": ("Policy briefs", "Policy briefs"),
    "policy": ("Policy", "Policy"),
    "strategies": ("Stratégies", "Strategies"),
    "networks": ("Réseaux", "Networks"),
    "standards": ("Standards", "Standards"),
    "learn": ("Apprendre", "Learn"),
    "guides": ("Guides", "Guides"),
    "frameworks": ("Cadres", "Frameworks"),
    "indices": ("Indices", "Indices"),
    "data": ("Données", "Data"),
    "datasets": ("Données", "Data"),
    "entities": ("Entités", "Entities"),
    "intelligence": ("Intelligence", "Intelligence"),
    "about": ("À propos", "About"),
    "a-propos": ("À propos", "About"),
    "academy": ("Academy", "Academy"),
    "pdf": ("Briefings", "Briefings"),
    "buidl": ("Recherche", "Research"),
}
TITLE_SUFFIX = re.compile(r"\s*[|–—-]\s*(DCM Core|DCM Digital)[^|]*$", re.I)


def text(fragment):
    fragment = re.sub(r"(?s)<(script|style)[^>]*>.*?</\1>", " ", fragment)
    return " ".join(html.unescape(re.sub(r"<[^>]+>", " ", fragment)).split())


def meta_description(src):
    for pat in (r'<meta\s+[^>]*name="description"[^>]*content="([^"]*)"',
                r'<meta\s+[^>]*content="([^"]*)"[^>]*name="description"'):
        m = re.search(pat, src, re.S | re.I)
        if m:
            return " ".join(html.unescape(m.group(1)).split())
    return ""


def entry(url, lang):
    path = url[len(BASE):].lstrip("/")
    file = path + "index.html" if path.endswith("/") or path == "" else path
    src = open(file, encoding="utf-8", errors="ignore").read()
    title = text((re.search(r"(?s)<title>(.*?)</title>", src) or [None, ""])[1]) if "<title>" in src else ""
    title = TITLE_SUFFIX.sub("", title).strip()
    body = src[src.lower().find("<body"):]
    body = re.sub(r"(?s)<(nav|footer|header)\b[^>]*>.*?</\1>", " ", body)
    h1 = text((re.search(r"(?s)<h1[^>]*>(.*?)</h1>", body) or [None, ""])[1])
    heads = [text(h) for h in re.findall(r"(?s)<h[23][^>]*>(.*?)</h[23]>", body)]
    heads = [h for h in heads if 3 <= len(h) <= 120]
    seg = path.split("/")[1] if path.count("/") >= 1 else ""
    label = SECTIONS.get(seg, ("Page", "Page"))[0 if lang == "fr" else 1]
    weight = 0
    if seg in ("research", "insights", "glossary", "glossaire", "guides", "observatory",
               "policy-library", "policy-briefs", "learn", "strategies"):
        weight += 3
    if re.search(r"(_section|-module|_module|_backup|-simple|_demo)", os.path.basename(path)):
        weight -= 8
    return {
        "w": weight,
        "u": "/" + path,
        "t": title or h1 or path,
        "d": meta_description(src)[:240],
        "h": h1[:160] if h1 and h1 != title else "",
        "k": " · ".join(dict.fromkeys(heads))[:400],
        "s": label,
    }


def main():
    os.makedirs("search", exist_ok=True)
    for lang in ("fr", "en"):
        urls = re.findall(r"<loc>([^<]+)</loc>", open(f"sitemap-{lang}.xml", encoding="utf-8").read())
        data = [entry(u, lang) for u in urls]
        out = f"search/index-{lang}.json"
        with open(out, "w", encoding="utf-8") as f:
            json.dump({"lang": lang, "count": len(data), "pages": data}, f, ensure_ascii=False, separators=(",", ":"))
        print(f"{out}: {len(data)} pages, {os.path.getsize(out) // 1024} KB")


if __name__ == "__main__":
    main()
