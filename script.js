// ===================================
// PROGRESS BAR & ACTIVE SECTION (AUDIT FIX)
// ===================================
function updateProgressBar() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;

    // Target the correct ID from guide.html
    const progressBar = document.getElementById('progressBarFill');
    if (progressBar) {
        progressBar.style.width = scrolled + '%';
    }
}

window.addEventListener('scroll', updateProgressBar);

// Active Section Highlighter
// Active Section Highlighter (Modified for Sidebar)
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-dropdown-menu a, .toc-sidebar a'); // Include Sidebar

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // Active triggers when section is near top
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                if (id) {
                    // Remove active class from all
                    navLinks.forEach(link => {
                        link.classList.remove('active-section'); // For header dropdowns
                        link.classList.remove('active');         // For sidebar
                    });

                    // Add to current in Dropdowns
                    const activeDropdownLink = document.querySelector(`.nav-dropdown-menu a[href="#${id}"]`);
                    if (activeDropdownLink) activeDropdownLink.classList.add('active-section');

                    // Add to current in Sidebar
                    const activeSidebarLink = document.querySelector(`.toc-sidebar a[href="#${id}"]`);
                    if (activeSidebarLink) activeSidebarLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        if (section.id) observer.observe(section);
    });
});

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
// MOBILE MENU TOGGLE (AUDIT FIX)
// ===================================
function toggleMobileMenu() {
    console.log("Toggle Menu Triggered");
    const navLinks = document.querySelector('.nav-links-pro, .nav-links');
    if (navLinks) {
        navLinks.classList.toggle('active');

        // Accessibility: Toggle Aria Expanded
        const btn = document.querySelector('.mobile-menu-toggle');
        if (btn) {
            const isExpanded = navLinks.classList.contains('active');
            btn.setAttribute('aria-expanded', isExpanded);
        }
    }
}

// Close Mobile Menu on Link Click
document.addEventListener('DOMContentLoaded', () => {
    const mobileLinks = document.querySelectorAll('.nav-links-pro a, .nav-links a');
    const navLinks = document.querySelector('.nav-links-pro, .nav-links');

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        });
    });
});


/* ===================================
   WEB3 WALLET SIMULATION
   =================================== */
document.addEventListener('DOMContentLoaded', () => {
    checkWalletConnection();
});

function openWalletModal() {
    const modal = document.getElementById('walletModalOverlay');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeWalletModal() {
    const modal = document.getElementById('walletModalOverlay');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        // Reset status
        const status = document.getElementById('walletStatus');
        if (status) status.innerHTML = '';
    }
}

async function simulateConnection(provider) {
    const status = document.getElementById('walletStatus');
    if (!status) return;

    // Helper for delay
    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // STEP 1: Requesting Access
    status.innerHTML = `
        <div style="text-align:left; font-size:14px; color:#94a3b8; background:rgba(255,255,255,0.05); padding:15px; border-radius:8px;">
            <div style="margin-bottom:8px;">
                <i class="fas fa-circle-notch fa-spin" style="color:#3b82f6; width:20px;"></i> 
                <span style="color:#e2e8f0;">Requesting Access...</span>
            </div>
            <div style="font-size:12px; color:#64748b; margin-left:24px;">Connection to ${provider} pending approval.</div>
        </div>`;

    await wait(1500);

    // STEP 2: Signing Message
    status.innerHTML = `
        <div style="text-align:left; font-size:14px; color:#94a3b8; background:rgba(255,255,255,0.05); padding:15px; border-radius:8px;">
            <div style="margin-bottom:8px; display:flex; align-items:center;">
                <i class="fas fa-check-circle" style="color:#10b981; width:20px;"></i> 
                <span style="color:#64748b; text-decoration:line-through;">Access Granted</span>
            </div>
            <div style="margin-bottom:8px;">
                <i class="fas fa-file-signature fa-bounce" style="color:#f59e0b; width:20px;"></i> 
                <span style="color:#e2e8f0;">Signing Message...</span>
            </div>
            <div style="font-size:12px; color:#f59e0b; margin-left:24px;">
                "Authentication required. Please sign to prove ownership."
            </div>
        </div>`;
    
    await wait(2000);

    // STEP 3: Success
    status.innerHTML = `
        <div style="text-align:left; font-size:14px; color:#94a3b8; background:rgba(255,255,255,0.05); padding:15px; border-radius:8px;">
            <div style="margin-bottom:8px;">
                <i class="fas fa-check-circle" style="color:#10b981; width:20px;"></i> 
                <span style="color:#10b981;">Successfully Connected!</span>
            </div>
             <div style="font-size:12px; color:#64748b; margin-left:24px;">Session Token Generated.</div>
        </div>`;
    
    await wait(1000);

    // Generate random address like 0x71C...9A2
    const randomAddr = '0x' + Array(40).fill(0).map(x => Math.random().toString(16)[2]).join('').substring(0, 4) + '...' + Array(4).fill(0).map(x => Math.random().toString(16)[2]).join('');

    // Persist
    localStorage.setItem('dcm_wallet_connected', 'true');
    localStorage.setItem('dcm_wallet_address', randomAddr);
    localStorage.setItem('dcm_wallet_provider', provider);

    // Update UI
    updateWalletUI(randomAddr);

    // Close modal after short delay
    setTimeout(() => {
        closeWalletModal();
    }, 1000);
}

