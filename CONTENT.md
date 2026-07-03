# Content Inventory

The living knowledge inventory for the platform. It must always reflect the
**current state of the application**. Update it in the same change that adds or
edits content.

Status legend: ✅ complete · 🚧 in progress · ⬜ planned

Run `npm run validate` to check this content structurally; the numbers below
can be regenerated from its summary line.

---

## Certification: Databricks Certified Data Engineer Associate

- **Exam:** 45 multiple-choice questions · 90 minutes · USD 200 · valid 2 years
- **Source of truth:** `src_material/databricks/databricks-certified-data-engineer-associate`
- **Modules:** 7 (mirroring the 7 official exam sections)
- **Lessons authored:** 24 of 24 ✅ · **Cards:** 230 · all 5 official sample
  questions woven in as MCQs

### Module E1 — The Data Intelligence Platform 🧠 (Section 1, 6%) · ✅

| Lesson | Status | Cards | Checks | Diagrams | Highlights |
|--------|:------:|:-----:|--------|----------|------------|
| Why the lakehouse exists | ✅ | 11 | 1 mcq, 1 flashcard | architecture (compare) | kitchen/pantry analogy; time-travel SQL; sample Q2 |
| Picking the right compute | ✅ | 10 | 1 mcq, 1 t/f, 1 flashcard | compute menu (compare) | DBU cost model; sample Q4 |

### Module E2 — Ingesting Data 📥 (Section 2, 21%) · ✅

| Lesson | Status | Cards | Checks | Diagrams | Highlights |
|--------|:------:|:-----:|--------|----------|------------|
| Batch, streaming, or incremental? | ✅ | 10 | 1 mcq, 1 t/f, 1 flashcard | source→bronze (flow) | audit-log delivery contract; sample Q3 |
| COPY INTO | ✅ | 8 | 1 mcq, 1 flashcard | — | idempotency; FORMAT/COPY_OPTIONS |
| Auto Loader | ✅ | 11 | 1 mcq, 1 flashcard | pipeline (flow) | mail-carrier analogy; schema evolution; `_rescued_data`; availableNow |
| Lakeflow Connect & choosing a method | ✅ | 10 | 1 mcq, 1 t/f | sources (flow) | managed vs standard connectors; JDBC/REST; nested JSON; decision guide |

### Module E3 — Transforming with PySpark 🔄 (Section 3, 22%) · ✅

| Lesson | Status | Cards | Checks | Diagrams | Highlights |
|--------|:------:|:-----:|--------|----------|------------|
| Bronze to silver | ✅ | 10 | 1 mcq, 1 flashcard | medallion (flow) | restaurant analogy; dropna/fillna/cast; constraints & expectations |
| Joins & unions | ✅ | 11 | 1 mcq, 1 t/f, 1 flashcard | inner vs left (compare) | broadcast joins; union() = UNION ALL trap |
| Reshaping tables | ✅ | 10 | 1 mcq, 1 t/f | explode (flow) | withColumn/split/filter/explode; grain awareness |
| Deduplication & aggregation | ✅ | 9 | 1 mcq, 1 flashcard | — | dropDuplicates keys; approx_count_distinct; summary() |
| Gold layer objects | ✅ | 10 | 1 mcq, 1 t/f, 1 flashcard | freshness vs speed (compare) | table vs view vs MV vs streaming table |

### Module E4 — Orchestrating with Lakeflow Jobs 🗓️ (Section 4, 16%) · ✅

| Lesson | Status | Cards | Checks | Diagrams | Highlights |
|--------|:------:|:-----:|--------|----------|------------|
| Jobs, tasks & the DAG | ✅ | 9 | 1 mcq, 1 flashcard | nightly job (flow) | recipe analogy; fan-out/fan-in; failure isolation |
| Control flow | ✅ | 9 | 1 mcq, 1 t/f | resilient pipeline (flow) | retries + idempotency; if/else; run-if; for-each |
| Triggers | ✅ | 8 | 1 mcq, 1 flashcard | time vs data-driven (compare) | cron vs file-arrival vs table-update |

### Module E5 — CI/CD & Asset Bundles 🚀 (Section 5, 10%) · ✅

