-- SUPABASE SCHEMA: DCM DIGITAL INTELLIGENCE DASHBOARD
-- Version: 2.1 (Idempotent)
-- Author: Joan Lyczak (Risk Manager)

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. USERS TABLE (Extends Supabase Auth)
create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  role text check (role in ('student', 'professional', 'admin')),
  jurisdiction text default 'EU',
  kyc_status text default 'pending', -- pending, verified, rejected
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. USER ACTIVITY LOGS (Tracking research behavior)
create table if not exists public.activity_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  page_url text not null,
  time_spent_seconds integer default 0,
  scroll_depth_percent integer default 0,
  session_date date default current_date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. QUIZ RESULTS (Progress Tracking)
create table if not exists public.quiz_results (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  quiz_type text not null, -- 'beginner', 'intermediate', 'expert'
  score_percent integer not null,
  time_taken_seconds integer,
  passed boolean default false,
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. SIMULATION HISTORY (Financial Scenarios)
-- Stores the parameters and results of user simulations (Yield, Risk, etc.)
create table if not exists public.simulations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  scenario_name text not null,
  simulation_type text not null, -- 'staking', 'lending', 'liquidity_mining'
  parameters jsonb not null, -- Stores input sliders (amount, duration, leverage)
  results jsonb not null, -- Stores calculated output (apy, risk_score, max_drawdown)
  is_favorite boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. RESEARCH MATURITY SNAPSHOTS (Evolution Chart Data)
-- Daily or Weekly snapshots of the user's composite score
create table if not exists public.research_scores (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  total_score integer not null,
  sub_score_legal integer,
  sub_score_tech integer,
  sub_score_risk integer,
  sub_score_engagement integer,
  snapshot_date date default current_date
);

-- ROW LEVEL SECURITY (RLS) POLICIES
-- Ensure users can only see their own data

alter table public.profiles enable row level security;
alter table public.activity_logs enable row level security;
alter table public.quiz_results enable row level security;
alter table public.simulations enable row level security;
alter table public.research_scores enable row level security;

-- Policy: Users can view their own profile
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

-- Policy: Users can update their own profile
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Policy: Users can view their own activity
drop policy if exists "Users can view own activity" on public.activity_logs;
create policy "Users can view own activity" on public.activity_logs
  for select using (auth.uid() = user_id);

-- Policy: Users can insert their own activity
drop policy if exists "Users can insert own activity" on public.activity_logs;
create policy "Users can insert own activity" on public.activity_logs
  for insert with check (auth.uid() = user_id);

-- (Repeat RLS patterns for other tables...)

-- 6. SYSTEM AUDIT LOGS (Security & Compliance)
-- Immutable log of all critical system actions
create table if not exists public.audit_logs (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles(id),
    action text not null, -- 'LOGIN', 'EXPORT_DATA', 'SIMULATION_RUN'
    details jsonb,
    ip_address text,
    user_agent text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. GDPR REQUESTS (Data Rights)
-- Tracks user requests for data export or deletion
create table if not exists public.gdpr_requests (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles(id) not null,
    request_type text check (request_type in ('export', 'delete')),
    status text default 'pending', -- 'pending', 'processing', 'completed'
    requested_at timestamp with time zone default timezone('utc'::text, now()) not null,
    completed_at timestamp with time zone
);

-- RLS for Audit & GDPR
alter table public.audit_logs enable row level security;
alter table public.gdpr_requests enable row level security;

-- Users can view their own audit logs
drop policy if exists "Users can view own audit logs" on public.audit_logs;
create policy "Users can view own audit logs" on public.audit_logs
  for select using (auth.uid() = user_id);

-- Users can insert GDPR requests
drop policy if exists "Users can insert GDPR requests" on public.gdpr_requests;
create policy "Users can insert GDPR requests" on public.gdpr_requests
  for insert with check (auth.uid() = user_id);

-- Only Admins can view/process GDPR requests
drop policy if exists "Admins can view all GDPR requests" on public.gdpr_requests;
create policy "Admins can view all GDPR requests" on public.gdpr_requests
  for select using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );
