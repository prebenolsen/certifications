# End-of-module quizzes, with a durable record of what you got wrong

> **Status: shipped in v1.8.0, with deliberate divergences.** This is the design
> doc the feature was built from, kept for its reasoning — the *why* behind the
> decisions, which `ARCHITECTURE.md` only summarises. It is **not** a description
> of the current code. What differs:
>
> | Section | Reality |
> |---|---|
> | §1 authored banks | **Not built.** The pool is generated from lesson checks only. `ReviewRef` did land as a real content type, so the groundwork exists. |
> | §4 renderer seam | Built, but the derivations here are **wrong in three places** — `feedback` must default to `'immediate'` at the destructure (in-lesson it arrives `undefined`, so `locked` would never become true); control must branch on `value !== undefined`, not on whether `onValueChange` was passed; and true/false must decode `[]` as "no answer", not as False. See the real code. |
> | §5 `QuizPlayer`, scroll-snap, `useActiveSnapIndex`, `LayoutRoute` | **Not built.** The attempt is one question at a time inside the normal `Layout`. Assessment wants an explicit step between questions, and this avoided extracting the scroll tracker. |
> | §6 `?card=` deep links | **Not built** — queued in `GOING-FORWARD.md`, hazard and all. |
> | §7 validator | Only the "complete module has no quiz" warning landed; bank rules are moot without banks. |
> | §3 `missed` map | **Dropped.** Recording a miss in both `missed` and `knowledge` meant two shapes for one fact. `knowledge` is the single record. |
> | §3 `supabase/03_module_quiz.sql` | Landed as `03_quiz_knowledge.sql`, one table for knowledge; attempts stay local. |


## Context

Every authored lesson ends with 1–2 interactive checks (`mcq` / `truefalse`)
woven into the card flow. That is good formative teaching, but it is not
assessment: the learner answers a question inside the lesson that just explained
it, sees the answer immediately, and **nothing is retained beyond a single
boolean**. The entire persisted answer surface today is
`answers: Record<cardId, boolean>` inside `LessonProgress`, first-answer-wins,
with no chosen option, no timestamp, and no attempt history. There is no quiz,
no review surface, and no way to ask "what did I get wrong last week?"

Measured (verified by walking the content):

| Track | Interactive cards | Lessons | ≈ per module |
|---|---|---|---|
| Data Analyst Associate | 58 | 30 | 6.4 |
| Data Engineer Professional | 50 | 31 | 5.6 |
| Data Engineer Associate | 40 | 27 | 5.7 |
| Intro to Data Engineering | 12 | 10 | 3.0 |
| GenAI Engineer Associate | 8 | 4 authored | 1 module viable |
| GitHub Copilot (GH-300) | 6 | 3 authored | 1 module viable |

So the raw material exists for a real per-module quiz in the three complete
certs, and authored banks are what close the gap elsewhere.

**Intended outcome:** each module gains an optional end-of-module quiz covering
the whole module; the learner picks Exam mode (no feedback until they submit) or
Practice mode (feedback as they go); every wrong answer is stored with provenance
so it can be reviewed later and deep-linked back to the exact lesson card that
teaches it. This also lands the *"spaced-repetition review queue built from
missed questions"* idea from `CONTENT.md` and becomes the substrate for the
timed exam-simulation mode listed next to it.

## Decisions confirmed with the user

| Decision | Choice |
|---|---|
| Question source | **Hybrid** — auto-assembled from the module's existing `mcq`/`truefalse` cards now; optional authored banks per module, added cert by cert |
| Flow | **Learner picks per attempt** — Exam or Practice |
| Formats | Single-answer MCQ, true/false, multi-select MCQ, scenario-stem MCQ. No new interaction types |
| Review | **Per-module** review surface with deep links to the source card |

**The hard invariant, everywhere:** the quiz is optional. `useLessonStats`,
`useModuleStats`, `useCertStats` and `moduleStatus()` are **not touched**, so
"optional" holds structurally rather than by convention. Content status must
never depend on learner results.

---

## The shape of it

```
ModulePage ──(ModuleQuizCard)──▶ Intro/mode ──▶ Attempt ──▶ Results
    ▲                                ▲                        │
    │                                └────── Retake ◀─────────┤
    └──────────── Module review ◀──── "Review N missed" ───────┘
                       │
                       └──▶ Lesson player, at the exact card (?card=…)
```

| Screen | URL | Chrome |
|---|---|---|
| Quiz entry card (a section of the module page) | `/cert/:certId/module/:moduleId` | in `Layout` |
| Intro + mode picker | `…/module/:moduleId/quiz` | in `Layout` |
| The attempt | `…/quiz/attempt?mode=exam\|practice` | **full-screen** |
| Results | `…/quiz/results/:attemptId` | in `Layout` |
| Persistent review | `…/module/:moduleId/review` | in `Layout` |

The attempt is the same interaction as a lesson — one card centred, scroll-snap,
swipe on mobile — so it belongs in the same full-viewport shell as `CardPlayer`.
Results and review are **documents**: you scroll them, expand rows, and click out
into lessons. Scroll-snap is wrong for a list, and staying inside `Layout` keeps
back-navigation and the auth menu working. Results are keyed by `:attemptId`
rather than "latest" so a refresh after starting a new attempt can't show the
wrong thing, and attempt history stays linkable.

