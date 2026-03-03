/**
 * Academy Interactive Guide & Progress Tracker
 * Phase 111: Educational Excellence
 */

export const AcademyGuide = {
    init: () => {
        console.log('🎓 Academy Guide Initializing...');
        AcademyGuide.createProgressTracker();
        AcademyGuide.initScrollTracking();
        AcademyGuide.initMicroInteractions();
    },

    createProgressTracker: () => {
        const tracker = document.createElement('div');
        tracker.className = 'academy-progress-tracker';
        tracker.innerHTML = `
            <div class="progress-container">
                <div class="progress-bar" id="academy-pbar"></div>
            </div>
            <div class="progress-label">
                <span id="p-percent">0%</span> • <span id="p-step">Introduction</span>
            </div>
        `;
        document.body.appendChild(tracker);

        // Inject Tracker CSS
        const style = document.createElement('style');
        style.textContent = `
            .academy-progress-tracker {
                position: fixed;
                bottom: 30px;
                right: 30px;
                background: rgba(15, 23, 42, 0.9);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                padding: 15px 20px;
                border-radius: 16px;
                z-index: 2000;
                width: 200px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.5);
                display: flex;
                flex-direction: column;
                gap: 10px;
                animation: slideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .progress-container {
                width: 100%;
                height: 4px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                overflow: hidden;
            }

            .progress-bar {
                height: 100%;
                width: 0%;
                background: linear-gradient(90deg, #3b82f6, #a855f7);
                transition: width 0.3s ease;
            }

            .progress-label {
                font-size: 11px;
                font-weight: 700;
                color: #94a3b8;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            #p-percent { color: #3b82f6; }

            @keyframes slideUp {
                from { transform: translateY(100px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    },

    initScrollTracking: () => {
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;

            const pbar = document.getElementById('academy-pbar');
            const ppercent = document.getElementById('p-percent');
            const pstep = document.getElementById('p-step');

            if (pbar) pbar.style.width = scrolled + "%";
            if (ppercent) ppercent.innerText = Math.round(scrolled) + "%";

            // Contextual Step Label
            if (scrolled < 15) pstep.innerText = "Introduction";
            else if (scrolled < 30) pstep.innerText = "Parcours";
            else if (scrolled < 60) pstep.innerText = "Apprentissage";
            else if (scrolled < 85) pstep.innerText = "Validation";
            else pstep.innerText = "Certification";
        });
    },

    initMicroInteractions: () => {
        // Add subtle hover animations to badge cards via JS for dynamic feel
        const badges = document.querySelectorAll('.badge-card');
        badges.forEach(badge => {
            badge.addEventListener('mouseenter', () => {
                const icon = badge.querySelector('.badge-icon i');
                if (icon) icon.style.transform = 'scale(1.2) rotate(10deg)';
            });
            badge.addEventListener('mouseleave', () => {
                const icon = badge.querySelector('.badge-icon i');
                if (icon) icon.style.transform = 'scale(1) rotate(0deg)';
            });
        });
    }
};

// Auto-init
document.addEventListener('DOMContentLoaded', AcademyGuide.init);
