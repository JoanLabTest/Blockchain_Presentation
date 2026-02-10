#!/usr/bin/env python3
"""
Script to enhance simple.html with comprehensive educational sections
"""

# Read the original file
with open('simple.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find the insertion point (before footer)
footer_line = None
for i, line in enumerate(lines):
    if '<!-- SUPER FOOTER -->' in line:
        footer_line = i
        break

if footer_line is None:
    print("❌ Footer marker not found!")
    exit(1)

# New enhanced sections HTML
enhanced_sections_html = '''
    <!-- ========================================= -->
    <!-- ENHANCED EDUCATIONAL SECTIONS -->
    <!-- ========================================= -->

    <!-- SECTION 1: QU'EST-CE QUE LA BLOCKCHAIN? -->
    <div class="slide educational-section" data-aos="fade-up" id="blockchain-definition">
        <h2 class="section-title">
            <span class="section-number">01</span>
            <span data-i18n="section1_title">Qu'est-ce que la Blockchain ?</span>
        </h2>
        
        <div class="content-grid">
            <div class="content-main">
                <div class="definition-card" data-aos="zoom-in">
                    <div class="def-icon">
                        <i class="fas fa-link"></i>
                    </div>
                    <h3 data-i18n="blockchain_def_title">Définition Simple</h3>
                    <p data-i18n="blockchain_def_text">
                        La blockchain est un <strong>registre distribué</strong> qui enregistre des transactions de manière 
                        <strong>immuable et transparente</strong>, partagé entre plusieurs nœuds d'un réseau sans autorité centrale.
                    </p>
                </div>

                <div class="comparison-grid">
                    <div class="comparison-card traditional" data-aos="fade-right">
                        <div class="comp-header">
                            <i class="fas fa-database"></i>
                            <h4 data-i18n="traditional_db">Base de Données Traditionnelle</h4>
                        </div>
                        <ul class="comp-list">
                            <li><i class="fas fa-times-circle"></i> <span data-i18n="trad_central">Contrôle centralisé</span></li>
                            <li><i class="fas fa-times-circle"></i> <span data-i18n="trad_single">Point de défaillance unique</span></li>
                            <li><i class="fas fa-times-circle"></i> <span data-i18n="trad_modifiable">Données modifiables</span></li>
                            <li><i class="fas fa-times-circle"></i> <span data-i18n="trad_trust">Nécessite confiance</span></li>
                        </ul>
                    </div>

                    <div class="vs-divider">VS</div>

                    <div class="comparison-card blockchain" data-aos="fade-left">
                        <div class="comp-header">
                            <i class="fas fa-cubes"></i>
                            <h4 data-i18n="blockchain_tech">Blockchain</h4>
                        </div>
                        <ul class="comp-list">
                            <li><i class="fas fa-check-circle"></i> <span data-i18n="bc_distributed">Distribué sur réseau</span></li>
                            <li><i class="fas fa-check-circle"></i> <span data-i18n="bc_resilient">Résilient et redondant</span></li>
                            <li><i class="fas fa-check-circle"></i> <span data-i18n="bc_immutable">Immuable et traçable</span></li>
                            <li><i class="fas fa-check-circle"></i> <span data-i18n="bc_trustless">Sans tiers de confiance</span></li>
                        </ul>
                    </div>
                </div>

                <div class="benefits-grid">
                    <div class="benefit-card" data-aos="flip-up" data-aos-delay="100">
                        <i class="fas fa-shield-alt"></i>
                        <h4 data-i18n="benefit_security">Sécurité</h4>
                        <p data-i18n="benefit_security_desc">Cryptographie avancée et consensus distribué</p>
                    </div>
                    <div class="benefit-card" data-aos="flip-up" data-aos-delay="200">
                        <i class="fas fa-eye"></i>
                        <h4 data-i18n="benefit_transparency">Transparence</h4>
                        <p data-i18n="benefit_transparency_desc">Toutes les transactions sont visibles et vérifiables</p>
                    </div>
                    <div class="benefit-card" data-aos="flip-up" data-aos-delay="300">
                        <i class="fas fa-network-wired"></i>
                        <h4 data-i18n="benefit_decentralization">Décentralisation</h4>
                        <p data-i18n="benefit_decentralization_desc">Aucun point de contrôle unique</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- SECTION 2: ANATOMIE D'UN BLOC -->
    <div class="slide educational-section" data-aos="fade-up" id="block-anatomy">
        <h2 class="section-title">
            <span class="section-number">02</span>
            <span data-i18n="section2_title">Anatomie d'un Bloc</span>
        </h2>

        <div class="block-visualization" data-aos="zoom-in">
            <div class="block-chain-demo">
                <div class="demo-block" data-aos="fade-right">
                    <div class="block-header">
                        <span class="block-number">Bloc #100</span>
                    </div>
                    <div class="block-content">
                        <div class="block-field">
                            <i class="fas fa-clock"></i>
                            <div>
                                <strong data-i18n="block_timestamp">Horodatage</strong>
                                <span>2026-02-09 20:15:00</span>
                            </div>
                        </div>
                        <div class="block-field">
                            <i class="fas fa-exchange-alt"></i>
                            <div>
                                <strong data-i18n="block_transactions">Transactions</strong>
                                <span>Alice → Bob: 1.5 BTC</span>
                            </div>
                        </div>
                        <div class="block-field">
                            <i class="fas fa-link"></i>
                            <div>
                                <strong data-i18n="block_prev_hash">Hash Précédent</strong>
                                <span class="hash-text">0x7a8f...</span>
                            </div>
                        </div>
                        <div class="block-field">
                            <i class="fas fa-fingerprint"></i>
                            <div>
                                <strong data-i18n="block_hash">Hash du Bloc</strong>
                                <span class="hash-text">0x9c2e...</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="chain-arrow">
                    <i class="fas fa-arrow-right"></i>
                </div>

                <div class="demo-block" data-aos="fade-left">
                    <div class="block-header">
                        <span class="block-number">Bloc #101</span>
                    </div>
                    <div class="block-content">
                        <div class="block-field">
                            <i class="fas fa-clock"></i>
                            <div>
                                <strong data-i18n="block_timestamp">Horodatage</strong>
                                <span>2026-02-09 20:25:00</span>
                            </div>
                        </div>
                        <div class="block-field">
                            <i class="fas fa-exchange-alt"></i>
                            <div>
                                <strong data-i18n="block_transactions">Transactions</strong>
                                <span>Bob → Carol: 0.8 BTC</span>
                            </div>
                        </div>
                        <div class="block-field">
                            <i class="fas fa-link"></i>
                            <div>
                                <strong data-i18n="block_prev_hash">Hash Précédent</strong>
                                <span class="hash-text">0x9c2e...</span>
                            </div>
                        </div>
                        <div class="block-field">
                            <i class="fas fa-fingerprint"></i>
                            <div>
                                <strong data-i18n="block_hash">Hash du Bloc</strong>
                                <span class="hash-text">0x4b1a...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="immutability-explanation" data-aos="fade-up">
            <div class="alert-box">
                <i class="fas fa-lock"></i>
                <div>
                    <h4 data-i18n="immutability_title">Pourquoi c'est Immuable ?</h4>
                    <p data-i18n="immutability_text">
                        Chaque bloc contient le hash du bloc précédent. Si vous modifiez un bloc ancien, 
                        son hash change, ce qui invalide tous les blocs suivants. C'est comme un sceau de cire numérique !
                    </p>
                </div>
            </div>
        </div>
    </div>

    <!-- SECTION 3: CONSENSUS MECHANISMS -->
    <div class="slide educational-section" data-aos="fade-up" id="consensus">
        <h2 class="section-title">
            <span class="section-number">03</span>
            <span data-i18n="section3_title">Comment le Réseau s'Accorde ?</span>
        </h2>

        <p class="section-intro" data-i18n="consensus_intro">
            Les blockchains utilisent des mécanismes de consensus pour valider les transactions sans autorité centrale.
        </p>

        <div class="consensus-comparison">
            <div class="consensus-card pow" data-aos="flip-left">
                <div class="consensus-header">
                    <i class="fas fa-hammer"></i>
                    <h3>Proof of Work (PoW)</h3>
                </div>
                <div class="consensus-body">
                    <div class="consensus-visual">
                        <i class="fas fa-microchip"></i>
                        <span data-i18n="pow_mining">Mining</span>
                    </div>
                    <ul class="consensus-features">
                        <li><i class="fas fa-check"></i> <span data-i18n="pow_feature1">Résolution de puzzles cryptographiques</span></li>
                        <li><i class="fas fa-check"></i> <span data-i18n="pow_feature2">Sécurité par puissance de calcul</span></li>
                        <li><i class="fas fa-times"></i> <span data-i18n="pow_feature3">Consommation énergétique élevée</span></li>
                    </ul>
                    <div class="consensus-example">
                        <strong data-i18n="example">Exemple :</strong> Bitcoin
                    </div>
                </div>
            </div>

            <div class="consensus-card pos" data-aos="flip-right">
                <div class="consensus-header">
                    <i class="fas fa-coins"></i>
                    <h3>Proof of Stake (PoS)</h3>
                </div>
                <div class="consensus-body">
                    <div class="consensus-visual">
                        <i class="fas fa-hand-holding-usd"></i>
                        <span data-i18n="pos_staking">Staking</span>
                    </div>
                    <ul class="consensus-features">
                        <li><i class="fas fa-check"></i> <span data-i18n="pos_feature1">Validation par mise en jeu de tokens</span></li>
                        <li><i class="fas fa-check"></i> <span data-i18n="pos_feature2">Économe en énergie (99% moins)</span></li>
                        <li><i class="fas fa-check"></i> <span data-i18n="pos_feature3">Incitations économiques</span></li>
                    </ul>
                    <div class="consensus-example">
                        <strong data-i18n="example">Exemple :</strong> Ethereum 2.0
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- SECTION 4: WALLETS & CRYPTOGRAPHY (ENHANCED) -->
    <div class="slide educational-section" data-aos="fade-up" id="wallets-crypto">
        <h2 class="section-title">
            <span class="section-number">04</span>
            <span data-i18n="section4_title">Wallets & Cryptographie</span>
        </h2>

        <div class="wallet-explanation">
            <div class="key-pair-visual" data-aos="zoom-in">
                <div class="key-card public-key">
                    <i class="fas fa-key"></i>
                    <h4 data-i18n="public_key">Clé Publique</h4>
                    <p class="key-value">0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb</p>
                    <p class="key-desc" data-i18n="public_key_desc">
                        Votre adresse publique, comme un IBAN. Vous pouvez la partager librement.
                    </p>
                </div>

                <div class="key-divider">
                    <i class="fas fa-lock"></i>
                </div>

                <div class="key-card private-key">
                    <i class="fas fa-user-secret"></i>
                    <h4 data-i18n="private_key">Clé Privée</h4>
                    <p class="key-value">••••••••••••••••••••••••••••••••</p>
                    <p class="key-desc" data-i18n="private_key_desc">
                        Votre mot de passe secret. <strong>Ne JAMAIS la partager !</strong>
                    </p>
                </div>
            </div>

            <div class="signature-demo" data-aos="fade-up">
                <h4 data-i18n="digital_signature">Signature Numérique</h4>
                <div class="signature-flow">
                    <div class="sig-step">
                        <i class="fas fa-file-alt"></i>
                        <span data-i18n="sig_message">Message</span>
                    </div>
                    <i class="fas fa-arrow-right"></i>
                    <div class="sig-step">
                        <i class="fas fa-key"></i>
                        <span data-i18n="sig_private">Clé Privée</span>
                    </div>
                    <i class="fas fa-arrow-right"></i>
                    <div class="sig-step">
                        <i class="fas fa-signature"></i>
                        <span data-i18n="sig_signed">Signé</span>
                    </div>
                    <i class="fas fa-arrow-right"></i>
                    <div class="sig-step">
                        <i class="fas fa-check-circle"></i>
                        <span data-i18n="sig_verified">Vérifié</span>
                    </div>
                </div>
            </div>

            <div class="wallet-types-grid">
                <div class="wallet-type" data-aos="fade-up" data-aos-delay="100">
                    <i class="fas fa-mobile-alt"></i>
                    <h5 data-i18n="hot_wallet">Hot Wallet</h5>
                    <p data-i18n="hot_wallet_desc">Connecté à internet, pratique mais moins sécurisé</p>
                </div>
                <div class="wallet-type" data-aos="fade-up" data-aos-delay="200">
                    <i class="fas fa-snowflake"></i>
                    <h5 data-i18n="cold_wallet">Cold Wallet</h5>
                    <p data-i18n="cold_wallet_desc">Hors ligne, très sécurisé pour stockage long terme</p>
                </div>
                <div class="wallet-type" data-aos="fade-up" data-aos-delay="300">
                    <i class="fas fa-usb"></i>
                    <h5 data-i18n="hardware_wallet">Hardware Wallet</h5>
                    <p data-i18n="hardware_wallet_desc">Dispositif physique, meilleur compromis sécurité/usage</p>
                </div>
            </div>
        </div>
    </div>

    <!-- SECTION 5: SMART CONTRACTS -->
    <div class="slide educational-section" data-aos="fade-up" id="smart-contracts">
        <h2 class="section-title">
            <span class="section-number">05</span>
            <span data-i18n="section5_title">Contrats Intelligents (Smart Contracts)</span>
        </h2>

        <div class="smart-contract-intro" data-aos="zoom-in">
            <div class="sc-definition">
                <i class="fas fa-file-contract"></i>
                <div>
                    <h3 data-i18n="sc_what">Qu'est-ce qu'un Smart Contract ?</h3>
                    <p data-i18n="sc_definition">
                        Un programme informatique auto-exécutable qui s'exécute automatiquement lorsque des conditions 
                        prédéfinies sont remplies. Pensez à un distributeur automatique : vous insérez de l'argent, 
                        vous sélectionnez un produit, et il est distribué automatiquement.
                    </p>
                </div>
            </div>
        </div>

        <div class="sc-example" data-aos="fade-up">
            <h4 data-i18n="sc_example_title">Exemple Simple : Transfert Automatique</h4>
            <div class="code-block">
                <pre><code>// Contrat de paiement automatique
if (date === "2026-03-01" && balance >= 1000) {
    transfer(1000, "Alice");
    emit PaymentSent("Alice", 1000);
}</code></pre>
            </div>
        </div>

        <div class="sc-use-cases">
            <h4 data-i18n="sc_use_cases">Cas d'Usage</h4>
            <div class="use-case-grid">
                <div class="use-case-card" data-aos="flip-up" data-aos-delay="100">
                    <i class="fas fa-money-bill-wave"></i>
                    <h5 data-i18n="sc_use1">Paiements Automatiques</h5>
                    <p data-i18n="sc_use1_desc">Salaires, loyers, abonnements</p>
                </div>
                <div class="use-case-card" data-aos="flip-up" data-aos-delay="200">
                    <i class="fas fa-handshake"></i>
                    <h5 data-i18n="sc_use2">Escrow</h5>
                    <p data-i18n="sc_use2_desc">Séquestre automatique pour transactions</p>
                </div>
                <div class="use-case-card" data-aos="flip-up" data-aos-delay="300">
                    <i class="fas fa-chart-line"></i>
                    <h5 data-i18n="sc_use3">DeFi</h5>
                    <p data-i18n="sc_use3_desc">Prêts, emprunts, trading décentralisé</p>
                </div>
                <div class="use-case-card" data-aos="flip-up" data-aos-delay="400">
                    <i class="fas fa-vote-yea"></i>
                    <h5 data-i18n="sc_use4">Gouvernance</h5>
                    <p data-i18n="sc_use4_desc">Votes et décisions automatisées</p>
                </div>
            </div>
        </div>
    </div>

    <!-- SECTION 6: USE CASES & APPLICATIONS -->
    <div class="slide educational-section" data-aos="fade-up" id="use-cases">
        <h2 class="section-title">
            <span class="section-number">06</span>
            <span data-i18n="section6_title">Applications Concrètes</span>
        </h2>

        <div class="applications-grid">
            <div class="app-card" data-aos="zoom-in" data-aos-delay="100">
                <div class="app-icon">
                    <i class="fab fa-bitcoin"></i>
                </div>
                <h4 data-i18n="app_crypto">Cryptomonnaies</h4>
                <p data-i18n="app_crypto_desc">Bitcoin, Ethereum : monnaies numériques décentralisées</p>
                <div class="app-examples">
                    <span class="tag">Bitcoin</span>
                    <span class="tag">Ethereum</span>
                    <span class="tag">USDC</span>
                </div>
            </div>

            <div class="app-card" data-aos="zoom-in" data-aos-delay="200">
                <div class="app-icon">
                    <i class="fas fa-building"></i>
                </div>
                <h4 data-i18n="app_tokenization">Tokenisation d'Actifs</h4>
                <p data-i18n="app_tokenization_desc">Immobilier, art, obligations transformés en tokens numériques</p>
                <div class="app-examples">
                    <span class="tag">Real Estate</span>
                    <span class="tag">Art</span>
                    <span class="tag">Bonds</span>
                </div>
            </div>

            <div class="app-card" data-aos="zoom-in" data-aos-delay="300">
                <div class="app-icon">
                    <i class="fas fa-university"></i>
                </div>
                <h4 data-i18n="app_defi">Finance Décentralisée (DeFi)</h4>
                <p data-i18n="app_defi_desc">Prêts, emprunts, trading sans intermédiaires bancaires</p>
                <div class="app-examples">
                    <span class="tag">Lending</span>
                    <span class="tag">DEX</span>
                    <span class="tag">Yield</span>
                </div>
            </div>

            <div class="app-card" data-aos="zoom-in" data-aos-delay="400">
                <div class="app-icon">
                    <i class="fas fa-truck"></i>
                </div>
                <h4 data-i18n="app_supply">Supply Chain</h4>
                <p data-i18n="app_supply_desc">Traçabilité et provenance des produits</p>
                <div class="app-examples">
                    <span class="tag">Tracking</span>
                    <span class="tag">Provenance</span>
                    <span class="tag">Audit</span>
                </div>
            </div>

            <div class="app-card" data-aos="zoom-in" data-aos-delay="500">
                <div class="app-icon">
                    <i class="fas fa-id-card"></i>
                </div>
                <h4 data-i18n="app_identity">Identité Numérique</h4>
                <p data-i18n="app_identity_desc">Gestion sécurisée des identités et credentials</p>
                <div class="app-examples">
                    <span class="tag">KYC</span>
                    <span class="tag">Diplômes</span>
                    <span class="tag">Passeports</span>
                </div>
            </div>

            <div class="app-card" data-aos="zoom-in" data-aos-delay="600">
                <div class="app-icon">
                    <i class="fas fa-image"></i>
                </div>
                <h4 data-i18n="app_nft">NFTs</h4>
                <p data-i18n="app_nft_desc">Propriété numérique unique et vérifiable</p>
                <div class="app-examples">
                    <span class="tag">Art</span>
                    <span class="tag">Gaming</span>
                    <span class="tag">Collectibles</span>
                </div>
            </div>
        </div>
    </div>

    <!-- SECTION 7: INTERACTIVE GLOSSARY -->
    <div class="slide educational-section" data-aos="fade-up" id="glossary">
        <h2 class="section-title">
            <span class="section-number">07</span>
            <span data-i18n="section7_title">Glossaire Blockchain</span>
        </h2>

        <div class="glossary-search" data-aos="fade-up">
            <i class="fas fa-search"></i>
            <input type="text" id="glossarySearch" placeholder="Rechercher un terme..." data-i18n-placeholder="glossary_search">
        </div>

        <div class="glossary-grid" id="glossaryGrid">
            <div class="glossary-term" data-term="node">
                <div class="term-header">
                    <i class="fas fa-server"></i>
                    <h4>Node (Nœud)</h4>
                </div>
                <p data-i18n="term_node">Ordinateur participant au réseau blockchain, stockant une copie du registre.</p>
            </div>

            <div class="glossary-term" data-term="hash">
                <div class="term-header">
                    <i class="fas fa-fingerprint"></i>
                    <h4>Hash</h4>
                </div>
                <p data-i18n="term_hash">Empreinte cryptographique unique d'un bloc ou d'une transaction.</p>
            </div>

            <div class="glossary-term" data-term="consensus">
                <div class="term-header">
                    <i class="fas fa-handshake"></i>
                    <h4>Consensus</h4>
                </div>
                <p data-i18n="term_consensus">Mécanisme permettant aux nœuds de s'accorder sur l'état du registre (PoW, PoS).</p>
            </div>

            <div class="glossary-term" data-term="dapp">
                <div class="term-header">
                    <i class="fas fa-cube"></i>
                    <h4>DApp</h4>
                </div>
                <p data-i18n="term_dapp">Application décentralisée fonctionnant sur une blockchain.</p>
            </div>

            <div class="glossary-term" data-term="smart-contract">
                <div class="term-header">
                    <i class="fas fa-file-contract"></i>
                    <h4>Smart Contract</h4>
                </div>
                <p data-i18n="term_smart_contract">Programme auto-exécutable sur la blockchain.</p>
            </div>

            <div class="glossary-term" data-term="gas">
                <div class="term-header">
                    <i class="fas fa-gas-pump"></i>
                    <h4>Gas</h4>
                </div>
                <p data-i18n="term_gas">Frais de transaction sur Ethereum, payés en ETH.</p>
            </div>

            <div class="glossary-term" data-term="fork">
                <div class="term-header">
                    <i class="fas fa-code-branch"></i>
                    <h4>Fork</h4>
                </div>
                <p data-i18n="term_fork">Division du protocole blockchain créant deux chaînes distinctes.</p>
            </div>

            <div class="glossary-term" data-term="mining">
                <div class="term-header">
                    <i class="fas fa-hammer"></i>
                    <h4>Mining (Minage)</h4>
                </div>
                <p data-i18n="term_mining">Processus de création de nouveaux blocs via Proof of Work.</p>
            </div>

            <div class="glossary-term" data-term="staking">
                <div class="term-header">
                    <i class="fas fa-coins"></i>
                    <h4>Staking</h4>
                </div>
                <p data-i18n="term_staking">Verrouillage de tokens pour valider des transactions et gagner des récompenses.</p>
            </div>

            <div class="glossary-term" data-term="token">
                <div class="term-header">
                    <i class="fas fa-coin"></i>
                    <h4>Token</h4>
                </div>
                <p data-i18n="term_token">Actif numérique représentant de la valeur ou un droit sur une blockchain.</p>
            </div>

            <div class="glossary-term" data-term="wallet">
                <div class="term-header">
                    <i class="fas fa-wallet"></i>
                    <h4>Wallet (Portefeuille)</h4>
                </div>
                <p data-i18n="term_wallet">Application stockant vos clés privées pour accéder à vos actifs.</p>
            </div>

            <div class="glossary-term" data-term="private-key">
                <div class="term-header">
                    <i class="fas fa-key"></i>
                    <h4>Private Key (Clé Privée)</h4>
                </div>
                <p data-i18n="term_private_key">Code secret donnant accès à vos actifs. Ne JAMAIS partager !</p>
            </div>

            <div class="glossary-term" data-term="public-key">
                <div class="term-header">
                    <i class="fas fa-key"></i>
                    <h4>Public Key (Clé Publique)</h4>
                </div>
                <p data-i18n="term_public_key">Adresse publique pour recevoir des transactions.</p>
            </div>

            <div class="glossary-term" data-term="explorer">
                <div class="term-header">
                    <i class="fas fa-search"></i>
                    <h4>Blockchain Explorer</h4>
                </div>
                <p data-i18n="term_explorer">Outil web pour visualiser les transactions et blocs (ex: Etherscan).</p>
            </div>

            <div class="glossary-term" data-term="immutability">
                <div class="term-header">
                    <i class="fas fa-lock"></i>
                    <h4>Immutabilité</h4>
                </div>
                <p data-i18n="term_immutability">Propriété rendant les données blockchain impossibles à modifier rétroactivement.</p>
            </div>
        </div>
    </div>

'''

# CSS for enhanced sections
enhanced_css = '''
        /* ========================================= */
        /* ENHANCED EDUCATIONAL SECTIONS STYLES */
        /* ========================================= */
        
        .educational-section {
            background: linear-gradient(135deg, rgba(30, 41, 59, 0.4), rgba(15, 23, 42, 0.6));
            border: 1px solid rgba(168, 85, 247, 0.2);
            padding: 60px 50px;
            margin-bottom: 40px;
        }
        
        .section-title {
            display: flex;
            align-items: center;
            gap: 20px;
            margin-bottom: 40px;
            font-size: 36px;
            color: white;
        }
        
        .section-number {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #a855f7, #6366f1);
            border-radius: 16px;
            font-size: 24px;
            font-weight: 800;
            box-shadow: 0 10px 30px rgba(168, 85, 247, 0.3);
        }
        
        .section-intro {
            font-size: 18px;
            color: var(--text-muted);
            margin-bottom: 40px;
            text-align: center;
        }
        
        /* SECTION 1: BLOCKCHAIN DEFINITION */
        .definition-card {
            background: rgba(168, 85, 247, 0.1);
            border: 2px solid rgba(168, 85, 247, 0.3);
            border-radius: 20px;
            padding: 40px;
            margin-bottom: 40px;
            text-align: center;
        }
        
        .def-icon {
            font-size: 60px;
            color: var(--accent-purple);
            margin-bottom: 20px;
        }
        
        .definition-card h3 {
            font-size: 28px;
            margin-bottom: 20px;
        }
        
        .definition-card p {
            font-size: 18px;
            line-height: 1.8;
        }
        
        .comparison-grid {
            display: grid;
            grid-template-columns: 1fr auto 1fr;
            gap: 30px;
            align-items: center;
            margin-bottom: 40px;
        }
        
        .comparison-card {
            background: rgba(30, 41, 59, 0.6);
            border: 2px solid;
            border-radius: 20px;
            padding: 30px;
        }
        
        .comparison-card.traditional {
            border-color: rgba(239, 68, 68, 0.5);
        }
        
        .comparison-card.blockchain {
            border-color: rgba(16, 185, 129, 0.5);
        }
        
        .comp-header {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 20px;
        }
        
        .comp-header i {
            font-size: 32px;
        }
        
        .comp-header h4 {
            font-size: 20px;
            margin: 0;
        }
        
        .comp-list {
            list-style: none;
            padding: 0;
        }
        
        .comp-list li {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 0;
            font-size: 16px;
        }
        
        .comp-list i.fa-times-circle {
            color: #ef4444;
        }
        
        .comp-list i.fa-check-circle {
            color: #10b981;
        }
        
        .vs-divider {
            font-size: 32px;
            font-weight: 800;
            color: var(--accent-purple);
            text-align: center;
        }
        
        .benefits-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 25px;
        }
        
        .benefit-card {
            background: rgba(59, 130, 246, 0.1);
            border: 1px solid rgba(59, 130, 246, 0.3);
            border-radius: 16px;
            padding: 30px;
            text-align: center;
            transition: all 0.3s;
        }
        
        .benefit-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
        }
        
        .benefit-card i {
            font-size: 40px;
            color: var(--accent-blue);
            margin-bottom: 15px;
        }
        
        .benefit-card h4 {
            font-size: 20px;
            margin-bottom: 10px;
        }
        
        /* SECTION 2: BLOCK ANATOMY */
        .block-chain-demo {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 30px;
            margin-bottom: 40px;
        }
        
        .demo-block {
            background: rgba(30, 41, 59, 0.8);
            border: 2px solid rgba(59, 130, 246, 0.5);
            border-radius: 16px;
            padding: 25px;
            min-width: 350px;
        }
        
        .block-header {
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            padding: 12px 20px;
            border-radius: 10px;
            margin-bottom: 20px;
            text-align: center;
            font-weight: 700;
        }
        
        .block-field {
            display: flex;
            align-items: flex-start;
            gap: 15px;
            padding: 12px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .block-field:last-child {
            border-bottom: none;
        }
        
        .block-field i {
            color: var(--accent-blue);
            font-size: 20px;
            margin-top: 3px;
        }
        
        .block-field strong {
            display: block;
            color: white;
            margin-bottom: 5px;
        }
        
        .block-field span {
            color: var(--text-muted);
            font-size: 14px;
        }
        
        .hash-text {
            font-family: 'JetBrains Mono', monospace;
            color: var(--accent-purple) !important;
        }
        
        .chain-arrow {
            font-size: 40px;
            color: var(--accent-blue);
            animation: pulse 2s infinite;
        }
        
        .alert-box {
            background: rgba(16, 185, 129, 0.1);
            border-left: 4px solid #10b981;
            border-radius: 12px;
            padding: 25px;
            display: flex;
            gap: 20px;
            align-items: flex-start;
        }
        
        .alert-box i {
            font-size: 32px;
            color: #10b981;
        }
        
        .alert-box h4 {
            font-size: 20px;
            margin-bottom: 10px;
        }
        
        /* SECTION 3: CONSENSUS */
        .consensus-comparison {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 40px;
        }
        
        .consensus-card {
            background: rgba(30, 41, 59, 0.6);
            border: 2px solid;
            border-radius: 20px;
            padding: 35px;
            transition: all 0.3s;
        }
        
        .consensus-card.pow {
            border-color: rgba(251, 191, 36, 0.5);
        }
        
        .consensus-card.pos {
            border-color: rgba(16, 185, 129, 0.5);
        }
        
        .consensus-card:hover {
            transform: scale(1.02);
            box-shadow: 0 15px 40px rgba(168, 85, 247, 0.3);
        }
        
        .consensus-header {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 25px;
        }
        
        .consensus-header i {
            font-size: 36px;
            color: var(--accent-purple);
        }
        
        .consensus-visual {
            background: rgba(168, 85, 247, 0.1);
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            margin-bottom: 20px;
        }
        
        .consensus-visual i {
            font-size: 48px;
            color: var(--accent-blue);
            display: block;
            margin-bottom: 10px;
        }
        
        .consensus-features {
            list-style: none;
            padding: 0;
            margin-bottom: 20px;
        }
        
        .consensus-features li {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px 0;
            font-size: 16px;
        }
        
        .consensus-example {
            background: rgba(59, 130, 246, 0.1);
            border-radius: 8px;
            padding: 12px;
            text-align: center;
            font-size: 16px;
        }
        
        /* SECTION 4: WALLETS */
        .key-pair-visual {
            display: grid;
            grid-template-columns: 1fr auto 1fr;
            gap: 30px;
            align-items: center;
            margin-bottom: 40px;
        }
        
        .key-card {
            background: rgba(30, 41, 59, 0.6);
            border: 2px solid;
            border-radius: 20px;
            padding: 30px;
            text-align: center;
        }
        
        .key-card.public-key {
            border-color: rgba(16, 185, 129, 0.5);
        }
        
        .key-card.private-key {
            border-color: rgba(239, 68, 68, 0.5);
        }
        
        .key-card i {
            font-size: 48px;
            margin-bottom: 15px;
        }
        
        .key-card h4 {
            font-size: 22px;
            margin-bottom: 15px;
        }
        
        .key-value {
            background: rgba(0, 0, 0, 0.3);
            padding: 12px;
            border-radius: 8px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 14px;
            margin-bottom: 15px;
            word-break: break-all;
        }
        
        .key-desc {
            font-size: 15px;
            color: var(--text-muted);
        }
        
        .key-divider {
            font-size: 40px;
            color: var(--accent-purple);
        }
        
        .signature-demo {
            background: rgba(168, 85, 247, 0.1);
            border-radius: 16px;
            padding: 30px;
            margin-bottom: 40px;
        }
        
        .signature-demo h4 {
            text-align: center;
            margin-bottom: 25px;
            font-size: 22px;
        }
        
        .signature-flow {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 20px;
            flex-wrap: wrap;
        }
        
        .sig-step {
            background: rgba(59, 130, 246, 0.2);
            border: 1px solid rgba(59, 130, 246, 0.4);
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            min-width: 120px;
        }
        
        .sig-step i {
            font-size: 32px;
            color: var(--accent-blue);
            display: block;
            margin-bottom: 10px;
        }
        
        .wallet-types-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 25px;
        }
        
        .wallet-type {
            background: rgba(30, 41, 59, 0.6);
            border: 1px solid rgba(59, 130, 246, 0.3);
            border-radius: 16px;
            padding: 25px;
            text-align: center;
            transition: all 0.3s;
        }
        
        .wallet-type:hover {
            transform: translateY(-5px);
            border-color: var(--accent-blue);
        }
        
        .wallet-type i {
            font-size: 40px;
            color: var(--accent-blue);
            margin-bottom: 15px;
        }
        
        .wallet-type h5 {
            font-size: 18px;
            margin-bottom: 10px;
        }
        
        /* SECTION 5: SMART CONTRACTS */
        .sc-definition {
            background: rgba(168, 85, 247, 0.1);
            border-left: 4px solid var(--accent-purple);
            border-radius: 12px;
            padding: 30px;
            display: flex;
            gap: 25px;
            align-items: flex-start;
            margin-bottom: 40px;
        }
        
        .sc-definition i {
            font-size: 48px;
            color: var(--accent-purple);
        }
        
        .sc-definition h3 {
            font-size: 24px;
            margin-bottom: 15px;
        }
        
        .sc-example {
            margin-bottom: 40px;
        }
        
        .sc-example h4 {
            font-size: 22px;
            margin-bottom: 20px;
            text-align: center;
        }
        
        .code-block {
            background: #1e293b;
            border: 1px solid rgba(59, 130, 246, 0.3);
            border-radius: 12px;
            padding: 25px;
            overflow-x: auto;
        }
        
        .code-block pre {
            margin: 0;
            font-family: 'JetBrains Mono', monospace;
            font-size: 14px;
            line-height: 1.6;
            color: #e2e8f0;
        }
        
        .use-case-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 25px;
        }
        
        .use-case-card {
            background: rgba(30, 41, 59, 0.6);
            border: 1px solid rgba(168, 85, 247, 0.3);
            border-radius: 16px;
            padding: 25px;
            text-align: center;
            transition: all 0.3s;
        }
        
        .use-case-card:hover {
            transform: scale(1.05);
            border-color: var(--accent-purple);
        }
        
        .use-case-card i {
            font-size: 36px;
            color: var(--accent-purple);
            margin-bottom: 15px;
        }
        
        .use-case-card h5 {
            font-size: 18px;
            margin-bottom: 10px;
        }
        
        /* SECTION 6: APPLICATIONS */
        .applications-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 30px;
        }
        
        .app-card {
            background: rgba(30, 41, 59, 0.6);
            border: 2px solid rgba(168, 85, 247, 0.3);
            border-radius: 20px;
            padding: 35px;
            text-align: center;
            transition: all 0.3s;
        }
        
        .app-card:hover {
            transform: translateY(-10px);
            border-color: var(--accent-purple);
            box-shadow: 0 15px 40px rgba(168, 85, 247, 0.4);
        }
        
        .app-icon {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #a855f7, #6366f1);
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            font-size: 40px;
            color: white;
        }
        
        .app-card h4 {
            font-size: 22px;
            margin-bottom: 15px;
        }
        
        .app-card p {
            margin-bottom: 20px;
        }
        
        .app-examples {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            justify-content: center;
        }
        
        .tag {
            background: rgba(59, 130, 246, 0.2);
            color: var(--accent-blue);
            padding: 6px 14px;
            border-radius: 14px;
            font-size: 13px;
            font-weight: 600;
            border: 1px solid rgba(59, 130, 246, 0.3);
        }
        
        /* SECTION 7: GLOSSARY */
        .glossary-search {
            position: relative;
            margin-bottom: 40px;
        }
        
        .glossary-search i {
            position: absolute;
            left: 20px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--accent-purple);
            font-size: 20px;
        }
        
        .glossary-search input {
            width: 100%;
            padding: 18px 20px 18px 60px;
            background: rgba(30, 41, 59, 0.6);
            border: 2px solid rgba(168, 85, 247, 0.3);
            border-radius: 50px;
            color: white;
            font-size: 16px;
            font-family: 'Urbanist', sans-serif;
        }
        
        .glossary-search input:focus {
            outline: none;
            border-color: var(--accent-purple);
            box-shadow: 0 0 20px rgba(168, 85, 247, 0.3);
        }
        
        .glossary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 25px;
        }
        
        .glossary-term {
            background: rgba(30, 41, 59, 0.6);
            border: 1px solid rgba(168, 85, 247, 0.2);
            border-radius: 16px;
            padding: 25px;
            transition: all 0.3s;
        }
        
        .glossary-term:hover {
            border-color: var(--accent-purple);
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(168, 85, 247, 0.3);
        }
        
        .term-header {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 15px;
        }
        
        .term-header i {
            font-size: 28px;
            color: var(--accent-purple);
        }
        
        .term-header h4 {
            font-size: 18px;
            margin: 0;
        }
        
        .glossary-term p {
            font-size: 15px;
            color: var(--text-muted);
            margin: 0;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
            .comparison-grid {
                grid-template-columns: 1fr;
            }
            
            .vs-divider {
                transform: rotate(90deg);
            }
            
            .key-pair-visual {
                grid-template-columns: 1fr;
            }
            
            .key-divider {
                transform: rotate(90deg);
            }
            
            .block-chain-demo {
                flex-direction: column;
            }
            
            .chain-arrow {
                transform: rotate(90deg);
            }
        }
'''

# JavaScript for glossary search
glossary_js = '''
    <script>
        // Glossary search functionality
        document.addEventListener('DOMContentLoaded', function() {
            const searchInput = document.getElementById('glossarySearch');
            if (searchInput) {
                searchInput.addEventListener('input', function(e) {
                    const searchTerm = e.target.value.toLowerCase();
                    const terms = document.querySelectorAll('.glossary-term');
                    
                    terms.forEach(term => {
                        const termName = term.querySelector('h4').textContent.toLowerCase();
                        const termDesc = term.querySelector('p').textContent.toLowerCase();
                        
                        if (termName.includes(searchTerm) || termDesc.includes(searchTerm)) {
                            term.style.display = 'block';
                        } else {
                            term.style.display = 'none';
                        }
                    });
                });
            }
        });
    </script>
'''

# Insert the CSS before closing </style>
style_end = None
for i, line in enumerate(lines):
    if '</style>' in line and style_end is None:
        style_end = i
        break

if style_end:
    lines.insert(style_end, enhanced_css + '\n')

# Insert the HTML sections before footer
lines.insert(footer_line + 1, enhanced_sections_html + '\n')

# Insert the JavaScript before closing </body>
body_end = None
for i in range(len(lines) - 1, -1, -1):
    if '</body>' in lines[i]:
        body_end = i
        break

if body_end:
    lines.insert(body_end, glossary_js + '\n')

# Write the enhanced file
with open('simple.html', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("✅ Enhancement completed successfully!")
print("📄 File: simple.html")
print("🎓 Added: 7 comprehensive educational sections")
print("📚 Sections:")
print("   01. Blockchain Definition & Fundamentals")
print("   02. Block Anatomy")
print("   03. Consensus Mechanisms (PoW vs PoS)")
print("   04. Wallets & Cryptography")
print("   05. Smart Contracts")
print("   06. Use Cases & Applications")
print("   07. Interactive Glossary (15 terms)")
print("✨ Features: Interactive elements, search, AOS animations")
