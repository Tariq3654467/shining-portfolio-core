-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  first_name text,
  last_name text,
  gender text,
  on_behalf text,
  date_of_birth date,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table profiles
  enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
-- However, since we are handling this manually in the frontend during registration to include more fields,
-- we might not need a trigger for creation, but it's good practice for other signup methods.
-- For now, we'll manually insert after signup.
