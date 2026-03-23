/**
 * DCM Core Institute – Lead Capture Modal (Brique 5)
 * Displays a premium popup at strategic conversion points.
 * Submits to Supabase `leads` table via the existing supabase-config.js credentials.
 *
 * Usage: window.DCMLeadCapture.show({ trigger: 'pdf_export', title: '...', subtitle: '...' })
 */
(function () {
    'use strict';

    const STORAGE_KEY  = 'dcm_lead_captured_v1';
    const PERSONA_KEY  = 'dcm_active_role';

    // ─── CSS ─────────────────────────────────────────────────────────────────
    const css = `
    #dcm-lead-overlay {
        position: fixed; inset: 0; z-index: 100000;
        background: rgba(2,6,23,0.88);
        backdrop-filter: blur(16px);
        display: flex; align-items: center; justify-content: center;
        padding: 20px;
        opacity: 0; transition: opacity 0.35s ease;
        pointer-events: none;
    }
    #dcm-lead-overlay.dcm-lead-active {
        opacity: 1; pointer-events: all;
    }
    .dcm-lead-modal {
        max-width: 520px; width: 100%;
        background: linear-gradient(160deg, rgba(15,23,42,0.99), rgba(2,6,23,0.99));
        border: 1px solid rgba(255,255,255,0.09);
        border-radius: 24px;
        padding: 48px 44px 36px;
        box-shadow: 0 40px 80px rgba(0,0,0,0.7);
        position: relative;
        transform: translateY(20px);
        transition: transform 0.35s ease;
    }
    #dcm-lead-overlay.dcm-lead-active .dcm-lead-modal {
        transform: translateY(0);
    }
    .dcm-lead-close {
        position: absolute; top: 18px; right: 20px;
        background: none; border: none; cursor: pointer;
        color: #475569; font-size: 18px; transition: color 0.2s;
    }
    .dcm-lead-close:hover { color: #94a3b8; }
    .dcm-lead-eyebrow {
        font-size: 10px; font-weight: 800; letter-spacing: 2px;
        text-transform: uppercase; color: #d4af37;
        font-family: 'JetBrains Mono', monospace;
        margin-bottom: 14px; display: block;
    }
    .dcm-lead-title {
        font-family: 'Outfit','Inter',sans-serif;
        font-size: 26px; font-weight: 800;
        color: #fff; margin: 0 0 8px; line-height: 1.2;
    }
    .dcm-lead-sub {
        color: #94a3b8; font-size: 14px; line-height: 1.5; margin: 0 0 28px;
    }
    .dcm-lead-form { display: flex; flex-direction: column; gap: 12px; }
    .dcm-lead-input {
        background: rgba(30,41,59,0.6);
        border: 1px solid rgba(255,255,255,0.09);
        border-radius: 10px; padding: 13px 16px;
        color: #f1f5f9; font-size: 14px; outline: none;
        transition: border-color 0.25s;
        font-family: 'Inter', sans-serif;
    }
    .dcm-lead-input::placeholder { color: #475569; }
    .dcm-lead-input:focus { border-color: rgba(59,130,246,0.5); }
    .dcm-lead-submit {
        background: linear-gradient(135deg, #3b82f6, #2563eb);
        border: none; border-radius: 10px;
        padding: 14px 24px; color: #fff;
        font-size: 15px; font-weight: 700;
        cursor: pointer; transition: 0.3s;
        font-family: 'Outfit','Inter',sans-serif;
        margin-top: 4px;
    }
    .dcm-lead-submit:hover { opacity: 0.88; transform: translateY(-1px); }
    .dcm-lead-submit:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
    .dcm-lead-gdpr {
        font-size: 11px; color: #475569; line-height: 1.5;
        margin-top: 10px; display: flex; align-items: flex-start; gap: 10px;
    }
    .dcm-lead-gdpr input { margin-top: 2px; flex-shrink: 0; accent-color: #3b82f6; }
    .dcm-lead-success {
        text-align: center; display: none; padding: 20px 0;
    }
    .dcm-lead-success-icon { font-size: 48px; color: #10b981; margin-bottom: 16px; }
    .dcm-lead-success-title { font-family: 'Outfit','Inter',sans-serif; font-size: 22px; font-weight: 800; color: #fff; margin-bottom: 8px; }
    .dcm-lead-success-msg { color: #94a3b8; font-size: 14px; }
    .dcm-lead-skip { display: block; text-align: center; margin-top: 16px; color: #475569; font-size: 12px; cursor: pointer; border: none; background: none; transition: color 0.2s; }
    .dcm-lead-skip:hover { color: #64748b; }
    @media(max-width:600px) { .dcm-lead-modal { padding: 32px 22px 24px; } .dcm-lead-title { font-size: 20px; } }
    `;

    let styleInjected = false;
    let overlayEl = null;
    let currentTrigger = 'modal';

    function injectStyles() {
        if (styleInjected) return;
        const s = document.createElement('style');
        s.textContent = css;
        document.head.appendChild(s);
        styleInjected = true;
    }

    function createOverlay() {
        if (document.getElementById('dcm-lead-overlay')) return;
        const div = document.createElement('div');
        div.id = 'dcm-lead-overlay';
        div.innerHTML = `
        <div class="dcm-lead-modal">
            <button class="dcm-lead-close" id="dcm-lead-close-btn"><i class="fas fa-times"></i></button>
            <span class="dcm-lead-eyebrow" id="dcm-lead-eyebrow">RAPPORT INSTITUTIONNEL</span>
            <h2 class="dcm-lead-title" id="dcm-lead-title">Recevoir le Rapport Complet</h2>
            <p class="dcm-lead-sub" id="dcm-lead-sub">Renseignez vos coordonnées pour recevoir une copie institutionnelle.</p>

            <div id="dcm-lead-form-wrap">
                <form class="dcm-lead-form" id="dcm-lead-form" autocomplete="on">
                    <input type="text"  class="dcm-lead-input" id="lead-name"        name="name"        placeholder="Nom complet / Full name"    required />
                    <input type="email" class="dcm-lead-input" id="lead-email"       name="email"       placeholder="Email institutionnel"        required />
                    <input type="text"  class="dcm-lead-input" id="lead-institution" name="institution" placeholder="Établissement (optionnel)" />
                    <div class="dcm-lead-gdpr">
                        <input type="checkbox" id="lead-gdpr" required />
                        <label for="lead-gdpr">J'accepte de recevoir des communications institutionnelles du DCM Core Institute et consent au traitement de mes données conformément au RGPD.</label>
                    </div>
                    <button type="submit" class="dcm-lead-submit" id="lead-submit-btn">
                        <i class="fas fa-paper-plane"></i> Recevoir l'accès
                    </button>
                </form>
                <button class="dcm-lead-skip" id="dcm-lead-skip-btn">Non merci, continuer sans accès</button>
            </div>

            <div class="dcm-lead-success" id="dcm-lead-success">
                <div class="dcm-lead-success-icon"><i class="fas fa-circle-check"></i></div>
                <div class="dcm-lead-success-title">Demande enregistrée !</div>
                <p class="dcm-lead-success-msg">Vous recevrez votre accès institutionnel dans les 24h. Merci de votre confiance.</p>
            </div>
        </div>`;
        document.body.appendChild(div);
        overlayEl = div;

        // Bind events
        document.getElementById('dcm-lead-close-btn').onclick = hideLead;
        document.getElementById('dcm-lead-skip-btn').onclick  = hideLead;
        document.getElementById('dcm-lead-form').onsubmit     = handleSubmit;
        div.addEventListener('click', function(e) { if (e.target === div) hideLead(); });
        document.addEventListener('keydown', function escKey(e) {
            if (e.key === 'Escape') { hideLead(); document.removeEventListener('keydown', escKey); }
        });
    }

    function hideLead() {
        if (!overlayEl) return;
        overlayEl.classList.remove('dcm-lead-active');
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const name        = document.getElementById('lead-name').value.trim();
        const email       = document.getElementById('lead-email').value.trim();
        const institution = document.getElementById('lead-institution').value.trim();
        const gdpr        = document.getElementById('lead-gdpr').checked;
        const btn         = document.getElementById('lead-submit-btn');

        if (!gdpr) { alert('Veuillez accepter les conditions RGPD pour continuer.'); return; }

        btn.disabled  = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours…';

        const cfg = window.SUPABASE_CONFIG;
        if (!cfg || cfg.url.includes('YOUR_SUPABASE')) {
            console.error('[DCM Lead] Supabase not configured.');
            btn.disabled  = false;
            btn.innerHTML = '<i class="fas fa-paper-plane"></i> Recevoir l\'accès';
            return;
        }

        try {
            const res = await fetch(`${cfg.url}/rest/v1/leads`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': cfg.anonKey,
                    'Authorization': `Bearer ${cfg.anonKey}`,
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify({
                    name,
                    email,
                    institution: institution || null,
                    persona: localStorage.getItem('dcm_active_role') || 'unknown',
                    source_page: window.location.pathname,
                    trigger: currentTrigger,
                    gdpr_consent: gdpr
                })
            });

            if (res.ok || res.status === 201) {
                // Mark as captured so we don't spam
                localStorage.setItem(STORAGE_KEY, '1');
                document.getElementById('dcm-lead-form-wrap').style.display = 'none';
                document.getElementById('dcm-lead-success').style.display   = 'block';
                setTimeout(hideLead, 3500);
            } else {
                const errText = await res.text();
                console.error('[DCM Lead] Error:', errText);
                // Duplicate email → still treat as success for UX
                if (res.status === 409 || errText.includes('duplicate')) {
                    localStorage.setItem(STORAGE_KEY, '1');
                    document.getElementById('dcm-lead-form-wrap').style.display = 'none';
                    document.getElementById('dcm-lead-success').style.display   = 'block';
                    setTimeout(hideLead, 3000);
                } else {
                    throw new Error(errText);
                }
            }
        } catch (err) {
            console.error('[DCM Lead] Submit failed:', err);
            btn.disabled  = false;
            btn.innerHTML = '<i class="fas fa-paper-plane"></i> Recevoir l\'accès';
            alert('Une erreur est survenue. Veuillez réessayer.');
        }
    }

    // ─── PUBLIC API ───────────────────────────────────────────────────────────
    window.DCMLeadCapture = {
        /**
         * Show the lead capture modal.
         * @param {object} opts
         * @param {string} [opts.trigger]  - identifier for analytics ('pdf_export', 'compliance', 'insight_share' …)
         * @param {string} [opts.eyebrow]  - small upper label
         * @param {string} [opts.title]    - main heading
         * @param {string} [opts.subtitle] - description paragraph
         * @param {boolean} [opts.force]   - show even if already captured
         */
        show(opts = {}) {
            // Skip if already captured unless forced
            if (!opts.force && localStorage.getItem(STORAGE_KEY)) return;

            injectStyles();
            createOverlay();

            // Update copy
            currentTrigger = opts.trigger || 'modal';
            if (opts.eyebrow)  document.getElementById('dcm-lead-eyebrow').textContent = opts.eyebrow;
            if (opts.title)    document.getElementById('dcm-lead-title').textContent   = opts.title;
            if (opts.subtitle) document.getElementById('dcm-lead-sub').textContent     = opts.subtitle;

            // Reset state
            const formWrap = document.getElementById('dcm-lead-form-wrap');
            const success  = document.getElementById('dcm-lead-success');
            if (formWrap) formWrap.style.display = '';
            if (success)  success.style.display  = 'none';
            document.getElementById('dcm-lead-form').reset();
            const btn = document.getElementById('lead-submit-btn');
            if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-paper-plane"></i> Recevoir l\'accès'; }

            requestAnimationFrame(() => {
                requestAnimationFrame(() => overlayEl.classList.add('dcm-lead-active'));
            });
        },

        hide: hideLead,

        /**
         * Hook a DOM element to trigger the modal on click.
         * @param {string} selector - CSS selector
         * @param {object} opts     - same as show()
         */
        hook(selector, opts = {}) {
            document.querySelectorAll(selector).forEach(el => {
                el.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.DCMLeadCapture.show(opts);
                });
            });
        }
    };

    // ─── AUTO-HOOKS (on strategic elements) ─────────────────────────────────
    // These run after DOM is ready and hook standard DCM patterns.
    function autoHook() {
        // PDF download buttons
        DCMLeadCapture.hook('[data-lead="pdf"], .pdf-download-btn, a[href$=".pdf"]', {
            trigger: 'pdf_export',
            eyebrow: '📄 RAPPORT PDF',
            title: 'Recevoir le rapport complet',
            subtitle: 'Enregistrez vos coordonnées pour télécharger la version institutionnelle complète.'
        });

        // Compliance checker
        DCMLeadCapture.hook('[data-lead="compliance"], .compliance-checker-btn', {
            trigger: 'compliance_checker',
            eyebrow: '✅ OUTIL DE CONFORMITÉ',
            title: 'Accès à l\'analyse complète',
            subtitle: 'Recevez votre rapport de conformité personnalisé MiCA / DORA par email.'
        });

        // Insight share buttons
        DCMLeadCapture.hook('[data-lead="insight"], .share-insight-btn', {
            trigger: 'insight_share',
            eyebrow: '💡 INSIGHT DCM',
            title: 'Abonnez-vous aux insights institutionnels',
            subtitle: 'Recevez 2–3 insights stratégiques par semaine directement dans votre boîte mail.'
        });

        // Newsletter CTA
        DCMLeadCapture.hook('[data-lead="newsletter"], .newsletter-cta-btn', {
            trigger: 'newsletter',
            eyebrow: '📬 NEWSLETTER INSTITUTIONNELLE',
            title: 'Rejoindre la communauté DCM',
            subtitle: 'Intelligence de marché, nouvelles études et données GTSR chaque semaine.'
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', autoHook);
    } else {
        autoHook();
    }

})();
