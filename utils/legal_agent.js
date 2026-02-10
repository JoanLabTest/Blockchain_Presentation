// LEGAL AGENT HELPER
// Manages the AI chat interface for Legal & Compliance pages

const LegalAgent = (() => {
    let isOpen = false;
    let conversationHistory = [];

    // DOM Elements
    let bubble, chatContainer, messagesDiv, inputField, sendBtn, closeBtn;

    function init() {
        createUI();
        attachEventListeners();
        console.log("Legal Agent initialized");
    }

    function createUI() {
        // Main bubble trigger
        bubble = document.createElement('div');
        bubble.id = 'legal-agent-bubble';
        bubble.innerHTML = '<i class="fas fa-scale-balanced"></i>';
        bubble.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #083344 0%, #06b6d4 100%); /* Dark Cyan to Cyan */
            border: 2px solid #22d3ee;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(6, 182, 212, 0.4);
            z-index: 1000;
            transition: transform 0.3s ease;
        `;

        // Chat container
        chatContainer = document.createElement('div');
        chatContainer.id = 'legal-agent-chat';
        chatContainer.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 30px;
            width: 400px;
            max-width: 90vw;
            height: 500px;
            background: rgba(8, 51, 68, 0.95); /* Darker Cyan/Slate */
            backdrop-filter: blur(10px);
            border-radius: 16px;
            border: 1px solid rgba(34, 211, 238, 0.3); /* Cyan border */
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            display: none;
            flex-direction: column;
            z-index: 1001;
        `;

        chatContainer.innerHTML = `
            <div style="padding: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center; background: rgba(6, 182, 212, 0.1); border-radius: 16px 16px 0 0;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-scale-balanced" style="color: #22d3ee; font-size: 20px;"></i>
                    <span style="color: white; font-weight: bold; font-family: 'JetBrains Mono', monospace;">Juriste Digital (MiCA)</span>
                </div>
                <button id="la-close-btn" style="background: none; border: none; color: #94a3b8; font-size: 20px; cursor: pointer;">×</button>
            </div>
            <div id="la-messages" style="flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 15px;">
                <div style="padding: 12px 16px; border-radius: 12px; max-width: 80%; background: rgba(6, 182, 212, 0.1); color: #e2e8f0; border: 1px solid rgba(6, 182, 212, 0.2);">
                    Bonjour. Je peux vous éclairer sur le Régime Pilote DLT, MiCA ou la conformité RGPD. Quelle est votre question ?
                </div>
            </div>
            <div style="padding: 15px; border-top: 1px solid rgba(255,255,255,0.1); display: flex; gap: 10px;">
                <input id="la-input" type="text" placeholder="Interrogez le code juridique..." style="flex: 1; padding: 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; color: white; outline: none;">
                <button id="la-send-btn" style="padding: 10px 20px; background: #06b6d4; border: none; border-radius: 8px; color: white; cursor: pointer; font-weight: bold;">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        `;

        document.body.appendChild(bubble);
        document.body.appendChild(chatContainer);

        // Get references
        messagesDiv = document.getElementById('la-messages');
        inputField = document.getElementById('la-input');
        sendBtn = document.getElementById('la-send-btn');
        closeBtn = document.getElementById('la-close-btn');
    }

    function attachEventListeners() {
        bubble.addEventListener('click', toggle);
        closeBtn.addEventListener('click', close);
        sendBtn.addEventListener('click', sendMessage);
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
        inputField.focus();
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
            max-width: 80%;
            ${isUser ?
                'background: #06b6d4; color: white; align-self: flex-end; margin-left: auto;' :
                'background: rgba(6, 182, 212, 0.1); color: #e2e8f0; border: 1px solid rgba(6, 182, 212, 0.2);'}
        `;
        msgDiv.innerText = text;
        messagesDiv.appendChild(msgDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    async function sendMessage() {
        const text = inputField.value.trim();
        if (!text) return;

        addMessage(text, true);
        inputField.value = '';

        // Show loading
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'la-loading';
        loadingDiv.style.cssText = 'padding: 12px; color: #94a3b8; font-style: italic;';
        loadingDiv.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Recherche juridique...';
        messagesDiv.appendChild(loadingDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;

        try {
            const context = {
                page_title: document.title,
                page_url: window.location.href,
                timestamp: new Date().toISOString()
            };

            const response = await callAI(text, context);
            messagesDiv.removeChild(loadingDiv);
            addMessage(response);
        } catch (error) {
            if (messagesDiv.contains(loadingDiv)) messagesDiv.removeChild(loadingDiv);
            addMessage(`⚠️ Erreur: ${error.message} (Vérifiez que le workflow n8n est ACTIF)`);
            console.error("Legal Agent Error:", error);
        }
    }

    async function callAI(userMessage, context = {}) {
        if (!window.DCM_CONFIG || !DCM_CONFIG.legalAgentUrl) {
            console.error("Legal Agent Configuration Error. DCM_CONFIG:", window.DCM_CONFIG);
            return "Configuration manquante : `legalAgentUrl`. Veuillez vérifier config.js.";
        }

        const payload = {
            message: userMessage,
            ...context
        };

        const res = await fetch(DCM_CONFIG.legalAgentUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error("Network error: " + res.statusText);

        const data = await res.json();
        return data.response || data.message || "Aucune analyse disponible.";
    }

    return { init, open, close };
})();

// Auto-init
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => LegalAgent.init());
} else {
    LegalAgent.init();
}
