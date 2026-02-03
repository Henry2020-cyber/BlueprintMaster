-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =============================================
-- 1. PROFILES (Users)
-- =============================================
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  avatar_url text,
  role text default 'user' check (role in ('user', 'admin')),
  xp integer default 0,
  level integer default 1,
  streak integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =============================================
-- 2. ASSETS (The "Store" Products)
-- =============================================
create table if not exists public.assets (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  price numeric(10, 2) default 0.00,
  thumbnail_url text,
  blueprint_image_url text,
  drive_link text,
  features jsonb,
  category text,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =============================================
-- 3. USER ASSETS (Library/Purchases)
-- =============================================
create table if not exists public.user_assets (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  asset_id uuid references public.assets(id) on delete cascade not null,
  purchased_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, asset_id)
);

-- =============================================
-- 4. TRANSACTIONS (Financial History)
-- =============================================
create table if not exists public.transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete set null,
  amount numeric(10, 2) not null,
  status text default 'pending',
  asset_id uuid references public.assets(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =============================================
-- 5. KANBAN TASKS (Productivity)
-- =============================================
create table if not exists public.kanban_tasks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  priority text default 'medium' check (priority in ('low', 'medium', 'high')),
  column_id text default 'todo' check (column_id in ('todo', 'progress', 'done')),
  module_tag text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =============================================
-- 6. POMODORO SESSIONS (Productivity)
-- =============================================
create table if not exists public.pomodoro_sessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  duration integer not null,
  type text default 'focus' check (type in ('focus', 'break')),
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =============================================
-- 7. STUDY MODULES & PROGRESS (LMS)
-- =============================================
create table if not exists public.study_modules (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  order_index integer default 0,
  total_lessons integer default 0,
  duration text
);

create table if not exists public.study_lessons (
  id uuid default uuid_generate_v4() primary key,
  module_id uuid references public.study_modules(id) on delete cascade not null,
  title text not null,
  video_url text,
  order_index integer default 0,
  duration_seconds integer
);

create table if not exists public.user_lesson_progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  lesson_id uuid references public.study_lessons(id) on delete cascade not null,
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, lesson_id)
);

-- =============================================
-- 8. ACHIEVEMENTS
-- =============================================
create table if not exists public.achievements (
  id text primary key,
  title text not null,
  description text,
  icon text
);

create table if not exists public.user_achievements (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  achievement_id text references public.achievements(id) on delete cascade not null,
  unlocked_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, achievement_id)
);

-- =============================================
-- SECURITY (RLS) & HELPER FUNCTIONS
-- =============================================

-- Helper Function: Check if user is admin
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- Enable RLS (safe to run multiple times)
alter table public.profiles enable row level security;
alter table public.assets enable row level security;
alter table public.user_assets enable row level security;
alter table public.transactions enable row level security;
alter table public.kanban_tasks enable row level security;
alter table public.pomodoro_sessions enable row level security;
alter table public.study_modules enable row level security;
alter table public.study_lessons enable row level security;
alter table public.user_lesson_progress enable row level security;
alter table public.user_achievements enable row level security;

-- PROFILES POLICIES
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);

drop policy if exists "Admins can view all profiles" on public.profiles;
create policy "Admins can view all profiles" on public.profiles for select using (public.is_admin());

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- ASSETS POLICIES
drop policy if exists "Assets are viewable by everyone" on public.assets;
create policy "Assets are viewable by everyone" on public.assets for select using (true);

drop policy if exists "Admins can manage assets" on public.assets;
create policy "Admins can manage assets" on public.assets for all using (public.is_admin());

-- USER ASSETS POLICIES
drop policy if exists "Users view own assets" on public.user_assets;
create policy "Users view own assets" on public.user_assets for select using (auth.uid() = user_id);

drop policy if exists "Admins view all user assets" on public.user_assets;
create policy "Admins view all user assets" on public.user_assets for select using (public.is_admin());

drop policy if exists "Admins/System grant assets" on public.user_assets;
create policy "Admins/System grant assets" on public.user_assets for insert with check (public.is_admin() or auth.uid() = user_id);

-- TRANSACTIONS POLICIES
drop policy if exists "Users view own transactions" on public.transactions;
create policy "Users view own transactions" on public.transactions for select using (auth.uid() = user_id);

drop policy if exists "Admins view all transactions" on public.transactions;
create policy "Admins view all transactions" on public.transactions for select using (public.is_admin());

-- KANBAN & POMODORO POLICIES
drop policy if exists "Users manage own kanban" on public.kanban_tasks;
create policy "Users manage own kanban" on public.kanban_tasks for all using (auth.uid() = user_id);

drop policy if exists "Users manage own pomodoro" on public.pomodoro_sessions;
create policy "Users manage own pomodoro" on public.pomodoro_sessions for all using (auth.uid() = user_id);

-- STUDY CONTENT POLICIES
drop policy if exists "Modules are viewable by everyone" on public.study_modules;
create policy "Modules are viewable by everyone" on public.study_modules for select using (true);

drop policy if exists "Lessons are viewable by everyone" on public.study_lessons;
create policy "Lessons are viewable by everyone" on public.study_lessons for select using (true);

drop policy if exists "Admins manage study content" on public.study_modules;
create policy "Admins manage study content" on public.study_modules for all using (public.is_admin());

drop policy if exists "Admins manage lessons" on public.study_lessons;
create policy "Admins manage lessons" on public.study_lessons for all using (public.is_admin());

-- USER PROGRESS POLICIES
drop policy if exists "Users manage own progress" on public.user_lesson_progress;
create policy "Users manage own progress" on public.user_lesson_progress for all using (auth.uid() = user_id);

drop policy if exists "Users manage own achievements" on public.user_achievements;
create policy "Users manage own achievements" on public.user_achievements for all using (auth.uid() = user_id);

-- =============================================
-- AUTOMATION & TRIGGERS
-- =============================================

-- Handle New User Trigger
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role, xp, level, created_at)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    'user', -- FORCE USER ROLE
    0,
    1,
    now()
  )
  on conflict (id) do nothing; -- Prevents error if profile already exists
  return new;
end;
$$ language plpgsql security definer;

-- Trigger Setup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
