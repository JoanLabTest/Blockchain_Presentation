/**
 * NAVIGATION MANAGER - v2.0 (Phase 96)
 * Dynamically renders the sidebar based on the 4-Pillar Institutional Architecture.
 * Supports: Core, Governance, Toolkit, Academic.
 */

// checkFeature is exposed as window.checkFeature by feature-flags.js
const _checkFeature = (segment, feature) => {
    if (typeof window.checkFeature === 'function') return window.checkFeature(segment, feature);
    return true; // permissive fallback in dev mode
};

const NavigationManager = {

    // --- PILLAR DEFINITIONS ---
    PILLARS: {
        CORE: {
            name: 'Core Intelligence',
            icon: 'fa-brain',
            links: [
                { id: 'nav-dash', name: 'Dashboard', link: 'dashboard.html', icon: 'fa-chart-pie', active: true },
                { id: 'nav-ecb', name: 'ECB DLT Trials', link: 'ecb-dlt-trials.html', icon: 'fa-globe-europe' },
                { id: 'nav-rwa', name: 'RWA Vertical', link: 'rwa-analytics.html', icon: 'fa-layer-group', feature: 'ORG_MANAGEMENT' },
                { id: 'nav-risk', name: 'Risk Engine', link: 'dashboard.html#risk-card', icon: 'fa-shield-virus' },
                { id: 'nav-yield', name: 'Yield Lab', link: 'yield-mechanics.html', icon: 'fa-flask-vial' }
            ]
        },
        GOVERNANCE: {
            name: 'Governance & Trust',
            icon: 'fa-gavel',
            links: [
                { id: 'nav-admin', name: 'Corporate Admin', link: 'dashboard.html?tab=admin', icon: 'fa-building-user', feature: 'ORG_MANAGEMENT' },
                { id: 'nav-mica', name: 'MiCA Simulator', link: 'mica-simulator.html', icon: 'fa-scale-balanced' },
                { id: 'nav-validation', name: 'Model Validation', link: 'dashboard.html?tab=validation', icon: 'fa-microscope', feature: 'ORG_MANAGEMENT' },
                { id: 'nav-audit', name: 'Audit Trails', link: 'audit-trail.html', icon: 'fa-fingerprint', feature: 'AUDIT_VIEW' },
                { id: 'nav-reports', name: 'Board-Ready Reports', link: 'dashboard.html?tab=reports', icon: 'fa-file-signature', feature: 'ORG_MANAGEMENT' },
                { id: 'nav-org', name: 'Org Settings', link: 'org-settings.html', icon: 'fa-users-gear', feature: 'ORG_MANAGEMENT' },
                { id: 'nav-security', name: 'Security Center', link: 'security.html', icon: 'fa-lock' }
            ]
        },
        TOOLKIT: {
            name: 'Professional Toolkit',
            icon: 'fa-toolbox',
            links: [
                { id: 'nav-roi', name: 'ROI Calculator', link: 'flux-comparison.html', icon: 'fa-calculator' },
                { id: 'nav-sandbox', name: 'Dev Sandbox', link: 'sandbox.html', icon: 'fa-terminal' },
                { id: 'nav-workflows', name: 'Workflows', link: 'workflow-center.html', icon: 'fa-bolt', feature: 'ORG_MANAGEMENT' },
                { id: 'nav-compare', name: 'Market Benchmarks', link: 'network-comparator.html', icon: 'fa-code-compare' }
            ]
        },
        ACADEMIC: {
            name: 'Academy & Certification',
            icon: 'fa-graduation-cap',
            links: [
                { id: 'nav-academy', name: 'Learning Path', link: 'students.html', icon: 'fa-book-open' },
                { id: 'nav-quiz', name: 'Certification Exam', link: 'quiz.html', icon: 'fa-award' },
                { id: 'nav-review', name: 'My History', link: 'quiz-review.html', icon: 'fa-clock-rotate-left' }
            ]
        }
    },

    /**
     * Renders the sidebar into the target element.
     */
    renderSidebar: (segment, target) => {
        console.log(`🛠️ NavigationManager: Rendering sidebar for [${segment}]`, target);
        if (!target) {
            console.error('❌ NavigationManager: Target element not found!');
            return;
        }

        const hubAnchors = {
            student: '#learning',
            pro: '#toolkit',
            enterprise: '#governance',
            institutional: '#governance',
            free: '#core',
            Guest: '#core',
            guest: '#core'
        };
        const anchor = hubAnchors[segment] || '';

        // Standard Brand Header (Phase 115)
        const brandHtml = `
            <div class="brand">
                <div class="brand-icon"><i class="fas fa-cube"></i></div>
                <div class="brand-text">DCM <span>DIGITAL</span></div>
            </div>
            <ul class="nav-menu" id="side-nav-menu" style="list-style: none; padding: 0;">
        `;

        let html = `
            <li style="list-style: none;"><a href="index.html" class="nav-item"><i class="fas fa-home"></i> Back to Hub</a></li>
        `;

        // Determine which pillars to show/prioritize based on segment
        const segmentConfigs = {
            student: ['ACADEMIC', 'CORE', 'TOOLKIT', 'GOVERNANCE'],
            pro: ['CORE', 'TOOLKIT', 'GOVERNANCE', 'ACADEMIC'],
            enterprise: ['CORE', 'GOVERNANCE', 'TOOLKIT', 'ACADEMIC'],
            institutional: ['CORE', 'GOVERNANCE', 'TOOLKIT', 'ACADEMIC'],
            risk_officer: ['CORE', 'GOVERNANCE', 'TOOLKIT', 'ACADEMIC'],
            auditor: ['GOVERNANCE', 'CORE', 'TOOLKIT'],
            analyst: ['CORE', 'TOOLKIT', 'GOVERNANCE'],
            free: ['CORE', 'ACADEMIC', 'TOOLKIT', 'GOVERNANCE'],
            guest: ['CORE', 'ACADEMIC', 'TOOLKIT', 'GOVERNANCE'],
            Guest: ['CORE', 'ACADEMIC', 'TOOLKIT', 'GOVERNANCE']
        };

        const activePillars = segmentConfigs[segment] || segmentConfigs.free;

        activePillars.forEach(pillarKey => {
            const pillar = NavigationManager.PILLARS[pillarKey];

            html += `
                <li class="nav-section-header" style="margin-top: 25px; padding: 0 15px; font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 1.5px; list-style: none;">
                    <i class="fas ${pillar.icon}" style="margin-right: 8px; opacity: 0.5;"></i> ${pillar.name}
                </li>
            `;

            pillar.links.forEach(item => {
                const isEnabled = !item.feature || _checkFeature(segment, item.feature);
                const style = isEnabled ? '' : 'opacity:0.4; filter:grayscale(1); cursor:not-allowed;';
                const title = isEnabled ? '' : 'title="Module reserved for higher plans"';

                html += `
                    <li style="list-style: none;">
                        <a href="${isEnabled ? item.link : '#'}" 
                           class="nav-item ${item.active ? 'active' : ''}" 
                           style="${style}" 
                           ${title}
                           ${item.id ? `id="${item.id}"` : ''}
                           data-tab="${item.link.includes('?tab=') ? item.link.split('tab=')[1] : ''}">
                            <i class="fas ${item.icon}"></i> ${item.name}
                            ${!isEnabled ? '<i class="fas fa-lock" style="margin-left:auto; font-size:10px;"></i>' : ''}
                        </a>
                    </li>
                `;
            });
        });

        // Add Footer
        const isJoan = (user.email === 'joanlyczak@gmail.com');
        const tierColors = { enterprise: '#f59e0b', institutional: '#f59e0b', pro: '#3b82f6', free: '#64748b' };
        const tierColor = tierColors[user.subscription_tier] || '#64748b';
        const rawTier = (user.subscription_tier || 'free');
        
        let tierLabel = isJoan ? 'PRO FULL ACCESS' : (rawTier === 'enterprise' ? 'PRO FULL ACCESS' : rawTier.toUpperCase());
        if (tierLabel === 'FREE') { tierLabel = 'FREE PLAN'; }
        
        // Improve Name Display: extraction of first name
        let userName = isJoan ? 'Joan' : (user.name || 'User').trim();
        if (userName.includes(' ')) userName = userName.split(' ')[0];

        html += `
            <li style="margin-top:auto; padding-top:20px; border-top:1px solid rgba(255,255,255,0.05); list-style: none;">
                <div style="padding:12px 15px; margin-bottom:8px; background:rgba(255,255,255,0.03); border-radius:10px; border:1px solid rgba(255,255,255,0.06);">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <div style="width:34px; height:34px; border-radius:50%; background:rgba(59,130,246,0.15); border:1px solid rgba(59,130,246,0.3); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                            <i class="fas fa-user" style="font-size:13px; color:#3b82f6;"></i>
                        </div>
                        <div style="overflow:hidden; flex:1;">
                            <div id="side-user-name" style="font-size:12px; font-weight:700; color:white; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${userName}</div>
                            <div id="side-user-role" style="font-size:10px; color:${tierColor}; font-weight:700; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${tierLabel}</div>
                        </div>
                    </div>
                    <div style="margin-top:8px;">
                        <span style="font-size:9px; font-weight:800; letter-spacing:1px; background:${tierColor}22; color:${tierColor}; border:1px solid ${tierColor}44; padding:2px 8px; border-radius:20px; opacity:0.8;">INSTITUTIONNAL GRADE</span>
                    </div>
                </div>
            </li>
 </li>
            <li style="list-style: none;">
                <a href="pricing.html" class="nav-item" style="color:var(--accent-gold)">
                    <i class="fas fa-crown"></i> UPGRADE PLAN
                </a>
            </li>
            <li style="list-style: none;">
                <a href="#" class="nav-item" style="color:#ef4444" onclick="event.preventDefault(); if(window.SessionManager) { window.SessionManager.logout(); } else { console.error('SessionManager not found'); window.location.href='login.html'; }">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </a>
            </li>
        `;

        // Smart Update: Injection vs Wrap
        if (target.id === 'side-nav-menu' || target.classList.contains('nav-menu')) {
            target.innerHTML = html;
        } else {
            target.innerHTML = brandHtml + html + '</ul>';
        }
    }
};

// Expose globally
if (typeof window !== 'undefined') {
    window.NavigationManager = NavigationManager;
}