---

## 1. Content model — the authored bank

In `src/types/content.ts`. The point of this shape: **a quiz question *is* a card
the platform already renders**, so there is no new card type, no new renderer, and
`validateCard` applies to a bank unchanged.

```ts
/**
 * Points at the card that *teaches* a question's answer, so a learner who
 * misses it can be dropped into the exact lesson section that explains it.
 */
export interface ReviewRef {
  lessonId: string
  cardId: string
  /** Authored questions may point at teaching in another module. */
  moduleId?: string
}

/**
 * The two card shapes a quiz question can take — deliberately the same types
 * the in-lesson player renders. A **scenario-stem** question is just an
 * `McqCard` whose `question` opens with the situation (usually with
 * `eyebrow: 'Scenario'`): an authoring convention, not a type.
 */
export type QuizQuestionCard = McqCard | TrueFalseCard

/** An optional authored bank on top of a module's generated questions. */
export interface ModuleQuiz {
  /**
   * `extend` (default) pools the bank with the generated questions;
   * `replace` ignores the generated set — for a module whose in-lesson checks
   * have been superseded. The validator then holds the bank to the minimum
   * size, since there is no fallback behind it.
   */
  mode?: 'extend' | 'replace'
  /** Questions one attempt draws. Defaults to `QUIZ_TARGET`. */
  targetCount?: number
  /** Generated questions to leave out (too easy, or duplicated by a bank one). */
  exclude?: ReviewRef[]
  questions: QuizQuestionCard[]
}
```

Plus three optional fields:

- `McqCard.reviewRefs?: ReviewRef[]` — optional on an in-lesson card (its own
  position *is* the reference), **required** on a bank question, enforced by the
  validator. Also useful on an in-lesson check that tests an earlier lesson.
- `TrueFalseCard.reviewRefs?: ReviewRef[]` — same.
- `Module.quiz?: ModuleQuiz` — omit it and the module still gets a generated quiz.

Rejected: a `{ card, reviewRefs }` wrapper (every consumer must unwrap, and
authoring gains a nesting level); `reviewRefs` on `CardBase` (meaningless on
`ConceptCard`); and a parallel `QuizQuestion` content type (would duplicate the
options/`correct`/`explanation`/`optionFeedback` shape and need its own renderer
and its own validator rules).

## 2. Assembly — `src/lib/quiz.ts` and `src/lib/random.ts` (new)

`src/lib/quiz.ts` holds derived runtime types and assembly policy. **Not**
`src/content/registry.ts`: the registry is pure content lookup with no policy and
no randomness, and it is imported by the validator. Hard constraint —
`quiz.ts` may import `@/types/content` and `@/content/registry` **only**, never
`@/lib/supabase` (it touches `import.meta.env` and would break the validator
running under `tsx`).

```ts
export type QuizMode = 'exam' | 'practice'

export interface QuizQuestion {
  /** Stable id: `g:<lessonId>:<cardId>` generated, `a:<moduleId>:<cardId>` authored. */
  id: string
  origin: 'generated' | 'authored'
  card: QuizQuestionCard
  /** Where the teaching is. Never empty. */
  reviewRefs: ReviewRef[]
}

/** Smallest pool worth calling a quiz. Below this, the module has no quiz. */
export const QUIZ_MIN = 3
/** Questions per attempt when the module does not say. */
export const QUIZ_TARGET = 12
/** Below this, a pass/fail verdict is noise rather than signal. */
export const VERDICT_MIN = 5

/** Every question a module could ask, in content order. UI-free. */
export function buildQuizPool(certId: string, moduleId: string): QuizQuestion[]
/** Pool size only, memoised in a `WeakMap<Module, number>`. */
export function quizPoolSize(module: Module): number
/** One question by id — for review links and for replaying an attempt. */
export function resolveQuestion(certId: string, moduleId: string, questionId: string): QuizQuestion | undefined
/** The ordered question ids for a new attempt. */
export function planQuestionIds(pool: QuizQuestion[], count: number, seed: number): string[]
```

- **Which cards qualify:** lessons with `status !== 'planned'`, cards passing the
  existing `isInteractive()` from `src/types/content.ts` — do not re-implement
  that test. `flashcard` is excluded and must stay excluded: it is self-graded
  recall, and `docs/ARCHITECTURE.md` already commits to self-report never
  diluting objective accuracy.
- **The id namespace** works because lesson ids are unique within a cert and card
  ids within a lesson; the `g:` / `a:` prefixes keep the families apart.
  Verified: **no content id anywhere contains `:`**, so it is a safe separator.
  A generated id keys on the *lesson*, not the module, so moving a lesson between
  modules preserves a learner's review history.
- **Question order is shuffled once, at attempt start**, from a stored seed, and
  the attempt persists its `questionIds`. Everything afterwards — resume, the
  results screen — replays that stored order. A bare `Math.random()` inside a
  component would reshuffle on every re-render (and every answer re-renders):
  a correctness bug, not a preference. A fixed content order is also rejected —
  learners memorise positions, which is the exact failure mode this platform
  exists to avoid.
