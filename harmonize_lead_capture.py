#!/usr/bin/env python3
"""
harmonize_lead_capture.py
Applies 3 uniform transformations to all remaining research program pages:
  1. Remove duplicate <global-footer> web component tag
  2. Inject supabase-config.js + lead-capture-modal.js before </body>
  3. Add "Download PDF Note" button in .lead-card with per-page trigger_source

Run from: /Users/joanl/blockchain-presentation/
"""

import re
import os

PAGES = [
    # ── FRENCH ──────────────────────────────────────────────────────────────
    {
        "path": "fr/research-programs/digital-asset-regulation.html",
        "lang": "fr",
        "trigger": "pdf_digital_asset_regulation",
        "eyebrow": "📄 NOTE DE RECHERCHE",
        "title": "Télécharger la Note de Recherche",
        "subtitle": "Recevez la version PDF du programme Régulation des Actifs Numériques directement par email.",
    },
    {
        "path": "fr/research-programs/programmable-finance.html",
        "lang": "fr",
        "trigger": "pdf_programmable_finance",
        "eyebrow": "📄 NOTE DE RECHERCHE",
        "title": "Télécharger la Note de Recherche",
        "subtitle": "Recevez la version PDF du programme Finance Programmable & DeFi Institutionnelle directement par email.",
    },
    {
        "path": "fr/research-programs/systemic-crypto-risk.html",
        "lang": "fr",
        "trigger": "pdf_systemic_crypto_risk",
        "eyebrow": "📄 NOTE DE RECHERCHE",
        "title": "Télécharger la Note de Recherche",
        "subtitle": "Recevez la version PDF du programme Risque Systémique & Crypto-Actifs directement par email.",
    },
    {
        "path": "fr/research-programs/tokenization-infrastructure.html",
        "lang": "fr",
        "trigger": "pdf_tokenization_infrastructure",
        "eyebrow": "📄 NOTE DE RECHERCHE",
        "title": "Télécharger la Note de Recherche",
        "subtitle": "Recevez la version PDF du programme Infrastructure de Tokenisation & Standards directement par email.",
    },
    # ── ENGLISH ──────────────────────────────────────────────────────────────
    {
        "path": "en/research-programs/digital-asset-regulation.html",
        "lang": "en",
        "trigger": "pdf_digital_asset_regulation",
        "eyebrow": "📄 RESEARCH BRIEFING",
        "title": "Download the Research Briefing",
        "subtitle": "Receive the printable PDF version of the Digital Asset Regulation program directly by email.",
    },
    {
        "path": "en/research-programs/programmable-finance.html",
        "lang": "en",
        "trigger": "pdf_programmable_finance",
        "eyebrow": "📄 RESEARCH BRIEFING",
        "title": "Download the Research Briefing",
        "subtitle": "Receive the printable PDF version of the Programmable Finance & Institutional DeFi program directly by email.",
    },
    {
        "path": "en/research-programs/systemic-crypto-risk.html",
        "lang": "en",
        "trigger": "pdf_systemic_crypto_risk",
        "eyebrow": "📄 RESEARCH BRIEFING",
        "title": "Download the Research Briefing",
        "subtitle": "Receive the printable PDF version of the Systemic Risk & Crypto-Assets program directly by email.",
    },
    {
        "path": "en/research-programs/tokenization-infrastructure.html",
        "lang": "en",
        "trigger": "pdf_tokenization_infrastructure",
        "eyebrow": "📄 RESEARCH BRIEFING",
        "title": "Download the Research Briefing",
        "subtitle": "Receive the printable PDF version of the Tokenization Infrastructure & Standards program directly by email.",
    },
]

BUTTON_STYLE = (
    "background: rgba(59, 130, 246, 0.1); "
    "border: 1px solid rgba(59, 130, 246, 0.3); "
    "color: #60a5fa; padding: 6px 14px; border-radius: 6px; "
    "font-weight: 600; font-size: 12px; cursor: pointer; "
    "display: inline-flex; align-items: center; gap: 6px; "
    "font-family: 'Outfit';"
)
LINK_STYLE = "color: #c9a84c; text-decoration: none; font-size: 14px; font-weight: 600;"


