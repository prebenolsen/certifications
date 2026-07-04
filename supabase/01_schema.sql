-- Certifications learning platform — schema
-- All tables are prefixed `certifications_` so this app can safely share a
-- Supabase project with other apps. Run this file first, then 02_policies.sql.

-- Optional profile row per user. Auto-created on sign-up by the trigger below.
create table if not exists public.certifications_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

-- One row per (user, certification, lesson). `viewed_cards` and `answers`
-- mirror the app's LessonProgress shape as JSON:
--   viewed_cards : string[]                (card ids seen)
--   answers      : { [cardId]: boolean }   (interactive result / flashcard recall)
create table if not exists public.certifications_lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  cert_id text not null,
  lesson_id text not null,
  viewed_cards jsonb not null default '[]'::jsonb,
  answers jsonb not null default '{}'::jsonb,
  completed boolean not null default false,
  updated_at timestamptz not null default now(),
  -- The app upserts on this key (onConflict: user_id,cert_id,lesson_id).
  unique (user_id, cert_id, lesson_id)
);

create index if not exists certifications_lesson_progress_user_idx
  on public.certifications_lesson_progress (user_id);

-- Create a profile automatically whenever a new auth user is created.
create or replace function public.certifications_handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.certifications_profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists certifications_on_auth_user_created on auth.users;
create trigger certifications_on_auth_user_created
  after insert on auth.users
  for each row execute function public.certifications_handle_new_user();
