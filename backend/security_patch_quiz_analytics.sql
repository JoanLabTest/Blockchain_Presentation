-- ============================================================
-- SECURITY PATCH: DCM DIGITAL backend hardening
-- Target: public.get_quiz_analytics
-- Issue: SECURITY DEFINER with missing search_path
-- ============================================================

-- Apply this in the Supabase SQL Editor

ALTER FUNCTION public.get_quiz_analytics SET search_path = '';

-- Note: If get_quiz_analytics is a VIEW with SECURITY DEFINER (rare but possible), 
-- you would drop and recreate it with:
-- CREATE OR REPLACE VIEW public.get_quiz_analytics WITH (security_invoker = true) AS ...
