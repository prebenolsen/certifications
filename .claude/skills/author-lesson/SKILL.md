---
name: author-lesson
description: Write or complete a lesson in this certifications platform — authoring a Lesson object as typed card data (concept/analogy/diagram/example/scenario/mistake/flashcard/truefalse/mcq/summary/recap), wiring it into the certification, validating, and syncing docs. Use when asked to add, write, flesh out, or complete a lesson, turn a `planned()` placeholder into real content, or cover an exam objective.
---

# Authoring a lesson

A lesson is a typed `Lesson` object — an ordered `Card[]` — under
`src/content/<provider>/<cert-id>/lessons/<lesson-id>.ts`. **Content is data, not
code:** no JSX, no HTML. You are teaching, not listing.

Read these first (they are the source of truth — do not restate them from memory):
- `docs/AUTHORING.md` — philosophy, the lesson blueprint, card-type selection, templates.
- `src/types/content.ts` — the exact shape of every card and the `Lesson`/`Module` types.
- An existing complete lesson as a style reference, e.g.
  `src/content/databricks/data-engineer-associate/lessons/auto-loader.ts`.
- `src_material/<provider>/…` — the official exam guide; map content back to its objectives.

## Teaching philosophy (non-negotiable)

1. **Intuition first, terminology second, details last.**
2. **One idea per card.** If you write "and also…", split the card. The validator
   warns on any text field over 700 chars.
3. For each concept answer: *What is it? Why does it exist? When is it used? How
   does it work? What's the common misconception? How does it relate to what I
   already know?*
4. Choose card types per concept, not by formula — analogies, diagrams, worked
   examples, and `mistake` cards mined from the exam's wrong answers.
5. Every interactive check ties back to an official exam objective (`examObjective`
   on `mcq`), and where useful a real day-at-work situation (`atWork` on `scenario`).

## The blueprint that works

Hook (`scenario`, eyebrow "Why this matters") → `analogy` → `concept`(s) →
`diagram` where a picture teaches faster → interactive `truefalse`/`mcq` checks
interleaved → an exam-style `mcq` with `examObjective` → one `flashcard` for the
fact worth drilling → closing `recap`. Aim for ~10–15 cards ≈ 8–10 minutes.

After revealing a `flashcard`'s answer the learner self-grades recall ("I knew
this" / "I didn't know this"); that result is recorded through the same progress
channel as quizzes but tracked *separately* from quiz accuracy (flashcards are
not in `INTERACTIVE_CARD_TYPES`). So write flashcards as clean recall prompts of
a single fact — never a trick question — and still include a real `mcq`/`truefalse`
for the objective check the validator requires.

Requirements the validator enforces for a `complete` lesson: has cards, unique card
ids, at least one interactive card (`mcq`/`truefalse`), and **ends with a `recap`**.
It warns under 6 cards. Diagram cards need either an inline `spec` (preferred:
`flow` / `compare` / `layers`) or a registered `diagramId`. See the diagram section
of `docs/AUTHORING.md` before adding a bespoke SVG.

Text fields support only `**bold**`, `*italic*`, `` `code` ``, and `\n`. Nothing else.

## Steps

1. Confirm the target: which certification, module, and exam objective. Find the
   lesson's `planned()` placeholder in the cert's `index.ts` (or decide where it slots).
2. Write `src/content/<provider>/<cert-id>/lessons/<lesson-id>.ts` exporting a
   `Lesson` (`status: 'complete'`). The `id` must be unique **within the
   certification** (progress is keyed `certId/lessonId`) and is used in the URL.
   Add a top doc comment stating which exam section/objective it maps to.
3. Wire it into the module's `lessons` array in the cert's `index.ts`, replacing the
   `planned(...)` entry with the imported lesson.
4. Run `npm run check` (typecheck + lint + validate). Fix every error **and every
   warning** — warnings are teaching-philosophy violations, which are the point.
5. Sync the docs in the same change — see the `sync-content-docs` skill: update
   `CONTENT.md` (flip the row to ✅, update card/check counts and the summary line),
   `CHANGELOG.md`, and `README.md` if anything structural changed.

Do not flip a lesson to `complete` until `npm run check` is clean and the docs match.
