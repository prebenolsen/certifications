# Going forward

A working document: **what to improve in the process, what to build next, and
what to watch out for.** Written 2026-09-08, against v1.2.0.

Unlike [`CONTENT.md`](CONTENT.md) (the lesson inventory) and
[`CERTIFICATION-ROADMAP.md`](CERTIFICATION-ROADMAP.md) (the certification
catalog), this file is about **how the work gets done** — the authoring pipeline,
its gaps, and the decisions queued up. Prune items as they land.

---

## A. Where things stand

| | |
|---|---|
| Certifications registered | 5 |
| Lessons authored | ~60 |
| **Lessons still to write** | **59** (35 GenAI · 24 GH-300) |
| Quality gate | `npm run check` — typecheck + lint + validate, enforced in CI |
| Authoring support | 3 skills, `docs/AUTHORING.md`, `docs/ARCHITECTURE.md`, content validator |

The foundations are in good shape. The three skills (`add-certification`,
`author-lesson`, `sync-content-docs`), the philosophy-aware validator, and a CI
job that actually runs the gate are more than most projects of this kind have.

**So the problem isn't missing tooling — it's the three places where the
existing tooling stops.** The remaining work is ~59 lessons of dense,
hand-written teaching data, and the pipeline is currently optimized for writing
*one lesson at a time* while hand-maintaining the docs that describe them.

---

## B. Process & tooling improvements

Ranked by leverage.

### B1. Generate `CONTENT.md` instead of maintaining it ⭐ highest leverage

`CONTENT.md` is ~469 lines of hand-maintained data that is **fully derivable**
from the typed content: statuses, card counts, check mixes, module weightings,
"N of M authored" totals. Every content change currently costs a manual doc edit
that can silently drift from the code.

**Do:** add `npm run inventory` that regenerates the tables between explicit
markers (keeping the hand-written prose above them), then wire it into
`npm run check` so a **stale `CONTENT.md` fails CI**.

**Why it matters:** it deletes an entire category of recurring work, removes the
main source of doc drift, and shrinks `sync-content-docs` to almost nothing —
right before we add 59 lessons on top of it.

### B2. Add a thin `CLAUDE.md` (~40 lines)

Skills only load when their description matches the request. A `CLAUDE.md` loads
**every session**. It should not duplicate `AUTHORING.md` — it should carry only
the always-true constraints that otherwise get re-derived, or violated before a
skill ever fires:

- Content is **typed data, never JSX**.
- `npm run check` before anything is "done" — and **warnings are failures here**,
  not noise. They encode the teaching philosophy.
- `CONTENT.md` / `CHANGELOG.md` / `README.md` are updated **in the same change**.
  (This rule currently lives only inside a skill someone has to remember to
  invoke.)
- **Data Analyst Associate is parked on purpose** — 2/24 is a decision, not a
  backlog item. Don't "helpfully" resume it.
- Source material lives in `src_material/<provider>/`; content maps back to it.
- Pointers to the skills, rather than restating them.

### B3. Author by **module**, not by lesson

`author-lesson` is lesson-scoped, but lessons inside a module share vocabulary,
diagrams, and a narrative arc. Writing them one at a time causes repetition (the
same analogy re-explained across three lessons) and drift between neighbours.

**Do:** add an `author-module` skill that

1. reads the module's `planned()` entries,
2. **plans the arc across all 4–6 lessons first** — which concept lands where,
   which analogy is spent once, which diagram gets reused,
3. writes them in one pass, and
4. syncs docs once instead of six times.

**Related, cheap:** make the card-by-card **outline a reviewable checkpoint**.
It's the highest-value artifact per lesson and the cheapest thing to reject.
Today authoring goes straight to ~150 lines of finished cards.

### B4. Close the validator's correctness gaps

The validator handles structure and a couple of philosophy rules well. What it
can't catch today matters specifically because this is *exam-prep* content:

- **`mcq.examObjective` is unverified free text.** Nothing prevents a
  plausible-sounding but fabricated objective quote. There are **62** of these in
  the content today. Assert each appears in the cert's source material.
  *(See flag C2 — this needs normalization to work.)*