- `src/lib/random.ts`: a seeded mulberry32 `rngFromSeed(seed)`, `shuffled(items, rng)`
  (Fisher–Yates on a copy), and `newSeed()`. Small, dependency-free, and
  deterministic-per-attempt is what makes resume and results replayable.

## 3. Persistence

### Shape — a sibling map on the existing state

```ts
export interface QuizResponse {
  /** Option ids for mcq; ['true'] / ['false'] for truefalse — one shape. */
  chosen: string[]
  correct: boolean
  at: string
}

export interface QuizAttempt {
  id: string                                  // Date.now().toString(36)
  mode: QuizMode
  seed: number
  /** The order actually served. The attempt owns its order. */
  questionIds: string[]
  responses: Record<string, QuizResponse>
  startedAt: string
  /** Absent ⇒ still a draft. Never counts toward the best score. */
  finishedAt?: string
  score?: number                              // 0..1, written once at finish
}

/**
 * A question the learner has got wrong at least once. Carries provenance and a
 * text snapshot, so the review list still reads correctly after the question is
 * edited or removed from the content.
 */
export interface MissedRecord {
  questionId: string
  reviewRefs: ReviewRef[]
  /** Snapshot of the stem and the right answer as shown at the time. */
  stem: string
  correctIds: string[]
  /** Their most recent wrong selection. */
  chosen: string[]
  missCount: number
  lastMissedAt: string
  /** Set when a later attempt gets it right. Kept, never deleted. */
  clearedAt?: string
}

export interface ModuleQuizProgress {
  attempts: QuizAttempt[]                 // finished, newest last, capped at 10
  draft?: QuizAttempt                     // the single unsubmitted exam attempt
  missed: Record<string, MissedRecord>    // uncapped — this is the durable part
  bestScore: number | null                // denormalised for the module badge
}

interface ProgressState {
  lessons: Record<string, LessonProgress>
  /** `${certId}/${moduleId}` → quiz progress. */
  quizzes: Record<string, ModuleQuizProgress>
}
```

**Keying must include `certId`.** Module ids collide across certifications today —
`foundations` appears in three certs, `ingestion`/`governance`/`optimization`/
`transformation` in two each — because the validator only enforces module-id
uniqueness *within* a cert. The existing `progressKey` / `splitKey` helpers split
on the first slash, so both maps reuse them unchanged.

**A sibling map, not a second provider.** The Supabase hydration in
`ProgressContext` is the hard part of that file — `hydratedForRef` gating, the
cancel flag, the `syncedRef` diff, the first-sign-in adoption push. A second
provider would duplicate all of it and then race with the first: two independent
"is the cloud empty?" decisions can disagree.

**No storage-key bump.** `quizzes` is purely additive — no existing field changes
meaning — so a stored `certifications.progress.v2` payload is valid as-is. What
it does need is a normaliser, which also fixes a latent crash (a parseable but
wrong payload can currently yield `lessons: undefined`):

```ts
function normalize(parsed: unknown): ProgressState {
  const p = (parsed ?? {}) as Partial<ProgressState>
  return { lessons: p.lessons ?? {}, quizzes: p.quizzes ?? {} }
}
```

Apply it to both the v2 read and the `migrateV1` result in `loadLocal`, and make
`migrateV1` return `{ lessons, quizzes: {} }`. `resetAll` must become
`setState({ lessons: {}, quizzes: {} })` — today's `{ lessons: {} }` would leave
`quizzes` undefined and orphan every cloud quiz row.

**When they later get it right, the record is kept**, with `clearedAt` set. That
is what makes the review surface a history rather than a snapshot of the last
attempt, and it powers its second section ("previously missed, now correct").
`missCount` survives, so "you have missed this twice" stays true. A correct
answer to a question that was never missed writes nothing, so the map only ever
holds real misses.

### Context API additions

```ts
getModuleQuiz: (certId, moduleId) => ModuleQuizProgress | undefined
/** Creates or replaces the draft; returns the attempt id. */
startQuizAttempt: (certId, moduleId, input: { mode: QuizMode; seed: number; questionIds: string[] }) => string
/** Practice commits immediately; exam updates the draft. */
recordQuizResponse: (certId, moduleId, attemptId, questionId, response: QuizResponse, provenance: Pick<MissedRecord, 'reviewRefs' | 'stem' | 'correctIds'>) => void
/** Sets finishedAt + score, moves draft → attempts, updates `missed`, trims history. */
finishQuizAttempt: (certId, moduleId, attemptId) => void
discardQuizAttempt: (certId, moduleId, attemptId) => void
clearMissed: (certId, moduleId, questionId) => void
resetModuleQuiz: (certId, moduleId) => void
```

Provenance is passed **in** rather than looked up, which keeps `ProgressContext`
free of content coupling and makes the snapshot honest — it records what the
learner actually saw, not what the content says today. `startQuizAttempt` is
called on the **first answer**, not on mount, so opening a quiz and bouncing
persists nothing.

