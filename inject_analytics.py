import os
import glob
from bs4 import BeautifulSoup

# Define snippet
ANALYTICS_SNIPPET = """
    <!-- Google Analytics (GA4) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-486THQXM9D"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-486THQXM9D');
    </script>
    
    <!-- Hotjar Tracking Code -->
    <script>
        (function(h,o,t,j,a,r){
            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
            h._hjSettings={hjid:'YOUR_HOTJAR_ID_HERE',hjsv:6};
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
        })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
    </script>
"""

# HTML Files
html_files = glob.glob('*.html') + glob.glob('networks/*.html')

for file in html_files:
    if "backup" in file or "old" in file:
        continue
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Only inject if not already present
    if "G-486THQXM9D" not in content and "</head>" in content:
        content = content.replace("</head>", f"{ANALYTICS_SNIPPET}</head>")
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Injecting into {file}")

print("Analytics injection complete.")
