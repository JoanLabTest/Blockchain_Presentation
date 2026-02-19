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
            const response = await callAI(text, {}, 'guide_chat');
            messagesDiv.removeChild(loadingDiv);
            addMessage(response);
        } catch (error) {
            messagesDiv.removeChild(loadingDiv);
            addMessage("Désolé, je n'ai pas pu obtenir de réponse. Réessayez plus tard.");
            console.error("AI Professor Error:", error);
        }
    }

    async function callAI(userMessage, context = {}, type = 'guide_chat') {
        const supabaseUrl = window.DCM_CONFIG?.supabaseUrl || "https://wnwerjuqtrduqkgwdjrg.supabase.co";
        const functionUrl = `${supabaseUrl}/functions/v1/ai-professor`;
        const anonKey = window.DCM_CONFIG?.supabaseKey;

        // Identify user level to adapt language
        let userLevel = 'Beginner';
        try {
            const profile = JSON.parse(localStorage.getItem('dcm_user_profile') || '{}');
            userLevel = profile.role || 'Beginner';
        } catch (e) { }

        const payload = {
            question: userMessage,
            context: JSON.stringify(context),
            user_level: userLevel,
            type: type
        };

        const res = await fetch(functionUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${anonKey}`
            },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const err = await res.text();
            throw new Error(`Edge Function error: ${err}`);
        }

        const data = await res.json();
        return data.reply || "Le professeur IA n'a pas pu formuler de réponse.";
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

        // Show loading manually for programmatic trigger
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'ai-loading';
        loadingDiv.style.cssText = 'padding: 12px; color: #94a3b8;';
        loadingDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Le professeur réfléchit...';
        messagesDiv.appendChild(loadingDiv);

        // Auto-send with specific type
        callAI("Peux-tu m'expliquer pourquoi je me suis trompé sur cette question, en t'appuyant sur l'explication officielle ?", context, 'quiz_feedback')
            .then(response => {
                messagesDiv.removeChild(loadingDiv);
                addMessage(response);
            })
            .catch(() => {
                messagesDiv.removeChild(loadingDiv);
                addMessage("Erreur lors de la récupération de l'explication.");
            });
    }

    function analyzeSession(sessionContext) {
        show();
        open();

        addMessage(`Génération d'un résumé de session d'après tes résultats...`, true);

        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'ai-loading';
        loadingDiv.style.cssText = 'padding: 12px; color: #94a3b8;';
        loadingDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Le professeur analyse les données...';
        messagesDiv.appendChild(loadingDiv);

        callAI("Fais-moi un débriefing de ma session de quiz. Félicite-moi ou encourage-moi selon le score. Indique mes points forts et les thèmes à réviser.", sessionContext, 'quiz_feedback')
            .then(response => {
                messagesDiv.removeChild(loadingDiv);
                addMessage(response);
            })
            .catch(() => {
                messagesDiv.removeChild(loadingDiv);
                addMessage("Erreur lors de l'analyse de la session.");
            });
    }

    return {
        init,
        show,
        hide,
        explainQuestion,
        analyzeSession
    };
})();

// Auto-init on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => AIProfessor.init());
} else {
    AIProfessor.init();
}
