-- ============================================================
-- Phase 139: Access Codes Redemption Track
-- Adds used_at column to public.access_codes table
-- ============================================================

-- 1. Add used_at column to public.access_codes table if missing
ALTER TABLE public.access_codes
ADD COLUMN IF NOT EXISTS used_at timestamptz;

-- 2. Comment on column for clarity
COMMENT ON COLUMN public.access_codes.used_at IS 'Timestamp when the access code was verified/redeemed by a user';

-- 3. Enable RLS on public.access_codes
ALTER TABLE public.access_codes ENABLE ROW LEVEL SECURITY;

-- 4. Drop existing policies if any to avoid collision
DROP POLICY IF EXISTS "Allow anon select access_codes" ON public.access_codes;
DROP POLICY IF EXISTS "Allow anon update used_at" ON public.access_codes;

-- 5. Create SELECT policy for anon role
CREATE POLICY "Allow anon select access_codes" ON public.access_codes
  FOR SELECT
  TO anon
  USING (true);

-- 6. Create UPDATE policy for anon role
CREATE POLICY "Allow anon update used_at" ON public.access_codes
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- 7. Restrict UPDATE permission for anon role to ONLY the used_at column
REVOKE UPDATE ON public.access_codes FROM anon;
GRANT UPDATE(used_at) ON public.access_codes TO anon;