- **`module.examSections` is unverified too** — a typo silently breaks the
  exam-section mapping that the whole module structure is justified by.
- **Objective coverage report:** which exam-guide objectives have *zero* lessons
  or *zero* MCQs pointing at them. This answers "what do I build next"
  mechanically instead of by eyeballing tables.
- **Card-type diversity:** a lesson of 10 straight `concept` cards passes today —
  which is precisely what the teaching philosophy forbids.

### B5. Lesson scaffold generator (minor)

`npm run new-lesson <cert> <module> <id>` — writes the template file *and* swaps
the `planned()` call in the certification's `index.ts`. Removes boilerplate and
the "authored the lesson but forgot to wire it in" failure mode.

### B6. Optional: parallel authoring

A module's lessons could be fanned out to subagents for perhaps 3–4× wall-clock
throughput. **The risk is voice consistency**, which is a genuine cost in a
teaching product. Only worth reaching for *after* B3 exists to lock the arc down
first. Opt-in, not the default.

---

## C. Flags

### C1. No scraped documentation exists in this repo

Checked and confirmed: the working tree, full git history, all branches, and
stashes contain **no scraped Databricks documentation**.

- `src_material/` totals **72 KB / 1,337 lines** — five exam guides, nothing else.
- The largest blob ever committed (excluding `package-lock.json`) is **19 KB**.
- Nothing has ever been deleted from the repo; there are no other branches or
  stashes.

If such a scrape was produced, it lives **outside this repository**. Worth
locating: real product documentation would materially improve lesson accuracy
beyond what a ~100-line exam outline supports.

**Decision needed:** if the scrape is found, does it belong in-repo (large, and
it is someone else's copyrighted content) or as a local, gitignored reference?
Recommendation: **gitignored local reference**, cited but not vendored.

### C2. `src_material` is inconsistent, and PDF artifacts will break B4

Two different conventions are in use:

| Cert | Path shape |
|---|---|
| Data Analyst / DE Associate / DE Professional | **extensionless file**, e.g. `src_material/databricks/databricks-certified-data-engineer-professional` |
| GenAI Engineer / GH-300 | folder containing `exam-guide.md` |

The three extensionless files are raw **PDF text dumps** and contain **159
ligature artifacts** (`ﬁ`, `ﬂ` — "Certiﬁed", "Lakeﬂow") across them; the two
newer `.md` guides are clean.

**Consequence:** verbatim `examObjective` matching (B4) will produce false
failures against these files. Normalize the ligatures and standardize on
`<cert>/exam-guide.md` **before** building the objective checker.

### C3. GH-300's source material is likely stale

Its exam guide states *"skills measured as of January 2026 (exam changed
significantly Jan 2026)."* It is now **September 2026**, and Copilot's surface
moves fast.

**Do not author Modules 2–8 against the captured outline.** Re-pull the official
skills-measured list first, or risk writing 24 lessons against a stale spec.

### C5. Terms used but never defined — and one missing lesson ⭐

Found while checking whether the content ever says what **Lakeflow** is. It did
not: the word appeared **51 times across 20 files** as a prefix — *Lakeflow
Jobs*, *Lakeflow Connect*, *Lakeflow pipelines* — and nothing defined the family.

Fixed in v1.4.0 with `src/content/glossary.ts`, a clickable in-app glossary, and
`npm run glossary` → `docs/GLOSSARY.md`. That report is now the tracker; work
from it rather than from this list.

**What it still says is open:**

1. **The Data Engineer Associate has no lesson on Lakeflow Pipelines.** The exam
   guide references them in Section 3 (streaming tables / materialized views),
   Section 4 (pipeline tasks) and Section 5 (deploying pipelines via bundles).
   The concept is only taught in the *Professional* cert. `pipeline expectation`
   is the report's remaining ❌ for exactly this reason.
   **→ Author *Pipelines you declare* for Module E3.**
