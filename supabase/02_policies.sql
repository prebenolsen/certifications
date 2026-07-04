-- Certifications learning platform — Row Level Security
-- Run after 01_schema.sql. Every user can read and write ONLY their own rows;
-- the anon key exposed in the client bundle can do nothing else.

alter table public.certifications_profiles enable row level security;
alter table public.certifications_lesson_progress enable row level security;

-- Profiles: a user manages only their own row.
create policy "certifications_profiles_select_own"
  on public.certifications_profiles for select
  using (auth.uid() = id);

create policy "certifications_profiles_insert_own"
  on public.certifications_profiles for insert
  with check (auth.uid() = id);

create policy "certifications_profiles_update_own"
  on public.certifications_profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Lesson progress: full CRUD limited to the owner.
create policy "certifications_progress_select_own"
  on public.certifications_lesson_progress for select
  using (auth.uid() = user_id);

create policy "certifications_progress_insert_own"
  on public.certifications_lesson_progress for insert
  with check (auth.uid() = user_id);

create policy "certifications_progress_update_own"
  on public.certifications_lesson_progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "certifications_progress_delete_own"
  on public.certifications_lesson_progress for delete
  using (auth.uid() = user_id);
