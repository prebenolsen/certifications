# Certifications — Understand, don't memorize

An interactive learning platform for professional certifications, built around a
single principle: **learners should understand *why* something works**, not just
memorize answers.

Certifications currently supported:

- **Databricks Certified Data Analyst Associate**
- **Databricks Certified Data Engineer Associate**
- **Databricks Certified Data Engineer Professional**

---

## Project overview

Most exam-prep tools are glorified flashcard dumps. This one is different. Every
topic is taught the way a good teacher would:

- **Intuition first, terminology second, details last.**
- **One idea per card** — bite-sized, low-friction, vertically scrollable (think
  the *learning principles* of TikTok, not its look).
- Analogies, diagrams, worked examples, "common mistake" cards, and interactive
  checks — chosen per concept to build a real mental model.
- Every interactive question ties back to an **official exam objective** and,
  where useful, a **real day-at-work scenario**.

### What it looks like

```
Home (certifications)
  └─ Certification   (modules, overall progress)
       └─ Module     (list of lessons, per-module progress)
            └─ Lesson → full-screen Card Player
                        · vertical, one card at a time
                        · progress bar + keyboard nav (↑/↓, Esc)
                        · interactive cards record answers
                        · "Next lesson" hand-off at the end
```

---

## Setup

**Prerequisites:** Node.js 20+ and npm.

```bash
npm install
```

## Development

```bash
npm run dev        # start the Vite dev server (default http://localhost:5173)
npm run build      # type-check (tsc) + production build to dist/
npm run preview    # preview the production build
npm run typecheck  # tsc without emitting
npm run lint       # eslint
npm run validate   # content validator (structure + teaching-philosophy rules)
npm run check      # typecheck + lint + validate — run before committing
```

> Tip: a preconfigured dev server (`dev`, port 5180) lives in
> `.claude/launch.json` for the in-editor preview.

---

## Deployment (GitHub Pages)

The app ships as a static site to GitHub Pages at
**https://prebenolsen.github.io/certifications/**.

- **Workflow:** `.github/workflows/deploy.yml` builds and deploys on every push
  to `main` (and via manual dispatch). Enable it once under **Settings → Pages →
  Build and deployment → Source: GitHub Actions**.
- **Base path:** Vite builds under `/certifications/` (project site); the router
  basename matches automatically. Local dev stays at `/`.
- **Deep links:** `public/404.html` + a snippet in `index.html` give the SPA
  client-side routing on Pages (GitHub has no server-side rewrite).

## Accounts & progress storage

Sign-in is **optional**. By default everyone is a **Guest** and progress is saved
in the browser's `localStorage` — no account, works offline, per-device.

Signing in (passwordless email **magic link**, via Supabase) syncs progress to
the cloud so it follows you across devices. If Supabase env vars are absent the
app stays guest-only and the "Sign in" button never appears.

To enable accounts, follow [`supabase/supabase-readme.md`](supabase/supabase-readme.md):
run the `.sql` files, then set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
(locally in `.env.local`, and as GitHub Actions repository secrets for the
deploy). The readme also covers the required **Site URL** and **redirect URL**
configuration for the magic link.

> **Desktop-first, mobile-friendly.** The layout is designed for desktop but
> reflows for phones (stacked cards, condensed header).

---

## Architecture overview

**Stack:** Vite · React 18 · TypeScript · Tailwind CSS · React Router.

The central design idea is a clean split between **content** (data) and **the UI
that renders it** (components). See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
for the full picture. In short:

| Layer | Location | Responsibility |
|-------|----------|----------------|
| Content model | `src/types/content.ts` | Typed shapes: `Certification → Module → Lesson → Card[]` |
| Learning content | `src/content/**` | The actual lessons, as typed data (no JSX) |
| Authoring helpers | `src/content/authoring.ts` | Shared helpers for content authors |
| Card renderers | `src/components/cards/**` | One renderer per card type + a registry |
| Diagrams | `src/components/diagrams/**` | Data-driven `DiagramSpec` primitives + custom SVGs by id |
| Player | `src/components/player/CardPlayer.tsx` | The vertical card-flow experience |
| Pages / routing | `src/pages/**`, `src/App.tsx` | Home, certification, module, lesson |
| Progress | `src/context/ProgressContext.tsx` | Learner progress — localStorage (guest) or Supabase (signed in) |
| Auth | `src/context/AuthContext.tsx`, `src/lib/supabase.ts` | Optional magic-link sign-in; guest by default |
| Validation | `scripts/validate-content.ts` | Content correctness + teaching-philosophy lint |

### The extension points (how the app grows)

- **New lesson?** Author a `Lesson` object under the certification's `lessons/`
  folder and slot it into the module in the certification's `index.ts`.
  Follow [`docs/AUTHORING.md`](docs/AUTHORING.md) — it has templates.
- **New certification?** Add a folder under `src/content/`, export a
  `Certification`, and register it in `src/content/registry.ts` (one line).
- **New diagram?** Usually none needed: declare a data-driven `spec`
  (flow / compare / layers) inline on the diagram card. Only bespoke visuals
  need a component registered in `src/components/diagrams/registry.tsx`.
- **New card type?** Add a variant to the `Card` union in
  `src/types/content.ts`, write a renderer in `src/components/cards/`, and
  register it in `src/components/cards/registry.tsx`. Nothing else changes.

---

## How learning content is organized

Content is authored as **plain typed objects** — no HTML, no JSX — so writing a
lesson is writing data. A lightweight inline markup subset is supported in text
fields: `**bold**`, `*italic*`, `` `code` ``, and newlines.

```
src/content/
  databricks/
    data-analyst-associate/
      index.ts                ← assembles the certification (9 modules)
      lessons/*.ts            ← fully-authored lessons (decks of cards)
    data-engineer-associate/
      index.ts                ← assembles the certification (7 modules)
      lessons/*.ts            ← 24 fully-authored lessons
    data-engineer-professional/
      index.ts                ← assembles the certification (9 modules)
      lessons/*.ts            ← 31 fully-authored lessons
  authoring.ts                ← shared helpers (planned() etc.)
  registry.ts                 ← lookup helpers used by the UI
```

A **Lesson** is an ordered array of **Cards**. Card types available today:

`concept · analogy · diagram · example · scenario · mistake · flashcard ·
truefalse · mcq · summary · recap`

Each card communicates **one** idea. Prefer many small cards over long ones.

The current inventory — what's built, what's planned — lives in
[`CONTENT.md`](CONTENT.md) and is kept in sync with the code.

---

## How to contribute

1. **Read [`docs/AUTHORING.md`](docs/AUTHORING.md)** — philosophy, templates,
   and the lesson blueprint.
2. **Pick a lesson** from [`CONTENT.md`](CONTENT.md) marked *planned*.
3. **Teach, don't list.** For each concept, answer: *What is it? Why does it
   exist? When is it used? How does it differ from similar things? What's the
   common misconception? How does it show up on the exam and at work?*
4. Author the lesson as a typed `Lesson` object; flip its `status` to
   `complete`; run `npm run check`.
5. **Update the docs in the same change:** `CHANGELOG.md`, `CONTENT.md`, and
   this README if anything structural changed. These files must never fall
   behind the code.

Versioning follows [Semantic Versioning](https://semver.org/) — see
`CHANGELOG.md` for the rules this project uses.

---

## Source material

Official exam guides (objectives + sample questions) are stored in
`src_material/databricks/`. Content should map back to these objectives.
