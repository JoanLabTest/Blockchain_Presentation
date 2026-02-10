#!/usr/bin/env node

// Script to initialize Supabase database schema
// Requires: node-fetch (or native fetch in Node 18+)

const SUPABASE_URL = "https://wnwerjuqtrduqkgwdjrg.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indud2VyanVxdHJkdXFrZ3dkanJnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDczODc5MSwiZXhwIjoyMDg2MzE0NzkxfQ.4EAxRUw_wJHbqjav9-HvG6QWE7n0_WUKEAVRa_H-q5E";

const SQL_SCHEMA = `
-- Supabase Schema for Blockchain Academy (DCM Digital)

-- 1. USERS (Extends default auth.users if needed, or standalone profile)
create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  username text,
  role text default 'student',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. QUIZ RESULTS (Log every attempt)
create table if not exists public.quiz_results (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id),
  session_id text,
  level text not null,
  score integer not null,
  total_questions integer not null,
  passed boolean default false,
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. USER PROGRESS (Current unlocks)
create table if not exists public.user_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id),
  session_id text,
  level_1_fundamental boolean default false,
  level_2_intermediate boolean default false,
  level_3_expert boolean default false,
  level_4_head_of boolean default false,
  badges jsonb default '{"explorer": false, "listener": false, "strategist": false}',
  certification_date timestamp with time zone,
  rank text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. RLS POLICIES (Security)
alter table public.profiles enable row level security;
alter table public.quiz_results enable row level security;
alter table public.user_progress enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can view own results" on public.quiz_results;
drop policy if exists "Users can insert own results" on public.quiz_results;
drop policy if exists "Users can view own progress" on public.user_progress;
drop policy if exists "Users can update own progress" on public.user_progress;

-- Create policies
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can view own results" on public.quiz_results for select using (auth.uid() = user_id);
create policy "Users can insert own results" on public.quiz_results for insert with check (auth.uid() = user_id);
create policy "Users can view own progress" on public.user_progress for select using (auth.uid() = user_id);
create policy "Users can update own progress" on public.user_progress for update using (auth.uid() = user_id);

-- 5. INDEXES (Performance)
create index if not exists idx_quiz_results_user on public.quiz_results(user_id);
create index if not exists idx_user_progress_user on public.user_progress(user_id);
`;

async function executeSQL() {
    try {
        console.log("🔄 Connecting to Supabase...");

        const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_SERVICE_KEY,
                'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: SQL_SCHEMA })
        });

        if (!response.ok) {
            // Try alternative: direct SQL execution via PostgREST
            console.log("⚠️  RPC method not available, trying direct execution...");

            // Split SQL into individual statements
            const statements = SQL_SCHEMA.split(';').filter(s => s.trim());

            for (const stmt of statements) {
                if (!stmt.trim()) continue;
                console.log(`Executing: ${stmt.substring(0, 50)}...`);
                // Note: This would require a different approach
            }

            throw new Error(`HTTP ${response.status}: ${await response.text()}`);
        }

        const data = await response.json();
        console.log("✅ Schema created successfully!");
        console.log(data);

    } catch (error) {
        console.error("❌ Error:", error.message);
        console.log("\n📋 Manual Setup Required:");
        console.log("1. Go to Supabase Dashboard → SQL Editor");
        console.log("2. Copy the content of 'supabase_schema.sql'");
        console.log("3. Paste and execute");
    }
}

executeSQL();
