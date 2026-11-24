"""Write Open Graph / Twitter tags on every indexable FR/EN page and keep meta
descriptions within 160 characters.

Values come from the page itself: <title>, meta description, canonical URL and
<html lang>. A page-specific og:image is kept when it exists locally; otherwise
the default 1200x630 preview image is used.

Run from the repository root:
    python3 generate_social_meta.py --write
"""
import glob
import html
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from generate_localized_sitemaps import indexable  # same page set as the sitemaps

BASE = "https://dcmcore.com/"
DEFAULT_IMAGE = BASE + "assets/preview-hero.jpg"
SITE_NAME = "DCM Core Institute"
MAX_DESC = 160


def shorten(text, limit=MAX_DESC):
    text = " ".join(text.split())
    if len(text) <= limit:
        return text
    cut = text[:limit]
    # prefer the end of a sentence
    m = max(cut.rfind(". "), cut.rfind(" ; "), cut.rfind(": "))
    if m >= 90:
        return cut[:m + 1].rstrip(" :;")
    cut = cut[: limit - 1]
    cut = cut[: cut.rfind(" ")].rstrip(" ,;:–-")
    return cut + "…"


def attr(s):
    return html.escape(s, quote=True)


def process(path, write):
    s = open(path, encoding="utf-8").read()
    if not indexable(path, s):
        return 0, 0
    head_end = s.lower().find("</head>")
    head, rest = s[:head_end], s[head_end:]

    canon = re.search(r'<link[^>]*rel="canonical"[^>]*href="([^"]+)"', head)
    title = re.search(r"<title[^>]*>(.*?)</title>", head, re.S)
    if not canon or not title:
        return 0, 0
    url = canon.group(1).strip()
    title_txt = html.unescape(" ".join(title.group(1).split()))
    lang = "fr" if path.startswith("fr/") else "en"

    desc_changed = 0
    dtag = None
    for tag in re.findall(r"<meta\b[^>]*>", head, re.I):
        if re.search(r'name=["\']description["\']', tag, re.I):
            dtag = tag
            break
    desc = ""
    if dtag:
        m = re.search(r'content="([^"]*)"', dtag) or re.search(r"content='([^']*)'", dtag)
        desc = html.unescape(m.group(1)) if m else ""
        short = shorten(desc)
        if short != " ".join(desc.split()):
            head = head.replace(dtag, f'<meta name="description" content="{attr(short)}">', 1)
            desc_changed = 1
        desc = short

    # keep a page-specific image if it exists locally
    image = DEFAULT_IMAGE
    m = re.search(r'<meta[^>]*property=["\']og:image["\'][^>]*>', head)
    if m:
        c = re.search(r'content="([^"]+)"', m.group(0))
        if c:
            src = c.group(1)
            local = src.replace(BASE, "") if src.startswith(BASE) else None
            if local and os.path.exists(local) and "preview-hero" not in local:
                image = src

    # drop existing OG / Twitter tags, then write one consistent block
    head = re.sub(r'[ \t]*<meta[^>]*(?:property|name)=["\'](?:og|twitter):[^"\']*["\'][^>]*>[ \t]*\n?', "", head)
    block = (
        f'    <meta property="og:type" content="website">\n'
        f'    <meta property="og:site_name" content="{SITE_NAME}">\n'
        f'    <meta property="og:locale" content="{"fr_FR" if lang == "fr" else "en_US"}">\n'
        f'    <meta property="og:title" content="{attr(title_txt)}">\n'
        f'    <meta property="og:description" content="{attr(desc or title_txt)}">\n'
        f'    <meta property="og:url" content="{attr(url)}">\n'
        f'    <meta property="og:image" content="{attr(image)}">\n'
        f'    <meta property="og:image:width" content="1200">\n'
        f'    <meta property="og:image:height" content="630">\n'
        f'    <meta name="twitter:card" content="summary_large_image">\n'
        f'    <meta name="twitter:title" content="{attr(title_txt)}">\n'
        f'    <meta name="twitter:description" content="{attr(desc or title_txt)}">\n'
        f'    <meta name="twitter:image" content="{attr(image)}">\n'
    )
    head = head.rstrip() + "\n" + block
    new = head + rest
    if new != s and write:
        open(path, "w", encoding="utf-8").write(new)
    return int(new != s), desc_changed


def main(write):
    pages = changed = descs = 0
    for lang in ("fr", "en"):
        for path in glob.glob(f"{lang}/**/*.html", recursive=True):
            c, d = process(path, write)
            changed += c
            descs += d
    print(f"{changed} pages updated, {descs} descriptions shortened")


if __name__ == "__main__":
    main("--write" in sys.argv)
