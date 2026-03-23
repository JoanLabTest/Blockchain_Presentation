-- =========================================================
-- DCM CORE INSTITUTE — PHASE 27: LEAD CAPTURE TABLE
-- Run this in your Supabase SQL editor
-- =========================================================

-- Enable UUID extension (idempotent)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- LEADS TABLE (Institutional contact capture)
CREATE TABLE IF NOT EXISTS public.leads (
    id          uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name        text NOT NULL,
    email       text NOT NULL,
    institution text,                       -- optional org name
    persona     text,                       -- 'analyst' | 'bank' | 'investor' | 'unknown'
    source_page text,                       -- URL path where lead was captured
    trigger     text,                       -- 'pdf_export' | 'insight_share' | 'compliance' | 'newsletter' | 'modal'
    gdpr_consent boolean DEFAULT false,    -- explicit consent flag
    created_at  timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT leads_email_valid CHECK (email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$')
);

-- INDEX for fast admin queries
CREATE INDEX IF NOT EXISTS idx_leads_email       ON public.leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_persona     ON public.leads(persona);
CREATE INDEX IF NOT EXISTS idx_leads_created_at  ON public.leads(created_at DESC);

-- ROW LEVEL SECURITY
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Anyone (anon) can INSERT a lead (public capture form)
DROP POLICY IF EXISTS "Anyone can submit a lead" ON public.leads;
CREATE POLICY "Anyone can submit a lead" ON public.leads
    FOR INSERT WITH CHECK (true);

-- Only admins can SELECT leads (protect PII)
DROP POLICY IF EXISTS "Admins can view all leads" ON public.leads;
CREATE POLICY "Admins can view all leads" ON public.leads
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- =========================================================
-- VERIFICATION QUERY (run after applying)
-- SELECT * FROM public.leads ORDER BY created_at DESC LIMIT 5;
-- =========================================================