| Lesson | Status | Cards | Checks | Diagrams | Highlights |
|--------|:------:|:-----:|--------|----------|------------|
| Git folders | ✅ | 8 | 1 mcq, 1 t/f | idea→merged (flow) | PRs live in the provider; branch workflow |
| Asset Bundles | ✅ | 11 | 1 mcq, 1 flashcard | promotion path (flow) | container analogy; databricks.yml; targets/variables; CLI verbs; sample Q5 |

### Module E6 — Optimization & Troubleshooting 🔬 (Sections 3 + 6) · ✅

| Lesson | Status | Cards | Checks | Diagrams | Highlights |
|--------|:------:|:-----:|--------|----------|------------|
| Reading the Spark UI | ✅ | 9 | 1 mcq, 1 flashcard | triage (flow) | skew/shuffle/spill signatures; AQE; sample Q1 |
| The four tuning knobs | ✅ | 10 | 1 mcq, 1 flashcard | symptom→knob (compare) | shuffle.partitions; memory; broadcast threshold; re-measure rule |
| Monitoring jobs | ✅ | 8 | 1 mcq, 1 flashcard | failed run (flow) | run-history baselines; upstream blockers; repair runs |
| Liquid Clustering & predictive optimization | ✅ | 10 | 1 mcq, 1 t/f, 1 flashcard | — | supermarket analogy; CLUSTER BY AUTO; auto-maintenance |
| Cluster triage | ✅ | 9 | 1 mcq, 1 flashcard | triage map (flow) | startup/capacity; library scoping; driver vs executor OOM |

### Module E7 — Governance & Security 🔐 (Section 7, 15%) · ✅

| Lesson | Status | Cards | Checks | Diagrams | Highlights |
|--------|:------:|:-----:|--------|----------|------------|
| Managed vs external tables | ✅ | 9 | 1 mcq, 1 flashcard | DROP behavior (compare) | LOCATION clause; SET MANAGED conversion |
| GRANT, REVOKE, DENY & the hierarchy | ✅ | 10 | 1 mcq, 1 t/f | securables (layers) | keycard analogy; inheritance; groups & service principals |
| Row filters, masks & ABAC | ✅ | 10 | 1 mcq, 1 flashcard | per-object vs ABAC (compare) | filter/mask functions; tag-driven policies |

- **Future ideas:** hands-on SQL sandbox cards; Spark UI screenshot walkthroughs;
  a mixed-section mock exam.

---

## Certification: Databricks Certified Data Analyst Associate

- **Exam:** 45 multiple-choice questions · 90 minutes · valid 2 years
- **Source of truth:** `src_material/databricks/databricks-certified-data-analyst-associate`
- **Modules:** 9 (organized for learning flow, mapped back to exam sections)
- **Lessons authored:** 2 of 24 · **Card types in use:** 11 of 11

### Card-type coverage (engine)

| Card type | Implemented | Notes |
|-----------|:-----------:|-------|
| concept | ✅ | Title, body, optional takeaways |
| analogy | ✅ | Body + optional "maps to" pairs |
| diagram | ✅ | Registered SVG by id + caption |
| example | ✅ | Intro + code block + explanation |
| scenario | ✅ | Body + "at work" framing |
| mistake | ✅ | Myth vs reality |
| flashcard | ✅ | Click-to-flip |
| truefalse | ✅ | Answer + explanation |
| mcq | ✅ | Single/multi-select, per-option feedback, exam objective |
| summary | ✅ | Numbered key points |
| recap | ✅ | Checklist + closing line |

### Exercise formats

Implemented: multiple choice (single & multi-select), true/false, flashcards.
Planned: drag-and-drop, ordering steps, "identify the mistake", build-a-SQL-query,
interactive diagrams, prediction / "what happens next".

---

## Module 1 — The Platform & Unity Catalog 🏛️ (Sections 1, 9) · 🚧

| Lesson | Status | Lessons | Quizzes | Diagrams | Examples | Analogies |
|--------|:------:|:-------:|:-------:|:--------:|:--------:|:---------:|
| Where does your data live? The 3-level namespace | ✅ | 13 cards | 1 mcq, 1 t/f, 1 flashcard | 2 (namespace, managed vs external) | 1 (CREATE OR REPLACE) | 1 (postal address) |
| The pieces of the platform | ⬜ | — | — | — | — | — |
| Catalog Explorer, views & lineage | ⬜ | — | — | — | — | — |

- **Covered:** 3-level namespace (`catalog.schema.table`), schema = database,
  managed vs external tables, `DROP TABLE` behavior, `CREATE OR REPLACE`.
