import os
import re

# Template for the article body
ARTICLE_TEMPLATE = """    <article class="paper-container">
        <header class="paper-header">
            <span class="series-label">{series_label}</span>
            <h1 class="paper-title">{h1}</h1>
            <div class="paper-meta">
                <div class="author-info">{author_info}</div>
                <div class="date-info">{date_info}</div>
            </div>
        </header>

        <!-- 1. EXECUTIVE SUMMARY -->
        <section class="section-block">
            <h2 class="section-title"><span class="number">01</span> {sec1_title}</h2>
            <p class="paper-text">
                {sec1_text1}
            </p>
            <p class="paper-text">
                {sec1_text2}
            </p>
        </section>

        <!-- 2. PROBLEM STATEMENT -->
        <section class="section-block">
            <h2 class="section-title"><span class="number">02</span> {sec2_title}</h2>
            <p class="paper-text">
                {sec2_text1}
            </p>
            <div class="policy-callout">
                "{sec2_callout}"
            </div>
            <p class="paper-text">
                {sec2_text2}
            </p>
        </section>

        <!-- 3. POLICY CONTEXT -->
        <section class="section-block">
            <h2 class="section-title"><span class="number">03</span> {sec3_title}</h2>
            <p class="paper-text">
                {sec3_text1}
            </p>
            <p class="paper-text">
                {sec3_text2}
            </p>
        </section>

        <!-- 4. ANALYSIS & OPERATIONAL IMPACT -->
        <section class="section-block">
            <h2 class="section-title"><span class="number">04</span> {sec4_title}</h2>
            <p class="paper-text">
                {sec4_text1}
            </p>
            <p class="paper-text">
                {sec4_text2}
            </p>
            <p class="paper-text">
                {sec4_text3}
            </p>
        </section>

        <!-- 5. POLICY RECOMMENDATIONS -->
        <section class="section-block">
            <h2 class="section-title"><span class="number">05</span> {sec5_title}</h2>
            <p class="paper-text">
                {sec5_text}
            </p>
            <div class="recommendation-box">
                <h4>{sec5_rec_header}</h4>
                <ul>
                    <li>{sec5_rec1}</li>
                    <li>{sec5_rec2}</li>
                    <li>{sec5_rec3}</li>
                </ul>
            </div>
        </section>

        <!-- 6. REFERENCES -->
        <section class="section-block">
            <h2 class="section-title"><span class="number">06</span> {sec6_title}</h2>
            <ul class="references">
                <li>{sec6_ref1}</li>
                <li>{sec6_ref2}</li>
                <li>{sec6_ref3}</li>
            </ul>
        </section>
    </article>"""

