#!/usr/bin/env python3
"""
Script to merge legal_pilot.html with enhanced sections
"""

# Read the original file
with open('legal_pilot.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the insertion point (after the reg-details-section)
insertion_marker = '</section>\n\n    <!-- SCRIPTS -->'

# New enhanced sections to add
enhanced_sections = '''
    <!-- ========================================= -->
    <!-- ENHANCED SECTIONS: RÉGIME PILOTE DÉTAILLÉ -->
    <!-- ========================================= -->

    <!-- SECTION: OBJECTIFS -->
    <section class="pilot-objectives-section">
        <div class="section-container">
            <div class="section-header" data-aos="fade-up">
                <span class="section-number">01</span>
                <h2>Objectifs du Régime Pilote</h2>
                <p class="section-subtitle">Trois piliers fondamentaux pour l'innovation financière européenne</p>
            </div>
            
            <div class="objectives-grid">
                <div class="objective-card-3d" data-aos="flip-left" data-aos-delay="100">
                    <div class="card-glow"></div>
                    <div class="objective-icon-3d">
                        <i class="fas fa-lightbulb"></i>
                    </div>
                    <h3>Innovation</h3>
                    <p>Encourager l'innovation dans les infrastructures financières via la technologie blockchain pour le trading et le règlement.</p>
                    <div class="card-particles"></div>
                </div>
                
                <div class="objective-card-3d" data-aos="flip-left" data-aos-delay="200">
                    <div class="card-glow"></div>
                    <div class="objective-icon-3d">
                        <i class="fas fa-shield-alt"></i>
                    </div>
                    <h3>Protection</h3>
                    <p>Maintenir un haut niveau de protection des investisseurs et garantir l'intégrité des marchés financiers.</p>
                    <div class="card-particles"></div>
                </div>
                
                <div class="objective-card-3d" data-aos="flip-left" data-aos-delay="300">
                    <div class="card-glow"></div>
                    <div class="objective-icon-3d">
                        <i class="fas fa-flask"></i>
                    </div>
                    <h3>Expérimentation</h3>
                    <p>Permettre aux acteurs de tester la DLT sans être immédiatement soumis à MiFID II ou CSDR.</p>
                    <div class="card-particles"></div>
                </div>
            </div>
        </div>
    </section>

    <!-- SECTION: INFRASTRUCTURES DLT -->
    <section class="pilot-infrastructure-section">
        <div class="section-container">
            <div class="section-header" data-aos="fade-up">
                <span class="section-number">02</span>
                <h2>Types d'Infrastructures DLT</h2>
                <p class="section-subtitle">Trois catégories d'infrastructures blockchain autorisées</p>
            </div>
            
            <div class="infrastructure-flow-3d">
                <!-- DLT MTF -->
                <div class="infra-card-3d mtf" data-aos="zoom-in" data-aos-delay="100">
                    <div class="infra-header-3d">
                        <div class="infra-icon-3d">
                            <i class="fas fa-chart-line"></i>
                        </div>
                        <div>
                            <h3>DLT MTF</h3>
                            <span class="infra-subtitle">Multilateral Trading Facility</span>
                        </div>
                    </div>
                    <p class="infra-desc">Plateforme multilatérale de négociation pour titres tokenisés. Permet le trading d'instruments financiers sur blockchain.</p>
                    <div class="infra-features">
                        <span class="feature-tag"><i class="fas fa-check"></i> Trading</span>
                        <span class="feature-tag"><i class="fas fa-check"></i> Order Book</span>
                    </div>
                </div>

                <div class="flow-arrow-3d" data-aos="fade-in">
                    <i class="fas fa-arrow-right"></i>
                </div>

                <!-- DLT SS -->
                <div class="infra-card-3d ss" data-aos="zoom-in" data-aos-delay="200">
                    <div class="infra-header-3d">
                        <div class="infra-icon-3d">
                            <i class="fas fa-exchange-alt"></i>
                        </div>
                        <div>
                            <h3>DLT SS</h3>
                            <span class="infra-subtitle">Settlement System</span>
                        </div>
                    </div>
                    <p class="infra-desc">Système de règlement pour titres tokenisés. Gère le règlement-livraison des transactions sur blockchain.</p>
                    <div class="infra-features">
                        <span class="feature-tag"><i class="fas fa-check"></i> Settlement</span>
                        <span class="feature-tag"><i class="fas fa-check"></i> DvP</span>
                    </div>
                </div>

                <div class="flow-arrow-3d" data-aos="fade-in">
                    <i class="fas fa-arrow-right"></i>
                </div>

                <!-- DLT TSS -->
                <div class="infra-card-3d tss" data-aos="zoom-in" data-aos-delay="300">
                    <div class="infra-header-3d">
                        <div class="infra-icon-3d">
                            <i class="fas fa-layer-group"></i>
                        </div>
                        <div>
                            <h3>DLT TSS</h3>
                            <span class="infra-subtitle">Trading & Settlement System</span>
                        </div>
                    </div>
                    <p class="infra-desc">Système combiné de négociation et de règlement. Solution intégrée pour trading et settlement atomique (T+0).</p>
                    <div class="infra-features">
                        <span class="feature-tag"><i class="fas fa-check"></i> Trading</span>
                        <span class="feature-tag"><i class="fas fa-check"></i> Settlement</span>
                        <span class="feature-tag"><i class="fas fa-check"></i> Atomic</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- SECTION: AUTORITÉS -->
    <section class="pilot-authorities-section">
        <div class="section-container">
            <div class="section-header" data-aos="fade-up">
                <span class="section-number">03</span>
                <h2>Autorités Compétentes</h2>
                <p class="section-subtitle">Supervision et coordination européenne</p>
            </div>
            
            <div class="authorities-grid-3d">
                <!-- AMF -->
                <div class="authority-card-3d" data-aos="flip-up" data-aos-delay="100">
                    <div class="authority-logo-3d">
                        <i class="fas fa-landmark"></i>
                    </div>
                    <h3>AMF</h3>
                    <p class="authority-role">Autorité des Marchés Financiers</p>
                    <ul class="authority-responsibilities">
                        <li><i class="fas fa-check"></i> Supervision des marchés</li>
                        <li><i class="fas fa-check"></i> Surveillance des infrastructures</li>
                        <li><i class="fas fa-check"></i> Protection des investisseurs</li>
                    </ul>
                </div>

                <!-- ACPR -->
                <div class="authority-card-3d" data-aos="flip-up" data-aos-delay="200">
                    <div class="authority-logo-3d">
                        <i class="fas fa-university"></i>
                    </div>
                    <h3>ACPR</h3>
                    <p class="authority-role">Autorité de Contrôle Prudentiel</p>
                    <ul class="authority-responsibilities">
                        <li><i class="fas fa-check"></i> Supervision prudentielle</li>
                        <li><i class="fas fa-check"></i> Contrôle des acteurs financiers</li>
                        <li><i class="fas fa-check"></i> Gestion des risques</li>
                    </ul>
                </div>

                <!-- ESMA -->
                <div class="authority-card-3d" data-aos="flip-up" data-aos-delay="300">
                    <div class="authority-logo-3d">
                        <i class="fas fa-globe-europe"></i>
                    </div>
                    <h3>ESMA</h3>
                    <p class="authority-role">European Securities and Markets Authority</p>
                    <ul class="authority-responsibilities">
                        <li><i class="fas fa-check"></i> Coordination européenne</li>
                        <li><i class="fas fa-check"></i> Lignes directrices</li>
                        <li><i class="fas fa-check"></i> Harmonisation réglementaire</li>
                    </ul>
                </div>
            </div>
        </div>
    </section>

    <!-- SECTION: TIMELINE -->
    <section class="pilot-timeline-section">
        <div class="section-container">
            <div class="section-header" data-aos="fade-up">
                <span class="section-number">04</span>
                <h2>Timeline du Régime Pilote</h2>
                <p class="section-subtitle">Évolution et perspectives 2022-2026</p>
            </div>
            
            <div class="timeline-container-3d">
                <div class="timeline-line-3d"></div>
                
                <div class="timeline-event-3d" data-aos="fade-right">
                    <div class="timeline-dot-3d"></div>
                    <div class="timeline-content-3d">
                        <span class="timeline-date">2022</span>
                        <h4>Adoption du Règlement</h4>
                        <p>Publication du Règlement (UE) 2022/858 établissant le cadre du régime pilote DLT.</p>
                    </div>
                </div>

                <div class="timeline-event-3d" data-aos="fade-left">
                    <div class="timeline-dot-3d active"></div>
                    <div class="timeline-content-3d">
                        <span class="timeline-date">2023</span>
                        <h4>Mise en Œuvre</h4>
                        <p>Entrée en vigueur du régime pilote. Premières demandes d'autorisation déposées.</p>
                    </div>
                </div>

                <div class="timeline-event-3d" data-aos="fade-right">
                    <div class="timeline-dot-3d future"></div>
                    <div class="timeline-content-3d">
                        <span class="timeline-date">2026</span>
                        <h4>Extension Potentielle</h4>
                        <p>Évaluation du régime et possibilité d'extension ou d'intégration dans le cadre réglementaire permanent.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

'''

# CSS for enhanced sections
enhanced_css = '''
        /* ========================================= */
        /* ENHANCED SECTIONS STYLES */
        /* ========================================= */
        
        .section-container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 40px;
        }
        
        .section-header {
            text-align: center;
            margin-bottom: 60px;
        }
        
        .section-number {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            border-radius: 16px;
            font-size: 24px;
            font-weight: 800;
            color: white;
            margin-bottom: 20px;
            box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
        }
        
        .section-header h2 {
            font-size: 42px;
            font-weight: 800;
            color: white;
            margin-bottom: 15px;
        }
        
        .section-subtitle {
            font-size: 18px;
            color: var(--text-muted);
        }
        
        /* OBJECTIVES SECTION */
        .pilot-objectives-section {
            background: linear-gradient(180deg, #020617 0%, #0f172a 100%);
            padding: 100px 0;
            position: relative;
        }
        
        .objectives-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 40px;
        }
        
        .objective-card-3d {
            background: rgba(30, 41, 59, 0.6);
            backdrop-filter: blur(15px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 24px;
            padding: 40px;
            position: relative;
            overflow: hidden;
            transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
            transform-style: preserve-3d;
        }
        
        .objective-card-3d:hover {
            transform: translateY(-10px) rotateX(5deg);
            border-color: rgba(59, 130, 246, 0.5);
            box-shadow: 0 20px 60px rgba(59, 130, 246, 0.3);
        }
        
        .card-glow {
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
            opacity: 0;
            transition: opacity 0.5s;
        }
        
        .objective-card-3d:hover .card-glow {
            opacity: 1;
        }
        
        .objective-icon-3d {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 36px;
            margin-bottom: 25px;
            color: white;
            box-shadow: 0 10px 30px rgba(59, 130, 246, 0.4);
            transform: translateZ(20px);
        }
        
        .objective-card-3d h3 {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 15px;
            color: #f1f5f9;
        }
        
        .objective-card-3d p {
            font-size: 15px;
            color: #94a3b8;
            line-height: 1.7;
        }
        
        /* INFRASTRUCTURE SECTION */
        .pilot-infrastructure-section {
            background: #0f172a;
            padding: 100px 0;
            position: relative;
        }
        
        .infrastructure-flow-3d {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 30px;
            flex-wrap: wrap;
        }
        
        .infra-card-3d {
            flex: 1;
            min-width: 320px;
            background: rgba(30, 41, 59, 0.6);
            backdrop-filter: blur(15px);
            border: 2px solid rgba(255, 255, 255, 0.1);
            border-radius: 24px;
            padding: 35px;
            transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
            transform-style: preserve-3d;
        }
        
        .infra-card-3d.mtf {
            border-top-color: #3b82f6;
        }
        
        .infra-card-3d.ss {
            border-top-color: #10b981;
        }
        
        .infra-card-3d.tss {
            border-top-color: #8b5cf6;
        }
        
        .infra-card-3d:hover {
            transform: translateY(-10px) scale(1.02);
            box-shadow: 0 20px 60px rgba(59, 130, 246, 0.4);
        }
        
        .infra-header-3d {
            display: flex;
            align-items: center;
            gap: 20px;
            margin-bottom: 20px;
        }
        
        .infra-icon-3d {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            color: white;
            box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
        }
        
        .infra-card-3d h3 {
            font-size: 26px;
            font-weight: 700;
            color: #f1f5f9;
            margin: 0;
        }
        
        .infra-subtitle {
            font-size: 12px;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 1.5px;
        }
        
        .infra-desc {
            font-size: 15px;
            color: #94a3b8;
            line-height: 1.7;
            margin-bottom: 20px;
        }
        
        .infra-features {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }
        
        .feature-tag {
            background: rgba(16, 185, 129, 0.2);
            color: #10b981;
            padding: 6px 14px;
            border-radius: 14px;
            font-size: 13px;
            font-weight: 600;
            border: 1px solid rgba(16, 185, 129, 0.3);
        }
        
        .flow-arrow-3d {
            font-size: 40px;
            color: #3b82f6;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 0.5; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.1); }
        }
        
        /* AUTHORITIES SECTION */
        .pilot-authorities-section {
            background: linear-gradient(180deg, #0f172a 0%, #020617 100%);
            padding: 100px 0;
        }
        
        .authorities-grid-3d {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 40px;
        }
        
        .authority-card-3d {
            background: rgba(30, 41, 59, 0.6);
            backdrop-filter: blur(15px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 24px;
            padding: 40px;
            text-align: center;
            transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
            transform-style: preserve-3d;
        }
        
        .authority-card-3d:hover {
            transform: translateY(-10px) rotateY(5deg);
            border-color: rgba(59, 130, 246, 0.5);
            box-shadow: 0 20px 60px rgba(59, 130, 246, 0.3);
        }
        
        .authority-logo-3d {
            width: 100px;
            height: 100px;
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 44px;
            margin: 0 auto 25px;
            color: white;
            box-shadow: 0 15px 40px rgba(59, 130, 246, 0.4);
        }
        
        .authority-card-3d h3 {
            font-size: 28px;
            font-weight: 800;
            margin-bottom: 10px;
            color: #f1f5f9;
        }
        
        .authority-role {
            font-size: 14px;
            color: #64748b;
            margin-bottom: 25px;
        }
        
        .authority-responsibilities {
            list-style: none;
            padding: 0;
            text-align: left;
        }
        
        .authority-responsibilities li {
            padding: 10px 0;
            color: #94a3b8;
            font-size: 15px;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .authority-responsibilities i {
            color: #10b981;
        }
        
        /* TIMELINE SECTION */
        .pilot-timeline-section {
            background: #020617;
            padding: 100px 0;
            position: relative;
        }
        
        .timeline-container-3d {
            position: relative;
            padding: 60px 0;
        }
        
        .timeline-line-3d {
            position: absolute;
            left: 50%;
            top: 0;
            bottom: 0;
            width: 4px;
            background: linear-gradient(180deg, #3b82f6, #10b981);
            transform: translateX(-50%);
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
        }
        
        .timeline-event-3d {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 80px;
            position: relative;
        }
        
        .timeline-dot-3d {
            width: 24px;
            height: 24px;
            background: #64748b;
            border-radius: 50%;
            border: 5px solid #0f172a;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            z-index: 2;
            box-shadow: 0 0 20px rgba(100, 116, 139, 0.5);
        }
        
        .timeline-dot-3d.active {
            background: #10b981;
            box-shadow: 0 0 30px rgba(16, 185, 129, 0.8);
            animation: pulse 2s infinite;
        }
        
        .timeline-dot-3d.future {
            background: #3b82f6;
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
        }
        
        .timeline-content-3d {
            background: rgba(30, 41, 59, 0.6);
            backdrop-filter: blur(15px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 30px;
            max-width: 450px;
            margin-left: calc(50% + 50px);
            transition: all 0.5s;
        }
        
        .timeline-event-3d:nth-child(even) .timeline-content-3d {
            margin-left: 0;
            margin-right: calc(50% + 50px);
        }
        
        .timeline-content-3d:hover {
            transform: scale(1.05);
            border-color: rgba(59, 130, 246, 0.5);
            box-shadow: 0 10px 40px rgba(59, 130, 246, 0.3);
        }
        
        .timeline-date {
            display: inline-block;
            background: linear-gradient(90deg, #3b82f6, #8b5cf6);
            color: white;
            padding: 6px 16px;
            border-radius: 16px;
            font-size: 14px;
            font-weight: 700;
            margin-bottom: 15px;
        }
        
        .timeline-content-3d h4 {
            font-size: 22px;
            font-weight: 700;
            margin-bottom: 10px;
            color: #f1f5f9;
        }
        
        .timeline-content-3d p {
            font-size: 15px;
            color: #94a3b8;
            margin: 0;
            line-height: 1.7;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
            .infrastructure-flow-3d {
                flex-direction: column;
            }
            
            .flow-arrow-3d {
                transform: rotate(90deg);
            }
            
            .timeline-content-3d {
                margin-left: 60px !important;
                margin-right: 0 !important;
            }
            
            .timeline-line-3d {
                left: 12px;
            }
            
            .timeline-dot-3d {
                left: 12px;
            }
        }
'''

# Insert the CSS before the closing </style> tag
content = content.replace('    </style>', enhanced_css + '    </style>')

# Insert the HTML sections before the SCRIPTS comment
content = content.replace(insertion_marker, enhanced_sections + insertion_marker)

# Add AOS library before closing </head>
aos_library = '''    <!-- AOS (Animate On Scroll) -->
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
'''
content = content.replace('</head>', aos_library + '</head>')

# Add AOS initialization script before closing </body>
aos_init = '''    <!-- AOS Init -->
    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    <script>
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 100
        });
    </script>
'''
content = content.replace('</body>', aos_init + '</body>')

# Write the merged file
with open('legal_pilot.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Merge completed successfully!")
print("📄 File: legal_pilot.html")
print("🎨 Added: 4 new enhanced sections with 3D effects")
print("📦 Libraries: AOS animations integrated")