- **Missing:** platform components (Delta Lake, DLT, Lakeflow, Mosaic AI,
  Databricks SQL), Catalog Explorer UI, views vs tables, certified tables,
  lineage, Marketplace.
- **Future ideas:** interactive "build the full table name" drag exercise;
  clickable Catalog Explorer mock.

## Module 2 — Managing & Cleaning Data 🧹 (Section 2) · ⬜

- **Lessons planned:** Discovering & governing certified data; Cleaning data in SQL.
- **Missing:** discover/query/manage certified datasets, tagging a data asset,
  viewing lineage, removing invalid data, handling missing values.

## Module 3 — Importing Data 📥 (Section 3) · ⬜

- **Lessons planned:** The ingestion menu; Auto Loader explained.
- **Missing:** S3 ingestion, Delta Sharing, API intake, Auto Loader, Marketplace,
  UI file upload.

## Module 4 — Querying with Databricks SQL 🔎 (Section 4) · 🚧

| Lesson | Status | Lessons | Quizzes | Diagrams | Examples | Analogies |
|--------|:------:|:-------:|:-------:|:--------:|:--------:|:---------:|
| Asking questions of your data: GROUP BY | ✅ | 13 cards | 1 mcq, 1 t/f, 1 flashcard | 1 (GROUP BY flow) | 1 (customers per region) | 1 (blender) |
| Joins & set operations | ⬜ | — | — | — | — | — |
| Views, materialized views & streaming tables | ⬜ | — | — | — | — | — |
| Delta Lake time travel | ⬜ | — | — | — | — | — |
| SQL Warehouses & the Assistant | ⬜ | — | — | — | — | — |

- **Covered:** aggregate functions (`count`, `count(DISTINCT)`,
  `approx_count_distinct`, `avg`/`mean`, `sum`/`min`/`max`), `GROUP BY`,
  `WHERE` vs `HAVING`, `ORDER BY` ≠ grouping, fixing a query.
- **Missing:** joins (inner/left/right/full, multi-key), `UNION`/`UNION ALL`,
  materialized views vs streaming tables vs dynamic views, time travel + VACUUM,
  SQL Warehouse role, Databricks Assistant (`/explain` etc.), cross-system/federated
  joins, creating managed/external tables from CSV/Parquet/Delta.
- **Future ideas:** interactive join-type visualizer; "spot the bug" query fixer.

## Module 5 — Analyzing & Optimizing Queries ⚡ (Section 5) · ⬜

- **Lessons planned:** Photon; Finding & fixing slow queries; Liquid Clustering.
- **Missing:** Photon features/benefits/workloads, Query Insights & Profiler,
  query history + caching, Liquid Clustering, Delta audit/history validation.

## Module 6 — Dashboards & Visualizations 📊 (Section 6) · ⬜

- **Lessons planned:** Building AI/BI dashboards; Parameters & filters; Alerts & refresh.
- **Missing:** AI/BI dashboards (multi-tab, multi-dataset, widgets), notebook &
  SQL-editor visualizations, parameters, permissions/sharing/embedding, scheduled
  refresh, alerts, choosing the right visualization type.

## Module 7 — AI/BI Genie Spaces 🤖 (Section 7) · ⬜

- **Lessons planned:** What is a Genie space?; Building & optimizing Genie.
- **Missing:** purpose/features/components, creating spaces (sample questions,
  instructions, warehouses, curated datasets, Trusted Assets), permissions &
  distribution, optimization from feedback/benchmarks.

## Module 8 — Data Modeling 🧱 (Section 8) · ⬜

- **Lessons planned:** Star, snowflake & data vault; The Medallion architecture.
- **Missing:** star/snowflake/data-vault schemas, alignment with Medallion
  (bronze/silver/gold).

## Module 9 — Securing Data 🔒 (Section 9) · ⬜

- **Lessons planned:** Roles, grants & sharing; Ownership & PII protection.
- **Missing:** Unity Catalog roles & sharing settings, 3-level namespace for
  governance, table ownership, PII protection best practices.

---

## Platform-level future ideas

- Exam-simulation mode (timed, 45 questions, mixed objectives).
- Spaced-repetition review queue built from missed questions.
- "Explain in your own words" free-text reflection cards.
- Drag-and-drop and ordering exercise card types.
- Per-objective readiness heatmap tied to the official exam outline.
- Optional accounts / cloud sync (currently progress is local-only).
