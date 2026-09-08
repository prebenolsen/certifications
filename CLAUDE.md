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
- **Define every term the first time the learner meets it.** See below — this is
  the rule that gets broken most often and costs the most when it does.

## Defining terms

**A learner who meets an undefined term stops learning and starts guessing.**
This is not a style preference; it is the fastest way to lose someone, and it is
invisible to the author, who already knows what the word means.

The rule: **the first time a term appears anywhere a learner can reach, it is
defined — clearly, in one sentence, in place.** Not "explained later in the
module." Not "obvious from context." Not defined in a *different* certification.
Every certification has to stand on its own.

This was not hypothetical. *Lakeflow* appeared **51 times across 20 files** —
"Lakeflow Jobs", "Lakeflow Connect", "Lakeflow pipelines" — and the content never
once said what **Lakeflow** is. A learner was expected to infer an entire product
family from a prefix.

### Track terms literally

The glossary is real data, not a convention to remember:

- **`src/content/glossary.ts`** — every term, defined once, with `aliases`
  (former product names, abbreviations), an `introducedIn` list of the lessons
  that *properly teach* it, and a `source` for anything version-specific.
- **`npm run glossary`** — walks every certification in reading order, finds
  where each term is first used, and compares that to where it is introduced.
  Writes **`docs/GLOSSARY.md`**. Statuses: `✅` introduced before use ·
  `🔗` introduced in a prerequisite cert (`Certification.assumes`) ·
  `⚠️` used before it is introduced · `❌` used and never introduced.
- **`RichText`** underlines known terms wherever they appear and shows the
  definition on click — once per card, so repeated mentions do not become noise.
  Nothing is marked up in the content; it happens at render time.

**When authoring, run `npm run glossary` alongside `npm run check`.** A new `❌`
is a bug you just introduced. A new `⚠️` means either move the definition earlier
or gloss the term at its first mention.

### What goes in the glossary

Proper nouns and distinctive multi-word phrases only — "Lakeflow Pipelines",
"materialized view", "Liquid Clustering". **Not** bare common words ("flow",
"view", "sink"): they match ordinary prose and turn a card into a field of
underlines. Define those inside the lesson that needs them.

Set `introducedIn` **honestly**. A lesson that *mentions* a term does not
introduce it. Leaving it off and letting the report say "nothing introduces this"
is the useful outcome; a false ✅ is worse than no entry at all.

### Watch for product families

Vendors group products under an umbrella and then only ever use the compound
names. Databricks does this constantly. When you meet one, **check the vendor's
own navigation** — if it is a category in their docs with a *Concepts* page, it
is a thing the learner must be told about, not a prefix to skip past.

Lakeflow is the worked example: an umbrella over **Lakeflow Connect**
(ingestion), **Lakeflow Pipelines** (transformation), **Lakeflow Designer**
(visual authoring), and **Lakeflow Jobs** (orchestration). Its concepts page
carries a vocabulary of its own — pipeline, flow, streaming table, materialized
view, sink, expectation, AUTO CDC — every one of which is a term the learner
meets and therefore a term that needs defining.

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
   **and `npm run glossary`**, adds any newly introduced terms to
   `src/content/glossary.ts`, and syncs the docs once.
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

## Commands

- `npm run check` — typecheck + lint + validate. Warnings are failures.
- `npm run glossary` — term-coverage report → `docs/GLOSSARY.md`.
- `npm run dev` — dev server on http://localhost:5173.

## Also read

- `docs/GLOSSARY.md` — which terms are defined, and where they are still missing.
- `GOING-FORWARD.md` — open improvements, flags, and the current build order.
- `CERTIFICATION-ROADMAP.md` — which certs, and why, in what order.
- `docs/ARCHITECTURE.md` — the content/UI split and extension points.
