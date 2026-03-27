-- DCM Institutional API Keys (Phase 113)
-- Table to manage scoped API access for €499/mo subscribers

CREATE TABLE IF NOT EXISTS public.api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    key_prefix TEXT NOT NULL, -- e.g., 'dcm_pk_'
    hashed_key TEXT NOT NULL UNIQUE,
    display_name TEXT DEFAULT 'Institutional Key',
    scope TEXT[] DEFAULT '{"read:registry", "read:stablecoins"}',
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'revoked', 'suspended')),
    last_used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Indexing for fast key lookup
CREATE INDEX idx_api_keys_hashed ON public.api_keys(hashed_key);

-- RLS: Only the user can see their own keys (though hashed_key should be hidden)
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own API key metadata" 
    ON public.api_keys FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "System can manage API keys" 
    ON public.api_keys FOR ALL 
    USING (auth.jwt()->>'role' = 'service_role');

-- Note: hashed_key is sensitive and should never be returned to the client 
-- after the initial generation event.
