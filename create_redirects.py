import os

redirects = [
    ("buidl.html", "https://dcmcore.com/en/buidl/", "/en/buidl/"),
    ("en/buidl.html", "https://dcmcore.com/en/buidl/", "/en/buidl/"),
    ("fr/buidl.html", "https://dcmcore.com/fr/buidl/", "/fr/buidl/"),
    ("en/academy.html", "https://dcmcore.com/en/academy/", "/en/academy/"),
    ("en/simple.html", "https://dcmcore.com/en/learn/", "/en/learn/"),
    ("en/guide.html", "https://dcmcore.com/en/expert/", "/en/expert/"),
    ("en/quiz.html", "https://dcmcore.com/en/academy/pro/", "/en/academy/pro/"),
    ("fr/academy.html", "https://dcmcore.com/fr/academy/", "/fr/academy/"),
    ("fr/simple.html", "https://dcmcore.com/fr/learn/", "/fr/learn/"),
    ("fr/guide.html", "https://dcmcore.com/fr/expert/", "/fr/expert/"),
    ("fr/quiz.html", "https://dcmcore.com/fr/academy/pro/", "/fr/academy/pro/")
]

base_dir = "/Users/joanl/blockchain-presentation"

template = """<!DOCTYPE html>
<html lang="{lang}">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="0; url={target_url}">
    <link rel="canonical" href="{canonical_url}">
    <title>Redirecting...</title>
    <script>
        window.location.replace("{target_url}");
    </script>
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

