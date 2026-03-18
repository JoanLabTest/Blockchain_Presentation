import os

redirects = [
    ("en/academy.html", "https://dcmcore.com/en/academy/", "/en/academy/index.html"),
    ("en/simple.html", "https://dcmcore.com/en/learn/", "/en/learn/index.html"),
    ("en/guide.html", "https://dcmcore.com/en/expert/", "/en/expert/index.html"),
    ("en/quiz.html", "https://dcmcore.com/en/academy/pro/", "/en/academy/pro/index.html"),
    ("fr/academy.html", "https://dcmcore.com/fr/academy/", "/fr/academy/index.html"),
    ("fr/simple.html", "https://dcmcore.com/fr/learn/", "/fr/learn/index.html"),
    ("fr/guide.html", "https://dcmcore.com/fr/expert/", "/fr/expert/index.html"),
    ("fr/quiz.html", "https://dcmcore.com/fr/academy/pro/", "/fr/academy/pro/index.html")
]

base_dir = "/Users/joanl/blockchain-presentation"

template = """<!DOCTYPE html>
<html lang="{lang}">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="0; url={target_url}">
    <link rel="canonical" href="{canonical_url}">
    <title>Redirecting...</title>
</head>
<body>
    <p>If you are not redirected automatically, follow this <a href="{target_url}">link</a>.</p>
</body>
</html>"""

def create_redirect(file_path, canonical_url, target_url):
    lang = "en" if file_path.startswith("en/") else "fr"
    content = template.format(lang=lang, target_url=target_url, canonical_url=canonical_url)
    abs_path = os.path.join(base_dir, file_path)
    with open(abs_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Created redirect: {file_path}")

for file_path, canonical_url, target_url in redirects:
    create_redirect(file_path, canonical_url, target_url)
