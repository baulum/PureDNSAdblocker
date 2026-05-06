-- 1. Create the profiles table
create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  email text,
  subscription_tier text default 'free',
  theme text default 'System',
  language text default 'Deutsch',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  primary key (id)
);

-- 2. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- 3. Create RLS Policies
-- Users can read their own profile
create policy "Users can view own profile"
  on profiles for select
  using ( auth.uid() = id );

-- Users can update their own profile
create policy "Users can update own profile"
  on profiles for update
  using ( auth.uid() = id );

-- 4. Create a trigger to automatically create a profile for new users
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 5. Create the secure RPC function to delete a user's account
create or replace function public.delete_user_account()
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  -- This will delete the user from auth.users.
  -- Because profiles.id references auth.users.id ON DELETE CASCADE,
  -- the profile record will be automatically deleted as well.
  delete from auth.users where id = auth.uid();
end;
$$;
