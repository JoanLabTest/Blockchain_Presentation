#!/usr/bin/env python3
"""
Script to create standalone Web3 Banking site (web3.html)
Extracts Web3 & NFT content and creates a professional dedicated site
"""

# Read the Web3 content
with open('/Users/joanl/blockchain-presentation/web3-nft-section.html', 'r', encoding='utf-8') as f:
    web3_content = f.read()

# Create the complete web3.html file
web3_html = '''<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web3 Banking - Infrastructure Financière Programmable</title>

    <!-- FONTS & ICONS -->
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">

    <!-- STYLESHEETS -->
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="styles-navigation.css">
    <link rel="stylesheet" href="styles-mobile.css">
    <link rel="stylesheet" href="styles-web3.css">
    <link rel="stylesheet" href="styles-logo-dropdown.css">

    <style>
        /* Web3 Banking Specific Styles */
        :root {
            --primary-web3: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            --secondary-web3: linear-gradient(135deg, #00d4ff 0%, #667eea 100%);
            --accent-web3-cyan: #00d4ff;
            --accent-web3-purple: #764ba2;
        }

        body {
            background: linear-gradient(180deg, #0b1121 0%, #1e293b 100%);
        }

        /* Hero Section */
        .web3-hero {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 120px 20px 80px;
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
            position: relative;
            overflow: hidden;
        }

        .web3-hero::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(circle at 50% 50%, rgba(0, 212, 255, 0.1) 0%, transparent 50%);
            animation: pulse 4s ease-in-out infinite;
        }

        @keyframes pulse {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
        }

        .web3-hero-content {
            max-width: 900px;
            margin: 0 auto;
            position: relative;
            z-index: 1;
        }

        .web3-badge {
            display: inline-block;
            background: rgba(0, 212, 255, 0.1);
            border: 1px solid rgba(0, 212, 255, 0.3);
            color: var(--accent-web3-cyan);
            padding: 10px 25px;
            border-radius: 50px;
            font-weight: 700;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 30px;
        }

        .web3-hero h1 {
            font-size: clamp(3rem, 8vw, 5rem);
            font-weight: 800;
            margin-bottom: 30px;
            background: linear-gradient(135deg, #00d4ff, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            line-height: 1.2;
        }

        .web3-hero p {
            font-size: 1.3rem;
            color: var(--text-secondary);
            margin-bottom: 50px;
            line-height: 1.8;
        }

        .web3-cta-group {
            display: flex;
            gap: 20px;
            justify-content: center;
            flex-wrap: wrap;
        }

        .web3-cta {
            padding: 18px 40px;
            border-radius: 50px;
            font-weight: 700;
            font-size: 1.1rem;
            text-decoration: none;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 10px;
        }

        .web3-cta-primary {
            background: var(--primary-web3);
            color: white;
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
        }

        .web3-cta-primary:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 40px rgba(102, 126, 234, 0.6);
        }

        .web3-cta-secondary {
            background: transparent;
            border: 2px solid var(--accent-web3-cyan);
            color: var(--accent-web3-cyan);
        }

        .web3-cta-secondary:hover {
            background: rgba(0, 212, 255, 0.1);
            transform: translateY(-3px);
        }

        /* Navigation Override for Web3 */
        .navbar-pro {
            background: rgba(11, 17, 33, 0.98);
        }

        .nav-logo {
            background: var(--primary-web3);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .web3-hero {
                min-height: 80vh;
                padding: 100px 20px 60px;
            }

            .web3-cta-group {
                flex-direction: column;
                align-items: stretch;
            }

            .web3-cta {
                justify-content: center;
            }
        }
    </style>
</head>

<body>

    <!-- NAVIGATION -->
    <nav class="navbar-pro">
        <!-- Logo Dropdown -->
        <div class="nav-logo-dropdown">
            <div class="nav-logo">
                <i class="fas fa-cube"></i>
                WEB3 <span style="color:#00d4ff">BANKING</span>
                <i class="fas fa-chevron-down" style="font-size: 0.7rem; margin-left: 8px;"></i>
            </div>
            <div class="nav-logo-menu">
                <a href="index.html" class="logo-menu-item">
                    <i class="fas fa-briefcase"></i>
                    <div>
                        <strong>Blockchain Pro</strong>
                        <span>Version Expert - 23 sections</span>
                    </div>
                </a>
                <a href="simple.html" class="logo-menu-item">
                    <i class="fas fa-graduation-cap"></i>
                    <div>
                        <strong>Blockchain Academy</strong>
                        <span>Version Découverte - 5 slides</span>
                    </div>
                </a>
                <a href="index-simple.html" class="logo-menu-item">
                    <i class="fas fa-chart-line"></i>
                    <div>
                        <strong>DCM Digital</strong>
                        <span>Version Pitch - 6 sections</span>
                    </div>
                </a>
                <a href="web3.html" class="logo-menu-item active">
                    <i class="fas fa-cube"></i>
                    <div>
                        <strong>Web3 Banking</strong>
                        <span>Infrastructure Programmable - 8 modules</span>
                    </div>
                </a>
                <a href="quiz.html" class="logo-menu-item">
                    <i class="fas fa-award" style="color:#f59e0b;"></i>
                    <div>
                        <strong>Quiz Certification</strong>
                        <span>Testez vos connaissances - 20 questions</span>
                    </div>
                </a>
            </div>
        </div>

        <!-- Navigation Links -->
        <div class="nav-links-pro">
            <a href="#introduction">Introduction</a>
            <a href="#web3-pillars">Comprendre Web3</a>
            <a href="#nft-redefini">NFT Redéfini</a>
            <a href="#cas-usage">Cas d'Usage</a>
            <a href="#role-banque">Rôle Banque</a>
            <a href="#architecture">Architecture</a>
            <a href="#conformite">Conformité</a>
            <a href="#vision">Vision</a>
        </div>

        <!-- Mobile Menu Toggle -->
        <button class="mobile-menu-toggle" aria-label="Toggle menu">
            <span></span>
            <span></span>
            <span></span>
        </button>
    </nav>

    <!-- HERO SECTION -->
    <section class="web3-hero">
        <div class="web3-hero-content" data-aos="fade-up">
            <div class="web3-badge">
                <i class="fas fa-cube"></i> Infrastructure Financière du Futur
            </div>
            <h1>Web3 & NFT Banking</h1>
            <p>
                Guide institutionnel pour comprendre et intégrer le Web3 dans la banque.
                Démystifier les NFT, explorer les cas d'usage concrets, et maîtriser l'infrastructure programmable.
            </p>
            <div class="web3-cta-group">
                <a href="#introduction" class="web3-cta web3-cta-primary">
                    <i class="fas fa-rocket"></i>
                    Explorer l'Infrastructure Web3
                </a>
                <a href="index.html" class="web3-cta web3-cta-secondary">
                    <i class="fas fa-arrow-left"></i>
                    Retour au Site Expert
                </a>
            </div>
        </div>
    </section>

    <!-- WEB3 CONTENT -->
''' + web3_content + '''

    <!-- FOOTER -->
    <footer id="contact" style="width: 100%; background: linear-gradient(180deg, #1e293b, #000); padding: 80px 20px; text-align: center; border-top: 1px solid #334155; margin-top: 100px;">
        <div style="max-width: 800px; margin: 0 auto;">
            <div style="width: 120px; height: 120px; border-radius: 50%; background: linear-gradient(135deg, #667eea, #764ba2); border: 3px solid #00d4ff; margin: 0 auto 20px auto; display: flex; align-items: center; justify-content: center; font-size: 40px; color: white;">
                <i class="fas fa-cube"></i>
            </div>
            <h2 style="border: none; margin: 0; color: white; font-size: 36px; justify-content: center;">Web3 Banking</h2>
            <p style="font-size: 18px; color: #94a3b8; margin-top: 10px;">Infrastructure Financière Programmable</p>

            <div style="display: flex; gap: 20px; justify-content: center; margin-top: 40px; flex-wrap: wrap;">
                <a href="index.html" style="display: inline-flex; align-items: center; gap: 10px; background: transparent; border: 2px solid #3b82f6; color: #3b82f6; padding: 15px 30px; border-radius: 50px; text-decoration: none; font-weight: bold; transition: all 0.2s;">
                    <i class="fas fa-briefcase"></i> Blockchain Pro
                </a>
                <a href="simple.html" style="display: inline-flex; align-items: center; gap: 10px; background: transparent; border: 2px solid #a855f7; color: #a855f7; padding: 15px 30px; border-radius: 50px; text-decoration: none; font-weight: bold; transition: all 0.2s;">
                    <i class="fas fa-graduation-cap"></i> Academy
                </a>
                <a href="index-simple.html" style="display: inline-flex; align-items: center; gap: 10px; background: transparent; border: 2px solid #10b981; color: #10b981; padding: 15px 30px; border-radius: 50px; text-decoration: none; font-weight: bold; transition: all 0.2s;">
                    <i class="fas fa-chart-line"></i> DCM Digital
                </a>
            </div>

            <p style="margin-top: 50px; font-size: 12px; color: #64748b;">
                © 2026 Web3 Banking. Tous droits réservés.
            </p>
        </div>
    </footer>

    <!-- SCRIPTS -->
    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    <script>AOS.init({ duration: 800, once: true });</script>

    <!-- Mobile Menu Script -->
    <script>
        // Mobile menu toggle
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const navLinks = document.querySelector('.nav-links-pro');

        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', function() {
                this.classList.toggle('active');
                navLinks.classList.toggle('active');
            });

            // Close menu when clicking on a link
            document.querySelectorAll('.nav-links-pro a').forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenuToggle.classList.remove('active');
                    navLinks.classList.remove('active');
                });
            });
        }

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    </script>

</body>
</html>
'''

# Write the file
with open('/Users/joanl/blockchain-presentation/web3.html', 'w', encoding='utf-8') as f:
    f.write(web3_html)

print("✅ web3.html created successfully!")
print(f"📊 File size: {len(web3_html)} characters")
print("🎯 Location: /Users/joanl/blockchain-presentation/web3.html")
