// AI PROFESSOR HELPER
// Manages the AI chat interface for quiz explanations

const AIProfessor = (() => {
    let isOpen = false;
    let conversationHistory = [];

    // DOM Elements (will be initialized)
    let bubble, chatContainer, messagesDiv, inputField, sendBtn, closeBtn;

    function init() {
        // Create UI elements
        createUI();
        attachEventListeners();
        console.log("AI Professor initialized");
    }

    function createUI() {
        // Main bubble trigger
        bubble = document.createElement('div');
        bubble.id = 'ai-professor-bubble';
        bubble.innerHTML = '<i class="fas fa-user-graduate"></i>';
        bubble.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            z-index: 1000;
            transition: transform 0.3s ease;
            display: none;
        `;

        // Chat container
        chatContainer = document.createElement('div');
        chatContainer.id = 'ai-professor-chat';
        chatContainer.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 30px;
            width: 400px;
            max-width: 90vw;
            height: 500px;
            background: rgba(30, 41, 59, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 16px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            display: none;
            flex-direction: column;
            z-index: 1001;
        `;

        chatContainer.innerHTML = `
            <div style="padding: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-user-graduate" style="color: #667eea; font-size: 20px;"></i>
                    <span style="color: white; font-weight: bold;">Professeur IA</span>
                </div>
                <button id="ai-close-btn" style="background: none; border: none; color: #94a3b8; font-size: 20px; cursor: pointer;">×</button>
            </div>
            <div id="ai-messages" style="flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 15px;"></div>
            <div style="padding: 15px; border-top: 1px solid rgba(255,255,255,0.1); display: flex; gap: 10px;">
                <input id="ai-input" type="text" placeholder="Posez votre question..." style="flex: 1; padding: 10px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; color: white; outline: none;">
                <button id="ai-send-btn" style="padding: 10px 20px; background: #667eea; border: none; border-radius: 8px; color: white; cursor: pointer; font-weight: bold;">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        `;

        document.body.appendChild(bubble);
        document.body.appendChild(chatContainer);

        // Get references
        messagesDiv = document.getElementById('ai-messages');
        inputField = document.getElementById('ai-input');
        sendBtn = document.getElementById('ai-send-btn');
        closeBtn = document.getElementById('ai-close-btn');
    }

    function attachEventListeners() {
        bubble.addEventListener('click', toggle);
        closeBtn.addEventListener('click', close);
        sendBtn.addEventListener('click', sendMessage);
        inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });

        // Hover effect
        bubble.addEventListener('mouseenter', () => {
            bubble.style.transform = 'scale(1.1)';
        });
        bubble.addEventListener('mouseleave', () => {
            bubble.style.transform = 'scale(1)';
        });
    }

    function show() {
        bubble.style.display = 'flex';
    }

    function hide() {
        bubble.style.display = 'none';
        close();
    }

    function toggle() {
        if (isOpen) {
            close();
        } else {
            open();
        }
    }

    function open() {
        chatContainer.style.display = 'flex';
        isOpen = true;
    }

    function close() {
        chatContainer.style.display = 'none';
        isOpen = false;
    }

    function addMessage(text, isUser = false) {
        const msgDiv = document.createElement('div');
        msgDiv.style.cssText = `
            padding: 12px 16px;
            border-radius: 12px;
            max-width: 80%;
            ${isUser ? 'background: #667eea; color: white; align-self: flex-end; margin-left: auto;' : 'background: rgba(255,255,255,0.1); color: #e2e8f0;'}
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
        loadingDiv.className = 'ai-loading';
        loadingDiv.style.cssText = 'padding: 12px; color: #94a3b8;';
        loadingDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Le professeur réfléchit...';
        messagesDiv.appendChild(loadingDiv);

        try {
            const response = await callAI(text);
            messagesDiv.removeChild(loadingDiv);
            addMessage(response);
        } catch (error) {
            messagesDiv.removeChild(loadingDiv);
            addMessage("Désolé, je n'ai pas pu obtenir de réponse. Réessayez plus tard.");
            console.error("AI Professor Error:", error);
        }
    }

    async function callAI(userMessage, context = {}) {
        if (!window.DCM_CONFIG || !DCM_CONFIG.aiProfessorUrl) {
            throw new Error("AI Professor URL not configured");
        }

        const payload = {
            message: userMessage,
            ...context
        };

        const res = await fetch(DCM_CONFIG.aiProfessorUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error("Network error");

        const data = await res.json();
        return data.response || data.message || "Pas de réponse disponible.";
    }

    function explainQuestion(question, userAnswer, correctAnswer, info) {
        show();
        open();

        const context = {
            question,
            user_answer: userAnswer,
            correct_answer: correctAnswer,
            info
        };

        addMessage(`Pourquoi la réponse "${correctAnswer}" est-elle correcte ?`, true);

        // Auto-send
        callAI("Explique cette question", context)
            .then(response => addMessage(response))
            .catch(() => addMessage("Erreur lors de la récupération de l'explication."));
    }

    return {
        init,
        show,
        hide,
        explainQuestion
    };
})();

// Auto-init on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => AIProfessor.init());
} else {
    AIProfessor.init();
}