def build_button(cfg):
    label = "Télécharger la Note PDF" if cfg["lang"] == "fr" else "Download PDF Note"
    onclick = (
        "window.DCMLeadCapture.show({"
        " trigger: '" + cfg["trigger"] + "',"
        " eyebrow: '" + cfg["eyebrow"] + "',"
        " title: '" + cfg["title"] + "',"
        " subtitle: '" + cfg["subtitle"] + "'"
        " })"
    )
    return (
        '<button onclick="' + onclick + '" style="' + BUTTON_STYLE + '">'
        '<i class="far fa-file-pdf"></i> ' + label + '</button>'
    )


def already_armed(html):
    return "supabase-config.js" in html


def transform(html, cfg):
    changes = []

    if already_armed(html):
        return html, ["SKIP — already armed"]

    # 1. Remove orphan <global-footer>
    gf_re = re.compile(r"[ \t]*<global-footer[^>]*>\s*</global-footer>\s*\n?")
    n = len(gf_re.findall(html))
    if n:
        html = gf_re.sub("", html)
        changes.append(f"Removed {n} <global-footer> tag(s)")

    # 2. Inject scripts before </body>
    scripts = (
        '    <script src="../../js/supabase-config.js"></script>\n'
        '    <script src="../../js/lead-capture-modal.js"></script>\n'
    )
    body_re = re.compile(r"(</body>)", re.IGNORECASE)
    if body_re.search(html):
        html = body_re.sub(scripts + r"\1", html, count=1)
        changes.append("Injected supabase-config.js + lead-capture-modal.js")

    # 3. Patch .lead-card: find the <a> inside lead-info and wrap with flex + button
    btn = build_button(cfg)

    # Pattern: captures the anchor tag and the closing </div></div> after it
    anchor_re = re.compile(
        r"(<a\s[^>]*>.*?</a>)([\s\n]*</div>[\s\n]*</div>)",
        re.DOTALL
    )

    def patch_anchor(m):
        a_raw = m.group(1).strip()
        closing = m.group(2)
        # Add style to link if not already present
        if 'style="' not in a_raw:
            a_raw = a_raw.replace("<a ", '<a style="' + LINK_STYLE + '" ', 1)
        flex_block = (
            "\n                "
            '<div style="display: flex; gap: 15px; align-items: center; margin-top: 10px; flex-wrap: wrap;">\n'
            "                    " + a_raw + "\n"
            "                    " + btn + "\n"
            "                </div>"
        )
        return flex_block + closing

    # Only patch inside the first .lead-card block to avoid touching nav/footer anchors
    lead_card_re = re.compile(r'(<div class="lead-card">.*?</div>\s*</div>)', re.DOTALL)
    lc_match = lead_card_re.search(html)
    if lc_match:
        original_block = lc_match.group(0)
        patched_block, n_subs = anchor_re.subn(patch_anchor, original_block, count=1)
        if n_subs:
            html = html.replace(original_block, patched_block, 1)
            changes.append("Hooked PDF button into .lead-card")
        else:
            changes.append("WARNING: anchor in .lead-card not matched — button NOT added")
    else:
        changes.append("WARNING: .lead-card block not found — button NOT added")

    return html, changes


def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    print(f"Base: {base_dir}\n")
    total = 0

    for cfg in PAGES:
        fpath = os.path.join(base_dir, cfg["path"])
        if not os.path.exists(fpath):
            print(f"[MISS]  {cfg['path']}")
            continue

        with open(fpath, "r", encoding="utf-8") as f:
            original = f.read()

        result, changes = transform(original, cfg)

        if any("SKIP" in c for c in changes):
            print(f"[SKIP]  {cfg['path']}")
            continue

        with open(fpath, "w", encoding="utf-8") as f:
            f.write(result)

        total += 1
        print(f"[OK]    {cfg['path']}")
        for c in changes:
            print(f"        ✓ {c}")

    print(f"\n{'='*60}")
    print(f"Done. {total}/{len(PAGES)} files modified.")


if __name__ == "__main__":
    main()
