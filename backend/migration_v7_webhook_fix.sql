-- ============================================================
-- Phase 119: Stripe Webhook Schema Verification & Fixes
-- Adds subscription_status to profiles table if missing
-- ============================================================

-- 1. Add subscription_status to public.profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS subscription_status text DEFAULT 'active';

-- 2. Comment on column for clarity
COMMENT ON COLUMN public.profiles.subscription_status IS 'Tracks Stripe subscription status (active, trailing, past_due, cancelled, etc.)';
