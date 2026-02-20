-- Backfill script to populate missing profiles from auth.users

INSERT INTO public.profiles (id, email, full_name, role, jurisdiction, subscription_tier)
SELECT 
    id, 
    email, 
    COALESCE(raw_user_meta_data->>'full_name', split_part(email, '@', 1)),
    'student', 
    'EU', 
    'free'
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;
