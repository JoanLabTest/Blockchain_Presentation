-- ============================================================
-- MIGRATION: Phase 31 — Production Grade
-- Version: 3.0
-- Apply this in Supabase SQL Editor > New query > Run
-- ============================================================

-- 1. Add subscription tier to profiles (Phase 34 Stripe ready)
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS subscription_tier text DEFAULT 'free'
CHECK (subscription_tier IN ('free', 'pro', 'institutional'));

-- 2. Add RLS INSERT policy for quiz_results (users insert their own)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'quiz_results' AND policyname = 'Users can insert own quiz results'
  ) THEN
    CREATE POLICY "Users can insert own quiz results" ON public.quiz_results
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- 3. Add RLS SELECT policy for quiz_results
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'quiz_results' AND policyname = 'Users can view own quiz results'
  ) THEN
    CREATE POLICY "Users can view own quiz results" ON public.quiz_results
      FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;

-- 4. Add RLS policies for simulations
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'simulations' AND policyname = 'Users can insert own simulations'
  ) THEN
    CREATE POLICY "Users can insert own simulations" ON public.simulations
      FOR INSERT WITH CHECK (auth.uid() = user_id);
    CREATE POLICY "Users can view own simulations" ON public.simulations
      FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;

-- 5. Add RLS policies for research_scores
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'research_scores' AND policyname = 'Users can insert own scores'
  ) THEN
    CREATE POLICY "Users can insert own scores" ON public.research_scores
      FOR INSERT WITH CHECK (auth.uid() = user_id);
    CREATE POLICY "Users can view own scores" ON public.research_scores
      FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;

-- 6. UPSERT constraint for activity_logs (avoid duplicate rows per day/page)
ALTER TABLE public.activity_logs
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- Unique constraint for upsert (user + page + day)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'activity_logs_user_page_date_unique'
  ) THEN
    ALTER TABLE public.activity_logs 
    ADD CONSTRAINT activity_logs_user_page_date_unique 
    UNIQUE (user_id, page_url, session_date);
  END IF;
END $$;

-- 7. Function: Auto-create profile on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username, role, jurisdiction, subscription_tier)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    'student',
    'EU',
    'free'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Trigger: Fire on every new auth signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 9. Admin view: Aggregated stats (for future admin.html — Phase 32)
CREATE OR REPLACE VIEW public.admin_stats AS
SELECT
  COUNT(DISTINCT p.id) AS total_users,
  COUNT(DISTINCT CASE WHEN p.subscription_tier != 'free' THEN p.id END) AS premium_users,
  0 AS avg_quiz_score, -- Temporarily disabled due to score_percent column issues
  COUNT(q.id) AS total_quiz_attempts,
  COUNT(DISTINCT s.id) AS total_simulations
FROM public.profiles p
LEFT JOIN public.quiz_results q ON q.user_id = p.id
LEFT JOIN public.simulations s ON s.user_id = p.id;

-- ✅ Migration complete. Apply in Supabase SQL Editor.