function checkWalletConnection() {
    const isConnected = localStorage.getItem('dcm_wallet_connected');
    const address = localStorage.getItem('dcm_wallet_address');

    if (isConnected === 'true' && address) {
        updateWalletUI(address);
    }
}

function updateWalletUI(address) {
    const btns = document.querySelectorAll('#connectWalletBtn');

    btns.forEach(btn => {
        btn.classList.add('connected');
        btn.innerHTML = `<i class="fas fa-user-check"></i> ${address}`;
        // Optional: Change onclick to disconnect or show profile
        btn.onclick = () => {
            if (confirm('Disconnect Wallet?')) {
                disconnectWallet();
            }
        };
    });
}

function disconnectWallet() {
    localStorage.removeItem('dcm_wallet_connected');
    localStorage.removeItem('dcm_wallet_address');
    localStorage.removeItem('dcm_wallet_provider');

    const btns = document.querySelectorAll('#connectWalletBtn');
    btns.forEach(btn => {
        btn.classList.remove('connected');
        btn.innerHTML = `<i class="fas fa-wallet"></i> <span>Connect Wallet</span>`;
        btn.onclick = openWalletModal;
    });
}

// Close modal when clicking outside

// Limit Modal Close
window.onclick = function (event) {
    const modal = document.getElementById('walletModalOverlay');
    if (event.target == modal) {
        closeWalletModal();
    }
}

// ===================================
// TRANSACTION SIMULATOR (PHASE 4)
// ===================================

function updateTotal() {
    const qtyInput = document.getElementById('order-qty');
    const priceInput = document.getElementById('order-price');
    const totalDisplay = document.getElementById('order-total');

    if (qtyInput && priceInput && totalDisplay) {
        const qty = parseFloat(qtyInput.value) || 0;
        const price = parseFloat(priceInput.value) || 0;
        const total = (qty * (price / 100));

        // Format Display
        totalDisplay.innerText = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(total);
    }
}

function executeTrade() {
    const modal = document.getElementById('execution-modal');
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const step3 = document.getElementById('step-3');
    const successMsg = document.getElementById('success-message');
    const stepsContainer = document.querySelector('.steps-container');

    // Open Modal
    if (modal) modal.style.display = 'flex';

    // Reset State
    if (stepsContainer) stepsContainer.style.display = 'block';
    if (successMsg) successMsg.style.display = 'none';
    [step1, step2, step3].forEach(step => {
        if (step) {
            step.style.opacity = '0.5';
            step.querySelector('i').className = 'fa-regular fa-circle';
        }
    });

    // Animation Sequence
    setTimeout(() => {
        // EDUCATIONAL TOOLTIP
        alert("✍️ CONCEPT CLÉ : La Signature Cryptographique\n\nDans la Blockchain, vous ne tapez pas de mot de passe. Vous 'signez' mathématiquement la transaction avec votre clé privée. C'est infalsifiable.");

        // Step 1
        if (step1) {
            step1.style.opacity = '1';
            step1.querySelector('i').className = 'fa-solid fa-check-circle';
            step1.querySelector('i').style.color = '#10b981';
        }

        setTimeout(() => {
            // Step 2
            if (step2) {
                step2.style.opacity = '1';
                step2.querySelector('i').className = 'fa-solid fa-check-circle';
                step2.querySelector('i').style.color = '#10b981';
            }

            setTimeout(() => {
                // Step 3
                if (step3) {
                    step3.style.opacity = '1';
                    step3.querySelector('i').className = 'fa-solid fa-check-circle';
                    step3.querySelector('i').style.color = '#10b981';
                }

                // Show Success
                setTimeout(() => {
                    if (stepsContainer) stepsContainer.style.display = 'none';
                    if (successMsg) {
                        successMsg.style.display = 'block';
                        // Generate Fake Hash
                        const randomHash = '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
                        const hashSpan = successMsg.querySelector('span');
                        if (hashSpan) hashSpan.innerText = `Settlement ID: ${randomHash.substring(0, 10)}...${randomHash.substring(randomHash.length - 8)}`;
                    }
                }, 800);

            }, 800);
        }, 800);
    }, 500);
}

function closeModal() {
    const modal = document.getElementById('execution-modal');
    if (modal) modal.style.display = 'none';
}
