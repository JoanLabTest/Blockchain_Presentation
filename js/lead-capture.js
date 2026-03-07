/**
 * Lead Capture Logic for Supabase
 * Handles form submission and data storage
 */
document.addEventListener('DOMContentLoaded', () => {
    const leadForm = document.getElementById('lead-form');
    const leadMsg = document.getElementById('lead-msg');

    if (!leadForm) return;

    leadForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Check if config is set
        if (!window.SUPABASE_CONFIG || window.SUPABASE_CONFIG.url.includes('YOUR_SUPABASE_URL')) {
            console.error('Supabase not configured. Please update js/supabase-config.js');
            alert('Service temporairement indisponible (Config error).');
            return;
        }

        const name = document.getElementById('lead-name').value;
        const email = document.getElementById('lead-email').value;
        const submitBtn = leadForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerText;

        // UI Loading state
        submitBtn.disabled = true;
        submitBtn.innerText = 'Envoi en cours...';
        submitBtn.style.opacity = '0.7';

        try {
            const response = await fetch(`${window.SUPABASE_CONFIG.url}/rest/v1/leads`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': window.SUPABASE_CONFIG.anonKey,
                    'Authorization': `Bearer ${window.SUPABASE_CONFIG.anonKey}`,
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    source_page: window.location.pathname,
                    user_persona: localStorage.getItem('dcm_active_role') || 'unknown'
                })
            });

            if (response.ok) {
                // Success
                leadForm.style.display = 'none';
                leadMsg.style.display = 'block';

                // Clear inputs
                leadForm.reset();
            } else {
                throw new Error('Supabase response not OK');
            }
        } catch (error) {
            console.error('Lead capture error:', error);
            alert('Une erreur est survenue. Veuillez réessayer plus tard.');

            // Re-enable button
            submitBtn.disabled = false;
            submitBtn.innerText = originalBtnText;
            submitBtn.style.opacity = '1';
        }
    });
});
