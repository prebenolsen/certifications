# Architecture

This document explains *how the app is put together* and, more importantly, *why*
— so the next person (or the next lesson author) can extend it confidently.

## Guiding principle: content is data, not code

The single most important decision in this codebase: **learning content is
described by typed data objects, never by JSX.** A lesson author writes a
`Lesson` object — a list of `Card` objects — and the UI layer knows how to render
each card type. This keeps three things true:

1. Authoring a lesson requires no React knowledge.
2. Content is easy to validate, search, count, and eventually load from a CMS or
   database without rewriting components.
3. The visual design can change globally without touching a single lesson.

```
Certification
  └─ Module (1..n)
       └─ Lesson (1..n)
            └─ Card[] (a discriminated union on `type`)
```

All of these are defined in [`src/types/content.ts`](../src/types/content.ts).

## The card system (the core abstraction)

A `Card` is a **discriminated union** keyed on `type`
(`concept | analogy | diagram | example | scenario | mistake | flashcard |
truefalse | mcq | summary | recap`).

Rendering is table-driven:

- Each type has a **renderer** component under
  [`src/components/cards/`](../src/components/cards/).
- [`registry.tsx`](../src/components/cards/registry.tsx) maps `type → renderer`.
- [`CardView`](../src/components/cards/registry.tsx) looks up the renderer for a
  card and delegates.

**To add a new card type:** add a variant to the union, write a renderer, and add
one line to the registry. The player, progress system, and pages need no changes.
This is the primary extension seam of the whole app.

Renderers receive `CardRendererProps` (`src/components/cards/types.ts`): the card
plus an optional `onAnswered(correct, chosen?)` callback. Presentational cards
ignore it; interactive cards (`mcq`, `truefalse`) call it once so the player can
record the result. `flashcard` also calls it — with the learner's self-graded
recall ("I knew this" → `true`) — so competence is captured, but it is **not** in
`INTERACTIVE_CARD_TYPES`, so self-report never dilutes objective quiz accuracy.

Three more optional props let the quiz reuse the same two renderers instead of
forking them:

- **`feedback`** — `'immediate'` (the default, and today's in-lesson behaviour:
  answer, lock, reveal), `'deferred'` (accept the answer, reveal nothing, lock
  nothing — exam mode, where *selection is the answer*), or `'revealed'` (force
  the answered state, read-only — the results screen).
- **`value` / `onValueChange`** — a controlled selection, for a caller that owns
  the answer buffer.

One tri-state rather than two booleans, because the three states are mutually
exclusive. The payoff is that the prop enabling exam mode also renders the
results screen: `feedback="revealed"` with `value={response.chosen}` produces
"here is the question, here is what you picked, here is why it was wrong" with no
new markup. It matters that this is one seam and not two components — a wrapper
cannot intercept the reveal, because `McqRenderer` recolours *every* option on
submit, so hiding the feedback panel would still leak the answer through colour.

### Why a registry instead of a big `switch`?

A registry keeps each renderer independent and colocated with its own state, and
makes "what card types exist" a single readable object. A `switch` would centralize
knowledge of every card in one component and grow unwieldy.

## Diagrams

Diagrams come in two flavours, and content stays JSX-free either way:

1. **Data-driven specs (preferred).** A diagram card declares an inline
   `DiagramSpec` — `flow` (pipeline), `compare` (two panels), or `layers`
   (nested containment) — rendered by shared primitives in
   [`SpecDiagram.tsx`](../src/components/diagrams/SpecDiagram.tsx). They are
   HTML/Tailwind-based, so they reflow on small screens for free, and adding a
   diagram requires **no new component and no registry edit**. This removed the
   biggest per-lesson authoring cost.
2. **Custom SVG components** for pictures the primitives can't express,
   referenced by a string `diagramId` and resolved through
   [`src/components/diagrams/registry.tsx`](../src/components/diagrams/registry.tsx).

Either way: information-first (boxes, arrows, labels) — a diagram that *teaches*
beats polished artwork.

## The Card Player (the learning experience)

[`CardPlayer`](../src/components/player/CardPlayer.tsx) is the vertical,
one-card-at-a-time flow — the "learning principles of TikTok" applied to studying:

- **Scroll-snap** (`.card-scroller` / `.card-snap` in `index.css`) centers exactly
  one card at a time; works with touch, wheel, and keyboard.
- A throttled **scroll-position** tracker picks the card nearest the viewport
  midpoint to drive the progress bar, mark cards viewed, and detect lesson
  completion at the last card. Deliberately not an `IntersectionObserver`: a
  card taller than the viewport never reaches a visibility threshold.
