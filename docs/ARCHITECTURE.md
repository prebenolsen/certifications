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
plus an optional `onAnswered(correct)` callback. Presentational cards ignore it;
interactive cards (`mcq`, `truefalse`) call it once so the player can record the
result. `flashcard` also calls it — with the learner's self-graded recall ("I
knew this" → `true`) — so competence is captured, but it is **not** in
`INTERACTIVE_CARD_TYPES`, so self-report never dilutes objective quiz accuracy.

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
- An **IntersectionObserver** tracks the active card to drive the progress bar,
  mark cards viewed, and detect lesson completion at the last card.
- **Keyboard**: ↑/↓ and PageUp/PageDown move between cards; Esc exits.
- The player is rendered **outside the standard `Layout`** (see `App.tsx`) so it
  can own the full viewport with its own header/footer chrome.

## Progress & persistence

[`ProgressProvider`](../src/context/ProgressContext.tsx) stores per-lesson
progress (`viewedCards`, `answers`, `completed`) and persists to `localStorage`
under `certifications.progress.v2`. Progress keys are scoped as
`certId/lessonId`, so lesson ids only need to be unique *within* one
certification (two certs can both have an `auto-loader` lesson). Legacy v1
state (bare lesson-id keys) is migrated on first load by resolving each lesson
id to its certification. It is deliberately backend-free; swapping in a remote
store later means changing only this file. Storage reads are defensive —
corrupt or unavailable storage falls back to an empty state rather than
crashing.

Derived, learner-facing stats (lesson %, module %, quiz accuracy, cert-wide
completion) are computed in [`src/hooks/useStats.ts`](../src/hooks/useStats.ts),
keeping presentation logic out of the persistence layer.

## Routing & pages

React Router drives four routes plus a fallback (`src/App.tsx`):

| Route | Page | Purpose |
|-------|------|---------|
| `/` | `HomePage` | Certification catalog + overall progress |
| `/cert/:certId` | `CertificationPage` | Module grid |
| `/cert/:certId/module/:moduleId` | `ModulePage` | Lesson list |
| `/cert/:certId/module/:moduleId/lesson/:lessonId` | `LessonPage` | Full-screen player |

Pages look content up through [`src/content/registry.ts`](../src/content/registry.ts),
which is also where a new certification is registered. The registry additionally
derives **module status** from lesson statuses (so it can never drift from
reality) and computes the **next playable lesson** for the player's
end-of-lesson hand-off.

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
    registry.ts               #   certification lookup, derived module status
    authoring.ts              #   shared helpers for content authors
    databricks/
      data-analyst-associate/ #   9-module certification (index.ts + lessons/)
      data-engineer-associate/#   7-module certification (index.ts + lessons/)
  components/
    cards/                    # card renderers + registry + shared frame + feedback
    diagrams/                 # SpecDiagram primitives + custom SVGs + registry
    player/CardPlayer.tsx     # the vertical learning flow
    layout/                   # app shell, progress bar, badges
    ui/                       # RichText, CodeBlock
  context/ProgressContext.tsx # localStorage progress (per certification)
  hooks/useStats.ts           # progress-derived stats
  pages/                      # Home, Certification, Module, Lesson, NotFound
  App.tsx / main.tsx          # routing + bootstrap
scripts/validate-content.ts   # content validator (npm run validate)
docs/AUTHORING.md             # how to write lessons (templates included)
```