**In-lesson `recordAnswer` stays boolean-only.** `LessonProgress.answers` is
`Record<string, boolean>` in localStorage, in the `answers` jsonb column, and in
`useLessonStats`. Widening it is a real migration plus a cloud reinterpretation
in exchange for chosen-option data that no in-lesson feature consumes. Keep
"first answer is final" — the quiz slice is separate, so a retake never fights
lesson progress.

### Supabase — `supabase/03_module_quiz.sql` (new file)

A **new table**, not a `quiz jsonb` column on `certifications_lesson_progress`.
The grain differs (module vs lesson), and a shared table would force a synthetic
`lesson_id`; `fetchCloud` maps every row straight into `state.lessons`, so those
phantom rows would be visible to `getLesson`, `useLessonStats`, `useModuleStats`
and `useCertStats` — making the "quiz never affects progress" invariant violated
by default.

A **third file**, not an append to `01`/`02`: `create policy` has no
`if not exists`, so `02_policies.sql` is already single-run-only and appending
would leave an existing deployment unable to apply the change. Writing the new
file with `drop policy if exists` + `create policy` makes it re-runnable for both
a fresh project and an existing one.

```sql
-- Certifications learning platform — module quiz progress
-- Run after 01_schema.sql and 02_policies.sql. Safe to re-run.
--
-- One row per (user, certification, module). Deliberately separate from
-- certifications_lesson_progress: the grain is the module, and quiz results
-- must never be mistaken for lesson progress.
--   attempts : QuizAttempt[]                 (finished only, capped at 10)
--   missed   : { [questionId]: MissedRecord } (wrong answers + provenance)
create table if not exists public.certifications_module_quiz (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  cert_id text not null,
  module_id text not null,
  attempts jsonb not null default '[]'::jsonb,
  missed jsonb not null default '{}'::jsonb,
  best_score numeric check (best_score is null or (best_score between 0 and 1)),
  updated_at timestamptz not null default now(),
  -- The app upserts on this key (onConflict: user_id,cert_id,module_id).
  unique (user_id, cert_id, module_id)
);

create index if not exists certifications_module_quiz_user_idx
  on public.certifications_module_quiz (user_id);

alter table public.certifications_module_quiz enable row level security;
-- Four owner-only policies (select / insert / update / delete), each
-- `using (auth.uid() = user_id)`, mirroring the certifications_progress_* block
-- in 02_policies.sql, each preceded by `drop policy if exists`.
```

Client work in `ProgressContext.tsx`, mirroring the three existing helpers
directly below them: `fetchQuizCloud` / `upsertQuizCloud` / `deleteQuizCloud`,
all keeping the `if (!supabase) return` guard and the defensive `?? []` / `?? {}`
reads. Then:

- **Hydration:** `Promise.all([fetchCloud(uid), fetchQuizCloud(uid)])` inside the
  existing effect — no new lifecycle. The first-sign-in adoption test stays
  **all-or-nothing across both maps**; per-map adoption would let a guest session
  in a second browser leak quiz data into an established account.
- **Writer:** a second diff loop against a new `syncedQuizRef`, identical in
  shape to the lesson loop. Reference-identity diffing works because every quiz
  reducer returns a fresh object for the touched key only.
- **`draft` is stripped before upsert** — an unsubmitted exam has no score worth
  syncing, a per-selection cloud write would be chatty, and a half-finished exam
  should not surface on another device. Drafts live in localStorage only.
- Guest mode needs no new plumbing: `supabase === null` short-circuits all six
  helpers and `quizzes` rides in the same localStorage blob.

### Stats — `src/hooks/useStats.ts`

Add `useModuleQuizStats(certId, module)` returning `{ available, poolSize,
length, verdictMeaningful, attempts, lastAttempt, best, missed, cleared,
staleMissed, draft }`, and `useMissedQuestions(certId, module)` for the review
screen (sorted by `missCount desc, lastMissedAt desc`, split into resolvable and
"from older content"). Both are read-only and additive; the three existing hooks
are untouched.

Also **surface `useLessonStats.accuracy`**, which has been computed and displayed
nowhere. A small chip in `ModulePage`'s `LessonRow` beside `~N min`, rendered
only when `accuracy !== null`, phrased as "4/5 checks" rather than a score so it
reads as a teaching signal. It is already correct (flashcards excluded via
`isInteractive`), so this is dead-code activation, not new logic.

## 4. The renderer seam — one prop, two features

Exam mode needs an answer accepted with **no reveal**. Today `submitted` in
`McqRenderer` drives the lock *and* the reveal, and recolours every option — so a
wrapper component cannot intercept it (hiding the feedback panel still leaks the
answer through the colours). Quiz-specific renderers would fork ~110 lines of the
most visible component in the app.

`src/components/cards/types.ts`:

```ts
export interface CardRendererProps<C extends Card = Card> {
  card: C
  /** `chosen` reports the option ids picked, for quiz review and results. */
  onAnswered?: (correct: boolean, chosen?: string[]) => void
  /**
   * Interactive cards normally reveal the answer as soon as it is submitted.
   *  - 'immediate' (default) — today's behaviour, unchanged.
   *  - 'deferred'  — accept and show the selection, never say if it is right.
   *  - 'revealed'  — force the answered state (results / review screens).
   */
  feedback?: 'immediate' | 'deferred' | 'revealed'
  /** Controlled selection, for callers that own the answer buffer. */
  value?: string[]
  onValueChange?: (chosen: string[]) => void
}
```

