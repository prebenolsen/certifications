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

[0.1.0]: https://example.com/releases/0.1.0
