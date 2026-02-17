// FINANCE AGENT HELPER
// Manages the AI chat interface for Finance & RWA pages

const FinanceAgent = (() => {
    let isOpen = false;
    let conversationHistory = [];

    // DOM Elements
    let bubble, chatContainer, messagesDiv, inputField, sendBtn, closeBtn, chipsContainer;

    function init() {
        if (document.getElementById('finance-agent-bubble')) return; // Prevent duplicate
        createUI();
        attachEventListeners();
        console.log("Finance Agent initialized");
    }

    function createUI() {
        // Main bubble trigger
        bubble = document.createElement('div');
        bubble.id = 'finance-agent-bubble';
        bubble.innerHTML = '<i class="fas fa-briefcase"></i>';
        bubble.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #0f172a 0%, #3b82f6 100%); /* Navy to Blue */
            border: 2px solid #60a5fa;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
            z-index: 10000; /* High Z-Index */
            transition: transform 0.3s ease;
        `;

        // Chat container
        chatContainer = document.createElement('div');
        chatContainer.id = 'finance-agent-chat';
        chatContainer.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 30px;
            width: 400px;
            max-width: 90vw;
            height: 550px;
            background: rgba(15, 23, 42, 0.95); /* Darker Slate */
            backdrop-filter: blur(10px);
            border-radius: 16px;
            border: 1px solid rgba(59, 130, 246, 0.3); /* Blue border */
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            display: none;
            flex-direction: column;
            z-index: 10001; /* High Z-Index */
        `;

        chatContainer.innerHTML = `
            <div style="padding: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center; background: rgba(59, 130, 246, 0.1); border-radius: 16px 16px 0 0;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-briefcase" style="color: #60a5fa; font-size: 20px;"></i>
                    <div>
                        <span style="color: white; font-weight: bold; font-family: 'JetBrains Mono', monospace; display:block; line-height:1.2;">Expert RWA</span>
                        <span style="color: #94a3b8; font-size: 10px;">Powered by BlackRock Data</span>
                    </div>
                </div>
                <button id="fa-close-btn" style="background: none; border: none; color: #94a3b8; font-size: 20px; cursor: pointer;">×</button>
            </div>
            
            <div id="fa-messages" style="flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 15px;">
                <div style="padding: 12px 16px; border-radius: 12px; max-width: 85%; background: rgba(59, 130, 246, 0.1); color: #e2e8f0; border: 1px solid rgba(59, 130, 246, 0.2);">
                    Bonjour. Je suis l'analyste dédié au fonds BUIDL. Je peux analyser la structure légale, les risques, ou le rendement.<br><br>Que souhaitez-vous savoir ?
                </div>
            </div>

            <!-- SUGGESTED PROMPTS -->
            <div id="fa-chips" style="padding: 10px 15px; display: flex; gap: 8px; overflow-x: auto; white-space: nowrap; border-top: 1px solid rgba(255,255,255,0.05);">
                <button class="fa-chip" onclick="FinanceAgent.ask('Explique le mécanisme de Repo 2.0')">Repo 2.0</button>
                <button class="fa-chip" onclick="FinanceAgent.ask('Quels sont les risques légaux ?')">Risques Légal</button>
                <button class="fa-chip" onclick="FinanceAgent.ask('Comment est généré le rendement ?')">Yield Source</button>
                <button class="fa-chip" onclick="FinanceAgent.ask('Comparaison vs USDC ?')">Vs Stablecoin</button>
            </div>

            <div style="padding: 15px; border-top: 1px solid rgba(255,255,255,0.05); display: flex; gap: 10px;">
                <input id="fa-input" type="text" placeholder="Posez une question..." style="flex: 1; padding: 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; color: white; outline: none;">
                <button id="fa-send-btn" style="padding: 10px 20px; background: #3b82f6; border: none; border-radius: 8px; color: white; cursor: pointer; font-weight: bold;">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>

            <style>
                .fa-chip {
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    color: #94a3b8;
                    padding: 5px 12px;
                    border-radius: 20px;
                    font-size: 11px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .fa-chip:hover {
                    background: rgba(59, 130, 246, 0.2);
                    border-color: #3b82f6;
                    color: white;
                }
                /* Custom Scrollbar */
                #fa-messages::-webkit-scrollbar { width: 5px; }
                #fa-messages::-webkit-scrollbar-thumb { background: #334155; border-radius: 5px; }
                #fa-chips::-webkit-scrollbar { height: 3px; }
                #fa-chips::-webkit-scrollbar-thumb { background: #334155; border-radius: 5px; }
            </style>
        `;

        document.body.appendChild(bubble);
        document.body.appendChild(chatContainer);

        // Get references
        messagesDiv = document.getElementById('fa-messages');
        inputField = document.getElementById('fa-input');
        sendBtn = document.getElementById('fa-send-btn');
        closeBtn = document.getElementById('fa-close-btn');
        chipsContainer = document.getElementById('fa-chips');
    }

    function attachEventListeners() {
        bubble.addEventListener('click', toggle);
        closeBtn.addEventListener('click', close);
        sendBtn.addEventListener('click', () => sendMessage());
        inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });

        bubble.addEventListener('mouseenter', () => bubble.style.transform = 'scale(1.1)');
        bubble.addEventListener('mouseleave', () => bubble.style.transform = 'scale(1)');
    }

    function toggle() { isOpen ? close() : open(); }

    function open() {
        chatContainer.style.display = 'flex';
        isOpen = true;
        bubble.style.display = 'none'; // Hide bubble when open
        if (inputField) inputField.focus();
    }

    function close() {
        chatContainer.style.display = 'none';
        bubble.style.display = 'flex'; // Show bubble when closed
        isOpen = false;
    }

    function addMessage(text, isUser = false) {
        const msgDiv = document.createElement('div');
        msgDiv.style.cssText = `
            padding: 12px 16px;
            border-radius: 12px;
            max-width: 85%;
            font-size: 13px;
            line-height: 1.5;
            ${isUser ?
                'background: #3b82f6; color: white; align-self: flex-end; margin-left: auto;' :
                'background: rgba(59, 130, 246, 0.1); color: #e2e8f0; border: 1px solid rgba(59, 130, 246, 0.2);'}
        `;
        msgDiv.innerHTML = text; // Allow HTML
        messagesDiv.appendChild(msgDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    async function sendMessage(overrideText = null) {
        const text = overrideText || inputField.value.trim();
        if (!text) return;

        addMessage(text, true);
        inputField.value = '';

        // Show loading
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'fa-loading';
        loadingDiv.style.cssText = 'padding: 12px; color: #94a3b8; font-style: italic; font-size: 12px;';
        loadingDiv.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Analyse des données BlackRock...';
        messagesDiv.appendChild(loadingDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;

        try {
            // FIX: Use Correct Config Variable
            const webhookUrl = (window.DCM_CONFIG && DCM_CONFIG.financeAgentUrl) ? DCM_CONFIG.financeAgentUrl : null;

            let responseData;

            if (webhookUrl && !DCM_CONFIG.DEV_MODE) {
                // REAL MODE: Try Webhook
                const token = (typeof AuthManager !== 'undefined') ? await AuthManager.getSessionToken() : null;
                const headers = { 'Content-Type': 'application/json' };
                if (token) headers['Authorization'] = `Bearer ${token}`;

                const response = await fetch(webhookUrl, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({
                        message: text,
                        pageContext: document.title,
                        sessionId: 'session-' + Date.now()
                    })
                });

                if (response.ok) {
                    responseData = await response.json();
                } else {
                    throw new Error("Webhook failed");
                }
            } else {
                // MOCK MODE (Fallback or Dev Mode)
                await new Promise(r => setTimeout(r, 1500)); // Simulate delay
                responseData = { output: getMockResponse(text) };
            }

            messagesDiv.removeChild(loadingDiv);

            if (responseData && responseData.output) {
                addMessage(responseData.output);
            } else {
                addMessage("Je n'ai pas pu accéder à cette donnée pour le moment.");
            }

        } catch (error) {
            console.warn("Agent Error (using fallback):", error);
            if (messagesDiv.contains(loadingDiv)) messagesDiv.removeChild(loadingDiv);
            // Fallback on error
            addMessage(getMockResponse(text));
        }
    }

    // MOCK INTELLIGENCE (For Demo/Offline)
    function getMockResponse(query) {
        const q = query.toLowerCase();

        if (q.includes('repo')) return "<strong>Le Repo 2.0</strong> utilise des contrats intelligents pour automatiser l'échange de collatéral (Tokens) contre du cash. <br><br>Contrairement au Repo classique (T+1), le règlement est atomique (T+0), réduisant le risque de contrepartie à zéro.";

        if (q.includes('risk') || q.includes('risque')) return "<strong>Analyse des Risques :</strong><br>1. <strong>Liquidité :</strong> Atténuée par les pools USDC (Circle).<br>2. <strong>Smart Contract :</strong> Audité par Trail of Bits.<br>3. <strong>Légal :</strong> Les actifs sont détenus par un SPV (Bankruptcy Remote) pour protéger les investisseurs.";

        if (q.includes('yield') || q.includes('rendement')) return "Le rendement provient de <strong>Bons du Trésor US (T-Bills)</strong> à court terme détenus par le fonds. <br><br>Il est distribué quotidiennement sous forme de nouveaux tokens (Rebase) directement dans votre wallet.";

        if (q.includes('usdc') || q.includes('stablecoin')) return "<strong>BUIDL vs USDC :</strong><br>• USDC = Cash numérique (0% rendement).<br>• BUIDL = Titre financier (4.75% rendement).<br><br>BUIDL est un actif d'investissement, USDC est un actif de paiement.";

        return "Je suis spécialisé sur l'analyse du fonds BUIDL et des RWA. Pourriez-vous préciser votre question sur la structure, les risques ou le rendement ?";
    }

    // Expose "ask" for chips
    function ask(text) {
        if (!isOpen) open();
        sendMessage(text);
    }

    return { init, open, close, ask };
})();
