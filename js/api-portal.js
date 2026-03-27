/* 
   DCM CORE INSTITUTIONAL API PORTAL LOGIC (Phase 110)
   Monetization & Lead Capture
*/

document.addEventListener('DOMContentLoaded', () => {
    console.log("DCM API Portal: Institutional Intelligence Ready.");
});

function handleSubscriptionClick(event) {
    event.preventDefault();
    const userJson = localStorage.getItem('dcm_user_profile');
    
    if (!userJson) {
        alert("Institutional identification required. Please login first.");
        window.location.href = "../login.html";
        return;
    }

    const user = JSON.parse(userJson);
    const stripeBaseUrl = "https://buy.stripe.com/7sI7vi9J03q9f3idQQ"; // Example Pro Link
    
    // ⚡ SAAS AUTOMATION: Inject client_reference_id for webhook linking
    // This allows the webhook to map the payment to the Supabase ID
    const checkoutUrl = `${stripeBaseUrl}?client_reference_id=${user.id}`;
    
    console.log("🚀 Redirecting to Institutional Checkout:", checkoutUrl);
    window.location.href = checkoutUrl;
}

function copyExample() {
    const jsonText = document.getElementById('json-preview').innerText;
    navigator.clipboard.writeText(jsonText).then(() => {
        const btn = event.currentTarget;
        const orgText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> COPIED TO CLIPBOARD';
        btn.style.color = '#10b981';
        setTimeout(() => {
            btn.innerHTML = orgText;
            btn.style.color = 'white';
        }, 2000);
    });
}

function openContactSales() {
    const email = prompt("Enter your institutional email for custom API access:");
    if (!email || !email.includes('@')) return;

    // ⚡ SUPABASE LEAD CAPTURE (Phase 110)
    if (window.supabase) {
        window.supabase.from('institutional_leads').upsert({
            email: email,
            report_context: 'Enterprise API Request',
            language: 'EN',
            metadata: { 
                source: 'API Portal',
                tier: 'Enterprise',
                timestamp: new Date().toISOString()
            }
        }, { onConflict: 'email' }).then(({ data, error }) => {
            if (error) {
                console.error("Supabase Error:", error);
                alert("Request failed. Please contact dcmcoreinstitute@gmail.com directly.");
            } else {
                alert("Institutional Access Requested. Our team will contact you within 12 hours.");
            }
        });
    } else {
        // Fallback email trigger
        window.location.href = `mailto:dcmcoreinstitute@gmail.com?subject=Enterprise API Access Request&body=Institutional Email: ${email}`;
    }
}

// Global Registration
window.handleSubscriptionClick = handleSubscriptionClick;
window.copyExample = copyExample;
window.openContactSales = openContactSales;
