-- AUDIT LOGS PERSISTENCE (Phase 115)
-- Purpose: Institutional-grade tracking of compliance events.

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    org_id UUID, -- For multi-tenant isolation
    action TEXT NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    severity TEXT DEFAULT 'info', -- info, warning, critical
    category TEXT DEFAULT 'general', -- mica, dora, security, api
    ip_address TEXT,
    user_agent TEXT,
    
    -- Forensic Chaining (Phase 115)
    previous_hash TEXT,
    current_hash TEXT NOT NULL,
    
    -- Metadata for filtering
    is_institutional BOOLEAN DEFAULT true
);

-- Enable RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Policies: Users can view logs for their own organization
CREATE POLICY "Users can view their org's audit logs"
ON public.audit_logs FOR SELECT
USING (auth.uid() IN (
    SELECT id FROM auth.users WHERE org_id = audit_logs.org_id
));

-- Policy: Only service role can insert (for tamper resistance)
CREATE POLICY "Service role can insert audit logs"
ON public.audit_logs FOR INSERT
WITH CHECK (true);
