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

[0.2.0]: https://example.com/releases/0.2.0
[0.1.0]: https://example.com/releases/0.1.0
