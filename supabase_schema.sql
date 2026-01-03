
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES TABLE
-- Links to Supabase Auth via id
create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  title text,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Add columns safely (idempotent)
alter table public.profiles add column if not exists level integer default 1;
alter table public.profiles add column if not exists total_xp integer default 0;
alter table public.profiles add column if not exists credits integer default 0;
alter table public.profiles add column if not exists inventory text[] default array['theme_default'];
alter table public.profiles add column if not exists equipped_items jsonb default '{"theme": "theme_default", "audio": null, "implants": []}'::jsonb;
alter table public.profiles add column if not exists avatar_config jsonb default '{"base": "base_male_1", "cyberware": [], "background": "bg_default"}'::jsonb;

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Policies for Profiles
drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile"
  on public.profiles for select
  using ( auth.uid() = id );

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  using ( auth.uid() = id );

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
  on public.profiles for insert
  with check ( auth.uid() = id );

-- SESSIONS TABLE
-- Stores Pomodoro history
create table if not exists public.sessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone not null,
  mode text not null, -- 'work' or 'break'
  task text,
  xp_gained integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table public.sessions enable row level security;

-- Policies for Sessions
drop policy if exists "Users can view their own sessions" on public.sessions;
create policy "Users can view their own sessions"
  on public.sessions for select
  using ( auth.uid() = user_id );

drop policy if exists "Users can insert their own sessions" on public.sessions;
create policy "Users can insert their own sessions"
  on public.sessions for insert
  with check ( auth.uid() = user_id );

-- TRIGGER: Handle New User
-- Automatically create a profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, level, total_xp, credits, inventory, equipped_items, avatar_config, title)
  values (
    new.id,
    1,
    0,
    0,
    ARRAY['theme_default'],
    '{"theme": "theme_default", "audio": null, "implants": []}'::jsonb,
    '{"base": "base_male_1", "cyberware": [], "background": "bg_default"}'::jsonb,
    'Novice Focuser'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();



