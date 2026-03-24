/**
 * DCM Core Citation Tool
 * Logic for copying standardized market citations to clipboard.
 */

function copyCitation(insightId, title, author = "DCM Core Institute") {
    const year = new Date().getFullYear();
    const citation = `${author} Market Insight #${insightId} | "${title}" (${year}). Source: GTSR (Level 3 Verified Data). https://dcmcore.com/`;
    
    navigator.clipboard.writeText(citation).then(() => {
        const toast = document.createElement('div');
        toast.style.position = 'fixed';
        toast.style.bottom = '30px';
        toast.style.right = '30px';
        toast.style.background = '#10b981';
        toast.style.color = '#fff';
        toast.style.padding = '12px 24px';
        toast.style.borderRadius = '12px';
        toast.style.zIndex = '10000';
        toast.style.fontFamily = 'Inter, sans-serif';
        toast.style.fontSize = '14px';
        toast.style.fontWeight = '700';
        toast.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
        toast.innerHTML = '<i class="fas fa-check-circle"></i> Citation copied to clipboard';
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.5s ease';
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }).catch(err => {
        console.error('Could not copy citation: ', err);
    });
}