One tri-state rather than two booleans, because the three states are mutually
exclusive and a boolean pair admits nonsense. **The payoff worth noting: the same
prop that enables exam mode also renders the results screen** —
`feedback="revealed"` with `value={response.chosen}` produces "here is the
question, here is what you picked, here is why it was wrong" with zero new
markup and styling identical to in-lesson feedback.

`McqRenderer` — about ten lines:

```ts
const controlled = value !== undefined
const selected  = controlled ? value : localSelected
const revealed  = feedback === 'revealed' || (feedback !== 'deferred' && submitted)
const locked    = feedback === 'revealed' || (feedback === 'immediate' && submitted)
```

`toggle` guards on `locked` and routes through `onValueChange ?? setLocalSelected`;
option `disabled={locked}`; the tone matrix and `optionFeedback` branch on
`revealed`; the "Check answer" button renders only for `immediate && !submitted`;
`submit()` calls `onAnswered?.(isCorrect, selected)`; `AnswerFeedback` renders on
`revealed`. `TrueFalseRenderer` takes the same three derivations, with `choice`
read from `value[0] === 'true'` when controlled.

`onAnswered`'s extra argument is additive, so `CardPlayer`'s existing
`(correct) => recordAnswer(...)` stays assignable and **compiles unchanged** — a
function of fewer parameters satisfies the wider signature. Every in-lesson call
site passes nothing new, so `feedback` is `undefined` → `'immediate'` → the
identical code path. Behaviour for the ~250 existing interactive cards is
byte-identical.

**Exam mode lets the learner change an answer before submitting.** Every real
exam does; the scroll-snap stack makes scrolling back inevitable, and a locked
card read as a dead end looks like a bug. It is also the *simpler*
implementation: in deferred mode the renderer is controlled, `QuizPlayer` owns
the buffer, and there is no per-question submit at all — **selection is the
answer**. A deferred-mode "Submit" button would produce no observable feedback;
its only effect would be to lock the learner out.

## 5. Components

### Extract the tracker, keep the players separate

`QuizPlayer` is a **sibling** of `CardPlayer`, not a mode of it. `CardPlayer`'s
contract is `lesson: Lesson`, and its progress writes are
`markCardViewed(certId, lesson.id, …)` / `markCompleted(certId, lesson.id)` — a
quiz assembled from several lessons has no real lesson id, so reusing it means
fabricating one and writing synthetic rows into `ProgressState.lessons` and the
Supabase lesson table. The two players also have different jobs: one records that
everything was *read*, the other *scores*.

What must be shared is one hook: `src/hooks/useActiveSnapIndex.ts`, extracted
from `CardPlayer.tsx:42-83`. Its design is non-obvious and hard-won — scroll
position nearest-midpoint rather than an `IntersectionObserver` ratio, because
cards taller than the viewport never reach a visibility threshold — and
re-deriving it in a second player would quietly reintroduce that bug. Signature:
`useActiveSnapIndex(scrollerRef, itemRefs, count, { initialIndex, enabled })`,
returning only the index; **side effects move out into `CardPlayer`**, which
reacts to settled index changes.

### New files

```
src/lib/random.ts                            seeded PRNG + shuffle
src/lib/quiz.ts                              pool assembly, ids, thresholds (UI-free)
src/hooks/useActiveSnapIndex.ts              extracted scroll-snap tracker
src/components/quiz/ModuleQuizCard.tsx       module-page entry, all five states
src/components/quiz/QuizPlayer.tsx           full-screen attempt runner
src/components/quiz/QuizQuestionSlide.tsx    one snap slide
src/components/quiz/QuizScore.tsx            score + verdict (hero | compact)
src/components/quiz/QuizQuestionResult.tsx   one breakdown row — results AND review
src/components/ui/ConfirmDialog.tsx          reusable confirm; nothing like it exists
src/components/layout/LayoutRoute.tsx        <Layout><Outlet /></Layout>
src/pages/QuizIntroPage.tsx
src/pages/QuizAttemptPage.tsx
src/pages/QuizResultsPage.tsx
src/pages/ModuleReviewPage.tsx
```

`QuizPlayer` takes **no `certId` and no store access** — `{ moduleTitle, mode,
questions, initialResponses?, onRespond, onFinish, onExit }`. Exam mode must not
write until submit and practice must write immediately; keeping that policy in
`QuizAttemptPage` leaves the player purely about interaction. Pages take no
props, read `useParams()` defaulted to `''`, and render `<NotFound />` on a
failed lookup — matching every existing page.

