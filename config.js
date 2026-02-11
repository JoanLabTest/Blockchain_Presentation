// CONFIGURATION CENTRALE - DCM DIGITAL
// Modifiez ces valeurs pour mettre à jour l'ensemble de la présentation.

window.DCM_CONFIG = {
    // Taux de rendement affiché (Yield)
    rate: "3.15%",

    // Montant de l'émission Siemens (Simulateur & Benchmarks)
    siemensAmount: "300 M€",

    // Montant de l'émission Natixis (Benchmarks)
    natixisAmount: "100 M€",

    // ROI : Économie sur les frais de conservation (Custody)
    roiCustody: "40%",

    // Webhook URL (n8n/Make/Zapier) - Tracking des Certifications
    webhookUrl: "https://n8n.domain.com/webhook/agent-x",

    // AI Professor (n8n Workflow)
    aiProfessorUrl: "https://joanl.app.n8n.cloud/webhook/ai-professor-v18",

    // Finance Agent (n8n Workflow - RWA Expert)
    financeAgentUrl: "https://joanl.app.n8n.cloud/webhook/rwa-expert-v18",

    // Legal Agent (n8n Workflow - Legal Expert)
    legalAgentUrl: "https://joanl.app.n8n.cloud/webhook/legal-expert-v18",

    // Analytics Dashboard (n8n Workflow - KPIs)
    analyticsUrl: "https://joanl.app.n8n.cloud/webhook/academy-analytics-v18",

    // SUPABASE CONFIGURATION (Database & Auth)
    supabaseUrl: "https://wnwerjuqtrduqkgwdjrg.supabase.co",
    // NOTE: This is the 'anon' public key. It is safe to expose in the browser 
    // as long as Row Level Security (RLS) policies are properly configured in Supabase.
    supabaseKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indud2VyanVxdHJkdXFrZ3dkanJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3Mzg3OTEsImV4cCI6MjA4NjMxNDc5MX0.0WqMQs84PFAHuoMQT8xiAZYpWN5b2XGeumtaNzRHcoo"
};

// Fonction d'injection automatique au chargement
document.addEventListener('DOMContentLoaded', () => {
    // 1. Injecter le Taux (Rate)
    document.querySelectorAll('[data-config="rate"]').forEach(el => {
        el.innerText = DCM_CONFIG.rate;
    });

    // 2. Injecter le Montant Siemens
    document.querySelectorAll('[data-config="siemensAmount"]').forEach(el => {
        // Conserver le texte environnant si nécessaire, ou remplacer juste la valeur.
        // Ici on suppose que l'élément contient UNIQUEMENT le montant ou qu'on cible un span spécifique.
        el.innerText = DCM_CONFIG.siemensAmount;
    });

    // 3. Injecter le Montant Natixis
    document.querySelectorAll('[data-config="natixisAmount"]').forEach(el => {
        el.innerText = DCM_CONFIG.natixisAmount;
    });

    // 4. Injecter le ROI Custody
    document.querySelectorAll('[data-config="roiCustody"]').forEach(el => {
        el.innerText = DCM_CONFIG.roiCustody;
    });

    console.log("DCM CONFIG Loaded:", DCM_CONFIG);
});

// Fonction pour envoyer un Webhook (Lead Magnet / Tracking)
DCM_CONFIG.sendWebhook = function (data) {
    if (!DCM_CONFIG.webhookUrl) return;

    // Enrichissement des données
    const payload = {
        ...data,
        timestamp: new Date().toISOString(),
        environment: window.location.hostname
    };

    fetch(DCM_CONFIG.webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
        .then(res => console.log("Webhook Sent:", res.status))
        .catch(err => console.error("Webhook Error:", err));
};
