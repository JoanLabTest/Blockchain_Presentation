-- =========================================================
-- DCM CORE INSTITUTE — PHASE 27: LEAD CAPTURE TABLE
-- Run this in your Supabase SQL editor
-- =========================================================

-- Enable UUID extension (idempotent)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── STEP 1: Create table (fresh install) ────────────────
-- NOTE: 'trigger' is a reserved keyword → using trigger_source
CREATE TABLE IF NOT EXISTS public.leads (
    id           uuid    DEFAULT uuid_generate_v4() PRIMARY KEY,
    name         text    NOT NULL,
    email        text    NOT NULL,
    created_at   timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ─── STEP 2: Add columns idempotently (handles existing tables) ──
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS institution    text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS persona        text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS source_page    text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS trigger_source text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS gdpr_consent   boolean DEFAULT false;

-- ─── STEP 3: Email format constraint (idempotent) ─────────
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'leads_email_valid' AND conrelid = 'public.leads'::regclass
    ) THEN
        ALTER TABLE public.leads
            ADD CONSTRAINT leads_email_valid
            CHECK (email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$');
    END IF;
END $$;

-- ─── STEP 4: Indexes ────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_leads_email        ON public.leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_persona      ON public.leads(persona);
CREATE INDEX IF NOT EXISTS idx_leads_created_at   ON public.leads(created_at DESC);

-- ─── STEP 5: Row Level Security ─────────────────────────────
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Anyone (anon) can INSERT a lead
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