- **Keyboard**: ↑/↓ and PageUp/PageDown move between cards; Esc exits.
- The player is rendered **outside the standard `Layout`** (see `App.tsx`) so it
  can own the full viewport with its own header/footer chrome.

## Progress, quizzes & persistence

[`ProgressProvider`](../src/context/ProgressContext.tsx) stores per-lesson
progress (`viewedCards`, `answers`, `completed`) and persists to `localStorage`
under `certifications.progress.v2`. Progress keys are scoped as
`certId/lessonId`, so lesson ids only need to be unique *within* one
certification (two certs can both have an `auto-loader` lesson). Legacy v1
state (bare lesson-id keys) is migrated on first load by resolving each lesson
id to its certification. Storage reads are defensive — corrupt or unavailable
storage falls back to an empty state rather than crashing.

Quiz state sits in **two sibling maps** on the same provider, never folded into
lesson progress:

| Map | Key | Holds | Synced? |
|-----|-----|-------|---------|
| `quizzes` | `certId/moduleId` | Attempt history (capped at 10), the one unsubmitted `draft`, `bestScore` | **No** — local only |
| `knowledge` | `certId/moduleId/questionId` | What the learner got wrong: provenance, a text snapshot, `failedCount`, `needsReview` | Yes, `certifications_quiz_knowledge` |

Drafts and attempt history stay local on purpose: a half-finished exam should not
surface on another device, and a per-selection cloud write would be chatty. What
*is* worth carrying across devices is the durable record of what you got wrong,
so `finishQuizAttempt` derives one knowledge record per answered question and
sends a single batched upsert. A later correct answer sets `needsReview: false`
but **keeps the row**, so "you have missed this twice" stays true and the review
surface is a history rather than a snapshot of the last attempt.

The hard invariant: `useLessonStats`, `useModuleStats`, `useCertStats` and
`moduleStatus()` do not read either map, so "the quiz is optional" holds
structurally rather than by convention. Content status can never depend on
learner results.

Derived, learner-facing stats (lesson %, module %, quiz accuracy, cert-wide
completion) are computed in [`src/hooks/useStats.ts`](../src/hooks/useStats.ts),
keeping presentation logic out of the persistence layer.

## Routing & pages

React Router drives the learning and quiz routes plus a fallback (`src/App.tsx`):

| Route | Page | Purpose |
|-------|------|---------|
| `/` | `HomePage` | Certification catalog — **available** and **coming soon** shelves — plus overall progress |
| `/cert/:certId` | `CertificationPage` | Module grid |
| `/cert/:certId/module/:moduleId` | `ModulePage` | Lesson list |
| `/cert/:certId/module/:moduleId/lesson/:lessonId` | `LessonPage` | Full-screen player |
| `/cert/:certId/module/:moduleId/quiz` | `QuizIntroPage` | Mode picker, or why there is no quiz yet |
| `…/quiz/attempt?mode=practice\|exam` | `QuizAttemptPage` | The attempt |
| `…/quiz/results/:attemptId` | `QuizResultsPage` | Score + every question revealed |
| `/cert/:certId/quiz/struggles` | `QuizIntroPage` | Certification-wide targeted review |
| `…/struggles/attempt?mode=review`, `…/struggles/results/:attemptId` | Quiz pages | The same two screens, cert-wide |

Mode is a `?mode=` query param rather than a path segment: it is an option on an
attempt, not a resource, and it gives one obvious place to reject a missing or
garbage value rather than silently starting an exam. Results are keyed by
`:attemptId` rather than "latest", so a refresh after starting a new attempt
cannot show the wrong thing and attempt history stays linkable.

Pages look content up through [`src/content/registry.ts`](../src/content/registry.ts),
which is also where a new certification is registered. The registry additionally
derives **module status** and **certification status** from lesson statuses (so
neither can drift from reality) and computes the **next playable lesson** for
the player's end-of-lesson hand-off.

Certification status is what splits the catalog. `availableCertifications` holds
the fully authored tracks; `upcomingCertifications` holds everything else, shown
on the home page under **Coming soon** with a dashed card that reports *lessons
written* rather than the learner's progress. Nothing marks a track by hand —
authoring the last lesson moves it across, and `npm run validate` prints the
split so a shelf change is visible in the gate.

## Quizzes and review

Two levels, both assembled from content the lessons already contain — there is no
separate question bank:

