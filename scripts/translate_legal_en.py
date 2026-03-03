import os
import re

EN_DIR = '/Users/joanl/blockchain-presentation/en'

LEGAL_REPLACEMENTS = [
    # General / Mentions Légales
    (r'Éditeur du Site', 'Site Publisher'),
    (r'Responsable :', 'Manager:'),
    (r'Statut :', 'Status:'),
    (r'Entrepreneur individuel', 'Individual Entrepreneur'),
    (r'Siège :', 'Headquarters:'),
    (r'Directeur de la publication :', 'Publishing Director:'),
    (r'Ce site est hébergé par :', 'This site is hosted by:'),
    (r'Hébergement', 'Hosting'),
    (r'Propriété Intellectuelle', 'Intellectual Property'),
    (r'L\'ensemble du contenu de ce site \(structure, textes, logos, images, éléments graphiques, code source\).*?strictement interdite sans l\'accord exprès par écrit de l\'éditeur\.', "The entire content of this site (structure, texts, logos, images, graphic elements, source code) is the exclusive property of the publisher or its partners, unless otherwise stated. Any reproduction, distribution, modification, adaptation, retransmission or publication, even partial, of these various elements is strictly prohibited without the express written consent of the publisher."),
    (r'Limitation de Responsabilité', 'Limitation of Liability'),
    (r'Nature du contenu :', 'Nature of content:'),
    (r'Le contenu de ce site est fourni à titre strictement informatif et analytique\. Il vise à présenter des concepts technologiques \(Blockchain, Distributed Ledger Technology\) et leur application potentielle dans le secteur financier\.', "The content of this site is provided strictly for informational and analytical purposes. It aims to present technological concepts (Blockchain, Distributed Ledger Technology) and their potential application in the financial sector."),
    (r'Absence de conseil financier :', 'No financial advice:'),
    (r'Les informations présentes sur ce site ne constituent en aucun cas un conseil en investissement, une incitation à l\'achat ou à la vente d\'actifs numériques, ou une offre de services financiers réglementés\. L\'utilisateur est seul responsable de l\'usage qu\'il fait des informations fournies\.', "The information presented on this site does not in any way constitute investment advice, an incentive to buy or sell digital assets, or an offer of regulated financial services. The user is solely responsible for the use they make of the information provided."),
    (r'Positionnement réglementaire :', 'Regulatory positioning:'),
    (r'DCM Digital se positionne comme un <em>enabler de conformité</em> et non comme un interpréteur officiel de la régulation\. Les références à DORA, MiCA, Bâle III et SR 11-7 sont utilisées comme cadre de modélisation et nécessitent une validation indépendante par vos équipes juridiques\.', "DCM Digital positions itself as a <em>compliance enabler</em> and not as an official interpreter of regulation. References to DORA, MiCA, Basel III and SR 11-7 are used as a modeling framework and require independent validation by your legal teams."),
    (r'Données Personnelles', 'Personal Data'),
    (r'Ce site utilise des cookies analytiques \(Google Analytics 4\) soumis au consentement préalable de l\'utilisateur, conformément au RGPD et aux recommandations de la CNIL\. Aucune donnée n\'est collectée avant acceptation explicite via la bannière de consentement\.', "This site uses analytical cookies (Google Analytics 4) subject to the user's prior consent, in accordance with the GDPR. No data is collected before explicit acceptance via the consent banner."),
    (r'Pour plus de détails, consultez notre', 'For more details, consult our'),
    (r'et notre', 'and our'),
    (r'Politique de Gestion des Cookies', 'Cookie Management Policy'),
    (r'Pour exercer vos droits \(accès, rectification, suppression, portabilité\), contactez :', 'To exercise your rights (access, rectification, deletion, portability), contact:'),
    (r'Droit Applicable', 'Applicable Law'),
    (r'Les présentes Legal Mentions sont soumises au droit français\. Tout litige sera de la compétence exclusive des tribunaux de Paris\.', "These Legal Mentions are subject to French law. Any dispute will be under the exclusive jurisdiction of the courts of Paris."),
    (r'Dernière mise à jour : 25 février 2026', 'Last updated: February 25, 2026'),

    # Privacy Policy
    (r'La présente Privacy Policy décrit la manière dont', 'This Privacy Policy describes how'),
    (r'collecte, utilise et protège vos données personnelles lorsque vous utilisez le site', 'collects, uses, and protects your personal data when you use the site'),
    (r'\(le "Site"\), conformément au Règlement Général sur la Protection des Données \(RGPD — Règlement UE 2016/679\)\.', '(the "Site"), in accordance with the General Data Protection Regulation (GDPR - EU Regulation 2016/679).'),
    (r'Responsable du Traitement', 'Data Controller'),
    (r'Données Collectées', 'Data Collected'),
    (r'Nous collectons les catégories de données suivantes, <strong>uniquement après votre consentement explicite</strong> via la bannière de cookies :', 'We collect the following categories of data, <strong>only after your explicit consent</strong> via the cookie banner:'),
    (r'<strong>Données de navigation analytiques \(GA4\) :</strong> Pages visitées, durée de session, type de navigateur, résolution d\'écran, pays d\'origine \(IP anonymisée\)\.', '<strong>Analytical browsing data (GA4):</strong> Visited pages, session duration, browser type, screen resolution, country of origin (anonymized IP).'),
    (r'<strong>Données comportementales \(Hotjar\) :</strong> Heatmaps de clics, profondeur de scroll, enregistrements de session anonymisés \(si activé\)\.', '<strong>Behavioral data (Hotjar):</strong> Click heatmaps, scroll depth, anonymized session recordings (if enabled).'),
    (r'<strong>Données non soumises au consentement :</strong>', '<strong>Data not subject to consent:</strong>'),
    (r'<strong>Stockage local \(LocalStorage\) :</strong> Préférences d\'affichage \(thème, langue, rôle utilisateur\)\. Ces données restent sur votre appareil et ne sont jamais transmises à nos serveurs\.', '<strong>Local storage (LocalStorage):</strong> Display preferences (theme, language, user role). This data remains on your device and is never transmitted to our servers.'),
    (r'<strong>Logs d\'hébergement \(GitHub Pages\) :</strong> Données techniques inhérentes à l\'infrastructure d\'hébergement\.', '<strong>Hosting logs (GitHub Pages):</strong> Technical data inherent to the hosting infrastructure.'),
    (r'Finalités et Base Légale', 'Purposes and Legal Basis'),
    (r'Finalité', 'Purpose'),
    (r'Base légale \(Art\. 6 RGPD\)', 'Legal basis (Art. 6 GDPR)'),
    (r'Mesure d\'audience \(GA4\)', 'Audience measurement (GA4)'),
    (r'Art\. 6\.1\.a — Consentement', 'Art. 6.1.a - Consent'),
    (r'Analyse UX \(Hotjar\)', 'UX Analysis (Hotjar)'),
    (r'Fonctionnement technique \(LocalStorage\)', 'Technical operation (LocalStorage)'),
    (r'Art\. 6\.1\.f — Intérêt légitime', 'Art. 6.1.f - Legitimate interest'),
    (r'Destinataires des Données', 'Data Recipients'),
    (r'Les données analytiques sont traitées par les sous-traitants suivants :', 'Analytical data is processed by the following subcontractors:'),
    (r'Siège :', 'Headquarters:'),
    (r'hébergement', 'hosting'),
    (r'Transferts Hors UE', 'Transfers Outside the EU'),
    (r'Les données transmises à Google LLC et GitHub Inc\. font l\'objet de transferts vers les États-Unis, encadrés par les <strong>Clauses Contractuelles Types</strong> \(CCT\) de la Commission Européenne et le cadre <strong>EU-US Data Privacy Framework</strong>\.', 'The data transmitted to Google LLC and GitHub Inc. is transferred to the United States, governed by the <strong>Standard Contractual Clauses</strong> (SCC) of the European Commission and the <strong>EU-US Data Privacy Framework</strong>.'),
    (r'Durée de Conservation', 'Retention Period'),
    (r'conformément aux recommandations CNIL', 'in accordance with GDPR guidelines'),
    (r'13 mois maximum', '13 months maximum'),
    (r'365 jours maximum', '365 days maximum'),
    (r'Persistant jusqu\'à suppression manuelle par l\'utilisateur', 'Persistent until manual deletion by the user'),
    (r'Vos Droits \(RGPD\)', 'Your Rights (GDPR)'),
    (r'Conformément aux articles 15 à 22 du RGPD, vous disposez des droits suivants :', 'In accordance with Articles 15 to 22 of the GDPR, you have the following rights:'),
    (r'<strong>Droit d\'accès</strong> \(Art\. 15\) — Obtenir confirmation et copie de vos données\.', '<strong>Right of access</strong> (Art. 15) - Obtain confirmation and a copy of your data.'),
    (r'<strong>Droit de rectification</strong> \(Art\. 16\) — Corriger des données inexactes\.', '<strong>Right to rectification</strong> (Art. 16) - Correct inaccurate data.'),
    (r'<strong>Droit à l\'effacement</strong> \(Art\. 17\) — Demander la suppression de vos données\.', '<strong>Right to erasure</strong> (Art. 17) - Request the deletion of your data.'),
    (r'<strong>Droit à la limitation</strong> \(Art\. 18\) — Restreindre le traitement\.', '<strong>Right to restriction</strong> (Art. 18) - Restrict processing.'),
    (r'<strong>Droit à la portabilité</strong> \(Art\. 20\) — Recevoir vos données dans un format structuré\.', '<strong>Right to data portability</strong> (Art. 20) - Receive your data in a structured format.'),
    (r'<strong>Droit d\'opposition</strong> \(Art\. 21\) — Vous opposer au traitement à tout moment\.', '<strong>Right to object</strong> (Art. 21) - Object to processing at any time.'),
    (r'<strong>Retrait du consentement</strong> — Vous pouvez retirer votre consentement aux cookies analytiques à tout moment via le lien "Gérer les cookies" en bas de page\.', '<strong>Withdrawal of consent</strong> - You can withdraw your consent to analytical cookies at any time via the "Manage cookies" link at the bottom of the page.'),
    (r'Réclamation', 'Complaint'),
    (r'Si vous estimez que le traitement de vos données constitue une violation du RGPD, vous avez le droit d\'introduire une réclamation auprès de la <strong>Commission Nationale de l\'Informatique et des Libertés \(CNIL\)</strong> :', 'If you believe that the processing of your data constitutes a violation of the GDPR, you have the right to lodge a complaint with the <strong>Supervisory Authority</strong>:'),

    # CGU
    (r'Conditions Générales d\'Utilisation \(CGU\)', 'Terms of Use (TOU)'),
    (r'Conditions Générales d\'Utilisation', 'Terms of Use'),
    (r'Objet', 'Purpose'),
    (r'Avertissement "Educational Only" :', 'Warning "Educational Only":'),
    (r'Cette plateforme est un démonstrateur technologique et analytique\. Aucune transaction réelle n\'est effectuée\.', 'This platform is a technological and analytical demonstrator. No real transaction is carried out.'),
    (r'Les présentes Conditions Générales d\'Utilisation ont pour objet l\'encadrement juridique des modalités de mise à disposition du site DCM Digital et de ses services associés \(Dashboard de flux, simulateurs, etc\.\) et de définir les conditions d\'accès et d\'utilisation des services par "l\'Utilisateur"\.', 'The purpose of these Terms of Use is to establish the legal framework governing the provision of the DCM Digital site and its associated services (Flow Dashboard, simulators, etc.) and to define the conditions of access and use of the services by the "User".'),
    (r'Toute inscription ou utilisation du site implique l\'acceptation sans aucune réserve ni restriction des présentes CGU par l\'utilisateur\. Lors de l\'accès à l\'interface de connexion Wallet \(DApp simulation\), l\'acceptation de ces conditions vous sera implicitement rappelée\.', 'Any registration or use of the site implies full and unconditional acceptance of these Terms of Use by the user. When accessing the Wallet connection interface (DApp simulation), the acceptance of these conditions will be implicitly reminded to you.'),
    (r'Accès au Site & Modèle SaaS B2B', 'Access to the Site & B2B SaaS Model'),
    (r'Le Hub DCM Digital est accessible gratuitement en tout lieu à tout Utilisateur ayant un accès à Internet\. Tous les frais supportés par l\'Utilisateur pour accéder au service \(matériel informatique, logiciels, connexion Internet, etc\.\) sont à sa charge\.', 'The DCM Digital Hub is accessible free of charge anywhere to any User with Internet access. All costs incurred by the User to access the service (hardware, software, Internet connection, etc.) are at their expense.'),
    (r'Le site propose certaines fonctionnalités \(modules Quiz ou Dashboard RWA\) modélisant des logiques d\'abonnement ou de restrictions d\'accès de type SaaS \(Software as a Service\) <i>On-chain</i>\. Ces modules sont déployés en environnement de test "Sandbox" \(ex: Sepolia Testnet\) strict et ne requièrent le paiement d\'aucun fonds fiduciaires ou dépositaires réels\.', 'The site offers certain features (Quiz modules or RWA Dashboard) modeling subscription logics or access restrictions of the SaaS (Software as a Service) <i>On-chain</i> type. These modules are deployed in a strict "Sandbox" test environment (e.g., Sepolia Testnet) and do not require the payment of any real fiat or depository funds.'),
    (r'Absence de Conseil Financier \(Disclaimer\)', 'No Financial Advice (Disclaimer)'),
    (r'L\'éditeur du Hub, DCM Digital, n\'est pas qualifié en tant que prestataire de service d\'investissement \(PSI\) ni de Prestataire de Services sur Actifs Numériques \(PSAN\) agréé par l\'AMF ou toute autre autorité de régulation \(MiCA\)\.', 'The Hub publisher, DCM Digital, is not qualified as an investment service provider (ISP) or a Digital Asset Service Provider (DASP) registered by the AMF or any other regulatory authority (MiCA).'),
    (r'Tous les chiffres de "TVL", rendements "Yield", frais monétaires et classements affichés découlent d\'interfaces analytiques \(API publiques\) ou de simulations \(modélisation de taux\) à des fins de Business Intelligence\.', 'All figures for "TVL", "Yield" returns, monetary fees and rankings displayed derive from analytical interfaces (public APIs) or simulations (rate modeling) for Business Intelligence purposes.'),
    (r'L\'utilisateur reconnaît que les cryptomonnaies et les actifs tokenisés \(Security Tokens\) sont des instruments à fort risque de volatilité et de perte en capital\. Aucune donnée d\'architecture ou de flux transactionnel affichée ne doit être interprétée comme une recommandation financière, légale ou en droit social\.', 'The user acknowledges that cryptocurrencies and tokenized assets (Security Tokens) are high-risk instruments with volatility and capital loss. No architectural or transactional flow data displayed should be interpreted as financial, legal or social law recommendation.'),
    (r'Intelligence Artificielle et Données \(SIA\)', 'Artificial Intelligence and Data (AI)'),
    (r'Certains segments du Hub \(moteur de recherche hybride, synthèse de Whitepapers, simulations OCR de KYC/AML\) reposent sur ou communiquent avec des algorithmes d\'Intelligence Artificielle de type LLM \(Large Language Model\), comme explicitement l\'API OpenAI\.', 'Certain segments of the Hub (hybrid search engine, Whitepaper synthesis, KYC/AML OCR simulations) rely on or communicate with LLM (Large Language Model) Artificial Intelligence algorithms, such as explicitly the OpenAI API.'),
    (r'L\'Utilisateur consent à ce que les requêtes saisies dans la barre de recherche \(Natural Language Search\) soient potentiellement transmises aux fournisseurs de ces LLM pour traitement\. Il est par conséquent strictement interdit de saisir des Personal Data \(PII\), informations financières confidentielles, ou de Intellectual Property privative dans ces champs\.', 'The User consents that queries entered in the search bar (Natural Language Search) may potentially be transmitted to the providers of these LLMs for processing. It is therefore strictly forbidden to enter Personal Data (PII), confidential financial information, or proprietary Intellectual Property in these fields.'),
    (r'Conservation et Gestion des Données \(Web3\)', 'Data Storage and Management (Web3)'),
    (r'Contrairement à des architectures Web2 classiques, DCM Digital repose sur la méthodologie Web3 limitant la conservation de bases de données privées centralisées :', 'Unlike classic Web2 architectures, DCM Digital is based on Web3 methodology limiting the retention of centralized private databases:'),
    (r'<strong>Stateless :</strong> De nombreux paramètres graphiques ou états de l\'interfaces sont stockés uniquement au niveau de votre machine \(<code>LocalStorage</code>, <code>SessionStorage</code>\) et non sur nos serveurs\.', '<strong>Stateless:</strong> Many geographic parameters or interface states are stored only on your machine (<code>LocalStorage</code>, <code>SessionStorage</code>) and not on our servers.'),
    (r'<strong>Public Ledger :</strong> Toute interaction "On-Chain" déclenchée par l\'utilisateur impliquant une signature cryptographique avec son Wallet entraîne la publication immuable et irréversible de cette transaction sur la blockchain publique \(ou de test\) sous-jacente\.', '<strong>Public Ledger:</strong> Any "On-Chain" interaction triggered by the user involving a cryptographic signature with their Wallet results in the immutable and irreversible publication of this transaction on the underlying public (or test) blockchain.'),
    (r'Responsabilité Juridique', 'Legal Responsibility'),
    (r'L\'éditeur ne peut être tenu responsable de l\'altération du service \(bugs, indisponibilité API tierces comme Etherscan ou DefiLlama, forks de protocoles, pannes des blockchains simulées\)\. Le site s\'engage à mettre en œuvre tous les moyens nécessaires pour garantir la fiabilité des informations, mais ne fournit aucune garantie de résultat ou de précision absolue au millième près\.', 'The publisher cannot be held responsible for the alteration of the service (bugs, unavailability of third-party APIs such as Etherscan or DefiLlama, protocol forks, failures of simulated blockchains). The site undertakes to implement all necessary means to guarantee the reliability of the information, but provides no guarantee of result or absolute precision to the nearest thousandth.'),

    # Cookies
    (r'Politique des Cookies', 'Cookie Policy'),
    (r'Qu\'est-ce qu\'un cookie \?', 'What is a cookie?'),
    (r'Un "cookie" est un petit fichier texte déposé sur votre terminal \(ordinateur, smartphone, tablette\) par un site web\. Il permet de retenir temporairement des informations de navigation, de session ou de préférences\.', 'A "cookie" is a small text file deposited on your terminal (computer, smartphone, tablet) by a website. It briefly retains navigation, session or preference information.'),
    (r'Notre Politique de Consentement', 'Our Consent Policy'),
    (r'Conformément au RGPD \(Art\. 7\) et aux recommandations de la CNIL, DCM Digital applique le principe de <strong>consentement préalable</strong> pour tous les cookies non essentiels\. À votre première visite, une bannière vous propose d\'accepter ou de refuser les cookies analytiques\.', 'In accordance with the GDPR (Art. 7) and GDPR guidelines, DCM Digital applies the principle of <strong>prior consent</strong> for all non-essential cookies. On your first visit, a banner offers you to accept or refuse analytical cookies.'),
    (r'<strong>Aucun cookie analytique n\'est déposé avant votre consentement explicite\.</strong>', '<strong>No analytical cookie is deposited before your explicit consent.</strong>'),
    (r'Typologie des Cookies et Mécanismes de Stockage', 'Types of Cookies and Storage Mechanisms'),
    (r'Cookies Essentiels \(sans consentement\)', 'Essential Cookies (no consent required)'),
    (r'Nécessaires au fonctionnement du site\. Pas de consentement requis \(Art\. 82 de la Loi Informatique et Libertés\)\.', 'Necessary for the operation of the site. No consent required.'),
    (r'Nom technique', 'Technical Name'),
    (r'Type', 'Type'),
    (r'Durée', 'Duration'),
    (r'Mémorisation de votre choix de consentement cookies\.', 'Storage of your cookie consent choice.'),
    (r'Sauvegarde du profil utilisateur sélectionné \(Student/Pro/Enterprise\)\.', 'Saving the selected user profile (Student/Pro/Enterprise).'),
    (r'Maintien de la langue d\'interface sélectionnée\.', 'Maintaining the selected interface language.'),
    (r'Routage d\'Hosting interne à GitHub Pages \(infrastructure\)\.', 'Internal Hosting routing to GitHub Pages (infrastructure).'),
    (r'Session', 'Session'),
    (r'Cookies Analytiques \(consentement requis\)', 'Analytical Cookies (consent required)'),
    (r'Déposés uniquement après votre acceptation via la bannière de consentement\.', 'Deposited only after your acceptance via the consent banner.'),
    (r'Fournisseur', 'Provider'),
    (r'Identification anonyme du visiteur pour la mesure d\'audience\.', 'Anonymous identification of the visitor for audience measurement.'),
    (r'Persistance de l\'état de session GA4\.', 'Persistence of the GA4 session state.'),
    (r'Heatmaps, scroll depth, analyse comportementale UX\.', 'Heatmaps, scroll depth, behavioral UX analysis.'),
    (r'Gestion de vos Préférences', 'Managing Your Preferences'),
    (r'Vous pouvez modifier votre choix de consentement à tout moment :', 'You can change your consent choice at any time:'),
    (r'<strong>Via notre site :</strong> Cliquez sur le lien "<a href="javascript:void\(0\);" onclick="DCM_CookieConsent\.reset\(\);" style="color:#3b82f6; text-decoration:underline;">Gérer les cookies</a>" disponible en bas de chaque page\.', '<strong>Via our site:</strong> Click on the "<a href="javascript:void(0);" onclick="DCM_CookieConsent.reset();" style="color:#3b82f6; text-decoration:underline;">Manage cookies</a>" link available at the bottom of each page.'),
    (r'<strong>Via votre navigateur :</strong>', '<strong>Via your browser:</strong>'),
    (r'<code>Paramètres > Confidentialité et sécurité > Effacer les données de navigation</code>', '<code>Settings > Privacy and security > Clear browsing data</code>'),
    (r'<code>Préférences > Confidentialité > Gérer les données du site web</code>', '<code>Preferences > Privacy > Manage website data</code>'),
    (r'<code>Options > Vie privée et sécurité > Cookies et données de sites</code>', '<code>Options > Privacy and security > Cookies and site data</code>'),
    (r'En Savoir Plus', 'Learn More'),
    (r'Pour en savoir plus sur les cookies et vos droits :', 'To learn more about cookies and your rights:'),
    (r'CNIL — Cookies et traceurs', 'GDPR Guidelines on Cookies'),
]

def translate_file(filepath):
    if not os.path.exists(filepath): return False
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    modified = content
    for pattern, replacement in LEGAL_REPLACEMENTS:
        modified = re.sub(pattern, replacement, modified, flags=re.IGNORECASE|re.DOTALL)
        
    if modified != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(modified)
        print(f"Translated {os.path.basename(filepath)}")
        return True
    return False

def main():
    files_to_translate = ['mentions-legales.html', 'privacy.html', 'cgu.html', 'cookies.html', 'methodology.html']
    for file in files_to_translate:
        translate_file(os.path.join(EN_DIR, file))

if __name__ == "__main__":
    main()
