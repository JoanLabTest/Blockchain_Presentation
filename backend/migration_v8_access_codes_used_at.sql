-- ============================================================
-- Phase 139: Access Codes Redemption Track
-- Adds used_at column to public.access_codes table
-- ============================================================

-- 1. Add used_at column to public.access_codes table if missing
ALTER TABLE public.access_codes
ADD COLUMN IF NOT EXISTS used_at timestamptz;

-- 2. Comment on column for clarity
COMMENT ON COLUMN public.access_codes.used_at IS 'Timestamp when the access code was verified/redeemed by a user';