- **A module quiz** — `buildQuizPool(certId, moduleId)` collects every `mcq` /
  `truefalse` card from the module's non-`planned` lessons. `flashcard` is
  excluded and must stay excluded: it is self-graded recall. Below `QUIZ_MIN`
  questions the module has no quiz and `ModuleQuizCard` renders nothing.
- **Certification-wide targeted review** — draws only the questions in
  `knowledge` still marked `needsReview`, taking the **most-failed first** and
  then shuffling only what was taken — so it targets the weak spots without the
  order becoming predictable.

The learner picks **practice** (feedback per question) or **exam** (nothing
revealed until the end, and answers stay changeable) per attempt. Order is
shuffled once from a stored `seed` and the attempt persists its `questionIds`, so
results replay the exact order served; a bare `Math.random()` in a component
would reshuffle on every answer, which is a correctness bug rather than a
preference. A fixed content order is also wrong — learners memorise positions.

Question ids are `g:<lessonId>:<cardId>`, which works because lesson ids are
unique within a cert and card ids within a lesson. Keying on the *lesson* rather
than the module means moving a lesson between modules preserves a learner's
review history. It also makes **card ids a stable interface**: renaming one
orphans stored review records, which the results screen then falls back to a text
snapshot for rather than dropping the row.

The attempt is one question at a time inside the normal `Layout`, not the
lesson's scroll-snap player. Assessment wants an explicit step between questions,
and `CardPlayer`'s contract is `lesson: Lesson` — a quiz drawn from five lessons
has no lesson id, so reusing it would mean writing synthetic rows into lesson
progress. The two surfaces share what matters instead: the same renderers, via
the `feedback` prop above.

## Content authoring & validation

Authoring is documented in [`AUTHORING.md`](AUTHORING.md) (philosophy, lesson
blueprint, templates). Shared helpers live in
[`src/content/authoring.ts`](../src/content/authoring.ts).

[`scripts/validate-content.ts`](../scripts/validate-content.ts) (`npm run
validate`, part of `npm run check`) walks every certification and enforces what
the type system can't: unique ids at every level, MCQ answers that exist,
registered diagram ids, well-formed flow specs — plus teaching-philosophy
warnings (walls of text, complete lessons without an interactive check or a
final recap).

## Styling

Tailwind CSS with centralized design tokens in `tailwind.config.js` (semantic
colors: `ink`, `surface`, `brand`, `accent`, `good/warn/bad`). This means the app
can be re-themed from one place. `prefers-reduced-motion` is respected globally in
`index.css`.

## Text markup

Content text supports a tiny, safe inline subset rendered by
[`RichText`](../src/components/ui/RichText.tsx): `**bold**`, `*italic*`,
`` `code` ``, and newlines. No raw HTML is ever interpreted, so content can't
inject markup.

## Directory map

```
src/
  types/content.ts            # the content model (start here)
  content/                    # all learning content, as typed data
    registry.ts               #   certification lookup, derived module + cert status
    authoring.ts              #   shared helpers for content authors
    glossary.ts               #   every term, defined once
    databricks/
      intro-data-engineering/ #   4-module course (no exam)
      data-analyst-associate/ #   9-module certification (index.ts + lessons/)
      data-engineer-associate/#   7-module certification
      data-engineer-professional/
      generative-ai-engineer-associate/
    github/copilot/           #   GH-300
  components/
    cards/                    # card renderers + registry + shared frame + feedback
    diagrams/                 # SpecDiagram primitives + custom SVGs + registry
    quiz/ModuleQuizCard.tsx   # module-page quiz entry (owns its availability)
    player/CardPlayer.tsx     # the vertical learning flow
    layout/                   # app shell, progress bar, badges
    ui/                       # RichText, CodeBlock, GlossaryMark
  context/                    # ProgressContext (progress + quiz), AuthContext
  lib/
    quiz.ts                   # pool assembly, ids, scoring, thresholds (UI-free)
    random.ts                 # seeded PRNG + shuffle, so an attempt is replayable
    glossary.ts, supabase.ts
  hooks/useStats.ts           # progress-derived stats
  pages/                      # Home, Certification, Module, Lesson, Quiz*, NotFound
  App.tsx / main.tsx          # routing + bootstrap
scripts/
  validate-content.ts         # content validator (npm run validate)
  glossary-report.ts          # term coverage → docs/GLOSSARY.md
supabase/                     # schema + RLS; 03 is the re-runnable pattern
docs/AUTHORING.md             # how to write lessons (templates included)
```
