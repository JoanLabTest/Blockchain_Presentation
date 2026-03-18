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
                { id: "L1-001", question: "What is the primary objective of a Distributed Ledger (DLT) compared to a traditional database?", choices: ["Optimize transaction taxation", "Centralize data under single control", "Ensure immutability, transparency, and decentralization", "Remove the need for financial regulation"], correct: 2, explanation: "A DLT ensures that data cannot be altered after recording, is visible to all authorized participants, and does not depend on a central actor.", theme: "DLT Basics", difficulty: "easy" },
                { id: "L1-002", question: "What is a smart contract in a blockchain context?", choices: ["A contract digitally signed at a notary", "Self-executing code deployed on a distributed network", "A tokenized PDF stored on IPFS", "A standard ISO 20022 banking API"], correct: 1, explanation: "A smart contract is a computer program whose execution is automatically triggered when predefined conditions are met, without intermediaries.", theme: "DLT Basics", difficulty: "easy" },
                { id: "L1-003", question: "What is the fundamental difference between a permissioned and a permissionless blockchain?", choices: ["Permissioned is faster but less secure", "Permissioned restricts access to identified and authorized entities", "Permissionless requires mandatory KYC", "Permissioned is open-source, permissionless is proprietary"], correct: 1, explanation: "A permissioned blockchain (e.g., Canton, SWIAT) limits participation to verified entities — crucial for financial institutions subject to regulation.", theme: "DLT Basics", difficulty: "easy" },
                { id: "L1-004", question: "MiCA (Markets in Crypto-Assets) mainly applies to:", choices: ["European equity derivatives", "Crypto-assets issued or offered in the European Union", "Commodity-backed ETFs", "Stablecoins issued exclusively in the USA"], correct: 1, explanation: "MiCA is the European regulatory framework governing the issuance and provision of services on crypto-assets, applicable since 2024 for stablecoins and 2025 for CASPs.", theme: "MiCA", difficulty: "easy" },
                { id: "L1-005", question: "DORA (Digital Operational Resilience Act) primarily aims to:", choices: ["Protect retail crypto investors", "Ensure digital operational resilience of financial entities against ICT risks", "Framework for crypto capital gains taxation", "Regulate European central bank CBDCs"], correct: 1, explanation: "DORA imposes requirements on EU financial entities regarding continuity, resilience testing, and digital third-party risk management.", theme: "DORA", difficulty: "easy" },
                { id: "L1-006", question: "A tokenized bond is:", choices: ["A traditional bond converted into a native digital representation on DLT", "A speculative crypto-currency backed by nothing", "A fractionalized share in ERC-20 tokens", "A stablecoin issued by a central bank"], correct: 0, explanation: "A tokenized bond represents a bond as a token on a distributed ledger, allowing T+0 settlement, lifecycle transparency, and automated coupons via smart contracts.", theme: "Tokenization", difficulty: "easy" },
                { id: "L1-007", question: "The risk of 'validator concentration' in a DLT network means:", choices: ["An excessive number of active users on the network", "A mining rate that is too high, generating energy costs", "A restricted number of entities controlling block validation", "Too many unresolved forks"], correct: 2, explanation: "If few entities validate transactions, failure or collusion becomes a major systemic risk — a critical point for DORA and Basel III.", theme: "DLT Risk", difficulty: "medium" },
                { id: "L1-008", question: "An algorithmic stablecoin is distinguished by:", choices: ["1:1 fiat reserves audited by a third party", "Physical gold collateral stored in a vault", "Algorithmic supply/demand mechanisms to maintain its peg", "A peg to a basket of CBDCs"], correct: 2, explanation: "Algorithmic stablecoins (e.g., former Terra/LUNA) maintain their peg via automated burn/mint mechanisms — without real reserves, hence their structural vulnerability.", theme: "Tokenization", difficulty: "medium" },
                { id: "L1-009", question: "What is 'Proof of Stake' (PoS)?", choices: ["A cryptographic transaction audit mechanism", "A consensus protocol where validators stake tokens as collateral", "A mining method based on computing power", "An ISO standard for financial blockchain certification"], correct: 1, explanation: "In PoS, validators put tokens (stake) at risk as collateral. Ethereum has used PoS since The Merge (2022).", theme: "Consensus Mechanisms", difficulty: "easy" },
                { id: "L1-010", question: "What is an oracle in the blockchain ecosystem?", choices: ["A centralized database of on-chain transactions", "A validator with extended governance rights", "A component that connects the blockchain to real-world data (off-chain)", "A block compression protocol for scalability"], correct: 2, explanation: "Oracles (e.g., Chainlink) allow smart contracts to access external data — a critical dependency generating manipulation risks.", theme: "DLT Basics", difficulty: "medium" },
                { id: "L1-011", question: "In the Basel III framework, a bank's exposure to Group 2b crypto-assets (e.g., Bitcoin) is subject to:", choices: ["100% risk weighting like equities", "1250% risk weighting (maximum charge)", "Exemption if held less than 30 days", "Same rules as sovereign bonds"], correct: 1, explanation: "The BCBS (2022) imposes a 1250% weighting for unbacked crypto-assets classified as Group 2b — equivalent to a total deduction from capital.", theme: "Basel Crypto", difficulty: "medium" },
                { id: "L1-012", question: "A SHA-256 cryptographic hash is:", choices: ["A reversible electronic signature of a document", "A unique and irreversible fingerprint of a data set", "A symmetric encryption algorithm for private keys", "A consensus protocol for permissioned networks"], correct: 1, explanation: "SHA-256 produces a fixed 256-bit fingerprint for any input. The smallest change in data completely changes the hash — the foundation of blockchain integrity.", theme: "Cryptography", difficulty: "easy" },
                { id: "L1-013", question: "Ethereum 'gas fees' represent:", choices: ["Fiat-crypto conversion fees at a CASP", "The cost in ETH to execute operations on the network", "A regulatory tax imposed by the EBA", "Custody fees at an authorized custodian"], correct: 1, explanation: "Gas fees compensate validators for the computational resources consumed. They vary based on network congestion.", theme: "DLT Basics", difficulty: "easy" },
                { id: "L1-014", question: "A Layer 2 (L2) solution aims to:", choices: ["Permanently replace the main blockchain", "Improve scalability by processing transactions off the main chain", "Add an on-chain KYC regulation layer", "Create an independent parallel blockchain"], correct: 1, explanation: "L2s (e.g., Optimism, Polygon) execute transactions off-chain and then submit proofs to L1, reducing costs and increasing throughput.", theme: "Scalability", difficulty: "medium" },
                { id: "L1-015", question: "'Slashing' in a Proof of Stake network refers to:", choices: ["Automatic block compression to reduce storage", "The penalty imposed on a validator for malicious behavior or error", "The division of a token into fractions for micro-transactions", "An automatic fork resolution mechanism"], correct: 1, explanation: "Slashing penalizes validators who sign two conflicting blocks (double signing) or are offline for too long, by confiscating all or part of their stake.", theme: "Consensus Mechanisms", difficulty: "medium" },
                { id: "L1-016", question: "AML in the crypto context requires a CASP to:", choices: ["Block all transactions over €1,000", "Identify and verify customers (KYC) and detect suspicious transactions", "Submit all wallets to a monthly central authority", "Refuse any client without EU residency"], correct: 1, explanation: "Under the AMLD directive, CASPs are subject to the same KYC/AML obligations as traditional financial institutions.", theme: "Regulatory Compliance", difficulty: "easy" },
                { id: "L1-017", question: "A CBDC differs from a private stablecoin because:", choices: ["It is issued directly by a central bank and constitutes a sovereign obligation", "It operates only on a permissionless public blockchain", "It is backed by physical gold reserves", "It is not subject to traditional banking regulation"], correct: 0, explanation: "A CBDC is a digital form of central bank money — a direct obligation of the state.", theme: "CBDC", difficulty: "easy" },
                { id: "L1-018", question: "TVL (Total Value Locked) measures:", choices: ["The total value of assets deposited in DeFi protocols or smart contracts", "The volume of transactions on a blockchain in 24h", "The market capitalization of a DeFi protocol", "The number of active wallets on a network"], correct: 0, explanation: "TVL is a key indicator of a DeFi protocol's adoption: the total value of assets entrusted to its smart contracts.", theme: "DeFi Metrics", difficulty: "easy" },
                { id: "L1-019", question: "A non-custodial wallet is characterized by:", choices: ["Delegating private key custody to an authorized service provider", "Exclusive holding of private keys by the user without intermediaries", "Mandatory enhanced KYC with a regulated CASP", "Inability to transfer assets to a centralized platform"], correct: 1, explanation: "In non-custodial wallets, the user is the sole holder of their private key. 'Not your keys, not your coins.'", theme: "Wallets & Custody", difficulty: "easy" },
                { id: "L1-020", question: "A blockchain protocol fork occurs when:", choices: ["The network undergoes a DDoS attack and temporarily splits", "A governance disagreement or update creates two incompatible versions of the protocol", "A central bank issues a parallel CBDC", "The genesis block is replaced by a compensation block"], correct: 1, explanation: "A hard fork (e.g., Ethereum/Ethereum Classic in 2016) creates two distinct chains — a risk of liquidity fragmentation.", theme: "DLT Risk", difficulty: "medium" },
                { id: "L1-021", question: "Blockchain interoperability refers to the ability to:", choices: ["Merge two blockchains into a single unified architecture", "Transfer assets and data between distinct networks without centralized intermediaries", "Automatically convert tokens to fiat via an oracle", "Synchronize validator nodes of different networks"], correct: 1, explanation: "Interoperability (cross-chain) — via bridges, IBC — allows communication between blockchains, while generating specific risks.", theme: "DLT Basics", difficulty: "medium" },
                { id: "L1-022", question: "An authorized crypto custodian (under MiCA) must mandatory:", choices: ["Isolate client assets from own assets and maintain equivalent coverage", "Deposit 100% of client assets with the ECB", "Block assets for 48h after any deposit", "Publish private keys in open source"], correct: 0, explanation: "MiCA requires custodians to have strict segregation of client assets, 1:1 coverage, and legal liability in case of loss.", theme: "MiCA", difficulty: "medium" },
                { id: "L1-023", question: "The risk of a vulnerable smart contract is primarily:", choices: ["Loss of network connectivity resulting from a DDoS attack", "Exploitation of a code flaw by a malicious actor", "Variation in gas price making the contract unexecutable", "Incompatibility with the AML protocol of the jurisdiction"], correct: 1, explanation: "Smart contracts are immutable once deployed: a code flaw (e.g., reentrancy attack) can be exploited irreversibly.", theme: "Smart Contract Risk", difficulty: "medium" },
                { id: "L1-024", question: "'Regulatory arbitrage' in the crypto context refers to:", choices: ["Strategic choice of a jurisdiction with favorable regulation to operate a crypto project", "Exploitation of accounting loopholes to reduce tax charges", "Conversion of crypto assets to fiat to avoid regulation", "Simultaneous issuance of tokens in multiple jurisdictions"], correct: 0, explanation: "Regulatory arbitrage is increasingly limited by global regulatory convergence (FATF, MiCA, IOSCO).", theme: "Regulatory Compliance", difficulty: "medium" },
                { id: "L1-025", question: "A 'utility token' type under MiCA is:", choices: ["A financial security giving right to dividends", "A token conferring access to a specific good or service from an issuer", "A stablecoin backed by a fiat currency", "A CBDC issued by an EU member central bank"], correct: 1, explanation: "Utility tokens are regulated under MiCA with lighter whitepaper requirements compared to asset-referenced tokens.", theme: "MiCA", difficulty: "medium" },
                { id: "L1-026", question: "The governance risk of a DAO lies primarily in:", choices: ["The absence of a user interface accessible to participants", "The concentration of voting rights among the largest token holders", "The technical impossibility of modifying smart contracts", "Failure to report staking income for tax purposes"], correct: 1, explanation: "In practice, 'whales' holding large volumes of governance tokens control the votes in DAOs.", theme: "Governance Risk", difficulty: "medium" },
                { id: "L1-027", question: "On-chain data analytics primarily allows an institution to:", choices: ["Replace mandatory traditional financial audits", "Analyze transaction flows in real-time to detect suspicious behavior", "Access private data of non-custodial wallets", "Modify unconfirmed transactions in the mempool"], correct: 1, explanation: "On-chain analysis (via Chainalysis, Elliptic, TRM Labs) allows institutions to trace flows and score the risk of blockchain addresses.", theme: "Compliance Technology", difficulty: "medium" },
                { id: "L1-028", question: "In Basel III, crypto-assets are classified into groups based on:", choices: ["Their market capitalization and daily volume", "Their ability to satisfy prudential quality criteria (BCBS 2022 classification)", "The jurisdiction of their issuer", "Their consensus mechanism (PoW vs PoS)"], correct: 1, explanation: "The BCBS (2022) classifies crypto into Group 1 (compliant tokenized) and Group 2 (non-compliant) with radically different weightings.", theme: "Basel Crypto", difficulty: "hard" },
                { id: "L1-029", question: "DeFi presents as a major institutional risk:", choices: ["Overly strict regulation making protocols unusable", "The absence of a legally responsible entity in case of protocol failure", "Outperformance compared to traditional financial instruments", "Too fast an adoption rate by central banks"], correct: 1, explanation: "The absence of an identifiable legal entity in DeFi protocols creates a legal vacuum in case of hack or dispute — a critical legal risk.", theme: "DeFi Risk", difficulty: "medium" },
                { id: "L1-030", question: "A cross-chain 'bridge' represents a risk because:", choices: ["It generates transaction fees exceeding 50% of the transferred value", "It constitutes a concentration point for funds exposed to smart contract exploits", "It is prohibited by MiCA for transfers over €10,000", "It mandatory requires a Level 3 KYC with an authorized CASP"], correct: 1, explanation: "Bridges have represented the majority of DeFi hacks in value (e.g., Ronin $625M, Wormhole $320M). They concentrate funds in vulnerable smart contracts.", theme: "DLT Risk", difficulty: "hard" }
            ]
        },

        2: {
            level: 2, name: "Governance & Capital Impact",
            subtitle: "CET1, OpRisk, BCBS 239, MRM, Data Lineage",
            theme_color: "#eab308",
            questions: [
                { id: "L2-001", question: "The CET1 (Common Equity Tier 1) ratio measures:", choices: ["A bank's short-term liquidity", "A bank's high-quality core capital / risk-weighted assets", "An institution's gross financial leverage", "The coverage rate of expected losses (EL)"], correct: 1, explanation: "CET1 = core capital (common shares + reserves) / RWA. Basel III imposes a minimum of 4.5% + a 2.5% conservation buffer.", theme: "Capital Adequacy", difficulty: "medium" },
                { id: "L2-002", question: "OpRisk (Operational Risk) in Basel III includes:", choices: ["Only losses due to external cyberattacks", "Losses resulting from failed internal processes, people, systems, or external events", "Exclusively documentary fraud", "Market losses on open positions"], correct: 1, explanation: "OpRisk covers: internal/external fraud, HR practices, physical asset damage, system interruptions, failed execution. DLTs are exposed to these.", theme: "Operational Risk", difficulty: "medium" },
                { id: "L2-003", question: "BCBS 239 focuses on:", choices: ["Capital requirements for crypto exposures", "Risk data aggregation and risk reporting principles (RDARR)", "LCR/NSFR liquidity framework for systemic banks", "Counterparty credit risk (CCR) weighting"], correct: 1, explanation: "BCBS 239 imposes principles on G-SIBs for governance, data architecture, and reporting capabilities for robust and rapid risk aggregation.", theme: "BCBS 239", difficulty: "hard" },
                { id: "L2-004", question: "Model Risk Management (MRM) aims to:", choices: ["Maximize the performance of algorithmic trading models", "Identify, measure, and control risks related to the use of quantitative models", "Automate the review of regulatory financial statements", "Replace stress tests with Monte Carlo simulations"], correct: 1, explanation: "MRM frameworks cover the full model lifecycle: development, validation, deployment, monitoring, retirement. SR 11-7 (Fed) and EBA Guidelines are key references.", theme: "Model Risk", difficulty: "hard" },
                { id: "L2-005", question: "A tokenized asset on DLT can impact CET1 because:", choices: ["It automatically reduces RWA thanks to blockchain transparency", "Its classification as Basel III Group 2b imposes a 1250% weighting", "It is excluded from the prudential scope of EU banks", "It does not generate counterparty risk"], correct: 1, explanation: "A non-compliant DLT asset (BCBS Group 2b) receives a 1250% weighting, equivalent to a direct euro-for-euro deduction from CET1.", theme: "Capital Adequacy", difficulty: "hard" },
                { id: "L2-006", question: "The SREP (Supervisory Review and Evaluation Process) evaluates:", choices: ["MiCA compliance of European CASPs", "Additional capital needs beyond Pillar 1 minimums", "Resilience of IT systems to cyberattacks", "Quality of external bank audits"], correct: 1, explanation: "The ECB/EBA SREP evaluates the business model, governance, Pillar 2 risks, and liquidity, and can impose additional Pillar 2 requirements (P2R/P2G).", theme: "Supervision", difficulty: "hard" },
                { id: "L2-007", question: "Data lineage in the BCBS 239 context refers to:", choices: ["Complete traceability of the risk data lifecycle (origin, transformations, destination)", "Regulatory archiving of risk reports for 7 years", "The back-office data validation process", "ISO certification of data management systems"], correct: 0, explanation: "BCBS 239 requires each risk data point to be traceable from its source to its final use — a critical condition for validating model integrity.", theme: "BCBS 239", difficulty: "medium" },
                { id: "L2-008", question: "The LCR (Liquidity Coverage Ratio) measures:", choices: ["Tier 1 capital level over risk-weighted assets", "A bank's ability to cover its net cash outflows over 30 days with HQLA", "The ratio between stable deposits and long-term loans", "Maximum exposure to a single borrower"], correct: 1, explanation: "LCR = HQLA / net outflows over 30 days ≥ 100%. Tests resilience to a short-term liquidity shock.", theme: "Liquidity Risk", difficulty: "medium" },
                { id: "L2-009", question: "In the context of EBA stress tests, the primary objective is:", choices: ["Maximize income during volatility periods", "Evaluate the resilience of bank capital under adverse macroeconomic scenarios", "Test the robustness of production IT systems", "Verify GDPR compliance of customer databases"], correct: 1, explanation: "EBA stress tests project CET1 over 3 years under a baseline scenario and an adverse scenario defined by EBA/ESRB.", theme: "Stress Testing", difficulty: "medium" },
                { id: "L2-010", question: "Counterparty risk (CCR) on a DeFi smart contract is:", choices: ["Zero because smart contracts execute automatically", "Present via exposure to the protocol and its collateral, replacing the human counterparty", "Entirely covered by gas fee guarantees", "Identical to credit risk on a traditional bank loan"], correct: 1, explanation: "In DeFi, counterparty risk transforms into protocol and collateral risk — subject to adapted CCR weighting rules.", theme: "Counterparty Risk", difficulty: "hard" },
                { id: "L2-011", question: "Independent 'model validation' (SR 11-7) requires:", choices: ["Validation by the model development team", "A review by a function independent of the one that develops and uses the model", "A mandatory annual audit by an external firm", "ISO 27001 certification of the model and its data"], correct: 1, explanation: "SR 11-7 imposes a strict separation between developers and validators. Validation must evaluate the design, data, implementation, and monitoring.", theme: "Model Risk", difficulty: "hard" },
                { id: "L2-012", question: "The counter-cyclical buffer (CCyB) aims to:", choices: ["Increase bank capital during expansion phases to absorb losses in recession", "Reduce capital requirements during crises to support credit", "Replace the Basel III conservation buffer", "Finance DGS (deposit guarantee schemes)"], correct: 0, explanation: "The CCyB (up to 2.5% of RWA) is activated during periods of excessive credit growth and released during crises to absorb losses without restricting credit.", theme: "Capital Adequacy", difficulty: "medium" },
                { id: "L2-013", question: "Market risk on Group 1a tokenized assets (BCBS 2022) is:", choices: ["Treated identically to traditional financial assets under Basel III", "Excluded from capital requirements for Basel IV", "Subject to a 1250% weighting by default", "Not applicable to banks operating under MiCA"], correct: 0, explanation: "Group 1a digital assets (tokenization of traditional assets meeting BCBS criteria) receive the same weightings as their traditional counterparts.", theme: "Capital Adequacy", difficulty: "hard" },
                { id: "L2-014", question: "The 'Risk Appetite Framework' (RAF) concept refers to:", choices: ["The maximum amount of losses an institution accepts to take to achieve its objectives", "The technical level of error tolerance for IT systems", "An automatic RWA calculation tool", "The list of financial products authorized by the regulator"], correct: 0, explanation: "The RAF defines risk appetite (desired risk), risk tolerance (limits), and risk capacity (maximum absorbable) — a pillar of risk governance.", theme: "Risk Governance", difficulty: "medium" },
                { id: "L2-015", question: "ICAAP (Internal Capital Adequacy Assessment Process) is:", choices: ["The internal process by which a bank assesses its total capital need", "A scoring model for SME clients", "The accounting reporting procedure for doubtful debts", "A MiCA compliance benchmarking tool"], correct: 0, explanation: "ICAAP, Pillar 2 of Basel, requires banks to self-assess their capital adequacy, including risks not covered by Pillar 1.", theme: "Capital Adequacy", difficulty: "medium" },
                { id: "L2-016", question: "The RWA weighting for operational risk under the Basel IV SA (Standardised Approach) is based on:", choices: ["The number of operational incidents reported in the last 3 years", "The bank's Business Indicator (BI) — a revenue-based indicator", "Gross historical losses divided by Tier 1 capital", "The volume of daily transactions in value"], correct: 1, explanation: "Basel IV (2023) replaces AMA approaches with a single SA based on the BI, with multipliers based on historical losses.", theme: "Operational Risk", difficulty: "hard" },
                { id: "L2-017", question: "The 'four eyes principle' in risk governance means:", choices: ["Four levels of approval for any commitment over €1M", "Every important decision must be reviewed and approved by at least two people", "A committee of at least 4 people for risk management", "Mandatory annual double internal and external audit"], correct: 1, explanation: "This dual-review control principle reduces the risk of error or fraud in critical decisions — a fundamental pillar of internal governance.", theme: "Risk Governance", difficulty: "easy" },
                { id: "L2-018", question: "Reputational risk related to crypto exposure for a bank includes:", choices: ["Only the risk of direct loss on assets held", "The potential negative impact on the trust of customers and partners in case of hack or scandal", "P&L trading volatility related to crypto prices", "Tax risk of recharacterization of crypto gains"], correct: 1, explanation: "Crypto reputational risk can trigger bank runs, affect ratings, and generate a crisis of confidence — distinct from direct financial risk.", theme: "Reputational Risk", difficulty: "medium" },
                { id: "L2-019", question: "The NSFR (Net Stable Funding Ratio) aims to:", choices: ["Measure short-term liquidity over 30 days", "Ensure stable long-term funding (1 year) of illiquid assets", "Control gross financial leverage", "Regulate the loan-to-deposit ratio"], correct: 1, explanation: "NSFR = ASF / RSF ≥ 100%. Ensures a bank finances its illiquid assets with resources stable for more than one year.", theme: "Liquidity Risk", difficulty: "medium" },
                { id: "L2-020", question: "In an internal VaR (Value at Risk) model, backtesting consists of:", choices: ["Testing the model on hypothetical future scenarios", "Comparing actual ex-post losses to model predictions over a historical period", "Recalibrating model parameters according to new market data", "Verifying model compliance with Pillar 2 regulatory requirements"], correct: 1, explanation: "Backtesting compares realized losses to VaR estimates over 250 business days. More than 4 exceptions trigger a regulatory review (Basel red zone).", theme: "Model Risk", difficulty: "hard" },
                { id: "L2-021", question: "Concentration risk under Basel III Pillar 2 covers:", choices: ["Diversification of assets in a DeFi portfolio", "Excessive exposures to a single borrower, sector, or geographical area", "Exposure to illiquid crypto-assets only", "Remuneration limits for high-risk traders"], correct: 1, explanation: "Concentration risk (large exposures, sector, geography) is managed outside Pillar 1 and can generate additional Pillar 2 requirements through SREP.", theme: "Concentration Risk", difficulty: "medium" },
                { id: "L2-022", question: "Funding liquidity risk materializes when:", choices: ["Market spreads widen abruptly", "An institution cannot refinance its maturing obligations at a reasonable cost", "Assets are sold at prices below their book value", "The CET1 ratio falls below the regulatory threshold"], correct: 1, explanation: "Funding liquidity risk occurs when a bank cannot roll over its debt or must do so at significantly degraded conditions — e.g., SVB 2023.", theme: "Liquidity Risk", difficulty: "medium" },
                { id: "L2-023", question: "G-SIBs (Globally Systemically Important Banks) are subject to:", choices: ["Additional CET1 requirements (G-SIB buffer) ranging from 1% to 3.5%", "Same Basel III requirements as domestic banks", "Exemption from EBA stress tests", "Reduced LCR ratio of 80% during crisis periods"], correct: 0, explanation: "G-SIBs receive an additional systemic buffer (G-SIB surcharge) of 1% to 3.5% based on their systemic risk category (buckets 1 to 5).", theme: "Systemic Risk", difficulty: "hard" },
                { id: "L2-024", question: "Basel III Pillar 3 requires banks to:", choices: ["Mandatory quarterly stress tests", "Publish information about their risks, capital, and governance", "Monthly reporting to the national regulator", "External certification of all internal models"], correct: 1, explanation: "Pillar 3 (market discipline) requires banks to publish Risk Reports allowing market participants to assess their risk profile.", theme: "Supervision", difficulty: "medium" },
                { id: "L2-025", question: "The 'sensitivity' of a bond portfolio to duration measures:", choices: ["Correlation between sovereign bonds and risky assets", "Portfolio value variation for a 1% change in interest rates", "Weighted default risk of issuers", "Weighted average credit spread of the portfolio"], correct: 1, explanation: "Duration (time-weighted) × portfolio value × Δrate = estimated loss/gain. Critical capital for interest rate risk in the banking book (IRRBB).", theme: "Market Risk", difficulty: "medium" },
                { id: "L2-026", question: "RWA (Risk-Weighted Asset) for corporate exposures under the standardized method is calculated:", choices: ["According to the bank's internal IRB rating", "Via fixed weightings based on the counterparty's external rating (from 20% to 150%)", "By a Monte Carlo simulation model of defaults", "Based on the borrower's transaction volume over 12 months"], correct: 1, explanation: "In the Basel IV standardized approach, corporate weightings range from 20% (AAA-AA) to 150% (< B-), based on recognized agency ratings (ECAI).", theme: "Credit Risk", difficulty: "hard" },
                { id: "L2-027", question: "An institutional DLT can improve BCBS 239 compliance by:", choices: ["Removing the need for a Chief Data Officer", "Offering native data traceability and real-time reconciliation", "Replacing VaR models with on-chain calculations", "Avoiding reconciliation requirements due to blockchain transparency"], correct: 1, explanation: "The immutable and auditable nature of a DLT facilitates risk data lineage, improving RDARR capabilities required by BCBS 239.", theme: "BCBS 239", difficulty: "hard" },
                { id: "L2-028", question: "ESG risk in Pillar 2 (ECB, 2022) requires banks to:", choices: ["Exclude all fossil assets from their balance sheet by 2030", "Integrate climate and environmental risks into their risk management and ICAAP", "Publish a monthly certified carbon report", "Maintain a green ratio of at least 30% of their assets"], correct: 1, explanation: "Since 2022, the ECB has required banks to integrate ESG risks (physical and transition) into their ICAAP, ILAAP, and stress testing processes.", theme: "ESG Risk", difficulty: "medium" },
                { id: "L2-029", question: "Step-in risk (Basel III, 2017) concerns:", choices: ["The risk that a bank is forced to financially support a distressed off-balance sheet entity", "The risk of default when renewing a credit facility", "The probability that a borrower increases their drawdown on a credit line", "The risk of early repayment of a loan portfolio"], correct: 0, explanation: "Step-in risk: a bank may be compelled (for reputational reasons) to support off-balance sheet vehicles — requires an analysis of the relationship.", theme: "Operational Risk", difficulty: "hard" },
                { id: "L2-030", question: "The Basel III Leverage Ratio is defined as:", choices: ["Tier 1 Capital / Total exposures (on-balance sheet + off-balance sheet)", "CET1 / Total RWA", "Total Capital / Total balance sheet assets", "Tier 2 / market risk-weighted assets"], correct: 0, explanation: "LR = Tier 1 / Total Exposure Measure ≥ 3% (4% for G-SIBs). Serves as a non-risk-based backstop to RWA models.", theme: "Capital Adequacy", difficulty: "medium" }
            ]
        },

        3: {
            level: 3, name: "Regulatory Mapping",
            subtitle: "SR 11-7, DORA Art.11, MiCA enforcement, ICT 3rd-party risk",
            theme_color: "#f97316",
            questions: [
                { id: "L3-001", question: "Article 11 of DORA specifically imposes:", choices: ["Annual certification of CASPs by ESMA", "Advanced operational resilience testing (TLPT) for the most important entities", "Prohibition of cloud solutions for critical financial systems", "Monthly reporting of ICT incidents to the national regulator"], correct: 1, explanation: "DORA Art.11 establishes Threat-Led Penetration Tests (TLPT) — mandatory advanced resilience tests for financial entities designated by regulators.", theme: "DORA", difficulty: "hard" },
                { id: "L3-002", question: "Under MiCA, a serious infringement by a CASP can lead to:", choices: ["Only a fine capped at €500,000", "Withdrawal of authorization and/or a periodic penalty payment of 5% of average daily turnover", "A formal warning without financial sanction", "Automatic 30-day business suspension"], correct: 1, explanation: "MiCA (Art. 111-115) provides for administrative sanctions, including withdrawal of authorization, periodic penalties, and fines of up to 12.5% of annual turnover for ARTs.", theme: "MiCA", difficulty: "hard" },
                { id: "L3-003", question: "SR 11-7 (Federal Reserve, 2011) applies to:", choices: ["Crypto-exchanges operating in the USA", "Management and validation of quantitative models in supervised financial institutions", "US dollar cross-border payment systems", "Data governance of US deposit banks"], correct: 1, explanation: "SR 11-7 (Supervisory Guidance on Model Risk Management) defines standards for development, validation, and governance of models for Fed-supervised banks.", theme: "Model Risk", difficulty: "hard" },
                { id: "L3-004", question: "DORA requires financial entities to have an ICT information register containing:", choices: ["Contact details of all cloud providers used", "A complete and up-to-date mapping of all third-party ICT arrangements", "Logs of all IT transactions over 5 years", "Annual budget dedicated to cybersecurity"], correct: 1, explanation: "DORA Art.28 imposes an exhaustive register of contracts and third-party ICT dependencies, accessible at any time to competent authorities.", theme: "DORA", difficulty: "medium" },
                { id: "L3-005", question: "The 'Travel Rule' (FATF Recommendation 16) applied to crypto requires:", choices: ["CASPs to send sender and beneficiary information during crypto transfers", "Crypto exchanges to publish their transaction flows in real-time", "Hardware wallets to register with an AML authority", "Stablecoins to track their backing in real-time on-chain"], correct: 0, explanation: "The Travel Rule requires VASPs/CASPs to transmit KYC data of the sender and receiver for transfers ≥ €1000, aligning crypto with SWIFT standards.", theme: "AML / Travel Rule", difficulty: "medium" },
                { id: "L3-006", question: "The EBA Guidelines on ICT and Security Risk Management impose:", choices: ["Prohibition of SaaS solutions for critical banking functions", "Minimum requirements for IT security, continuity, and governance for financial institutions", "Mandatory ISO 27001 certification for all EU banks", "A maximum ratio of 20% IT outsourcing"], correct: 1, explanation: "The EBA ICT Guidelines (2022, partially replaced by DORA) define requirements for security, incident management, BCM, and third-party IT control.", theme: "EBA Guidelines", difficulty: "medium" },
                { id: "L3-007", question: "MiCA distinguishes three categories of crypto intermediaries subject to authorization:", choices: ["CASP, ART Issuers, E-Money Token Issuers", "VASP, Stablecoin Operators, DeFi Protocols", "Crypto Broker, Crypto Exchange, Crypto Custodian", "ISDA, CCP, CASP"], correct: 0, explanation: "MiCA differentiates: (1) CASPs for services (exchange, custody, advice), (2) ART issuers (asset-referenced tokens), (3) EMT issuers (e-money tokens referenced to a currency).", theme: "MiCA", difficulty: "medium" },
                { id: "L3-008", question: "The 'proportionality' principle in DORA means:", choices: ["That all financial entities apply the same ICT measures", "That requirements adapt to the size, complexity, and risk profile of the entity", "That small entities are exempt from DORA", "That ICT requirements are proportional to the IT budget"], correct: 1, explanation: "DORA Art.4 applies the proportionality principle: micro-enterprises and small entities benefit from lighter regimes on certain requirements.", theme: "DORA", difficulty: "medium" },
                { id: "L3-009", question: "The eIDAS 2.0 regulation impacts decentralized finance by:", choices: ["Imposing a verifiable digital identity on all EU crypto wallets", "Creating a framework for digital identities that can integrate into wallets and DeFi KYC", "Prohibiting the use of pseudonyms on public blockchains", "Establishing a central EU register of DeFi addresses"], correct: 1, explanation: "eIDAS 2.0 establishes the European Digital Identity Wallet — potentially integrable into DLT protocols for compliant on-chain KYC.", theme: "Digital Identity", difficulty: "hard" },
                { id: "L3-010", question: "The AMLD6 directive (6th AML Directive) expands the list of predicate offenses:", choices: ["By adding cybercrime and environmental crimes", "By limiting the AML scope to only transactions > €10,000", "By creating a centralized register of beneficial owners", "By imposing criminal sanctions on compliance officers"], correct: 0, explanation: "AMLD6 harmonizes and extends predicate offenses (crimes at the origin of money laundering), including cybercrime and environmental crimes.", theme: "AML / Travel Rule", difficulty: "hard" },
                { id: "L3-011", question: "In DORA, a 'major ICT incident' must be notified:", choices: ["Within 72 hours to the competent authority (initial report)", "Initial report within 4 hours (or 24 max), intermediate report within 72 hours, final report within one month", "Real-time to the ECB and EBA simultaneously", "Within 5 business days following detection"], correct: 1, explanation: "DORA (Art.19) imposes: initial report within 4 hours (or 24 max), intermediate report within 72 hours, final report within one month.", theme: "DORA", difficulty: "hard" },
                { id: "L3-012", question: "The MiCA regulation imposes on ART (Asset-Referenced Tokens) issuers:", choices: ["Standard CASP authorization without additional requirements", "Full banking authorization from the ECB", "Specific authorization with reserve, governance, and quarterly reporting requirements", "Simple declaration to ESMA without prior review"], correct: 2, explanation: "ART issuers (stablecoins backed by a basket of assets) must obtain specific authorization, maintain qualified reserves, and apply strict governance rules.", theme: "MiCA", difficulty: "hard" },
                { id: "L3-013", question: "The DORA Critical ICT Third-Party Provider (CTPP) refers to:", choices: ["Any cloud provider operating in the EU", "ICT providers whose failure would have a systemic impact on several financial entities", "IT subcontractors of a G-SIB bank", "Risk software editors supervised by the EBA"], correct: 1, explanation: "CTPPs (cloud providers, data analytics, etc.) are directly supervised by ESAs under DORA, with access to premises and audits.", theme: "DORA", difficulty: "hard" },
                { id: "L3-014", question: "SFDR (Sustainable Finance Disclosure Regulation) requires management companies to:", choices: ["Obtain a mandatory ESG label for any crypto fund", "Disclose ESG risks and negative impacts of their financial products", "Mandatory exclusion of carbon-intensive assets", "Separate crypto reporting under Article 6, 8, or 9"], correct: 1, explanation: "SFDR classifies funds into Articles 6, 8 (promotes ESG characteristics), and 9 (sustainable investment). Sustainability risks must be disclosed.", theme: "ESG Regulation", difficulty: "medium" },
                { id: "L3-015", question: "The UBO (Ultimate Beneficial Owner) Register under AMLD5:", choices: ["Is accessible only to judicial authorities upon request", "Is public for companies and accessible to entities with legitimate interest for trusts", "Is managed exclusively by the ECB", "Concerns only companies exceeding €50M in turnover"], correct: 1, explanation: "AMLD5 makes the UBO register of companies public, and that of trusts accessible to persons with a demonstrable legitimate interest.", theme: "AML / Travel Rule", difficulty: "medium" },
                { id: "L3-016", question: "Under DORA, 'Digital Operational Resilience Testing' mandatory includes:", choices: ["Quarterly financial stress tests", "Annual basic tests (vulnerability, network) and periodic TLPT for designated entities", "A monthly red team exercise on production systems", "A full BCP recovery test on secondary sites every 6 months"], correct: 1, explanation: "DORA Art.24-27 imposes: annual mandatory basic tests + TLPT every 3 years minimum for significant entities designated by authorities.", theme: "DORA", difficulty: "hard" },
                { id: "L3-017", question: "The reporting obligation under Pillar 3 COREP/FINREP is:", choices: ["Quarterly for large institutions, annual for others", "Monthly for all European credit institutions", "Uniformly defined at a quarterly frequency for all", "Variable according to risk: monthly for liquidity, quarterly for capital, annual for remuneration"], correct: 3, explanation: "COREP/FINREP: LCR monthly, capital/credit/market quarterly, NSFR quarterly, remuneration and leverage annual — per EBA ITS calendar.", theme: "Regulatory Reporting", difficulty: "hard" },
                { id: "L3-018", question: "The EMIR (European Market Infrastructure Regulation) applies to:", choices: ["CASP issuers of commodity-backed tokens", "Counterparties to OTC derivatives with central clearing and reporting obligations", "Pension funds investing in digital assets", "Banks issuing tokenized bonds"], correct: 1, explanation: "EMIR imposes: central clearing of standardized OTC derivatives via CCP, trade repository reporting, collateral management, and MPOR for non-cleared derivatives.", theme: "Derivatives Regulation", difficulty: "medium" },
                { id: "L3-019", question: "MiCA requires a crypto 'whitepaper' which must mandatory contain:", choices: ["A 10-year financial projection validated by an auditor", "Token characteristics, holder rights, risks, underlying protocol, and issuer identity", "A full prospectus in ESMA Retail Investor Protection format", "Only technical information without commercial data"], correct: 1, explanation: "The MiCA whitepaper (Art.5-22) must cover: issuer description, project, token, rights, risks, offer conditions. It binds the issuer's liability.", theme: "MiCA", difficulty: "medium" },
                { id: "L3-020", question: "Under DORA, minimum contractual clauses with ICT third parties must include:", choices: ["An audit right, defined SLAs, exit plans, and security requirements", "Only a 99.9% availability SLA and a confidentiality clause", "Mandatory cyber insurance taken out by the provider", "Source code escrow for all outsourced applications"], correct: 0, explanation: "DORA Art.30 lists mandatory clauses: audit rights, service level, data security, continuity, data location, exit strategy.", theme: "DORA", difficulty: "medium" },
                { id: "L3-021", question: "CSDR (Central Securities Depositories Regulation) impacts DLT because:", choices: ["It prohibits settlement in crypto-assets", "It requires financial securities to be held in an authorized CSD, challenging direct DLT custody", "It creates a framework for CSDs operating public blockchains", "It has no impact on tokenized assets"], correct: 1, explanation: "CSDR requires registration of securities in authorized CSDs — a direct challenge for tokenized securities held in self-custody.", theme: "Securities Regulation", difficulty: "hard" },
                { id: "L3-022", question: "The NIS2 directive (Network and Information Security) imposes on essential entities:", choices: ["A certified annual CISA cybersecurity audit", "Security measures, incident management, and an obligation to notify significant incidents", "Mandatory hosting on EU servers", "A minimum cybersecurity budget of 2% of turnover"], correct: 1, explanation: "NIS2 (Oct 2024) extends NIS1 to more sectors (including finance), imposes cyber risk management, incident notification (24h/72h/1month), and officer liability.", theme: "Cybersecurity Regulation", difficulty: "medium" },
                { id: "L3-023", question: "GDPR (General Data Protection Regulation) in tension with public blockchain poses a problem because:", choices: ["Public blockchains are prohibited in the EU under GDPR", "The right to erasure ('right to be forgotten') is technically incompatible with blockchain immutability", "Validators must obtain consent from each user", "Gas fees constitute non-consensual processing of personal data"], correct: 1, explanation: "Blockchain immutability prevents effective erasure of personal data — a fundamental tension with Art.17 GDPR, partially resolved by encryption or hashing.", theme: "Data Privacy", difficulty: "medium" },
                { id: "L3-024", question: "The DLT Pilot Regime (EU Regulation 2022/858) creates:", choices: ["A permanent regime for tokenized securities in the EU", "A temporary pilot regime allowing DLT market infrastructures to operate under regulatory exemptions", "A mandatory blockchain CSD managed by ESMA", "A European guarantee fund for tokenized security holders"], correct: 1, explanation: "The DLT Pilot Regime creates a sandbox where DLT MTFs, SSs, and CSDs can operate with exemptions from MiFID/CSDR rules for 6 years.", theme: "DLT Regulation", difficulty: "hard" },
                { id: "L3-025", question: "Under MiCA, 'significant' stablecoins (significant ART/EMT) are defined by:", choices: ["A transaction volume greater than €10M/day", "Three criteria including 10M users, €5B value, or operations in at least 7 Member States", "Only market capitalization > €1B", "Discretionary decision of the European Parliament"], correct: 1, explanation: "MiCA Art.43: ART/EMT becomes 'significant' if ≥2 criteria: 10M holders, €5B reserve value, €500M transactions/day, presence in 7 EM min.", theme: "MiCA", difficulty: "hard" },
                { id: "L3-026", question: "The 'Supplier Code of Conduct' in a DORA-compliant ICT policy must cover:", choices: ["Only pricing aspects and penalties", "Security clauses, subcontracting, audit rights, and provider continuity obligations", "Technical specifications of externalized system APIs", "Required background and competence of provider teams"], correct: 1, explanation: "A DORA-compliant SCoC integrates: minimum security, subcontracting chain, audit rights, incident notification, continuity — binding the entire chain.", theme: "DORA", difficulty: "medium" },
                { id: "L3-027", question: "The MiCA regulation partially exempts:", choices: ["Algorithmic stablecoins from reserve requirements", "Unique NFTs from whitepaper obligations if non-fungible", "CEX (centralized exchanges) registered before 2021", "DeFi protocols if their code is open source"], correct: 1, explanation: "MiCA exempts unique NFTs (non-fungible, no equivalent) from its provisions — but is subject to reassessment if large series are issued.", theme: "MiCA", difficulty: "hard" },
                { id: "L3-028", question: "MiFID II impacts token securities because:", choices: ["It applies directly to all tokens without distinction", "Security tokens (assimilated to financial instruments) fall under its scope, managing markets and intermediaries", "It exempts digital assets from any transparency obligation", "It imposes a 100% weighting for any crypto asset in portfolio"], correct: 1, explanation: "A security token is a MiFID II financial instrument if it represents similar rights (share, debt, derivative). This triggers prospectus, transparency, and reporting.", theme: "Securities Regulation", difficulty: "hard" },
                { id: "L3-029", question: "Under DORA, the 'exit strategy' with a CTP designates:", choices: ["The termination plan for IT teams in case of bankruptcy", "The plan allowing migration of critical functions to another provider without major interruption", "The data archiving process at the end of the contract", "The unilateral termination procedure in case of a serious incident"], correct: 1, explanation: "DORA Art.28 requires a documented exit strategy: ability to migrate critical functions, without excessive dependence, with service continuity — anti lock-in.", theme: "DORA", difficulty: "medium" },
                { id: "L3-030", question: "The 'substance over form' principle in financial regulation means:", choices: ["That the economic substance of an instrument determines its regulatory treatment, not its legal form", "That banks can choose the most advantageous legal form", "That DLT assets are exempt if their code is published", "That MiCA prevails over any national regulation of Member States"], correct: 0, explanation: "'Substance over form': if a crypto token has the economic characteristics of a transferable security, it will be treated as such, regardless of the chosen label — EBA/ESMA position.", theme: "Regulatory Principles", difficulty: "hard" }
            ]
        },

        4: {
            level: 4, name: "Infrastructure & Deployment",
            subtitle: "Canton Network, HSM, Node Topology, Cloud ICT, DR/BCP",
            theme_color: "#8b5cf6",
            questions: [
                { id: "L4-001", question: "Canton Network distinguishes itself from other permissioned DLTs by:", choices: ["Its use of PoW consensus for transaction validation", "Its native interoperability between isolated sub-ledgers with granular privacy", "Its full-public architecture similar to Ethereum", "Its replacement of smart contracts with SQL rules"], correct: 1, explanation: "Canton allows distinct entities to have their own confidential sub-ledgers while guaranteeing transaction atomicity across ledgers — key for institutional finance.", theme: "DLT Infrastructure", difficulty: "hard" },
                { id: "L4-002", question: "An HSM (Hardware Security Module) in DLT infrastructure primarily serves to:", choices: ["Accelerate blockchain transaction processing", "Protect private cryptographic keys via certified hardware (FIPS 140-2/3)", "Compress blocks to reduce on-chain storage", "Validate AML compliance of transactions in real-time"], correct: 1, explanation: "HSMs ensure secure generation, storage, and use of private keys in an inviolable hardware environment — mandatory for institutional custodians.", theme: "Key Management", difficulty: "medium" },
                { id: "L4-003", question: "A 'hub-and-spoke' topology in an institutional DLT network implies:", choices: ["All nodes connected directly to each other in a full mesh", "A central node (hub) connecting peripheral participants (spokes) coordinating transactions", "Nodes organized in rings with circular consensus", "A purely peer-to-peer architecture without a coordinator node"], correct: 1, explanation: "Hub-and-spoke reduces network complexity and centralizes coordination while maintaining DLT benefits — chosen by SWIFT GPI and some CBDC networks.", theme: "Network Architecture", difficulty: "medium" },
                { id: "L4-004", question: "TLS 1.3 in a DLT infrastructure is necessary to:", choices: ["Encrypt on-chain transactions to make them confidential", "Secure communications between network nodes (transport layer)", "Replace the cryptographic consensus mechanism", "Compress blockchain headers to optimize bandwidth"], correct: 1, explanation: "TLS 1.3 (with forward secrecy) encrypts node-to-node communications, preventing interception and man-in-the-middle — required by DORA for critical ICT communications.", theme: "Network Security", difficulty: "medium" },
                { id: "L4-005", question: "In a high-availability DLT node architecture, RPO (Recovery Point Objective) defines:", choices: ["The maximum acceptable time to resume operations after an incident", "The maximum amount of data that can be lost (expressed in time) during a disruption", "The minimum number of nodes required to maintain consensus", "The frequency of blockchain state backups"], correct: 1, explanation: "RPO = maximum tolerated data loss. An RPO of 0 means no loss tolerated — achieved via synchronous replication between datacenters. Distinct from RTO (recovery time).", theme: "Disaster Recovery", difficulty: "medium" },
                { id: "L4-006", question: "Transaction finality in a DLT network means:", choices: ["The transaction has been broadcast to all network nodes", "The transaction is irreversible and cannot be cancelled or reorganized", "The transaction has reached the minimum confirmation of 6 blocks", "The transaction has been validated by at least one validator node"], correct: 1, explanation: "Probabilistic finality (Bitcoin) versus deterministic finality (Tendermint/PBFT) is critical in finance: a bank cannot deliver assets without proof of irreversibility.", theme: "Consensus & Finality", difficulty: "hard" },
                { id: "L4-007", question: "BFT (Byzantine Fault Tolerance) in a consensus protocol guarantees:", choices: ["A performance of 100,000 TPS in a distributed network", "Consensus even if up to 1/3 of nodes are faulty or malicious", "Complete anonymity of validators in a permissioned network", "Automatic compatibility with ERC-20 and ERC-721 standards"], correct: 1, explanation: "BFT (e.g., PBFT, Tendermint, HotStuff) tolerates n/3 byzantine nodes (faulty or malicious). Fundamental for institutional permissioned networks.", theme: "Consensus & Finality", difficulty: "hard" },
                { id: "L4-008", question: "An 'upgradeable' smart contract via proxy pattern presents a risk because:", choices: ["It consumes 3x more gas than a standard contract", "The proxy administrator can change the contract logic, compromising immutability", "It is incompatible with ERC-20 and ERC-721 standards", "It requires a TLPT-type validation under DORA"], correct: 1, explanation: "The proxy pattern (OpenZeppelin) allows upgrades but concentrates a governance risk: the proxy owner can change the logic — a key risk for institutional auditors.", theme: "Smart Contract Architecture", difficulty: "hard" },
                { id: "L4-009", question: "'Sharding' in a blockchain aims to:", choices: ["Divide private keys to strengthen cryptographic security", "Partition the blockchain into parallel sub-chains to improve scalability", "Compress old blocks to reduce storage", "Isolate confidential transactions in secure enclaves"], correct: 1, explanation: "Sharding (e.g., Ethereum 2.0, Near) divides state and transactions among sub-groups of validators (shards), allowing parallel processing and increasing throughput.", theme: "Scalability", difficulty: "hard" },
                { id: "L4-010", question: "The atomicity property in a cross-ledger DLT transaction (e.g., tokenized DVP) means:", choices: ["The transaction is indivisible: either fully executed or fully cancelled", "The transaction is executed in less than one millisecond", "The transaction can involve only two counterparties maximum", "The transaction is automatically validated without human intervention"], correct: 0, explanation: "Atomicity guarantees DVP (Delivery vs Payment): both legs execute simultaneously or not at all, eliminating settlement risk — central to institutional use cases.", theme: "Transaction Properties", difficulty: "medium" },
                { id: "L4-011", question: "A 'validator node' in a permissioned network (e.g., SWIAT, Canton) should ideally be operated by:", choices: ["Any participant wishing to join the network", "Identified entities, legally responsible and approved by network governance", "Only the regulatory central bank", "Anonymous entities to guarantee decentralization"], correct: 1, explanation: "In institutional permissioned networks, validators are authorized entities (banks, administrations) committed by contract — guaranteeing accountability and compliance.", theme: "Network Governance", difficulty: "medium" },
                { id: "L4-012", question: "Zero-knowledge proof (ZKP) in a DLT context allows for:", choices: ["Accelerating consensus by eliminating slow nodes", "Proving the validity of information without revealing the information itself", "Compressing transactions to reduce gas fees", "Automating AML compliance via on-chain algorithms"], correct: 1, explanation: "ZKP (ZK-SNARKs, STARKs) allow proving that a transaction respects rules without revealing amounts or parties — privacy-compliant in a regulatory context.", theme: "Cryptography", difficulty: "hard" },
                { id: "L4-013", question: "A 'multi-cloud' architecture for an institutional DLT node offers:", choices: ["A systematic reduction of infrastructure costs by 40%", "Resilience against single cloud provider failure and avoidance of lock-in", "Better consensus performance thanks to cloud parallelism", "Automatic DORA compliance for third-party ICT"], correct: 1, explanation: "Multi-cloud (AWS + Azure + GCP) reduces single-provider dependency risk, improves resilience, and meets DORA requirements on ICT risk concentration.", theme: "Cloud Architecture", difficulty: "medium" },
                { id: "L4-014", question: "PBFT (Practical Byzantine Fault Tolerance) consensus is suitable for institutions because:", choices: ["It offers unlimited throughput with zero latency", "It achieves deterministic finality in O(n²) messages between a limited number of known nodes", "It works with thousands of anonymous validators", "It is natively compatible with ISO 20022 standards"], correct: 1, explanation: "PBFT guarantees finality in 2-3 communication rounds between known nodes — suitable for institutional consortiums where n < 100 nodes for performance reasons.", theme: "Consensus & Finality", difficulty: "hard" },
                { id: "L4-015", question: "A 'private channel' in Hyperledger Fabric allows:", choices: ["Encrypting all transactions on the main blockchain", "A subset of members to conduct confidential transactions invisible to other members", "Accelerating consensus by isolating high-frequency transactions", "Creating an independent sub-network with its own token"], correct: 1, explanation: "Fabric private channels create bilateral or multilateral sub-ledgers with their own data and transactions — ideal for OTC deal confidentiality.", theme: "DLT Infrastructure", difficulty: "hard" },
                { id: "L4-016", question: "The 'gas limit' of an Ethereum block determines:", choices: ["The maximum price of a transaction in ETH", "The total amount of computation (gas) that can be executed in the block", "The maximum number of transactions per block", "The block propagation delay in the network"], correct: 1, explanation: "The gas limit caps the computational load per block, controlling throughput. Increasing the gas limit increases throughput but also hardware requirements for nodes.", theme: "Blockchain Performance", difficulty: "medium" },
                { id: "L4-017", question: "In a DLT infrastructure, the 'mempool' refers to:", choices: ["Distributed storage of files attached to transactions", "The queue of unconfirmed transactions waiting for inclusion in a block", "The register of network validator nodes", "The P2P communication encryption layer"], correct: 1, explanation: "The mempool (memory pool) temporarily stores broadcasted but not yet mined/validated transactions. Its congestion drives up gas fees.", theme: "Blockchain Performance", difficulty: "easy" },
                { id: "L4-018", question: "A 'Merkle Tree' in a blockchain is used to:", choices: ["Compress transactions via RLE encoding", "Enable fast and efficient verification of transaction integrity without downloading the entire block", "Encrypt communications between validator nodes", "Organize smart contracts by execution priority"], correct: 1, explanation: "The Merkle Tree allows SPV clients (light nodes) to verify if a transaction is included in a block with a logarithmic proof O(log n) instead of O(n).", theme: "Cryptography", difficulty: "medium" },
                { id: "L4-019", question: "A 'TEE (Trusted Execution Environment) oracle' combines:", choices: ["Oracle and HSM for hardware signature of data", "Oracle execution in a secure hardware enclave (Intel SGX, ARM TrustZone) for attested and inviolable data", "Off-chain oracle with a ZKP verification smart contract", "A decentralized oracle with multi-signature consensus"], correct: 1, explanation: "TEE-oracles (e.g., Town Crier, Chainlink Functions) execute in inviolable hardware enclaves, producing hardware-signed data — a higher level of trust.", theme: "Oracle Infrastructure", difficulty: "hard" },
                { id: "L4-020", question: "The finality latency of Ethereum PoS (beacon chain) is approximately:", choices: ["Sub-millisecond thanks to parallel consensus", "12 seconds per slot, economic finality at ~12 minutes (2 epochs)", "500ms thanks to the Gasper validation pipeline", "Identical to the Lightning Network (seconds)"], correct: 1, explanation: "Post-Merge Ethereum: one slot = 12s, one epoch = 32 slots (~6.4 min). Checkpoint finality is reached after 2 epochs (~12 min), insufficient for institutional HFT.", theme: "Consensus & Finality", difficulty: "hard" },
                { id: "L4-021", question: "'Cold wallet' versus 'hot wallet' in institutional custody is distinguished by:", choices: ["The cold wallet is on-chain, the hot wallet off-chain", "The cold wallet stores keys offline (air-gapped), the hot wallet is permanently connected to the network", "The cold wallet uses ED25519 keys, the hot wallet ECDSA keys", "The cold wallet is managed by an HSM, the hot wallet by a TPM"], correct: 1, explanation: "Cold wallets (air-gapped) are reserved for large institutional reserves (≥95% of assets). Hot wallets, connected, manage daily operational liquidity.", theme: "Key Management", difficulty: "easy" },
                { id: "L4-022", question: "Threshold Signature Scheme (TSS) in DLT governance allows for:", choices: ["Signing a transaction only if more than 50% of nodes are online", "Distributing a private key among N parties such that a minimum of k parties is required to sign", "Automating signatures without human intervention", "Creating temporary session keys for smart contracts"], correct: 1, explanation: "TSS (t-of-n): the private key never exists in a single point — each participant holds a shard. Valid signature only with k parties cooperating. Eliminates SPOF.", theme: "Key Management", difficulty: "hard" },
                { id: "L4-023", question: "The ISO 20022 protocol is strategic for institutional DLTs because:", choices: ["It imposes the use of blockchain for SEPA payments", "It standardize the format of financial messages, facilitating interoperability between DLT and legacy systems", "It replaces SWIFT with a standardized DLT network by 2025", "It defines consensus protocols for Eurozone CBDCs"], correct: 1, explanation: "ISO 20022 (Rich Data standard) is the new global financial messaging standard (SEPA, CBDC, SWIFT migration). DLTs integrating it maximize institutional interoperability.", theme: "Interoperability", difficulty: "medium" },
                { id: "L4-024", question: "A 'genesis block' in a permissioned blockchain contains:", choices: ["The first transaction in the network's history", "The initial network configuration: authorized participants, consensus parameters, governance policies", "The list of smart contracts deployed at launch", "The hash of the founding blockchain whitepaper"], correct: 1, explanation: "The genesis block of a permissioned network encodes: initial member identities, consensus parameters, node geography, upgrade policies — its integrity is critical.", theme: "DLT Infrastructure", difficulty: "medium" },
                { id: "L4-025", question: "'State pruning' in a blockchain aims to:", choices: ["Remove obsolete smart contracts from the network", "Reduce database size by removing unnecessary historical intermediate states", "Accelerate consensus by eliminating conflicting states", "Archive old transactions on IPFS"], correct: 1, explanation: "Pruning removes old intermediate Merkle states to reduce disk space for full nodes — critical for the long-term viability of an institutional node.", theme: "Blockchain Performance", difficulty: "hard" },
                { id: "L4-026", question: "In a tokenized DVP (Delivery vs Payment) infrastructure, 'atomic swap' guarantees:", choices: ["Delivery and payment in the same block without settlement risk", "A constant T+0 delay regardless of network congestion", "Complete anonymity of counterparties in the exchange", "No transaction fees for inter-institutional exchanges"], correct: 0, explanation: "Atomic swap ensures that security delivery and payment are indivisible — either both execute or neither. Eliminates principal settlement risk.", theme: "Settlement Infrastructure", difficulty: "medium" },
                { id: "L4-027", question: "'Gossip protocol' used for block propagation in P2P means:", choices: ["A rumor protocol where each node propagates new transactions to its peers randomly", "A block compression protocol to reduce bandwidth", "A probabilistic consensus algorithm based on random voting", "An anti-spam mechanism filtering invalid transactions"], correct: 0, explanation: "The gossip protocol propagates blocks/transactions epidemically: each node shares with k random neighbors — fast and resilient without a central coordinator.", theme: "Network Architecture", difficulty: "medium" },
                { id: "L4-028", question: "A 'nonce' in the Ethereum context (account nonce) is used to:", choices: ["Prevent double-spending attacks by sequentially ordering an account's transactions", "Encrypt transaction content for privacy", "Identify the validator who proposed the block", "Measure mining difficulty in PoW"], correct: 0, explanation: "The account nonce is an incremental counter per address. Each transaction must use the next nonce — prevents replay attacks and double-spend.", theme: "Transaction Properties", difficulty: "medium" },
                { id: "L4-029", question: "'Event sourcing' pattern in a hybrid DLT system (off-chain + on-chain) means:", choices: ["Storing only on-chain events as the source of truth, with derived states being recalculated", "Using Ethereum events to trigger off-chain processes via listeners", "Archiving all Solidity event logs on IPFS", "Synchronizing DLT events with a Kafka message bus"], correct: 0, explanation: "Event sourcing: the current state of the system is always reconstructible from the immutable history of on-chain events — natural alignment with blockchain as an append-only log.", theme: "Architecture Patterns", difficulty: "hard" },
                { id: "L4-030", question: "'Canary deployment' in an institutional smart contract deployment consists of:", choices: ["Performing a formal security audit before any production deployment", "Deploying first to a limited subset of real traffic to validate behavior before generalization", "Using an upgradeable proxy contract for all deployments", "Deploying simultaneously on testnet and mainnet for parallel validation"], correct: 1, explanation: "Canary deployment reduces the risk of a major deployment: a smart contract failure only affects a limited subset before rollback — DLT DevSecOps best practice.", theme: "DevOps & Deployment", difficulty: "hard" }
            ]
        },

        5: {
            level: 5, name: "Strategic Positioning",
            subtitle: "Série A argumentation, VC due diligence, institutional adoption, competitive moat",
            theme_color: "#ec4899",
            questions: [
                { id: "L5-001", question: "The 'total addressable market' (TAM) for Real World Asset (RWA) tokenization is estimated by Larry Fink (BlackRock) at:", choices: ["$500 billion by 2030", "$10 trillion by 2030", "$100 billion for bonds alone", "$2 trillion exclusively for institutional real estate"], correct: 1, explanation: "Larry Fink (BlackRock, Jan 2024): 'I believe the next step will be the tokenization of every stock, every bond.' Estimated TAM $10T — central argument for Series A pitches.", theme: "Market Sizing", difficulty: "hard" },
                { id: "L5-002", question: "The 'moat' (defensive gap) of an institutional DLT infrastructure primarily rests on:", choices: ["Processing speed (TPS) superior to the competition", "Network effects, high switching costs, and integrated regulatory compliance", "A technological patent on the consensus mechanism", "The exclusivity of an agreement with a central bank"], correct: 1, explanation: "In institutional B2B, the real moat comes from: a network of connected institutions (network effects), high integration costs (switching costs), and compliance as a barrier to entry.", theme: "Competitive Strategy", difficulty: "hard" },
                { id: "L5-003", question: "For a Series A round of an institutional DLT startup, the most credible KPI is:", choices: ["The number of retail users of the app", "Settled transaction volume and the number of institutions live in production", "The TVL of the public DeFi version of the protocol", "The number of GitHub commits from the previous month"], correct: 1, explanation: "Institutional VCs measure traction via B2B metrics: actual settled volume, institutions in production, ARR, and qualified pipeline — not retail DeFi metrics.", theme: "VC Due Diligence", difficulty: "hard" },
                { id: "L5-004", question: "'Regulatory capture' of a competitor in the institutional DLT sector means:", choices: ["A nationalized regulator became a shareholder in a DLT platform", "A competitor obtained regulatory approvals/accreditations first, creating a barrier to entry", "The regulator imposes a specific DLT technology as a national standard", "A financial institution influences regulations via lobbying to benefit its platform"], correct: 1, explanation: "In regulated B2B, being the first to obtain accreditations (CASP, DLT Pilot, CSSF) creates a major competitive barrier — bankers don't experiment with two providers.", theme: "Competitive Strategy", difficulty: "hard" },
                { id: "L5-005", question: "'Land and expand' in institutional DLT sales means:", choices: ["Starting with emerging markets before attacking developed markets", "Entering via a simple pilot use case then expanding to other departments and products of the same institution", "Deploying on-premise first before migrating to the cloud", "Acquiring customers via free pilots then converting to paid contracts"], correct: 1, explanation: "Land and expand: a tokenized DVP pilot with a bank → expansion to bonds → extension to the prime brokerage department → API enterprise contract. Typical institutional DLT cycle.", theme: "Sales Strategy", difficulty: "medium" },
                { id: "L5-006", question: "In an institutional DLT Series A pitch, the most convincing 'unfair advantage' is:", choices: ["A patented proprietary consensus algorithm", "Founding team with combined experience in investment banking, regulation, and DLT engineering", "A partnership with a mainstream crypto influencer", "A seed funding round superior to the competition"], correct: 1, explanation: "Institutional VCs value teams with real track records: ex-bankers understanding constraints, ex-regulators navigating compliance, engineers having deployed in production.", theme: "VC Due Diligence", difficulty: "medium" },
                { id: "L5-007", question: "The optimal 'go-to-market' (GTM) for a bond tokenization DLT platform starts with:", choices: ["A public ICO to raise initial capital", "A bilateral pilot with a partner bank on a real issue then consortium expansion", "A public API allowing any institution to integrate", "A partnership with a retail crypto exchange for distribution"], correct: 1, explanation: "The winning GTM: bilateral pilot with a reference bank → demonstration of real value → consortium expansion → institutional network. Avoids the cold start problem.", theme: "Go-To-Market", difficulty: "medium" },
                { id: "L5-008", question: "The critical 'churn rate' to monitor for an institutional DLT platform in the growth phase is:", choices: ["Monthly churn rate of retail users", "Non-renewal rate of annual institutional framework agreements (MRA/MSA)", "Number of transactions abandoned during execution", "Percentage of validator nodes that left the network"], correct: 1, explanation: "In institutional SaaS, churn on annual MRA/MSA (Master Repository/Service Agreements) is the key retention KPI — institutional churn > 5% is a dealbreaker for a Series A VC.", theme: "Business Metrics", difficulty: "hard" },
                { id: "L5-009", question: "The 'infrastructure > application' positioning in the institutional DLT sector means:", choices: ["Building only public blockchains and not dApps", "Targeting banks as customers by providing the base layer on which they build their products", "Avoiding developing application features and focusing on the API", "Competing directly with SWIFT and TARGET2"], correct: 1, explanation: "Infrastructure positioning (B2B2B) captures more value long-term and creates high switching costs — banks build on you and become dependent.", theme: "Competitive Strategy", difficulty: "medium" },
                { id: "L5-010", question: "Pre-money Series A 'valuation' of an institutional DLT startup is typically based on:", choices: ["A multiple of 100x annual recurring revenue (ARR)", "A mix of market comparables (fintech sector multiples), team quality, and traction (ARR, qualified pipeline)", "Market capitalization of tokens possibly issued", "Only the amount raised in the previous seed round"], correct: 1, explanation: "In institutional Series A: valuation = comparables (10-20x B2B fintech ARR) + team premium + market premium + execution risk discount. No token multiples for traditional VCs.", theme: "VC Due Diligence", difficulty: "hard" },
                { id: "L5-011", question: "The concept of 'T+0 settlement' as a DLT value proposition for an investment bank means:", choices: ["Transactions are visible in real-time but settled at T+2 as currently", "Delivery-versus-payment is atomic and instantaneous, eliminating counterparty risk and freeing up capital", "Transactions are pre-funded by a collateralized smart contract", "Back-office processes confirmations in 0 seconds via RPA automation"], correct: 1, explanation: "Atomic T+0 frees up capital locked for 2 days (current T+2 → T+0), reduces margin collateral requirements, and eliminates counterparty risk — quantifiable savings for banks.", theme: "Value Proposition", difficulty: "medium" },
                { id: "L5-012", question: "The 'network effect' of an institutional DLT settlement platform strengthens because:", choices: ["More validators means more security and therefore more trust", "Each additional institution increases value for all others via more accessible counterparties", "More users allow for reduced infrastructure costs via economies of scale", "The platform's reputation grows proportionally to the number of transactions"], correct: 1, explanation: "Classic network effect: if 10 banks are connected, 45 possible transaction pairs. If 100: 4,950 pairs. Network value grows at O(n²) — Metcalfe's Law applied to settlement.", theme: "Network Effects", difficulty: "medium" },
                { id: "L5-013", question: "An institutional 'Letter of Intent' (LOI) in a DLT sales pipeline:", choices: ["Is a binding contract financially engaging the signatory institution", "Is a statement of intent with limited probative value but signaling serious interest", "Replaces the MSA contract in bilateral relations", "Automatically guarantees conversion to a paying customer within 6 months"], correct: 1, explanation: "An institutional LOI/MOU signals intent but is not financially binding. Its value lies in the traction signal for VCs — differentiating LOI from signed MSA is critical.", theme: "Sales Strategy", difficulty: "medium" },
                { id: "L5-014", question: "A DLT fintech's 'regulatory arbitrage' strategy consists of domiciling in:", choices: ["The country closest to its target customers to optimize taxation", "A jurisdiction offering a favorable regulatory framework (sandbox, accelerated approval) while accessing target markets", "Any EU jurisdiction to benefit from the MiCA passport", "An offshore center to avoid any regulation"], correct: 1, explanation: "DLT fintechs choose Luxembourg (agile CSSF), Singapore (MAS sandbox), or BVI/Cayman then repatriate — the MiCA passport now makes this strategy less advantageous.", theme: "Regulatory Strategy", difficulty: "hard" },
                { id: "L5-015", question: "The optimal monthly 'burn rate' for an institutional DLT startup in Series A (18 months runway) with €5M raised is:", choices: ["€833,000/month without profitability constraints", "~€277,000/month to maintain 18 months of runway", "€1M/month to scale quickly", "Undetermined as it depends solely on signed contract pricing"], correct: 1, explanation: "€5M / 18 months = ~€277k/month. A reasonable burn rate for a core team (tech, compliance, BD) without pre-traction over-hiring — a signal of financial discipline for the next VC.", theme: "Business Metrics", difficulty: "medium" },
                { id: "L5-016", question: "Product-Market Fit (PMF) for an institutional DLT platform is reached when:", choices: ["More than 1,000 users have created an account on the platform", "Institutional customers spontaneously renew and expand their contracts and recommend the platform", "The platform reaches €1M MRR", "A Bloomberg article confirms the startup's traction"], correct: 1, explanation: "Institutional PMF: renewal + organic expansion + NPS elevated among decision makers. A single loyal institutional client is worth more than 1,000 disengaged users.", theme: "Product Strategy", difficulty: "medium" },
                { id: "L5-017", question: "The primary '10x problem' a bond tokenization DLT platform must solve is:", choices: ["Dividing transaction fees by 10 compared to traditional bonds", "Reducing issuance time-to-market from weeks to hours while eliminating non-value-adding intermediaries", "Increasing bond liquidity by 10x by allowing fragmentation", "Increasing yield by 10x for end investors"], correct: 1, explanation: "The 10x problem in bond tokenization: 3-week issuance → 24h, 10+ intermediaries → smart contracts, manual reconciliation → automatic. This is the fundamental value proposition.", theme: "Value Proposition", difficulty: "hard" },
                { id: "L5-018", question: "The 'first mover advantage' argument in institutional DLT is tempered by:", choices: ["The impossibility of patenting blockchain protocols", "The reality that institutions adopt slowly and a 'fast follower' with more resources can catch up", "The fact that VCs prefer to invest in mature markets", "The difficulty of obtaining a high valuation for a first mover"], correct: 1, explanation: "In institutional B2B, FMA counts less than in B2C: sales cycles are long (12-24 months), giving well-funded fast followers time to catch up — the real advantage is ECMI (Early Customer Moat via Integration).", theme: "Competitive Strategy", difficulty: "hard" },
                { id: "L5-019", question: "Optimal 'Board Governance' for an institutional DLT startup seeking a Series A round includes:", choices: ["Only the founders to maintain decision-making agility", "Founders, 1-2 VCs, and 1 independent director with regulatory or institutional expertise", "A 10-person board of directors to maximize diversity", "No formal board until Series B"], correct: 1, explanation: "A 5-7 person board: 2 founders + 2 lead VCs + 1 independent (ex-regulator, ex-bank CDO) → institutional credibility + governance without decision-making deadlocks.", theme: "Corporate Governance", difficulty: "medium" },
                { id: "L5-020", question: "In a VC due diligence on an institutional DLT startup, a major red flag is:", choices: ["A founder having worked in a bank for more than 10 years", "A sales pipeline based on LOIs not converted into paid contracts for more than 12 months", "A CTO having contributed to blockchain open source projects", "An ARR below €500k at the time of the pitch"], correct: 1, explanation: "A pipeline stuck in LOI/POC for >12 months signals either a PMF problem or a poorly qualified institutional sales cycle — a key red flag as VCs model conversion.", theme: "VC Due Diligence", difficulty: "hard" },
                { id: "L5-021", question: "The 'partnerships as distribution' strategy for an institutional DLT startup consists of:", choices: ["Selling exclusively via system integrators to avoid a direct sales force", "Using partnerships with established players (SWIFT, major banks, consultants) as an acquisition channel", "Creating a referral program for institutional clients", "Distributing the platform for free to reach critical mass"], correct: 1, explanation: "SWIFT, Accenture, Deloitte, custodian banks (BNP Paribas Securities Services) can distribute the solution to their institutional client base — massively accelerating GTM without high cost of sale.", theme: "Go-To-Market", difficulty: "medium" },
                { id: "L5-022", question: "The 'stickiness' of an institutional DLT platform is primarily measured by:", choices: ["Number of daily logins to the user interface", "The level of API integration with client back-office systems and the volume of accumulated historical data", "The NPS (Net Promoter Score) of end users", "The frequency of platform updates"], correct: 1, explanation: "The more a client has integrated the platform into its workflows (CBS, SWIFT, custodian), created templates, and accumulated historical data, the higher the migration cost — true institutional stickiness.", theme: "Business Metrics", difficulty: "hard" },
                { id: "L5-023", question: " 'Institutional FOMO' as a DLT adoption driver manifests as:", choices: ["Institutions adopting DeFi to not miss out on token price increases", "Innovation directors accelerating their DLT POCs after direct competitors announce successful pilots", "Central banks forcing adoption via regulation", "Retail investors asking their bank for tokenized products"], correct: 1, explanation: "After JPMorgan Onyx, Goldman Digital Assets, Société Générale FORGE — laggard banks feel internal pressure to demonstrate a DLT strategy, creating a window of opportunity.", theme: "Market Dynamics", difficulty: "medium" },
                { id: "L5-024", question: "The optimal pricing for an institutional DLT SaaS generally uses:", choices: ["A fixed monthly subscription identical for all clients", "A hybrid model: fixed infrastructure fee (guaranteed SLA) + volume fee (% of settled notional)", "A freemium model: free up to 100 transactions/month", "A single per-transaction pricing independent of volume"], correct: 1, explanation: "Hybrid fixed + variable: the infrastructure fee guarantees MRR (predictability for the VC), the volume fee captures value created proportionally to usage — alignment between pricing and value.", theme: "Business Metrics", difficulty: "medium" },
                { id: "L5-025", question: "The 'DLT ROI' concept in a bank business case is generally calculated on:", choices: ["Only the savings in transaction fees", "Back-office savings (reconciliation, fails), capital freeing (T+0 vs T+2), error reduction, and new revenue", "Only additional revenue generated by new tokenized products", "The opportunity cost compared to a classic cloud solution"], correct: 1, explanation: "Typical institutional DLT ROI: reconciliation savings (3-5 FTE), T+0 freed capital (% of notional × cost of capital), reduction in fails (€/fail), new issuances → total 15-40x platform costs over 3 years.", theme: "Value Proposition", difficulty: "hard" },
                { id: "L5-026", question: "The critical 'time to value' (TTV) for an institutional client adopting a DLT platform is:", choices: ["Under 24 hours via a self-service interface", "3-6 months for a full technical integration and the first live production use case", "12-18 months imposed by regulatory validation cycles", "Indifferent because banks plan on 3-5 year horizons"], correct: 1, explanation: "3-6 month TTV is the sweet spot: fast enough to demonstrate value before the next budget review, long enough for real integration. Beyond 9 months = risk of project cancellation.", theme: "Product Strategy", difficulty: "medium" },
                { id: "L5-027", question: "The 'DCM institutional as critical infrastructure' argument in a Series A pitch means:", choices: ["DCM wants to become a Digital Central Bank", "The platform aims to be an infrastructure layer banks can no longer do without, like SWIFT", "DCM is structured as a public infrastructure subsidized by states", "The platform will be regulated as a SIFI (Systemically Important Financial Institution)"], correct: 1, explanation: "Critical infrastructure positioning = pricing power, high switching costs, regulatory moat. Comparable to Bloomberg Terminal, SWIFT, or Broadridge in their respective sectors.", theme: "Competitive Strategy", difficulty: "hard" },
                { id: "L5-028", question: " 'Secondary market risk' for an institutional DLT startup pre-IPO is:", choices: ["The risk that issued tokens lose value on exchanges", "The risk that VC funds sell their shares to non-aligned buyers via secondary transactions", "The risk that competitors copy the user interface", "Regulatory risk related to the securities status of the startup's shares"], correct: 1, explanation: "VC secondary transactions (Forge, Carta, NPM) allow LPs to exit and new investors to enter — risk of focus dilution or the entry of actors not aligned with the vision.", theme: "VC Due Diligence", difficulty: "hard" },
                { id: "L5-029", question: "The 'institutional adoption cycle' for DLT follows the Gartner Hype Cycle for enterprises in:", choices: ["Innovation Trigger → Peak of Expectations → Trough of Disillusionment → Slope of Enlightenment → Plateau of Productivity", "Rapid Adoption → Saturation → Decline → Technology Replacement", "Regulation → Pilot → Production → Scale", "No recognized model is applicable to institutional adoption"], correct: 0, explanation: "In 2024-2025, institutional DLT is between the Trough of Disillusionment and the Slope of Enlightenment — post-2017-2019 blockchain hype, now with real production use cases at JPMorgan, SocGen, HSBC.", theme: "Market Dynamics", difficulty: "medium" },
                { id: "L5-030", question: "The optimal 'exit hypothesis' for investors in a Series A institutional DLT startup is:", choices: ["IPO on Nasdaq within 18 months following the round", "Strategic acquisition by an established player (SWIFT, Broadridge, Euroclear, major bank) or IPO in 5-7 years", "Issuance of own tokens convertible into equity", "Buyback by founders via a management buyout"], correct: 1, explanation: "Realistic exits: strategic M&A (FIS, Broadridge, DTCC, a major bank seeking a proprietary DLT brick) or IPO if scale is reached. A token exit is incompatible with traditional institutional VCs.", theme: "VC Due Diligence", difficulty: "hard" }
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
                    scenario: "Scenario: You are pitching a €15M Series A round to a Tier-1 VC. They ask what your regulatory 'unfair advantage' is compared to a competitor with 10x more capital but no MiCA approval.",
                    question: "Which response maximizes your chances of getting a term sheet with a premium valuation?",
                    choices: [
                        "MiCA approval allows us to operate now in 27 countries, creating an 18-24 month barrier to entry for the competition.",
                        "Our technology is open-source and more decentralized than the competition's.",
                        "We have a larger community on social media and Discord.",
                        "MiCA approval guarantees that our smart contracts contain no security flaws.",
                        "The competitor will be acquired by a bank before obtaining its approval.",
                        "Adhering to MiCA standards reduces our cloud server costs by 40%.",
                        "We can issue algorithmic stablecoins without collateral thanks to MiCA.",
                        "Regulation captures market opportunities faster than pure capital in the institutional sector."
                    ],
                    correct: 0,
                    explanation: "In regulated B2B, 'regulatory capture' (being the first approved) is the most powerful moat. A competitor without approval must wait for the administrative process (18-24m), leaving you free to secure banking partners.",
                    theme: "Série A Strategy",
                    difficulty: "super"
                },
                {
                    id: "SL-002",
                    scenario: "Scenario: A systemic bank (G-SIB) wants to issue a €500M digital bond with T+0 settlement. They are hesitating between using the public Ethereum network (L2) or a private infrastructure like Canton Network.",
                    question: "What is the decisive technical argument for choosing Canton Network in this institutional context?",
                    choices: [
                        "Transaction speed is 100x superior to Ethereum.",
                        "Native interoperability between confidential sub-ledgers without revealing global positions to the rest of the market.",
                        "Canton Network allows the use of any programming language, even non-deterministic ones.",
                        "Total absence of transaction fees (gas fees) for all participants.",
                        "Automatic compliance with US civil law regardless of node jurisdiction.",
                        "Native support for Bitcoin as the default settlement currency.",
                        "Elimination of the need for HSM for private key storage.",
                        "Centralized governance allowing any transaction to be cancelled by simple vote."
                    ],
                    correct: 1,
                    explanation: "Canton (Digital Asset) was designed for finance: it allows each bank to keep its data confidential on its sub-ledger while allowing cross-ledger atomic transactions — solving the 'Privacy vs Interoperability' paradox.",
                    theme: "Infrastructure Choice",
                    difficulty: "super"
                },
                {
                    id: "SL-003",
                    scenario: "Scenario: During a DORA audit, the regulator identifies that your DLT infrastructure depends on a single Cloud provider for 95% of your validator nodes.",
                    question: "Which corrective measure is the most robust to avoid a major sanction?",
                    choices: [
                        "Migrating 50% of validators to another region of the same Cloud provider.",
                        "Implementing a hybrid Multi-cloud strategy with nodes distributed across at least two distinct providers and on-premise nodes.",
                        "Taking out ICT insurance covering 100% of potential regulatory fines.",
                        "Encrypting all communications between nodes with AES-256.",
                        "Switching to a Proof of Work consensus to remove dependence on virtualized infrastructures.",
                        "Increasing Tier 1 capital by 10% to offset residual operational risk.",
                        "Requesting a waiver on the grounds that the cloud provider itself is SOC2 certified.",
                        "Recruiting a Chief Resilience Officer to manually supervise servers."
                    ],
                    correct: 1,
                    explanation: "DORA (Art. 28) emphasizes ICT risk concentration. A multi-cloud/hybrid strategy is the 'gold standard' for guaranteeing service continuity in case of a provider's major failure (anti-vendor lock-in).",
                    theme: "DORA Compliance",
                    difficulty: "super"
                },
                {
                    id: "SL-004",
                    scenario: "Scenario: You are designing an institutional-grade stablecoin (Asset-Referenced Token) under MiCA. The regulator requires real-time proof of reserve with an auditable 'kill-switch' mechanism.",
                    question: "Which technical architecture is the most 'future-proof' for this use case?",
                    choices: [
                        "A centralized oracle updating a CSV file stored on IPFS every hour.",
                        "On-chain Proof-of-Reserves via TEE Oracles with a 'Circuit Breaker' smart contract controlled by multi-signature governance.",
                        "A simple weekly attestation from an audit firm sent by email to the regulator.",
                        "Using a permissionless blockchain without any control to maximize liquidity.",
                        "A minting mechanism based solely on the price of Bitcoin.",
                        "An architecture based on a DAO where each token holder can block the contract.",
                        "Storing 100% of reserves in competing algorithmic stablecoins.",
                        "Native integration with the SWIFT system to validate fiat flows before issuance."
                    ],
                    correct: 1,
                    explanation: "TEE (Trusted Execution Environment) oracles provide inviolable off-chain data proofs. The 'Circuit Breaker' allows for activity suspension in case of deviation, securing funds according to MiCA standards.",
                    theme: "Stablecoin Governance",
                    difficulty: "super"
                },
                {
                    id: "SL-005",
                    scenario: "Scenario: Within the framework of Basel III (BCBS 2022), a bank wants to minimize its capital charge for its tokenized security holdings.",
                    question: "To be classified in 'Group 1a' (favorable weighting), which criterion is indispensable?",
                    choices: [
                        "The asset must be a cryptocurrency with a market cap > $100B.",
                        "The tokenized security must have the same legal and economic rights as its traditional equivalent and be issued on a regulated network.",
                        "The asset must be held in a personal non-custodial wallet to avoid third-party risk.",
                        "The asset must be a unique NFT representing real estate.",
                        "The bank must hold at least 51% of the network's validator nodes.",
                        "The asset must be issued on a Proof of Work blockchain exclusively.",
                        "The security must be convertible into physical gold within 48 hours.",
                        "The DLT network used must be exempt from EBA oversight."
                    ],
                    correct: 1,
                    explanation: "Group 1a (BCBS) classification is reserved for tokenized traditional assets. If they meet structure and network criteria (security, governance), they receive the same weighting as the 'legacy' asset (e.g., 20% for a sovereign bond).",
                    theme: "Basel III Strategy",
                    difficulty: "super"
                },
                {
                    id: "SL-006",
                    scenario: "Scenario: The 'European Blockchain Services Infrastructure' (EBSI) project aims to create a pan-European network for public services.",
                    question: "What is the major risk of a hybrid infrastructure (off-chain storage + on-chain notarization) for personal data?",
                    choices: [
                        "Storage costs on IPFS are too high.",
                        "The tension between on-chain hash immutability and the 'Right to be forgotten' (Art. 17 GDPR) if the hash allows for indirect person identification.",
                        "The impossibility of reading data if the EBSI network undergoes a hard fork.",
                        "The slowness of IBFT 2.0 consensus for large files.",
                        "The need for every citizen to pay gas fees in EBSI tokens.",
                        "The risk that validators censor citizens' social data.",
                        "The rapid obsolescence of the JSON-LD file format used.",
                        "The obligation to migrate all data to a US public blockchain."
                    ],
                    correct: 1,
                    explanation: "Even if data is off-chain, an on-chain hash is considered pseudonymized data under GDPR. If it can be correlated with other info to identify someone, the hash's immutability contravenes the right to erasure.",
                    theme: "RGPD & Privacy",
                    difficulty: "super"
                },
                {
                    id: "SL-007",
                    scenario: "Scenario: During a major cyber incident (e.g., detection of a backdoor in a critical open-source library), DORA requires rapid notification.",
                    question: "What is the maximum delay for submitting the 'initial report' of a major incident to competent authorities?",
                    choices: [
                        "Within one hour following detection.",
                        "Within 4 hours (but at most 24h after detection).",
                        "Within 72 hours as provided by GDPR.",
                        "Within 5 business days.",
                        "Only during the annual closing of accounts.",
                        "Notification is only mandatory if funds were stolen.",
                        "Within 48 hours preceding the bug fix.",
                        "Within 15 days if the incident is shared with ENISA."
                    ],
                    correct: 1,
                    explanation: "DORA (Art. 19) tightens deadlines: a major incident report must be sent extremely quickly (suggested EBA/ESMA timeline of 4h to 24h). This is much stricter than GDPR (72h).",
                    theme: "DORA Compliance",
                    difficulty: "super"
                },
                {
                    id: "SL-008",
                    scenario: "Scenario: An Asset Manager wants to launch a tokenized money market fund (MMF) offering 'Atomic Swap' settlement against digital currency.",
                    question: "Which settlement instrument (Settlement Asset) minimizes the credit risk of the monetary asset for a bank?",
                    choices: [
                        "A stablecoin issued by an unregulated exchange.",
                        "A Wholesale CBDC (wCBDC) issued by a Central Bank on the DLT network.",
                        "A Deposit Token issued by a Tier 2 commercial bank.",
                        "A synthetic token pegged to the gold price.",
                        "A Wrapped Bitcoin (wBTC) on a Layer 2 network.",
                        "Cash payment via SWIFT with on-chain manual confirmation.",
                        "An algorithmic stablecoin pegged to inflation.",
                        "Using a mutual credit system among network participants."
                    ],
                    correct: 1,
                    explanation: "CBDC (Central Bank Digital Currency) is central bank money, thus without credit or liquidity risk. It is the 'ultimate' settlement asset for wholesale transactions.",
                    theme: "Settlement Mechanics",
                    difficulty: "super"
                },
                {
                    id: "SL-009",
                    scenario: "Scenario: To audit a smart contract managing $1 billion in assets, which method offers the highest level of mathematical assurance?",
                    choices: [
                        "Manual audit by two independent experts for 2 weeks.",
                        "Formal Verification via SMT solvers proving the absence of certain bug types.",
                        "Fuzzing for 48 hours on all contract entry points.",
                        "A $100,000 open bug bounty program.",
                        "Manually verifying that the code is identical to an OpenZeppelin template.",
                        "Using generative AI to scan for common vulnerabilities.",
                        "Measuring unit test coverage above 95%.",
                        "A public peer-review on GitHub by the community."
                    ],
                    correct: 1,
                    explanation: "Formal Verification (FV) is the only method that mathematically proves the contract follows its specification for all possible inputs. For $1B+ TVL, FV is the institutional standard (e.g., MakerDAO, Uniswap v4).",
                    theme: "Smart Contract Audit",
                    difficulty: "super"
                },
                {
                    id: "SL-010",
                    scenario: "Scenario: The AMLD6 directive imposes increased controls on transactions involving 'unhosted wallets' (non-custodial wallets).",
                    question: "Which technology allows for reconciling AML and privacy for these wallets?",
                    choices: [
                        "Pure and simple prohibition of transfers to external wallets.",
                        "Use of Zero-Knowledge KYC (zk-KYC) allowing for proof of eligibility without revealing identity on-chain.",
                        "Automatic sending of the private key to the regulator with each transaction.",
                        "Blocking of all transactions higher than €50.",
                        "Marking (tainting) of all tokens that have passed through a non-custodial wallet.",
                        "Storage of the user's complete browsing history on the blockchain.",
                        "Use of wallets working only with centralized facial recognition.",
                        "Requirement for a systematic double signature by a notary for each transfer."
                    ],
                    correct: 1,
                    explanation: "zk-KYC is the current frontier of compliance: it allows for proof (e.g., via a ZK signature) that the wallet belongs to a verified person without writing their name on an immutable public ledger.",
                    theme: "AML & Privacy",
                    difficulty: "super"
                },
                {
                    id: "SL-011",
                    scenario: "Scenario: A banking consortium deploys a permissioned blockchain. They must choose between a PBFT consensus and a Raft consensus.",
                    question: "Why is PBFT preferable in this multi-actor context?",
                    choices: [
                        "It is much faster than Raft in terms of TPS.",
                        "It tolerates Byzantine faults (malicious or lying nodes), unlike Raft which only handles crash faults.",
                        "It consumes less energy than Raft.",
                        "It is native in all standard Linux distributions.",
                        "It allows for adding thousands of validators without performance loss.",
                        "It guarantees validator anonymity towards the rest of the world.",
                        "It was invented specifically by the ECB for CBDCs.",
                        "It requires no network communication between validators."
                    ],
                    correct: 1,
                    explanation: "Raft assumes the leader is honest but can crash. In a consortium (potential rivalry), PBFT protects against a malicious leader who might try to censor or modify the transaction order.",
                    theme: "Consensus Mechanisms",
                    difficulty: "super"
                },
                {
                    id: "SL-012",
                    scenario: "Scenario: The DCM Digital infrastructure must integrate an 'ESG Score' for each tokenized asset, including the carbon footprint of the underlying protocol.",
                    question: "Which indicator is most relevant for an Article 9 SFDR institutional investor?",
                    choices: [
                        "The token's market cap multiplied by its average ESG score.",
                        "Carbon-per-Transaction and the consensus mechanism (PoS vs PoW) audited on-chain.",
                        "The number of 'ESG Likes' on the issuer's social profile.",
                        "Total absence of electricity consumed by the DLT network.",
                        "Exclusive use of servers hosted in Iceland.",
                        "The amount of donations made by the blockchain foundation to environmental NGOs.",
                        "The ratio of women among the network's validators.",
                        "The token price if positively correlated with the MSCI World ESG index."
                    ],
                    correct: 1,
                    explanation: "For Article 9 funds (sustainable objective), measuring the real impact (carbon footprint of the IT architecture / consensus) is crucial. EBA and ESMA are preparing ESG reporting standards for crypto-assets.",
                    theme: "ESG & SFDR",
                    difficulty: "super"
                },
                {
                    id: "SL-013",
                    scenario: "Scenario: A DLT Securitization platform wants to automate the asset lifecycle (coupons, amortizations) via smart contracts.",
                    question: "Which 'Model Risk' (MRM) is most critical in this system?",
                    choices: [
                        "Inefficiency of Solidity code in terms of gas consumption.",
                        "A design error in the interest calculation logic embedded in the immutable smart contract.",
                        "Use of an outdated compiler version.",
                        "Lack of comments in the source code for auditors.",
                        "Choice of an unreadable font in the code.",
                        "Fluctuating gas prices making execution too expensive.",
                        "Absence of a logo on tokens issued by the contract.",
                        "Slow synchronization of archive nodes."
                    ],
                    correct: 1,
                    explanation: "Under SR 11-7, a smart contract is a model. If the business logic (interest calculation) is hardcoded and wrong, the error becomes systemic, immutable, and can cause massive losses. This is the core of Model Risk management on DLT.",
                    theme: "Model Risk Management",
                    difficulty: "super"
                },
                {
                    id: "SL-014",
                    scenario: "Scenario: The 'Regulated Liability Network' (RLN) proposes an architecture where money and assets coexist on the same ledger.",
                    question: "What is the major benefit compared to the current model (bank silos vs custodian silos)?",
                    choices: [
                        "Removal of commercial banks in favor of a single algorithm.",
                        "Simultaneous atomic settlement (DvP) in real-time, 24/7, without temporal gap risk between asset and cash.",
                        "Total gratuity of banking services for savers.",
                        "Systematic use of Bitcoin for all interbank settlements.",
                        "Complete anonymity of transactions towards the regulator.",
                        "End of inflation thanks to monetary programmability.",
                        "Reduction of bank IT server size by 10x.",
                        "Unification of interest rates globally."
                    ],
                    correct: 1,
                    explanation: "RLN (tested by NY Fed, Citi, Mastercard) aims to remove reconciliation frictions between silos. Atomicity guarantees the asset moves only if the cash moves, instantly, reducing collateral needs.",
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
