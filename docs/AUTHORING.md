# Authoring guide

How to add certifications and lessons — with templates, so a new certification
is mostly *writing*, not engineering. Read [`ARCHITECTURE.md`](ARCHITECTURE.md)
first if you want the *why* behind the systems used here.

## The teaching philosophy (non-negotiable)

Every topic is taught the way a good teacher would:

1. **Intuition first, terminology second, details last.**
2. **One idea per card.** Prefer many small cards over one long one — the
   validator warns on walls of text.
3. For every concept, answer: *What is it? Why does it exist? When is it used?
   How does it work? What's the common misconception? How does it relate to
   things I already know?*
4. Use analogies, diagrams, scenarios, worked examples, and mistake cards —
   chosen per concept, not by formula.
5. Every interactive question ties back to an **official exam objective** and,
   where useful, a real day-at-work situation.

## Adding a certification (checklist)

1. Drop the official exam guide into `src_material/<provider>/<cert-name>`.
2. Create `src/content/<provider>/<cert-id>/index.ts` exporting a
   `Certification`. Organize modules for **learning flow**, then map each back
   to the official exam sections via `examSections`.
3. Scaffold every lesson you plan to write with the `planned()` helper from
   `@/content/authoring` — the app shows them as "Coming soon".
4. Register the certification in `src/content/registry.ts` (one line).
5. Author lessons (below), flipping each to `status: 'complete'`.
6. Update `CONTENT.md`, `CHANGELOG.md`, and `README.md` in the same change.
7. Run `npm run check` (typecheck + lint + content validation).

Module notes:

- Module `status` is **derived** from its lessons — don't author it.
- Lesson ids must be unique **within the certification** (progress is stored
  per `certId/lessonId`). The validator enforces this.

## The lesson blueprint

A lesson is an ordered array of cards. The shape that works:

| # | Card | Job |
|---|------|-----|
| 1 | `scenario` (eyebrow: "Why this matters") | Hook — a concrete situation the learner recognizes |
| 2 | `analogy` | Anchor the new idea to something familiar |
| 3 | `concept` | The idea itself, plain language, with takeaways |
| 4 | `diagram` | A picture, when it teaches faster than words |
| 5 | `truefalse` / `mcq` | Quick check — catch the misconception early |
| … | more `concept` / `example` / `mistake` | One sub-idea at a time |
| n-2 | `mcq` (exam-style) | Realistic question tied to an exam objective |
| n-1 | `flashcard` | The one fact worth drilling |
| n | `recap` | Checklist of what they now understand + closing line |

10–15 cards ≈ 8–10 estimated minutes. Not every lesson needs every card type;
every complete lesson **does** need at least one interactive check and should
end with a `recap` (the validator warns otherwise).

### Picking the right card type

- `concept` — one idea explained. If you're writing "and also…", split it.
- `analogy` — comparison to daily life; use `mapping` pairs for explicit
  correspondences.
- `diagram` — see below; prefer an inline `spec`.
- `example` — worked code (SQL/Python) with an `explanation` of *why*.
- `scenario` — a day-at-work situation; `atWork` frames the practical stakes.
- `mistake` — a misconception stated (`myth`) then corrected (`reality`).
  Mine these from the exam's wrong answer options.
- `flashcard` — one drillable fact. Front is a question, back is short.
- `truefalse` — fast check of a single belief.
- `mcq` — exam-style; 4 options, `optionFeedback` explaining *each* wrong
  option, `examObjective` quoting the official outline.
- `summary` — mid-lesson consolidation for long lessons.
- `recap` — end-of-lesson checklist + a motivating `closing`.

### Text markup

Text fields support `**bold**`, `*italic*`, `` `code` ``, and `\n` line
breaks. Nothing else — no HTML, no links, no headings.

## Diagrams: use a spec, not a component

Most diagrams should be **data-driven**, declared inline on the card — no new
component, no registry edit:

```ts
// A pipeline (renders left→right, stacks on mobile):
{
  id: 'diagram-medallion',
  type: 'diagram',
  title: 'Bronze → Silver → Gold',
  spec: {
    kind: 'flow',
    steps: [
      { label: 'Bronze', sublabel: 'raw, as ingested', tone: 'warn' },
      { label: 'Silver', sublabel: 'cleaned, conformed', tone: 'accent' },
      { label: 'Gold', sublabel: 'business-ready', tone: 'good' },
    ],
    arrows: ['clean', 'aggregate'], // optional, length = steps - 1
  },
  caption: 'Each layer raises the data’s quality and usefulness.',
}

// A contrast ("X vs Y"):
spec: {
  kind: 'compare',
  left:  { label: 'Managed table', tone: 'brand',  items: ['Databricks owns files', 'DROP deletes data'] },
  right: { label: 'External table', tone: 'accent', items: ['You own files', 'DROP keeps data'] },
}

// Containment (outermost first):
spec: {
  kind: 'layers',
  layers: [
    { label: 'Catalog', tone: 'brand' },
    { label: 'Schema', tone: 'accent' },
    { label: 'Table', tone: 'neutral' },
  ],
}
```

Tones: `brand · accent · good · warn · bad · neutral`.

Only when a picture can't be expressed by these shapes, add a bespoke SVG
component under `src/components/diagrams/` and register it in
`diagrams/registry.tsx`, then reference it by `diagramId`.

## Lesson template

Copy into `src/content/<provider>/<cert-id>/lessons/<lesson-id>.ts`:

```ts
import type { Lesson } from '@/types/content'

/**
 * Lesson: <topic>.
 * Maps to exam Section <n> (<objective quote>).
 */
export const myTopicLesson: Lesson = {
  id: 'my-topic', // unique within the certification; used in URLs + progress
  title: 'A question or promise, not a chapter heading',
  summary: 'One line shown on the module page.',
  estimatedMinutes: 9,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: '…',
      body: '…',
      atWork: '…',
    },
    {
      id: 'analogy',
      type: 'analogy',
      title: '…is like…',
      body: '…',
      mapping: [{ from: 'Familiar thing', to: 'Technical thing' }],
    },
    {
      id: 'concept-main',
      type: 'concept',
      title: '…',
      body: '…',
      takeaways: ['…', '…'],
    },
    {
      id: 'check',
      type: 'truefalse',
      statement: '…',
      answer: false,
      explanation: '…',
    },
    {
      id: 'mcq-exam',
      type: 'mcq',
      question: '…',
      options: [
        { id: 'a', text: '…' },
        { id: 'b', text: '…' },
        { id: 'c', text: '…' },
        { id: 'd', text: '…' },
      ],
      correct: ['b'],
      optionFeedback: { a: '…', b: '…', c: '…', d: '…' },
      explanation: '…',
      examObjective: '<quote from the official exam outline>',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You now understand …',
      points: ['…', '…'],
      closing: 'One motivating line, pointing at what comes next.',
    },
  ],
}
```

Then add it to the module's `lessons` array in the certification's `index.ts`
(replacing its `planned()` placeholder).

## Quality gate

```bash
npm run check   # typecheck + lint + content validation
```

The validator (`scripts/validate-content.ts`) errors on structural problems
(duplicate ids, MCQ answers that aren't options, unregistered diagrams, empty
complete lessons) and warns on philosophy violations (walls of text, no
interactive check, missing recap). Fix warnings too — they're the point of the
platform.
