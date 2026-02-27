-- ============================================================
-- FIX: User Deletion Cascade (Phase 135)
-- Resolves "Database error deleting user" by adding 
-- ON DELETE CASCADE to all profile-related foreign keys.
-- ============================================================

-- 1. Function to safely drop and recreate foreign keys with CASCADE
-- This handles auto-generated constraint names.
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT constraint_name 
        FROM information_schema.key_column_usage 
        WHERE table_name = 'profiles' AND table_schema = 'public' 
        AND column_name = 'id' 
    ) LOOP
        -- Need to check if it's a foreign key specially
        IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = r.constraint_name AND constraint_type = 'FOREIGN KEY') THEN
            EXECUTE 'ALTER TABLE public.profiles DROP CONSTRAINT ' || r.constraint_name;
        END IF;
    END LOOP;
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

    -- Fix public.activity_logs -> public.profiles
    FOR r IN (SELECT constraint_name FROM information_schema.key_column_usage WHERE table_name = 'activity_logs' AND table_schema = 'public' AND column_name = 'user_id') LOOP
        EXECUTE 'ALTER TABLE public.activity_logs DROP CONSTRAINT ' || r.constraint_name;
    END LOOP;
    ALTER TABLE public.activity_logs ADD CONSTRAINT activity_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

    -- Fix public.quiz_results -> public.profiles
    FOR r IN (SELECT constraint_name FROM information_schema.key_column_usage WHERE table_name = 'quiz_results' AND table_schema = 'public' AND column_name = 'user_id') LOOP
        EXECUTE 'ALTER TABLE public.quiz_results DROP CONSTRAINT ' || r.constraint_name;
    END LOOP;
    ALTER TABLE public.quiz_results ADD CONSTRAINT quiz_results_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

    -- Fix public.simulations -> public.profiles
    FOR r IN (SELECT constraint_name FROM information_schema.key_column_usage WHERE table_name = 'simulations' AND table_schema = 'public' AND column_name = 'user_id') LOOP
        EXECUTE 'ALTER TABLE public.simulations DROP CONSTRAINT ' || r.constraint_name;
    END LOOP;
    ALTER TABLE public.simulations ADD CONSTRAINT simulations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

    -- Fix public.research_scores -> public.profiles
    FOR r IN (SELECT constraint_name FROM information_schema.key_column_usage WHERE table_name = 'research_scores' AND table_schema = 'public' AND column_name = 'user_id') LOOP
        EXECUTE 'ALTER TABLE public.research_scores DROP CONSTRAINT ' || r.constraint_name;
    END LOOP;
    ALTER TABLE public.research_scores ADD CONSTRAINT research_scores_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

    -- Fix public.audit_logs -> public.profiles
    FOR r IN (SELECT constraint_name FROM information_schema.key_column_usage WHERE table_name = 'audit_logs' AND table_schema = 'public' AND column_name = 'user_id') LOOP
        EXECUTE 'ALTER TABLE public.audit_logs DROP CONSTRAINT ' || r.constraint_name;
    END LOOP;
    ALTER TABLE public.audit_logs ADD CONSTRAINT audit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

    -- Fix public.gdpr_requests -> public.profiles
    FOR r IN (SELECT constraint_name FROM information_schema.key_column_usage WHERE table_name = 'gdpr_requests' AND table_schema = 'public' AND column_name = 'user_id') LOOP
        EXECUTE 'ALTER TABLE public.gdpr_requests DROP CONSTRAINT ' || r.constraint_name;
    END LOOP;
    ALTER TABLE public.gdpr_requests ADD CONSTRAINT gdpr_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

END $$;

-- ✅ Script complete. Apply in Supabase SQL Editor.
