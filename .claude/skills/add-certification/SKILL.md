---
name: add-certification
description: Scaffold a new certification in this learning platform — create the content folder, assemble the Certification object (modules mapped to official exam sections, planned() lesson placeholders), register it, and sync docs. Use when asked to add or start a new certification/exam, set up a new provider's cert, or stub out its modules and lessons before authoring.
---

# Adding a certification

A certification is a typed `Certification` object (`Certification → Module →
Lesson → Card[]`) assembled in `src/content/<provider>/<cert-id>/index.ts` and
registered once. Organize modules for **learning flow first**, then map each back
to the official exam sections via `examSections`.

Read first:
- `docs/AUTHORING.md` → "Adding a certification (checklist)".
- `src/types/content.ts` — the `Certification`, `Module`, `Lesson` shapes (incl. `examFacts`).
- An existing cert as a template:
  `src/content/databricks/data-engineer-associate/index.ts`.
- `src/content/authoring.ts` — the `planned()` placeholder helper.

## Steps

1. **Source material.** Drop the official exam guide into
   `src_material/<provider>/<cert-name>/`. Content must map back to its objectives.
2. **Assemble the cert.** Create `src/content/<provider>/<cert-id>/index.ts`
   exporting a `Certification`:
   - `id` unique across all certs (kebab, e.g. `databricks-data-engineer-associate`);
     it appears in URLs and scopes progress.
   - Fill `title`, `provider`, `summary`, `officialUrl`, and `examFacts`
     (`questions`, `minutes`, `passingNote?`, `validityYears`).
   - Define `modules` in learning order. Each module has `id`, `order` (unique
     ordinal), `title`, `summary`, `examSections` (e.g. `['Section 2']`), an `icon`
     emoji, and `lessons`. **Do not author module `status`** — it is derived from
     its lessons.
3. **Scaffold every lesson** with `planned(id, title, summary)` from
   `@/content/authoring` so the app shows them as "Coming soon" and they're excluded
   from progress math. Lesson ids must be unique within the certification.
4. **Register it** in `src/content/registry.ts` — import the cert and add it to the
   `certifications` array (one line). This is the only wiring the UI needs.
5. **Run `npm run check`** (typecheck + lint + validate) — clean it up.
6. **Sync the docs** in the same change (see `sync-content-docs`): add the
   certification's section to `CONTENT.md` (module/lesson table with ⬜ planned rows),
   a `CHANGELOG.md` entry (new cert content is a **minor** version bump), and list it
   in `README.md`'s supported-certifications section.

Then author lessons one at a time with the `author-lesson` skill, flipping each
`planned()` entry to a real `complete` lesson.
