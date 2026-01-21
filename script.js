// ===================================
// PROGRESS BAR
// ===================================
function updateProgressBar() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        progressBar.style.width = scrolled + '%';
    }
}

window.addEventListener('scroll', updateProgressBar);

// ===================================
// SCROLL ANIMATIONS
// ===================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ===================================
// SMOOTH SCROLL
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===================================
// SCROLL TO TOP BUTTON
// ===================================
const scrollTopBtn = document.querySelector('.scroll-to-top');
if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===================================
// TRADING DESK SIMULATOR
// ===================================

// 1. Mise à jour automatique du total
function updateTotal() {
    const qty = parseFloat(document.getElementById('order-qty')?.value);
    const price = parseFloat(document.getElementById('order-price')?.value);
    if (!isNaN(qty) && !isNaN(price)) {
        const total = qty * (price / 100);
        const totalElement = document.getElementById('order-total');
        if (totalElement) {
            totalElement.innerText = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(total);
        }
    }
}

// 2. Simulation de variation de prix (Live Effect)
setInterval(() => {
    const priceElement = document.getElementById('live-price');
    if (priceElement) {
        const basePrice = 99.85;
        const variation = (Math.random() * 0.04) - 0.02;
        const newPrice = (basePrice + variation).toFixed(2);

        priceElement.innerText = newPrice;
        priceElement.style.color = variation > 0 ? '#10b981' : '#ef4444';
        setTimeout(() => priceElement.style.color = '#fff', 500);
    }
}, 3000);

// 3. Séquence d'exécution (Le "Wow Effect")
function executeTrade() {
    const modal = document.getElementById('execution-modal');
    const steps = [
        document.getElementById('step-1'),
        document.getElementById('step-2'),
        document.getElementById('step-3')
    ];
    const successMsg = document.getElementById('success-message');
    const stepsContainer = document.querySelector('.steps-container');

    if (!modal || !steps[0] || !successMsg || !stepsContainer) return;

    modal.style.display = 'flex';
    successMsg.style.display = 'none';
    stepsContainer.style.display = 'block';
    steps.forEach(s => { s.className = 'step-item'; });

    setTimeout(() => { steps[0].classList.add('active'); }, 500);
    setTimeout(() => { steps[0].classList.add('done'); steps[1].classList.add('active'); }, 1500);
    setTimeout(() => { steps[1].classList.add('done'); steps[2].classList.add('active'); }, 3000);
    setTimeout(() => {
        steps[2].classList.add('done');
        setTimeout(() => {
            stepsContainer.style.display = 'none';
            successMsg.style.display = 'block';
            const cashBalance = document.getElementById('cash-balance');
            if (cashBalance) {
                cashBalance.innerText = "9,001,500";
            }
        }, 800);
    }, 4500);
}

function closeModal() {
    const modal = document.getElementById('execution-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// ===================================
// CALCULATEUR DE ROI
// ===================================
function calculateROI() {
    // Récupération des valeurs
    const volume = parseFloat(document.getElementById('volumeInput')?.value || 0);
    const duration = parseInt(document.getElementById('durationInput')?.value || 5);

    // Mise à jour affichage durée
    const durationValueEl = document.getElementById('durationValue');
    if (durationValueEl) {
        durationValueEl.innerText = duration + " ans";
    }

    // Hypothèses (en bps)
    const custodyCost = 2.0; // bps
    const agentCost = 1.5;   // bps

    // Économies (40% sur custody, 80% sur agent)
    const savingsCustody = volume * (custodyCost * 0.0001) * 0.40;
    const savingsAgent = volume * (agentCost * 0.0001) * 0.80;

    const totalSavingsYear = savingsCustody + savingsAgent;
    const totalSavingsLife = totalSavingsYear * duration;
    const marginGain = (savingsCustody + savingsAgent) / volume * 10000;

    // Formatage et Affichage
    const formatter = new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0
    });

    const savingsYearEl = document.getElementById('savingsYear');
    const savingsTotalEl = document.getElementById('savingsTotal');
    const marginGainEl = document.getElementById('marginGain');

    if (savingsYearEl) savingsYearEl.innerText = formatter.format(totalSavingsYear);
    if (savingsTotalEl) savingsTotalEl.innerText = formatter.format(totalSavingsLife);
    if (marginGainEl) marginGainEl.innerText = "+" + marginGain.toFixed(2) + " bps";
}

// Calcul initial au chargement
setTimeout(() => {
    if (document.getElementById('volumeInput')) {
        calculateROI();
    }
}, 500);

// ===================================
// SCROLL TO TOP / BOTTOM BUTTONS
// ===================================
const scrollToTopBtn = document.getElementById('scrollToTop');
const scrollToBottomBtn = document.getElementById('scrollToBottom');

// Afficher/masquer les boutons selon la position de scroll
window.addEventListener('scroll', function () {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Bouton "Remonter" : visible après 300px de scroll
    if (scrollPosition > 300) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }

    // Bouton "Descendre" : visible seulement en haut de page
    // Masqué si on est à plus de 300px du haut OU proche du bas
    if (scrollPosition < 300 && (documentHeight - scrollPosition - windowHeight) > 500) {
        scrollToBottomBtn.classList.add('visible');
    } else {
        scrollToBottomBtn.classList.remove('visible');
    }
});

// Clic sur "Remonter"
if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Clic sur "Descendre"
if (scrollToBottomBtn) {
    scrollToBottomBtn.addEventListener('click', function () {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth'
        });
    });
}

// ===================================
// FAQ ACCORDION
// ===================================
function toggleFaq(button) {
    const faqItem = button.parentElement;
    const answer = faqItem.querySelector('.faq-answer');
    const icon = button.querySelector('.faq-icon');

    // Toggle active class
    const isActive = faqItem.classList.contains('active');

    // Close all other FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== faqItem) {
            item.classList.remove('active');
            const otherAnswer = item.querySelector('.faq-answer');
            const otherIcon = item.querySelector('.faq-icon');
            if (otherAnswer) otherAnswer.style.maxHeight = null;
            if (otherIcon) otherIcon.textContent = '+';
        }
    });

    // Toggle current item
    if (isActive) {
        faqItem.classList.remove('active');
        answer.style.maxHeight = null;
        icon.textContent = '+';
    } else {
        faqItem.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        icon.textContent = '−';
    }
}