2. **10 `⚠️` forward references** — a term used a lesson or two before the one
   that introduces it. Mostly benign now that the popover exists, but each is
   worth a glance: some want a one-line gloss at first mention.
3. **The glossary covers 23 terms.** That is a seed, not a sweep. Every future
   module should add its terms as it is authored (now in the loop, step 5).

### C4. `databricks_mcp.log` sits in the working tree

Covered by `.gitignore` (`*.log`) so it isn't tracked — noted only as local
clutter.

---

## D. Content: what to build next

**Author the Databricks Certified Generative AI Engineer Associate, starting with
Module GA1 (Foundations), as a single whole-module batch.**

Why:

- It's the stated preference and Phase 1 of `CERTIFICATION-ROADMAP.md`.
- It's directly on the Databricks track that matches day-to-day work.
- **GA1 is the right entry point** because it's the primer: it establishes the
  voice and the reusable diagrams (embedding space, the retrieve-then-generate
  loop) that GA2–GA8 keep referring back to.
- Doing it as a module batch **pilots the B3 workflow**. If it works on 4
  lessons, it works for the remaining 55.

**Then GA4 (Building RAG Applications)** — Application Development is 30% of the
exam and GA4 is the spine the rest hangs off.

**GH-300 waits on C3.** Its source material needs refreshing before it deserves
more investment; that's an independent argument for doing GenAI first.

---

## E. Suggested order of work

- ~~**B2** — add `CLAUDE.md`~~ ✅ *done (v1.3.0), including the authoring loop.*
- ~~**D** — author GenAI Module GA1 as the pilot batch~~ ✅ *done (v1.3.0):
  4 lessons, 48 cards. The loop worked; documentation research caught three
  factual errors that memory alone would have shipped (see C5).*

- ~~**C5** — term tracking~~ ✅ *done (v1.4.0): glossary data, in-app popovers,
  `npm run glossary`, and the *Lakeflow* lesson that closes the biggest hole.*

Remaining:

1. **C5.1** — author *Lakeflow Pipelines* for the DE Associate (Module E3). The
   only remaining ❌ in the glossary report, and genuinely on the exam.
2. **B1** — generate `CONTENT.md`, wire into `check`. *(Stops the docs being
   manual work before 55 lessons land on top of them.)*
3. **C2** — normalize `src_material` naming + strip PDF ligatures.
4. **B3** — promote the loop into an `author-module` skill. GA1 proved the
   workflow by hand; it is not yet codified.
5. **GA2** — continue the GenAI cert at *Designing GenAI Applications*.
6. **B4** — objective verification + coverage report, once C2 makes it viable.
7. **C3** — refresh GH-300 source material, then resume it at Module 2.

**Also worth doing:** wire `npm run glossary` into `npm run check` so a new ❌
fails CI, the same way B1 proposes for `CONTENT.md`. Held back only until the
one known ❌ is cleared.

`B5`, `B6`, and the `C1` decision slot in opportunistically.

---

## F. What the GA1 pilot proved

Recorded because it justifies the research step's cost on every future module.

Three claims that would have been **written confidently and wrongly** from model
knowledge alone, all caught by targeted documentation lookups:

1. **Vector Search is now "Databricks AI Search."** The exam guide still says
   *Mosaic AI Vector Search*.
2. **There are four index types**, not the two the exam guide implies — Delta
   Sync (Databricks-computed), Delta Sync (self-managed), Direct Vector Access,
   and Full-Text Search.
3. **It uses HNSW with L2 distance, not cosine.** Cosine requires normalizing
   embeddings first. "Vector Search uses cosine similarity" is the intuitive
   answer and it is conditionally wrong — which made it a `mistake` card.

Also: Foundation Model APIs has **three** modes, not two (the guide omits
*AI Functions optimized models* for batch inference).

**Cost:** ~6 lookups for a 4-lesson module. Cheap, and non-optional — the
research step stays in the loop.

**Reassuring finding:** the 55 previously authored Data Engineer lessons have
**not** decayed. Zero "Delta Live Tables" references; Lakeflow naming already in
use throughout.
