# CLAUDE.md

Guidance for Claude Code working in this repository.

## What this is

An **understanding-first** learning platform for professional certifications.
The goal is never "can the learner recall the answer" — it is "does the learner
understand *why* it works." Read `README.md` for the product, and
`docs/AUTHORING.md` before writing any lesson.

Stack: Vite · React 18 · TypeScript · Tailwind · React Router.

## Non-negotiables

- **Content is typed data, never JSX.** Lessons are `Lesson` objects
  (`Certification → Module → Lesson → Card[]`) under `src/content/`. No HTML, no
  components. Text fields support only `**bold**`, `*italic*`, `` `code` ``, `\n`.
- **`npm run check` before anything is "done"** (typecheck + lint + validate).
  **Warnings are failures here**, not noise — they encode the teaching
  philosophy (walls of text, missing recap, no interactive check).
- **Docs are updated in the same change.** `CONTENT.md`, `CHANGELOG.md`, and
  `README.md` must never lag the code. Drift is treated as a bug.
- **Data Analyst Associate is parked on purpose** (2/24). That is a decision, not
  a backlog item — do not resume it unless asked.
- **Teach, don't list.** If a card says "and also…", split it. One idea per card.

## The authoring loop

The agreed process for taking a certification from exam guide to authored
lessons. Work **a module at a time**, not a lesson at a time — lessons in a
module share vocabulary, diagrams, and a narrative arc.

1. **User** picks the certification and drops the official exam guide into
   `src_material/<provider>/<cert-id>/exam-guide.md`.
2. **Claude** maps exam sections → learning modules and scaffolds `planned()`
   lessons — use the `add-certification` skill.
3. **Claude researches the module.** Identify the claims that need verification,
   then do **targeted documentation lookups** — not bulk scraping. Save findings
   to `src_material/<provider>/<cert-id>/research/<module-id>.md` with source
   URLs, so lessons are traceable and refreshable.
4. **Claude presents the module's card-by-card outline. The user reviews it.**
   This is the review checkpoint — it happens *before* any lesson is written.
   The user's domain experience is the check on teaching quality here.
5. **Claude authors the whole module in one pass**, then runs `npm run check`
   and syncs the docs once.
6. Repeat for the next module.

### Why targeted lookups, not bulk scraping

Documentation is *reference* material, written in exactly the flat, exhaustive
voice this platform rejects. Loading lots of it pushes lessons toward listing
rather than teaching.

Docs earn their cost on a narrower job: **verifying volatile specifics that would
otherwise be stated plausibly and wrongly** — exact product names, index/model
types, privilege names, syntax, what is GA vs Preview. Assume **anything
version-specific may have changed since the model's knowledge cutoff**; Databricks
renames things often (Delta Live Tables → Lakeflow Spark Declarative Pipelines,
Workflows → Lakeflow Jobs). Verify names and mechanics; write the teaching from
understanding.

## Source material

- Lives in `src_material/<provider>/<cert-id>/`; content maps back to its
  objectives.
- Convention: `exam-guide.md` in a per-cert folder, plus `research/` notes.
  *(Three older certs are still extensionless PDF dumps containing ligature
  artifacts — `ﬁ`, `ﬂ`. Normalize before relying on verbatim quote matching.)*
- `mcq.examObjective` should quote the official outline. Do not invent one.

## Skills

- `add-certification` — scaffold a new cert (modules, `planned()` lessons, registry).
- `author-lesson` — write one lesson as typed card data.
- `sync-content-docs` — run the gate and update `CONTENT.md` / `CHANGELOG.md` / `README.md`.

## Also read

- `GOING-FORWARD.md` — open improvements, flags, and the current build order.
- `CERTIFICATION-ROADMAP.md` — which certs, and why, in what order.
- `docs/ARCHITECTURE.md` — the content/UI split and extension points.
