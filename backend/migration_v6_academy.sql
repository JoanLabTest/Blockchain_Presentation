-- =============================================
-- Phase 85: Institutional Academy Persistence
-- Adds progress tracking for quizzes and simulations
-- =============================================

-- 1. Add unlocked_levels and certifications to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS unlocked_levels INT[] DEFAULT '{1}',
ADD COLUMN IF NOT EXISTS certifications JSONB DEFAULT '[]';

-- 2. Ensure RLS allows users to update their own progress
-- (Profiles already has a policy for "Users can update own profile")

-- 3. Optimization: Index for simulations by type
CREATE INDEX IF NOT EXISTS idx_simulations_type ON public.simulations(simulation_type);

-- 4. Audit Log for Academy Milestones
-- (Standard audit_logs table exists, will be used by JS)

COMMENT ON COLUMN public.profiles.unlocked_levels IS 'Array of level IDs unlocked by the user in the Academy.';
COMMENT ON COLUMN public.profiles.certifications IS 'JSON array of issued certificates with metadata (type, date, hash).';
