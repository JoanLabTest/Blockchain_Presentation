const QUIZ_DATA = {
    // NIVEAU 1 : FONDAMENTAUX (POOL DE 30 QUESTIONS)
    level1: [
        {
            q: "Quelle est la principale différence entre une blockchain et une base de données classique ?",
            options: ["La blockchain est plus rapide", "La blockchain est décentralisée et immuable", "La blockchain est gratuite", "La blockchain est privée"],
            a: 1,
            category: "Fondamentaux",
            info: "Contrairement à une base de données centralisée (admin), la blockchain est partagée et personne ne peut modifier le passé."
        },
        {
            q: "Qu'est-ce qu'un RWA (Real World Asset) ?",
            options: ["Un token purement crypto", "Un NFT artistique", "Un actif réel (Immo, Dette) représenté par un token", "Une stablecoin"],
            a: 2,
            category: "Tokenisation",
            info: "Les RWA sont des actifs tangibles ou financiers existants 'hors-chaîne' qui sont ramenés sur la blockchain."
        },
        {
            q: "Qu'est-ce qu'un Smart Contract ?",
            options: ["Un contrat papier scanné", "Un programme auto-exécutable sur la blockchain", "Une loi numérique", "Un accord verbal"],
            a: 1,
            category: "Fondamentaux",
            info: "C'est du code 'If This Then That' qui s'exécute automatiquement sans tiers de confiance dès que les conditions sont remplies."
        },
        {
            q: "Quelle est la différence entre Coin et Token ?",
            options: ["Aucune", "Le Coin a sa propre Blockchain, le Token est créé sur une chaîne existante", "Le Token est physique", "Le Coin est moins cher"],
            a: 1,
            category: "Fondamentaux",
            info: "Bitcoin est un Coin (sa propre chaîne). USDC est un Token (émis sur Ethereum)."
        },
        {
            q: "À quoi sert un Wallet (Portefeuille) ?",
            options: ["Stocker des billets", "Gérer ses clés privées et signer des transactions", "Stocker des PDF", "Payer sur Amazon"],
            a: 1,
            category: "Fondamentaux",
            info: "Le Wallet ne contient pas les cryptos (qui sont sur la blockchain) mais les clés pour y accéder et signer."
        },
        {
            q: "Que signifie 'DeFi' ?",
            options: ["Définition Financière", "Finance Décentralisée", "Dette Financière", "Département Fiscal"],
            a: 1,
            category: "Finance 2.0",
            info: "Un écosystème financier sans intermédiaires bancaires, fonctionnant grâce à des Smart Contracts."
        },
        {
            q: "Qu'est-ce qu'un Stablecoin ?",
            options: ["Une crypto très volatile", "Un token dont la valeur est indexée sur une devise (ex: 1€)", "Un Bitcoin", "Une action"],
            a: 1,
            category: "Finance 2.0",
            info: "Il sert de refuge contre la volatilité des cryptos, essentiel pour les paiements et le trading."
        },
        {
            q: "Qu'est-ce que le 'Gas' sur Ethereum ?",
            options: ["Du carburant fossile", "Les frais de transaction payés au réseau", "Une erreur système", "Un token de jeu"],
            a: 1,
            category: "Technique",
            info: "C'est le coût de calcul nécessaire pour valider une transaction sur le réseau."
        },
        {
            q: "Pourquoi dit-on que la Blockchain est 'Trustless' ?",
            options: ["On ne peut faire confiance à personne", "Le système fonctionne par mathématiques, sans besoin de confiance humaine", "C'est dangereux", "C'est anonyme"],
            a: 1,
            category: "Fondamentaux",
            info: "Le code remplace l'intermédiaire de confiance. 'Verify, don't trust'."
        },
        {
            q: "Qu'est-ce qu'un NFT ?",
            options: ["Non-Fungible Token (Unique)", "New French Technology", "Network File Transfer", "Un virus"],
            a: 0,
            category: "Tokenisation",
            info: "Un jeton unique représentant un objet spécifique (art, titre de propriété), non interchangeable (non-fongible)."
        },
        {
            q: "Qu'est-ce qu'une Blockchain Publique ?",
            options: ["Un réseau ouvert à tous (ex: Bitcoin)", "Un réseau réservé aux banques", "Un site web public", "Un wifi public"],
            a: 0,
            category: "Infrastructure",
            info: "Tout le monde peut lire et écrire (payer des frais) sur une chaîne publique. C'est 'Permissionless'."
        },
        {
            q: "Qu'est-ce qu'une Blockchain Privée/Consortium ?",
            options: ["Un réseau secret", "Un réseau à accès restreint et permissionné (ex: SWIAT)", "Le Dark Web", "Un VPN"],
            a: 1,
            category: "Infrastructure",
            info: "L'accès au réseau est contrôlé. Utilisé par les banques pour la confidentialité et la conformité."
        },
        {
            q: "Quelle est la différence fondamentale entre IA et Machine Learning ?",
            options: ["Aucune", "Le ML est un sous-ensemble de l'IA où la machine apprend par les données", "L'IA est pour les robots", "Le ML est plus vieux"],
            a: 1,
            category: "IA Basics",
            info: "L'IA est le concept global. Le Machine Learning est la méthode statistique pour apprendre sans être explicitement programmé."
        },
        {
            q: "Qu'est-ce qu'un LLM (ex: GPT-4) ?",
            options: ["Large Language Model", "Long Learning Machine", "Low Latency Mode", "Legal Liability Manager"],
            a: 0,
            category: "IA Basics",
            info: "Un modèle d'IA entraîné sur d'immenses quantités de texte pour comprendre et générer du langage."
        },
        {
            q: "Qu'est-ce que la Tokenisation ?",
            options: ["Créer des jetons de casino", "Représenter un droit (propriété, dette) numériquement sur blockchain", "Imprimer des billets", "Scanner des documents"],
            a: 1,
            category: "Tokenisation",
            info: "C'est le processus de conversion de droits d'actifs réels en jetons numériques transférables."
        },
        {
            q: "Qui valide les transactions sur Bitcoin (Proof of Work) ?",
            options: ["La Banque Centrale", "Les Mineurs", "Google", "Personne"],
            a: 1,
            category: "Technique",
            info: "Les mineurs utilisent de la puissance de calcul pour sécuriser le réseau et valider les blocs."
        },
        {
            q: "Qu'est-ce qu'un Security Token ?",
            options: ["Un jeton de sécurité informatique", "Un instrument financier (Action, Obligation) sous forme de token", "Un mot de passe", "Un jeu"],
            a: 1,
            category: "Régulation",
            info: "C'est un titre financier régulé. Il est soumis aux lois financières (Prospectus, KYC)."
        },
        {
            q: "Qu'est-ce que le 'Staking' (Proof of Stake) ?",
            options: ["Parier de l'argent", "Verrouiller des fonds pour sécuriser le réseau et recevoir des intérêts", "Acheter un steak", "Une attaque"],
            a: 1,
            category: "Technique",
            info: "Alternative au minage : les validateurs mettent en jeu leurs propres tokens pour garantir leur honnêteté."
        },
        {
            q: "L'IA Générative peut-elle créer du code informatique ?",
            options: ["Non, jamais", "Oui, elle peut générer et expliquer du code (ex: Smart Contracts)", "Seulement du Python", "C'est illégal"],
            a: 1,
            category: "IA Basics",
            info: "Oui, les LLM sont très performants pour écrire, débugger et expliquer du code."
        },
        {
            q: "Une transaction Blockchain est-elle réversible ?",
            options: ["Oui, par la banque", "Non, elle est immuable une fois confirmée", "Oui, si on demande gentiment", "Seulement le dimanche"],
            a: 1,
            category: "Fondamentaux",
            info: "L'immuabilité est la clé. Pas de 'Ctrl+Z' sur la Blockchain. Cela impose une rigueur absolue."
        },
        // QUESTIONS SUPPLÉMENTAIRES (NOUVELLES)
        {
            q: "Qu'est-ce qu'un 'Fork' ?",
            options: ["Une fourchette", "Une modification du protocole créant deux chaînes distinctes", "Un bug", "Un virus"],
            a: 1,
            category: "Technique",
            info: "Un fork se produit quand la communauté diverge sur les règles (ex: Bitcoin vs Bitcoin Cash)."
        },
        {
            q: "Que signifie 'Peer-to-Peer' (P2P) ?",
            options: ["Père à Père", "D'égal à égal, sans serveur central", "Paiement par carte", "Réseau privé"],
            a: 1,
            category: "Fondamentaux",
            info: "Le P2P permet aux ordinateurs de communiquer directement entre eux sans passer par un serveur central."
        },
        {
            q: "Qui a inventé Bitcoin ?",
            options: ["Elon Musk", "Satoshi Nakamoto", "Bill Gates", "Vitalik Buterin"],
            a: 1,
            category: "Histoire",
            info: "Satoshi Nakamoto est le pseudonyme du créateur (ou groupe) anonyme de Bitcoin (Whitepaper 2008)."
        },
        {
            q: "Quelle est la blockchain la plus utilisée pour la DeFi ?",
            options: ["Bitcoin", "Ethereum", "Dogecoin", "Ripple"],
            a: 1,
            category: "Finance 2.0",
            info: "Ethereum héberge la majorité des applications DeFi grâce à ses Smart Contracts Turing-complets."
        },
        {
            q: "Qu'est-ce que la 'Volatilité' ?",
            options: ["La stabilité", "L'ampleur des variations de prix d'un actif", "La vitesse de transaction", "Le coût du gas"],
            a: 1,
            category: "Marché",
            info: "Les cryptos sont connues pour leur forte volatilité, contrairement aux Stablecoins."
        },
        {
            q: "Un token ERC-20 est-il fongible ?",
            options: ["Non", "Oui, chaque token est identique aux autres (comme une pièce de 1€)", "Seulement le week-end", "Je ne sais pas"],
            a: 1,
            category: "Technique",
            info: "L'ERC-20 est le standard des tokens fongibles sur Ethereum."
        },
        {
            q: "Qu'est-ce que le KYC (Know Your Customer) ?",
            options: ["Un fast-food", "La procédure d'identification obligatoire des clients", "Une crypto", "Un wallet"],
            a: 1,
            category: "Régulation",
            info: "Obligatoire pour les banques et CASP pour lutter contre le blanchiment."
        },
        {
            q: "Qu'est-ce qu'une phrase mnémonique (Seed Phrase) ?",
            options: ["Une poésie", "Une suite de 12/24 mots pour restaurer un wallet", "Un mot de passe", "Une adresse"],
            a: 1,
            category: "Sécurité",
            info: "Si vous perdez votre Seed Phrase, vous perdez vos fonds à jamais. C'est la clé maîtresse."
        },
        {
            q: "La Blockchain est-elle anonyme ?",
            options: ["Oui totalement", "Elle est pseudonyme (adresses visibles, identités cachées)", "Non, tout est public", "Seulement Bitcoin"],
            a: 1,
            category: "Privacy",
            info: "On voit les adresses (0x...) mais pas forcément les noms. L'analyse on-chain permet souvent de désanonymiser."
        },
        {
            q: "Qu'est-ce qu'un 'Whitepaper' ?",
            options: ["Une feuille blanche", "Le document technique fondateur décrivant un projet crypto", "Un chèque", "Une loi"],
            a: 1,
            category: "Fondamentaux",
            info: "Le Whitepaper de Bitcoin (2008) est le document le plus célèbre de l'écosystème."
        }
    ],

    // NIVEAU 2 : INTERMÉDIAIRE (POOL DE 30 QUESTIONS)
    level2: [
        {
            q: "Quel est le rôle principal du DvP atomique (Delivery vs Payment) ?",
            options: ["Accélérer le trading", "Supprimer le KYC", "Garantir le transfert simultané et indissociable du titre et du cash", "Réduire la volatilité"],
            a: 2,
            category: "Flux & Opérations",
            info: "Cela élimine le risque de contrepartie (Herstatt Risk). Si l'un des deux échoue, tout est annulé."
        },
        {
            q: "Pourquoi un SPV (Special Purpose Vehicle) est-il souvent utilisé pour les RWA ?",
            options: ["Pour stocker les tokens", "Pour isoler juridiquement l'actif réel et assurer sa détention légale", "Pour réduire les frais de gas", "Pour faire du trading"],
            a: 1,
            category: "Structuration RWA",
            info: "Le token n'est pas l'immeuble. Le token est une part du SPV qui détient l'immeuble. Le SPV fait le pont juridique."
        },
        {
            q: "Quel est l'avantage du T+0 (Règlement Instantané) ?",
            options: ["Aucun", "Élimine le besoin de collatéral pour couvrir le risque de règlement (2 jours)", "C'est plus compliqué", "Moins de taxes"],
            a: 1,
            category: "Flux & Opérations",
            info: "En passant de T+2 à T+0, on libère des milliards de capital immobilisé en garantie."
        },
        {
            q: "Quel est le rôle d'un Oracle dans un Smart Contract financier ?",
            options: ["Prédire l'avenir", "Apporter des données off-chain (ex: Taux BCE, Prix Or) sur la blockchain", "Sécuriser le réseau", "Stocker les fichiers"],
            a: 1,
            category: "Infrastructure",
            info: "La blockchain est aveugle. L'Oracle est ses yeux sur le monde réel pour déclencher des actions (ex: Coupon)."
        },
        {
            q: "Dans un Repo 2.0 (Intraday), quelle est la durée du prêt ?",
            options: ["30 jours", "Quelques heures (Intrajournalier)", "1 an", "Indéfinie"],
            a: 1,
            category: "Flux & Opérations",
            info: "La blockchain permet de prêter du cash le matin et d'être remboursé le soir, optimisant la trésorerie minute par minute."
        },
        {
            q: "Qu'est-ce que le 'Minting' dans le cycle de vie d'une obligation ?",
            options: ["L'impression papier", "La création technique des tokens représentant la dette", "Le trading", "Le remboursement"],
            a: 1,
            category: "Lifecycle",
            info: "C'est l'émission primaire (Issuance). Les tokens sont 'frappés' et envoyés aux investisseurs."
        },
        {
            q: "Quel est le risque de 'Divergence' pour un RWA ?",
            options: ["Que le token vaille zéro", "Que l'état du token on-chain ne reflète plus l'état de l'actif off-chain", "Que la blockchain s'arrête", "Perte de clé"],
            a: 1,
            category: "Risques RWA",
            info: "C'est le risque majeur : le lien physique-numérique doit être audité en permanence."
        },
        {
            q: "Comment l'IA améliore-t-elle la détection de fraude en finance ?",
            options: ["Elle remplace la police", "Elle analyse des patterns complexes en temps réel sur des millions de transactions", "Elle bloque tout", "Elle ne sert à rien"],
            a: 1,
            category: "IA Finance",
            info: "L'IA détecte des anomalies subtiles invisibles pour des règles simples (ex: blanchiment complexe)."
        },
        {
            q: "Qu'est-ce qu'une 'Whitelisted Address' ?",
            options: ["Une adresse email", "Une adresse blockchain autorisée après un contrôle KYC/AML", "Une adresse publique", "Une adresse VIP"],
            a: 1,
            category: "Compliance",
            info: "Dans la finance régulée, seuls les participants identifiés (KYC) peuvent détenir ou échanger les tokens."
        },
        {
            q: "Qu'est-ce que le standard ERC-3643 (T-REX) ?",
            options: ["Un dinosaure", "Un standard de token qui intègre l'identité et la conformité directement dans le code", "Une crypto monnaie", "Un protocole de prêt"],
            a: 1,
            category: "Technique",
            info: "Il vérifie l'éligibilité de l'investisseur (ONCHAINID) à chaque transfert. Si le KYC est expiré, le transfert échoue."
        },
        {
            q: "Quel est le rôle du Custodian (Dépositaire) pour des actifs numériques ?",
            options: ["Aucun, c'est self-custody", "Sécuriser les clés privées (HSM) pour le compte des clients institutionnels", "Trader les actifs", "Prêter de l'argent"],
            a: 1,
            category: "Infrastructure",
            info: "Les institutionnels ne gardent pas leurs clés sur une clé USB. Ils utilisent des Custodians qualifiés."
        },
        {
            q: "Qu'est-ce que le 'Cash Leg' dans une transaction DvP ?",
            options: ["La jambe de bois", "La partie paiement (Cash) de l'échange, face à la partie titre (Security Leg)", "Les frais", "Le pourboire"],
            a: 1,
            category: "Flux & Opérations",
            info: "Le défi est d'avoir le Cash aussi rapide que le Titre. D'où le besoin de Stablecoins ou CBDC."
        },
        {
            q: "Pourquoi l'IA a-t-elle besoin d'explicabilité (XAI) en finance ?",
            options: ["Pour être polie", "Pour justifier les décisions (ex: refus de crédit) aux régulateurs et clients", "Pour aller plus vite", "Pour apprendre"],
            a: 1,
            category: "IA Risques",
            info: "La 'Black Box' est inacceptable en banque. On doit pouvoir expliquer pourquoi l'algo a pris cette décision."
        },
        {
            q: "Qu'est-ce qu'un Pool de Liquidité (AMM) ?",
            options: ["Une piscine", "Un contrat intelligent où les utilisateurs déposent des fonds pour permettre le trading sans carnet d'ordres", "Une banque centrale", "Un prêt"],
            a: 1,
            category: "DeFi Ops",
            info: "L'AMM (Automated Market Maker) permet de trader 24/7 contre un robot, tant qu'il y a de la liquidité."
        },
        {
            q: "Quelle est la différence entre une CBDC de Gros (Wholesale) et de Détail ?",
            options: ["La taille", "Gros pour les banques (Règlement Interbancaire), Détail pour le grand public (Cash numérique)", "Aucune", "La couleur"],
            a: 1,
            category: "Monnaie",
            info: "La CBDC Wholesale vise à sécuriser les gros règlements DvP sur blockchain."
        },
        {
            q: "Que se passe-t-il lors du 'Burn' d'un token ?",
            options: ["Il prend feu", "Il est envoyé à une adresse nulle et retiré de la circulation (Remboursement)", "Il est vendu", "Il est perdu"],
            a: 1,
            category: "Lifecycle",
            info: "À l'échéance d'une obligation, une fois remboursée, les tokens sont détruits pour nettoyer le registre."
        },
        {
            q: "Qu'est-ce que la Sur-collatéralisation en DeFi ?",
            options: ["Déposer plus de valeur en garantie que le montant emprunté", "Une assurance", "Une erreur bancaire", "Un taux d'intérêt"],
            a: 0,
            category: "Risque Crédit",
            info: "Pour compenser la volatilité, on demande souvent 150% de garantie pour un prêt en crypto."
        },
        {
            q: "Qu'est-ce qu'un ZKP (Zero Knowledge Proof) ?",
            options: ["Une preuve d'ignorance", "Une méthode pour prouver une information (ex: J'ai les fonds) sans révéler la donnée elle-même", "Un bug", "Une crypto"],
            a: 1,
            category: "Privacy",
            info: "Crucial pour les banques : prouver la solvabilité sans montrer le bilan complet aux concurrents."
        },
        {
            q: "Qu'est-ce que l'Interopérabilité Cross-Chain ?",
            options: ["Utiliser deux écrans", "La capacité de transférer des actifs et données entre deux blockchains différentes", "Le wifi", "Une fusion"],
            a: 1,
            category: "Infrastructure",
            info: "Le futur est multi-chaînes. Les actifs doivent pouvoir circuler sans friction (ex: CCIP)."
        },
        {
            q: "Quel est le risque de 'Hallucination' d'une IA ?",
            options: ["Elle voit des fantômes", "Elle invente des faits faux avec une grande confiance", "Elle s'endort", "Elle devient méchante"],
            a: 1,
            category: "IA Risques",
            info: "C'est un risque majeur pour l'analyse financière autonome. L'IA peut inventer des chiffres."
        },
        // QUESTIONS SUPPLÉMENTAIRES (NOUVELLES)
        {
            q: "Dans un Security Token, où est généralement géré le 'White-listing' ?",
            options: ["Dans le code du Smart Contract", "Sur Excel", "Par téléphone", "Sur un post-it"],
            a: 0,
            category: "Technique",
            info: "Le Smart Contract interroge une liste d'adresses approuvées avant d'autoriser tout transfert."
        },
        {
            q: "Qu'apporte la Blockchain à la gestion du collatéral (Collateral Management) ?",
            options: ["Plus de lenteur", "Mobilité instantanée 24/7 (HQLA) pour couvrir les appels de marge", "Rien", "Des frais plus élevés"],
            a: 1,
            category: "Opérations",
            info: "Le collatéral n'est plus piégé dans les silos des dépositaires le week-end."
        },
        {
            q: "Qu'est-ce qu'un 'Asset Servicing' automatisé ?",
            options: ["Un robot qui sert le café", "L'exécution automatique des événements sur titres (Coupons, AG) par Smart Contract", "Un service client", "Une maintenance IT"],
            a: 1,
            category: "Lifecycle",
            info: "Fini les fax et les fichiers Excel. Le code distribue les dividendes au prorata exact."
        },
        {
            q: "Un titre 'Native Digital' a-t-il une existence papier ?",
            options: ["Oui toujours", "Non, il est né et vit uniquement sur la Blockchain", "Parfois", "Seulement la copie"],
            a: 1,
            category: "Légal",
            info: "C'est la différence avec un titre dématérialisé classique. Ici, l'original EST le token."
        },
        {
            q: "Qu'est-ce que le 'Gaseless' transaction ?",
            options: ["Une transaction gratuite", "L'utilisateur ne paie pas le gas, un relai le paie pour lui (Meta-transaction)", "Une voiture électrique", "Une erreur"],
            a: 1,
            category: "UX",
            info: "Essentiel pour l'adoption bancaire : la banque paie les frais de réseau pour le client de manière transparente."
        },
        {
            q: "En DeFi, qu'est-ce que le 'Impermanent Loss' ?",
            options: ["Une perte définitive", "Une perte temporaire de valeur lors de l'apport de liquidité dans une pool volatile", "Un vol", "Une assurance"],
            a: 1,
            category: "Risque DeFi",
            info: "Risque spécifique aux AMM (Automated Market Makers) quand le prix des actifs diverge."
        },
        {
            q: "Quel est l'intérêt du 'Fractionnement' d'actifs immobiliers ?",
            options: ["Habiter dans 1m²", "Permettre à de petits investisseurs d'acheter des parts (ex: 100€) d'un immeuble de prestige", "Détruire l'immeuble", "Payer moins de loyer"],
            a: 1,
            category: "Tokenisation",
            info: "Démocratisation de l'accès à des classes d'actifs réservées aux fortunés."
        },
        {
            q: "Qu'est-ce qu'une 'Sidechain' ?",
            options: ["Une chaîne vélo", "Une blockchain parallèle connectée à la chaîne principale pour désengorger le trafic", "Un côté obscur", "Un menu"],
            a: 1,
            category: "Infrastructure",
            info: "Polygon (PoS) est souvent utilisée comme Sidechain d'Ethereum pour réduire les coûts."
        },
        {
            q: "L'IA peut-elle auditer un Smart Contract ?",
            options: ["Non", "Oui, elle peut scanner le code pour trouver des vulnérabilités connues bien plus vite qu'un humain", "C'est interdit", "Seulement le mardi"],
            a: 1,
            category: "Sécurité",
            info: "Les outils d'audit IA deviennent standards, mais la validation humaine reste nécessaire."
        },
        {
            q: "Pourquoi utiliser l'USDC plutôt que le Bitcoin pour le règlement ?",
            options: ["Le Bitcoin est trop lent et volatil", "Le Bitcoin est mieux", "L'USDC est joli", "Aucune raison"],
            a: 0,
            category: "Flux",
            info: "Le règlement nécessite une valeur stable (Stablecoin) pour éviter le risque de change pendant la transaction."
        }
    ],

    // NIVEAU 3 : EXPERT (POOL DE 30 QUESTIONS)
    level3: [
        {
            q: "Quel est le principal risque spécifique aux RWA tokenisés ?",
            options: ["La congestion réseau", "La divergence entre l'état on-chain (Token) et l'actif réel off-chain (Real World)", "La volatilité du gas", "Le manque de liquidité"],
            a: 1,
            category: "Risques Stratégiques",
            info: "Si l'or dans le coffre est volé, le token 'Gold' ne vaut plus rien, même si la blockchain est sécurisée."
        },
        {
            q: "Quelle loi allemande de 2021 a créé le cadre des Cryptos-Titres (eWpG) ?",
            options: ["MiCA", "eWpG (Elektronische Wertpapiergesetz)", "RGPD", "Bâle III"],
            a: 1,
            category: "Régulation",
            info: "Elle a supprimé l'obligation du certificat global papier (Urkunde) pour les obligations au porteur."
        },
        {
            q: "Qu'est-ce que le Régime Pilote DLT (Pilot Regime) de l'UE ?",
            options: ["Un cours de pilotage", "Un 'Bac à Sable' réglementaire permettant d'opérer des infrastructures de marché DLT avec des exemptions", "Une loi US", "Un test technique"],
            a: 1,
            category: "Régulation",
            info: "Il permet de tester la fusion du Trading (MTF) et du Règlement (CSD) en une entité unique (TSS)."
        },
        {
            q: "Qu'est-ce que la solution 'Trigger' de la Bundesbank ?",
            options: ["Un pistolet", "Une passerelle technique connectant la Blockchain à Target2 (RTGS) pour le cash", "Un stablecoin", "Un token"],
            a: 1,
            category: "Architecture",
            info: "Elle permet de régler en Monnaie Banque Centrale (CeBM) sans avoir à émettre de CBDC, en déclenchant un virement conventionnel."
        },
        {
            q: "Pourquoi l'Explainability (XAI) est-elle critique pour l'IA en finance régulée ?",
            options: ["Pour la performance", "Pour réduire les coûts", "Pour satisfaire les exigences réglementaires (Auditabilité) et éthiques", "Pour le marketing"],
            a: 2,
            category: "IA & Régulation",
            info: "Un modèle 'Black Box' ne peut pas être validé par le Risk Management d'une banque."
        },
        {
            q: "Qu'est-ce que la Finalité du Règlement (Settlement Finality) ?",
            options: ["La fin de la journée", "Le moment juridique où un transfert devient irrévocable et inconditionnel", "La signature du contrat", "Le paiement des frais"],
            a: 1,
            category: "Droit Financier",
            info: "Sur une blockchain publique probabiliste, la finalité est un défi juridique. Les chaînes privées l'assurent par contrat."
        },
        {
            q: "Dans un modèle 'Direct to Investor', quel intermédiaire est souvent désintermédié ?",
            options: ["L'émetteur", "Le Custodian Global / CSD Central", "L'investisseur", "La blockchain"],
            a: 1,
            category: "Architecture Marché",
            info: "Le registre distribué remplace la réconciliation centralisée du CSD."
        },
        {
            q: "Qu'est-ce qu'un CASP selon MiCA ?",
            options: ["Crypto-Asset Service Provider", "Central Authority Service Point", "Computer Anti-Spam Program", "Un fantôme"],
            a: 0,
            category: "Régulation",
            info: "C'est le statut régulé européen pour tout prestataire de services sur crypto-actifs (Custody, Exchange, Conseil)."
        },
        {
            q: "Quelle est la différence entre CeBM et CoBM ?",
            options: ["Aucune", "CeBM = Monnaie Banque Centrale (Sans Risque). CoBM = Monnaie Banque Commerciale (Risque de Crédit)", "Cash vs Crypto", "Coins vs Bills"],
            a: 1,
            category: "Risque Liquidité",
            info: "Pour les gros montants systémiques, les régulateurs exigent l'usage de CeBM (Monnaie Centrale)."
        },
        {
            q: "Qu'est-ce que SWIAT ?",
            options: ["Un code SWIFT", "Une blockchain bancaire privée de consortium (Deka, LBBW...)", "Une crypto", "Une loi"],
            a: 1,
            category: "Infrastructure",
            info: "C'est une infrastructure de marché institutionnelle concurrente de l'approche blockchain publique."
        },
        {
            q: "Qu'est-ce que le 'Repacking' ?",
            options: ["Refaire ses valises", "Isoler des actifs dans un SPV pour émettre des titres adossés à ces actifs", "Vendre des cartons", "Une fraude"],
            a: 1,
            category: "Structuration",
            info: "C'est la base de la titrisation. Le Token est une part de la dette structurée."
        },
        {
            q: "Quel est le risque de 'Smart Contract' ?",
            options: ["Qu'il soit trop intelligent", "Qu'il contienne un bug ou une faille exploitable par un hacker", "Qu'il soit effacé", "Qu'il coûte cher"],
            a: 1,
            category: "Risque Ops",
            info: "Le code est la loi. Si le code a un bug, l'argent peut être perdu à jamais. L'audit est vital."
        },
        {
            q: "Qu'est-ce que Canton Network ?",
            options: ["Une blockchain chinoise", "Un réseau d'interopérabilité pour institutionnels avec confidentialité totale (Privacy)", "Un canton suisse", "Un VPN"],
            a: 1,
            category: "Architecture",
            info: "Il permet de synchroniser des registres privés sans jamais révéler les données au réseau global."
        },
        {
            q: "Pourquoi les USA préfèrent-ils les Blockchains Privées ?",
            options: ["Ils n'aiment pas Ethereum", "Pour le contrôle strict et la confidentialité (Privacy Rules)", "Pour la vitesse", "Par habitude"],
            a: 1,
            category: "Stratégie",
            info: "Les lois US sur les valeurs mobilières et la vie privée rendent les chaînes publiques difficiles à utiliser institutionnellement."
        },
        {
            q: "Qu'est-ce que DORA ?",
            options: ["L'exploratrice", "Digital Operational Resilience Act", "Data Of Real Assets", "Direct Online Risk Analysis"],
            a: 1,
            category: "Régulation",
            info: "Règlement UE obligeant les banques à prouver leur résistance aux cyber-attaques et pannes informatiques (dont Blockchain)."
        },
        {
            q: "Qu'est-ce que la 'Permissioned DeFi' ?",
            options: ["DeFi illégale", "Des protocoles DeFi (Aave Arc) avec une couche de Whitelisting KYC/AML", "Un mode test", "Une crypto privée"],
            a: 1,
            category: "Stratégie",
            info: "Le mariage entre la technologie DeFi (Liquidité, Auto-ex) et la Compliance bancaire."
        },
        {
            q: "Quel est l'impact de l'IA sur le High Frequency Trading (HFT) ?",
            options: ["Aucun", "Elle permet des stratégies auto-adaptatives prédictives ultra-rapides", "Elle ralentit tout", "Elle est interdite"],
            a: 1,
            category: "IA Trading",
            info: "L'IA ne suit pas juste des règles, elle apprend de la microstructure du marché en temps réel."
        },
        {
            q: "Qu'est-ce qu'un HQLA (High Quality Liquid Asset) tokenisé ?",
            options: ["Un actif liquide sûr (Bon du Trésor) tokenisé pour circuler 24/7 comme collatéral", "De l'eau", "Un token sans valeur", "Un crédit"],
            a: 0,
            category: "Gestion de Collatéral",
            info: "Le Graal de la tréso : utiliser des bons du trésor comme du cash instantané, même la nuit."
        },
        {
            q: "Qu'est-ce que l'Intégrité du Marché (Market Integrity) ?",
            options: ["L'honnêteté", "L'assurance que le marché n'est pas manipulé (Wash trading, Spoofing)", "La propreté", "La politesse"],
            a: 1,
            category: "Régulation",
            info: "Sur les DEX (Decentralized Exchanges), garantir l'intégrité sans surveillance centralisée est un défi majeur."
        },
        {
            q: "Quelle est la vision cible de la 'Finternet' (BIS) ?",
            options: ["Un internet pour les poissons", "Un système financier unifié où tous les actifs sont des tokens sur des registres unifiés", "Un nouveau Google", "Une banque"],
            a: 1,
            category: "Vision Stratégique",
            info: "La BRI (BIS) imagine un 'Unified Ledger' où monnaie et actifs vivent ensemble pour permettre des échanges programmables universels."
        },
        // QUESTIONS SUPPLÉMENTAIRES (NOUVELLES)
        {
            q: "Qu'est-ce qu'un 'Wrapped Asset' (ex: wBTC) ?",
            options: ["Un cadeau", "Une représentation d'un actif (BTC) sur une autre blockchain (Ethereum) via un bridge", "Un papier cadeau", "Un bug"],
            a: 1,
            category: "Interopérabilité",
            info: "Attention au risque de Bridge : si le coffre qui détient le vrai BTC est hacké, le wBTC ne vaut rien."
        },
        {
            q: "Quel est le principe de la 'Tokenisation de Fonds' (ex: KKR sur Avalanche) ?",
            options: ["Donner au fonds", "Rendre les parts de Private Equity accessibles et échangeables numériquement", "Créer un nouveau fonds", "Fermer le fonds"],
            a: 1,
            category: "RWA",
            info: "Cela ouvre le Private Equity (illiquide) à une base d'investisseurs plus large et permet les marchés secondaires."
        },
        {
            q: "Qu'est-ce que la 'Preuve de Réserves' (Proof of Reserves) ?",
            options: ["Une facture", "La vérification cryptographique qu'un exchange ou émetteur détient bien les fonds qu'il prétend avoir", "Un audit papier", "Une promesse"],
            a: 1,
            category: "Transparence",
            info: "Devenu standard après la chute de FTX. La blockchain permet de prouver la solvabilité en temps réel."
        },
        {
            q: "Dans le cadre de Bâle III, comment sont traités les crypto-actifs sans couverture (Unbacked) ?",
            options: ["Comme du cash", "Avec une pondération de risque prohibitive (1250%)", "Sans risque", "Comme de l'or"],
            a: 1,
            category: "Régulation",
            info: "Bâle III décourage fortement les banques de détenir du Bitcoin en propre via des exigences en capital maximales."
        },
        {
            q: "Qu'est-ce qu'un 'Soulbound Token' (SBT) ?",
            options: ["Un token maudit", "Un token non-transférable lié à l'identité d'une personne (Diplôme, Réputation)", "Un jeu vidéo", "Un NFT d'art"],
            a: 1,
            category: "Identité",
            info: "Idéal pour le KYC ou les certifications : une fois reçu, vous ne pouvez pas le vendre."
        },
        {
            q: "Qu'est-ce que l'Account Abstraction (ERC-4337) ?",
            options: ["Un concept abstrait", "Une amélioration UX permettant de récupérer son compte sans seed phrase (Social Recovery)", "Une erreur", "Un calcul"],
            a: 1,
            category: "UX / Adoption",
            info: "C'est la clé pour l'adoption de masse : rendre le wallet aussi simple qu'un compte bancaire."
        },
        {
            q: "Quel est le risque de 'Front Running' (MEV) ?",
            options: ["Courir devant", "Un robot repère votre transaction et passe devant vous pour profiter du prix", "Une course", "Rien"],
            a: 1,
            category: "Risque Trading",
            info: "Le MEV (Maximal Extractable Value) est une taxe invisible prélevée par les validateurs/bots sur les utilisateurs."
        },
        {
            q: "Pourquoi utiliser une 'Subnet' (Avalanche) ou 'Supernet' (Polygon) pour une institution ?",
            options: ["Pour le marketing", "Pour avoir une souveraineté totale sur les validateurs et la conformité (KYC) de la chaîne", "Pour payer plus cher", "C'est moins bien"],
            a: 1,
            category: "Architecture",
            info: "Ces chaînes dédiées permettent de respecter les règles bancaires tout en utilisant la technologie publique."
        },
        {
            q: "Qu'est-ce que le trading 'Over-The-Counter' (OTC) en crypto ?",
            options: ["Sur le comptoir", "Des transactions directes entre deux parties sans passer par le carnet d'ordres public", "Au marché", "Illégal"],
            a: 1,
            category: "Trading",
            info: "Les institutionnels utilisent l'OTC pour acheter de gros volumes sans faire bouger le prix du marché."
        },
        {
            q: "L'IA peut-elle prédire le prix du Bitcoin à coup sûr ?",
            options: ["Oui", "Non, le marché est trop chaotique et influencé par des événements imprévisibles (Cygnes Noirs)", "Peut-être", "Demain"],
            a: 1,
            category: "IA Limites",
            info: "L'IA gère les probabilités, pas les certitudes. Attention aux promesses de gains garantis."
        }
    ],

    // NIVEAU 4 : HEAD OF DIGITAL ASSETS (BONUS - 10 QUESTIONS HARDCORE - 8 CHOIX)
    levelHeadOf: [
        {
            q: "Dans l'architecture de marché cible de l'Euro-système (NewTech), quelle est la modalité de règlement privilégiée pour le DvP ?",
            options: [
                "Utilisation exclusive de Stablecoins commerciaux",
                "Règlement en monnaie banque centrale via la Solution Trigger (Interconnexion DLT-Target2)",
                "Règlement via un token de gros (Wholesale CBDC) natif sur la blockchain de marché",
                "Règlement différé en T+1 via CLS",
                "Les trois solutions (Trigger, Tips, Full-DLT) sont testées en parallèle dans les expérimentations",
                "Uniquement via le TIPS (Target Instant Payment Settlement)",
                "Le règlement se fait en Bitcoin",
                "L'Euro numérique de détail est utilisé"
            ],
            a: 4, // "Les trois solutions..."
            category: "Stratégie BCE",
            info: "La BCE explore 3 pistes : Trigger (Bundesbank), TIPS Hash-Link (Banca d'Italia) et Wholesale CBDC (Banque de France)."
        },
        {
            q: "Selon Bâle III (Standard Crypto), quelle est la condition stricte pour qu'un Stablecoin soit classé en Groupe 1b (faible risque) ?",
            options: [
                "Il doit être populaire",
                "Il doit être algorithmique",
                "Il doit passer un test de remboursement (Redemption Risk Test) et être supervisé régulé",
                "Il doit être émis par une banque uniquement",
                "Il doit avoir une capitalisation > 1 Milliard",
                "Il doit être sur Ethereum",
                "Il n'y a pas de condition, tous les stablecoins sont Groupe 2",
                "Il doit payer des intérêts"
            ],
            a: 2,
            category: "Prudentiel",
            info: "Si le test de stabilité échoue (écart > 10bp), il tombe en Groupe 2 (Pondération 1250% !)."
        },
        {
            q: "Quelle est la nuance juridique exacte entre un 'Native Digital Bond' (Loi eWpG) et un titre 'Tokenisé' classique ?",
            options: [
                "Aucune nuance",
                "Le Native Bond a son registre légal DANS la blockchain, le tokenisé est un jumeau numérique d'un titre papier (Shadow Token)",
                "Le Native Bond est moins cher",
                "Le Tokenisé est illégal",
                "Le Native Bond ne peut pas être tradé",
                "Le Tokenisé est plus rapide",
                "C'est juste du marketing",
                "Le Native Bond utilise la Proof of Work"
            ],
            a: 1,
            category: "Droit Comparé",
            info: "Le 'Native' supprime la racine papier (Global Note). Le 'Tokenisé' classique nécessite souvent encore un CSD central."
        },
        {
            q: "Dans un Smart Contract d'obligation Solidity, comment gérer le risque de 'Reentrancy Attack' lors du paiement des coupons ?",
            options: [
                "En utilisant un antivirus",
                "En priant",
                "En appliquant le pattern Checks-Effects-Interactions (Mettre à jour l'état AVANT d'envoyer les fonds)",
                "En utilisant uniquement Bitcoin",
                "En demandant le KYC",
                "En bloquant le contrat le dimanche",
                "Le risque n'existe pas",
                "En utilisant une boucle for"
            ],
            a: 2,
            category: "Cybersécurité Avancée",
            info: "C'est la faille classique (The DAO hack). Si on envoie l'Ether avant de réduire le solde, l'attaquant peut rapeller la fonction en boucle."
        },
        {
            q: "Quel est le 'Trilemme de la Blockchain' théorisé par Vitalik Buterin ?",
            options: [
                "Vitesse, Coût, Qualité",
                "Décentralisation, Sécurité, Scalabilité (On ne peut en optimiser que 2 sur 3)",
                "Privacy, Public, Permissioned",
                "Bitcoin, Ethereum, Solana",
                "Banque, Client, Régulateur",
                "Passé, Présent, Futur",
                "Layer 1, Layer 2, Layer 3",
                "Il n'y a pas de trilemme"
            ],
            a: 1,
            category: "Théorie DLT",
            info: "Tout le design des Layer 2 vise à résoudre ce trilemme en déportant la scalabilité hors de la chaîne principale."
        },
        {
            q: "Qu'est-ce que le 'MEV' (Maximal Extractable Value) et pourquoi est-ce un problème pour les institutionnels ?",
            options: [
                "C'est un nouveau token",
                "C'est une méthode de validation",
                "C'est la capacité des mineurs/validateurs à réordonner les transactions pour extraire du profit au détriment des utilisateurs (Front-running)",
                "C'est une taxe légale",
                "C'est une assurance",
                "C'est un protocole DeFi",
                "C'est bon pour le marché",
                "Je ne sais pas"
            ],
            a: 2,
            category: "Microstructure Marché",
            info: "Pour une banque, voir son ordre de 50M€ front-runné par un bot est inacceptable (Best Execution)."
        },
        {
            q: "Quel est l'impact précis de la norme comptable IFRS sur la détention de crypto-actifs par une entreprise ?",
            options: [
                "Ils sont comptabilisés comme du Cash (Cash Equivalent)",
                "Ils sont comptabilisés comme des stocks (Inventaires) ou immobilisations incorporelles (Intagible Assets)",
                "Ils sont hors bilan",
                "Ils sont comptabilisés comme des dettes",
                "Ils sont interdits",
                "Ils sont taxés à 30%",
                "C'est du Goodwill",
                "Aucun impact"
            ],
            a: 1,
            category: "Comptabilité",
            info: "Problème : les incorporels ne sont pas réévalués à la juste valeur (Fair Value) à la hausse, seulement dépréciés à la baisse."
        },
        {
            q: "Quelle est la différence entre un Bridge 'Lock & Mint' et un Bridge 'Liquidity Pool' (ex: LayerZero/Stargate) ?",
            options: [
                "Lock & Mint crée un actif synthétique (risque de depeg), alors que Liquidity Pool utilise des actifs natifs de chaque côté",
                "Aucune différence",
                "Lock & Mint est plus rapide",
                "Liquidity Pool est centralisé",
                "Lock & Mint est pour Bitcoin uniquement",
                "Le Bridge n'existe pas",
                "C'est du jargon",
                "L'un est rouge, l'autre bleu"
            ],
            a: 0,
            category: "Architecture Cross-Chain",
            info: "Le modèle Lock & Mint (Wormhole, etc.) a subi les plus gros hacks de l'histoire. L'échange d'actifs natifs est plus sûr."
        },
        {
            q: "Qu'est-ce que la 'Finalité Probabiliste' (Probabilistic Finality) de Bitcoin/Ethereum ?",
            options: [
                "La certitude absolue",
                "Le fait que la probabilité d'une réorganisation de chaîne (Reorg) diminue exponentiellement avec le temps, sans jamais être nulle techniquement",
                "Une erreur mathématique",
                "Un concept philosophique",
                "C'est lié au prix",
                "C'est une loi",
                "C'est faux, la finalité est immédiate",
                "C'est aléatoire"
            ],
            a: 1,
            category: "Risque Settlement",
            info: "Juridiquement, c'est un cauchemar pour le 'Settlement Finality'. D'où l'attente de '6 confirmations' ou l'usage de chaînes à finalité instantanée."
        },
        {
            q: "Dans un réseau ZK-Rollup, quel est le rôle du 'Prover' ?",
            options: [
                "Vérifier l'identité",
                "Générer la preuve cryptographique (succinct proof) que le lot de transactions off-chain est valide",
                "Stocker les données",
                "Rien",
                "Miner des blocks",
                "Payer le gas",
                "Créer des tokens",
                "Faire du marketing"
            ],
            a: 1,
            category: "Layer 2 Scaling",
            info: "Le Prover fait le travail mathématique lourd. Le Smart Contract sur L1 ne fait que vérifier la preuve (d'où le coût faible)."
        }
    ]
};