Reused untouched: `CardView`, `CardFrame`, `AnswerFeedback` (including its
existing `role="status"`), `RichText` and with it the glossary underlining
(free inside `CardFrame`'s `GlossaryScope`), `SpecDiagram`, `ProgressBar`,
`.card-scroller` / `.card-snap`, and the Tailwind semantic tokens.

One neat trick worth knowing: `CardFrame` renders `card.eyebrow ?? meta.label`,
so `<CardView card={{ ...question.card, eyebrow: 'Question 4 of 12' }} />`
relabels a card without touching `CardFrame`, and a shallow spread keeps the
discriminated-union narrowing. That is how both the attempt slide and the results
row avoid a "Check yourself" eyebrow, with no new chrome.

`ProgressBar` gains one optional `label?: string` → `aria-label`, so a bar can say
what it measures ("8 of 12 answered"). One line, backward compatible.

### Routing — `src/App.tsx`

`isLesson = /\/lesson\//.test(pathname)` cannot be patched cleanly:
`/quiz/attempt/` never appears, and `/\/quiz\//` would also match
`/quiz/results/…`, which must stay inside `Layout`. **Delete the regex and the
duplicated two-`<Routes>`-tree structure** in favour of a pathless layout route:
two full-screen routes at the top, then `<Route element={<LayoutRoute />}>`
wrapping the six chrome'd routes. `useLocation` drops out entirely — which also
removes a whole-tree re-render on every navigation — and every future
full-screen surface becomes a one-line addition. Route order is irrelevant;
React Router v6 ranks by specificity, so `/quiz/attempt` beats `/quiz`.

Mode is `?mode=`, not a path segment: it is an option on an attempt, not a
resource, and it gives one obvious place to reject a missing or garbage value
(`<Navigate replace to="…/quiz" />`) rather than silently starting an exam.

### The module-page entry point

`<ModuleQuizCard certId={certId} module={module} />` immediately after the
lessons `<ol>`. It owns all of its own availability logic, so `ModulePage` gains
exactly one line and `LessonRow` is untouched (bar the accuracy chip).

| State | What the learner sees |
|---|---|
| Pool `< QUIZ_MIN` | Renders `null`. A disabled card on a coming-soon module is noise |
| Never attempted | *"Module quiz · 12 questions, drawn from 5 lessons"* · **Start quiz →** · *"Exam or practice. Optional — nothing is locked behind it."* |
| Good last attempt (≥ 80%) | `good` tone, *"Best 11/12 · 3 days ago"*, **Retake →**, and **Review 2 missed** when there are any |
| Weak last attempt (< 80%) | `warn` tone, and **the hierarchy inverts** — primary is **Review 5 missed cards →**, secondary is *Retake*. After a bad attempt the next step is to go learn, not to reroll |
| Exam draft open | **Resume exam — 4 of 12 answered →**, beside a *Start over* that confirms first |

## 6. Deep-linking a card

Review links point at `…/lesson/:lessonId?card=<cardId>`. A **query param, not a
hash**, for three concrete reasons: the fragment is already contested by
`detectSessionInUrl: true` in `src/lib/supabase.ts` (magic-link tokens arrive
there and the client rewrites it); the GitHub Pages SPA shim in `public/404.html`
demonstrably round-trips `location.search`, so a shared review link works in
production; and native fragment scrolling fires before React mounts the cards,
then persists and fights the programmatic `scrollIntoView`.

`CardPlayer` gains `initialCardId?: string` — an **id, not an index**, because an
index points at a different card the moment a lesson gains one, and an id is what
the stored record has anyway. `findIndex` → `-1` clamps to `0`, so an orphaned
card id opens the lesson at the start: no error path, no `NotFound`.

**The hazard, and it is a real data bug, not cosmetic.** The tracker runs on
mount, marks card 0 viewed, and a *smooth* scroll to card 7 then fires dozens of
scroll events — each throttled update marking whatever is nearest the midpoint as
viewed. One deep link would mark cards 0–7 read, inflating `viewedCards` locally
and in Supabase. Three-part fix:

1. **Jump, don't animate:** `scrollIntoView({ behavior: 'auto', block: 'center' })`
   in a once-only effect, so no intermediate card is ever centred.
2. **Gate the tracker** until the jump lands (`enabled: ready`), which also
   guards against an in-flight throttled timer firing mid-jump.
3. **Move the side effects out of the tracker** into an effect on the settled
   index, doing `markCardViewed` and the last-card `markCompleted`. The separate
   mark-card-0-on-mount effect then becomes redundant and is deleted;
   `markCardViewed` is already idempotent, so there is no extra render.

`LessonPage` reads the param **once** into `useState`, passes it down, then strips
it with `setSearchParams({}, { replace: true })` — so Back does not re-jump and a
refresh after scrolling away does not yank the learner back. Keep the existing
`key={certId/lessonId}`; adding the card id would remount the player the instant
the param is stripped. `CardPlayer` stays router-free.

On the linking side, `QuizQuestionResult` validates before rendering: lesson gone
→ a muted *"the lesson this came from has changed"* and no link; lesson present
but card id gone → link to the lesson without `?card=`.

## 7. Validator and glossary

`scripts/validate-content.ts` — remember **warnings fail** here.

**Errors:** duplicate question id within a bank; a bank card that is not
`mcq`/`truefalse`; a bank question with no `reviewRefs`; a `reviewRef` whose
`lessonId` does not resolve **in this certification**, or whose `cardId` does not
exist in that lesson; an `exclude` entry that does not resolve; `mode: 'replace'`
with fewer than `QUIZ_MIN` questions; `targetCount` below `QUIZ_MIN`. Run every
bank card through the existing `validateCard` so the option / `correct` /
`optionFeedback` rules are inherited rather than duplicated.

**Warnings**, in the existing philosophy-as-warnings voice: a `complete` module
whose pool is below `QUIZ_MIN` (*"complete module has no quiz (pool of N) — add
interactive checks or an authored bank"*); a bank on a module with no authored
lessons; a `reviewRef` pointing at a `planned` lesson (*"review link lands on a
lesson the learner can't open"*); a bank mcq whose `explanation` is under ~40
chars (*"a quiz explanation that doesn't say why is a scored gotcha"*); a
multi-select where every option is correct; `targetCount` above the pool. Extend
the summary line with authored question and bank counts.

**One thing to fix in the same step, or the gate breaks:** the intro course's
`foundations` module is `complete` with a pool of exactly **2** (one t/f in
`delta-lake-intro`, one mcq in `unity-catalog-intro`), so the new warning fires
immediately. Author one more interactive check in that module as part of this
change. Verified nearest neighbour: DE Associate `cicd` sits at exactly 3, so
`QUIZ_MIN = 3` clears everything else.

**Glossary:** bank questions are learner-visible text that is *not* inside a
lesson, so `readingOrder()` in `scripts/glossary-report.ts` would not scan them
and a bank could name an undefined term with nothing flagging it. Extend
`readingOrder()` to append a module's bank text at the position of that module's
last lesson.

## 8. Edge cases

| Case | Behaviour |
|---|---|
| All lessons `planned`, or only flashcard checks | Pool 0 → no card on the module page; `…/quiz` typed directly shows *"No quiz yet — this module's quiz is built from its lessons, and they haven't been written"* and a back link (**not** `NotFound` — the module is real); `…/quiz/attempt` → `<Navigate replace>` |
| Pool 3–4 | The quiz exists and both modes are offered — mode is a mode, not a length. Intro notes *"only 3 questions so far"*; results show score and misses but **suppress the verdict** below `VERDICT_MIN`, replacing it with *"Too few questions to gauge readiness — treat this as practice"* |
| Pool below `targetCount` | Ask the whole pool. Say the real number ("3 questions"), never "3 of 12". Never pad or repeat |
| Abandoned attempt | **Resume, exam mode only** — practice commits every answer as it happens, so resuming is meaningless. One draft per module; starting a new exam over a live draft requires an explicit confirmed discard, never a silent overwrite |
| Abandoned attempt whose questions changed | If any `questionIds` entry no longer resolves, withdraw the resume offer: *"This module's questions changed since you started"* |
| Orphaned missed id | Render the stored `stem`/`correctIds` snapshot in a collapsed *"N questions from older content"* group, muted, no deep link. **Filter at read time; never auto-prune** — content ships continuously here and a redeploy must not silently erase someone's review list. Only `resetModuleQuiz` and `clearMissed` delete |
| Content edit changed the right answer | Render the **live** card when resolvable, so the learner learns the current truth; the snapshot's `correctIds` remains as "what you were marked against" |
| Review surface with nothing missed | A good outcome, presented as one — never attempted: *"Nothing to review yet. Take the module quiz and anything you miss collects here."*; attempted and clean: 🎯 *"Nothing missed in this module"* + best score + **Retake →** |
| `resetLesson` | Leaves quiz data alone, documented on the function. A lesson reset means "let me re-read this", not "erase my quiz history" |
| Intro course (no `examFacts`) | Works unchanged — availability is derived from module content and `examFacts` is never consulted. Copy only: a `quizModeLabel(cert)` helper shows **"Test mode"** rather than "Exam mode" for a cert with no exam |

Keyboard and accessibility: arrows/PageUp/PageDown as in lessons; `Escape` exits
practice immediately (nothing is lost) but opens a `ConfirmDialog` in exam mode
(answers are saved but unscored) — confirming both would just train people to
dismiss dialogs. The dialog owns `Escape` via `stopPropagation()`, the same idiom
`GlossaryMark` already uses, which is also why glossary popovers will not fight
the new player. Each slide is a `role="group"` labelled *"Question 4 of 12"* and
receives `focus({ preventScroll: true })` on activation — `preventScroll` is
load-bearing, and arrow keys keep working because the handler is on `window`.
The results score sits in one `role="status" aria-live="polite"` region with the
breakdown outside it. `prefers-reduced-motion` is already global, so the only
obligation is to add no JS-driven animation: a static score, not a count-up.

## 9. Deliberately out of scope

Named here so the plan is honest about its edges, and because each is a clean
follow-up on top of this substrate: option-order shuffling (verified safe —
every option id is `a`–`d` in order and no content text references option
letters — but it needs a positional-badge change in the most-used renderer for a
marginal gain); a timer / timed cert-wide mock exam (this design is the
substrate: "a different pool plus a clock", since the attempt already owns its
`questionIds`); digit-key option shortcuts; spaced-repetition scheduling on top
of the durable miss records; and folding in-lesson misses into the review
surface (possible for free from existing `answers` data, but it mixes two grains).

## 10. Build order

1. `types/content.ts`, `lib/random.ts`, `lib/quiz.ts`, validator rules, **plus
   the extra check in the intro course's `foundations` module**. No UI; the new
   warnings immediately report which modules lack a quiz.
2. `cards/types.ts` and the two renderers. Regression gate: every existing lesson
   behaves identically.
3. `useActiveSnapIndex` + `CardPlayer` adoption + `initialCardId` + the
   `LessonPage` param. Deep links work before anything links to them.
4. `ProgressContext` quiz slice + `normalize()` + `useModuleQuizStats`, local only.
5. `supabase/03_module_quiz.sql`, `TABLES`, and the three sync helpers.
6. `LayoutRoute` + `App.tsx`, then `ModuleQuizCard` and `QuizIntroPage`.
7. `QuizPlayer`, `QuizQuestionSlide`, `ConfirmDialog`, `QuizAttemptPage`.
8. `QuizScore`, `QuizQuestionResult`, `QuizResultsPage`, `ModuleReviewPage`.
9. One authored pilot bank — **Data Engineer Associate, Module 1** (4 lessons,
   cert complete, pool of ~6 to top up) — so the authoring path is proven rather
   than theoretical. Then docs.

Steps 2 and 3 carry the regression risk and are both independently verifiable
before any quiz UI exists. That sequencing is deliberate.

## 11. Docs to update in the same change

- **`docs/ARCHITECTURE.md`** — the `CardRendererProps` paragraph (lines 45-50) is
  *wrong* the moment `types.ts` changes; the routing table (108-121) and its
  "four routes plus a fallback" prose must describe the pathless layout route;
  a new *"Quizzes and review"* subsection (pool vs attempt, why `QuizPlayer` is
  a sibling, what the two players share); the progress section (89-104) gains the
  quiz slice and the drafts-are-local rule; the directory map gains the new
  folders. While there, fix an existing staleness: line 84 claims an
  `IntersectionObserver` tracks the active card — the code is a scroll-position
  tracker, deliberately.
- **`docs/AUTHORING.md`** — a *"Your checks are also the module quiz"* section,
  because three authoring constraints change: every `mcq`/`truefalse` in a
  non-`planned` lesson becomes a quiz question; `explanation` is now read **out
  of lesson context** on a results screen so it must stand alone (no "as we saw
  above"); and **card ids are now referenced by stored review records, so
  renaming one silently breaks a learner's saved review link** — card ids are a
  stable interface now. Plus the authored-bank template and `reviewRefs`.
- **`CONTENT.md`** — per-module question counts, which modules have authored
  banks, and restate the two *Platform-level future ideas* this supersedes or
  half-builds.
- **`README.md`** — quizzes in the product overview, a Quiz row in the
  architecture table, the new routes in the Pages row.
- **`CHANGELOG.md` + `package.json`** — minor bump to **1.8.0** by this repo's own
  rule. `Added`: the quiz, both modes, results, review, deep links. `Changed`:
  `CardRendererProps.feedback`, layout-route routing, the `quizzes` state map,
  `ProgressBar.label`. `Notes`: what was deliberately left out (§9).
- **`GOING-FORWARD.md`** — record that the quiz landed and that the timed
  cert-wide mock is the queued follow-on.

## 12. Verification

1. `npm run check` — typecheck + lint + validate. **Warnings are failures**, so
   this also proves the intro-course `foundations` fix landed.
2. `npm run glossary` — no new ⚠️/❌ from the pilot bank's text.
3. `npm run build` — the deployed bundle must build.
4. `npm run dev`, then walk it as a learner in guest mode (no Supabase env):
   - DE Associate → Module 1: the quiz card shows a question count.
   - **Exam mode:** no feedback appears while answering; answers can be changed
     by scrolling back; submit is offered on the last slide; submitting with
     blanks warns first.
   - Get two wrong deliberately. On results: score, verdict, the two missed
     questions revealed with what you picked, and **"Read this in …"** opening
     the lesson player **on that exact card**.
   - Critically: after that deep link, confirm the lesson's progress bar has
     **not** jumped — only the landed card is newly viewed. This is the
     regression the §6 fix exists for.
   - Reload. The module card shows the best score and "Review 2 missed"; the
     review page lists both; the results URL still works.
   - **Practice mode** retake, answering one of the two correctly: it moves to
     "previously missed, now correct" while `missCount` still reflects the miss.
   - Start an exam, answer 4, exit (confirming the dialog), and resume it.
   - Confirm lesson bars, module and cert percentages are **identical** before
     and after all of the above — the quiz is optional.
   - Intro course Module 2 (`foundations`): confirm whatever the step-1 fix chose
     — either a 3-question quiz, or no quiz card at all.
   - Walk one ordinary lesson end to end: scroll snap, ↑/↓, Esc, progress bar,
     "Next lesson" — the `useActiveSnapIndex` extraction must change nothing.
   - Keyboard-only and a screen reader over the attempt and results screens.
5. With Supabase env set: sign in, confirm first-sign-in adoption carries local
   quiz progress up, confirm a row lands in `certifications_module_quiz` with
   `attempts` and `missed` populated, and confirm **no `draft` key is present in
   the synced row**.
