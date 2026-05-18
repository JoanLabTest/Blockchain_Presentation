const DCM_REPORT_ACCESS = (() => {
    const SUPABASE_URL  = 'https://wnwerjuqtrduqkgwdjrg.supabase.co';
    const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indud2VyanVxdHJkdXFrZ3dkanJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3Mzg3OTEsImV4cCI6MjA4NjMxNDc5MX0.0WqMQs84PFAHuoMQT8xiAZYpWN5b2XGeumtaNzRHcoo';
    const FULL_ACCESS  = new Set(['professional','enterprise','institutional']);
    const EXPORT_TIERS = new Set(['enterprise','institutional']);
    function _cachedTier() {
        try { const p=JSON.parse(localStorage.getItem('dcm_user_profile')||'{}'); return p.subscription_tier||null; } catch(_){return null;}
    }
    async function checkAccess() {
        let tier='guest', user=null;
        try {
            let sb=null;
            if(window.supabase&&typeof window.supabase.auth==='object') sb=window.supabase;
            else if(window.supabase&&window.supabase.createClient) sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON);
            if(sb){ const {data}=await sb.auth.getUser(); if(data&&data.user){ user=data.user; tier=(data.user.user_metadata||{}).subscription_tier||_cachedTier()||'free'; } else { tier=_cachedTier()||'guest'; } }
            else { tier=_cachedTier()||'guest'; }
        } catch(e){ tier=_cachedTier()||'guest'; }
        return { tier, granted:FULL_ACCESS.has(tier), canExport:EXPORT_TIERS.has(tier), user };
    }
    return { checkAccess };
})();
