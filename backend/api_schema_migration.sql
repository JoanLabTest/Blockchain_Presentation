-- =========================================================
-- DCM DIGITAL — PHASE 111: REVENUE & API INFRASTRUCTURE
-- =========================================================

-- 1. SUBSCRIPTIONS (Stripe Sync)
-- Links Supabase users to their Stripe billing entity.
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) NOT NULL UNIQUE,
  stripe_customer_id text UNIQUE,
  stripe_subscription_id text UNIQUE,
  plan_tier text DEFAULT 'free', -- 'free', 'pro', 'enterprise'
  status text DEFAULT 'inactive', -- 'active', 'trailing', 'past_due', 'canceled'
  current_period_end timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. API KEYS (Hashed Storage)
-- Only 'prefix' and 'key_hash' are stored. The full key is never stored.
CREATE TABLE IF NOT EXISTS public.api_keys (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  org_id uuid REFERENCES public.organizations(id),
  name text NOT NULL, -- e.g. "Main Production Key"
  prefix text NOT NULL, -- e.g. "dcm_live_"
  key_hash text NOT NULL UNIQUE, -- SHA-256 of the unhashed key
  last_used timestamp with time zone,
  revoked boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =========================================================
-- SECURITY: ROW LEVEL SECURITY (RLS)
-- =========================================================

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- Subscriptions: Users view their own
CREATE POLICY "Subscriptions: view own" ON public.subscriptions 
  FOR SELECT USING (auth.uid() = user_id);

-- API Keys: Users manage their own
CREATE POLICY "API Keys: manager personal" ON public.api_keys 
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "API Keys: org view" ON public.api_keys 
  FOR SELECT USING (
    org_id IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.org_id = api_keys.org_id
    )
  );

-- =========================================================
-- INDEXES
-- =========================================================
CREATE INDEX IF NOT EXISTS idx_subscription_user ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_api_key_user ON public.api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_key_hash ON public.api_keys(key_hash);

-- TRIGGER: Update timestamp on subscription change
CREATE OR REPLACE FUNCTION update_subscription_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_update_subscription_timestamp
BEFORE UPDATE ON public.subscriptions
FOR EACH ROW EXECUTE FUNCTION update_subscription_timestamp();
