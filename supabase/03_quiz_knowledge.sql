-- Certifications learning platform — quiz knowledge
-- Run after 01_schema.sql and 02_policies.sql. **Safe to re-run**, unlike
-- those two: every statement here is guarded, so this file can be applied to a
-- project that was set up before quizzes existed.
--
-- One row per (user, certification, module, question). Rows outlive the attempt
-- that created them, so the learner can come back to what they got wrong.
--
-- Deliberately separate from certifications_lesson_progress: the grain is the
-- question, not the lesson, and quiz results must never be mistaken for lesson
-- progress — `fetchCloud` maps every row of that table straight into lesson
-- state, so a synthetic row there would show up in every progress percentage.
--
-- Attempt history and unsubmitted drafts are NOT here. They stay in
-- localStorage: a half-finished exam should not follow you to another device.

create table if not exists public.certifications_quiz_knowledge (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  cert_id text not null,
  module_id text not null,
  question_id text not null,
  -- Where the answer is taught: [{ lessonId, cardId, moduleId }]
  review_refs jsonb not null default '[]'::jsonb,
  -- Snapshot of the question as it was asked, so the review list still reads
  -- correctly after the content is edited.
  stem text not null,
  correct_ids jsonb not null default '[]'::jsonb,
  chosen jsonb not null default '[]'::jsonb,
  failed_count integer not null default 0,
  -- False once a later attempt gets it right. The row is kept, not deleted, so
  -- "you have missed this twice" stays true.
  needs_review boolean not null default true,
  last_answered_at timestamptz not null default now(),
  last_failed_at timestamptz,
  resolved_at timestamptz,
  -- The app upserts on this key (onConflict: user_id,cert_id,module_id,question_id).
  unique (user_id, cert_id, module_id, question_id)
);

create index if not exists certifications_quiz_knowledge_user_idx
  on public.certifications_quiz_knowledge (user_id, cert_id, needs_review);

alter table public.certifications_quiz_knowledge enable row level security;

-- Owner-only, mirroring the certifications_progress_* block in 02_policies.sql.
-- `create policy` has no `if not exists`, so each one is dropped first — that is
-- what makes this file re-runnable.
drop policy if exists "certifications_quiz_knowledge_select_own"
  on public.certifications_quiz_knowledge;
create policy "certifications_quiz_knowledge_select_own"
  on public.certifications_quiz_knowledge for select
  using (auth.uid() = user_id);

drop policy if exists "certifications_quiz_knowledge_insert_own"
  on public.certifications_quiz_knowledge;
create policy "certifications_quiz_knowledge_insert_own"
  on public.certifications_quiz_knowledge for insert
  with check (auth.uid() = user_id);

drop policy if exists "certifications_quiz_knowledge_update_own"
  on public.certifications_quiz_knowledge;
create policy "certifications_quiz_knowledge_update_own"
  on public.certifications_quiz_knowledge for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "certifications_quiz_knowledge_delete_own"
  on public.certifications_quiz_knowledge;
create policy "certifications_quiz_knowledge_delete_own"
  on public.certifications_quiz_knowledge for delete
  using (auth.uid() = user_id);
