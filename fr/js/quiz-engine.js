/**
 * DCM QUIZ ENGINE — v2.0
 * ============================================
 * Phase 2: Quiz Engine
 * Handles: question loading, shuffling, session management,
 * scoring, unlock logic, localStorage persistence.
 * Compatible with both file:// and http:// protocols (non-module).
 * ============================================
 */

const QuizEngine = {

    // ─── CONFIG ─────────────────────────────────────────────────────────────
    BANK_PATH: './js/quiz-bank/',
    QUESTIONS_PER_SESSION: 20,
    PASS_SCORE: 80, // % required to unlock next level

    LEVELS: [
        { id: 1, key: 'L1', file: 'level-1.json', name: 'Foundations of DLT Risk', color: '#10b981', icon: 'fa-seedling', requires: null },
        { id: 2, key: 'L2', file: 'level-2.json', name: 'Governance & Capital Impact', color: '#eab308', icon: 'fa-building-columns', requires: 1 },
        { id: 3, key: 'L3', file: 'level-3.json', name: 'Regulatory Mapping', color: '#f97316', icon: 'fa-scale-balanced', requires: 2 },
        { id: 4, key: 'L4', file: 'level-4.json', name: 'Infrastructure & Deployment', color: '#ef4444', icon: 'fa-server', requires: 3 },
        { id: 5, key: 'L5', file: 'level-5.json', name: 'Strategic Positioning', color: '#6366f1', icon: 'fa-chess-king', requires: 4 },
        { id: 6, key: 'L6', file: 'level-6.json', name: 'DeFi & RWA Strategies', color: '#14b8a6', icon: 'fa-cubes', requires: 5 },
        { id: 'super', key: 'SL', file: 'super-level.json', name: 'DCM Black Level', color: '#7c3aed', icon: 'fa-bolt', requires: 6, isSuper: true }
    ],

    // ─── LOCALSTORAGE KEYS ───────────────────────────────────────────────────
    KEYS: {
        UNLOCKS: 'dcm_quiz_unlocks',
        SCORES: 'dcm_quiz_scores',
        HISTORY: 'dcm_quiz_history',
        SUPER: 'dcm_super_unlocked',
        CERTS: 'dcm_quiz_certs'
    },

    // ─── STATE ───────────────────────────────────────────────────────────────
    _state: {
        currentLevel: null,
        bank: [],
        session: [],
        currentIndex: 0,
        answers: [],
        sessionId: null,
        startTime: null,
        qStartTime: null
    },

    fastTrack: false,

    // ─── DEV MODE ────────────────────────────────────────────────────────────
    isDevMode() {
        return localStorage.getItem('is_super_dev') === 'true'
            || localStorage.getItem('dcm_user_role') === 'ADMIN';
    },

    // ─── UNLOCK MANAGEMENT ──────────────────────────────────────────────────
    getUnlocks() {
        if (this.isDevMode()) return [1, 2, 3, 4, 5, 6, 'super'];
        
        // Priority to SessionManager profile (Supabase-backed)
        const profile = window.SessionManager ? window.SessionManager.getCurrentUser() : null;
        if (profile && profile.unlocked_levels) {
            return profile.unlocked_levels;
        }

        return JSON.parse(localStorage.getItem(this.KEYS.UNLOCKS) || '[1]');
    },

    isLevelUnlocked(levelId) {
        if (this.isDevMode()) return true;
        
        // Level 6 is the monetized gate
        if (levelId === 6) {
            const hasProAccess = localStorage.getItem('dcm_pro_access') === 'true';
            
            // Check trial expiration
            const trialEndStr = localStorage.getItem('dcm_trial_end');
            if (trialEndStr) {
                const trialEnd = new Date(trialEndStr);
                if (new Date() > trialEnd) {
                    console.warn("Trial expired");
                    return false; // Trial ended
                }
            }

            const unlocks = this.getUnlocks();
            // Must have passed L5 AND have Pro Access code (active)
            return unlocks.includes(5) && hasProAccess;
        }

        const unlocks = this.getUnlocks();
        return unlocks.includes(levelId);
    },

    async validateAccessCode(code) {
        const sanitized = code.trim().toUpperCase();
        
        // Use global Supabase client (from supabase-client.js)
        if (!window.supabase) {
            console.error("Supabase client not initialized");
            return false;
        }

        try {
            const { data, error } = await window.supabase
                .from('access_codes')
                .select('*')
                .eq('code', sanitized)
                .single();

            if (error || !data) {
                console.error("Verification failed:", error?.message || "Code not found");
                return false;
            }

            // Success: Store access and metadata
            localStorage.setItem('dcm_pro_access', 'true');
            localStorage.setItem('dcm_pro_code', sanitized); // For reference
            localStorage.setItem('dcm_pro_plan', data.plan || 'monthly');
            
            if (data.trial_end) {
                localStorage.setItem('dcm_trial_end', data.trial_end);
            } else {
                localStorage.removeItem('dcm_trial_end'); // Permanent access
            }

            return true;
        } catch (err) {
            console.error("Network error during validation:", err);
            return false;
        }
    },

    async unlockLevel(levelId) {
        const unlocks = this.getUnlocks();
        if (!unlocks.includes(levelId)) {
            unlocks.push(levelId);
            localStorage.setItem(this.KEYS.UNLOCKS, JSON.stringify(unlocks));

            // Sync with Supabase via SessionManager
            if (window.SessionManager) {
                try {
                    await window.SessionManager.updateProfile({ unlocked_levels: unlocks });
                    console.log(`🔓 Level ${levelId} synchronized to Supabase profile.`);
                } catch (err) {
                    console.warn("⚠️ Failed to sync level unlock to Supabase:", err.message);
                }
            }
        }
    },

    // ─── SCORE MANAGEMENT ───────────────────────────────────────────────────
    getBestScore(levelKey) {
        const scores = JSON.parse(localStorage.getItem(this.KEYS.SCORES) || '{}');
        return scores[levelKey] || null;
    },

    _saveScore(levelKey, score, passed) {
        const scores = JSON.parse(localStorage.getItem(this.KEYS.SCORES) || '{}');
        if (!scores[levelKey] || score > scores[levelKey]) {
            scores[levelKey] = score;
        }
        localStorage.setItem(this.KEYS.SCORES, JSON.stringify(scores));
    },

    // ─── EMBEDDED QUESTION BANKS ─────────────────────────────────────────────
    // Inline data: no network request needed — works on file:// and http://
    _BANKS: {
        1: {
            level: 1, name: "Foundations of DLT Risk",
            subtitle: "DLT basics, MiCA, DORA, Tokenization, Basel crypto exposure",
            theme_color: "#10b981",
            questions: [
                { id: "L1-001", question: "Quel est l'objectif principal d'un registre distribué (DLT) par rapport à une base de données classique ?", choices: ["Optimiser la fiscalité des transactions", "Centraliser les données sous contrôle unique", "Assurer l'immutabilité, la transparence et la décentralisation", "Supprimer le besoin de régulation financière"], correct: 2, explanation: "Un DLT garantit que les données ne peuvent être altérées après enregistrement, sont visibles à tous les participants autorisés, et ne dépendent pas d'un acteur central.", theme: "DLT Basics", difficulty: "easy" },
                { id: "L1-002", question: "Qu'est-ce qu'un smart contract dans le contexte blockchain ?", choices: ["Un contrat signé numériquement chez un notaire", "Un code auto-exécutable déployé sur un réseau distribué", "Un PDF tokenisé stocké sur IPFS", "Une API bancaire standardisée ISO 20022"], correct: 1, explanation: "Un smart contract est un programme informatique dont l'exécution est automatiquement déclenchée à la réalisation de conditions prédéfinies, sans intermédiaire.", theme: "DLT Basics", difficulty: "easy" },
                { id: "L1-003", question: "Quelle est la différence fondamentale entre une blockchain permissioned et une blockchain permissionless ?", choices: ["La permissioned est plus rapide mais moins sécurisée", "La permissioned restreint l'accès aux entités identifiées et autorisées", "La permissionless nécessite un KYC obligatoire", "La permissioned est open-source, la permissionless est propriétaire"], correct: 1, explanation: "Une blockchain permissioned (ex. Canton, SWIAT) limite la participation à des entités vérifiées — capital pour les institutions financières soumises à la régulation.", theme: "DLT Basics", difficulty: "easy" },
                { id: "L1-004", question: "MiCA (Markets in Crypto-Assets) s'applique principalement à :", choices: ["Les produits dérivés actions européens", "Les crypto-actifs émis ou offerts dans l'Union Européenne", "Les ETF adossés à des matières premières", "Les stablecoins émis exclusivement aux États-Unis"], correct: 1, explanation: "MiCA est le cadre réglementaire européen qui régit l'émission et la prestation de services sur crypto-actifs, applicable depuis 2024 pour les stablecoins et 2025 pour les CASP.", theme: "MiCA", difficulty: "easy" },
                { id: "L1-005", question: "DORA (Digital Operational Resilience Act) vise principalement à :", choices: ["Protéger les investisseurs particuliers en crypto", "Garantir la résilience opérationnelle numérique des entités financières face aux risques ICT", "Encadrer la fiscalité des plus-values crypto", "Réguler les CBDC des banques centrales européennes"], correct: 1, explanation: "DORA impose aux entités financières UE des exigences de continuité, de test de résilience, et de gestion des risques tiers numériques.", theme: "DORA", difficulty: "easy" },
                { id: "L1-006", question: "Un tokenized bond est :", choices: ["Une obligation traditionnelle convertie en représentation numérique native sur DLT", "Une crypto-monnaie spéculative adossée à rien", "Une action fractionnée en tokens ERC-20", "Un stablecoin émis par une banque centrale"], correct: 0, explanation: "Un tokenized bond représente une obligation sous forme de token sur un registre distribué, permettant règlement T+0, transparence du cycle de vie et automatisation des coupons via smart contracts.", theme: "Tokenization", difficulty: "easy" },
                { id: "L1-007", question: "Le risque de 'validator concentration' dans un réseau DLT signifie :", choices: ["Un nombre excessif d'utilisateurs actifs sur le réseau", "Un taux de minage trop élevé générant des surcoûts énergétiques", "Un nombre trop restreint d'entités contrôlant la validation des blocs", "Un trop grand nombre de forks non résolus"], correct: 2, explanation: "Si peu d'entités valident les transactions, une défaillance ou collusion devient un risque systémique majeur — point critique pour DORA et Bâle III.", theme: "DLT Risk", difficulty: "medium" },
                { id: "L1-008", question: "Un stablecoin algorithmique se distingue par :", choices: ["Des réserves fiat 1:1 auditées par un tiers", "Un collatéral en or physique stocké en vault", "Des mécanismes d'offre/demande algorithmiques pour maintenir son ancrage", "Un adossement à un panier de CBDC"], correct: 2, explanation: "Les stablecoins algorithmiques (ex. feu Terra/LUNA) maintiennent leur ancrage via des mécanismes de burn/mint automatisés — sans réserves réelles, d'où leur vulnérabilité structurelle.", theme: "Tokenization", difficulty: "medium" },
                { id: "L1-009", question: "Qu'est-ce que le 'Proof of Stake' (PoS) ?", choices: ["Un mécanisme d'audit cryptographique des transactions", "Un protocole de consensus où les validateurs misent des tokens en garantie", "Une méthode de minage basée sur la puissance de calcul", "Un standard ISO de certification des blockchains financières"], correct: 1, explanation: "En PoS, les validateurs mettent en jeu (stake) des tokens comme garantie. Ethereum utilise PoS depuis The Merge (2022).", theme: "Consensus Mechanisms", difficulty: "easy" },
                { id: "L1-010", question: "Qu'est-ce qu'un oracle dans l'écosystème blockchain ?", choices: ["Une base de données centralisée de transactions on-chain", "Un validateur avec droits étendus de gouvernance", "Un composant qui connecte la blockchain à des données du monde réel (off-chain)", "Un protocole de compression des blocs pour scalabilité"], correct: 2, explanation: "Les oracles (ex. Chainlink) permettent aux smart contracts d'accéder à des données externes — une dépendance critique générant des risques de manipulation.", theme: "DLT Basics", difficulty: "medium" },
                { id: "L1-011", question: "Dans le cadre Bâle III, l'exposition d'une banque aux crypto-actifs de Groupe 2b (ex. Bitcoin) est soumise à :", choices: ["Une pondération de risque de 100% comme les actions", "Une pondération de risque de 1250% (charge maximale)", "Une exemption si détenu moins de 30 jours", "Les mêmes règles que les obligations souveraines"], correct: 1, explanation: "Le BCBS (2022) impose une pondération de 1250% pour les crypto-actifs non adossés classifiés Groupe 2b — équivalent à une déduction totale des fonds propres.", theme: "Basel Crypto", difficulty: "medium" },
                { id: "L1-012", question: "Un hash cryptographique SHA-256 est :", choices: ["Une signature électronique réversible d'un document", "Une empreinte unique et irréversible d'un ensemble de données", "Un algorithme de chiffrement symétrique des clés privées", "Un protocole de consensus pour réseaux permissioned"], correct: 1, explanation: "SHA-256 produit une empreinte de 256 bits fixe pour n'importe quelle entrée. Le moindre changement dans les données modifie totalement le hash — fondement de l'intégrité blockchain.", theme: "Cryptography", difficulty: "easy" },
                { id: "L1-013", question: "Les 'gas fees' dans Ethereum représentent :", choices: ["Les frais de conversion fiat-crypto chez un CASP", "Le coût en ETH pour exécuter des opérations sur le réseau", "Une taxe réglementaire imposée par l'EBA", "Les frais de conservation chez un custodian agréé"], correct: 1, explanation: "Les gas fees compensent les validateurs pour les ressources de calcul consommées. Ils varient selon la congestion réseau.", theme: "DLT Basics", difficulty: "easy" },
                { id: "L1-014", question: "Une solution Layer 2 (L2) vise à :", choices: ["Remplacer définitivement la blockchain principale", "Améliorer la scalabilité en traitant des transactions hors de la chaîne principale", "Ajouter une couche de régulation KYC on-chain", "Créer une blockchain parallèle indépendante"], correct: 1, explanation: "Les L2 (ex. Optimism, Polygon) exécutent les transactions off-chain puis soumettent des preuves à la L1, réduisant les coûts et augmentant le débit.", theme: "Scalability", difficulty: "medium" },
                { id: "L1-015", question: "Le 'slashing' dans un réseau Proof of Stake désigne :", choices: ["La compression automatique de blocs pour réduire le stockage", "La pénalité imposée à un validateur pour comportement malveillant ou erreur", "La division d'un token en fractions pour micro-transactions", "Un mécanisme de fork résolution automatique"], correct: 1, explanation: "Le slashing sanctionne les validateurs qui signent deux blocs conflictuels (double signing) ou sont inactifs prolongément, en confisquant tout ou partie de leur stake.", theme: "Consensus Mechanisms", difficulty: "medium" },
                { id: "L1-016", question: "L'AML dans le contexte crypto impose à un CASP de :", choices: ["Bloquer toutes les transactions supérieures à 1 000€", "Identifier et vérifier ses clients (KYC) et détecter les transactions suspectes", "Soumettre tous les wallets à une autorité centrale mensuelle", "Refuser tout client sans résidence UE"], correct: 1, explanation: "Sous la directive AMLD, les CASP sont soumis aux mêmes obligations KYC/AML que les institutions financières traditionnelles.", theme: "Regulatory Compliance", difficulty: "easy" },
                { id: "L1-017", question: "Une CBDC se distingue d'un stablecoin privé car :", choices: ["Elle est émise directement par une banque centrale et constitue une obligation souveraine", "Elle fonctionne uniquement sur blockchain publique permissionless", "Elle est adossée à des réserves d'or physique", "Elle n'est pas soumise à la régulation bancaire classique"], correct: 0, explanation: "Une CBDC est une forme numérique de monnaie banque centrale — une obligation directe de l'État.", theme: "CBDC", difficulty: "easy" },
                { id: "L1-018", question: "Le TVL (Total Value Locked) mesure :", choices: ["La valeur totale des actifs déposés dans des protocoles DeFi ou smart contracts", "Le volume de transactions réalisées sur une blockchain en 24h", "La capitalisation boursière d'un protocole DeFi", "Le nombre de wallets actifs sur un réseau"], correct: 0, explanation: "Le TVL est un indicateur clé de l'adoption d'un protocole DeFi : valeur totale des actifs confiés à ses smart contracts.", theme: "DeFi Metrics", difficulty: "easy" },
                { id: "L1-019", question: "Un wallet non-custodial se caractérise par :", choices: ["La délégation de la garde des clés privées à un prestataire agréé", "La détention exclusive des clés privées par l'utilisateur sans intermédiaire", "L'obligation d'un KYC renforcé auprès d'un CASP régulé", "L'impossibilité de transférer des actifs vers une plateforme centralisée"], correct: 1, explanation: "En non-custodial, l'utilisateur est seul détenteur de sa clé privée. 'Not your keys, not your coins.'", theme: "Wallets & Custody", difficulty: "easy" },
                { id: "L1-020", question: "Un fork de protocole blockchain survient lorsque :", choices: ["Le réseau subit une attaque DDoS et se divise temporairement", "Un désaccord de gouvernance ou une mise à jour crée deux versions incompatibles du protocole", "Une banque centrale émet une CBDC parallèle", "Le genesis block est remplacé par un bloc de compensation"], correct: 1, explanation: "Un hard fork (ex. Ethereum/Ethereum Classic en 2016) crée deux chaînes distinctes — un risque de fragmentation de liquidité.", theme: "DLT Risk", difficulty: "medium" },
                { id: "L1-021", question: "L'interopérabilité entre blockchains désigne la capacité à :", choices: ["Fusionner deux blockchains en une seule architecture unifiée", "Transférer des actifs et données entre réseaux distincts sans intermédiaire centralisé", "Convertir automatiquement des tokens en fiat via un oracle", "Synchroniser les noeuds validateurs de réseaux différents"], correct: 1, explanation: "L'interopérabilité (cross-chain) — via des bridges, IBC — permet la communication entre blockchains, tout en générant des risques spécifiques.", theme: "DLT Basics", difficulty: "medium" },
                { id: "L1-022", question: "Un custodian crypto agréé (au sens MiCA) doit obligatoirement :", choices: ["Isoler les actifs clients des actifs propres et maintenir une couverture équivalente", "Déposer 100% des actifs clients auprès de la BCE", "Bloquer les actifs pendant 48h après tout dépôt", "Publier les clés privées en open source"], correct: 0, explanation: "MiCA impose aux custodians une ségrégation stricte des actifs clients, une couverture 1:1, et la responsabilité légale en cas de perte.", theme: "MiCA", difficulty: "medium" },
                { id: "L1-023", question: "Le risque d'un smart contract vulnérable est principalement :", choices: ["La perte de connectivité réseau résultant d'une attaque DDoS", "L'exploitation d'une faille dans le code par un acteur malveillant", "La variation du gas price rendant le contrat inexécutable", "L'incompatibilité avec le protocole AML de la juridiction"], correct: 1, explanation: "Les smart contracts sont immuables une fois déployés : une faille de code (ex. reentrancy attack) peut être exploitée de manière irréversible.", theme: "Smart Contract Risk", difficulty: "medium" },
                { id: "L1-024", question: "Le 'regulatory arbitrage' dans le contexte crypto désigne :", choices: ["Le choix stratégique d'une juridiction à régulation favorable pour opérer un projet crypto", "L'exploitation de failles comptables pour réduire les charges fiscales", "La conversion d'actifs crypto en fiat pour éviter la régulation", "L'émission de tokens dans plusieurs juridictions simultanément"], correct: 0, explanation: "Le regulatory arbitrage est de plus en plus limité par la convergence réglementaire globale (FATF, MiCA, IOSCO).", theme: "Regulatory Compliance", difficulty: "medium" },
                { id: "L1-025", question: "Un token de type 'utility token' au sens MiCA est :", choices: ["Un titre financier donnant droit à des dividendes", "Un token conférant un accès à un bien ou service spécifique d'un émetteur", "Un stablecoin adossé à une monnaie fiat", "Une CBDC émise par une banque centrale membre de l'UE"], correct: 1, explanation: "Les utility tokens sont régulés sous MiCA avec des exigences de whitepaper allégées par rapport aux asset-referenced tokens.", theme: "MiCA", difficulty: "medium" },
                { id: "L1-026", question: "Le risque de gouvernance d'une DAO réside principalement dans :", choices: ["L'absence d'interface utilisateur accessible aux participants", "La concentration des droits de vote chez les plus grands détenteurs de tokens", "L'impossibilité technique de modifier les smart contracts", "Le défaut de déclaration fiscale des revenus de staking"], correct: 1, explanation: "En pratique, les 'baleines' détenant des volumes importants de tokens de gouvernance contrôlent les votes dans les DAO.", theme: "Governance Risk", difficulty: "medium" },
                { id: "L1-027", question: "L'on-chain data analytics permet principalement à une institution de :", choices: ["Remplacer les audits financiers traditionnels obligatoires", "Analyser en temps réel les flux de transactions pour détecter comportements suspects", "Accéder aux données privées des wallets non-custodials", "Modifier des transactions non confirmées dans la mempool"], correct: 1, explanation: "L'analyse on-chain (via Chainalysis, Elliptic, TRM Labs) permet aux institutions de tracer les flux et scorer le risque des adresses blockchain.", theme: "Compliance Technology", difficulty: "medium" },
                { id: "L1-028", question: "Dans Bâle III, les crypto-actifs sont classifiés en groupes selon :", choices: ["Leur capitalisation boursière et volume quotidien", "Leur capacité à satisfaire des critères de qualité prudentielle (classification BCBS 2022)", "La juridiction de leur émetteur", "Leur mécanisme de consensus (PoW vs PoS)"], correct: 1, explanation: "Le BCBS (2022) classe les crypto en Groupe 1 (tokenisés conformes) et Groupe 2 (non conformes) avec des pondérations radicalement différentes.", theme: "Basel Crypto", difficulty: "hard" },
                { id: "L1-029", question: "La DeFi présente comme risque institutionnel majeur :", choices: ["Une réglementation trop stricte rendant les protocoles inutilisables", "L'absence d'entité légalement responsable en cas de défaillance du protocole", "La surperformance par rapport aux instruments financiers traditionnels", "Un taux d'adoption trop rapide chez les banques centrales"], correct: 1, explanation: "L'absence d'entité juridique identifiable dans les protocoles DeFi crée un vide légal en cas de hack ou litige — risque légal critique.", theme: "DeFi Risk", difficulty: "medium" },
                { id: "L1-030", question: "Un 'bridge' cross-chain représente un risque car :", choices: ["Il génère des frais de transaction supérieurs à 50% de la valeur transférée", "Il constitue un point de concentration des fonds exposé aux exploits smart contract", "Il est interdit par MiCA pour les transferts supérieurs à 10 000€", "Il nécessite obligatoirement un KYC de niveau 3 auprès d'un CASP agréé"], correct: 1, explanation: "Les bridges ont représenté la majorité des hacks DeFi en valeur (ex. Ronin 625M$, Wormhole 320M$). Ils concentrent des fonds dans des smart contracts vulnérables.", theme: "DLT Risk", difficulty: "hard" }
            ]
        },

        2: {
            level: 2, name: "Governance & Capital Impact",
            subtitle: "CET1, OpRisk, BCBS 239, MRM, Data Lineage",
            theme_color: "#eab308",
            questions: [
                { id: "L2-001", question: "Le ratio CET1 (Common Equity Tier 1) mesure :", choices: ["La liquidité à court terme d'une banque", "La qualité et quantité de fonds propres durs d'une banque / actifs pondérés du risque", "Le levier financier brut d'une institution", "Le taux de couverture des pertes attendues EL"], correct: 1, explanation: "CET1 = fonds propres de base (actions ordinaires + réserves) / RWA. Bâle III impose un minimum de 4,5% + coussin de conservation de 2,5%.", theme: "Capital Adequacy", difficulty: "medium" },
                { id: "L2-002", question: "L'OpRisk (risque opérationnel) en Bâle III inclut :", choices: ["Uniquement les pertes dues aux cyberattaques externes", "Les pertes résultant de processus internes défaillants, personnes, systèmes ou événements externes", "Exclusivement les fraudes documentaires", "Les pertes de marché sur positions ouvertes"], correct: 1, explanation: "L'OpRisk couvre: fraude interne/externe, pratiques RH, dommages actifs physiques, interruptions systèmes, exécution défaillante. Les DLT y sont exposés.", theme: "Operational Risk", difficulty: "medium" },
                { id: "L2-003", question: "BCBS 239 porte sur :", choices: ["Les exigences de fonds propres pour les expositions crypto", "Les principes d'agrégation des données de risque et de reporting (RDARR)", "Le cadre de liquidité LCR/NSFR des banques systémiques", "La pondération des risques de contrepartie CCR"], correct: 1, explanation: "BCBS 239 impose aux G-SIBs des principes de gouvernance, architecture data et capacités de reporting pour une agrégation des risques robuste et rapide.", theme: "BCBS 239", difficulty: "hard" },
                { id: "L2-004", question: "Le Model Risk Management (MRM) vise à :", choices: ["Maximiser la performance des modèles de trading algorithmique", "Identifier, mesurer et contrôler les risques liés à l'utilisation de modèles quantitatifs", "Automatiser la revue des états financiers réglementaires", "Remplacer les stress tests par des simulations Monte Carlo"], correct: 1, explanation: "Le MRM encadre le cycle de vie complet des modèles: développement, validation, déploiement, monitoring, retraite. SR 11-7 (Fed) et EBA Guidelines sont les références clés.", theme: "Model Risk", difficulty: "hard" },
                { id: "L2-005", question: "Un tokenized asset sur DLT peut impacter le CET1 car :", choices: ["Il réduit automatiquement les RWA grâce à la transparence blockchain", "Sa classification en Groupe 2b Bâle III impose une pondération de 1250%", "Il est exclu du périmètre prudentiel des banques UE", "Il ne génère pas de risque de contrepartie"], correct: 1, explanation: "Un actif DLT non-conforme (Groupe 2b BCBS) reçoit une pondération de 1250%, équivalent à une déduction directe du CET1 euro pour euro.", theme: "Capital Adequacy", difficulty: "hard" },
                { id: "L2-006", question: "Le SREP (Supervisory Review and Evaluation Process) évalue :", choices: ["La conformité MiCA des CASP européens", "Les besoins en capital supplémentaire au-delà des minima Pilier 1", "La résistance des systèmes IT aux cyberattaques", "La qualité des audits externes des banques"], correct: 1, explanation: "Le SREP BCE/EBA évalue le modèle économique, la gouvernance, les risques Pilier 2 et la liquidité, pouvant imposer des exigences Pilier 2 additionnelles (P2R/P2G).", theme: "Supervision", difficulty: "hard" },
                { id: "L2-007", question: "La data lineage dans le contexte BCBS 239 désigne :", choices: ["La traçabilité complète du cycle de vie des données de risque (origine, transformations, destination)", "L'archivage réglementaire des rapports de risque pendant 7 ans", "Le processus de validation des données par le back-office", "La certification ISO des systèmes de gestion des données"], correct: 0, explanation: "BCBS 239 exige que chaque donnée de risque soit traçable de sa source à son utilisation finale — condition critique pour valider l'intégrité des modèles.", theme: "BCBS 239", difficulty: "medium" },
                { id: "L2-008", question: "Le ratio LCR (Liquidity Coverage Ratio) mesure :", choices: ["Le niveau de fonds propres Tier 1 sur actifs pondérés", "La capacité d'une banque à couvrir ses sorties nettes de trésorerie sur 30 jours avec des HQLA", "Le rapport entre dépôts stables et crédits à long terme", "L'exposition maximale à un seul emprunteur"], correct: 1, explanation: "LCR = HQLA / sorties nettes sur 30 jours ≥ 100%. Tester la résistance à un choc de liquidité à court terme.", theme: "Liquidity Risk", difficulty: "medium" },
                { id: "L2-009", question: "Dans le cadre des stress tests EBA, l'objectif principal est :", choices: ["Maximiser les revenus en période de volatilité", "Évaluer la résilience du capital bancaire sous des scénarios adverses macroéconomiques", "Tester la robustesse des systèmes IT en production", "Vérifier la conformité RGPD des bases de données clients"], correct: 1, explanation: "Les stress tests EBA projettent le CET1 sur 3 ans sous un scénario de base et un scénario adverse défini par l'EBA/ESRB.", theme: "Stress Testing", difficulty: "medium" },
                { id: "L2-010", question: "Le risque de contrepartie (CCR) sur un smart contract DeFi est :", choices: ["Nul car les smart contracts s'exécutent automatiquement", "Présent via l'exposition au protocole et son collatéral, remplaçant la contrepartie humaine", "Entièrement couvert par les garanties de gas fees", "Identique au risque de crédit sur un prêt bancaire classique"], correct: 1, explanation: "Dans la DeFi, le risque de contrepartie se transforme en risque de protocole et de collatéral — soumis à des règles de pondération CCR adaptées.", theme: "Counterparty Risk", difficulty: "hard" },
                { id: "L2-011", question: "Le 'model validation' indépendant (SR 11-7) requiert :", choices: ["Une validation par l'équipe de développement du modèle", "Une revue par une fonction indépendante de celle qui développe et utilise le modèle", "Un audit annuel obligatoire par un cabinet extérieur", "Une certification ISO 27001 du modèle et de ses données"], correct: 1, explanation: "SR 11-7 impose une séparation stricte entre développeurs et validateurs. La validation doit évaluer la conception, les données, l'implémentation et le monitoring.", theme: "Model Risk", difficulty: "hard" },
                { id: "L2-012", question: "Le coussin contra-cyclique (CCyB) a pour objectif :", choices: ["Augmenter les fonds propres bancaires en phase d'expansion pour absorber les pertes en récession", "Réduire les exigences de capital pendant les crises pour soutenir le crédit", "Remplacer le coussin de conservation Bâle III", "Financer les DGS (systèmes de garantie des dépôts)"], correct: 0, explanation: "Le CCyB (jusqu'à 2,5% de RWA) est activé en période de surchauffe du crédit et libérable en crise pour absorber les pertes sans restreindre le crédit.", theme: "Capital Adequacy", difficulty: "medium" },
                { id: "L2-013", question: "Le risque de marché sur actifs tokenisés Groupe 1a (BCBS 2022) est :", choices: ["Traité identiquement aux actifs financiers classiques sous Bâle III", "Exclu des exigences de fonds propres pour Bâle IV", "Soumis à une pondération de 1250% par défaut", "Non applicable aux banques opérant sous MiCA"], correct: 0, explanation: "Les actifs numériques Groupe 1a (tokenization d'actifs classiques répondant aux critères BCBS) reçoivent les mêmes pondérations que leurs équivalents traditionnels.", theme: "Capital Adequacy", difficulty: "hard" },
                { id: "L2-014", question: "Le concept de 'Risk Appetite Framework' (RAF) désigne :", choices: ["Le montant maximal de pertes qu'une institution accepte de prendre pour atteindre ses objectifs", "Le niveau technique de tolérance aux erreurs des systèmes IT", "Un outil de calcul automatique des RWA", "La liste des produits financiers autorisés par le régulateur"], correct: 0, explanation: "Le RAF définit le risk appetite (risque désiré), la risk tolerance (limites) et la risk capacity (maximum absorbable) — pilier de la gouvernance des risques.", theme: "Risk Governance", difficulty: "medium" },
                { id: "L2-015", question: "ICAAP (Internal Capital Adequacy Assessment Process) est :", choices: ["Le processus interne par lequel une banque évalue son besoin en capital total", "Un modèle de scoring pour clients PME", "La procédure de déclaration comptable des créances douteuses", "Un outil de benchmarking de la conformité MiCA"], correct: 0, explanation: "L'ICAAP, pilier 2 de Bâle, oblige les banques à auto-évaluer leur adéquation en capital, incluant les risques non couverts par le Pilier 1.", theme: "Capital Adequacy", difficulty: "medium" },
                { id: "L2-016", question: "La pondération des RWA pour risque opérationnel sous la SA (Standardised Approach) Bâle IV est basée sur :", choices: ["Le nombre d'incidents opérationnels déclarés les 3 dernières années", "Le Business Indicator (BI) — indicateur de revenu — de la banque", "Les pertes historiques brutes divisées par le capital Tier 1", "Le volume de transactions journalières en valeur"], correct: 1, explanation: "Bâle IV (2023) remplace les approches AMA par la SA unique basée sur le BI, avec des multiplicateurs selon les pertes historiques.", theme: "Operational Risk", difficulty: "hard" },
                { id: "L2-017", question: "Le 'four eyes principle' en gouvernance des risques signifie :", choices: ["Quatre niveaux d'approbation pour tout engagement supérieur à 1M€", "Toute décision importante doit être revue et approuvée par au moins deux personnes", "Un comité de 4 personnes minimum pour la gestion du risque", "L'obligation d'un double audit interne et externe annuel"], correct: 1, explanation: "Ce principe de contrôle à double regard réduit le risque d'erreur ou de fraude dans les décisions critiques — pilier fondamental de la gouvernance interne.", theme: "Risk Governance", difficulty: "easy" },
                { id: "L2-018", question: "Le risque de réputation lié à une exposition crypto pour une banque inclut :", choices: ["Uniquement le risque de perte directe sur les actifs détenus", "L'impact négatif potentiel sur la confiance des clients et partenaires en cas de hack ou scandale", "La volatilité du P&L de trading liée aux prix crypto", "Le risque fiscal de requalification des gains crypto"], correct: 1, explanation: "Le risque réputationnel crypto peut déclencher des retraits massifs, affecter le rating et générer une crise de confiance — distinct du risque financier direct.", theme: "Reputational Risk", difficulty: "medium" },
                { id: "L2-019", question: "Le NSFR (Net Stable Funding Ratio) vise :", choices: ["Mesurer la liquidité à court terme sur 30 jours", "Assurer un financement stable à long terme (1 an) des actifs illiquides", "Contrôler le levier financier brut", "Réguler le ratio prêts/dépôts"], correct: 1, explanation: "NSFR = ASF / RSF ≥ 100%. S'assure qu'une banque finance ses actifs illiquides avec des ressources stables à plus d'un an.", theme: "Liquidity Risk", difficulty: "medium" },
                { id: "L2-020", question: "Dans un modèle interne VaR (Value at Risk), le backtesting consiste à :", choices: ["Tester le modèle sur des scénarios hypothétiques futurs", "Comparer les pertes réelles ex-post aux prédictions du modèle sur une période historique", "Recalibrer les paramètres du modèle selon les nouvelles données de marché", "Vérifier la conformité du modèle avec les exigences réglementaires Pilier 2"], correct: 1, explanation: "Le backtesting compare les pertes réalisées aux estimations VaR sur 250 jours ouvrés. Plus de 4 exceptions triggent une révision réglementaire (zone rouge Bâle).", theme: "Model Risk", difficulty: "hard" },
                { id: "L2-021", question: "Le risque de concentration en Pilier 2 Bâle III couvre :", choices: ["La diversification des actifs dans un portefeuille DeFi", "Les expositions excessives envers un seul emprunteur, secteur ou zone géographique", "L'exposition aux crypto-actifs illiquides uniquement", "Les limites de rémunération des traders à risque élevé"], correct: 1, explanation: "Le risque de concentration (large exposures, sectorielles, géographiques) est géré hors Pilier 1 et peut générer des exigences Pilier 2 additionnelles via le SREP.", theme: "Concentration Risk", difficulty: "medium" },
                { id: "L2-022", question: "Le risque de liquidité de financement (funding liquidity risk) se matérialise quand :", choices: ["Les spreads de marché s'écartent brusquement", "Une institution ne peut pas refinancer ses engagements à maturité à un coût raisonnable", "Les actifs sont vendus à des prix inférieurs à leur valeur comptable", "Le ratio CET1 passe sous le seuil réglementaire"], correct: 1, explanation: "Le funding liquidity risk survient when une banque ne peut pas rouler sa dette ou doit le faire à des conditions fortement dégradées — cf. SVB 2023.", theme: "Liquidity Risk", difficulty: "medium" },
                { id: "L2-023", question: "Les G-SIBs (Globally Systemically Important Banks) sont soumis à :", choices: ["Des exigences CET1 additionnelles (D-SIB buffer) allant de 1% à 3,5%", "Les mêmes exigences Bâle III que les banques domestiques", "Une exemption des stress tests EBA", "Un ratio LCR réduit de 80% en période de crise"], correct: 0, explanation: "Les G-SIBs reçoivent un coussin systémique additionnel (G-SIB surcharge) de 1% à 3,5% selon leur catégorie de risque systémique (buckets 1 à 5).", theme: "Systemic Risk", difficulty: "hard" },
                { id: "L2-024", question: "Le Pilier 3 de Bâle III impose aux banques :", choices: ["Des tests de résistance trimestriels obligatoires", "La publication d'informations sur leurs risques, fonds propres et gouvernance", "Un reporting mensuel au régulateur national", "La certification externe de tous les modèles internes"], correct: 1, explanation: "Pilier 3 (discipline de marché) oblige les banques à publier des Rapports sur les Risques (Risk Reports) permettant aux acteurs de marché d'évaluer leur profil de risque.", theme: "Supervision", difficulty: "medium" },
                { id: "L2-025", question: "La 'sensibilité' d'un portefeuille obligataire à la duration mesure :", choices: ["La corrélation entre obligations souveraines et actifs risqués", "La variation de valeur du portefeuille pour une variation d'1% des taux d'intérêt", "Le risque de défaut pondéré des émetteurs", "Le spread de crédit moyen pondéré du portefeuille"], correct: 1, explanation: "Duration (time-weighted) × valeur portefeuille × Δtaux = perte/gain estimée. Capital critique pour le risque de taux dans le banking book (IRRBB).", theme: "Market Risk", difficulty: "medium" },
                { id: "L2-026", question: "Le RWA (Risk-Weighted Asset) pour expositions corporate sous méthode standard est calculé :", choices: ["Selon la notation interne IRB de la banque", "Via des pondérations fixes selon le rating externe de la contrepartie (de 20% à 150%)", "Par un modèle Monte Carlo de simulation des défauts", "Sur la base du volume de transactions de l'emprunteur sur 12 mois"], correct: 1, explanation: "En approche standard Bâle IV, les pondérations corporate vont de 20% (AAA-AA) à 150% (< B-), selon les notations d'agences reconnues (ECAI).", theme: "Credit Risk", difficulty: "hard" },
                { id: "L2-027", question: "Un DLT institutionnel peut améliorer la conformité BCBS 239 en :", choices: ["Supprimant le besoin d'un Chief Data Officer", "Offrant une traçabilité native des données et une réconciliation en temps réel", "Remplaçant les modèles VaR par des calculs on-chain", "Évitant les exigences de réconciliation dues à la transparence blockchain"], correct: 1, explanation: "La nature immuable et auditable d'un DLT facilite la traçabilité des données de risque (lineage), améliorant les capacités RDARR requises par BCBS 239.", theme: "BCBS 239", difficulty: "hard" },
                { id: "L2-028", question: "Le risque ESG en Pilier 2 (BCE, 2022) impose aux banques de :", choices: ["Exclure tous les actifs fossiles de leur bilan d'ici 2030", "Intégrer les risques climatiques et environnementaux dans leur gestion des risques et ICAAP", "Publier un rapport carbone mensuel certifié", "Maintenir un ratio vert d'au moins 30% de leurs actifs"], correct: 1, explanation: "La BCE exige depuis 2022 que les banques intègrent les risques ESG (physiques et de transition) dans leurs processus ICAAP, ILAAP et stress tests.", theme: "ESG Risk", difficulty: "medium" },
                { id: "L2-029", question: "Le risque de step-in (Bâle III, 2017) concerne :", choices: ["Le risque qu'une banque soit forcée de soutenir financièrement une entité hors bilan en difficulté", "Le risque de défaut lors du renouvellement d'une facilité de crédit", "La probabilité qu'un emprunteur augmente son tirage sur une ligne de crédit", "Le risque de remboursement anticipé d'un portefeuille de prêts"], correct: 0, explanation: "Le step-in risk: une banque peut être contrainte (pour des raisons réputationnelles) de soutenir des véhicules hors bilan — requiert une analyse de la relation.", theme: "Operational Risk", difficulty: "hard" },
                { id: "L2-030", question: "Le ratio de levier (Leverage Ratio) Bâle III est défini comme :", choices: ["Capital Tier 1 / Total des expositions (bilan + hors bilan)", "CET1 / RWA totaux", "Capital total / Total actif bilantiel", "Tier 2 / actifs pondérés risque de marché"], correct: 0, explanation: "LR = Tier 1 / Total Exposure Measure ≥ 3% (4% pour G-SIBs). Sert de filet de sécurité non-pondéré face aux modèles RWA.", theme: "Capital Adequacy", difficulty: "medium" }
            ]
        },

        3: {
            level: 3, name: "Regulatory Mapping",
            subtitle: "SR 11-7, DORA Art.11, MiCA enforcement, ICT 3rd-party risk",
            theme_color: "#f97316",
            questions: [
                { id: "L3-001", question: "L'article 11 de DORA impose spécifiquement :", choices: ["La certification annuelle des CASP par l'ESMA", "Des tests avancés de résilience opérationnelle (TLPT) pour les entités les plus importantes", "L'interdiction des solutions cloud pour les systèmes critiques financiers", "Un reporting mensuel des incidents ICT au régulateur national"], correct: 1, explanation: "DORA Art.11 instaure les Threat-Led Penetration Tests (TLPT) — tests de résilience avancés obligatoires pour les entités financières désignées par les régulateurs.", theme: "DORA", difficulty: "hard" },
                { id: "L3-002", question: "Sous MiCA, une infraction grave d'un CASP peut entraîner :", choices: ["Uniquement une amende plafonnée à 500 000€", "Le retrait de l'agrément et/ou une astreinte de 5% du CA journalier moyen", "Un avertissement formel sans sanction financière", "La suspension automatique de 30 jours d'activité"], correct: 1, explanation: "MiCA (Art. 111-115) prévoit des sanctions administratives, dont le retrait d'agrément, des astreintes et des amendes pouvant atteindre 12,5% du CA annuel pour les ART.", theme: "MiCA", difficulty: "hard" },
                { id: "L3-003", question: "SR 11-7 (Federal Reserve, 2011) s'applique à :", choices: ["Les crypto-exchanges opérant aux États-Unis", "La gestion et validation des modèles quantitatifs dans les institutions financières supervisées", "Les systèmes de paiement transfrontaliers USD", "La gouvernance des données des banques de dépôt américaines"], correct: 1, explanation: "SR 11-7 (Supervisory Guidance on Model Risk Management) définit les standards de développement, validation et gouvernance des modèles pour les banques Fed-supervisées.", theme: "Model Risk", difficulty: "hard" },
                { id: "L3-004", question: "DORA exige des entités financières un registre d'information ICT contenant :", choices: ["Les coordonnées de tous les fournisseurs cloud utilisés", "Une cartographie complète et à jour de tous les arrangements ICT tiers", "Les logs de toutes les transactions IT sur 5 ans", "Le budget annuel consacré à la cybersécurité"], correct: 1, explanation: "DORA Art.28 impose un registre exhaustif des contrats et dépendances ICT tiers, accessibles à tout moment aux autorités compétentes.", theme: "DORA", difficulty: "medium" },
                { id: "L3-005", question: "Le 'Travel Rule' (FATF Recommendation 16) appliqué aux crypto oblige :", choices: ["Les CASP à envoyer les informations sur l'expéditeur et le bénéficiaire lors de transferts crypto", "Les bourses crypto à publier leurs flux de transactions en temps réel", "Les wallets hardware à s'enregistrer auprès d'une autorité AML", "Les stablecoins à suivre leur backing en temps réel on-chain"], correct: 0, explanation: "Le Travel Rule impose aux VASP/CASP de transmettre les données KYC de l'envoyeur et du receveur lors de transferts ≥ 1000€, alignant le crypto sur les standards SWIFT.", theme: "AML / Travel Rule", difficulty: "medium" },
                { id: "L3-006", question: "L'EBA Guidelines on ICT and Security Risk Management imposent :", choices: ["L'interdiction des solutions SaaS pour les fonctions critiques bancaires", "Des exigences minimales de sécurité, continuité et gouvernance IT pour les institutions financières", "La certification ISO 27001 obligatoire pour toutes les banques UE", "Un ratio maximal de 20% d'externalisation IT"], correct: 1, explanation: "Les Guidelines EBA ICT (2022, remplacées partiellement par DORA) définissent les exigences de sécurité, gestion des incidents, BCM et contrôle des tiers IT.", theme: "EBA Guidelines", difficulty: "medium" },
                { id: "L3-007", question: "MiCA distingue trois catégories d'intermédiaires crypto soumis à agrément :", choices: ["CASP, ART Emitters, E-Money Token Emitters", "VASP, Stablecoin Operators, DeFi Protocols", "Crypto Broker, Crypto Exchange, Crypto Custodian", "ISDA, CCP, CASP"], correct: 0, explanation: "MiCA différencie: (1) CASP pour les services (échange, garde, conseil), (2) ART emitters (tokens adossés à actifs), (3) EMT emitters (e-money tokens référencés à une monnaie).", theme: "MiCA", difficulty: "medium" },
                { id: "L3-008", question: "Le principe de 'proportionnalité' dans DORA signifie :", choices: ["Que toutes les entités financières appliquent les mêmes mesures ICT", "Que les exigences s'adaptent à la taille, complexité et profil de risque de l'entité", "Que les petites entités sont exemptées de DORA", "Que les exigences ICT sont proportionnelles au budget IT"], correct: 1, explanation: "DORA Art.4 applique le principe de proportionnalité: micro-entreprises et petites entités bénéficient de régimes allégés sur certaines exigences.", theme: "DORA", difficulty: "medium" },
                { id: "L3-009", question: "Le règlement eIDAS 2.0 impacte la finance décentralisée en :", choices: ["Imposant une identité numérique vérifiable à tous les wallets crypto UE", "Créant un cadre pour les identités numériques qui peut s'intégrer aux wallets et KYC DeFi", "Interdisant l'usage de pseudonymes sur les blockchains publiques", "Établissant un registre central UE des adresses DeFi"], correct: 1, explanation: "eIDAS 2.0 instaure l'European Digital Identity Wallet — potentiellement intégrable aux protocoles DLT pour un KYC on-chain conforme.", theme: "Digital Identity", difficulty: "hard" },
                { id: "L3-010", question: "La directive AMLD6 (6ème directive AML) élargit la liste des infractions prédicate :", choices: ["En ajoutant la cybercriminalité et les délits environnementaux", "En limitant le champ AML aux seules transactions > 10 000€", "En créant un registre centralisé des bénéficiaires effectifs", "En imposant des sanctions pénales aux compliance officers"], correct: 0, explanation: "AMLD6 harmonise et étend les infractions prédicate (crimes à l'origine du blanchiment), incluant cybercriminalité et crimes environnementaux.", theme: "AML / Travel Rule", difficulty: "hard" },
                { id: "L3-011", question: "Dans DORA, un 'incident ICT majeur' doit être notifié :", choices: ["Dans les 72 heures à l'autorité compétente (rapport initial)", "Dans les 24 heures au CERT national et dans les 72 heures à l'ENISA", "En temps réel à la BCE et à l'EBA simultanément", "Dans les 5 jours ouvrés suivant la détection"], correct: 0, explanation: "DORA (Art.19) impose: rapport initial dans les 4 heures (ou 24 max), rapport intermédiaire dans les 72 heures, rapport final dans le mois.", theme: "DORA", difficulty: "hard" },
                { id: "L3-012", question: "Le règlement MiCA impose aux émetteurs d'ART (Asset-Referenced Tokens) :", choices: ["Un agrément CASP standard sans exigences additionnelles", "Un agrément bancaire complet auprès de la BCE", "Un agrément spécifique avec exigences de réserves, gouvernance et rapport trimestriel", "Une simple déclaration à l'ESMA sans revue préalable"], correct: 2, explanation: "Les émetteurs d'ART (stablecoins adossés à un panier d'actifs) doivent obtenir un agrément spécifique, maintenir des réserves qualifiées et appliquer des règles de gouvernance strictes.", theme: "MiCA", difficulty: "hard" },
                { id: "L3-013", question: "Le DORA Critical ICT Third-Party Provider (CTP) désigne :", choices: ["Tout fournisseur cloud opérant dans l'UE", "Les prestataires ICT dont la défaillance aurait un impact systémique sur plusieurs entités financières", "Les sous-traitants IT d'une banque G-SIB", "Les éditeurs de logiciels de risque supervisés par l'EBA"], correct: 1, explanation: "Les CTPPs (Critical Third-Party Providers) — cloud providers, data analytics, etc. — sont directement supervisés par les ESA sous DORA, avec accès aux locaux et audits.", theme: "DORA", difficulty: "hard" },
                { id: "L3-014", question: "La SFDR (Sustainable Finance Disclosure Regulation) impose aux sociétés de gestion :", choices: ["L'obtention d'un label ESG obligatoire pour tout fonds crypto", "La divulgation des risques ESG et des impacts négatifs sur leurs produits financiers", "L'exclusion obligatoire des actifs carbon-intensifs", "Un reporting crypto séparé sous Article 6, 8 ou 9"], correct: 1, explanation: "SFDR classe les fonds en Articles 6, 8 (promeut des caractéristiques ESG) et 9 (investissement durable). Les risques de durabilité doivent être divulgués.", theme: "ESG Regulation", difficulty: "medium" },
                { id: "L3-015", question: "Le registre des bénéficiaires effectifs (UBO Register) sous AMLD5 :", choices: ["Est accessible uniquement aux autorités judiciaires sur requête", "Est public pour les sociétés et accessible aux entités avec intérêt légitime pour les trusts", "Est géré exclusivement par la BCE", "Concerne uniquement les entreprises dépassant 50M€ de CA"], correct: 1, explanation: "AMLD5 rend le registre UBO des sociétés public, et celui des trusts accessible aux personnes avec intérêt légitime démontrable.", theme: "AML / Travel Rule", difficulty: "medium" },
                { id: "L3-016", question: "Sous DORA, le 'Digital Operational Resilience Testing' inclut obligatoirement :", choices: ["Des stress tests financiers trimestriels", "Des tests de base annuels (vulnérabilité, réseau) et des TLPT périodiques pour entités désignées", "Un red team exercise mensuel sur les systèmes de production", "Un test de reprise PCA complet sur sites secondaires tous les 6 mois"], correct: 1, explanation: "DORA Art.24-27 impose: tests de base obligatoires annuels + TLPT tous les 3 ans minimum pour entités significatives désignées par les autorités.", theme: "DORA", difficulty: "hard" },
                { id: "L3-017", question: "L'obligation de reporting sous Pilier 3 COREP/FINREP est :", choices: ["Trimestrielle pour les grands établissements, annuelle pour les autres", "Mensuelle pour tous les établissements de crédit européens", "Définie uniformément à une fréquence trimestrielle pour tous", "Variable selon le risque: mensuel pour liquidité, trimestriel pour capital, annuel pour rémunération"], correct: 3, explanation: "COREP/FINREP: LCR mensuel, capital/crédit/marché trimestriel, NSFR trimestriel, rémunération et levier annuel — selon le calendrier EBA ITS.", theme: "Regulatory Reporting", difficulty: "hard" },
                { id: "L3-018", question: "Le règlement EMIR (European Market Infrastructure Regulation) s'applique aux :", choices: ["CASP émetteurs de tokens adossés à des matières premières", "Contreparties aux dérivés OTC avec obligations de compensation centrale et de reporting", "Fonds de pension investissant en actifs numériques", "Banques émettant des obligations tokenisées"], correct: 1, explanation: "EMIR impose: compensation centrale des dérivés OTC standardisés via CCP, reporting trade repository, gestion du collatéral et MPOR pour les dérivés non compensés.", theme: "Derivatives Regulation", difficulty: "medium" },
                { id: "L3-019", question: "La MICA impose un 'whitepaper' crypto qui doit contenir obligatoirement :", choices: ["Une projection financière sur 10 ans validée par un commissaire aux comptes", "Les caractéristiques du token, droits des détenteurs, risques, protocole sous-jacent et identité de l'émetteur", "Un prospectus complet au format ESMA Retail Investor Protection", "Uniquement les informations techniques sans données commerciales"], correct: 1, explanation: "Le whitepaper MiCA (Art.5-22) doit couvrir: description émetteur, projet, token, droits, risques, conditions d'offre. Il engage la responsabilité de l'émetteur.", theme: "MiCA", difficulty: "medium" },
                { id: "L3-020", question: "Sous DORA, les clauses contractuelles minimales avec les ICT tiers doivent inclure :", choices: ["Un droit d'audit, des SLA définis, des plans de sortie et des exigences de sécurité", "Uniquement un SLA de disponibilité à 99,9% et une clause de confidentialité", "Une assurance cyber obligatoire souscrite par le prestataire", "Un escrow du code source de toutes les applications externalisées"], correct: 0, explanation: "DORA Art.30 liste les clauses obligatoires: droits d'audit, niveau de service, sécurité des données, continuité, localisation des données, stratégie de sortie.", theme: "DORA", difficulty: "medium" },
                { id: "L3-021", question: "Le CSDR (Central Securities Depositories Regulation) impact les DLT car :", choices: ["Il interdit le règlement-livraison en crypto-actifs", "Il impose que les titres financiers soient conservés dans un CSD agréé, défiant la custody DLT directe", "Il crée un cadre pour les CSDs opérant des blockchains publiques", "Il n'a aucun impact sur les actifs tokenisés"], correct: 1, explanation: "CSDR impose l'enregistrement des valeurs mobilières dans des CSDs agréés — challenge direct pour les tokenized securities détenus en self-custody.", theme: "Securities Regulation", difficulty: "hard" },
                { id: "L3-022", question: "La directive NIS2 (Network and Information Security) impose aux entités essentielles :", choices: ["Un audit de cybersécurité annuel certifié CISA", "Des mesures de sécurité, de gestion des incidents et une obligation de notification des incidents significatifs", "L'hébergement obligatoire sur des serveurs UE", "Un budget cybersécurité minimum de 2% du CA"], correct: 1, explanation: "NIS2 (oct 2024) étend NIS1 à plus de secteurs (dont finance), impose la gestion des risques cyber, notification des incidents (24h/72h/1mois) et sanction des dirigeants.", theme: "Cybersecurity Regulation", difficulty: "medium" },
                { id: "L3-023", question: "Le RGPD (GDPR) en tension avec la blockchain publique pose un problème car :", choices: ["Les blockchains publiques sont interdites dans l'UE sous RGPD", "Le droit à l'effacement ('right to be forgotten') est techniquement incompatible avec l'immuabilité blockchain", "Les validateurs doivent obtenir un consentement de chaque utilisateur", "Les gas fees constituent un traitement non consenti de données personnelles"], correct: 1, explanation: "L'immuabilité blockchain empêche l'effacement effectif de données personnelles — tension fondamentale avec l'Art.17 RGPD, partiellement résolu par le chiffrement ou hachage des données.", theme: "Data Privacy", difficulty: "medium" },
                { id: "L3-024", question: "Le Pilote DLT (Règlement UE 2022/858) crée :", choices: ["Un régime permanent pour les titres tokenisés en UE", "Un régime pilote temporaire permettant d'opérer des infrastructures de marché DLT sous dérogations réglementaires", "Un CSD blockchain obligatoire géré par l'ESMA", "Un fonds de garantie européen pour les holders de titres tokenisés"], correct: 1, explanation: "Le Règlement Pilote DLT crée un bac à sable où des MTF, SS et CSD DLT peuvent opérer avec des dérogations aux règles MiFID/CSDR sur 6 ans.", theme: "DLT Regulation", difficulty: "hard" },
                { id: "L3-025", question: "Sous MiCA, les stablecoins 'significatifs' (ART/EMT significatifs) sont définis par :", choices: ["Un volume de transactions supérieur à 10M€/jour", "Trois critères dont 10M utilisateurs, 5Md€ de valeur ou opérations dans 7 États membres minimum", "Uniquement la capitalisation boursière > 1Md€", "La décision discrétionnaire du Parlement européen"], correct: 1, explanation: "MiCA Art.43: ART/EMT devient 'significatif' si ≥2 des critères: 10M holders, 5Md€ de valeur de réserve, 500M€ de transactions/jour, implantation dans 7 EM min.", theme: "MiCA", difficulty: "hard" },
                { id: "L3-026", question: "Le 'Supplier Code of Conduct' dans une politique ICT DORA-compliant doit couvrir :", choices: ["Uniquement les aspects tarifaires et les pénalités", "Les clauses de sécurité, sous-traitance, droits d'audit et obligations de continuité des prestataires", "Les spécifications techniques des API des systèmes externalisés", "Le niveau de compétence requis des équipes du prestataire"], correct: 1, explanation: "Un SCoC DORA-compliant intègre: sécurité minimale, chaîne de sous-traitance, droits d'audit, notification d'incidents, continuité — engageant la chaîne entière.", theme: "DORA", difficulty: "medium" },
                { id: "L3-027", question: "Le règlement MiCA exempte partiellement :", choices: ["Les stablecoins algorithmiques des exigences de réserves", "Les NFT uniques des obligations de whitepaper si non fongibles", "Les CEX (centralized exchanges) enregistrés avant 2021", "Les DeFi protocols si leur code est open source"], correct: 1, explanation: "MiCA exempte les NFT uniques (non fongibles, sans équivalent) de ses dispositions — mais esta soumis à réévaluation si des séries importantes sont émises.", theme: "MiCA", difficulty: "hard" },
                { id: "L3-028", question: "La directive MiFID II impacte les token securities car :", choices: ["Elle s'applique directement à tous les tokens sans distinction", "Les security tokens (assimilés instruments financiers) tombent sous son champ, gérant marchés et intermédiaires", "Elle exempte les actifs numériques de toute obligation de transparence", "Elle impose une pondération 100% pour tout actif crypto en portefeuille"], correct: 1, explanation: "Un security token est un instrument financier MiFID II si représentant droits similaires (action, créance, dérivé). Cela déclenche prospectus, transparence, reporting.", theme: "Securities Regulation", difficulty: "hard" },
                { id: "L3-029", question: "Sous DORA, la 'stratégie de sortie' (exit strategy) avec un CTP désigne :", choices: ["Le plan de licenciement des équipes IT en cas de faillite", "Le plan permettant de migrer les fonctions critiques vers un autre fournisseur sans interruption majeure", "Le processus d'archivage des données lors de la fin de contrat", "La procédure de résiliation unilatérale en cas d'incident grave"], correct: 1, explanation: "DORA Art.28 impose une exit strategy documentée: capacité de migrer les fonctions critiques, sans dépendance excessive, avec continuité du service — anti lock-in.", theme: "DORA", difficulty: "medium" },
                { id: "L3-030", question: "Le principe de 'substance over form' en régulation financière signifie :", choices: ["Que le fond économique d'un instrument détermine son traitement réglementaire, non sa forme juridique", "Que les banques peuvent choisir la forme juridique la plus avantageuse", "Que les actifs DLT sont exemptés si leur code est publié", "Que MiCA prime sur toute réglementation nationale des États membres"], correct: 0, explanation: "'Substance over form': si un token crypto a les caractéristiques économiques d'une valeur mobilière, il sera traité comme tel, indépendamment du label choisi — position EBA/ESMA.", theme: "Regulatory Principles", difficulty: "hard" }
            ]
        },

        4: {
            level: 4, name: "Infrastructure & Deployment",
            subtitle: "Canton Network, HSM, Node Topology, Cloud ICT, DR/BCP",
            theme_color: "#8b5cf6",
            questions: [
                { id: "L4-001", question: "Le Canton Network se distingue des autres DLT permissioned par :", choices: ["Son utilisation du consensus PoW pour la validation des transactions", "Sa capacité d'interopérabilité native entre sous-réseaux isolés (sub-ledgers) avec confidentialité granulaire", "Son architecture full-public similaire à Ethereum", "Son remplacement des smart contracts par des règles SQL"], correct: 1, explanation: "Canton permet à des entités distinctes d'avoir leurs propres sous-réseaux confidentiels tout en garantissant l'atomicité des transactions cross-ledger — clé pour la finance institutionnelle.", theme: "DLT Infrastructure", difficulty: "hard" },
                { id: "L4-002", question: "Un HSM (Hardware Security Module) en infrastructure DLT sert principalement à :", choices: ["Accélérer le traitement des transactions blockchain", "Protéger les clés cryptographiques privées via un hardware certifié (FIPS 140-2/3)", "Compresser les blocs pour réduire le stockage on-chain", "Valider la conformité AML des transactions en temps réel"], correct: 1, explanation: "Les HSMs assurent la génération, le stockage et l'utilisation sécurisée des clés privées dans un environnement hardware inviolable — obligatoire pour les custodians institutionnels.", theme: "Key Management", difficulty: "medium" },
                { id: "L4-003", question: "La topologie 'hub-and-spoke' dans un réseau DLT institutionnel implique :", choices: ["Tous les nœuds connectés directement entre eux en maillage complet", "Un nœud central (hub) connectant les participants périphériques (spokes) coordonnant les transactions", "Des nœuds organisés en anneaux avec consensus circulaire", "Une architecture sans nœud coordinateur, purement peer-to-peer"], correct: 1, explanation: "Le hub-and-spoke réduit la complexité réseau et centralise la coordination tout en maintenant les bénéfices DLT — choisi par SWIFT GPI et certains réseaux CBDC.", theme: "Network Architecture", difficulty: "medium" },
                { id: "L4-004", question: "Le TLS 1.3 dans une infrastructure DLT est nécessaire pour :", choices: ["Chiffrer les transactions on-chain pour les rendre confidentielles", "Sécuriser les communications entre nœuds du réseau (transport layer)", "Remplacer le mécanisme de consensus cryptographique", "Compresser les headers blockchain pour optimiser la bande passante"], correct: 1, explanation: "TLS 1.3 (avec forward secrecy) chiffre les communications nœud-à-nœud, prévenant l'interception et le man-in-the-middle — exigé par DORA pour les communications ICT critiques.", theme: "Network Security", difficulty: "medium" },
                { id: "L4-005", question: "Dans une architecture de nœuds DLT haute disponibilité, le RPO (Recovery Point Objective) définit :", choices: ["Le temps maximal acceptable pour reprendre les opérations après un incident", "La quantité maximale de données pouvant être perdues (exprimée en temps) lors d'une interruption", "Le nombre de nœuds minimums requis pour maintenir le consensus", "La fréquence des sauvegardes de l'état blockchain"], correct: 1, explanation: "RPO = perte de données maximale tolérée. Un RPO de 0 signifie aucune perte tolérée — atteint via réplication synchrone entre datacenters. Distinct du RTO (temps de reprise).", theme: "Disaster Recovery", difficulty: "medium" },
                { id: "L4-006", question: "La finalité d'une transaction (transaction finality) dans un réseau DLT signifie :", choices: ["La transaction a été broadcastée à tous les nœuds du réseau", "La transaction est irréversible et ne peut être annulée ou réorganisée", "La transaction a atteint la confirmation minimale de 6 blocs", "La transaction a été validée par at least un nœud validateur"], correct: 1, explanation: "La finalité probabiliste (Bitcoin) versus finalité déterministe (Tendermint/PBFT) est critique en finance: une banque ne peut livrer des actifs sans garantie d'irréversibilité.", theme: "Consensus & Finality", difficulty: "hard" },
                { id: "L4-007", question: "Le BFT (Byzantine Fault Tolerance) dans un protocole de consensus garantit :", choices: ["Une performance de 100 000 TPS en réseau distribué", "Le consensus même si jusqu'à 1/3 des nœuds sont défaillants ou malveillants", "L'anonymat complet des validateurs dans un réseau permissioned", "La compatibilité automatique avec les standards ERC-20 et ERC-721"], correct: 1, explanation: "BFT (ex. PBFT, Tendermint, HotStuff) tolère n/3 nœuds byzantins (défaillants ou malveillants). Fondamental pour les réseaux permissioned institutionnels.", theme: "Consensus & Finality", difficulty: "hard" },
                { id: "L4-008", question: "Un smart contract 'upgradeable' via proxy pattern présente un risque car :", choices: ["Il consomme 3x plus de gas qu'un contrat standard", "L'administrateur du proxy peut modifier la logique du contrat, compromettant l'immuabilité", "Il est incompatible avec les standards ERC-20 et ERC-721", "Il nécessite une validation de type TLPT sous DORA"], correct: 1, explanation: "Le proxy pattern (OpenZeppelin) permet des upgrades mais concentre un risque de gouvernance: l'owner du proxy peut changer la logique — risque clé pour les auditeurs institutionnels.", theme: "Smart Contract Architecture", difficulty: "hard" },
                { id: "L4-009", question: "Le 'sharding' dans une blockchain vise à :", choices: ["Diviser les clés privées pour renforcer la sécurité cryptographique", "Partitionner la blockchain en sous-chaînes parallèles pour améliorer la scalabilité", "Comprimer les blocs anciens pour réduire le stockage", "Isoler les transactions confidentielles dans des enclaves sécurisées"], correct: 1, explanation: "Le sharding (ex. Ethereum 2.0, Near) divise l'état et les transactions entre sous-groupes de validateurs (shards), permettant un traitement parallèle et augmentant le débit.", theme: "Scalability", difficulty: "hard" },
                { id: "L4-010", question: "La propriété d'atomicité dans une transaction DLT cross-ledger (ex. DVP tokenisé) signifie :", choices: ["La transaction est indivisible: soit intégralement exécutée, soit intégralement annulée", "La transaction est exécutée en moins d'une milliseconde", "La transaction ne peut impliquer que deux contreparties maximum", "La transaction est automatiquement validée sans intervention humaine"], correct: 0, explanation: "L'atomicité garantit le DVP (Delivery vs Payment): les deux jambes s'exécutent simultanément ou pas du tout, éliminant le risque de règlement — centrale aux cas d'usage institutionnels.", theme: "Transaction Properties", difficulty: "medium" },
                { id: "L4-011", question: "Un 'validator node' dans un réseau permissioned (ex. SWIAT, Canton) doit idéalement être opéré par :", choices: ["Tout participant souhaitant rejoindre le réseau", "Des entités identifiées, légalement responsables et approuvées par la gouvernance du réseau", "Uniquement la banque centrale régulatrice", "Des entités anonymes pour garantir la décentralisation"], correct: 1, explanation: "Dans les réseaux permissioned institutionnels, les validateurs sont des entités agréées (banques, administrations) engagées par contrat — garantissant responsabilité et conformité.", theme: "Network Governance", difficulty: "medium" },
                { id: "L4-012", question: "Le 'zero-knowledge proof' (ZKP) permet en contexte DLT de :", choices: ["Accélérer le consensus en éliminant les nœuds lents", "Prouver la validité d'une information sans révéler l'information elle-même", "Compresser les transactions pour réduire les frais de gas", "Automatiser la conformité AML via des algorithmes on-chain"], correct: 1, explanation: "Les ZKP (ZK-SNARKs, STARKs) permettent de prouver qu'une transaction respecte des règles sans révéler les montants ou parties — privacy-compliant en contexte réglementaire.", theme: "Cryptography", difficulty: "hard" },
                { id: "L4-013", question: "Une architecture 'multi-cloud' pour un nœud DLT institutionnel offre :", choices: ["Une réduction systématique des coûts d'infrastructure de 40%", "La résilience contre la défaillance d'un provider cloud unique et évite le lock-in", "Une meilleure performance de consensus grâce au parallélisme cloud", "Une conformité automatique DORA pour les ICT tiers"], correct: 1, explanation: "Multi-cloud (AWS + Azure + GCP) réduit le risque de dépendance single-provider, améliore la résilience et répond aux exigences DORA sur la concentration des risques ICT.", theme: "Cloud Architecture", difficulty: "medium" },
                { id: "L4-014", question: "Le consensus PBFT (Practical Byzantine Fault Tolerance) est adapté aux institutions car :", choices: ["Il offre un débit illimité avec zéro latence", "Il atteint la finalité déterministe en O(n²) messages entre un nombre limité de nœuds connus", "Il fonctionne avec des milliers de validateurs anonymes", "Il est compatible nativement avec les standards ISO 20022"], correct: 1, explanation: "PBFT garantit la finalité en 2-3 rounds de communication entre nœuds connus — adapté aux consortiums institutionnels où n < 100 nœuds pour des raisons de performance.", theme: "Consensus & Finality", difficulty: "hard" },
                { id: "L4-015", question: "Un 'private channel' dans Hyperledger Fabric permet :", choices: ["De chiffrer toutes les transactions de la blockchain principale", "À un sous-ensemble de membres d'effectuer des transactions confidentielles invisibles aux autres membres", "D'accélérer le consensus en isolant les transactions à haute fréquence", "De créer un sous-réseau indépendant avec son propre token"], correct: 1, explanation: "Les private channels Fabric créent des sous-registres bilatéraux ou multilatéraux avec leurs propres données et transactions — idéal pour la confidentialité des deals OTC.", theme: "DLT Infrastructure", difficulty: "hard" },
                { id: "L4-016", question: "Le 'gas limit' d'un bloc Ethereum détermine :", choices: ["Le prix maximum d'une transaction en ETH", "La quantité totale de calcul (gas) pouvant être exécutée dans le bloc", "Le nombre maximum de transactions par bloc", "Le délai de propagation du bloc dans le réseau"], correct: 1, explanation: "Le gas limit plafonne la charge computationnelle par bloc, contrôlant le throughput. Augmenter le gas limit augmente le débit mais aussi les exigences hardware des nœuds.", theme: "Blockchain Performance", difficulty: "medium" },
                { id: "L4-017", question: "Dans une infrastructure DLT, le 'mempool' désigne :", choices: ["Le stockage distribué des fichiers attachés aux transactions", "La file d'attente des transactions non confirmées en attente d'inclusion dans un bloc", "Le registre des nœuds validateurs du réseau", "La couche de chiffrement des communications P2P"], correct: 1, explanation: "Le mempool (memory pool) stocke temporairement les transactions broadcastées mais non encore minées/validées. Sa congestion fait monter les gas fees.", theme: "Blockchain Performance", difficulty: "easy" },
                { id: "L4-018", question: "Le 'Merkle Tree' dans une blockchain sert à :", choices: ["Compresser les transactions par encodage RLE", "Permettre la vérification rapide et efficace de l'intégrité des transactions sans télécharger l'intégralité du bloc", "Chiffrer les communications entre nœuds validateurs", "Organiser les smart contracts par ordre de priorité d'exécution"], correct: 1, explanation: "Le Merkle Tree permet aux SPV clients (light nodes) de vérifier si une transaction est incluse dans un bloc avec une preuve logarithmique O(log n) au lieu de O(n).", theme: "Cryptography", difficulty: "medium" },
                { id: "L4-019", question: "Un 'oracle TEE' (Trusted Execution Environment) combine :", choices: ["Oracle et HSM pour une signature matérielle des données", "Exécution d'oracle dans un enclave hardware sécurisé (Intel SGX, ARM TrustZone) pour des données attestées et inviolables", "Oracle off-chain avec un smart contract ZKP de vérification", "Un oracle décentralisé avec consensus multi-signature"], correct: 1, explanation: "Les TEE-oracles (ex. Town Crier, Chainlink Functions) exécutent dans des enclaves hardware inviolables, produisant des données signées matériellement — niveau de confiance supérieur.", theme: "Oracle Infrastructure", difficulty: "hard" },
                { id: "L4-020", question: "La latence de finalité d'Ethereum PoS (beacon chain) est approximativement :", choices: ["Sous la milliseconde grâce au consensus parallèle", "12 secondes par slot, finalité économique à ~12 minutes (2 epochs)", "500ms grâce au pipeline de validation Gasper", "Identique au réseau Lightning Network secondes"], correct: 1, explanation: "Post-Merge Ethereum: un slot = 12s, un epoch = 32 slots (~6,4 min). La finalité checkpoint est atteinte après 2 epochs (~12 min), insuffisant pour le HFT institutionnel.", theme: "Consensus & Finality", difficulty: "hard" },
                { id: "L4-021", question: "Le 'cold wallet' versus 'hot wallet' en custody institutionnelle se distingue par :", choices: ["La cold wallet est on-chain, la hot wallet off-chain", "La cold wallet stocke les clés hors ligne (air-gapped), la hot wallet est connectée en permanence au réseau", "La cold wallet utilise des clés ED25519, la hot wallet des clés ECDSA", "La cold wallet est gérée par un HSM, la hot wallet par un TPM"], correct: 1, explanation: "Cold wallets (air-gapped) sont réservées aux grandes réserves institutionnelles (≥95% des actifs). Hot wallets, connectées, gèrent la liquidité opérationnelle quotidienne.", theme: "Key Management", difficulty: "easy" },
                { id: "L4-022", question: "Le 'threshold signature scheme' (TSS) en gouvernance DLT permet :", choices: ["De signer une transaction uniquement si plus de 50% des nœuds sont en ligne", "De distribuer une clé privée entre N parties de sorte qu'un minimum de k parties soit requis pour signer", "D'automatiser les signatures sans intervention humaine", "De créer des clés de session temporaires pour les smart contracts"], correct: 1, explanation: "TSS (t-of-n): la clé privée n'existe jamais en un seul point — chaque participant détient un fragment. Signature valide seulement avec k parties coopérant. Élimine SPOF.", theme: "Key Management", difficulty: "hard" },
                { id: "L4-023", question: "Le protocole ISO 20022 est stratégique pour les DLT institutionnelles car :", choices: ["Il impose l'utilisation de la blockchain pour les paiements SEPA", "Il standardise le format des messages financiers, facilitant l'interopérabilité entre DLT et systèmes legacy", "Il remplace SWIFT par un réseau DLT standardisé d'ici 2025", "Il définit les protocoles de consensus pour les CBDC de la zone euro"], correct: 1, explanation: "ISO 20022 (Rich Data standard) est le nouveau standard mondial de messagerie financière (SEPA, CBDC, SWIFT migration). Les DLT l'intégrant maximisent l'interopérabilité institutionnelle.", theme: "Interoperability", difficulty: "medium" },
                { id: "L4-024", question: "Un 'genesis block' dans une blockchain permissioned contient :", choices: ["La première transaction de l'histoire du réseau", "La configuration initiale du réseau: participants autorisés, paramètres de consensus, politiques de gouvernance", "La liste des smart contracts déployés au lancement", "Le hash du whitepaper fondateur de la blockchain"], correct: 1, explanation: "Le genesis block d'un réseau permissioned encode: identités initiales des membres, paramètres de consensus, géographie des nœuds, politiques d'upgrade — son intégrité est critique.", theme: "DLT Infrastructure", difficulty: "medium" },
                { id: "L4-025", question: "Le 'state pruning' dans une blockchain vise à :", choices: ["Supprimer les smart contracts obsolètes du réseau", "Réduire la taille de la base de données en supprimant les états intermédiaires historiques non nécessaires", "Accélérer le consensus en éliminant les états conflictuels", "Archiver les anciennes transactions sur IPFS"], correct: 1, explanation: "Le pruning supprime les états Merkle intermédiaires anciens pour réduire l'espace disque des nœuds complets — critique pour la viabilité long terme d'un nœud institutionnel.", theme: "Blockchain Performance", difficulty: "hard" },
                { id: "L4-026", question: "Dans une infrastructure DVP (Delivery vs Payment) tokenisée, le 'atomic swap' garantit :", choices: ["La livraison et le paiement dans le même bloc sans risque de règlement", "Un délai constant de T+0 indépendamment de la congestion réseau", "L'anonymat complet des contreparties dans l'échange", "L'absence de frais de transaction pour les échanges inter-institutionnels"], correct: 0, explanation: "L'atomic swap assure que la livraison du titre et le paiement sont indivisibles — soit les deux s'exécutent, soit aucun. Élimine le risque de règlement principal.", theme: "Settlement Infrastructure", difficulty: "medium" },
                { id: "L4-027", question: "Le 'gossip protocol' utilisé pour la propagation des blocs dans P2P signifie :", choices: ["Un protocole de rumeur où chaque nœud propage les nouvelles transactions à ses pairs aléatoirement", "Un protocole de compression de blocs pour réduire la bande passante", "Un algorithme de consensus probabiliste basé sur le vote aléatoire", "Un mécanisme anti-spam filtrant les transactions invalides"], correct: 0, explanation: "Le gossip protocol propagate les blocs/transactions de façon épidémique: chaque nœud partage avec k voisins aléatoires — rapide et résilient sans coordinateur central.", theme: "Network Architecture", difficulty: "medium" },
                { id: "L4-028", question: "Un 'nonce' dans le contexte Ethereum (account nonce) sert à :", choices: ["Prévenir les attaques de double-dépense en ordonnant séquentiellement les transactions d'un compte", "Chiffrer le contenu d'une transaction pour la confidentialité", "Identifier le validateur qui a proposé le bloc", "Mesurer la difficulté de minage en PoW"], correct: 0, explanation: "L'account nonce est un compteur incrémental par adresse ensuite. Chaque transaction doit utiliser le nonce suivant — prévient replay attacks et double-spend.", theme: "Transaction Properties", difficulty: "medium" },
                { id: "L4-029", question: "Le 'event sourcing' pattern dans un système DLT hybride (off-chain + on-chain) signifie :", choices: ["Stocker uniquement les événements on-chain comme source de vérité, les états dérivés étant recalculés", "Utiliser des événements Ethereum pour déclencher des processus off-chain via des listeners", "Archiver tous les logs Solidity events sur IPFS", "Synchroniser les événements DLT avec un bus de messages Kafka"], correct: 0, explanation: "Event sourcing: l'état actuel du système est toujours reconstruible depuis l'historique immuable des événements on-chain — alignement naturel avec la blockchain comme append-only log.", theme: "Architecture Patterns", difficulty: "hard" },
                { id: "L4-030", question: "Le 'canary deployment' dans un déploiement de smart contract institutionnel consiste à :", choices: ["Réaliser un audit de sécurité formel avant tout déploiement en production", "Déployer d'abord sur un sous-ensemble limité du trafic réel pour valider le comportement avant généralisation", "Utiliser un contrat proxy upgradeable pour tous les déploiements", "Déployer simultanément en testnet et mainnet pour validation parallèle"], correct: 1, explanation: "Le canary deployment réduit le risque d'un déploiement majeur: une défaillance du smart contract n'affecte qu'un sous-ensemble limité avant rollback — best practice DevSecOps DLT.", theme: "DevOps & Deployment", difficulty: "hard" }
            ]
        },

        5: {
            level: 5, name: "Strategic Positioning",
            subtitle: "Série A argumentation, VC due diligence, institutional adoption, competitive moat",
            theme_color: "#ec4899",
            questions: [
                { id: "L5-001", question: "Le 'total addressable market' (TAM) pour la tokenization des actifs réels (RWA) est estimé par Larry Fink (BlackRock) à :", choices: ["500 milliards USD d'ici 2030", "10 trillions USD d'ici 2030", "100 milliards USD pour les seuls titres obligataires", "2 trillions USD exclusivement pour l'immobilier institutionnel"], correct: 1, explanation: "Larry Fink (BlackRock, jan 2024): 'Je crois que la prochaine étape sera la tokenisation de chaque action, chaque obligation.' TAM estimé 10T$ — argument central pour les pitches Série A.", theme: "Market Sizing", difficulty: "hard" },
                { id: "L5-002", question: "Le 'moat' (fossé défensif) d'une infrastructure DLT institutionnelle repose principalement sur :", choices: ["La vitesse de traitement (TPS) supérieure à la concurrence", "Les effets de réseau, les coûts de switching élevés et la conformité réglementaire intégrée", "Un brevet technologique sur le mécanisme de consensus", "L'exclusivité d'un accord avec une banque centrale"], correct: 1, explanation: "En B2B institutionnel, le vrai moat vient de: réseau d'institutions connectées (effets réseau), coûts d'intégration élevés (switching costs), et conformité comme barrière à l'entrée.", theme: "Competitive Strategy", difficulty: "hard" },
                { id: "L5-003", question: "Pour une levée Série A d'une startup DLT institutionnelle, le KPI le plus crédible est :", choices: ["Le nombre d'utilisateurs retail de l'application", "Le volume de transactions settléd et le nombre d'institutions live en production", "Le TVL de la version DeFi publique du protocole", "Le nombre de commits GitHub du mois précédent"], correct: 1, explanation: "Les VCs institutionnels mesurent la traction via des métriques B2B: volume réel settle, institutions en prod, ARR, et pipeline qualifié — pas des métriques DeFi retail.", theme: "VC Due Diligence", difficulty: "hard" },
                { id: "L5-004", question: "La 'regulatory capture' d'un concurrent dans le secteur DLT institutionnel signifie :", choices: ["Un régulateur nationalisé devenu actionnaire d'une plateforme DLT", "Un concurrent a obtenu des agréments/accréditations réglementaires en premier, créant une barrière à l'entrée", "Le régulateur impose une technologie DLT spécifique comme standard national", "Une institution financière influence les règlements via le lobbying pour avantager sa plateforme"], correct: 1, explanation: "Dans le B2B réglementé, être le premier à obtenir les accréditations (CASP, Pilote DLT, CSSF) crée une barrière concurrentielle majeure — les banquiers n'expérimentent pas avec deux fournisseurs.", theme: "Competitive Strategy", difficulty: "hard" },
                { id: "L5-005", question: "Le 'land and expand' en vente institutionnelle DLT signifie :", choices: ["Commencer par des marchés émergents avant d'attaquer les marchés développés", "Entrer via un cas d'usage pilote simple puis étendre à d'autres départements et produits de la même institution", "Déployer d'abord on-premise avant de migrer vers le cloud", "Acquérir des clients via des pilotes gratuits puis convertir en contrats payants"], correct: 1, explanation: "Land and expand: un pilote DVP tokenisé avec une banque → expansion aux obligations → extension au département prime brokerage → API enterprise contract. Cycle typique DLT institutionnel.", theme: "Sales Strategy", difficulty: "medium" },
                { id: "L5-006", question: "Dans un pitch Série A DLT institutionnel, l' 'unfair advantage' le plus convaincant est :", choices: ["Un algorithme de consensus propriétaire breveté", "L'équipe fondatrice avec expérience combinée en banque d'investissement, régulation et ingénierie DLT", "Un partenariat avec un influenceur crypto mainstream", "Une levée de fonds seed supérieure à la concurrence"], correct: 1, explanation: "Les VCs institutionnels valorisent les équipes avec track record réel: ex-banquiers comprenant les contraintes, ex-régulateurs navigant la conformité, ingénieurs ayant déployé en prod.", theme: "VC Due Diligence", difficulty: "medium" },
                { id: "L5-007", question: "Le 'go-to-market' (GTM) optimal pour une plateforme DLT de tokenisation obligataire commence par :", choices: ["Un ICO public pour lever du capital initial", "Un pilote bilatéral avec une banque partenaire sur une émission réelle puis une expansion consortium", "Une API publique permettant à n'importe quelle institution de s'intégrer", "Un partenariat avec un exchange crypto retail pour la distribution"], correct: 1, explanation: "Le GTM gagnant: pilote bilatéral avec une banque référente → démonstration de valeur réelle → expansion consortium → réseau institutionnel. Évite le cold start problem.", theme: "Go-To-Market", difficulty: "medium" },
                { id: "L5-008", question: "Le 'churn rate' critique à surveiller pour une plateforme DLT institutionnelle en phase de croissance est :", choices: ["Le taux de désabonnement mensuel des utilisateurs retail", "Le taux de non-renouvellement des contrats cadre institutionnels (MRA/MSA) annuels", "Le nombre de transactions abandonnées en cours d'exécution", "Le pourcentage de nœuds validateurs ayant quitté le réseau"], correct: 1, explanation: "En SaaS institutionnel, le churn sur les MRA/MSA (Master Repository/Service Agreements) annuels est le KPI de rétention clé — un institutional churn > 5% est rédhibitoire pour un VC Série A.", theme: "Business Metrics", difficulty: "hard" },
                { id: "L5-009", question: "Le positioning 'infrastructure > application' dans le secteur DLT institutionnel signifie :", choices: ["Construire uniquement des blockchains publiques et non des dApps", "Cibler les banques comme clients en fournissant la couche de base sur laquelle elles construisent leurs produits", "Éviter de développer des fonctionnalités applicatives et se concentrer sur l'API", "Concurrencer SWIFT et TARGET2 directement"], correct: 1, explanation: "Le positionnement infrastructure (B2B2B) capture plus de valeur à long terme et crée des switching costs élevés — les banques construisent sur vous et deviennent dépendantes.", theme: "Competitive Strategy", difficulty: "medium" },
                { id: "L5-010", question: "La 'valuation' en pre-money Série A d'une startup DLT institutionnelle est typiquement basée sur :", choices: ["Un multiple de 100x les revenus récurrents annuels (ARR)", "Un mix de comparable market (multiples secteur fintech), team quality, et traction (ARR, pipeline qualifié)", "La capitalisation boursière de tokens éventuellement émis", "Uniquement le montant levé en seed round précédemment"], correct: 1, explanation: "En Série A institutionnel: valuation = comparable (10-20x ARR fintech B2B) + prime équipe + prime marché + discount risque exécution. Pas de token multiple pour les VCs traditionnels.", theme: "VC Due Diligence", difficulty: "hard" },
                { id: "L5-011", question: "Le concept de 'T+0 settlement' comme proposition de valeur DLT pour une banque d'investissement signifie :", choices: ["Les transactions sont visibles en temps réel mais settlées à T+2 comme actuellement", "Le règlement-livraison est atomique et instantané, éliminant le risque de contrepartie et libérant le capital", "Les transactions sont pré-financées par un smart contract collatéralisé", "Le back-office traite les confirmations en 0 seconde via automatisation RPA"], correct: 1, explanation: "T+0 atomique libère le capital bloqué pendant 2 jours (T+2 actuel → T+0), réduit le besoin en collatéral de marge, et élimine le risque de contrepartie — économie quantifiable pour les banques.", theme: "Value Proposition", difficulty: "medium" },
                { id: "L5-012", question: "Le 'network effect' d'une plateforme DLT institutionnelle de settlement se renforce car :", choices: ["Plus de validateurs signifie plus de sécurité et donc plus de confiance", "Chaque institution supplémentaire augmente la valeur pour toutes les autres via plus de contreparties accessibles", "Plus d'utilisateurs permet de réduire les coûts d'infrastructure via les économies d'échelle", "La réputation de la plateforme croît proportionnellement au nombre de transactions"], correct: 1, explanation: "Network effect classique: si 10 banques sont connectées, 45 paires de transactions possibles. Si 100: 4950 paires. La valeur du réseau croît en O(n²) — Metcalfe's Law appliquée au settling.", theme: "Network Effects", difficulty: "medium" },
                { id: "L5-013", question: "Un 'Letter of Intent' (LOI) institutionnel dans un pipeline commercial DLT :", choices: ["Est un contrat exécutoire engageant financièrement l'institution signataire", "Est une déclaration d'intention avec une valeur probatoire limitée mais signalant un intérêt sérieux", "Remplace le contrat MSA dans les relations bilatérales", "Garantit automatiquement une conversion en client payant dans les 6 mois"], correct: 1, explanation: "Un LOI/MOU institutionnel signale l'intent mais n'est pas contraignant financièrement. Sa valeur est dans le signal de traction pour les VCs — différencier LOI de MSA signé est critique.", theme: "Sales Strategy", difficulty: "medium" },
                { id: "L5-014", question: "La stratégie de 'regulatory arbitrage' d'une fintech DLT consiste à se domicilier :", choices: ["Dans le pays le plus proche de ses clients cibles pour optimiser la fiscalité", "Dans une juridiction offrant un cadre réglementaire favorable (sandbox, agrément accéléré) tout en accédant aux marchés cibles", "Dans n'importe quelle juridiction de l'UE pour bénéficier du passeport MiCA", "Dans un centre offshore pour éviter toute régulation"], correct: 1, explanation: "Les fintechs DLT choisissent Luxembourg (CSSF agile), Singapour (MAS sandbox), ou BVI/Cayman puis rapatrient — le passeport MiCA rend désormais cette stratégie moins avantageuse.", theme: "Regulatory Strategy", difficulty: "hard" },
                { id: "L5-015", question: "Le 'burn rate' mensuel optimal pour une startup DLT institutionnelle en Série A (18 mois runway) avec 5M€ levés est :", choices: ["833 000€/mois sans contrainte de profitabilité", "~277 000€/mois pour maintenir 18 mois de runway", "1M€/mois pour scaler rapidement", "Indéterminé car dépend uniquement du pricing des contrats signés"], correct: 1, explanation: "5M€ / 18 mois = ~277k€/mois. Un burn rate raisonnable pour une équipe core (tech, compliance, BD) sans sur-embauche pré-traction — signal de discipline financière pour le prochain VC.", theme: "Business Metrics", difficulty: "medium" },
                { id: "L5-016", question: "Le 'product-market fit' (PMF) pour une plateforme DLT institutionnelle est atteint quand :", choices: ["Plus de 1000 utilisateurs ont créé un compte sur la plateforme", "Les clients institutionnels renouvellent et élargissent leurs contrats spontanément et recommandent la plateforme", "La plateforme atteint 1M€ de MRR", "Un article Bloomberg confirme la traction de la startup"], correct: 1, explanation: "PMF institutionnel: renouvellement + expansion organique + NPS élevé chez les decision makers. Un seul client institutionnel fidèle vaut plus que 1000 utilisateurs désengagés.", theme: "Product Strategy", difficulty: "medium" },
                { id: "L5-017", question: "Le principal '10x problem' que doit résoudre une plateforme DLT de tokenisation obligataire est :", choices: ["Diviser les frais de transaction par 10 par rapport aux obligations classiques", "Réduire le time-to-market d'émission de semaines à heures tout en éliminant les intermédiaires non-créateurs de valeur", "Multiplier par 10 la liquidité des obligations en permettant la fragmentation", "Augmenter de 10x le rendement pour les investisseurs finaux"], correct: 1, explanation: "Le 10x problem en tokenisation obligataire: émission en 3 semaines → 24h, 10+ intermédiaires → smart contracts, réconciliation manuelle → automatique. C'est la proposition de valeur fondamentale.", theme: "Value Proposition", difficulty: "hard" },
                { id: "L5-018", question: "L'argument de 'first mover advantage' dans le DLT institutionnel est tempéré par :", choices: ["L'impossibilité de breveter les protocoles blockchain", "La réalité que les institutions adoptent lentement et que le 'fast follower' avec plus de resources peut rattraper", "Le fait que les VCs préfèrent investir dans des marchés matures", "La difficulté d'obtenir une valorisation élevée pour un premier entrant"], correct: 1, explanation: "En B2B institutionnel, le FMA compte moins qu'en B2C: les sales cycles sont longs (12-24 mois), laissant à des fast followers bien financés le temps de rattraper — le vrai avantage est l'ECMI (Early Customer Moat via Integration).", theme: "Competitive Strategy", difficulty: "hard" },
                { id: "L5-019", question: "Le 'Board Governance' optimal pour une startup DLT institutionnelle cherchant une levée Série A inclut :", choices: ["Uniquement les fondateurs pour maintenir l'agilité décisionnelle", "Fondateurs, 1-2 VCs, et 1 independent director avec expertise réglementaire ou institutionnelle", "Un conseil d'administration de 10 personnes pour maximiser la diversité", "Aucun board formel jusqu'au Série B"], correct: 1, explanation: "Un board 5-7 personnes: 2 fondateurs + 2 VCs lead + 1 independent (ex-régulateur, ex-CDO banque) → crédibilité institutionnelle + gouvernance sans blocage décisionnel.", theme: "Corporate Governance", difficulty: "medium" },
                { id: "L5-020", question: "Dans une due diligence VC sur une startup DLT institutionnelle, le red flag majeur est :", choices: ["Un fondateur ayant travaillé dans une banque pendant plus de 10 ans", "Un pipeline commercial basé sur des LOI non convertis en contrats payants depuis plus de 12 mois", "Un CTO ayant contribué à des projets open source blockchain", "Un ARR inférieur à 500k€ au moment du pitch"], correct: 1, explanation: "Un pipeline bloqué en LOI/POC depuis >12 mois signale soit un problème de PMF, soit un sales cycle institutionnel mal qualifié — red flag clé car les VCs modélisent la conversion.", theme: "VC Due Diligence", difficulty: "hard" },
                { id: "L5-021", question: "La stratégie de 'partnerships as distribution' pour une startup DLT institutionnelle consiste à :", choices: ["Vendre exclusivement via des intégrateurs systèmes pour éviter une force de vente directe", "Utiliser des partenariats avec des acteurs établis (SWIFT, grandes banques, consultants) comme canal d'acquisition", "Créer un programme de parrainage pour les institutions clientes", "Distribuer la plateforme gratuitement pour atteindre une masse critique"], correct: 1, explanation: "SWIFT, Accenture, Deloitte, banques dépositaires (BNP Paribas Securities Services) peuvent distribuer la solution à leur base clients institutionnels — accélère massivement le GTM sans cost of sale élevé.", theme: "Go-To-Market", difficulty: "medium" },
                { id: "L5-022", question: "Le 'stickiness' d'une plateforme DLT institutionnelle est mesuré principalement par :", choices: ["Le nombre de connexions quotidiennes à l'interface utilisateur", "Le niveau d'intégration API avec les systèmes back-office clients et le volume de données historiques cumulées", "Le NPS (Net Promoter Score) des utilisateurs finaux", "La fréquence des mises à jour de la plateforme"], correct: 1, explanation: "Plus un client a intégré la plateforme dans ses workflows (CBS, SWIFT, custodian), créé des templates et accumulé des données historiques, plus le coût de migration augmente — vrai stickiness institutionnel.", theme: "Business Metrics", difficulty: "hard" },
                { id: "L5-023", question: "Le 'FOMO institutionnel' comme driver d'adoption DLT se manifeste par :", choices: ["Les institutions adoptant la DeFi pour ne pas rater la hausse des tokens", "Les directeurs innovation accélérant leurs POC DLT après que des concurrents directs annoncent des pilotes réussis", "Les banques centrales forçant les adoptions via réglementation", "Les investisseurs particuliers demandant des produits tokenisés à leur banque"], correct: 1, explanation: "Après JPMorgan Onyx, Goldman Digital Assets, Société Générale FORGE — les banques retardataires subissent une pression interne pour démontrer une stratégie DLT, créant une fenêtre d'opportunité.", theme: "Market Dynamics", difficulty: "medium" },
                { id: "L5-024", question: "Le pricing optimal pour un SaaS DLT institutionnel utilise généralement :", choices: ["Un abonnement mensuel fixe identique pour tous les clients", "Un modèle hybride: infrastructure fee fixe (SLA garanti) + volume fee (% de notionnel settled)", "Un modèle freemium: gratuit jusqu'à 100 transactions/mois", "Un pricing unique par transaction indépendant du volume"], correct: 1, explanation: "Hybride fixe + variable: l'infrastructure fee garantit le MRR (prévisibilité pour le VC), le volume fee capture la valeur créée proportionnellement à l'usage — alignement entre pricing et valeur.", theme: "Business Metrics", difficulty: "medium" },
                { id: "L5-025", question: "Le concept de 'DLT ROI' dans un business case bancaire se calcule généralement sur :", choices: ["Le seul gain en frais de transaction économisés", "Les économies de back-office (réconciliation, fails), libération de capital (T+0 vs T+2), réduction des erreurs et nouveaux revenus", "Uniquement les revenus additionnels générés par les nouveaux produits tokenisés", "Le coût d'opportunité comparé à une solution cloud classique"], correct: 1, explanation: "ROI DLT institutionnel typique: réconciliation savings (3-5 FTE), capital libéré T+0 (% du notionnel × cost of capital), réduction fails (€/fail), nouvelles émissions → total 15-40x les coûts de la plateforme à 3 ans.", theme: "Value Proposition", difficulty: "hard" },
                { id: "L5-026", question: "Le 'time to value' (TTV) critique pour un client institutionnel adoptant une plateforme DLT est :", choices: ["Sous 24 heures via une interface self-service", "3-6 mois pour une intégration technique complète et le premier cas d'usage live en production", "12-18 mois imposés par les cycles de validation réglementaire", "Indifférent car les banques planifient sur des horizons de 3-5 ans"], correct: 1, explanation: "TTV 3-6 mois est le sweet spot: assez rapide pour démontrer la valeur avant le prochain budget review, assez long pour une vraie intégration. Au-delà de 9 mois = risque d'annulation projet.", theme: "Product Strategy", difficulty: "medium" },
                { id: "L5-027", question: "L'argument 'DCM institutionnel comme infrastructure critique' dans un pitch Série A signifie :", choices: ["DCM veut devenir une Banque Centrale Digitale", "La plateforme ambitionne d'être une couche d'infrastructure dont les banques ne peuvent plus se passer, comme SWIFT", "DCM est structurée comme une infrastructure publique subventionnée par les États", "La plateforme sera régulée comme une SIFI (Systemically Important Financial Institution)"], correct: 1, explanation: "Le positionnement 'infrastructure critique' = pricing power, switching costs élevés, moat réglementaire. Comparable à Bloomberg Terminal, SWIFT, ou Broadridge dans leurs secteurs respectifs.", theme: "Competitive Strategy", difficulty: "hard" },
                { id: "L5-028", question: "Le 'secondary market risk' pour une startup DLT institutionnelle pré-IPO est :", choices: ["Le risque que les tokens émis perdent de la valeur sur les exchanges", "Le risque que des fonds de VC revendent leurs parts à des acquéreurs non-alignés via des secondary transactions", "Le risque que des concurrents copient l'interface utilisateur", "Le risque réglementaire lié au statut de securities des parts de la startup"], correct: 1, explanation: "Les secondary transactions VC (Forge, Carta, NPM) permettent à des LPs de sortir et à de nouveaux investisseurs d'entrer — risque de dilution de focus ou d'entrée d'acteurs non-alignés avec la vision.", theme: "VC Due Diligence", difficulty: "hard" },
                { id: "L5-029", question: "Le 'institutional adoption cycle' pour le DLT suit le modèle de Gartner Hype Cycle pour les entreprises en :", choices: ["Innovation Trigger → Pic d'attentes → Creux de désillusion → Pente d'illumination → Plateau de productivité", "Adoption rapide → Saturation → Déclin → Remplacement technologique", "Réglementation → Pilote → Production → Scale", "Aucun modèle reconnu n'est applicable à l'adoption institutionnelle"], correct: 0, explanation: "En 2024-2025, le DLT institutionnel est entre le Creux de désillusion et la Pente d'illumination — post-hype blockchain 2017-2019, maintenant cas d'usage réels en production chez JPMorgan, SocGen, HSBC.", theme: "Market Dynamics", difficulty: "medium" },
                { id: "L5-030", question: "Le 'exit hypothesis' optimal pour les investisseurs d'une startup DLT institutionnelle Série A est :", choices: ["IPO sur le Nasdaq dans les 18 mois suivant la levée", "Acquisition stratégique par un acteur établi (SWIFT, Broadridge, Euroclear, grande banque) ou IPO à 5-7 ans", "Émission de tokens propres convertibles en equity", "Rachat par les fondateurs via un management buyout"], correct: 1, explanation: "Les exits réalistes: M&A stratégique (FIS, Broadridge, DTCC, une grande banque cherchant une brique DLT propriétaire) ou IPO si scale atteint. Le token exit est incompatible avec un VC institutionnel traditionnel.", theme: "VC Due Diligence", difficulty: "hard" }
            ]
        },
        6: {
            level: 6, name: "DeFi & RWA Strategies",
            subtitle: "Decentralized Finance, Real World Asset Tokenization, Institutional Use Cases",
            theme_color: "#14b8a6",
            questions: [
                {
                                "id": "L6-001",
                                "question": "What is the core pricing mechanism of a standard Automated Market Maker (AMM)?",
                                "choices": [
                                                "Central Limit Order Books (CLOB)",
                                                "Constant product formula (x * y = k)",
                                                "Dutch auctions",
                                                "Algorithmic pegging to fiat"
                                ],
                                "correct": 1,
                                "explanation": "AMMs rely on liquidity pools and a mathematical formula, typically x * y = k, to automatically balance assets and determine prices without needing a counterparty.",
                                "theme": "DeFi Mechanics",
                                "difficulty": "medium"
                },
                {
                                "id": "L6-002",
                                "question": "In the context of Tokenized Real World Assets (RWAs), what role does an SPV (Special Purpose Vehicle) usually play?",
                                "choices": [
                                                "It is a smart contract that burns tokens",
                                                "It holds the legal title to the physical asset being tokenized off-chain",
                                                "It functions as a crypto exchange for the tokens",
                                                "It acts as a decentralized oracle"
                                ],
                                "correct": 1,
                                "explanation": "An SPV is a legal entity created specifically to hold the traditional asset (like real estate or bonds), bridging the gap between off-chain legal rights and on-chain tokens.",
                                "theme": "RWA Structuring",
                                "difficulty": "hard"
                },
                {
                                "id": "L6-003",
                                "question": "What is 'Impermanent Loss' in Decentralized Finance?",
                                "choices": [
                                                "A permanent loss of funds due to a smart contract hack",
                                                "The temporary loss of value when providing liquidity to an AMM compared to simply holding the assets",
                                                "A fee charged by the network for failed transactions",
                                                "The depreciation of a stablecoin against the US Dollar"
                                ],
                                "correct": 1,
                                "explanation": "Impermanent loss occurs when the price ratio of deposited assets changes after deposit. It is 'impermanent' because the loss is only realized if the assets are withdrawn at the new price ratio.",
                                "theme": "DeFi Risks",
                                "difficulty": "hard"
                },
                {
                                "id": "L6-004",
                                "question": "Which standard is predominantly used on Ethereum for representing non-fungible Real World Assets (like a specific property)?",
                                "choices": [
                                                "ERC-20",
                                                "ERC-721 / ERC-1155",
                                                "ERC-4337",
                                                "ERC-3643"
                                ],
                                "correct": 1,
                                "explanation": "ERC-721 and ERC-1155 are the standards for non-fungible tokens, ensuring each token represents a unique asset, which is ideal for distinct RWAs like real estate or fine art.",
                                "theme": "Token Standards",
                                "difficulty": "medium"
                },
                {
                                "id": "L6-005",
                                "question": "What is the primary function of the ERC-3643 (T-REX) standard?",
                                "choices": [
                                                "To create meme coins with high liquidity",
                                                "To establish universally compliant permissioned security tokens",
                                                "To facilitate cross-chain bridging",
                                                "To standardize NFT metadata"
                                ],
                                "correct": 1,
                                "explanation": "ERC-3643 is tailored for security tokens, embedding compliance rules (like KYC/AML checks) directly into the token transfer functions via decentralized identity systems.",
                                "theme": "Compliance Standards",
                                "difficulty": "hard"
                },
                {
                                "id": "L6-006",
                                "question": "How do Flash Loans differ from traditional loans?",
                                "choices": [
                                                "They require 150% over-collateralization",
                                                "They are uncollateralized but must be borrowed and repaid within the same blockchain transaction",
                                                "They are only available to institutional investors",
                                                "They take several days to settle"
                                ],
                                "correct": 1,
                                "explanation": "Flash loans allow users to borrow massive amounts of capital without collateral, provided the loan is returned (with fees) in the exact same transaction block. If not, the transaction reverts.",
                                "theme": "DeFi Instruments",
                                "difficulty": "medium"
                },
                {
                                "id": "L6-007",
                                "question": "In DeFi lending protocols (e.g., Aave), what triggers a liquidation?",
                                "choices": [
                                                "The borrower manually closes their account",
                                                "The Health Factor of the loan drops below 1 due to collateral depreciation",
                                                "The protocol upgrades its smart contracts",
                                                "Interest rates reach a predefined ceiling"
                                ],
                                "correct": 1,
                                "explanation": "Liquidations occur automatically when the value of the collateral falls below the required threshold (Health Factor < 1), allowing liquidators to buy the collateral at a discount to repay the debt.",
                                "theme": "DeFi Risk Management",
                                "difficulty": "medium"
                },
                {
                                "id": "L6-008",
                                "question": "What is the concept of 'Composability' in DeFi?",
                                "choices": [
                                                "The ability to compose legal contracts off-chain",
                                                "The highly interoperable nature of smart contracts, allowing them to be combined like 'money legos'",
                                                "The algorithm used to compose new blocks",
                                                "The process of wrapping a token to move it to another chain"
                                ],
                                "correct": 1,
                                "explanation": "Composability allows different DeFi protocols to interact seamlessly, enabling complex financial products to be built by plugging existing protocols together.",
                                "theme": "DeFi Architecture",
                                "difficulty": "easy"
                },
                {
                                "id": "L6-009",
                                "question": "Which of the following is a primary oracle risk for DeFi protocols?",
                                "choices": [
                                                "The oracle returning a historically accurate but outdated price",
                                                "The oracle network demanding too much gas",
                                                "A single oracle node being manipulated to feed incorrect asset prices, triggering cascading liquidations",
                                                "Oracles refusing to connect to institutional APIs"
                                ],
                                "correct": 2,
                                "explanation": "Since smart contracts execute blindly based on data, a manipulated oracle can artificially trigger liquidations or bad loans, representing a massive systemic risk.",
                                "theme": "Oracle Risks",
                                "difficulty": "hard"
                },
                {
                                "id": "L6-010",
                                "question": "Tokenized US Treasuries act in the crypto ecosystem primarily to:",
                                "choices": [
                                                "Bypass SEC regulations",
                                                "Provide a native yield-bearing alternative to fiat-backed stablecoins",
                                                "Facilitate illicit cross-border transfers",
                                                "Replace Bitcoin as a store of value"
                                ],
                                "correct": 1,
                                "explanation": "Tokenized US Treasuries bring 'risk-free' real-world yield on-chain, offering investors a compliant, yield-generating alternative to 0%-yield stablecoins like USDC or USDT.",
                                "theme": "RWA Use Cases",
                                "difficulty": "medium"
                },
                {
                                "id": "L6-011",
                                "question": "What is 'Yield Farming'?",
                                "choices": [
                                                "Staking tokens to secure a Proof of Stake network",
                                                "Maximizing returns by leveraging multiple DeFi protocols to earn interest and token rewards",
                                                "Tokenizing agricultural assets",
                                                "Buying and holding Bitcoin for a long period"
                                ],
                                "correct": 1,
                                "explanation": "Yield farming involves strategically moving assets across different liquidity pools and lending protocols to maximize total yield, often combining standard interest with governance token rewards.",
                                "theme": "DeFi Strategies",
                                "difficulty": "medium"
                },
                {
                                "id": "L6-012",
                                "question": "A protocol utilizing a 'veToken' (voter-escrowed token) model is attempting to:",
                                "choices": [
                                                "Increase liquidity fragmentation",
                                                "Align long-term incentives by giving more voting power and yield to users who lock their tokens longer",
                                                "Bypass standard SEC security classifications",
                                                "Create an algorithmic stablecoin"
                                ],
                                "correct": 1,
                                "explanation": "Pioneered by Curve, the veToken model requires users to lock up their tokens (e.g., up to 4 years) to gain voting power and boosted yields, heavily discouraging short-term mercenary capital.",
                                "theme": "Tokenomics",
                                "difficulty": "hard"
                },
                {
                                "id": "L6-013",
                                "question": "What is the primary legal challenge facing the tokenization of real estate?",
                                "choices": [
                                                "The lack of fractionalization technology",
                                                "Synchronizing on-chain token transfers with off-chain land registry updates to ensure legal finality",
                                                "Finding blockchains fast enough to process the transactions",
                                                "The inability to accept stablecoins for payment"
                                ],
                                "correct": 1,
                                "explanation": "Blockchain transfers are instant, but legal ownership of real estate depends on local land registries. Keeping the on-chain token and the off-chain legal reality perfectly synchronized is the core friction.",
                                "theme": "RWA Legal Risks",
                                "difficulty": "hard"
                },
                {
                                "id": "L6-014",
                                "question": "What is a 'Synthetic Asset' in DeFi?",
                                "choices": [
                                                "An asset backed 1:1 by physical gold",
                                                "A tokenized representation that tracks the price of another asset without requiring physical backing of that asset",
                                                "A completely fake token designed to scam investors",
                                                "An asset exclusively created by a Central Bank"
                                ],
                                "correct": 1,
                                "explanation": "Synthetics (like those on Synthetix) use over-collateralization of native crypto assets to track the price of off-chain assets (stocks, commodities) via oracle price feeds, offering exposure without physical replication.",
                                "theme": "DeFi Instruments",
                                "difficulty": "hard"
                },
                {
                                "id": "L6-015",
                                "question": "How does 'MEV' (Maximal Extractable Value) impact DeFi users?",
                                "choices": [
                                                "It lowers their transaction fees",
                                                "It can result in users getting worse prices through 'sandwich attacks' and front-running",
                                                "It guarantees their transactions are private",
                                                "It acts as an insurance fund against hacks"
                                ],
                                "correct": 1,
                                "explanation": "MEV refers to the profit validators or searchers can make by reordering, including, or excluding transactions within a block, often at the expense of regular users via front-running.",
                                "theme": "DeFi Risks",
                                "difficulty": "hard"
                },
                {
                                "id": "L6-016",
                                "question": "When an institution tokenizes a fund (e.g., BlackRock's BUIDL), what is a key benefit?",
                                "choices": [
                                                "It permanently hides user identities",
                                                "Instant 24/7 settlement, fractional ownership, and automated dividend distribution",
                                                "It removes the need for any underlying collateral",
                                                "It completely bypasses KYC requirements"
                                ],
                                "correct": 1,
                                "explanation": "Tokenized funds offer operational hyper-efficiency, allowing for T+0 settlement speeds, automated smart-contract dividend payouts, and access to a broader, global liquidity base.",
                                "theme": "Institutional DeFi",
                                "difficulty": "medium"
                },
                {
                                "id": "L6-017",
                                "question": "What defines a 'Permissioned DeFi' protocol?",
                                "choices": [
                                                "It is deployed on a private blockchain",
                                                "It uses public protocols like Aave but integrates KYC/AML gates at the smart contract or UI level (e.g., Aave ARC)",
                                                "It only trades algorithmic stablecoins",
                                                "It requires permission from anonymous DAO consensus to use"
                                ],
                                "correct": 1,
                                "explanation": "Permissioned (or 'KYC'd') DeFi runs on public chains but restricts interaction (supplying, borrowing) to whitelisted, KYC-verified addresses to comply with institutional compliance rules.",
                                "theme": "Institutional DeFi",
                                "difficulty": "medium"
                },
                {
                                "id": "L6-018",
                                "question": "Why is 'Liquidity Fragmentation' considered a major issue in the current DeFi landscape?",
                                "choices": [
                                                "It concentrates too much power in a single exchange",
                                                "Capital is split across multiple Layer 1s and Layer 2s, leading to higher slippage and inefficient markets",
                                                "It causes smart contracts to compile incorrectly",
                                                "It forces users to hold too many different stablecoins"
                                ],
                                "correct": 1,
                                "explanation": "As the ecosystem grows across various rollups and alternate L1s, deep liquidity is fractured, preventing large institutional trades without severe price impact (slippage).",
                                "theme": "Market Structure",
                                "difficulty": "hard"
                },
                {
                                "id": "L6-019",
                                "question": "In RWA tokenization, what does the term 'Bankruptcy Remoteness' mean?",
                                "choices": [
                                                "The tokens cannot drop to zero value",
                                                "The SPV holding the asset is legally structured so that if the parent tokenization company goes bankrupt, the underlying asset is protected for token holders",
                                                "The blockchain cannot be shut down by bankruptcy courts",
                                                "The underlying asset is heavily leveraged"
                                ],
                                "correct": 1,
                                "explanation": "Bankruptcy remoteness ensures that the token holders' claim to the real-world asset is secure and ring-fenced, even if the tech provider or issuer goes into liquidation.",
                                "theme": "RWA Structuring",
                                "difficulty": "hard"
                },
                {
                                "id": "L6-020",
                                "question": "What is the primary vulnerability of Cross-Chain Bridges in DeFi?",
                                "choices": [
                                                "They are too slow for retail users",
                                                "They concentrate massive amounts of locked collateral in complex smart contracts, making them prime targets for exploits",
                                                "They only support ERC-20 tokens",
                                                "They require centralized KYC approvals"
                                ],
                                "correct": 1,
                                "explanation": "Bridges use a 'lock and mint' mechanism. If a hacker finds a flaw in the bridge's smart contract on the source chain, they can drain the collateral, rendering the wrapped tokens on the destination chain worthless.",
                                "theme": "DeFi Risks",
                                "difficulty": "medium"
                },
                {
                                "id": "L6-021",
                                "question": "What is a 'Liquid Staking Derivative' (LSD) like Lido's stETH?",
                                "choices": [
                                                "A token representing a stock on the NASDAQ",
                                                "A token that represents staked ETH, providing liquidity to the staker while still earning staking rewards",
                                                "An algorithmic stablecoin linked to ETH",
                                                "A governance token for a Layer 2 network"
                                ],
                                "correct": 1,
                                "explanation": "LSDs solve the capital inefficiency of staking. Instead of locking up ETH, users receive a derivative token (stETH) they can use in DeFi while the underlying ETH secures the network and accrues yield.",
                                "theme": "DeFi Instruments",
                                "difficulty": "hard"
                },
                {
                                "id": "L6-022",
                                "question": "Which of the following best describes 'Real Yield' in DeFi?",
                                "choices": [
                                                "Yield paid exclusively in fiat currency in a bank account",
                                                "Yield generated from actual protocol revenue (e.g., trading fees) rather than inflationary token emissions",
                                                "Yield guaranteed by a central bank",
                                                "Yield derived from algorithmic stablecoin arbitrage"
                                ],
                                "correct": 1,
                                "explanation": "The 'Real Yield' narrative shifted focus away from artificially high APYs driven by printing governance tokens, towards sustainable models where yield comes from genuine organic usage fees.",
                                "theme": "Tokenomics",
                                "difficulty": "medium"
                },
                {
                                "id": "L6-023",
                                "question": "How do Decentralized Identity (DID) systems interact with DeFi and RWAs?",
                                "choices": [
                                                "They replace traditional wallets with email addresses",
                                                "They allow users to prove compliance (like KYC) via verifiable credentials without exposing underlying personal data to every protocol",
                                                "They publicly broadcast all personal data to the blockchain",
                                                "They prevent institutions from accessing public blockchains"
                                ],
                                "correct": 1,
                                "explanation": "DIDs and Verifiable Credentials (VCs) acts as privacy-preserving compliance layers, allowing users to interact with permissioned RWA protocols using cryptographic proofs of identity, without doxxing themselves.",
                                "theme": "Compliance Technology",
                                "difficulty": "hard"
                },
                {
                                "id": "L6-024",
                                "question": "What is an 'Over-Collateralized' lending protocol?",
                                "choices": [
                                                "A lending platform requiring borrowers to deposit assets worth less than the loan amount",
                                                "A platform requiring borrowers to lock up assets worth more than the borrowed amount to account for price volatility",
                                                "A platform requiring collateral to be held in a physical bank vault",
                                                "A platform strictly lending fiat against real estate"
                                ],
                                "correct": 1,
                                "explanation": "Because crypto is highly volatile and loans are generally pseudonymous (no credit scores), protocols like MakerDAO require excess collateral (e.g., 150%) to ensure solvency if the collateral's price drops.",
                                "theme": "DeFi Mechanics",
                                "difficulty": "medium"
                },
                {
                                "id": "L6-025",
                                "question": "In tokenization, what is the role of an 'On-chain Custodian'?",
                                "choices": [
                                                "To manage the physical maintenance of a tokenized property",
                                                "To secure the private keys governing the smart contracts and large token reserves using enterprise-grade security like MPC or HSMs",
                                                "To act as a market maker on centralized exchanges",
                                                "To provide legal counsel to the DAO"
                                ],
                                "correct": 1,
                                "explanation": "Institutional adoption requires regulated, highly secure custodians applying Multi-Party Computation (MPC) or Hardware Security Modules (HSMs) to safeguard the massive value represented by tokenized assets.",
                                "theme": "RWA Infrastructure",
                                "difficulty": "medium"
                },
                {
                                "id": "L6-026",
                                "question": "What does 'Slippage' mean in the context of an AMM trade?",
                                "choices": [
                                                "The fee paid to the liquidity providers",
                                                "The difference between the expected price of a trade and the executed price, exacerbated by low liquidity pools",
                                                "The time delay between transaction broadcast and finality",
                                                "The automatic liquidation of a leveraged position"
                                ],
                                "correct": 1,
                                "explanation": "When trading large volumes on an AMM, the trade itself changes the ratio of assets in the pool, driving the price up or down during the execution of the trade (price impact/slippage).",
                                "theme": "DeFi Trading",
                                "difficulty": "medium"
                },
                {
                                "id": "L6-027",
                                "question": "Which RWA asset class is currently seeing the highest volume of on-chain institutional adoption?",
                                "choices": [
                                                "Fine Art and Collectibles",
                                                "Commercial Real Estate",
                                                "Short-term US Treasury Bills and Money Market Funds",
                                                "Intellectual Property rights"
                                ],
                                "correct": 2,
                                "explanation": "In high-interest-rate environments, short-term sovereign debt (Treasuries) became the dominant RWA beachhead, seamlessly injecting risk-free rate yield into the Web3 ecosystem (e.g., Franklin Templeton, BlackRock).",
                                "theme": "RWA Market Trends",
                                "difficulty": "medium"
                },
                {
                                "id": "L6-028",
                                "question": "What is a 'Smart Contract Audit' in DeFi?",
                                "choices": [
                                                "A check of the company's financial balance sheet by a Big 4 accounting firm",
                                                "A rigorous review of the blockchain code by security researchers to identify vulnerabilities, logical errors, and exploit risks before deployment",
                                                "An automated process that guarantees a contract will never be hacked",
                                                "A regulatory review by the SEC"
                                ],
                                "correct": 1,
                                "explanation": "Because smart contracts are immutable and handle immense value, thorough code-level audits by firms like Trail of Bits, CertiK, or Consensys Diligence are mandatory risk-management steps.",
                                "theme": "Smart Contract Risk",
                                "difficulty": "easy"
                },
                {
                                "id": "L6-029",
                                "question": "How do 'Auto-compounding Vaults' like Yearn Finance work?",
                                "choices": [
                                                "They lend fiat currency to traditional banks for fixed interest",
                                                "They algorithmically harvest yield farming rewards, sell them, and reinvest them into the principal automatically, saving users gas fees",
                                                "They lock users' funds permanently to decrease token supply",
                                                "They generate yield by minting synthetic fiat currencies"
                                ],
                                "correct": 1,
                                "explanation": "Vaults socialize gas costs. Instead of 1,000 users individually paying gas to harvest and reinvest yields, a central smart contract does it for the entire pool extremely efficiently.",
                                "theme": "DeFi Strategies",
                                "difficulty": "hard"
                },
                {
                                "id": "L6-030",
                                "question": "What distinguishes 'RegFi' (Regulated Finance) from pure 'DeFi'?",
                                "choices": [
                                                "RegFi only uses private, closed-loop ledger databases",
                                                "RegFi leverages public DLT rails but enforces strict regulatory perimeters, KYC, and AML at the protocol level",
                                                "RegFi is entirely governed by anonymous DAOs",
                                                "RegFi cannot handle tokenized assets"
                                ],
                                "correct": 1,
                                "explanation": "RegFi represents the convergence: using the superior technological rails of public blockchains (DeFi) while rigorously enforcing institutional compliance frameworks and identity verification.",
                                "theme": "Future of Finance",
                                "difficulty": "hard"
                }
            ]
        },

        'super': {
            level: 'super',
            name: "DCM Black Level — Strategic Mastery",
            subtitle: "High-Stakes Scenarios, VC Selection, Regulatory Hardening & Infrastructure Design",
            theme_color: "#7c3aed",
            questions: [
                {
                    id: "SL-001",
                    scenario: "Vous pitchez une levée de fonds Série A de 15M€ devant un VC Tier-1. Ils vous demandent quelle est votre 'unfair advantage' réglementaire par rapport à un concurrent disposant de 10x plus de capital mais sans agrément MiCA.",
                    question: "Quelle réponse maximise vos chances d'obtenir une 'term sheet' avec une valorisation premium ?",
                    choices: [
                        "L'agrément MiCA nous permet d'opérer dès maintenant dans 27 pays, créant une barrière à l'entrée de 18-24 mois pour la concurrence.",
                        "Notre technologie est open-source et plus décentralisée que celle du concurrent.",
                        "Nous avons une plus grande communauté sur les réseaux sociaux et Discord.",
                        "L'agrément MiCA garantit que nos smart contracts ne contiennent aucune faille de sécurité.",
                        "Le concurrent sera racheté par une banque avant d'obtenir son agrément.",
                        "L'adhésion aux standards MiCA réduit nos coûts de serveurs cloud de 40%.",
                        "Nous pouvons émettre des stablecoins algorithmiques sans collatéral grâce à MiCA.",
                        "La régulation capture les opportunités de marché plus vite que le capital pur dans le secteur institutionnel."
                    ],
                    correct: 0,
                    explanation: "Dans le B2B régulé, la 'regulatory capture' (être le premier agréé) est le moat le plus puissant. Un concurrent sans agrément doit attendre le processus administratif (18-24m), vous laissant le champ libre pour sécuriser les partenaires bancaires.",
                    theme: "Série A Strategy",
                    difficulty: "super"
                },
                {
                    id: "SL-002",
                    scenario: "Une banque systémique (G-SIB) souhaite émettre une obligation numérique de 500M€ avec règlement T+0. Elle hésite entre utiliser le réseau public Ethereum (L2) ou une infrastructure privée de type Canton Network.",
                    question: "Quel est l'argument technique décisif pour choisir Canton Network dans ce contexte institutionnel ?",
                    choices: [
                        "La vitesse de transaction est 100x supérieure à celle d'Ethereum.",
                        "L'interopérabilité native entre sub-ledgers confidentiels sans révéler les positions globales au reste du marché.",
                        "Canton Network permet d'utiliser n'importe quel langage de programmation, même non-déterministe.",
                        "L'absence totale de frais de transaction (gas fees) pour tous les participants.",
                        "La conformité automatique au droit civil américain indépendamment de la juridiction des nœuds.",
                        "Le support natif du Bitcoin comme monnaie de règlement par défaut.",
                        "La suppression du besoin de HSM pour la conservation des clés privées.",
                        "Une gouvernance centralisée permettant d'annuler n'importe quelle transaction par simple vote."
                    ],
                    correct: 1,
                    explanation: "Canton (Digital Asset) a été conçu pour la finance: il permet à chaque banque de garder ses données confidentielles sur son sub-ledger tout en permettant des transactions atomiques cross-ledger — résolvant le paradoxe 'Confidentialité vs Interopérabilité'.",
                    theme: "Infrastructure Choice",
                    difficulty: "super"
                },
                {
                    id: "SL-003",
                    scenario: "Durant un audit DORA, le régulateur identifie que votre infrastructure DLT dépend d'un seul fournisseur Cloud pour 95% de vos nœuds validateurs.",
                    question: "Quelle mesure corrective est la plus robuste pour éviter une sanction majeure ?",
                    choices: [
                        "Migrer 50% des validateurs vers une autre région du même fournisseur Cloud.",
                        "Implémenter une stratégie Multi-cloud hybride avec des nœuds répartis sur au moins deux providers distincts et des nœuds on-premise.",
                        "Souscrire à une assurance ICT couvrant 100% des amendes réglementaires potentielles.",
                        "Chiffrer toutes les communications entre nœuds avec AES-256.",
                        "Passer à un consensus Proof of Work pour supprimer la dépendance aux infrastructures virtualisées.",
                        "Augmenter le capital Tier 1 de 10% pour compenser le risque opérationnel résiduel.",
                        "Demander une dérogation au motif que le fournisseur cloud est lui-même certifié SOC2.",
                        "Recruter un Chief Resilience Officer pour superviser manuellement les serveurs."
                    ],
                    correct: 1,
                    explanation: "DORA (Art. 28) insiste sur la concentration des risques ICT. Une stratégie multi-cloud / hybride est la 'gold standard' pour garantir la continuité de service en cas de panne généralisée d'un fournisseur (anti vendor lock-in).",
                    theme: "DORA Compliance",
                    difficulty: "super"
                },
                {
                    id: "SL-004",
                    scenario: "Vous concevez un stablecoin de niveau institutionnel (Asset-Referenced Token) sous MiCA. Le régulateur exige une preuve de réserve en temps réel avec un mécanisme de 'kill-switch' auditable.",
                    question: "Quelle architecture technique est la plus 'future-proof' pour ce cas d'usage ?",
                    choices: [
                        "Un oracle centralisé mettant à jour un fichier CSV stocké sur IPFS chaque heure.",
                        "Des Proof-of-Reserves on-chain via des Oracles TEE avec un smart contract 'Circuit Breaker' contrôlé par une gouvernance multi-signature.",
                        "Une simple attestation hebdomadaire d'un cabinet d'audit envoyée par email au régulateur.",
                        "L'utilisation d'une blockchain permissionless sans aucun contrôle pour maximiser la liquidité.",
                        "Un mécanisme de minting basé uniquement sur le prix du Bitcoin.",
                        "Une architecture basée sur un DAO où chaque détenteur de token peut bloquer le contrat.",
                        "Le stockage de 100% des réserves en stablecoins algorithmiques concurrents.",
                        "Une intégration native avec le système SWIFT pour valider les flux fiat avant émission."
                    ],
                    correct: 1,
                    explanation: "Les oracles TEE (Trusted Execution Environment) fournissent des preuves de données off-chain inviolables. Le 'Circuit Breaker' permet de suspendre l'activité en cas de déviation, sécurisant les fonds selon les standards MiCA.",
                    theme: "Stablecoin Governance",
                    difficulty: "super"
                },
                {
                    id: "SL-005",
                    scenario: "Dans le cadre de Bâle III (BCBS 2022), une banque souhaite minimiser sa charge de capital pour ses avoirs en titres tokenisés.",
                    question: "Pour être classifié en 'Groupe 1a' (pondération favorable), quel critère est indispensable ?",
                    choices: [
                        "L'actif doit être une crypto-monnaie avec une capitalisation > 100Md$.",
                        "Le titre tokenisé doit avoir les mêmes droits juridiques et économiques que son équivalent traditionnel et être émis sur un réseau régulé.",
                        "L'actif doit être détenu dans un wallet non-custodial personnel pour éviter le risque de tiers.",
                        "L'actif doit obligatoirement être un NFT unique représentant de l'immobilier.",
                        "La banque doit détenir au moins 51% des nœuds validateurs du réseau.",
                        "L'actif doit être émis sur une blockchain Proof of Work exclusivement.",
                        "Le titre doit être convertible en or physique sous 48 heures.",
                        "Le réseau DLT utilisé doit être exempté de la surveillance de l'EBA."
                    ],
                    correct: 1,
                    explanation: "La classification Groupe 1a (BCBS) est réservée aux tokenized traditional assets. S'ils respectent les critères de structure et de réseau (sécurité, gouvernance), ils reçoivent la même pondération que l'actif 'legacy' (ex: 20% pour une obligation souveraine).",
                    theme: "Basel III Strategy",
                    difficulty: "super"
                },
                {
                    id: "SL-006",
                    scenario: "Le projet 'European Blockchain Services Infrastructure' (EBSI) vise à créer un réseau paneuropéen pour les services publics.",
                    question: "Quel est le risque majeur d'une infrastructure hybride (off-chain storage + on-chain notarization) pour les données personnelles ?",
                    choices: [
                        "Le coût trop élevé du stockage sur IPFS.",
                        "La tension entre l'immuabilité du hash on-chain et le 'Droit à l'oubli' (Art. 17 RGPD) si le hash permet d'identifier indirectement une personne.",
                        "L'impossibilité de lire les données si le réseau EBSI subit un hard fork.",
                        "La lenteur du consensus IBFT 2.0 pour les gros fichiers.",
                        "La nécessité pour chaque citoyen de payer des gas fees en tokens EBSI.",
                        "Le risque que les validateurs censurent les données sociales des citoyens.",
                        "L'obsolescence rapide du format de fichier JSON-LD utilisé.",
                        "L'obligation de migrer toutes les données vers une blockchain publique américaine."
                    ],
                    correct: 1,
                    explanation: "Même si la donnée est off-chain, le hash on-chain est considéré comme une donnée pseudonymisée sous RGPD. S'il peut être corrélé à d'autres infos pour identifier quelqu'un, l'immuabilité du hash contrevient au droit à l'effacement.",
                    theme: "RGPD & Privacy",
                    difficulty: "super"
                },
                {
                    id: "SL-007",
                    scenario: "Durant un incident cyber majeur (ex: détection d'une backdoor dans une lib open-source critique), DORA impose une notification rapide.",
                    question: "Quel est le délai maximal pour soumettre le 'rapport initial' d'incident majeur aux autorités compétentes ?",
                    choices: [
                        "Dans l'heure suivant la détection.",
                        "Dans les 4 heures (mais au maximum 24h après détection).",
                        "Dans les 72 heures comme prévu par le RGPD.",
                        "Dans les 5 jours ouvrés.",
                        "Uniquement lors de la clôture annuelle des comptes.",
                        "La notification n'est obligatoire que si des fonds ont été volés.",
                        "Dans les 48 heures précédant la correction du bug.",
                        "Dans les 15 jours si l'incident est partagé avec l'ENISA."
                    ],
                    correct: 1,
                    explanation: "DORA (Art. 19) durcit les délais: un rapport d'incident majeur doit être envoyé extrêmement rapidement (Timeline EBA/ESMA suggérée de 4h à 24h). C'est beaucoup plus strict que le RGPD (72h).",
                    theme: "DORA Compliance",
                    difficulty: "super"
                },
                {
                    id: "SL-008",
                    scenario: "Un Asset Manager souhaite lancer un fonds monétaire tokenisé (MMF) offrant un règlement en 'Atomic Swap' contre une monnaie numérique.",
                    question: "Quel instrument de règlement (Settlement Asset) minimise le risque de crédit de l'actif monétaire pour une banque ?",
                    choices: [
                        "Un stablecoin émis par un exchange non régulé.",
                        "Une Wholesale CBDC (wCBDC) émise par une Banque Centrale sur le réseau DLT.",
                        "Un token de dépôt (Deposit Token) émis par une banque commerciale de rang 2.",
                        "Un token synthétique indexé sur le cours de l'or.",
                        "Un Wrapped Bitcoin (wBTC) sur un réseau Layer 2.",
                        "Le paiement en cash via SWIFT avec confirmation manuelle on-chain.",
                        "Un stablecoin algorithmique indexé sur l'inflation.",
                        "L'utilisation d'un système de crédit mutuel entre participants du réseau."
                    ],
                    correct: 1,
                    explanation: "La CBDC (Central Bank Digital Currency) est une monnaie de banque centrale, donc sans risque de crédit ni de liquidité. C'est l'actif de règlement 'utlime' pour les transactions de gros (wholesale).",
                    theme: "Settlement Mechanics",
                    difficulty: "super"
                },
                {
                    id: "SL-009",
                    scenario: "Pour auditer un smart contract gérant 1 milliard USD d'actifs, quelle méthode offre le plus haut niveau d'assurance mathématique ?",
                    choices: [
                        "Un audit manuel par deux experts indépendants pendant 2 semaines.",
                        "La Vérification Formelle (Formal Verification) via des solveurs SMT prouvant l'absence de certains types de bugs.",
                        "Le 'Fuzzing' pendant 48 heures sur tous les points d'entrée du contrat.",
                        "Un bug bounty program ouvert de 100 000 USD.",
                        "Vérifier manuellement que le code est identique à celui d'un template OpenZeppelin.",
                        "Recourir à une IA générative pour scanner les vulnérabilités courantes.",
                        "Mesurer la couverture de test unitaire (Unit Test Coverage) au-delà de 95%.",
                        "Faire certifier le processus de développement par la norme ISO 9001."
                    ],
                    correct: 1,
                    explanation: "La Vérification Formelle utilise des méthodes mathématiques pour prouver qu'un programme respecte une spécification. Contrairement aux tests qui cherchent des bugs, elle 'prouve' l'absence de bugs spécifiques (ex: overflow, reentrancy).",
                    theme: "Smart Contract Audit",
                    difficulty: "super"
                },
                {
                    id: "SL-010",
                    scenario: "La directive AMLD6 impose des contrôles accrus sur les transactions impliquant des 'unhosted wallets' (wallets non-custodials).",
                    question: "Quelle technologie permet de concilier AML et vie privée pour ces wallets ?",
                    choices: [
                        "L'interdiction pure et simple des transferts vers des portefeuilles externes.",
                        "L'utilisation de Zero-Knowledge KYC (zk-KYC) permettant de prouver l'éligibilité sans révéler l'identité on-chain.",
                        "L'envoi automatique de la clé privée au régulateur lors de chaque transaction.",
                        "Le blocage de toutes les transactions supérieures à 50€.",
                        "Le marquage (tainting) de tous les tokens ayant transité par un wallet non-custodial.",
                        "Le stockage de l'historique complet de navigation de l'utilisateur sur la blockchain.",
                        "L'utilisation de wallets ne fonctionnant qu'avec une reconnaissance faciale centralisée.",
                        "L'exigence d'une double signature systématique par un notaire pour chaque transfert."
                    ],
                    correct: 1,
                    explanation: "Le zk-KYC est la frontière actuelle de la compliance: il permet de prouver (par ex via une signature ZK) que le wallet appartient à une personne vérifiée sans inscrire son nom sur un registre public immuable.",
                    theme: "AML & Privacy",
                    difficulty: "super"
                },
                {
                    id: "SL-011",
                    scenario: "Un consortium bancaire déploie une blockchain permissioned. Ils doivent choisir entre un consensus PBFT et un consensus Raft.",
                    question: "Pourquoi le PBFT est-il préférable dans ce contexte multi-acteurs ?",
                    choices: [
                        "Il est beaucoup plus rapide que Raft en termes de TPS.",
                        "Il tolère les fautes Byzantines (nœuds malveillants ou menteurs), contrairement à Raft qui ne gère que les pannes sèches.",
                        "Il consomme moins d'énergie que Raft.",
                        "Il est natif dans toutes les distributions Linux standard.",
                        "Il permet d'ajouter des milliers de validateurs sans perte de performance.",
                        "Il garantit l'anonymat des validateurs vis-à-vis du reste du monde.",
                        "Il a été inventé spécifiquement par la BCE pour les CBDC.",
                        "Il ne nécessite aucune communication réseau entre les validateurs."
                    ],
                    correct: 1,
                    explanation: "Raft suppose que le leader est honnête mais peut tomber en panne. Dans un consortium (rivalité potentielle), PBFT protège contre un leader malveillant qui tenterait de censurer ou modifier l'ordre des transactions.",
                    theme: "Consensus Mechanisms",
                    difficulty: "super"
                },
                {
                    id: "SL-012",
                    scenario: "L'infrastructure DCM Digital doit intégrer un 'ESG Score' pour chaque actif tokenisé, incluant l'empreinte carbone du protocole sous-jacent.",
                    question: "Quel indicateur est le plus pertinent pour un investisseur institutionnel Article 9 SFDR ?",
                    choices: [
                        "La capitalisation boursière du token multipliée par son score ESG moyen.",
                        "Le Carbon-per-Transaction et le mécanisme de consensus (PoS vs PoW) audités on-chain.",
                        "Le nombre de 'Likes' ESG sur le profil social de l'émetteur.",
                        "L'absence totale d'électricité consommée par le réseau DLT.",
                        "L'utilisation exclusiv de serveurs hébergés en Islande.",
                        "Le montant des dons faits par la fondation blockchain à des ONGs environnementales.",
                        "Le ratio de femmes parmi les validateurs du réseau.",
                        "Le prix du token s'il est corrélé positivement à l'indice MSCI World ESG."
                    ],
                    correct: 1,
                    explanation: "Pour les fonds Article 9 (objectif durable), la mesure de l'impact réel (empreinte carbone de l'archi IT / consensus) est cruciale. L'EBA et l'ESMA préparent des standards de reporting ESG pour les crypto-actifs.",
                    theme: "ESG & SFDR",
                    difficulty: "super"
                },
                {
                    id: "SL-013",
                    scenario: "Une plateforme de Titrisation DLT veut automatiser le cycle de vie des actifs (coupons, amortissements) via des smart contracts.",
                    question: "Quel est le risque de 'Model Risk' (MRM) le plus critique dans ce système ?",
                    choices: [
                        "L'inefficacité du code Solidity en termes de consommation de gas.",
                        "Une erreur de conception dans la logique de calcul des intérêts intégrée au smart contract immuable.",
                        "L'utilisation d'une version de compilateur trop ancienne.",
                        "Le manque de commentaires dans le code source pour les auditeurs.",
                        "Le choix d'une police de caractères non lisible dans le code.",
                        "La fluctuation du prix du gas rendant l'exécution trop chère.",
                        "L'absence de logo sur les tokens émis par le contrat.",
                        "La lenteur de synchronisation des nœuds d'archive."
                    ],
                    correct: 1,
                    explanation: "Sous SR 11-7, un smart contract est un modèle. Si la logique métier (calcul d'intérêts) est codée en dur et fausse, l'erreur devient systémique, immuable et peut causer des pertes massives. C'est le cœur du Model Risk management sur DLT.",
                    theme: "Model Risk Management",
                    difficulty: "super"
                },
                {
                    id: "SL-014",
                    scenario: "Le 'Regulated Liability Network' (RLN) propose une architecture où monnaie et actifs coexistent sur le même registre.",
                    question: "Quel est le bénéfice majeur par rapport au modèle actuel ( silos banques vs silos dépositaires ) ?",
                    choices: [
                        "La suppression des banques commerciales au profit d'un algorithme unique.",
                        "Le règlement atomique simultané (DVP) en temps réel, 24/7, sans risque de décalage temporel entre titre et cash.",
                        "La gratuité totale des services bancaires pour les épargnants.",
                        "L'utilisation systématique du Bitcoin pour tous les règlements interbancaires.",
                        "L'anonymat complet des transactions envers le régulateur.",
                        "La fin de l'inflation grâce à la programmabilité monétaire.",
                        "La réduction de la taille des serveurs informatiques des banques par 10.",
                        "L'unification des taux d'intérêt au niveau mondial."
                    ],
                    correct: 1,
                    explanation: "Le RLN (testé par NY Fed, Citi, Mastercard) vise à supprimer les frictions de réconciliation entre silos. L'atomicité garantit que le titre ne bouge que si le cash bouge, instantanément, réduisant les besoins de collatéral.",
                    theme: "Market Infrastructure",
                    difficulty: "super"
                },
                {
                    id: "SL-015",
                    scenario: "SCÉNARIO FINAL : Une cyber-attaque systémique paralyse 3 grands fournisseurs cloud et 2 oracles majeurs simultanément pendant une période de crise de liquidité globale.",
                    question: "Quelle caractéristique d'architecture permet à DCM Digital de survivre opérationnellement ?",
                    choices: [
                        "L'utilisation exclusive de serveurs locaux non connectés à Internet.",
                        "La Redondance Hybride (Cloud + On-Premise) avec consensus BFT tolérant la perte d'oracles via des sources de prix redondantes locales.",
                        "L'arrêt complet de la plateforme jusqu'à la fin de la crise cloud.",
                        "Le basculement de toutes les transactions sur le réseau Bitcoin Mainnet.",
                        "L'utilisation d'une assurance contre les catastrophes naturelles.",
                        "La confiance absolue dans la capacité des fournisseurs cloud à rétablir le service sous 2 heures.",
                        "La liquidation automatique de tous les actifs dès la première minute d'interruption.",
                        "La demande d'un prêt d'urgence à la banque centrale via un formulaire papier."
                    ],
                    correct: 1,
                    explanation: "La 'Survivabilité' institutionnelle nécessite: 1/ Redondance infra (Multi-cloud/Hybride), 2/ Redondance data (Multi-oracle), 3/ Résilience consensus (BFT). C'est la seule façon de maintenir l'intégrité en cas de choc systémique ICT.",
                    theme: "Systemic Resilience",
                    difficulty: "super"
                }
            ]
        }
    },

    // ─── QUESTION BANK LOADING ───────────────────────────────────────────────

    async loadBank(levelId) {
        const level = this.LEVELS.find(l => l.id === levelId);
        if (!level) throw new Error(`Level ${levelId} not found`);

        // Return inline embedded bank if available
        const embedded = this._BANKS[levelId];
        if (embedded) return embedded;

        // Levels not yet built — return meaningful stub
        return {
            level: levelId,
            name: level.name,
            questions: [
                {
                    id: `STUB-001`,
                    question: `Le Level ${levelId} (${level.name}) est en cours de développement. Cette banque de questions sera disponible très prochainement.`,
                    choices: ["J'ai hâte !", "Bientôt disponible", "En développement", "Phase suivante"],
                    correct: 0,
                    explanation: `La banque de questions du Level ${levelId} sera intégrée lors de la Phase 4 du développement.`,
                    theme: "Coming Soon",
                    difficulty: "easy"
                }
            ]
        };
    },


    // ─── SHUFFLE UTILITY ─────────────────────────────────────────────────────
    _shuffle(arr) {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    },

    // ─── SHUFFLE CHOICES (keeping correct answer tracking) ──────────────────
    _shuffleChoices(question) {
        const indices = question.choices.map((_, i) => i);
        const shuffledIndices = this._shuffle(indices);
        return {
            ...question,
            choices: shuffledIndices.map(i => question.choices[i]),
            correct: shuffledIndices.indexOf(question.correct), // remap correct index
            _originalCorrect: question.correct
        };
    },

    // ─── START SESSION ───────────────────────────────────────────────────────
    async startSession(levelId) {
        if (!this.isLevelUnlocked(levelId)) {
            throw new Error(`Level ${levelId} is locked. Complete the previous level first.`);
        }

        const bankData = await this.loadBank(levelId);
        const levelMeta = this.LEVELS.find(l => l.id === levelId);

        // Pick questions: super takes all 15, others pick 20 from 30
        const questionsToUse = levelMeta.isSuper
            ? bankData.questions
            : this._shuffle(bankData.questions).slice(0, this.QUESTIONS_PER_SESSION);

        // Shuffle choices for each question
        const session = questionsToUse.map(q => this._shuffleChoices(q));

        this._state = {
            currentLevel: levelId,
            levelMeta,
            bankMeta: bankData,
            bank: bankData.questions,
            session,
            currentIndex: 0,
            answers: [],
            sessionId: `SID-${Date.now()}-L${levelId}`,
            startTime: Date.now(),
            qStartTime: Date.now()
        };

        return {
            sessionId: this._state.sessionId,
            levelName: bankData.name,
            totalQuestions: session.length,
            level: levelMeta
        };
    },

    // ─── GET CURRENT QUESTION ────────────────────────────────────────────────
    getCurrentQuestion() {
        const { session, currentIndex } = this._state;
        if (currentIndex >= session.length) return null;
        return {
            ...session[currentIndex],
            index: currentIndex,
            total: session.length,
            progress: Math.round((currentIndex / session.length) * 100)
        };
    },

    // ─── SUBMIT ANSWER ───────────────────────────────────────────────────────
    submitAnswer(choiceIndex) {
        const { session, currentIndex, answers } = this._state;
        const question = session[currentIndex];
        if (!question) return null;

        const isCorrect = choiceIndex === question.correct;
        const answer = {
            questionId: question.id,
            question: question.question,
            chosen: choiceIndex,
            correct: question.correct,
            isCorrect,
            explanation: question.explanation,
            theme: question.theme
        };

        const duration = Math.round((Date.now() - this._state.qStartTime) / 1000);

        answers.push(answer);
        this._state.currentIndex++;
        this._state.qStartTime = Date.now(); // Reset for next q

        // Track Analytics
        if (window.QuizAnalytics) {
            window.QuizAnalytics.trackAttempt(
                this._state.levelMeta.id,
                currentIndex,
                isCorrect,
                duration,
                question.theme || 'General'
            );
        }

        return {
            isCorrect,
            correctIndex: question.correct,
            explanation: question.explanation,
            hasMore: this._state.currentIndex < session.length
        };
    },

    // ─── END SESSION & CALCULATE RESULTS ────────────────────────────────────
    async endSession() {
        const { answers, _state, sessionId } = this;
        const { currentLevel, levelMeta, session, startTime } = this._state;

        const totalQuestions = session.length;
        const correct = this._state.answers.filter(a => a.isCorrect).length;
        const scorePercent = Math.round((correct / totalQuestions) * 100);
        const passed = scorePercent >= this.PASS_SCORE;
        const duration = Math.round((Date.now() - startTime) / 1000);

        // Theme breakdown
        const themeMap = {};
        this._state.answers.forEach(a => {
            if (!themeMap[a.theme]) themeMap[a.theme] = { correct: 0, total: 0 };
            themeMap[a.theme].total++;
            if (a.isCorrect) themeMap[a.theme].correct++;
        });

        // Save score
        this._saveScore(levelMeta.key, scorePercent, passed);

        // Handle unlock
        let unlocked = null;
        if (passed) {
            const nextLevel = this.LEVELS.find(l => l.requires === currentLevel);
            if (nextLevel) {
                await this.unlockLevel(nextLevel.id);
                unlocked = nextLevel;
            }
            // Handle super level unlock
            if (currentLevel === 6) {
                await this.unlockLevel('super');
                localStorage.setItem(this.KEYS.SUPER, 'true');
            }
            // Handle certification
            await this._issueCertificate(levelMeta, scorePercent);
        }

        // Save to history
        const session_record = {
            sessionId: this._state.sessionId,
            level: currentLevel,
            levelKey: levelMeta.key,
            score: scorePercent,
            correct,
            total: totalQuestions,
            passed,
            duration,
            date: new Date().toISOString(),
            themes: themeMap,
            failedQuestions: this._state.answers.filter(a => !a.isCorrect).map(a => a.questionId)
        };
        const history = JSON.parse(localStorage.getItem(this.KEYS.HISTORY) || '[]');
        history.unshift(session_record);
        localStorage.setItem(this.KEYS.HISTORY, JSON.stringify(history.slice(0, 50)));

        // Track Analytics
        if (window.QuizAnalytics) {
            window.QuizAnalytics.trackSessionComplete(
                currentLevel,
                correct,
                totalQuestions,
                duration
            );
        }

        return {
            score: scorePercent,
            correct,
            total: totalQuestions,
            passed,
            passScore: this.PASS_SCORE,
            duration,
            unlocked,
            themes: themeMap,
            answers: this._state.answers,
            levelMeta
        };
    },

    // ─── CERTIFICATION ───────────────────────────────────────────────────────
    async _issueCertificate(levelMeta, score) {
        const certLevel = {
            1: null,          // No cert for L1
            2: null,          // No cert for L2
            3: 'Governance Practitioner',
            4: null,
            5: 'Institutional Expert',
            'super': 'Black Level'
        }[levelMeta.id];

        if (!certLevel) return;

        const certs = JSON.parse(localStorage.getItem(this.KEYS.CERTS) || '[]');
        const existing = certs.find(c => c.level === levelMeta.id);
        if (!existing) {
            const newCert = {
                level: levelMeta.id,
                certName: certLevel,
                score,
                date: new Date().toISOString(),
                certId: `DCM-${levelMeta.key}-${Date.now().toString(36).toUpperCase()}`
            };
            certs.push(newCert);
            localStorage.setItem(this.KEYS.CERTS, JSON.stringify(certs));

            // Sync with Supabase profile
            if (window.SessionManager) {
                try {
                    const profile = window.SessionManager.getCurrentUser();
                    if (profile && !profile.id.startsWith('guest')) {
                        const updatedCerts = [...(profile.certifications || []), newCert];
                        await window.SessionManager.updateProfile({ certifications: updatedCerts });
                        console.log(`🎓 Certificate [${certLevel}] synchronized to Supabase.`);
                    }
                } catch (err) {
                    console.warn("⚠️ Failed to sync certification to Supabase:", err.message);
                }
            }
        }
    },

    // ─── GET LEVEL MAP DATA ──────────────────────────────────────────────────
    getLevelMap() {
        return this.LEVELS.map(level => {
            const bestScore = this.getBestScore(level.key);
            const unlocked = this.isLevelUnlocked(level.id);
            const completed = bestScore !== null && bestScore >= this.PASS_SCORE;
            return {
                ...level,
                unlocked,
                completed,
                bestScore,
                locked: !unlocked
            };
        });
    },

    // ─── ANALYTICS ───────────────────────────────────────────────────────────
    getAnalytics() {
        const history = JSON.parse(localStorage.getItem(this.KEYS.HISTORY) || '[]');
        const scores = JSON.parse(localStorage.getItem(this.KEYS.SCORES) || '{}');

        const byLevel = {};
        history.forEach(s => {
            if (!byLevel[s.levelKey]) byLevel[s.levelKey] = { attempts: 0, passed: 0, scores: [] };
            byLevel[s.levelKey].attempts++;
            if (s.passed) byLevel[s.levelKey].passed++;
            byLevel[s.levelKey].scores.push(s.score);
        });

        return { history, scores, byLevel };
    },

    getUserStats() {
        const history = JSON.parse(localStorage.getItem(this.KEYS.HISTORY) || '[]');
        const scores = JSON.parse(localStorage.getItem(this.KEYS.SCORES) || '{}');
        
        let totalQuestions = 0;
        let totalCorrect = 0;
        const themeStats = {};
        let completedLevels = 0;

        // Count completed levels (score >= 80)
        Object.values(scores).forEach(score => {
            if (score >= this.PASS_SCORE) completedLevels++;
        });

        history.forEach(session => {
            if (session.details) {
                session.details.forEach(d => {
                    totalQuestions++;
                    if (d.correct) totalCorrect++;
                    
                    if (d.theme) {
                        if (!themeStats[d.theme]) themeStats[d.theme] = { total: 0, correct: 0 };
                        themeStats[d.theme].total++;
                        if (d.correct) themeStats[d.theme].correct++;
                    }
                });
            }
        });

        let topTheme = null;
        let bestThemeAcc = -1;
        Object.keys(themeStats).forEach(t => {
            const acc = themeStats[t].correct / themeStats[t].total;
            if (acc > bestThemeAcc) {
                bestThemeAcc = acc;
                topTheme = t;
            }
        });

        return {
            totalQuestions,
            totalCorrect,
            completedLevels,
            topTheme,
            themeStats
        };
    },

    isFastTrackUnlocked() {
        return localStorage.getItem('dcm_academy_fast_track') === 'true';
    },

    async fastTrackUnlock(code) {
        // V1 simple validation: Case-insensitive match for the Pro code
        const VALID_PRO_CODES = ['DCM-PRO-2026', 'ACADEMY-ELITE-2026', 'INSTITUTIONAL-ACCESS'];
        if (VALID_PRO_CODES.includes(code.toUpperCase())) {
            localStorage.setItem('dcm_academy_fast_track', 'true');
            // Mocking a successful validation delay
            await new Promise(r => setTimeout(r, 800));
            return true;
        }
        return false;
    }
};

// Make globally available for non-module scripts
window.QuizEngine = QuizEngine;
