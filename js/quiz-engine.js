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
        { id: 'super', key: 'SL', file: 'super-level.json', name: 'DCM Black Level', color: '#7c3aed', icon: 'fa-bolt', requires: 5, isSuper: true }
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
        startTime: null
    },

    // ─── DEV MODE ────────────────────────────────────────────────────────────
    isDevMode() {
        return localStorage.getItem('is_super_dev') === 'true'
            || localStorage.getItem('dcm_user_role') === 'ADMIN';
    },

    // ─── UNLOCK MANAGEMENT ──────────────────────────────────────────────────
    getUnlocks() {
        if (this.isDevMode()) return [1, 2, 3, 4, 5, 'super'];
        return JSON.parse(localStorage.getItem(this.KEYS.UNLOCKS) || '[1]');
    },

    isLevelUnlocked(levelId) {
        if (this.isDevMode()) return true;
        const unlocks = this.getUnlocks();
        return unlocks.includes(levelId);
    },

    unlockLevel(levelId) {
        const unlocks = this.getUnlocks();
        if (!unlocks.includes(levelId)) {
            unlocks.push(levelId);
            localStorage.setItem(this.KEYS.UNLOCKS, JSON.stringify(unlocks));
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
            startTime: Date.now()
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

        answers.push(answer);
        this._state.currentIndex++;

        return {
            isCorrect,
            correctIndex: question.correct,
            explanation: question.explanation,
            hasMore: this._state.currentIndex < session.length
        };
    },

    // ─── END SESSION & CALCULATE RESULTS ────────────────────────────────────
    endSession() {
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
                this.unlockLevel(nextLevel.id);
                unlocked = nextLevel;
            }
            // Handle super level unlock
            if (currentLevel === 5) {
                this.unlockLevel('super');
                localStorage.setItem(this.KEYS.SUPER, 'true');
            }
            // Handle certification
            this._issueCertificate(levelMeta, scorePercent);
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
    _issueCertificate(levelMeta, score) {
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
            certs.push({
                level: levelMeta.id,
                certName: certLevel,
                score,
                date: new Date().toISOString(),
                certId: `DCM-${levelMeta.key}-${Date.now().toString(36).toUpperCase()}`
            });
            localStorage.setItem(this.KEYS.CERTS, JSON.stringify(certs));
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
    }
};

// Make globally available for non-module scripts
window.QuizEngine = QuizEngine;