# Define the specialized content for all 10 topics in EN and FR
data = {
    "pb-2026-01": {
        "en": {
            "title": "PB-2026-01: MiCA Phase 2 CASP Transitional Provisions | DCM Core",
            "desc": "Policy Brief PB-2026-01 analyzing the MiCA Phase 2 transitional rules and passporting requirements for Crypto-Asset Service Providers (CASPs) in the EU.",
            "canonical": "https://dcmcore.com/en/policy-briefs/pb-2026-01.html",
            "series_label": "DCM Core Policy Brief | PB-2026-01",
            "h1": "MiCA Phase 2: Transitional Provisions for CASPs",
            "author_info": "DCM Core Regulatory Intelligence Unit",
            "date_info": "Publication: March 2026 | Format: 6-Page Standard",
            "sec1_title": "Executive Summary",
            "sec1_text1": "The activation of the Markets in Crypto-Assets (MiCA) regulation's second phase introduces a unified licensing regime for Crypto-Asset Service Providers (CASPs). This brief analyzes the transitional rules established under Article 143, which allow existing Virtual Asset Service Providers (VASPs) to continue operating under national frameworks while preparing for CASP passporting. We examine the operational friction points and passporting schedules across different jurisdictions.",
            "sec1_text2": "While the transitional provisions aim to prevent market disruption, varying national interpretation of the 'grandfathering clause' creates regulatory fragmentation. Successful CASP alignment requires early security audits, compliance restructurings, and proactive engagement with National Competent Authorities (NCAs) before the transitional window closes in 2026.",
            "sec2_title": "Problem Statement",
            "sec2_text1": "Prior to MiCA, crypto-asset service providers faced a fragmented regulatory landscape, operating under diverse national anti-money laundering (AML) registration regimes. This lack of harmonization resulted in regulatory arbitrage, increased compliance overhead for cross-border operations, and limited investor protection. CASPs seeking to expand globally had to obtain separate registrations in each EU member state.",
            "sec2_callout": "The core challenge of the MiCA transition is not just acquiring a license, but managing the operational divergence between grandfathered national registries and the strict, centralized requirements of the new CASP passport.",
            "sec2_text2": "As member states implement their own transitional timelines (ranging from zero to 18 months), CASPs face legal uncertainty regarding their ability to passport services during the interim period. This creates a critical risk for firms that rely on cross-border business models without a fully approved CASP license.",
            "sec3_title": "Policy Context",
            "sec3_text1": "Under MiCA Article 143, member states may allow VASPs already providing services in accordance with national law to benefit from a transitional period. However, this grandfathering is optional and subject to national discretion. For example, some jurisdictions have opted for a simplified CASP licensing procedure for registered VASPs, while others require a full application from day one.",
            "sec3_text2": "Furthermore, the cross-border provision of services (passporting) is explicitly prohibited for grandfathered VASPs until they obtain a full CASP authorization. This restriction creates a clear division between local operations and the wider EU single market, driving consolidation.",
            "sec4_title": "Analysis & Operational Impact",
            "sec4_text1": "The operational transition from a national VASP registry to a fully licensed CASP involves significant upgrades in governance, capital adequacy, and custody infrastructure. Under MiCA, CASPs must hold minimum prudential safeguards (ranging from EUR 50,000 to EUR 150,000 depending on service type) or equivalent professional indemnity insurance.",
            "sec4_text2": "In addition to capital requirements, CASPs face strict rules regarding the segregation of client assets. Customer funds must be held with credit institutions or qualified third-party custodians, completely isolated from the CASP's operational assets. This prevents the commingling of funds that led to major market failures in previous cycles.",
            "sec4_text3": "Finally, the transition requires implementing comprehensive ICT security frameworks aligned with the Digital Operational Resilience Act (DORA), introducing mandatory penetration testing and incident reporting mechanisms that VASPs previously bypassed.",
            "sec5_title": "Policy Recommendations",
            "sec5_text": "To ensure a smooth transition and maintain operational continuity across the EU, we recommend that CASPs and regulators adopt the following measures:",
            "sec5_rec_header": "Actionable Guidelines for Transitioning CASPs:",
            "sec5_rec1": "Conduct immediate gap analyses matching current VASP compliance policies against the ESMA CASP draft guidelines.",
            "sec5_rec2": "Establish bilateral dialogues with host and home regulators to clarify passporting timelines and grandfathering rules.",
            "sec5_rec3": "Upgrade asset custody architectures to support multi-signature, air-gapped security, and cryptographically segregated client accounts.",
            "sec6_title": "References & Citations",
            "sec6_ref1": "European Parliament (2023). Regulation (EU) 2023/1114 on markets in crypto-assets (MiCA).",
            "sec6_ref2": "ESMA (2024). Final Report on Draft Technical Standards under the Markets in Crypto-Assets Regulation (MiCA) - Second Package.",
            "sec6_ref3": "EBA (2024). Guidelines on the characteristics of a risk-based approach to anti-money laundering and countering the financing of terrorism supervision for CASPs."
        },
        "fr": {
            "title": "PB-2026-01 : Dispositions transitoires de MiCA Phase 2 pour les CASP | DCM Core",
            "desc": "Note d'analyse PB-2026-01 sur les dispositions transitoires de MiCA Phase 2 et les exigences de passeport pour les prestataires de services sur actifs crypto (CASP).",
            "canonical": "https://dcmcore.com/fr/policy-briefs/pb-2026-01.html",
            "series_label": "Note de Politique DCM Core | PB-2026-01",
            "h1": "MiCA Phase 2 : Dispositions transitoires pour les CASP",
            "author_info": "Unité d'Intelligence Réglementaire DCM Core",
            "date_info": "Publication : Mars 2026 | Format : Standard 6 pages",
            "sec1_title": "Résumé Exécutif",
            "sec1_text1": "L'activation de la deuxième phase du règlement sur les marchés de crypto-actifs (MiCA) introduit un régime d'autorisation unifié pour les prestataires de services sur crypto-actifs (CASP). Cette note analyse les règles transitoires établies par l'article 143, qui permettent aux prestataires de services sur actifs virtuels (PSAN) existants de continuer à opérer sous des cadres nationaux tout en se préparant au passeport CASP. Nous examinons les points de friction opérationnels et les calendriers de passeport dans différentes juridictions.",
            "sec1_text2": "Bien que les dispositions transitoires visent à éviter les perturbations du marché, les variations d'interprétation nationale de la 'clause de grand-père' créent une fragmentation réglementaire. Un alignement réussi sur MiCA exige des audits de sécurité précoces, des restructurations de conformité et un engagement proactif auprès des autorités compétentes avant la fermeture de la fenêtre transitoire en 2026.",
            "sec2_title": "Énoncé du Problème",
            "sec2_text1": "Avant MiCA, les prestataires de services sur crypto-actifs faisaient face à un paysage réglementaire fragmenté, opérant sous divers régimes d'enregistrement nationaux de lutte contre le blanchiment de capitaux (LCB). Ce manque d'harmonisation a entraîné un arbitrage réglementaire, une augmentation des frais de conformité pour les opérations transfrontalières et une protection limitée des investisseurs. Les CASP cherchant à se développer devaient obtenir des enregistrements distincts dans chaque État membre.",
            "sec2_callout": "Le défi central de la transition vers MiCA n'est pas seulement d'acquérir une licence, mais de gérer la divergence opérationnelle entre les registres nationaux et les exigences strictes du nouveau passeport CASP.",
            "sec2_text2": "Alors que les États membres mettent en œuvre leurs propres calendriers de transition (de zéro à 18 mois), les CASP font face à une incertitude juridique concernant leur capacité à fournir des services transfrontaliers pendant la période intermédiaire. Cela crée un risque critique pour les entreprises qui dépendent d'un modèle paneuropéen sans détenir de licence CASP complète.",
            "sec3_title": "Contexte Politique",
            "sec3_text1": "Selon l'article 143 de MiCA, les États membres peuvent autoriser les PSAN fournissant déjà des services conformément au droit national à bénéficier d'une période transitoire. Cependant, cette clause est facultative et soumise à la discrétion nationale. Par exemple, certaines juridictions ont opté pour une procédure d'autorisation simplifiée pour les PSAN enregistrés, tandis que d'autres exigent une demande complète dès le premier jour.",
            "sec3_text2": "De plus, la fourniture transfrontalière de services (passeport) est explicitement interdite pour les PSAN bénéficiant de la période transitoire jusqu'à ce qu'ils obtiennent une autorisation CASP complète. Cette restriction crée une division claire entre les opérations locales et le marché unique de l'UE, stimulant la consolidation.",
            "sec4_title": "Analyse & Impact Opérationnel",
            "sec4_text1": "La transition opérationnelle d'un enregistrement national vers une licence CASP complète implique d'importantes mises à niveau de la gouvernance, de l'adéquation des fonds propres et de l'infrastructure de conservation. Sous MiCA, les CASP doivent détenir des garanties prudentielles minimales (de 50 000 EUR à 150 000 EUR selon le service) ou une assurance responsabilité civile professionnelle équivalente.",
            "sec4_text2": "En plus des exigences de capital, les CASP font face à des règles strictes concernant la ségrégation des actifs des clients. Les fonds des clients doivent être détenus auprès d'établissements de crédit ou de dépositaires tiers qualifiés, complètement isolés des actifs opérationnels du CASP. Cela empêche le mélange de fonds qui a conduit à des faillites majeures lors des cycles précédents.",
            "sec4_text3": "Enfin, la transition nécessite la mise en œuvre de cadres de sécurité informatique robustes, alignés sur le règlement sur la résilience opérationnelle numérique (DORA), introduisant des tests de pénétration obligatoires et des mécanismes de déclaration des incidents informatiques.",
            "sec5_title": "Recommandations Politiques",
            "sec5_text": "Pour assurer une transition en douceur et maintenir la continuité opérationnelle dans l'UE, nous recommandons aux CASP et aux régulateurs d'adopter les mesures suivantes :",
            "sec5_rec_header": "Directives exploitables pour les CASP en transition :",
            "sec5_rec1": "Réaliser immédiatement une analyse des écarts comparant les politiques de conformité actuelles aux projets de normes techniques de l'ESMA.",
            "sec5_rec2": "Établir des dialogues bilatéraux avec les régulateurs nationaux pour clarifier les calendriers de passeport et les règles applicables.",
            "sec5_rec3": "Mettre à niveau les architectures de conservation des actifs pour prendre en charge la sécurité multi-signatures et le cloisonnement cryptographique.",
            "sec6_title": "Références & Citations",
            "sec6_ref1": "Parlement européen (2023). Règlement (UE) 2023/1114 sur les marchés de crypto-actifs (MiCA).",
            "sec6_ref2": "ESMA (2024). Rapport final sur les projets de normes techniques sous le règlement sur les marchés de crypto-actifs (MiCA) - Deuxième paquet.",
            "sec6_ref3": "ABE (2024). Orientations sur les caractéristiques d'une approche de supervision de la lutte contre le blanchiment et le financement du terrorisme fondée sur les risques pour les CASP."
        }
    },
    "pb-2026-02": {
        "en": {
            "title": "PB-2026-02: Synthetic Stablecoins & Global Systemic Risk | DCM Core",
            "desc": "Policy Brief PB-2026-02 exploring systemic leverage loops, delta-neutral hedging risks, and regulatory frameworks for synthetic stablecoins.",
            "canonical": "https://dcmcore.com/en/policy-briefs/pb-2026-02.html",
            "series_label": "DCM Core Policy Brief | PB-2026-02",
            "h1": "Synthetic Stablecoins & Global Systemic Risk",
            "author_info": "DCM Core Risk Management Unit",
            "date_info": "Publication: March 2026 | Format: 6-Page Standard",
            "sec1_title": "Executive Summary",
            "sec1_text1": "The rapid growth of synthetic stablecoins that maintain stability via derivatives and delta-neutral hedging strategies introduces novel systemic risks to digital asset markets. Unlike fiat-backed stablecoins, synthetic protocols back their tokens with volatile crypto-assets while shorting equivalent amounts on derivatives markets. This brief evaluates the structural feedback loops and leverage dynamics inherent in these designs.",
            "sec1_text2": "We conclude that synthetic stablecoins are highly vulnerable to funding rate stress and liquidation cascades. Under negative funding rate regimes, the cost of maintaining the delta-neutral hedge can exhaust protocol reserves, leading to sudden de-pegging risks that call for immediate regulatory oversight.",
            "sec2_title": "Problem Statement",
            "sec2_text1": "Synthetic stablecoins rely on perpetual swaps and futures markets to hedge the price volatility of their collateral. By establishing a delta-neutral position (e.g., holding 1 BTC spot and shorting 1 BTC perpetual contract), the USD value of the collateral is theoretically locked. However, this structure depends entirely on the liquidity and structural stability of external derivatives exchanges.",
            "sec2_callout": "Synthetic stablecoins do not eliminate market risk; they transform spot price volatility into counterparty, funding rate, and derivatives liquidation risk.",
            "sec2_text2": "During market downturns, a rush to redeem synthetic stablecoins forces the protocol to close its short positions. This buying pressure on perpetual swaps can trigger short squeezes, while simultaneously creating spot selling pressure, amplifying market distress and destabilizing the peg.",
            "sec3_title": "Policy Context",
            "sec3_text1": "Existing stablecoin regulations, including MiCA in Europe and various proposed bills in the United States, focus almost exclusively on asset-backed tokens (ARTs/EMTs). These frameworks assume that stablecoins are collateralized by cash deposits, short-term treasuries, or liquid traditional assets. Synthetic, derivatives-backed tokens operate outside these definitions.",
            "sec3_text2": "This regulatory gap allows synthetic stablecoins to offer high yields (funded by positive perpetual swap funding rates) to retail users without complying with capital adequacy ratios, reserve audit requirements, or insolvency protection rules.",
            "sec4_title": "Analysis & Operational Impact",
            "sec4_text1": "Our quantitative modeling indicates that the primary risk to synthetic stablecoins is a prolonged period of negative funding rates. When derivatives markets turn bearish, short positions must pay long positions. In a sustained bear market, the protocol's yield disappears, and it must pay fee outflows to maintain its hedges, rapidly eroding the backing reserves.",
            "sec4_text2": "Additionally, the concentration of collateral on centralized derivatives exchanges introduces severe counterparty risks. If a major exchange faces insolvency or limits withdrawals, the synthetic protocol cannot rebalance its hedges or process redemptions, leading to immediate de-pegging.",
            "sec4_text3": "Furthermore, the auto-deleveraging (ADL) mechanisms of derivatives exchanges can unilaterally close the protocol's hedges during high-volatility events, breaking the delta-neutral state and exposing the stablecoin directly to spot asset price drops.",
            "sec5_title": "Policy Recommendations",
            "sec5_text": "To mitigate the systemic threats posed by synthetic stablecoin designs, financial regulators and protocol developers should implement the following guidelines:",
            "sec5_rec_header": "Key Resilience Guidelines for Synthetic Protocols:",
            "sec5_rec1": "Mandate high reserve-coverage ratios that incorporate a minimum 15% liquid buffer held in fiat or tokenized treasury bills to absorb negative funding rate shocks.",
            "sec5_rec2": "Diversify delta-neutral hedging positions across multiple centralized and decentralized derivatives venues to mitigate counterparty concentration.",
            "sec5_rec3": "Implement automated circuit breakers that pause stablecoin issuance when funding rates fall below critical negative thresholds.",
            "sec6_title": "References & Citations",
            "sec6_ref1": "FSB (2023). High-Level Recommendations for the Regulation, Supervision, and Oversight of Crypto-Asset Activities and Markets.",
            "sec6_ref2": "BIS (2024). The structural vulnerabilities of decentralized finance (DeFi) and synthetic stablecoins.",
            "sec6_ref3": "DCM Core Research (2025). Funding Rate Dynamics and Liquidation Cascades in Delta-Neutral Stablecoin Protocols."
        },
        "fr": {
            "title": "PB-2026-02 : Stablecoins synthétiques & Risque systémique mondial | DCM Core",
            "desc": "Note d'analyse PB-2026-02 explorant les boucles de levier systémique, les risques de couverture delta-neutre et le cadre réglementaire des stablecoins synthétiques.",
            "canonical": "https://dcmcore.com/fr/policy-briefs/pb-2026-02.html",
            "series_label": "Note de Politique DCM Core | PB-2026-02",
            "h1": "Stablecoins synthétiques & Risque systémique mondial",
            "author_info": "Unité de Gestion des Risques DCM Core",
            "date_info": "Publication : Mars 2026 | Format : Standard 6 pages",
            "sec1_title": "Résumé Exécutif",
            "sec1_text1": "La croissance rapide des stablecoins synthétiques qui maintiennent leur stabilité via des produits dérivés et des stratégies de couverture delta-neutre introduit des risques systémiques inédits sur les marchés des actifs numériques. Contrairement aux stablecoins adossés à du fiat, ces pré-requis adossent leurs jetons à des crypto-actifs volatils tout en vendant à découvert des montants équivalents sur les marchés de dérivés. Cette note évalue les boucles de rétroaction structurelles et les dynamiques de levier inhérentes à ces modèles.",
            "sec1_text2": "Nous concluons que les stablecoins synthétiques sont très vulnérables aux chocs de taux de financement (funding rates) et aux cascades de liquidation. En période de taux de financement négatifs prolongés, le coût de maintien de la couverture delta-neutre peut épuiser les réserves, entraînant un risque de perte de parité.",
            "sec2_title": "Énoncé du Problème",
            "sec2_text1": "Les stablecoins synthétiques s'appuient sur les swaps perpétuels et les marchés à terme pour couvrir la volatilité des prix de leur collatéral. En établissant une position delta-neutre (par exemple, détenir 1 BTC spot et vendre 1 contrat perpétuel BTC), la valeur en USD du collatéral est théoriquement verrouillée. Cependant, cette structure dépend entièrement de la liquidité et de la stabilité des plateformes de dérivés externes.",
            "sec2_callout": "Les stablecoins synthétiques n'éliminent pas le risque de marché ; ils transforment la volatilité du prix au comptant (spot) en risque de contrepartie, de taux de financement et de liquidation.",
            "sec2_text2": "Lors de corrections de marché, une vague de rachats force le protocole à fermer ses positions courtes. Cette pression acheteuse sur les contrats perpétuels peut déclencher des 'short squeezes', tout en créant une pression vendeuse sur le marché spot, amplifiant la détresse du marché et déstabilisant la parité.",
            "sec3_title": "Contexte Politique",
            "sec3_text1": "Les réglementations actuelles sur les stablecoins, y compris MiCA en Europe et divers projets de loi aux États-Unis, se concentrent presque exclusivement sur les jetons adossés à des actifs (ART/EMT). Ces cadres supposent que les réserves sont constituées de dépôts en espèces, de bons du Trésor à court terme ou d'actifs traditionnels liquides. Les jetons synthétiques échappent à ces définitions.",
            "sec3_text2": "Ce vide réglementaire permet aux stablecoins synthétiques de proposer des rendements élevés (financés par les taux de financement positifs des swaps perpétuels) aux utilisateurs de détail sans se conformer aux exigences de fonds propres, aux audits de réserve ou aux règles de protection contre l'insolvabilité.",
            "sec4_title": "Analyse & Impact Opérationnel",
            "sec4_text1": "Notre modélisation quantitative indique que le principal risque pour les stablecoins synthétiques est une période prolongée de taux de financement négatifs. Lorsque les marchés de dérivés deviennent baissiers, les positions courtes doivent payer les positions longues. Dans un marché baissier persistant, le rendement du protocole disparaît et il doit payer des frais pour maintenir ses couvertures, érodant rapidement ses réserves.",
            "sec4_text2": "De plus, la concentration des garanties sur des bourses de dérivés centralisées introduit d'importants risques de contrepartie. Si une plateforme majeure fait face à une insolvabilité ou limite les retraits, le protocole synthétique ne peut pas rééquilibrer ses couvertures ni traiter les rachats, entraînant un décrochage immédiat de la parité.",
            "sec4_text3": "Par ailleurs, les mécanismes de désendettement automatique (ADL) des bourses de dérivés peuvent fermer unilatéralement les couvertures du protocole lors de pics de volatilité extrêmes, brisant la neutralité du delta et exposant directement le stablecoin aux baisses de prix des actifs.",
            "sec5_title": "Recommandations Politiques",
            "sec5_text": "Pour atténuer les menaces systémiques posées par les modèles de stablecoins synthétiques, nous recommandons aux régulateurs et aux concepteurs de protocoles les mesures suivantes :",
            "sec5_rec_header": "Directives de résilience pour les protocoles synthétiques :",
            "sec5_rec1": "Imposer des ratios de couverture des réserves intégrant un tampon liquide minimum de 15 % détenu en monnaie fiduciaire ou en bons du Trésor tokenisés.",
            "sec5_rec2": "Diversifier les positions de couverture delta-neutre sur plusieurs plateformes de dérivés centralisées et décentralisées.",
            "sec5_rec3": "Mettre en œuvre des coupe-circuits automatisés qui suspendent l'émission de stablecoins lorsque les taux de financement tombent sous des seuils critiques.",
            "sec6_title": "Références & Citations",
            "sec6_ref1": "FSB (2023). Recommandations de haut niveau pour la réglementation, la supervision et la surveillance des activités et marchés de crypto-actifs.",
            "sec6_ref2": "BRI (2024). Les vulnérabilités structurelles de la finance décentralisée (DeFi) et des stablecoins synthétiques.",
            "sec6_ref3": "DCM Core Research (2025). Dynamique des taux de financement et cascades de liquidation dans les protocoles de stablecoins delta-neutres."
        }
    },
    "pb-2026-03": {
        "en": {
            "title": "PB-2026-03: Offline CBDC Portability Risk Matrix | DCM Core",
            "desc": "Policy Brief PB-2026-03 evaluating security risk matrices, hardware-based trust, double-spending, and privacy in offline CBDC portability.",
            "canonical": "https://dcmcore.com/en/policy-briefs/pb-2026-03.html",
            "series_label": "DCM Core Policy Brief | PB-2026-03",
            "h1": "Offline CBDC Portability: Assessing the Risk Matrix",
            "author_info": "DCM Core Macro-Tech Unit",
            "date_info": "Publication: March 2026 | Format: 6-Page Standard",
            "sec1_title": "Executive Summary",
            "sec1_text1": "As central banks move toward implementation phases for Central Bank Digital Currencies (CBDCs), offline portability has emerged as a critical requirement for financial inclusion and operational resilience. This brief presents a comprehensive security risk matrix evaluating the trade-offs between hardware-based trust environments, cryptographic double-spending prevention, and user privacy in offline peer-to-peer (P2P) transactions.",
            "sec1_text2": "We conclude that secure offline CBDC systems must rely on tamper-resistant hardware (such as Secure Elements) combined with strict value limits and cryptographic detection mechanisms. We outline the key components of an institutional risk framework for offline CBDC deployment.",
            "sec2_title": "Problem Statement",
            "sec2_text1": "Executing digital payments without real-time connectivity to a centralized ledger introduces a fundamental double-spending problem. In an online environment, the ledger validates each transfer. Offline, the system must rely on local, trusted hardware to guarantee that a user cannot spend the same digital balance twice.",
            "sec2_callout": "Offline CBDC security cannot rely on soft verification; it requires a hardware-enforced trust boundary that guarantees token integrity at the user endpoint.",
            "sec2_text2": "If the physical device housing the CBDC (such as a smartphone or smartcard) is compromised, attackers could extract cryptographic keys and counterfeit digital cash. This risk of hardware-based counterfeiting poses a severe threat to central bank balance sheets and monetary stability.",
            "sec3_title": "Policy Context",
            "sec3_text1": "The European Central Bank (ECB) and other major monetary authorities have designated offline payments as a key differentiator for retail CBDCs. The goal is to replicate the characteristics of physical cash: immediate settlement, peer-to-peer privacy, and usability during power grid or telecommunication failures.",
            "sec3_text2": "However, implementing offline portability requires balancing regulatory requirements for Anti-Money Laundering (AML) and Counter-Terrorist Financing (CFT) with the demand for transactional privacy. Finding the technical sweet spot between privacy and trace capability remains a major policy challenge.",
            "sec4_title": "Analysis & Operational Impact",
            "sec4_text1": "Our security risk matrix categorizes offline CBDC architectures into three levels of hardware dependency. The highest security level utilizes a physical Secure Element (SE) integrated into mobile devices or smartcards. The SE acts as a tamper-resistant environment that runs signing operations and prevents unauthorized modifications to the wallet balance.",
            "sec4_text2": "However, physical side-channel attacks and laboratory-level hardware extraction remain viable threats. To mitigate the impact of a potential hardware compromise, central banks must implement operational limits, restricting the maximum value that can be stored offline and enforcing regular online synchronization cycles.",
            "sec4_text3": "Additionally, privacy-preserving cryptographic protocols (such as blind signatures and zero-knowledge proofs) can be deployed to ensure that transaction details are not revealed during offline exchange, while still allowing the detection of double-spending when devices reconnect online.",
            "sec5_title": "Policy Recommendations",
            "sec5_text": "Based on our cross-disciplinary review of hardware security and monetary economics, we recommend that central banks and technology providers adopt the following standards:",
            "sec5_rec_header": "Key Standards for Offline CBDC Architectures:",
            "sec5_rec1": "Enforce a maximum offline wallet limit of EUR 150 (or equivalent) to minimize the systemic impact of hardware compromises.",
            "sec5_rec2": "Mandate the use of certified EAL6+ Secure Elements for all devices participating in offline P2P CBDC ecosystems.",
            "sec5_rec3": "Implement double-spending detection algorithms that identify fraudulent double-spenders retrospectively during synchronization and trigger account suspension.",
            "sec6_title": "References & Citations",
            "sec6_ref1": "ECB (2024). Progress Report on the Investigation Phase of the Digital Euro - Focus on Offline Functionality.",
            "sec6_ref2": "CPMI (2023). Central bank digital currencies for cross-border payments: security and interoperability principles.",
            "sec6_ref3": "DCM Core Technical Report (2025). Hardware-Enforced Trust and Cryptographic Bounds in Offline Digital Cash Architectures."
        },
        "fr": {
            "title": "PB-2026-03 : Évaluation de la matrice de risque des MNBC hors ligne | DCM Core",
            "desc": "Note d'analyse PB-2026-03 évaluant les matrices de risques de sécurité, la confiance matérielle et le double-dépense pour la portabilité des MNBC hors ligne.",
            "canonical": "https://dcmcore.com/fr/policy-briefs/pb-2026-03.html",
            "series_label": "Note de Politique DCM Core | PB-2026-03",
            "h1": "Portabilité des MNBC hors ligne : Évaluation de la matrice de risque",
            "author_info": "Unité de Recherche Macro-Tech DCM Core",
            "date_info": "Publication : Mars 2026 | Format : Standard 6 pages",
            "sec1_title": "Résumé Exécutif",
            "sec1_text1": "Alors que les banques centrales entrent dans des phases de mise en œuvre concrète des monnaies numériques de banque centrale (MNBC), la portabilité hors ligne s'impose comme une exigence essentielle pour l'inclusion financière et la résilience opérationnelle. Cette note présente une matrice de risque de sécurité complète évaluant les compromis entre les environnements de confiance matériels, la prévention du double-dépense et la confidentialité lors des paiements de détail hors ligne.",
            "sec1_text2": "Nous concluons que les systèmes MNBC hors ligne doivent s'appuyer sur du matériel inviolable (Secure Elements) combiné à des limites de montant strictes et des mécanismes de détection cryptographiques. Nous décrivons les éléments clés de ce cadre d'évaluation des risques.",
            "sec2_title": "Énoncé du Problème",
            "sec2_text1": "L'exécution de règlements numériques sans connexion en temps réel à un registre centralisé réintroduit le problème fondamental du double-dépense. En ligne, le registre valide chaque transaction. Hors ligne, le système doit s'appuyer sur un composant matériel de confiance local pour garantir que l'utilisateur ne dépense pas deux fois le même solde.",
            "sec2_callout": "La sécurité des MNBC hors ligne ne peut pas reposer sur des protections logicielles simples ; elle nécessite un périmètre de confiance matériel inviolable au niveau du terminal utilisateur.",
            "sec2_text2": "Si l'appareil physique hébergeant la MNBC (téléphone portable, carte à puce) est corrompu, des attaquants pourraient extraire les clés privées et créer de la fausse monnaie numérique. Ce risque de contrefaçon matérielle représente une menace sévère pour le bilan des banques centrales et la stabilité monétaire.",
            "sec3_title": "Contexte Politique",
            "sec3_text1": "La Banque centrale européenne (BCE) et d'autres autorités monétaires ont désigné le paiement hors ligne comme une fonctionnalité majeure pour la MNBC de détail. L'objectif est de répliquer les caractéristiques de l'argent fiduciaire : règlement immédiat, confidentialité et disponibilité en cas de panne de réseau électrique ou de télécommunications.",
            "sec3_text2": "Cependant, la mise en œuvre de la portabilité hors ligne nécessite de concilier les exigences de lutte contre le blanchiment (LCB-FT) avec la demande de confidentialité des transactions. Trouver le juste équilibre technique reste un défi politique complexe.",
            "sec4_title": "Analyse & Impact Opérationnel",
            "sec4_text1": "Notre matrice de risque catégorise les architectures MNBC hors ligne selon trois niveaux de dépendance matérielle. Le niveau le plus sûr utilise un élément sécurisé physique (Secure Element - SE) intégré aux téléphones ou aux cartes à puce. Le SE agit comme une enclave inviolable qui gère la signature des transactions et empêche toute modification frauduleuse du solde.",
            "sec4_text2": "Toutefois, les attaques physiques par canal auxiliaire et l'extraction de clés en laboratoire restent des menaces réelles. Pour atténuer l'impact d'une compromission matérielle, les banques centrales doivent imposer des limites opérationnelles strictes, notamment sur le montant maximum stockable hors ligne et sur la fréquence de synchronisation en ligne obligatoire.",
            "sec4_text3": "De plus, des protocoles cryptographiques avancés (signatures aveugles et preuves à divulgation nulle de connaissance) peuvent être déployés pour préserver la confidentialité des transactions hors ligne, tout en permettant la détection a posteriori du double-dépense lors de la reconnexion.",
            "sec5_title": "Recommandations Politiques",
            "sec5_text": "Sur la base de notre analyse de la sécurité matérielle et de l'économie monétaire, nous recommandons aux banques centrales et aux fournisseurs de technologies les normes suivantes :",
            "sec5_rec_header": "Normes clés pour les architectures MNBC hors ligne :",
            "sec5_rec1": "Limiter le solde maximum du portefeuille hors ligne à 150 EUR (ou équivalent) pour réduire l'impact systémique d'une faille matérielle.",
            "sec5_rec2": "Exiger l'utilisation d'éléments sécurisés certifiés EAL6+ pour tous les terminaux participant à l'écosystème MNBC hors ligne.",
            "sec5_rec3": "Implémenter des algorithmes de détection du double-dépense qui identifient les fraudeurs lors de la synchronisation et déclenchent la suspension automatique du compte.",
            "sec6_title": "Références & Citations",
            "sec6_ref1": "BCE (2024). Rapport de progrès sur la phase d'investigation de l'euro numérique - Focus sur la fonctionnalité hors ligne.",
            "sec6_ref2": "CPMI (2023). Central bank digital currencies for cross-border payments: security and interoperability principles.",
            "sec6_ref3": "DCM Core Technical Report (2025). Hardware-Enforced Trust and Cryptographic Bounds in Offline Digital Cash Architectures."
        }
    },
    "pb-2026-04": {
        "en": {
            "title": "PB-2026-04: DORA Operational Resilience Standards | DCM Core",
            "desc": "Policy Brief PB-2026-04 on DORA implementation, ICT risk management, and operational resilience standards for digital bonds and capital markets.",
            "canonical": "https://dcmcore.com/en/policy-briefs/pb-2026-04.html",
            "series_label": "DCM Core Policy Brief | PB-2026-04",
            "h1": "Implementing DORA: Operational Resilience Standards",
            "author_info": "DCM Core Policy & Compliance Unit",
            "date_info": "Publication: March 2026 | Format: 6-Page Standard",
            "sec1_title": "Executive Summary",
            "sec1_text1": "The European Union's Digital Operational Resilience Act (DORA) reshapes the compliance landscape for financial entities, including participants in digital debt capital markets. This brief analyzes the operational requirements of DORA for tokenized bond platforms, blockchain node operators, and decentralized ledger networks, identifying critical gaps in current risk management practices.",
            "sec1_text2": "We conclude that decentralized platforms must adopt structured ICT risk frameworks, establish incident classification workflows, and perform regular smart contract security audits. Aligning with DORA standards is essential to guarantee operational resilience during on-chain settlement cycles.",
            "sec2_title": "Problem Statement",
            "sec2_text1": "Tokenized bond platforms and DLT financial infrastructures often operate without standardized operational resilience protocols. Smart contract vulnerabilities, consensus mechanism failures, and decentralized governance deadlocks present unique ICT risks that traditional business continuity plans are not designed to address.",
            "sec2_callout": "Operational resilience in programmable finance cannot rely on legacy IT controls; it requires continuous, code-level auditing and distributed node monitoring.",
            "sec2_text2": "Under DORA, financial entities are directly responsible for the operational resilience of their third-party ICT providers. For platforms relying on public or hybrid blockchain networks, verifying the operational compliance of decentralized validators and node providers represents a severe compliance challenge.",
            "sec3_title": "Policy Context",
            "sec3_text1": "DORA establishes a single, comprehensive framework for digital operational resilience across the European financial sector, officially entering into force in January 2025. It covers banks, investment firms, payment institutions, and critical third-party ICT service providers, including blockchain technology platforms.",
            "sec3_text2": "The regulation mandates strict rules on ICT risk management, reporting of major ICT incidents, operational resilience testing, and third-party risk management. Non-compliance carries severe administrative penalties, driving rapid institutional adaptation.",
            "sec4_title": "Analysis & Operational Impact",
            "sec4_text1": "The operational impact of DORA on digital bond issuance is extensive. Issuers and Central Securities Depositories (CSDs) operating DLT infrastructures must demonstrate that their network nodes can withstand simulated cyber-attacks, network partitions, and malicious transaction injections without interrupting the settlement process.",
            "sec4_text2": "Furthermore, DORA requires continuous monitoring of third-party dependencies. For digital asset platforms, this means establishing Service Level Agreements (SLAs) with node host providers and audit firms, ensuring that smart contracts are audited and updated dynamically.",
            "sec4_text3": "Finally, the incident reporting requirements mandate that major ICT incidents, such as consensus delays or smart contract exploits, be classified and reported to supervisory authorities within a strict 4-hour window, requiring real-time logging tools.",
            "sec5_title": "Policy Recommendations",
            "sec5_text": "To ensure compliance with DORA and protect digital debt infrastructures from operational disruptions, we issue the following guidelines:",
            "sec5_rec_header": "Key Compliance Guidelines under DORA:",
            "sec5_rec1": "Deploy automated on-chain monitoring agents to log validator performance, block times, and smart contract execution anomalies in real time.",
            "sec5_rec2": "Establish multi-signature governance structures that allow rapid emergency patching of smart contracts while preserving audit trails.",
            "sec5_rec3": "Draft DORA-compliant addendums for all DLT node service contracts, clearly defining liability boundaries and failover procedures.",
            "sec6_title": "References & Citations",
            "sec6_ref1": "European Parliament (2022). Regulation (EU) 2022/2554 on digital operational resilience for the financial sector (DORA).",
            "sec6_ref2": "ESMA (2024). Consultation Paper on Draft Regulatory Technical Standards (RTS) under the Digital Operational Resilience Act.",
            "sec6_ref3": "DCM Core Compliance Guide (2025). Aligning Decentralized Ledger Infrastructures with DORA ICT Risk Frameworks."
        },
        "fr": {
            "title": "PB-2026-04 : Normes de résilience opérationnelle de DORA | DCM Core",
            "desc": "Note d'analyse PB-2026-04 sur la mise en œuvre de DORA, la gestion des risques TIC et les normes de résilience pour les obligations numériques.",
            "canonical": "https://dcmcore.com/fr/policy-briefs/pb-2026-04.html",
            "series_label": "Note de Politique DCM Core | PB-2026-04",
            "h1": "Mise en œuvre de DORA : Normes de résilience opérationnelle",
            "author_info": "Unité Politique & Conformité DCM Core",
            "date_info": "Publication : Mars 2026 | Format : Standard 6 pages",
            "sec1_title": "Résumé Exécutif",
            "sec1_text1": "Le règlement de l'Union européenne sur la résilience opérationnelle numérique (DORA) redéfinit le paysage de la conformité pour les entités financières, y compris les acteurs des marchés de dette numérique. Cette note analyse les exigences opérationnelles de DORA pour les plateformes d'obligations tokenisées, les opérateurs de nœuds blockchain et les infrastructures de registres distribués, identifiant les lacunes des pratiques actuelles.",
            "sec1_text2": "Nous concluons que les plateformes décentralisées doivent adopter des cadres structurés de gestion des risques TIC, établir des processus de classification des incidents et réaliser régulièrement des audits de contrats intelligents. S'aligner sur DORA est crucial pour sécuriser les cycles de règlement on-chain.",
            "sec2_title": "Énoncé du Problème",
            "sec2_text1": "Les plateformes d'obligations tokenisées et les infrastructures DLT financières opèrent souvent sans protocoles standardisés de résilience. Les vulnérabilités des contrats intelligents, les défaillances de consensus et les blocages de gouvernance représentent des risques informatiques uniques que les plans de continuité classiques ne savent pas gérer.",
            "sec2_callout": "La résilience opérationnelle en finance programmable ne peut pas reposer sur des contrôles informatiques traditionnels ; elle exige un audit permanent du code et une surveillance active des nœuds du réseau.",
            "sec2_text2": "Sous DORA, les entités financières sont directement responsables de la résilience opérationnelle de leurs prestataires de services informatiques tiers. Pour les plateformes qui s'appuient sur des réseaux de registres distribués publics ou hybrides, valider la conformité des validateurs et nœuds distants représente un défi majeur.",
            "sec3_title": "Contexte Politique",
            "sec3_text1": "DORA établit un cadre unique et complet pour la résilience opérationnelle numérique dans le secteur financier européen, entré en application en janvier 2025. Il s'applique aux banques, entreprises d'investissement, établissements de paiement et prestataires tiers de services TIC, dont les plateformes blockchain.",
            "sec3_text2": "Le règlement impose des règles strictes sur la gestion des risques informatiques, la notification des incidents majeurs, les tests de résilience opérationnelle et le suivi des risques liés aux tiers. Les sanctions administratives en cas de non-conformité obligent à une adaptation rapide.",
            "sec4_title": "Analyse & Impact Opérationnel",
            "sec4_text1": "L'impact de DORA sur l'émission d'obligations numériques est vaste. Les émetteurs et les Dépositaires Centraux de Titres (CSD) qui exploitent des infrastructures DLT doivent démontrer que leurs nœuds peuvent résister à des cyberattaques simulées, des partitions de réseau et des injections de transactions malveillantes sans interrompre les règlements.",
            "sec4_text2": "De plus, DORA impose un contrôle strict des dépendances vis-à-vis des tiers. Pour les plateformes d'actifs numériques, cela implique de définir des accords de niveau de service (SLA) avec les hébergeurs de nœuds et les auditeurs, assurant une vérification dynamique du code des smart contracts.",
            "sec4_text3": "Enfin, la déclaration des incidents exige que tout problème informatique majeur, tel qu'un retard de consensus ou un exploit de contrat intelligent, soit classifié et signalé aux autorités de surveillance dans un délai de 4 heures, nécessitant des outils de journalisation en temps réel.",
            "sec5_title": "Recommandations Politiques",
            "sec5_text": "Pour garantir la conformité à DORA et protéger les infrastructures de dette numérique contre les interruptions opérationnelles, nous recommandons les mesures suivantes :",
            "sec5_rec_header": "Directives de conformité clés sous DORA :",
            "sec5_rec1": "Déployer des agents de surveillance on-chain automatisés pour enregistrer en temps réel les performances des validateurs et les anomalies de smart contracts.",
            "sec5_rec2": "Mettre en place des structures de gouvernance multi-signatures permettant le déploiement rapide de correctifs d'urgence tout en conservant une piste d'audit.",
            "sec5_rec3": "Rédiger des avenants contractuels conformes à DORA pour tous les services de nœuds DLT, définissant clairement les responsabilités et les procédures de secours.",
            "sec6_title": "Références & Citations",
            "sec6_ref1": "Parlement européen (2022). Règlement (UE) 2022/2554 sur la résilience opérationnelle numérique du secteur financier (DORA).",
            "sec6_ref2": "ESMA (2024). Document de consultation sur les projets de normes techniques de réglementation (RTS) sous DORA.",
            "sec6_ref3": "DCM Core Compliance Guide (2025). Aligning Decentralized Ledger Infrastructures with DORA ICT Risk Frameworks."
        }
    },
    "pl-01": {
        "en": {
            "title": "PL-2026-01: MiCA Title III & IV Stablecoin Reserve Rules | DCM Core",
            "desc": "Policy Library PL-2026-01 outlining reserve segregation, capital requirements, and issuance rules under MiCA Titles III & IV.",
            "canonical": "https://dcmcore.com/en/policy-library/pl-01.html",
            "series_label": "DCM Core Policy Library | PL-2026-01",
            "h1": "MiCA Title III & IV: Stablecoin Issuance Framework",
            "author_info": "DCM Core Regulatory Intelligence Unit",
            "date_info": "Publication: March 2026 | Format: 6-Page Standard",
            "sec1_title": "Executive Summary",
            "sec1_text1": "MiCA Titles III and IV establish a comprehensive regulatory framework for issuers of Asset-Referenced Tokens (ARTs) and E-Money Tokens (EMTs). This paper provides an in-depth analysis of the prudential safeguards, reserve composition requirements, and asset segregation rules mandated by these titles, highlighting the operational challenges for institutional stablecoin issuers.",
            "sec1_text2": "We examine the strict rules governing reserve investment, custodian selection, and own-funds requirements. We conclude that while these measures significantly reduce run-risk and credit exposures, they introduce substantial compliance overhead and liquidity management constraints that favor large credit institutions.",
            "sec2_title": "Problem Statement",
            "sec2_text1": "Unregulated stablecoin models often lack clear legal frameworks for reserve ownership, leading to severe risk of asset loss during issuer insolvency. Furthermore, reserve assets held in illiquid or volatile instruments cannot be liquidated rapidly during mass redemptions, presenting systemic risks to digital asset markets.",
            "sec2_callout": "The core objective of MiCA Titles III & IV is to legally secure stablecoin backing reserves through bankruptcy-remote segregation, ensuring that token holders have a direct claim on liquid assets.",
            "sec2_text2": "Historically, issuers commingled customer funds with corporate assets or invested reserves in high-yield, high-risk commercial paper. Under MiCA, these practices are strictly prohibited, forcing issuers to redesign their custody relationships and reserve investment strategies.",
            "sec3_title": "Policy Context",
            "sec3_text1": "MiCA divides fiat-referenced tokens into E-Money Tokens (EMTs), which refer to a single official currency, and Asset-Referenced Tokens (ARTs), which refer to a basket of assets or currencies. Under Title III (for ARTs) and Title IV (for EMTs), issuers must obtain authorization from their National Competent Authority and publish a validated whitepaper.",
            "sec3_text2": "The regulation also introduces special classifications for tokens deemed 'significant' based on criteria such as market capitalization, daily transaction volumes, and interconnectedness. Significant tokens fall under the direct supervision of the European Banking Authority (EBA) and face higher prudential requirements.",
            "sec4_title": "Analysis & Operational Impact",
            "sec4_text1": "The operational impact of Titles III & IV centers on the strict reserve management rules. Under Article 36, issuers of ARTs must invest reserve assets only in highly liquid financial instruments with minimal market and credit risk. At least 30% of the reserve must be held as cash deposits in separate accounts at credit institutions.",
            "sec4_text2": "For significant tokens, the own-funds requirement increases from 2% to 3% of the average reserve assets, requiring issuers to hold substantial idle capital. Furthermore, reserve assets must be held in custody by licensed entities, completely isolated from the issuer's estate to ensure bankruptcy-remoteness.",
            "sec4_text3": "Additionally, EMT issuers must grant token holders a permanent right of redemption at par value, free of charge. This redemption right requires high liquidity buffer management, especially during periods of market stress when withdrawal volumes spike.",
            "sec5_title": "Policy Recommendations",
            "sec5_text": "To navigate the stringent requirements of MiCA Titles III & IV and optimize reserve yields within regulatory boundaries, we recommend the following strategies:",
            "sec5_rec_header": "Reserve Optimization Strategies:",
            "sec5_rec1": "Establish tri-party custodial agreements with multiple EU-licensed credit institutions to distribute counterparty risk and secure cash deposit enclaves.",
            "sec5_rec2": "Utilize automated liquidity laddering, maintaining a tiered reserve portfolio consisting of central bank deposits, short-term sovereign debt, and overnight repo facilities.",
            "sec5_rec3": "Implement real-time, on-chain proof of reserve systems to enhance transparency and mitigate run-risk through cryptographic verification.",
            "sec6_title": "References & Citations",
            "sec6_ref1": "Regulation (EU) 2023/1114 on markets in crypto-assets (MiCA) - Titles III and IV.",
            "sec6_ref2": "EBA (2024). Draft Regulatory Technical Standards on the composition of the reserve of assets for issuers of ARTs.",
            "sec6_ref3": "ESMA (2024). Joint Guidelines on the assessment of suitability of members of the management body of issuers of ARTs."
        },
        "fr": {
            "title": "PL-2026-01 : Règles de réserve des stablecoins de MiCA Titres III & IV | DCM Core",
            "desc": "Note de bibliothèque PL-2026-01 décrivant la ségrégation des réserves, les exigences de fonds propres et les règles d'émission selon les titres III & IV de MiCA.",
            "canonical": "https://dcmcore.com/fr/policy-library/pl-01.html",
            "series_label": "Bibliothèque de Politique DCM Core | PL-2026-01",
            "h1": "MiCA Titres III & IV : Cadre d'émission des stablecoins",
            "author_info": "Unité d'Intelligence Réglementaire DCM Core",
            "date_info": "Publication : Mars 2026 | Format : Standard 6 pages",
            "sec1_title": "Résumé Exécutif",
            "sec1_text1": "Les titres III et IV de MiCA établissent un cadre réglementaire complet pour les émetteurs de jetons se référant à des actifs (ART) et de jetons de monnaie électronique (EMT). Cette note propose une analyse approfondie des garanties prudentielles, des exigences de composition des réserves et des règles de ségrégation imposées par ces titres, mettant en lumière les défis opérationnels pour les émetteurs institutionnels.",
            "sec1_text2": "We examine the strict rules governing reserve investment, custodian selection, and own-funds requirements. We conclude that while these measures significantly reduce run-risk and credit exposures, they introduce substantial compliance overhead and liquidity management constraints that favor large credit institutions.",
            "sec2_title": "Énoncé du Problème",
            "sec2_text1": "Les modèles de stablecoins non réglementés manquent souvent de cadres juridiques clairs pour la propriété des réserves, ce qui expose les détenteurs à une perte totale d'actifs en cas d'insolvabilité de l'émetteur. De plus, les réserves investies dans des actifs illiquides ou volatils ne peuvent pas être revendues rapidement, menaçant la parité.",
            "sec2_callout": "L'objectif principal des titres III & IV de MiCA est de sécuriser juridiquement les réserves via un cloisonnement étanche, garantissant aux détenteurs un droit direct sur des actifs liquides.",
            "sec2_text2": "Historiquement, les émetteurs mélangeaient les fonds des clients avec leurs propres fonds, ou investissaient les réserves dans des papiers commerciaux risqués. Sous MiCA, ces pratiques sont interdites, obligeant les émetteurs à repenser leurs relations de conservation et leurs stratégies d'investissement.",
            "sec3_title": "Contexte Politique",
            "sec3_text1": "MiCA distingue les jetons de monnaie électronique (EMT), adossés à une monnaie fiduciaire unique, et les jetons se référant à des actifs (ART), adossés à un panier d'actifs ou de devises. Sous le titre III (pour les ART) et le titre IV (pour les EMT), les émetteurs doivent obtenir l'agrément de leur autorité nationale et publier un livre blanc approuvé.",
            "sec3_text2": "Le règlement introduit également des classifications pour les jetons qualifiés de 'significatifs' selon leur capitalisation ou leur volume de transactions. Les jetons significatifs sont placés sous la supervision directe de l'Autorité bancaire européenne (ABE) et font face à des contraintes prudentielles accrues.",
            "sec4_title": "Analyse & Impact Opérationnel",
            "sec4_text1": "L'impact opérationnel des titres III & IV se concentre sur les règles de gestion des réserves. Selon l'article 36, les émetteurs d'ART doivent investir les réserves uniquement dans des instruments financiers liquides à faible risque de marché. Au moins 30 % des réserves doivent être détenus sous forme de dépôts en espèces auprès d'établissements de crédit distincts.",
            "sec4_text2": "Pour les jetons significatifs, l'exigence de fonds propres passe de 2 % à 3 % des actifs de réserve moyens, immobilisant un capital important. De plus, les réserves doivent être confiées à des dépositaires agréés, isolés de la faillite de l'émetteur.",
            "sec4_text3": "Enfin, les émetteurs d'EMT doivent accorder aux détenteurs un droit permanent de remboursement au pair et sans frais. Ce droit exige une gestion prudente de la liquidité pour faire face aux vagues de retraits en période de stress de marché.",
            "sec5_title": "Recommandations Politiques",
            "sec5_text": "Pour naviguer dans le cadre des titres III & IV de MiCA et optimiser les rendements des réserves tout en respectant les limites réglementaires, nous recommandons les stratégies suivantes :",
            "sec5_rec_header": "Stratégies d'optimisation des réserves :",
            "sec5_rec1": "Établir des accords de conservation tri-partites avec plusieurs établissements de crédit de l'UE pour diversifier le risque de contrepartie.",
            "sec5_rec2": "Mettre en œuvre une gestion de liquidité échelonnée, combinant dépôts en banque centrale, dette souveraine à court terme et pensions de titres.",
            "sec5_rec3": "Déployer des systèmes de preuve de réserves on-chain en temps réel pour renforcer la transparence et la confiance des utilisateurs.",
            "sec6_title": "Références & Citations",
            "sec6_ref1": "Règlement (UE) 2023/1114 sur les marchés de crypto-actifs (MiCA) - Titres III et IV.",
            "sec6_ref2": "ABE (2024). Projets de normes techniques de réglementation sur la composition de la réserve d'actifs pour les émetteurs d'ART.",
            "sec6_ref3": "ESMA (2024). Orientations communes sur l'évaluation de l'honorabilité des membres de l'organe de direction des émetteurs d'ART."
        }
    },
    "pl-02": {
        "en": {
            "title": "PL-2026-02: Travel Rule Compliance & Data Exchange Protocols | DCM Core",
            "desc": "Policy Library PL-2026-02 analyzing FATF Travel Rule compliance, inter-CASP messaging standards, and privacy protocols.",
            "canonical": "https://dcmcore.com/en/policy-library/pl-02.html",
            "series_label": "DCM Core Policy Library | PL-2026-02",
            "h1": "Travel Rule Compliance and Data Exchange Protocols",
            "author_info": "DCM Core AML & Compliance Unit",
            "date_info": "Publication: March 2026 | Format: 6-Page Standard",
            "sec1_title": "Executive Summary",
            "sec1_text1": "The Financial Action Task Force (FATF) Recommendation 16, commonly known as the 'Travel Rule,' requires Crypto-Asset Service Providers (CASPs) to share originator and beneficiary information during transfers. This paper evaluates the technical frameworks, data transmission protocols, and privacy standards required to achieve seamless compliance while protecting personal data.",
            "sec1_text2": "We compare major industry messaging standards, including IVMS101, and analyze integration architectures for decentralized wallets. We conclude that addressing the 'sunrise issue' and ensuring cryptographic data privacy are the critical prerequisites for global Travel Rule implementation.",
            "sec2_title": "Problem Statement",
            "sec2_text1": "Public blockchain networks are designed as pseudonymous systems where accounts are identified only by public addresses. These networks lack native structures to attach identity data (such as names, addresses, or national ID numbers) to transactions, preventing compliance with wire transfer regulations.",
            "sec2_callout": "The technical challenge of the Travel Rule is attaching off-chain identity attributes to on-chain transactions without exposing sensitive user data to public view.",
            "sec2_text2": "Without secure, standardized channels for inter-CASP data transmission, sharing personally identifiable information (PII) exposes users to severe security and data privacy risks, potentially violating regulations like the EU's GDPR.",
            "sec3_title": "Policy Context",
            "sec3_text1": "The FATF updated its standards in 2019 to apply Recommendation 16 to virtual assets and virtual asset service providers (VASPs). In the European Union, this requirement was implemented via the Transfer of Funds Regulation (TFR) in 2023, which eliminates the traditional EUR 1,000 threshold for crypto-asset transfers.",
            "sec3_text2": "Under TFR, CASPs must transmit accurate originator and beneficiary data for every transaction, including transfers to and from unhosted (self-custody) wallets. This creates significant compliance friction, requiring CASPs to verify wallet ownership before processing transfers.",
            "sec4_title": "Analysis & Operational Impact",
            "sec4_text1": "The operational implementation of the Travel Rule requires CASPs to integrate specialized software solutions that link public addresses to verified identities. The industry has converged on the IVMS101 data standard, which provides a unified format for exchanging customer data fields.",
            "sec4_text2": "However, message exchange protocols remain fragmented. CASPs must choose between centralized messaging networks and decentralized routing protocols. This fragmentation creates interoperability barriers, especially when processing transactions between VASPs in jurisdictions with different regulatory timelines (the sunrise issue).",
            "sec4_text3": "Furthermore, interacting with self-custody wallets requires alternative verification methods, such as requiring users to sign a cryptographic message or perform micro-transactions to prove control of the address. These methods increase transaction latency and complicate the user experience.",
            "sec5_title": "Policy Recommendations",
            "sec5_text": "To achieve efficient Travel Rule compliance without compromising user privacy or operational speed, we recommend that CASPs and protocol designers adopt the following guidelines:",
            "sec5_rec_header": "Implementation Guidelines for Travel Rule Compliance:",
            "sec5_rec1": "Adopt the IVMS101 data standard universally to ensure structural compatibility across all compliance messaging software.",
            "sec5_rec2": "Implement zero-knowledge privacy protocols to verify identity attributes off-chain without transmitting raw PII across networks.",
            "sec5_rec3": "Participate in open VASP directories that allow real-time discovery of compliance endpoints and facilitate secure, encrypted peer-to-peer data channels.",
            "sec6_title": "References & Citations",
            "sec6_ref1": "FATF (2019). Guidance for a Risk-Based Approach to Virtual Assets and Virtual Asset Service Providers.",
            "sec6_ref2": "Regulation (EU) 2023/1113 on information accompanying transfers of funds and certain crypto-assets (TFR).",
            "sec6_ref3": "Joint Working Group on Interoperability (2020). IVMS101 Data Standard Specification."
        },
        "fr": {
            "title": "PL-2026-02 : Conformité à la Travel Rule & Protocoles d'échange de données | DCM Core",
            "desc": "Note de bibliothèque PL-2026-02 analysant la conformité à la Travel Rule du GAFI, les normes de messagerie inter-CASP et les protocoles de confidentialité.",
            "canonical": "https://dcmcore.com/fr/policy-library/pl-02.html",
            "series_label": "Bibliothèque de Politique DCM Core | PL-2026-02",
            "h1": "Conformité à la Travel Rule et protocoles d'échange de données",
            "author_info": "Unité LCB-FT & Conformité DCM Core",
            "date_info": "Publication : Mars 2026 | Format : Standard 6 pages",
            "sec1_title": "Résumé Exécutif",
            "sec1_text1": "La recommandation 16 du Groupe d'action financière (GAFI), communément appelée 'Travel Rule', exige que les prestataires de services sur crypto-actifs (CASP) s'échangent les informations sur l'initiateur et le bénéficiaire lors des transferts. Cette note évalue les cadres techniques, les protocoles de transmission de données et les normes de confidentialité requis pour assurer une conformité fluide tout en protégeant les données personnelles.",
            "sec1_text2": "Nous comparons les principales normes de messagerie, y compris IVMS101, et analysons les architectures pour portefeuilles auto-hébergés. Nous concluons que résoudre le problème du 'lever de soleil' (sunrise issue) et assurer la confidentialité cryptographique des données sont les étapes critiques pour la mise en œuvre globale.",
            "sec2_title": "Énoncé du Problème",
            "sec2_text1": "Les réseaux de chaînes de blocs publiques sont conçus comme des systèmes pseudonymes où les comptes ne sont identifiés que par des adresses publiques. Ces réseaux manquent de structures natives pour associer des données d'identité (noms, adresses, pièces d'identité) aux transactions, ce qui empêche la conformité avec les règles sur les transferts de fonds.",
            "sec2_callout": "Le défi technique de la Travel Rule consiste à associer des attributs d'identité hors chaîne à des transactions en chaîne sans exposer les données sensibles au public.",
            "sec2_text2": "Sans canaux sécurisés et standardisés pour la transmission de données entre CASP, le partage d'informations d'identification personnelle (PII) expose les utilisateurs à des risques de vol de données, potentiellement en violation avec le RGPD de l'UE.",
            "sec3_title": "Contexte Politique",
            "sec3_text1": "Le GAFI a mis à jour ses normes en 2019 pour appliquer la recommandation 16 aux actifs virtuels et à leurs prestataires (VASP). Dans l'Union européenne, cette règle a été mise en œuvre via le règlement sur les transferts de fonds (TFR) en 2023, qui supprime le seuil traditionnel de 1 000 EUR pour les crypto-actifs.",
            "sec3_text2": "Sous TFR, les CASP doivent transmettre des données précises sur l'initiateur et le bénéficiaire pour chaque transaction, y compris les transferts vers ou depuis des portefeuilles non hébergés (self-custody). Cela crée des frictions, obligeant les CASP à vérifier la propriété du portefeuille tiers.",
            "sec4_title": "Analyse & Impact Opérationnel",
            "sec4_text1": "La mise en œuvre opérationnelle de la Travel Rule exige que les CASP intègrent des solutions logicielles spécialisées reliant les adresses publiques à des identités vérifiées. L'industrie s'est unifiée autour de la norme de données IVMS101, qui fournit un format commun pour l'échange de champs clients.",
            "sec4_text2": "Cependant, les protocoles d'échange restent fragmentés. Les CASP doivent choisir entre réseaux de messagerie centralisés et protocoles de routage décentralisés. Cette fragmentation nuit à l'interopérabilité, en particulier lors d'échanges entre juridictions ayant des calendriers législatifs décalés.",
            "sec4_text3": "De plus, interagir avec les portefeuilles auto-hébergés exige des méthodes de vérification alternatives, comme la signature cryptographique d'un message par l'utilisateur ou la réalisation de micro-transactions pour prouver le contrôle de l'adresse, ce qui ralentit l'expérience.",
            "sec5_title": "Recommandations Politiques",
            "sec5_text": "Pour parvenir à une conformité efficace sans compromettre la vie privée des utilisateurs ni la vitesse opérationnelle, nous recommandons les directives suivantes :",
            "sec5_rec_header": "Directives de mise en œuvre de la Travel Rule :",
            "sec5_rec1": "Adopter universellement le standard de données IVMS101 pour assurer la compatibilité structurelle entre tous les logiciels de conformité.",
            "sec5_rec2": "Utiliser des protocoles de confidentialité zero-knowledge pour valider les attributs d'identité hors ligne sans transmettre les données brutes.",
            "sec5_rec3": "Participer à des annuaires ouverts de VASP permettant de découvrir en temps réel les terminaux de conformité et de sécuriser les communications.",
            "sec6_title": "Références & Citations",
            "sec6_ref1": "GAFI (2019). Orientations pour une approche fondée sur les risques pour les actifs virtuels et les prestataires de services d'actifs virtuels.",
            "sec6_ref2": "Règlement (UE) 2023/1113 sur les informations accompagnant les transferts de fonds et de certains crypto-actifs (TFR).",
            "sec6_ref3": "Joint Working Group on Interoperability (2020). Spécification du standard de données IVMS101."
        }
    },
    "pl-03": {
        "en": {
            "title": "PL-2026-03: Basel III Prudential Treatment for Crypto-Assets | DCM Core",
            "desc": "Policy Library PL-2026-03 evaluating BCBS prudential treatment of crypto-asset exposures, capital charges, and risk weighting.",
            "canonical": "https://dcmcore.com/en/policy-library/pl-03.html",
            "series_label": "DCM Core Policy Library | PL-2026-03",
            "h1": "Basel III Prudential Treatment for Crypto-Assets",
            "author_info": "DCM Core Banking & Risk Unit",
            "date_info": "Publication: March 2026 | Format: 6-Page Standard",
            "sec1_title": "Executive Summary",
            "sec1_text1": "The Basel Committee on Banking Supervision (BCBS) has finalized its prudential standards for bank exposures to crypto-assets, introducing a strict capital framework that divides digital assets into distinct risk groups. This paper evaluates the operational impact of these standards on commercial banks, focusing on the capital charges, risk weighting, and exposure limits applied to digital currencies.",
            "sec1_text2": "We analyze the differentiation between tokenized traditional assets and unbacked cryptocurrencies. We conclude that the punitive 1,250% risk weight applied to Group 2 assets effectively discourages banks from holding unbacked crypto-assets on their balance sheets, shaping institutional custody-only strategies.",
            "sec2_title": "Problem Statement",
            "sec2_text1": "Historically, bank exposures to volatile crypto-assets occurred without specific prudential rules, creating potential risks to solvency and liquidity. Traditional risk weights did not reflect the extreme price volatility, leverage, and operational vulnerabilities inherent in decentralized networks.",
            "sec2_callout": "The Basel III framework aims to isolate the traditional banking system from crypto-market shocks by applying prohibitive capital charges to unbacked assets, while facilitating tokenized traditional finance.",
            "sec2_text2": "The lack of clear capital rules limited commercial banks' ability to offer digital asset custody, market-making, and financing services. Developing compliant risk-management systems requires a detailed understanding of the Basel classification criteria.",
            "sec3_title": "Policy Context",
            "sec3_text1": "The BCBS finalized its standard 'Prudential treatment of crypto-asset exposures' in 2022, setting an implementation deadline for 2025. The framework classifies crypto-assets into Group 1 (which meet eligibility conditions) and Group 2 (which fail to meet the conditions, such as Bitcoin and Ether).",
            "sec3_text2": "Group 1 assets include Group 1a (tokenized traditional assets) and Group 1b (stablecoins with effective stabilization mechanisms). These assets are subject to capital requirements based on the underlying exposure. Group 2 assets are subject to a conservative, punitive treatment.",
            "sec4_title": "Analysis & Operational Impact",
            "sec4_text1": "The operational impact of the Basel standards is dominated by the treatment of Group 2 exposures. A risk weight of 1,250% means that banks must hold capital equal in value to the face value of their exposure. For example, holding $10 million of Group 2 assets requires holding $10 million in Tier 1 capital, making proprietary trading economically unviable.",
            "sec4_text2": "Furthermore, the committee established an exposure limit, restricting a bank's total Group 2 exposures to less than 1% of its Tier 1 capital. This aggregate limit prevents banks from accumulating systemic exposure to unbacked crypto-assets.",
            "sec4_text3": "For Group 1b stablecoins, banks must verify that the stabilization mechanism is effective, which involves monitoring daily price tracking and evaluating the creditworthiness of the reserve custodians. If a stablecoin fails these tests, it is demoted to Group 2, triggering capital charges.",
            "sec5_title": "Policy Recommendations",
            "sec5_text": "To align institutional digital asset strategies with Basel III capital requirements and ensure prudential compliance, we recommend the following measures:",
            "sec5_rec_header": "Banking Risk Management Guidelines:",
            "sec5_rec1": "Focus bank services on Group 1a tokenized traditional assets and Group 1b regulated stablecoins to optimize capital efficiency.",
            "sec5_rec2": "Structure digital asset services as off-balance-sheet custody operations, ensuring that client assets are segregated and do not trigger bank capital charges.",
            "sec5_rec3": "Implement real-time risk dashboarding to monitor stablecoin collateral stability and ensure exposures remain within the 1% Tier 1 capital limit.",
            "sec6_title": "References & Citations",
            "sec6_ref1": "BCBS (2022). Standard: Prudential treatment of crypto-asset exposures. Basel Committee on Banking Supervision.",
            "sec6_ref2": "BIS (2023). Banking system exposure to crypto-assets: a survey of capital treatments.",
            "sec6_ref3": "DCM Core Analysis (2025). Capital Efficiency and Risk-Weighted Assets under the Basel Committee Crypto-Asset Standards."
        },
        "fr": {
            "title": "PL-2026-03 : Traitement prudentiel de Bâle III pour les crypto-actifs | DCM Core",
            "desc": "Note de bibliothèque PL-2026-03 évaluant le traitement prudentiel du BCBS pour les expositions aux crypto-actifs et la pondération des risques.",
            "canonical": "https://dcmcore.com/fr/policy-library/pl-03.html",
            "series_label": "Bibliothèque de Politique DCM Core | PL-2026-03",
            "h1": "Traitement prudentiel de Bâle III pour les crypto-actifs",
            "author_info": "Unité Bancaire & Risques DCM Core",
            "date_info": "Publication : Mars 2026 | Format : Standard 6 pages",
            "sec1_title": "Résumé Exécutif",
            "sec1_text1": "Le Comité de Bâle sur le contrôle bancaire (BCBS) a finalisé ses normes prudentielles relatives aux expositions bancaires sur crypto-actifs, introduisant un cadre de capital strict qui divise ces actifs en différents groupes de risques. Cette note évalue l'impact opérationnel de ces normes sur les banques commerciales, en se concrétisant sur les exigences de fonds propres, les pondérations des risques et les limites d'exposition.",
            "sec1_text2": "Nous analysons la différence de traitement entre les actifs traditionnels tokenisés et les crypto-actifs non adossés. Nous concluons que la pondération punitive de 1 250 % appliquée au Groupe 2 dissuade de fait les banques de détenir des crypto-actifs dans leur bilan, orientant les stratégies vers des services de conservation pure.",
            "sec2_title": "Énoncé du Problème",
            "sec2_text1": "Historiquement, les banques s'exposaient à des crypto-actifs sans règles prudentielles spécifiques, ce qui menaçait leur solvabilité et leur liquidité. Les pondérations traditionnelles ne reflétaient pas la volatilité extrême, l'effet de levier et les risques opérationnels inhérents aux réseaux décentralisés.",
            "sec2_callout": "Le cadre de Bâle III vise à isoler le système bancaire traditionnel des chocs du marché des crypto-actifs en imposant des contraintes de capital prohibitives sur les actifs non adossés.",
            "sec2_text2": "L'absence de règles claires limitait la capacité des banques commerciales à proposer des services de garde, de tenue de marché et de financement d'actifs numériques. Bâtir un système de gestion des risques conforme exige une maîtrise parfaite des critères de Bâle.",
            "sec3_title": "Contexte Politique",
            "sec3_text1": "Le BCBS a finalisé sa norme 'Prudential treatment of crypto-asset exposures' en 2022, fixant la mise en œuvre à 2025. Le texte classe les crypto-actifs en deux catégories : le Groupe 1 (qui respectent les critères d'éligibilité) et le Groupe 2 (qui échouent à les respecter, comme le Bitcoin et l'Ether).",
            "sec3_text2": "Le Groupe 1 regroupe le Groupe 1a (actifs traditionnels tokenisés) et le Groupe 1b (stablecoins disposant d'un mécanisme de stabilisation efficace). Ces actifs sont soumis à des exigences de fonds propres basées sur le risque de l'actif sous-jacent. Le Groupe 2 subit un traitement très conservateur.",
            "sec4_title": "Analyse & Impact Opérationnel",
            "sec4_text1": "L'impact opérationnel des normes de Bâle est dominé par le traitement du Groupe 2. Une pondération de 1 250 % signifie que les banques doivent détenir des fonds propres équivalents à 100 % de la valeur de leur exposition. Par exemple, détenir 10 millions USD d'actifs du Groupe 2 exige de bloquer 10 millions USD de fonds propres Tier 1.",
            "sec4_text2": "De plus, le comité a mis en place une limite d'exposition, interdisant aux banques de détenir des actifs du Groupe 2 pour un montant supérieur à 1 % de leurs fonds propres Tier 1. Cette limite globale empêche l'accumulation de risques systémiques au sein des banques.",
            "sec4_text3": "Pour les stablecoins du Groupe 1b, les banques doivent vérifier l'efficacité du mécanisme de stabilisation, ce qui implique de surveiller l'écart de prix quotidien et la solvabilité des dépositaires des réserves. En cas d'échec, le stablecoin est déclassé dans le Groupe 2.",
            "sec5_title": "Recommandations Politiques",
            "sec5_text": "Pour aligner les stratégies d'actifs numériques des banques sur les exigences de capital de Bâle III et garantir la conformité, nous recommandons les mesures suivantes :",
            "sec5_rec_header": "Directives de gestion des risques bancaires :",
            "sec5_rec1": "Orienter les services bancaires vers les actifs tokenisés du Groupe 1a et les stablecoins régulés du Groupe 1b pour optimiser l'utilisation du capital.",
            "sec5_rec2": "Structurer les services d'actifs numériques sous forme de garde hors-bilan, assurant que les actifs des clients ne déclenchent pas d'exigences de fonds propres pour la banque.",
            "sec5_rec3": "Mettre en œuvre des outils de suivi en temps réel pour s'assurer que les expositions aux actifs du Groupe 2 restent bien en deçà de la limite de 1 % du Tier 1.",
            "sec6_title": "Références & Citations",
            "sec6_ref1": "BCBS (2022). Norme : Traitement prudentiel des expositions sur crypto-actifs. Comité de Bâle sur le contrôle bancaire.",
            "sec6_ref2": "BRI (2023). Exposition du système bancaire aux crypto-actifs : enquête sur les traitements des capitaux.",
            "sec6_ref3": "DCM Core Analysis (2025). Capital Efficiency and Risk-Weighted Assets under the Basel Committee Crypto-Asset Standards."
        }
    },
    "pl-04": {
        "en": {
            "title": "PL-2026-04: DORA Regulatory Technical Standards on ICT Risk | DCM Core",
            "desc": "Policy Library PL-2026-04 explaining DORA RTS on ICT risk management frameworks, classification of ICT incidents, and third-party risk.",
            "canonical": "https://dcmcore.com/en/policy-library/pl-04.html",
            "series_label": "DCM Core Policy Library | PL-2026-04",
            "h1": "DORA Regulatory Technical Standards (RTS) on ICT Risk",
            "author_info": "DCM Core Policy & Compliance Unit",
            "date_info": "Publication: March 2026 | Format: 6-Page Standard",
            "sec1_title": "Executive Summary",
            "sec1_text1": "The European Supervisory Authorities (ESAs) have published the final Regulatory Technical Standards (RTS) under the Digital Operational Resilience Act (DORA). This paper provides a detailed technical analysis of the RTS, focusing on the specific requirements for ICT risk management frameworks, incident classification thresholds, and third-party contract clauses.",
            "sec1_text2": "We evaluate the operational challenges of aligning existing security architectures with the RTS criteria. We conclude that implementing automated logging, developing standardized incident reporting workflows, and auditing cloud and blockchain infrastructure providers are critical steps for compliance.",
            "sec2_title": "Problem Statement",
            "sec2_text1": "Financial entities face a rapid increase in cyber-attacks and operational disruptions, yet ICT risk management remains fragmented. Traditional risk frameworks lack specific guidelines for evaluating the resilience of modern digital systems, such as cloud hosting platforms and distributed database networks.",
            "sec2_callout": "The DORA RTS translates high-level legal principles into concrete, technical requirements, forcing financial institutions to establish auditable operational resilience baselines.",
            "sec2_text2": "Furthermore, classifying major ICT incidents under the RTS requires analyzing multiple criteria simultaneously (such as data loss, service downtime, and geographic impact) within short timeframes, creating operational bottlenecks for compliance teams.",
            "sec3_title": "Policy Context",
            "sec3_text1": "Under DORA, the ESAs (EBA, EIOPA, and ESMA) are mandated to develop technical standards that specify the operational requirements for financial entities. The final RTS packages clarify the rules for ICT risk management systems, incident classification, and registers of information for third-party ICT service providers.",
            "sec3_text2": "These standards establish a harmonized compliance template across the EU, ensuring that banks, insurance companies, and critical service providers follow the same technical guidelines, enhancing the overall resilience of the EU financial system.",
            "sec4_title": "Analysis & Operational Impact",
            "sec4_text1": "The RTS imposes detailed requirements on ICT risk management frameworks. Financial entities must document all ICT assets, map their interdependencies, and perform regular vulnerability assessments. For complex systems, this requires automated discovery and logging tools to maintain an up-to-date asset register.",
            "sec4_text2": "In addition, the incident reporting standards define specific thresholds for major incidents. An incident is classified as major if it affects critical services, causes data corruption, or impacts more than 10% of customers. Once classified, entities must submit initial reports to regulators within 4 hours, requiring predefined escalation playbooks.",
            "sec4_text3": "Finally, third-party risk management rules mandate that contracts with ICT service providers include specific clauses on access rights, audit permissions, and service level agreements. This requirement forces financial institutions to audit their current cloud, custody, and software vendors for compliance.",
            "sec5_title": "Policy Recommendations",
            "sec5_text": "To align corporate ICT governance with the DORA RTS and ensure operational compliance before audit deadlines, we recommend the following measures:",
            "sec5_rec_header": "ICT Resilience Guidelines:",
            "sec5_rec1": "Integrate automated asset-discovery and vulnerability-scanning tools to maintain an auditable register of all IT and DLT components.",
            "sec5_rec2": "Build standardized incident classification templates that calculate severity scores automatically based on the RTS criteria.",
            "sec5_rec3": "Perform regular mock exercises simulating cloud outages and blockchain consensus partitions to test incident response and failover protocols.",
            "sec6_title": "References & Citations",
            "sec6_ref1": "ESAs (2024). Final Draft Regulatory Technical Standards on ICT risk management framework and simplified ICT risk management framework.",
            "sec6_ref2": "European Commission (2023). Delegated Regulation supplementing Regulation (EU) 2022/2554 with regard to regulatory technical standards.",
            "sec6_ref3": "DCM Core Compliance Guide (2025). Technical Implementation of DORA RTS Incident Classification Frameworks."
        },
        "fr": {
            "title": "PL-2026-04 : Normes techniques réglementaires (RTS) de DORA sur le risque TIC | DCM Core",
            "desc": "Note de bibliothèque PL-2026-04 expliquant les RTS de DORA sur la gestion des risques TIC, la classification des incidents et les risques tiers.",
            "canonical": "https://dcmcore.com/fr/policy-library/pl-04.html",
            "series_label": "Bibliothèque de Politique DCM Core | PL-2026-04",
            "h1": "Normes techniques réglementaires (RTS) de DORA sur le risque TIC",
            "author_info": "Unité Politique & Conformité DCM Core",
            "date_info": "Publication : Mars 2026 | Format : Standard 6 pages",
            "sec1_title": "Résumé Exécutif",
            "sec1_text1": "Les Autorités de surveillance européennes (ESA) ont publié les normes techniques de réglementation (RTS) finales dans le cadre du règlement sur la résilience opérationnelle numérique (DORA). Cette note propose une analyse technique des RTS, en se concentrant sur les exigences spécifiques relatives aux cadres de gestion des risques TIC, aux seuils de classification des incidents et aux clauses contractuelles avec les tiers.",
            "sec1_text2": "Nous évaluons les défis opérationnels de l'alignement des architectures existantes sur les critères des RTS. Nous concluons que la mise en œuvre de la journalisation automatisée, le développement de processus de déclaration des incidents et l'audit des fournisseurs d'infrastructure (cloud, blockchain) sont des étapes clés.",
            "sec2_title": "Énoncé du Problème",
            "sec2_text1": "Les entités financières font face à une augmentation des cyberattaques, mais la gestion des risques informatiques reste fragmentée. Les cadres traditionnels manquent de directives pour évaluer la résilience des systèmes modernes, tels que l'hébergement cloud et les réseaux de bases de données distribuées.",
            "sec2_callout": "Les RTS de DORA traduisent des principes juridiques en exigences techniques précises, obligeant les institutions financières à établir des niveaux de résilience opérationnelle vérifiables.",
            "sec2_text2": "De plus, classifier les incidents TIC majeurs selon les RTS exige d'analyser simultanément plusieurs critères (perte de données, indisponibilité, impact géographique) dans des délais très courts, créant des goulots d'étranglement pour les équipes de conformité.",
            "sec3_title": "Contexte Politique",
            "sec3_text1": "Sous DORA, les ESA (ABE, EIOPA et ESMA) sont chargées d'élaborer des normes techniques précisant les obligations des entités financières. Les paquets de RTS clarifient les règles pour les systèmes de gestion des risques TIC, la classification des incidents et les registres d'informations des prestataires tiers.",
            "sec3_text2": "Ces normes établissent un modèle de conformité harmonisé dans toute l'UE, garantissant que les banques, les compagnies d'assurance et les prestataires critiques suivent les mêmes règles techniques, renforçant la résilience globale du secteur financier.",
            "sec4_title": "Analyse & Impact Opérationnel",
            "sec4_text1": "Les RTS imposent des obligations détaillées sur le cadre de gestion des risques TIC. Les entités doivent documenter tous leurs actifs informatiques, cartographier leurs dépendances et réaliser régulièrement des évaluations de vulnérabilité, nécessitant des outils de cartographie automatisés.",
            "sec4_text2": "De plus, les normes de notification définissent des seuils précis pour les incidents majeurs. Un incident est majeur s'il affecte des services critiques, corrompt des données ou touche plus de 10 % des clients. Les entités doivent soumettre un rapport initial sous 4 heures, exigeant des procédures d'escalade prêtes.",
            "sec4_text3": "Enfin, les règles de gestion des tiers imposent d'inclure des clauses spécifiques (droits d'accès, d'audit, SLA) dans les contrats avec les fournisseurs de TIC. Cela oblige les institutions à auditer l'ensemble de leurs prestataires de services cloud, de garde et de logiciels.",
            "sec5_title": "Recommandations Politiques",
            "sec5_text": "Pour aligner la gouvernance informatique d'entreprise sur les RTS de DORA et garantir la conformité avant les échéances d'audit, nous recommandons les mesures suivantes :",
            "sec5_rec_header": "Directives de résilience informatique :",
            "sec5_rec1": "Intégrer des outils automatisés de découverte d'actifs et de détection des vulnérabilités pour tenir à jour le registre de tous les composants IT et DLT.",
            "sec5_rec2": "Créer des modèles d'évaluation d'incidents qui calculent automatiquement les scores de gravité selon les critères des RTS.",
            "sec5_rec3": "Organiser régulièrement des exercices de simulation de pannes cloud ou blockchain pour tester les protocoles de secours et de basculement.",
            "sec6_title": "Références & Citations",
            "sec6_ref1": "ESA (2024). Projet de normes techniques de réglementation sur le cadre de gestion des risques TIC sous DORA.",
            "sec6_ref2": "Commission européenne (2023). Règlement délégué complétant le règlement (UE) 2022/2554 en ce qui concerne les normes techniques de réglementation.",
            "sec6_ref3": "DCM Core Compliance Guide (2025). Technical Implementation of DORA RTS Incident Classification Frameworks."
        }
    },
    "pl-05": {
        "en": {
            "title": "PL-2026-05: Wholesale CBDC Interoperability & Settlement Models | DCM Core",
            "desc": "Policy Library PL-2026-05 analyzing wholesale CBDC integration architectures, RTGS linkages, and distributed ledger interoperability.",
            "canonical": "https://dcmcore.com/en/policy-library/pl-05.html",
            "series_label": "DCM Core Policy Library | PL-2026-05",
            "h1": "Wholesale CBDC Interoperability & Settlement Models",
            "author_info": "DCM Core Macro-Tech Unit",
            "date_info": "Publication: March 2026 | Format: 6-Page Standard",
            "sec1_title": "Executive Summary",
            "sec1_text1": "Wholesale Central Bank Digital Currencies (wCBDC) are widely recognized as a critical tool for improving the efficiency and safety of interbank settlement. This paper evaluates the technical interoperability models between permissioned DLT platforms and legacy Real-Time Gross Settlement (RTGS) systems, comparing trigger mechanisms, bridged networks, and native multi-ledger solutions.",
            "sec1_text2": "We assess the trade-offs of each architecture regarding processing speed, liquidity lockup, and system complexity. We conclude that trigger solutions minimize central bank ledger integration risks, whereas native wCBDC architectures offer the highest settlement efficiency but require deeper regulatory restructuring.",
            "sec2_title": "Problem Statement",
            "sec2_text1": "The integration of on-chain digital assets (such as tokenized bonds or commercial paper) with central bank money requires atomic settlement (Delivery-versus-Payment). However, central banks are hesitant to host their main balance sheet accounts on distributed ledgers, creating a disconnect between tokenized assets and cash legs.",
            "sec2_callout": "Developing a wCBDC is not just a technological upgrade, but a structural re-engineering of the central bank's relationship with commercial bank ledgers.",
            "sec2_text2": "Without interoperable settlement links, financial institutions must lock up liquidity in separate pools on different networks. This liquidity fragmentation increases financing costs, limits capital efficiency, and complicates real-time treasury management.",
            "sec3_title": "Policy Context",
            "sec3_text1": "The BIS Innovation Hub and central banks globally have launched trials (such as Project Helvetia in Switzerland and the Eurosystem exploratory work) to test wCBDC settlement. These initiatives aim to ensure that central bank money remains the ultimate settlement asset for wholesale financial transactions, even as capital markets tokenize.",
            "sec3_text2": "Regulators must decide whether to support trigger solutions (which link external DLTs to legacy RTGS systems via APIs) or to deploy native wCBDCs directly on shared DLT networks. This choice has major implications for monetary policy implementation and systemic risk.",
            "sec4_title": "Analysis & Operational Impact",
            "sec4_text1": "Our comparative analysis focuses on the operational trade-offs of the three primary settlement models. The first model, the Trigger Solution, allows an on-chain asset transaction to trigger a payment instructions inside the traditional RTGS system. This model keeps central bank accounts secure on legacy systems but does not support true atomic swap capabilities.",
            "sec4_text2": "The second model, the Bridged Network, uses interoperability protocols to lock assets on one ledger and issue equivalent tokens on another. This model enables cross-chain DvP but introduces smart contract risk and potential security vulnerabilities at the bridge interface.",
            "sec4_text3": "The third model, native wCBDC, issues central bank money directly on a shared DLT platform where tokenized assets reside. This model achieves true, real-time atomic settlement with zero credit risk, but requires central banks to manage node security and validator consensus directly.",
            "sec5_title": "Policy Recommendations",
            "sec5_text": "To guide central banks and commercial participants in implementing interoperable wholesale settlement infrastructures, we recommend the following design principles:",
            "sec5_rec_header": "Design Principles for wCBDC Interoperability:",
            "sec5_rec1": "Deploy hybrid architectures, starting with trigger solutions to secure immediate DvP capabilities, while building native wCBDC pilot infrastructures for next-generation platforms.",
            "sec5_rec2": "Standardize cross-chain interoperability APIs based on open protocols to prevent vendor lock-in and support multi-platform integration.",
            "sec5_rec3": "Implement liquidity-saving mechanisms (LSMs) in wCBDC platforms to minimize the liquidity requirements of real-time atomic settlement.",
            "sec6_title": "References & Citations",
            "sec6_ref1": "ECB (2024). Explanatory note on the Eurosystem exploratory work on new technologies for wholesale settlement.",
            "sec6_ref2": "BIS Innovation Hub (2023). Project Helvetia Phase III: Settling wholesale transactions in central bank money on a DLT platform.",
            "sec6_ref3": "DCM Core Technical Report (2025). Structural Interoperability and Liquidity Allocation in Wholesale Central Bank Digital Currency Models."
        },
        "fr": {
            "title": "PL-2026-05 : Interopérabilité des MNBC de gros & Modèles de règlement | DCM Core",
            "desc": "Note de bibliothèque PL-2026-05 analysant les architectures d'intégration des MNBC de gros, les liaisons RTGS et l'interopérabilité des registres.",
            "canonical": "https://dcmcore.com/fr/policy-library/pl-05.html",
            "series_label": "Bibliothèque de Politique DCM Core | PL-2026-05",
            "h1": "Interopérabilité des MNBC de gros et modèles de règlement",
            "author_info": "Unité Macro-Tech DCM Core",
            "date_info": "Publication : Mars 2026 | Format : Standard 6 pages",
            "sec1_title": "Résumé Exécutif",
            "sec1_text1": "Les monnaies numériques de banque centrale de gros (MNBCg) sont largement reconnues comme un outil majeur pour améliorer l'efficacité et la sécurité des règlements interbancaires. Cette note évalue les modèles techniques d'interopérabilité entre les plateformes DLT privées et les systèmes de règlement brut en temps réel (RTGS) traditionnels, comparant mécanismes de déclenchement (trigger), ponts de réseaux et solutions multi-registres natives.",
            "sec1_text2": "Nous analysons les compromis de chaque architecture en termes de vitesse de traitement, de blocage des liquidités et de complexité. Nous concluons que les solutions trigger minimisent les risques d'intégration pour les banques centrales, tandis que les architectures natives offrent la meilleure efficacité mais exigent des réformes profondes.",
            "sec2_title": "Énoncé du Problème",
            "sec2_text1": "L'intégration d'actifs numériques on-chain (obligations tokenisées, titres de créance) avec la monnaie de banque centrale exige un règlement atomique (livraison contre paiement - DvP). Cependant, les banques centrales hésitent à héberger leurs comptes sur des registres distribués, créant une déconnexion entre le transfert de l'actif et sa jambe cash.",
            "sec2_callout": "La reconstruction de la relation de la banque centrale avec les banques commerciales exige des modifications fonctionnelles profondes au niveau de l'infrastructure de règlement.",
            "sec2_text2": "En l'absence de liens d'interopérabilité, les institutions doivent bloquer des liquidités dans des réservoirs distincts sur différents réseaux. Cette fragmentation des liquidités augmente les coûts de financement et complique la gestion de trésorerie en temps réel.",
            "sec3_title": "Contexte Politique",
            "sec3_text1": "Le Hub d'innovation de la BRI et les banques centrales mènent des expérimentations (comme le Projet Helvetia en Suisse et les travaux exploratoires de l'Eurosystème) pour tester le règlement en MNBCg. L'objectif est de garantir que la monnaie centrale reste l'actif de règlement ultime alors que les marchés financiers se tokenisent.",
            "sec3_text2": "Les régulateurs doivent choisir entre soutenir des solutions trigger (qui lient les DLT externes aux systèmes RTGS via des API) ou déployer des MNBCg natives directement sur des réseaux blockchain partagés. Ce choix a des conséquences lourdes sur la politique monétaire et le risque systémique.",
            "sec4_title": "Analyse & Impact Opérationnel",
            "sec4_text1": "Notre analyse comparative se concentre sur les compromis des trois principaux modèles. Le premier modèle, la Solution Trigger, permet à une transaction d'actif on-chain de déclencher une instruction de paiement dans le système RTGS traditionnel. Cela protège les comptes de la banque centrale mais ne permet pas un échange atomique parfait.",
            "sec4_text2": "Le deuxième modèle, le Réseau Ponté, utilise des protocoles d'interopérabilité pour verrouiller les actifs sur un registre et émettre des jetons équivalents sur un autre. Il permet le DvP cross-chain mais introduit des risques de contrats intelligents et de failles au niveau du pont.",
            "sec4_text3": "Le troisième modèle, la MNBCg native, émet la monnaie centrale directement sur la plateforme DLT où résident les actifs tokenisés. Il réalise un règlement atomique en temps réel sans risque de crédit, mais oblige les banques centrales à gérer la sécurité des nœuds et le consensus du réseau.",
            "sec5_title": "Recommandations Politiques",
            "sec5_text": "Pour guider les banques centrales et les acteurs de marché dans la mise en œuvre d'infrastructures de règlement de gros interopérables, nous recommandons les principes de conception suivants :",
            "sec5_rec_header": "Principes de conception pour l'interopérabilité des MNBCg :",
            "sec5_rec1": "Déployer des architectures hybrides, en commençant par des solutions trigger pour sécuriser le DvP à court terme, tout en préparant des pilotes de MNBCg natives.",
            "sec5_rec2": "Standardiser les API d'interopérabilité cross-chain sur la base de protocoles ouverts pour éviter le verrouillage technologique et soutenir l'intégration multi-plateformes.",
            "sec5_rec3": "Mettre en œuvre des mécanismes d'économie de liquidité (LSM) dans les plateformes de MNBCg pour minimiser les besoins en capital du règlement atomique.",
            "sec6_title": "Références & Citations",
            "sec6_ref1": "BCE (2024). Note explicative sur les travaux exploratoires de l'Eurosystème sur les nouvelles technologies pour le règlement de gros.",
            "sec6_ref2": "BIS Innovation Hub (2023). Project Helvetia Phase III: Settling wholesale transactions in central bank money on a DLT platform.",
            "sec6_ref3": "DCM Core Technical Report (2025). Structural Interoperability and Liquidity Allocation in Wholesale Central Bank Digital Currency Models."
        }
    },
    "pl-06": {
        "en": {
            "title": "PL-2026-06: FX Settlement Risk & PvP Mechanisms in Multi-CBDC | DCM Core",
            "desc": "Policy Library PL-2026-06 addressing foreign exchange settlement risks and Payment-versus-Payment (PvP) protocols in multi-CBDC bridges.",
            "canonical": "https://dcmcore.com/en/policy-library/pl-06.html",
            "series_label": "DCM Core Policy Library | PL-2026-06",
            "h1": "FX Settlement Risk & PvP Mechanisms in Multi-CBDC Bridges",
            "author_info": "DCM Core Market Infrastructure Unit",
            "date_info": "Publication: March 2026 | Format: 6-Page Standard",
            "sec1_title": "Executive Summary",
            "sec1_text1": "Foreign exchange (FX) settlement risk, historically known as Herstatt risk, remains a significant vulnerability in global financial markets. This paper analyzes the technical design of Payment-versus-Payment (PvP) settlement mechanisms within multi-CBDC platforms, exploring how distributed ledger technologies can synchronize cross-border, cross-currency legs.",
            "sec1_text2": "We evaluate current multi-CBDC pilot projects, such as Project mBridge, and model their impact on credit risk, processing latency, and liquidity demands. We conclude that DLT-based PvP mechanisms effectively eliminate settlement risk but increase real-time liquidity requirements for participating commercial banks.",
            "sec2_title": "Problem Statement",
            "sec2_text1": "In traditional FX transactions, the two currency legs are often settled in different time zones and across separate national payment systems. This time lag exposes counterparties to settlement risk: one party might pay the designated currency but fail to receive the counter-currency if the partner defaults in the interim.",
            "sec2_callout": "DLT-based PvP mechanisms resolve FX settlement risk by executing cross-currency payments as a single, atomic transaction that succeeds or fails as a unified whole.",
            "sec2_text2": "While existing institutions like CLS Group provide PvP services for major currency pairs, many emerging market currencies remain unsupported. Expanding PvP settlement to these corridors requires alternative, decentralized infrastructure models.",
            "sec3_title": "Policy Context",
            "sec3_text1": "The G20 roadmap for enhancing cross-border payments designates the expansion of PvP settlement as a priority action. The Committee on Payments and Market Infrastructures (CPMI) encourages the development of new technologies, including wCBDC and shared ledgers, to facilitate PvP access for broader markets.",
            "sec3_text2": "Regulators and central banks are collaborating on multi-CBDC platforms (such as Project mBridge) that allow commercial banks to conduct direct cross-border payments on a single, shared network. Establishing appropriate governance and legal frameworks for these bridges is a key regulatory challenge.",
            "sec4_title": "Analysis & Operational Impact",
            "sec4_text1": "The operational impact of DLT-based PvP settlement lies in the synchronization of ledger states. Using smart contracts and Hashed Timelock Contracts (HTLCs), the multi-CBDC bridge guarantees that the transfer of Currency A is cryptographically locked until the transfer of Currency B is completed. This atomic swap architecture removes credit risk entirely.",
            "sec4_text2": "However, our liquidity modeling reveals a significant trade-off. Because payments settle instantly and individually, banks can no longer benefit from the end-of-day netting offered by traditional clearing houses. This real-time settlement increases the demand for intraday liquidity.",
            "sec4_text3": "Additionally, participating banks must manage access to central bank money across multiple jurisdictions, requiring real-time treasury systems and interoperable connections between the multi-CBDC platform and various domestic RTGS systems.",
            "sec5_title": "Policy Recommendations",
            "sec5_text": "To optimize the implementation of PvP mechanisms in multi-CBDC environments and balance the trade-offs of real-time settlement, we recommend that infrastructures and banks adopt the following measures:",
            "sec5_rec_header": "PvP Integration Recommendations:",
            "sec5_rec1": "Integrate automated liquidity-saving mechanisms (LSMs), such as bilateral and multilateral queue netting, directly into multi-CBDC platform code.",
            "sec5_rec2": "Establish standardized legal frameworks that recognize on-chain settlement finality across all participating jurisdictions.",
            "sec5_rec3": "Connect multi-CBDC bridges to domestic RTGS systems via high-speed, secure API channels to facilitate instant liquidity recycling and rebalancing.",
            "sec6_title": "References & Citations",
            "sec6_ref1": "CPMI (2022). Facilitating increased adoption of payment-versus-payment (PvP): proposals for encouraging PvP settlement.",
            "sec6_ref2": "BIS Innovation Hub (2024). Project mBridge: Building a multi-CBDC platform for real-time cross-border payments.",
            "sec6_ref3": "DCM Core Market Infrastructure Study (2025). Intraday Liquidity Demands and Atomic Swaps in Decentralized FX Settlement Protocols."
        },
        "fr": {
            "title": "PL-2026-06 : Risque de règlement de change & Mécanismes PvP dans les ponts multi-MNBC | DCM Core",
            "desc": "Note de bibliothèque PL-2026-06 traitant des risques de règlement de change et des protocoles de paiement contre paiement (PvP) dans les ponts multi-MNBC.",
            "canonical": "https://dcmcore.com/fr/policy-library/pl-06.html",
            "series_label": "Bibliothèque de Politique DCM Core | PL-2026-06",
            "h1": "Risque de règlement de change et mécanismes PvP dans les ponts multi-MNBC",
            "author_info": "Unité des Infrastructures de Marché DCM Core",
            "date_info": "Publication : Mars 2026 | Format : Standard 6 pages",
            "sec1_title": "Résumé Exécutif",
            "sec1_text1": "Le risque de règlement des opérations de change (FX), historiquement connu sous le nom de risque Herstatt, reste une vulnérabilité majeure des marchés financiers. Cette note analyse la conception technique des mécanismes de règlement Paiement contre Paiement (PvP) au sein des plateformes de monnaies numériques de banque centrale (MNBC) multi-pays, explorant comment la blockchain synchronise les règlements transfrontaliers.",
            "sec1_text2": "Nous évaluons les projets pilotes de MNBC multi-pays, tels que le Projet mBridge, et modélisons leur impact sur le risque de crédit, les délais de traitement et les besoins en liquidités. Nous concluons que les mécanismes PvP basés sur la DLT éliminent le risque de règlement mais augmentent les besoins de trésorerie intrajournaliers.",
            "sec2_title": "Énoncé du Problème",
            "sec2_text1": "Dans les transactions de change traditionnelles, le règlement des deux devises s'effectue dans des fuseaux horaires différents et sur des systèmes de paiement distincts. Ce décalage expose les contreparties à un risque : l'une peut régler la devise désignée mais ne pas recevoir la contre-devise si l'autre fait faillite entre-temps.",
            "sec2_callout": "Les mécanismes PvP basés sur la DLT résolvent le risque de change en exécutant le paiement comme une transaction atomique unique qui réussit ou échoue globalement.",
            "sec2_text2": "Bien que des institutions comme CLS proposent des services PvP pour les principales devises, beaucoup de monnaies émergentes ne sont pas couvertes. Étendre le PvP à ces devises exige le développement de modèles d'infrastructures décentralisés alternatifs.",
            "sec3_title": "Contexte Politique",
            "sec3_text1": "La feuille de route du G20 pour améliorer les paiements transfrontaliers désigne l'extension du règlement PvP comme une action prioritaire. Le Comité sur les paiements et les infrastructures de marché (CPMI) encourage l'utilisation de technologies nouvelles, comme les MNBCg, pour faciliter l'accès au PvP.",
            "sec3_text2": "Les banques centrales collaborent sur des plateformes multi-MNBC (Projet mBridge) permettant aux banques d'effectuer des paiements transfrontaliers directs sur un réseau unique. Définir la gouvernance et le cadre juridique de ces ponts est un défi réglementaire majeur.",
            "sec4_title": "Analyse & Impact Opérationnel",
            "sec4_text1": "L'impact opérationnel du règlement PvP basé sur la DLT repose sur la synchronisation des registres. En utilisant des contrats intelligents et des contrats HTLC (Hashed Timelock Contracts), le pont multi-MNBC garantit que le transfert de la Devise A est verrouillé tant que le transfert de la Devise B n'est pas finalisé.",
            "sec4_text2": "Cependant, notre modélisation de la liquidité montre un arbitrage important. Les règlements s'effectuant en temps réel et individuellement, les banques ne bénéficient plus de la compensation (netting) de fin de journée proposée par les chambres traditionnelles, augmentant leurs besoins de trésorerie.",
            "sec4_text3": "De plus, les banques participantes doivent gérer leur monnaie centrale dans plusieurs juridictions, ce qui exige des systèmes de trésorerie en temps réel et des connexions interopérables entre la plateforme multi-MNBC et les différents systèmes RTGS nationaux.",
            "sec5_title": "Recommandations Politiques",
            "sec5_text": "Pour optimiser la mise en œuvre des mécanismes PvP dans les environnements multi-MNBC et équilibrer les besoins de trésorerie, nous recommandons les mesures suivantes :",
            "sec5_rec_header": "Recommandations d'intégration du PvP :",
            "sec5_rec1": "Intégrer des mécanismes d'économie de liquidité (LSM), tels que la compensation bilatérale et multilatérale des files d'attente, directement dans les contrats intelligents du pont.",
            "sec5_rec2": "Établir des cadres juridiques standardisés reconnaissant le caractère définitif du règlement on-chain dans toutes les juridictions participantes.",
            "sec5_rec3": "Connecter les ponts multi-MNBC aux systèmes RTGS nationaux via des canaux API sécurisés pour faciliter le recyclage et le rééquilibrage immédiats des liquidités.",
            "sec6_title": "Références & Citations",
            "sec6_ref1": "CPMI (2022). Facilitating increased adoption of payment-versus-payment (PvP): proposals for encouraging PvP settlement.",
            "sec6_ref2": "BIS Innovation Hub (2024). Project mBridge: Building a multi-CBDC platform for real-time cross-border payments.",
            "sec6_ref3": "DCM Core Market Infrastructure Study (2025). Intraday Liquidity Demands and Atomic Swaps in Decentralized FX Settlement Protocols."
        }
    }
}

