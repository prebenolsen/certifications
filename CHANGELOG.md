# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/) and this
project adheres to [Semantic Versioning](https://semver.org/) (`Major.Minor.Patch`).

**How versions are decided here:**

- **Major** — large new features or major architectural changes.
- **Minor** — new certification content, learning modules, teaching methods, or
  UI sections.
- **Patch** — bug fixes, wording/accessibility/UX improvements, refactors, and
  fixes users may not notice.

---

## [Unreleased]

## [1.8.0] — 2026-09-09

### Added

- **End-of-module quizzes, and a durable record of what you got wrong.** Every
  module with at least 3 interactive checks gains an optional quiz assembled
  from those checks — no separate question bank, so authoring a lesson well is
  what makes a good quiz. The learner picks **practice** (feedback after every
  question) or **exam** (nothing revealed until the end, and answers stay
  changeable until then) per attempt. Order is shuffled from a stored seed, so
  positions can't be memorised and the results screen can replay the exact
  order served.
- **A results screen that teaches.** Every question is re-rendered with what the
  learner picked, why it was wrong, the authored per-option feedback, and a link
  into the lesson that teaches the answer. Below 5 questions it suppresses the
  pass/fail verdict instead of pretending a 3-question score means something.
- **Targeted review.** Missed questions collect per certification, hardest
  first, and a later correct answer retires one — while keeping the record, so
  "you have missed this twice" stays true. Surfaced from the certification page
  and from the module quiz card, and synced for signed-in learners.
- **Real quiz navigation** — go back, skip a question for later, or say "I don't
  know" and have it come back later.
- `CardRendererProps.feedback` (`'immediate' | 'deferred' | 'revealed'`) plus
  controlled `value` / `onValueChange`. One prop, two features: it is what
  enables exam mode *and* what renders the results screen, with no new markup.
- `src/lib/quiz.ts` (pool assembly, ids, scoring, thresholds — UI-free) and
  `src/lib/random.ts` (seeded PRNG + shuffle, so an attempt is replayable).
- A validator rule: a **complete** module whose interactive pool is under 3 now
  warns, and the summary reports how many complete modules can fill a quiz.
  `npm run validate` prints `Module quizzes: 31/31 … from 175 question(s)`.
- One more interactive check in *Delta Lake* (intro course) — an MCQ on why a
  rollback works, which is what took the `foundations` module over the line.

### Changed

- `ModuleQuizProgress` no longer carries its own `missed` map. Missed questions
  were being recorded twice, in two shapes, and the results screen had to sniff
  which one it had received at runtime. `knowledge` is now the single record.
- Quiz attempt history and unsubmitted drafts are explicitly **local-only**;
  what syncs is the record of what you got wrong. Documented, not incidental.
- `ReviewRef` is a real field on `McqCard` / `TrueFalseCard` in
  `src/types/content.ts`, rather than being read off a `Card` with a cast to a
  field the content model never declared.
- The Supabase quiz table moved out of `01_schema.sql` / `02_policies.sql` into
  **`supabase/03_quiz_knowledge.sql`**, written with `drop policy if exists` so
  it is re-runnable and can be applied on its own.
- `docs/ARCHITECTURE.md` gains a *Quizzes and review* section and a fuller
  routing table; `docs/AUTHORING.md` gains *Your checks are also the module
  quiz*.

### Fixed

- **Signing in destroyed your quiz history.** Hydration reset the `quizzes` map
  to `{}` and the next save persisted the empty version, so attempts and best
  scores were gone for good. Local quiz state now survives sign-in, and a
  first-time sign-in adopts guest struggle records and pushes them up — the same
  all-or-nothing rule lesson progress already used.
- **Cloud sync never actually wrote anything.** `upsertCloud`, `deleteCloud` and
  the new `deleteQuizKnowledge` fired their queries as `void supabase.from(…)…`,
  but a postgrest-js builder is a **thenable, not a Promise** — it issues the
  request inside `then()`, so a bare `void` built the query and dropped it,
  silently and with no error anywhere. Verified against the installed
  `@supabase/postgrest-js@2.110.0`: the `void` form makes **zero** HTTP calls,
  the awaited form makes one. So for signed-in learners, lesson progress had
  never reached Supabase despite the UI reporting sync. All three are now
  `async`/awaited and log on failure.
- **Signing in offline, or with the quiz table missing, destroyed local
  progress.** A failed cloud read returned an empty map (postgrest-js reports
  network failures as `error`, it does not throw), that empty map replaced local
  state, and the writer effect persisted the emptiness. A failed read now keeps
  local data and skips cloud writes entirely, rather than treating "I could not
  read" as "there is nothing there".
- **Anything done during the sign-in fetch window was dropped.** The writer
  effect skipped `saveLocal` until hydration finished, then hydration overwrote
  state from disk. localStorage — the always-safe store — is now written
  unconditionally; only the cloud diff waits for hydration.
- **First-sign-in adoption is decided per map.** Deciding across both meant one
  populated map suppressed adoption of the other, overwriting the learner's local
  copy of it with nothing — which the cloud-sync bug above made the *normal*
  case, since knowledge rows synced while lesson rows never did.
- **The targeted review drew a random slice, not your worst questions.** The
  struggle list was sorted by failure count and then reshuffled wholesale before
  slicing to 12, so with 30 unresolved questions you got a random 12. It now
  takes the most-failed first and shuffles only those, so the order stays
  unpredictable without losing the targeting.
- **A stray click in exam mode locked in an empty answer.** Because selection is
  the answer there, deselecting your last option banked a response that scored
  wrong while still counting as answered — hiding "Skip for later" and "I don't
  know", and letting you reach the results screen with a question you meant to
  revisit. Clearing a selection now returns the question to unanswered.
- **`resetAll` left cloud quiz rows in place**, so cleared progress came back on
  the next sign-in. It now deletes them, and so does `resetModuleQuiz`. (Note:
  the reset API still has no UI — `resetAll` and `resetLesson` were already
  unwired before this change.)
- **The quiz's Supabase policies could never be applied to an existing
  deployment.** They had been appended to `02_policies.sql`, which is
  single-run-only — `create policy` has no `if not exists` — so re-running it
  failed on the policies already there, leaving RLS enabled with no policies and
  every quiz read and write silently denied. Now in a re-runnable `03`, and the
  client logs instead of failing quietly.
- **Glossary terms weren't underlined anywhere in a quiz.** The quiz had its own
  copies of the MCQ and true/false UI, and `RichText` only marks terms inside
  `CardFrame`'s `GlossaryScope`. Both copies are gone; the quiz uses the real
  renderers, which also restores per-option feedback, exam objectives, the
  "Select all that apply" hint, the square-vs-round multi-select affordance, and
  `AnswerFeedback`'s live region.
- Modules with no quiz no longer advertise one. The card is hidden below 3
  questions instead of linking to a page that says the quiz doesn't exist, and
  "Learn what you struggle with" only appears once something has been missed.
- Two dead links: the results screen built `/cert/:certId/module/` with an empty
  module id in targeted-review mode, 404ing both its back links.
- "Skip for later" is disabled when there is nothing to skip to, instead of
  silently doing nothing on the last unanswered question.
- A thin-pool module quiz redirects to its intro page, which explains why there
  is no quiz yet, rather than rendering a 404 for a module that plainly exists.
- Duplicated `crashing.` line in `docs/ARCHITECTURE.md`, and its long-standing
  claim that an `IntersectionObserver` tracks the active card — it is a
  scroll-position tracker, deliberately, because a card taller than the viewport
  never reaches a visibility threshold.

### Notes

Deliberately out of scope, and queued in `GOING-FORWARD.md`: authored question
banks on top of the generated pool, `?card=` deep links to the exact teaching
card, quiz stats in `useStats.ts`, and the timed cert-wide mock exam.

## [1.7.0] — 2026-09-09

### Added

- **A course, not a certification: *Introduction to Data Engineering with
  Databricks* — 4 modules, 10 lessons, 103 cards, ~62 minutes.** Every other
  track here assumes a working data engineer. This one assumes nothing, and
  answers the question the others skip: *what are all these things, and how do
  they fit together?* It is the front door for someone who has met none of the
  components, and the shortest path to the rest of the platform making sense.
- **Reading order carries the teaching.** The job before the vendor (lesson 1
  names no product at all), the problem before the product (warehouse and lake
  before lakehouse), storage and governance before any pipeline, and a capstone
  that traces one real request — *"how many orders shipped yesterday, by
  region?"* — through every component in the course. No lesson names a component
  that a later lesson is responsible for introducing.
- **A capstone lesson type this platform did not have.** *One pipeline, end to
  end* introduces nothing new. Its whole job is assembly: JSON files landing in
  storage, out to a number on a dashboard, with the component doing each step
  named — and a card on what was true the whole way through (Delta under every
  table, Unity Catalog naming and permissioning them, DBUs on the meter).
- **21 glossary terms now introduced by the intro course**, each in the lesson
  that first uses it: Databricks, Apache Spark, Data Intelligence Platform,
  lakehouse, Delta Lake, Unity Catalog, data lineage, DBU, SQL warehouse, the
  five Lakeflow entries, Auto Loader, medallion architecture, Databricks SQL,
  AI/BI dashboard, Genie space, MLflow and Mosaic AI Model Serving. `npm run
  glossary` reports **21 ✅ and no ⚠️/❌** for the course.

### Changed

- **`Certification.examFacts` is now optional**, because a course has no exam to
  sit and inventing "0 questions" would have put a meaningless number on the
  home card. When it is absent the home card shows **lessons and minutes**
  instead of questions and minutes, and the certification header links to
  "Official documentation" rather than "Official exam guide".
- The intro course is listed **first** in the registry, so the platform now
  opens with the track that assumes the least.

### Notes

- **Scope was held deliberately.** Photon, streaming tables vs materialized
  views, Delta Sharing, Marketplace, Lakehouse Federation, Asset Bundles and
  privilege names are all absent: they belong to the certification tracks, and
  putting them here would have turned a 62-minute orientation into a fifth cert.
  The audience for this course is broader than the platform's usual reader, so
  generic concepts (batch vs streaming, warehouse, lake) are defined inline
  rather than added to the glossary, which stays scoped to vendor vocabulary.

---

## [1.6.0] — 2026-09-09

### Added

- **Databricks Certified Data Analyst Associate, authored in full — 30 lessons,
  341 cards, all 10 official sample questions.** The certification had been
  parked at 2/24 since it was scaffolded; it is now complete across all nine
  exam sections, and the two placeholder lessons were kept and extended rather
  than replaced.
- **A thorough Unity Catalog breakdown, early.** *Unity Catalog: the layer
  everything else assumes* is the second lesson of the cert: what it holds
  (metastore ⊃ catalog ⊃ schema ⊃ object), securables and ownership, the fact that
  reading one table takes **three** grants (`SELECT` plus `USE CATALOG` and
  `USE SCHEMA`), inheritance to tables that do not exist yet, and the lineage,
  audit and permission-filtered search that come for free. Unity Catalog is
  named in five of the nine exam sections and nothing else in the certification
  parses without it; no lesson anywhere in the platform had taught it as a
  subject in its own right.
- **An orientation lesson for analysts** — *What Databricks is, for an analyst*.
  Written for someone who can already write a join: the product in one sentence,
  the lakehouse, the vendor's names for the workspace, SQL editor and SQL
  warehouse, and the DBU. Nothing in it is an exam question; everything in it is
  assumed by every exam question.
- Six lessons beyond the original scaffold, because the exam outline needed
  them: **Where your SQL actually runs** (warehouses + the Assistant),
  **Filtering & sorting**, **Creating tables of your own**, **Choosing a chart
  that communicates**, **Sharing a dashboard, and keeping it fresh**, and
  **Alerts**.
- **Verified product naming.** Targeted documentation lookups before authoring,
  saved to `src_material/.../research/platform-and-naming.md`: *Genie spaces* are
  now **Genie Agents**, the *Databricks Assistant* is now **Genie Code**, and
  materialized-view and streaming-table refreshes run on **serverless pipelines,
  not your SQL warehouse**. Lessons teach the exam guide's name and note the
  current one.
- **17 new glossary terms** — Databricks SQL, SQL warehouse, Photon, Catalog
  Explorer, data lineage, dynamic view, query profile, Delta Sharing,
  Marketplace, Lakehouse Federation, AI/BI dashboard, Genie space, trusted
  asset, Databricks Assistant, Data Intelligence Engine — and `introducedIn`
  updated across the existing terms the analyst cert now teaches.

### Fixed

- The new terms exposed three genuine gaps in the older certifications: **Photon**
  and **Catalog Explorer** were named but never explained in the Data Engineer
  Associate, and **Databricks SQL** and **Catalog Explorer** in the Professional.
  Each now carries a one-line definition at first mention.

---

## [1.5.2] — 2026-09-09

### Changed

- **Wrote down the house style.** The repo said *what* to teach and never said
  *how it should read*. It now does: `CLAUDE.md` gains a **How it should read**
  section and `docs/AUTHORING.md` a fuller **Writing style** one — an
  experienced engineer explaining something to another engineer, shaped as
  *concept → explanation → example or analogy → certification takeaway*, with
  each idea said once and no padding.
- Rules that come with it: get to the point, short paragraphs, the important
  *why* over the definition, examples that are concrete and short, analogies
  only when they genuinely clarify (and abandoned when they outgrow the
  concept), depth prioritized core → distinctions → practical use →
  certification detail → misconceptions, and an explicit contrast whenever two
  concepts are commonly confused.
- Added the sentence-level test authors should apply before writing: *if I
  removed this, would the reader lose understanding, context, or
  certification-relevant knowledge?* If not, it does not go in. Plus a list of
  phrases never to write ("It is important to note that…", "Let's dive into…").
- **Clarified lesson length.** The prose in a lesson should read in 2–5 minutes;
  `estimatedMinutes` is higher (8–10 for 10–15 cards) because it counts
  answering the checks. Length follows the concept, never a target.
- The `author-lesson` skill now carries a condensed version of the style and
  points at the full section.
- **Editorial pass over all 27 Data Engineer Associate lessons against the new
  style.** The corpus already largely matched it, so the pass was surgical: cut
  meta-commentary that told the reader a point was important instead of making
  it ("That sentence is the whole idea", "This is worth pausing on because…"),
  removed sentences that restated the one before them, and dropped one marketing
  phrase ("a core selling point"). No cards were removed; the count stays 272.
- Removed the duplicated streaming-table / materialized-view definitions in
  *Lakeflow Pipelines* — they are taught in *Gold layer* two lessons earlier, so
  the pipelines lesson now leans on that and spends its words on the decision
  that is actually pipeline-specific: what the **source** does, not how fresh
  the output must be.
- Cut the second-person density in *What Databricks actually is*, which ran far
  above the rest of the corpus (3.9% of words vs 1.1% overall).
- **Same pass over all 31 Data Engineer Professional lessons.** Its prose was
  already inside the style (every lesson reads in 2–5 minutes; the banned-phrase
  scan came back empty), so the findings were mostly consistency and correctness.

### Fixed

- **Ten Data Engineer Professional lessons pointed the learner at the wrong next
  lesson.** Modules were reordered after authoring and the closing lines were
  never resequenced — *CDC without the plumbing* promised configs and delivered
  streaming tuning; *Making data discoverable* promised Delta Sharing, which was
  two lessons **behind**. Every closing now matches the actual reading order.
  One more of the same in the Associate cert: *Why the lakehouse exists* still
  teased compute after the Lakeflow lesson was inserted between them in 1.5.0.
- **Removed the `Correct — ` prefix from all 33 correct-answer explanations** in
  the Professional cert. The UI already marks the option correct; the label spent
  the first two words of every explanation restating it, and the Associate cert
  never did this.
- *Same table, different rows per user* quoted the **wrong exam objective** (the
  Unity Catalog inheritance one). It now quotes the row-filter/column-mask
  objective it actually teaches.
- *When a task fails at 3am* had an invented clause appended to its objective —
  "(and understand partial-failure behavior)". Objectives quote the outline.
- *Pipelines you declare, not orchestrate* explained the streaming-table vs
  materialized-view trade-off that the **very next lesson** is entirely about.
  It now names the two dataset types and leaves the choice to that lesson.

---

## [1.5.1] — 2026-09-09

### Changed

- **Scoped the glossary rule: define the vendor's vocabulary, assume the
  field's.** The learner has a degree or a career in data — they know data,
  warehouses, SQL, compute, clusters, schemas and joins, and they know what Git
  is. Glossing those is condescending and it buries the entries that mattered.
  `CLAUDE.md` now carries the rule with a define/assume table, plus the
  exception: **when the certification is *about* the thing** (Git in a GitHub
  cert) it stops being background and gets taught properly.
- Removed three glossary terms that broke the new rule — **PySpark**,
  **workspace**, **cluster** (31 → 28). **Apache Spark** stays: it is a named
  engine the platform is specifically bound to, not generic vocabulary. So does
  **materialized view**, because a Lakeflow materialized view is a particular
  managed dataset rather than the textbook SQL object.
- **Reframed *What Databricks actually is*** to match. It no longer explains what
  a cluster or distributed processing is. Instead: Databricks' *relationship* to
  Spark (managed Spark plus a platform — your skills transfer), the vendor's
  names for things you already know, and the DBU as the cost lens the exam
  actually grades. The compute analogy shifted from "why you'd use a cluster" to
  the metering model.
- Split the vocabulary card in two — it had grown past the 700-character limit,
  and the DBU point deserved its own card anyway. 13 cards, 272 for the cert.

## [1.5.0] — 2026-09-08

### Added

- **New lesson: *What Databricks actually is*** (Data Engineer Associate, Module
  E1, first lesson, 12 cards). The orientation lesson — what the product is,
  Apache Spark underneath, and the four words every later lesson assumes:
  **workspace**, **notebook**, **cluster**, **DBU**. Includes the correction of
  the most common beginner model: you do not load data *into* Databricks.
- **New lesson: *Lakeflow Pipelines: describe the table, not the steps***
  (Module E3, 15 cards). Closes the gap the glossary report found: the exam
  guide references pipelines from Sections 3, 4 and 5 but never gives them a
  section, so the Associate had no lesson on them. Covers pipeline as container,
  streaming table vs materialized view **chosen by source behaviour rather than
  freshness**, verified expectation syntax, and the fact that `ON VIOLATION`
  **defaults to warn** — violating rows are kept and counted, not dropped.
- 8 more glossary terms, all of them the "mundane" ones a certification is most
  likely to skip: **Databricks**, **Data Intelligence Platform**, **Apache
  Spark**, **PySpark**, **lakehouse**, **DBU**, **workspace**, **cluster**.

### Changed

- **Replaced the lakehouse analogy.** It previously described building a kitchen
  inside a pantry, which is not a thing anyone does — the image did not carry
  the idea. Now: a **reference library** (warehouse), a **self-storage unit**
  (lake), and a lakehouse as *the library's catalogue installed over the storage
  unit*. The mapping is stronger too: the catalogue is Unity Catalog, and the
  record of what changed is the transaction log.
- **`src_material` normalized** (flag C2 cleared): all five certifications now
  use `<provider>/<cert-id>/exam-guide.md`, and **185 PDF ligature artifacts**
  (`ﬁ`, `ﬂ`) were stripped across three guides. This unblocks verbatim
  `examObjective` matching.
- The glossary report no longer scans `mcq.examObjective`. It quotes the official
  outline verbatim, so a term appearing there early cannot be fixed by
  rewording — flagging it produced noise that could never be cleared. The in-app
  glossary still underlines terms there.
- Data Engineer Associate: 25 → **27 lessons**, 244 → **271 cards**.

### Notes

Research for the pipelines lesson is in
`src_material/databricks/databricks-certified-data-engineer-associate/research/lakeflow.md`
with source URLs.

The report is down to **two `❌`**, both honest and both the same shape: neither
the **Data Analyst Associate** (parked, 2/24) nor the **GenAI Engineer
Associate** ever says what *Databricks* is. Each certification has to stand on
its own, so each needs its own orientation lesson.

## [1.4.0] — 2026-09-08

### Added

- **A glossary, so terms get defined instead of assumed.** `src/content/glossary.ts`
  holds 23 terms — each with its aliases (former product names, abbreviations),
  the lessons that properly introduce it, and a source URL for anything
  version-specific.
- **Terms are clickable in the app.** `RichText` — the single renderer every
  card's text passes through — now underlines known terms and shows the
  definition in a popover on click. Once per card, so repeated mentions don't
  become noise. No markup in the content; matching happens at render time.
- **`npm run glossary`** — walks every certification in *reading order*, finds
  where each term is first used, compares that against where it is introduced,
  and writes `docs/GLOSSARY.md`. Flags `⚠️` used-before-introduced and `❌`
  never-introduced.
- **`Certification.assumes`** — declares a prerequisite certification, so
  Professional-level lessons aren't flagged for not re-teaching Delta Lake.
  Set on Data Engineer Professional.
- **New lesson: *Lakeflow: the word in front of everything*** (Data Engineer
  Associate, Module E1, 14 cards) — defines Lakeflow and its four components,
  the DLT → Lakeflow rename history, and the Jobs-vs-Pipelines distinction.

### Changed

- `CLAUDE.md` gains a **Defining terms** section: define every term the first
  time a learner meets it, track terms literally in the glossary, and run
  `npm run glossary` alongside `npm run check` when authoring.
- Data Engineer Associate: 24 → **25 lessons**, 230 → **244 cards**.

### Notes

The trigger was a real gap, not a hypothetical one: **Lakeflow** appeared **51
times across 20 files** — "Lakeflow Jobs", "Lakeflow Connect", "Lakeflow
pipelines" — and the content never said what Lakeflow *is*. The report found two
more of the same shape in the Associate cert (Lakeflow Pipelines, pipeline
expectations) plus 10 forward references across the other certs.

Documentation check (2026-09-08) also updated the naming: Databricks now writes
**Lakeflow pipelines**, having shortened *Lakeflow Spark Declarative Pipelines*
(itself formerly *Delta Live Tables*). A fourth component, **Lakeflow Designer**,
was absent from the content entirely.

Still open: the Data Engineer Associate has **no lesson on Lakeflow Pipelines**,
though the exam guide references them in Sections 3, 4 and 5. `pipeline
expectation` remains the one `❌` in the report.

## [1.3.0] — 2026-09-08

The first authored lessons for the **Generative AI Engineer Associate**, plus
the working agreement that produced them.

### Added

- **GenAI Engineer Associate — Module GA1 (GenAI Foundations) complete**: 4
  lessons, 48 cards, each with an mcq, a true/false and a flashcard, every mcq
  tied to an official exam objective.
  - *How large language models actually work* (12 cards) — next-token
    prediction, tokens, the context window as a desk; the myth that a bigger
    context window removes the need for retrieval.
  - *Embeddings and vector similarity* (11 cards) — meaning as distance,
    nearest-neighbour retrieval, and why query and documents must share one
    embedding model.
  - *RAG, fine-tuning, or just prompting?* (13 cards) — three levers for three
    different problems; the "fine-tune it on our documents" misconception.
  - *The Databricks GenAI stack (Mosaic AI)* (12 cards) — Vector Search, Model
    Serving, Foundation Model APIs, MLflow and Unity Catalog, and which job each
    one owns.
- **`CLAUDE.md`** — repository guidance for Claude Code, including the agreed
  **authoring loop**: exam guide → module mapping → targeted documentation
  research → outline review → author the module → sync docs.
- **`GOING-FORWARD.md`** — a working document of process improvements, flags,
  and the current build order.
- **Source-material research notes** —
  `src_material/.../generative-ai-engineer-associate/research/foundations.md`,
  recording verified product facts with source URLs so lessons stay traceable
  and refreshable.

### Notes

- **Product naming drift.** Documentation research found the exam guide is
  behind the product: *Mosaic AI Vector Search* is now *Databricks AI Search*,
  and there are **four** index types and **three** Foundation Model API modes
  rather than the two each the guide implies. Lessons lead with the exam guide's
  vocabulary and note the current name, following the existing house pattern
  (*"a Git folder (formerly Databricks Repos)"*).
- Verified that the 55 authored Data Engineer lessons have **not** gone stale —
  no "Delta Live Tables" references remain; Lakeflow naming is already in use.

## [1.2.0] — 2026-07-06

A fifth certification: the **Databricks Certified Generative AI Engineer
Associate** — scaffolded end to end, ready for lesson authoring.

### Added

- **Databricks Certified Generative AI Engineer Associate** — a new
  certification (45 questions · 90 minutes · USD 200 · valid 2 years) organized
  as **8 learning modules** following the RAG application build-arc, mapped to
  the **6 official exam sections**, with **35 planned lessons** scaffolded as
  "Coming soon":
  - *Module 1 — GenAI Foundations on Databricks*: how LLMs work, embeddings and
    vector similarity, RAG vs fine-tuning vs prompting, and the Mosaic AI stack.
  - *Module 2 — Designing GenAI Applications* (Design, 14%): problem → pipeline,
    prompt–response design, component/model selection, multi-stage decomposition.
  - *Module 3 — Preparing Data for Retrieval* (Data Preparation, 14%): document
    extraction, chunking strategies, embedding prep, and retrieval data quality.
  - *Module 4 — Building RAG Applications* (Application Development, 30%): RAG
    architecture, Vector Search retrieval, chain orchestration, prompt
    augmentation, and prompt engineering.
  - *Module 5 — Guardrails, Hallucinations & Model Choice* (Application
    Development, 30%): guardrails, hallucination mitigation, prompt-injection
    defense, model selection, and agents/tools.
  - *Module 6 — Assembling & Deploying* (22%): MLflow packaging, Unity Catalog
    model registration, Vector Search index creation, Model Serving, Foundation
    Model APIs/external models, and end-to-end deployment.
  - *Module 7 — Governance & Security* (8%): Unity Catalog governance, masking/
    PII protection, and legal/licensing/provenance.
  - *Module 8 — Evaluation & Monitoring* (12%): LLM evaluation metrics, MLflow
    evaluate with LLM-as-a-judge, production monitoring (inference tables,
    Lakehouse Monitoring), and cost/latency control.
  - Source material captured in
    `src_material/databricks/databricks-certified-generative-ai-engineer-associate`.

## [1.1.0] — 2026-07-06

The fourth certification joins the platform: the **GitHub Copilot (GH-300)**
exam — scaffolded end to end, ready for lesson authoring.

### Added

- **GitHub Copilot (GH-300)** — a new certification (~55–65 questions ·
  100 minutes · pass at 700/1000 · valid ~2 years) organized as **8 learning
  modules** mapped to the exam's **6 official skill domains**, with **27 planned
  lessons** scaffolded as "Coming soon":
  - *Module 1 — Meet GitHub Copilot*: what Copilot is, the plans (Free/Pro/
    Business/Enterprise), and enabling it in the IDE.
  - *Module 2 — How Copilot Works: Data & Architecture*: data flow and sharing,
    prompt building, proxy filtering/post-processing, the suggestion lifecycle,
    and LLM limitations.
  - *Module 3 — Using Copilot Responsibly*: generative-AI risks, ethical use
    and harm mitigation, and validating AI output.
  - *Module 4 — Prompt Engineering & Context*: prompt structure, how context is
    determined, zero-shot vs few-shot, and prompt-crafting best practices.
  - *Module 5 — Copilot Features in Depth*: inline/Chat/Plan Mode, the Copilot
    CLI, Agent/Edit Mode and MCP (sub-agents, agent sessions), and code review,
    Spaces, Spark, PR summaries, and instructions files.
  - *Module 6 — Boosting Developer Productivity*: code generation/refactoring/
    documentation, learning acceleration and legacy modernization, testing, and
    security/performance improvements.
  - *Module 7 — Privacy, Exclusions & Safeguards*: content exclusions and editor
    settings, output ownership, and duplication detection/security warnings.
  - *Module 8 — Administration & Governance*: org-wide policies and feature
    availability, Copilot Code Review policies, audit-log events, and REST-API
    subscription management.
  - Source material captured in `src_material/github/gh-300-github-copilot`.
  - **First lessons authored** (Module 1):
    - *"What is GitHub Copilot?"* (13 cards): the AI-pair-programmer mental
      model, inline suggestions vs Chat (compare diagram), why Copilot
      *generates* rather than *searches* code, the reach across
      IDE/github.com/CLI/PRs/mobile, and the "you stay the pilot" responsible-use
      theme.
    - *"Which Copilot: Free, Pro, Business, or Enterprise?"* (12 cards): the
      individual-vs-organization plan families, the capability ladder
      (Free → Pro/Pro+ → Business → Enterprise), and the key exam distinction
      that governance (policy management, content exclusions, audit logs) only
      unlocks at Business, with Enterprise adding deep github.com integration.
    - *"Getting set up in your IDE"* (11 cards): the three ingredients that
      enable Copilot (account access + extension + sign-in), supported editors,
      the seat-must-be-assigned trap for org plans, and confirming it works via
      the status icon. **Completes Module 1.**

## [1.0.0] — 2026-07-04

### Added

- **GitHub Pages deployment** — a GitHub Actions workflow
  (`.github/workflows/deploy.yml`) builds and publishes the site to
  `https://prebenolsen.github.io/certifications/` on every push to `main`. Vite
  now builds under the `/certifications/` base path with a matching router
  basename, and a `404.html` SPA fallback keeps client-side deep links working.
- **Optional accounts & cloud sync (Supabase)** — sign-in is a passwordless
  email magic link. Guests keep progress in `localStorage` (default, offline,
  per-device); signed-in users sync progress to Supabase (`certifications_`
  tables) so it follows them across devices. First sign-in imports existing
  guest progress. Ships guest-only when Supabase env vars are absent. SQL schema,
  RLS policies, and setup (including Site URL / redirect URLs) live in
  `supabase/`.
- **Mobile-friendly layout** — the desktop-first UI now reflows for phones
  (condensed header, stacked cards).

- **Flashcard self-grading** — after revealing a flashcard's answer the learner
  now marks "I knew this" / "I didn't know this". The result is recorded through
  the same progress store as quiz answers (so recall competence is tracked), but
  flashcards remain outside `INTERACTIVE_CARD_TYPES`, keeping self-reported recall
  separate from objective quiz accuracy. The first self-grade is final.

---

## [0.3.0] — 2026-07-04

The third certification: the advanced, production-focused **Data Engineer
Professional** exam — a complete certification.

### Added

- **Databricks Certified Data Engineer Professional** — a complete new
  certification (59 questions · 120 minutes · valid 2 years) organized as
  **9 learning modules** mapped to the 10 official exam sections, with **31
  fully-authored lessons** (283 cards) and **all 9 official sample questions
  woven in as MCQs**:
  - *Module 1 — Advanced Development in Python & SQL*: bundle-ready project
    structure, library/dependency management, Python/Pandas/SQL UDFs, and ETL
    testing (assertDataFrameEqual/assertSchemaEqual, DataFrame.transform).
  - *Module 2 — Declarative Pipelines & Streaming*: declarative pipelines,
    streaming tables vs materialized views, APPLY CHANGES CDC, Structured
    Streaming SLA tuning (sample Q2), and pipeline configs/control flow.
  - *Module 3 — Ingestion & Acquisition*: multi-format ingestion and
    exactly-once append-only Delta pipelines.
  - *Module 4 — Transformation*: window/join/aggregation transforms and bad-data
    quarantining.
  - *Module 5 — Data Modelling with Delta*: Delta internals & clones (sample
    Q1, Q8), partitioning & dimensional modelling (sample Q3), and Liquid
    Clustering over partitioning/ZORDER.
  - *Module 6 — Optimization*: managed-table overhead, data skipping & file
    sizing (sample Q7), Change Data Feed, and query-profile bottlenecks.
  - *Module 7 — Sharing & Governance*: Delta Sharing (D2D/D2O), Lakehouse
    Federation, and Unity Catalog discoverability & permission inheritance
    (sample Q4).
  - *Module 8 — Security & Compliance*: workspace ACLs & secrets redaction
    (sample Q6), row filters/column masks, PII anonymization, and compliant
    data purging.
  - *Module 9 — Monitoring, Debugging & CI/CD*: observability (system tables,
    event logs, profilers), SQL/job alerting, multi-task job failure semantics,
    repairs & cost-aware scheduling (sample Q9, Q5), and Asset Bundle + Git
    CI/CD.

## [0.2.0] — 2026-07-03

A second full certification plus the platform improvements and authoring tools
that make every future certification cheaper to build.

### Added

- **Databricks Certified Data Engineer Associate** — a complete certification:
  7 modules mirroring the official exam sections, **24 fully-authored lessons**
  (~230 cards) covering the platform & compute, ingestion (COPY INTO, Auto
  Loader, Lakeflow Connect), PySpark transformation (cleaning, joins,
  reshaping, dedup/aggregation, gold-layer objects), Lakeflow Jobs
  orchestration (DAGs, control flow, triggers), CI/CD (Git folders, Asset
  Bundles), optimization & troubleshooting (Spark UI, tuning parameters, job
  monitoring, Liquid Clustering, cluster triage), and governance & security
  (managed vs external tables, GRANT/REVOKE/DENY, row filters/column
  masks/ABAC). All five official sample questions are woven in as MCQs.
- **Data-driven diagrams** — diagram cards can now declare an inline
  `DiagramSpec` (`flow`, `compare`, or `layers`) rendered by shared primitives
  (`SpecDiagram`). New diagrams need no component or registry edit and are
  responsive by construction. Bespoke SVG diagrams by id still work.
- **Content validator** (`npm run validate`, part of `npm run check`) —
  errors on structural problems (duplicate ids, MCQ answers that aren't
  options, unregistered diagrams) and warns on teaching-philosophy violations
  (walls of text, no interactive check, missing recap).
- **Authoring guide** (`docs/AUTHORING.md`) — philosophy, lesson blueprint,
  card-type selection guide, diagram spec reference, and copy-paste templates.
- **Shared authoring helpers** (`src/content/authoring.ts`) — `planned()`
  placeholder helper used by all certifications.
- **"Next lesson" navigation** — finishing a lesson offers the next playable
  lesson (across modules) instead of always exiting to the module page.
- Certification pages now link to their own official exam guide.

### Changed

- **Progress storage is now scoped per certification** (`certId/lessonId`,
  storage key `certifications.progress.v2`) so lesson ids only need to be
  unique within a certification. Existing v1 progress is migrated
  automatically.
- **Module status is derived from its lessons** (complete / in-progress /
  planned) instead of being hand-authored — it can no longer drift.
- The global header no longer hard-links to one certification's exam guide.
- Quiz feedback ("Correct ✓ / Not quite ✗") extracted into a shared
  `AnswerFeedback` component used by MCQ and true/false cards.

### Fixed

- `README.md` was UTF-16 encoded (a Windows artifact); rewritten as UTF-8.
- `npm run typecheck` was broken (`tsc -b --noEmit` is not a valid
  combination).

## [0.1.0] — 2026-07-03

The foundation release: a complete, working learning engine plus two
fully-authored lessons for the Databricks Certified Data Analyst Associate.

### Added

- **Project foundation** — Vite + React 18 + TypeScript + Tailwind CSS +
  React Router. Build, lint, typecheck scripts.
- **Content model** (`src/types/content.ts`) — typed hierarchy
  `Certification → Module → Lesson → Card[]`, where `Card` is a discriminated
  union of 11 teaching card types.
- **Card renderer engine** — one renderer per card type behind a registry, so
  new card types can be added without touching the player. Card types:
  concept, analogy, diagram, example, scenario, mistake, flashcard, truefalse,
  mcq, summary, recap.
- **Vertical Card Player** — full-screen, one-card-at-a-time flow with
  scroll-snap, a progress bar, keyboard navigation (↑/↓/PageUp/PageDown/Esc),
  and prev/next controls.
- **Interactive cards** — multiple-choice (single & multi-select), true/false,
  and click-to-flip flashcards, all with explanations and per-option feedback.
- **Diagrams** — SVG diagram components (Unity Catalog namespace, GROUP BY flow,
  managed vs external tables) referenced from content by id via a registry.
- **Progress tracking** — localStorage-backed `ProgressProvider` recording
  viewed cards, quiz answers, and lesson completion; surfaced as per-lesson,
  per-module, and certification-wide progress bars.
- **Pages** — Home (certification catalog), Certification (module grid), Module
  (lesson list), Lesson (player), and a friendly Not-Found.
- **Databricks Certified Data Analyst Associate** scaffolded across all 9 exam
  sections as 9 learning modules, with two complete lessons:
  - *Where does your data live? The 3-level namespace* (Unity Catalog, managed
    vs external tables; maps to sample questions 6 & 9).
  - *Asking questions of your data: GROUP BY* (aggregations, GROUP BY,
    WHERE vs HAVING; maps to sample question 7).
- **Documentation** — `README.md`, `CHANGELOG.md`, `CONTENT.md`, and
  `docs/ARCHITECTURE.md`.

[1.2.0]: https://example.com/releases/1.2.0
[1.1.0]: https://example.com/releases/1.1.0
[0.3.0]: https://example.com/releases/0.3.0
[0.2.0]: https://example.com/releases/0.2.0
[0.1.0]: https://example.com/releases/0.1.0
