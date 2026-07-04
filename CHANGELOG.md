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

[0.3.0]: https://example.com/releases/0.3.0
[0.2.0]: https://example.com/releases/0.2.0
[0.1.0]: https://example.com/releases/0.1.0
