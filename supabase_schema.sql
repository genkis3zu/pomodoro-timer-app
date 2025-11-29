-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES TABLE
-- Links to Supabase Auth via id
create table public.profiles (
  id uuid references auth.users not null primary key,
  level integer default 1,
  total_xp integer default 0,
  title text,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Policies for Profiles
create policy "Users can view their own profile"
  on public.profiles for select
  using ( auth.uid() = id );

create policy "Users can update their own profile"
  on public.profiles for update
  using ( auth.uid() = id );

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check ( auth.uid() = id );

-- SESSIONS TABLE
-- Stores Pomodoro history
create table public.sessions (
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
create policy "Users can view their own sessions"
  on public.sessions for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own sessions"
  on public.sessions for insert
  with check ( auth.uid() = user_id );

-- TRIGGER: Handle New User
-- Automatically create a profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, level, total_xp, title)
  values (new.id, 1, 0, 'Novice Focuser');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