def update_file(file_path, key, lang):
    if not os.path.exists(file_path):
        print(f"Warning: File {file_path} does not exist.")
        return False
        
    print(f"Updating file {file_path} (Key: {key}, Lang: {lang})")
    with open(file_path, 'r', encoding='utf-8') as f:
        html = f.read()
        
    # Get replacement values
    val = data[key][lang]
    
    # 1. Replace title tag
    html = re.sub(r'<title>.*?</title>', f'<title>{val["title"]}</title>', html, flags=re.IGNORECASE)
    
    # 2. Replace meta description
    html = re.sub(r'(<meta\s+[^>]*name=["\']description["\'][^>]*content=["\'])(.*?)(["\'])', r'\1' + val["desc"] + r'\3', html, flags=re.IGNORECASE)
    html = re.sub(r'(<meta\s+[^>]*content=["\'])(.*?)(["\']\s+[^>]*name=["\']description["\'])', r'\1' + val["desc"] + r'\3', html, flags=re.IGNORECASE)
    
    # 3. Replace canonical link
    html = re.sub(r'(<link\s+[^>]*rel=["\']canonical["\'][^>]*href=["\'])(.*?)(["\'])', r'\1' + val["canonical"] + r'\3', html, flags=re.IGNORECASE)
    
    # 4. Format the article body template
    article_html = ARTICLE_TEMPLATE.format(
        series_label=val["series_label"],
        h1=val["h1"],
        author_info=val["author_info"],
        date_info=val["date_info"],
        sec1_title=val["sec1_title"],
        sec1_text1=val["sec1_text1"],
        sec1_text2=val["sec1_text2"],
        sec2_title=val["sec2_title"],
        sec2_text1=val["sec2_text1"],
        sec2_callout=val["sec2_callout"],
        sec2_text2=val["sec2_text2"],
        sec3_title=val["sec3_title"],
        sec3_text1=val["sec3_text1"],
        sec3_text2=val["sec3_text2"],
        sec4_title=val["sec4_title"],
        sec4_text1=val["sec4_text1"],
        sec4_text2=val["sec4_text2"],
        sec4_text3=val["sec4_text3"],
        sec5_title=val["sec5_title"],
        sec5_text=val["sec5_text"],
        sec5_rec_header=val["sec5_rec_header"],
        sec5_rec1=val["sec5_rec1"],
        sec5_rec2=val["sec5_rec2"],
        sec5_rec3=val["sec5_rec3"],
        sec6_title=val["sec6_title"],
        sec6_ref1=val["sec6_ref1"],
        sec6_ref2=val["sec6_ref2"],
        sec6_ref3=val["sec6_ref3"]
    )
    
    # 5. Replace entire paper-container article block
    pattern = r'<article class="paper-container">.*?</article>'
    html, count = re.subn(pattern, article_html, html, flags=re.DOTALL | re.IGNORECASE)
    if count == 0:
        print(f"Warning: Could not replace paper-container in {file_path}")
        return False
        
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(html)
        
    print(f"Successfully updated {file_path}")
    return True

