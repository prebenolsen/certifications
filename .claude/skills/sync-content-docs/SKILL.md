---
name: sync-content-docs
description: Run the quality gate and keep the docs in sync after any content or code change in this platform — `npm run check` plus updating CONTENT.md, CHANGELOG.md, and README.md so they never drift from the code. Use when finishing a lesson/certification/feature, before committing, or when asked to validate content, update the changelog/inventory, or bump the version.
---

# Quality gate + docs sync

These docs are **living** and must never fall behind the code. Update them in the
**same change** that touches content or structure — this repo treats drift as a bug.

## 1. Run the quality gate

```bash
npm run check      # typecheck (tsc) + lint (eslint) + validate (content rules)
```

`npm run validate` alone runs `scripts/validate-content.ts`. **Errors** fail the
run (duplicate ids, MCQ answers that aren't options, unregistered `diagramId`,
malformed `flow` specs, empty complete lessons). **Warnings** don't fail but must
still be fixed — they encode the teaching philosophy (text field > 700 chars,
a complete lesson with no `mcq`/`truefalse` check or no closing `recap`, < 6 cards).
Its summary line ("Checked N certification(s), M lessons (K complete), C cards.")
is the source of truth for the counts in the docs below.

## 2. Update `CONTENT.md` (the inventory)

Reflect the **current** state of the app:
- Flip the lesson's status glyph (✅ complete · 🚧 in progress · ⬜ planned).
- Update its row's card count, checks (e.g. "1 mcq, 1 t/f, 1 flashcard"), diagrams,
  and highlights.
- Update the certification header line: "Lessons authored: X of Y · Cards: N"
  (take totals from the validator's summary line).

## 3. Update `CHANGELOG.md`

Keep-a-Changelog format, Semantic Versioning. Pick the bump per this repo's rules:
- **Minor** — new certification content, modules, lessons, teaching methods, or UI
  sections.
- **Patch** — bug fixes, wording/accessibility/UX, refactors, unnoticeable fixes.
- **Major** — large new features or major architectural changes.

Add entries under the right heading (Added / Changed / Fixed). Only cut a new
version section (and touch `package.json` `version`) when the user is releasing —
otherwise add to the existing unreleased/most-recent section as appropriate.

## 4. Update `README.md` — only if something structural changed

New certification → add it to the supported list. New card type, new extension
point, or changed architecture → update the relevant table/section. Routine lesson
additions don't touch the README.

## Check before done

- `npm run check` is clean (no errors, no warnings).
- `CONTENT.md`, `CHANGELOG.md`, and (if structural) `README.md` match the code.
