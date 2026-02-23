-- =========================================================
-- DCM DIGITAL — PHASE 79: INSTITUTIONAL BACKEND SCHEMA
-- =========================================================

-- 1. ORGANIZATIONS (Multi-tenancy support)
CREATE TABLE IF NOT EXISTS public.organizations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  tier text DEFAULT 'free',
  settings jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. ENHANCED PROFILES
-- Ensure org_id and subscription_tier are present
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS org_id uuid REFERENCES public.organizations(id);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_tier text DEFAULT 'free';

-- 3. SIMULATIONS (Persistent server-side records)
CREATE TABLE IF NOT EXISTS public.simulations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  org_id uuid REFERENCES public.organizations(id),
  scenario_name text,
  input_data jsonb NOT NULL,
  results jsonb NOT NULL,
  score_delta numeric,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. SECURE AUDIT TRAIL (With Hashing for Integrity)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  org_id uuid REFERENCES public.organizations(id),
  action text NOT NULL,
  metadata jsonb DEFAULT '{}',
  severity text DEFAULT 'INFO',
  timestamp timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  prev_hash text, -- For chaining hashes if needed
  node_hash text  -- Integrity check of the current entry
);

-- 5. BENCHMARKS (Reference data for comparisons)
CREATE TABLE IF NOT EXISTS public.benchmarks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  category text NOT NULL,
  industry text,
  metrics jsonb NOT NULL,
  source text,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. EXPORTS TRACKING
CREATE TABLE IF NOT EXISTS public.exports (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  org_id uuid REFERENCES public.organizations(id),
  type text NOT NULL, -- 'PDF', 'CSV', 'JSON'
  status text NOT NULL, -- 'COMPLETED', 'FAILED'
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =========================================================
-- SECURITY: ROW LEVEL SECURITY (RLS)
-- =========================================================

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.benchmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exports ENABLE ROW LEVEL SECURITY;

-- Profiles: Users see their own profile, Admins see their Org members
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view org members" ON public.profiles FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() AND p.role = 'Admin' AND p.org_id = profiles.org_id
  )
);

-- Simulations: Isolated by User or Org
CREATE POLICY "Users can manage own simulations" ON public.simulations 
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Org members can view org simulations" ON public.simulations 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.org_id = simulations.org_id
    )
  );

-- Audit Logs: Restricted (Enterprise standard)
CREATE POLICY "Users can view own audit logs" ON public.audit_logs 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Org Admins can view org audit logs" ON public.audit_logs 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'Admin' AND p.org_id = audit_logs.org_id
    )
  );

-- Benchmarks: Public View
CREATE POLICY "Benchmarks are publicly readable" ON public.benchmarks FOR SELECT USING (true);

-- Exports: Isolated
CREATE POLICY "Users can view own exports" ON public.exports FOR SELECT USING (auth.uid() = user_id);

-- =========================================================
-- INDEXES
-- =========================================================
CREATE INDEX IF NOT EXISTS idx_sim_org ON public.simulations(org_id);
CREATE INDEX IF NOT EXISTS idx_audit_org ON public.audit_logs(org_id);
CREATE INDEX IF NOT EXISTS idx_audit_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_profile_org ON public.profiles(org_id);
