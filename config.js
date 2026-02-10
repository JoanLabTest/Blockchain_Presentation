// CONFIGURATION CENTRALE - DCM DIGITAL
// Modifiez ces valeurs pour mettre à jour l'ensemble de la présentation.

const DCM_CONFIG = {
    // Taux de rendement affiché (Yield)
    rate: "3.15%",
    
    // Montant de l'émission Siemens (Simulateur & Benchmarks)
    siemensAmount: "300 M€",
    
    // Montant de l'émission Natixis (Benchmarks)
    natixisAmount: "100 M€",
    
    // ROI : Économie sur les frais de conservation (Custody)
    roiCustody: "40%"
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
