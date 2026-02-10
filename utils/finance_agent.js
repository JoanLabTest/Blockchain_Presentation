// FINANCE AGENT HELPER
// Manages the AI chat interface for Finance & RWA pages

const FinanceAgent = (() => {
    let isOpen = false;
    let conversationHistory = [];

    // DOM Elements
    let bubble, chatContainer, messagesDiv, inputField, sendBtn, closeBtn;

    function init() {
        createUI();
        attachEventListeners();
        console.log("Finance Agent initialized");

        // Optional: Auto-open if specific query param exists?
        // For now, quiet start.
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
            z-index: 1000;
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
            height: 500px;
            background: rgba(15, 23, 42, 0.95); /* Darker Slate */
            backdrop-filter: blur(10px);
            border-radius: 16px;
            border: 1px solid rgba(59, 130, 246, 0.3); /* Blue border */
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            display: none;
            flex-direction: column;
            z-index: 1001;
        `;

        chatContainer.innerHTML = `
            <div style="padding: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center; background: rgba(59, 130, 246, 0.1); border-radius: 16px 16px 0 0;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-briefcase" style="color: #60a5fa; font-size: 20px;"></i>
                    <span style="color: white; font-weight: bold; font-family: 'JetBrains Mono', monospace;">Expert RWA & Finance</span>
                </div>
                <button id="fa-close-btn" style="background: none; border: none; color: #94a3b8; font-size: 20px; cursor: pointer;">×</button>
            </div>
            <div id="fa-messages" style="flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 15px;">
                <div style="padding: 12px 16px; border-radius: 12px; max-width: 80%; background: rgba(59, 130, 246, 0.1); color: #e2e8f0; border: 1px solid rgba(59, 130, 246, 0.2);">
                    Bonjour. Je suis votre analyste dédié. Une question sur la tokenisation ou la structure du fonds ?
                </div>
            </div>
            <div style="padding: 15px; border-top: 1px solid rgba(255,255,255,0.1); display: flex; gap: 10px;">
                <input id="fa-input" type="text" placeholder="Posez votre question d'expert..." style="flex: 1; padding: 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; color: white; outline: none;">
                <button id="fa-send-btn" style="padding: 10px 20px; background: #3b82f6; border: none; border-radius: 8px; color: white; cursor: pointer; font-weight: bold;">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        `;

        document.body.appendChild(bubble);
        document.body.appendChild(chatContainer);

        // Get references
        messagesDiv = document.getElementById('fa-messages');
        inputField = document.getElementById('fa-input');
        sendBtn = document.getElementById('fa-send-btn');
        closeBtn = document.getElementById('fa-close-btn');
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
                'background: #3b82f6; color: white; align-self: flex-end; margin-left: auto;' : 
                'background: rgba(59, 130, 246, 0.1); color: #e2e8f0; border: 1px solid rgba(59, 130, 246, 0.2);'}
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
        loadingDiv.className = 'fa-loading';
        loadingDiv.style.cssText = 'padding: 12px; color: #94a3b8; font-style: italic;';
        loadingDiv.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Analyse des données...';
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
            addMessage("⚠️ Erreur de connexion au système financier. Veuillez réessayer.");
            console.error("Finance Agent Error:", error);
        }
    }

    async function callAI(userMessage, context = {}) {
        if (!window.DCM_CONFIG || !DCM_CONFIG.financeAgentUrl) {
            // Fallback for demo/testing if URL not set
            console.warn("Finance Agent URL not configured in DCM_CONFIG");
            return "Configuration manquante : `financeAgentUrl`. Veuillez vérifier config.js.";
        }

        const payload = {
            message: userMessage,
            ...context
        };

        const res = await fetch(DCM_CONFIG.financeAgentUrl, {
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
    document.addEventListener('DOMContentLoaded', () => FinanceAgent.init());
} else {
    FinanceAgent.init();
}
