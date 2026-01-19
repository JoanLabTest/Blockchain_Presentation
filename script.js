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
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all fade-in elements
document.addEventListener('DOMContentLoaded', () => {
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));
});

// ===================================
// NAVIGATION SCROLL EFFECT
// ===================================
let lastScroll = 0;
const nav = document.querySelector('nav');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// ===================================
// SMOOTH SCROLL FOR NAVIGATION
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// COUNTER ANIMATION
// ===================================
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// ===================================
// PARALLAX EFFECT
// ===================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-image');

    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ===================================
// CARD TILT EFFECT (OPTIONAL)
// ===================================
const cards = document.querySelectorAll('.card');

cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// ===================================
// DYNAMIC GRADIENT BACKGROUND
// ===================================
function createGradientAnimation() {
    const hero = document.querySelector('.hero');
    let hue = 250;

    setInterval(() => {
        hue = (hue + 1) % 360;
        const gradient = `radial-gradient(circle at 20% 50%, hsla(${hue}, 70%, 50%, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 80% 80%, hsla(${(hue + 60) % 360}, 70%, 50%, 0.1) 0%, transparent 50%)`;
        hero.style.background = `${gradient}, var(--bg-dark)`;
    }, 50);
}

// Initialize gradient animation
createGradientAnimation();

// ===================================
// TYPING EFFECT FOR HERO SUBTITLE
// ===================================
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// Initialize typing effect when page loads
window.addEventListener('load', () => {
    const subtitle = document.querySelector('.hero-subtitle');
    if (subtitle) {
        const originalText = subtitle.textContent;
        typeWriter(subtitle, originalText, 50);
    }
});

// ===================================
// LOADING ANIMATION
// ===================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    // Trigger initial animations
    setTimeout(() => {
        const firstSection = document.querySelector('.fade-in');
        if (firstSection) {
            firstSection.classList.add('visible');
        }
    }, 300);
});

// ===================================
// INTERACTIVE BLOCKCHAIN VISUALIZATION
// ===================================
function createBlockchainVisualization() {
    const canvas = document.getElementById('blockchain-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const blocks = [];
    const blockCount = 5;
    const blockWidth = 80;
    const blockHeight = 60;
    const spacing = 40;

    // Create blocks
    for (let i = 0; i < blockCount; i++) {
        blocks.push({
            x: 50 + i * (blockWidth + spacing),
            y: canvas.height / 2 - blockHeight / 2,
            width: blockWidth,
            height: blockHeight,
            color: `hsl(${250 + i * 20}, 70%, 60%)`
        });
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw blocks
        blocks.forEach((block, index) => {
            // Draw block
            ctx.fillStyle = block.color;
            ctx.fillRect(block.x, block.y, block.width, block.height);

            // Draw connection to next block
            if (index < blocks.length - 1) {
                ctx.strokeStyle = '#00d4ff';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(block.x + block.width, block.y + block.height / 2);
                ctx.lineTo(blocks[index + 1].x, blocks[index + 1].y + block.height / 2);
                ctx.stroke();
            }

            // Draw block number
            ctx.fillStyle = '#ffffff';
            ctx.font = '16px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(`#${index + 1}`, block.x + block.width / 2, block.y + block.height / 2 + 5);
        });

        requestAnimationFrame(animate);
    }

    animate();
}

// Initialize blockchain visualization if canvas exists
document.addEventListener('DOMContentLoaded', () => {
    createBlockchainVisualization();
});

// ===================================
// MOBILE MENU TOGGLE (if needed)
// ===================================
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// ===================================
// PERFORMANCE OPTIMIZATION
// ===================================
// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll-heavy operations
const debouncedScroll = debounce(() => {
    // Any heavy scroll operations here
}, 10);

window.addEventListener('scroll', debouncedScroll);

// ===================================
// FAQ TOGGLE FUNCTION
// ===================================
function toggleFaq(button) {
    button.classList.toggle("active");
    var answer = button.nextElementSibling;
    var icon = button.querySelector(".faq-icon");

    if (answer.classList.contains("active")) {
        answer.classList.remove("active");
        icon.textContent = "+";
    } else {
        // Close all other FAQs
        document.querySelectorAll('.faq-answer.active').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelectorAll('.faq-question.active').forEach(item => {
            item.classList.remove('active');
            item.querySelector('.faq-icon').textContent = "+";
        });

        // Open clicked FAQ
        answer.classList.add("active");
        icon.textContent = "−";
    }
}