# Run for all policy briefs
briefs = ["pb-2026-01", "pb-2026-02", "pb-2026-03", "pb-2026-04"]
for b in briefs:
    update_file(f"en/policy-briefs/{b}.html", b, "en")
    update_file(f"fr/policy-briefs/{b}.html", b, "fr")

# Run for all policy libraries
libraries = {
    "pl-01": "pl-01",
    "pl-02": "pl-02",
    "pl-03": "pl-03",
    "pl-04": "pl-04",
    "pl-05": "pl-05",
    "pl-06": "pl-06"
}
for l_key, l_file in libraries.items():
    update_file(f"en/policy-library/{l_file}.html", l_key, "en")
    update_file(f"fr/policy-library/{l_file}.html", l_key, "fr")

# Link cards in en/policy-briefs/index.html and fr/policy-briefs/index.html
def fix_index_links(file_path, mappings):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for title_substring, target_url in mappings.items():
        pattern = r'(<div class="brief-card">.*?<h3>.*?' + re.escape(title_substring) + r'.*?href=")(#)(" class="btn-view">)'
        content, count = re.subn(pattern, r'\1' + target_url + r'\3', content, flags=re.DOTALL | re.IGNORECASE)
        print(f"Index link fix for {title_substring} in {file_path}: updated {count} links")
        
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

fix_index_links("en/policy-briefs/index.html", {
    "Implementing DORA": "pb-2026-04.html",
    "Offline CBDC Portability": "pb-2026-03.html",
    "Synthetic Stablecoins": "pb-2026-02.html",
    "MiCA Phase 2": "pb-2026-01.html"
})

fix_index_links("fr/policy-briefs/index.html", {
    "Mise en œuvre de DORA": "pb-2026-04.html",
    "Portabilité des MNBC": "pb-2026-03.html",
    "Stablecoins synthétiques": "pb-2026-02.html",
    "MiCA Phase 2": "pb-2026-01.html"
})

print("Policy briefs and libraries content unique-ification completed successfully!")
