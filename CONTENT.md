# Content Inventory

The living knowledge inventory for the platform. It must always reflect the
**current state of the application**. Update it in the same change that adds or
edits content.

Status legend: ✅ complete · 🚧 in progress · ⬜ planned

Tracks are grouped the way the app shelves them: **Available** (every lesson
written) and **Coming soon** (still being authored). The split is derived from
lesson statuses by `certificationStatus()`, so it is one thing, not two.

Run `npm run validate` to check this content structurally; the numbers below
can be regenerated from its summary line.

Run `npm run glossary` for the companion view: **which terms the content uses,
and whether each is defined before the learner meets it** →
[`docs/GLOSSARY.md`](docs/GLOSSARY.md).

---

## Available tracks

Fully authored — every lesson is written, so a learner can finish the track.

### Course: Introduction to Data Engineering with Databricks

- **No exam.** This is a course, not a certification — `examFacts` is omitted on
  purpose, and the home card shows lessons/minutes instead of questions/minutes.
- **Audience:** someone who has met *none* of these components. Every other track
  here assumes a working data engineer; this one assumes only general technical
  literacy and answers the question the others skip — *what are all these things,
  and how do they fit together?*
- **Modules:** 4 · **Lessons authored:** 10 of 10 ✅ · **Cards:** 103 · **~62 minutes**
- **Scope discipline:** high-level and abstract. Each lesson says what a component
  **is** and why it exists, then stops. Left out deliberately: Photon, streaming
  tables vs materialized views, Delta Sharing, Marketplace, Lakehouse Federation,
  Asset Bundles, privilege names — all of it lives in the certification tracks.
- **Reading order is the teaching:** the job before the vendor, the problem before
  the product, storage and governance before pipelines, then a capstone that
  assembles everything. No lesson names a component a later lesson is responsible
  for introducing, which is why the glossary report shows **21 ✅ and no ⚠️/❌**
  for this course.

#### Module 1 — The job and the platform 🧭 (Orientation) · ✅

| Lesson | Status | Cards | Checks | Highlights |
|--------|:------:|:-----:|--------|------------|
| What data engineering is | ✅ | 10 | 1 t/f, 1 flashcard | vendor-free on purpose; the job in one sentence; ingest→transform→serve; restaurant-kitchen analogy; batch vs streaming ("how stale is too stale?"); myth "it's just SQL that moves files" |
| What Databricks is | ✅ | 11 | 1 mcq, 1 t/f, 1 flashcard | the product in one sentence; Spark as the engine; unloading-a-truck analogy; data stays in **your** cloud storage; myth "a database you load data into"; Data Intelligence Platform |
| Warehouse, lake, lakehouse | ✅ | 9 | 1 t/f, 1 flashcard | two systems, two answers; warehouse vs lake (compare); the lakehouse as lake storage + warehouse discipline; myth "a lake with a nicer UI" |

#### Module 2 — The two layers everything rests on 🧱 (Foundations) · ✅

| Lesson | Status | Cards | Checks | Highlights |
|--------|:------:|:-----:|--------|------------|
| Delta Lake: files that behave like a table | ✅ | 10 | 1 t/f, 1 flashcard | the dashboard that read half a file; data files + transaction log; ledger analogy; **the log is the table**; commit flow; time travel; myth "proprietary format" |
| Unity Catalog: names, permissions, lineage | ✅ | 11 | 1 mcq, 1 flashcard | three teams, three `customers` tables; `catalog.schema.table` + postal-address analogy; metastore⊃catalog⊃schema⊃object (layers); grants cover future tables; lineage as blast radius |

#### Module 3 — Building a pipeline 🔄 (Pipelines) · ✅

| Lesson | Status | Cards | Checks | Highlights |
|--------|:------:|:-----:|--------|------------|
| Where the work runs | ✅ | 10 | 1 t/f, 1 flashcard | workspace · notebook (inert until compute is attached) · all-purpose vs job cluster · SQL warehouse (compare); DBU as the meter; myth "my tables live on the cluster" |
| Lakeflow: get it in, shape it, schedule it | ✅ | 12 | 1 mcq, 1 flashcard | the 2am pipeline; **umbrella, not a tool**; Connect/Pipelines/Jobs flow with Designer as a front door; Auto Loader glossed; order-the-dish analogy for declarative; myth "Lakeflow is one product" |
| Bronze, silver, gold | ✅ | 10 | 1 t/f, 1 flashcard | which `customers` table is real; the three layers; refinement flow; **why keep bronze** (source systems hold state, not history); myth "a feature you enable" |

#### Module 4 — What the data is for 📊 (Analytics & AI) · ✅

| Lesson | Status | Cards | Checks | Highlights |
|--------|:------:|:-----:|--------|------------|
| Who uses the data, and how | ✅ | 9 | 1 t/f, 1 flashcard | Databricks SQL; AI/BI dashboard Data vs Canvas tabs; Genie runs as the asker; MLflow + Model Serving in one card; four surfaces over one copy (layers); myth "export a CSV for the data scientists" |
| One pipeline, end to end | ✅ | 11 | 1 mcq, 1 t/f, 1 flashcard | "how many orders shipped yesterday, by region?"; the full six-step flow; a card per step naming the component; what was true at every step (Delta, Unity Catalog, DBUs); lineage + bronze as the recovery story |

- **Introduces 21 glossary terms**, each in the lesson that first uses it.
- **Future ideas:** a "which component would you use?" sorting exercise; an
  optional fifth module on cost, since every early mistake is a billing mistake.

---

### Certification: Databricks Certified Data Engineer Professional

- **Exam:** 59 multiple-choice questions · 120 minutes · USD 200 · valid 2 years
- **Source of truth:** `src_material/databricks/databricks-certified-data-engineer-professional`
- **Modules:** 9 (learning-flow order, mapped to the 10 official exam sections)
- **Lessons authored:** 31 of 31 ✅ · **Cards:** 283 · **all 9 official sample
  questions woven in as MCQs**

#### Module P1 — Advanced Development in Python & SQL 🐍 (Section 1) · ✅

| Lesson | Status | Cards | Checks | Highlights |
|--------|:------:|:-----:|--------|------------|
| A Python project that scales | ✅ | 9 | 1 mcq | src-layout package; wheels; `%run` ≠ modularity |
| Installing the right libraries, the right way | ✅ | 9 | 1 mcq, 1 t/f | PyPI/wheel/source; notebook vs cluster scope; restartPython |
| When you need a UDF | ✅ | 9 | 1 mcq | built-in > SQL > Pandas > Python UDF ladder |
| Testing an ETL pipeline | ✅ | 10 | 1 mcq, 1 t/f | DataFrame.transform; assertDataFrameEqual/assertSchemaEqual |

#### Module P2 — Declarative Pipelines & Streaming 🌊 (Section 1) · ✅

| Lesson | Status | Cards | Checks | Highlights |
|--------|:------:|:-----:|--------|------------|
| Pipelines you declare, not orchestrate | ✅ | 10 | 1 mcq, 1 t/f | declarative DAG; expectations (DROP ROW / FAIL UPDATE) |
| Streaming table or materialized view? | ✅ | 8 | 1 mcq | incremental vs maintained result; late-data trap |
| CDC without the plumbing: APPLY CHANGES | ✅ | 8 | 1 mcq, 1 t/f | KEYS/SEQUENCE BY; SCD Type 1 vs 2 |
| Keeping a stream under its SLA | ✅ | 9 | 1 mcq | micro-batch model; trigger interval; **sample Q2** |
| Configs, environments & control flow | ✅ | 9 | 1 mcq, 1 t/f | if/else & for-each; high-memory; disallow retries |

#### Module P3 — Ingestion & Acquisition 📥 (Section 2) · ✅

| Lesson | Status | Cards | Checks | Highlights |
|--------|:------:|:-----:|--------|------------|
| Every format, one landing zone | ✅ | 9 | 1 mcq, 1 t/f | self-describing vs text; binaryFile; land as Delta |
| One append-only table, batch or stream | ✅ | 9 | 1 mcq | checkpoints; idempotent batch (txnAppId / MERGE) |

#### Module P4 — Transformation, Cleansing & Quality 🔄 (Section 3) · ✅

| Lesson | Status | Cards | Checks | Highlights |
|--------|:------:|:-----:|--------|------------|
| Windows, joins & aggregations at scale | ✅ | 10 | 1 mcq, 1 t/f | ROW_NUMBER top-N; broadcast vs shuffle; skew |
| Quarantining bad data | ✅ | 9 | 1 mcq, 1 t/f | valid/inverse split; `_rescued_data`; DROP ROW ≠ retain |

#### Module P5 — Data Modelling with Delta 🏗️ (Section 10) · ✅

| Lesson | Status | Cards | Checks | Highlights |
|--------|:------:|:-----:|--------|------------|
| What the transaction log actually does | ✅ | 11 | 2 mcq | metastore vs data ops; RENAME/DROP; clones; **sample Q1, Q8** |
| Modelling for the questions you ask | ✅ | 10 | 1 mcq, 1 t/f | partition cardinality; star schema; **sample Q3** |
| Liquid Clustering beats partitioning | ✅ | 9 | 1 mcq | CLUSTER BY (AUTO); vs partitioning/ZORDER |

#### Module P6 — Cost & Performance Optimization ⚡ (Section 6) · ✅

| Lesson | Status | Cards | Checks | Highlights |
|--------|:------:|:-----:|--------|------------|
| Why managed tables cost you less | ✅ | 9 | 1 mcq, 1 t/f | predictive optimization; auto OPTIMIZE/VACUUM |
| The files Spark never reads | ✅ | 10 | 1 mcq, 1 t/f | min/max skipping; maxPartitionBytes; deletion vectors; **sample Q7** |
| Reading only what changed: CDF | ✅ | 8 | 1 mcq | table_changes; streaming-table limits |
| Finding the bottleneck in a query | ✅ | 9 | 1 mcq | profile: bad skipping / wrong join / shuffle+spill |

#### Module P7 — Sharing, Federation & Governance 🔗 (Sections 4 + 8) · ✅

| Lesson | Status | Cards | Checks | Highlights |
|--------|:------:|:-----:|--------|------------|
| Sharing live data without copies | ✅ | 9 | 1 mcq | Delta Sharing D2D vs D2O; open protocol |
| Querying data you never ingested | ✅ | 9 | 1 mcq, 1 t/f | Lakehouse Federation; connection + foreign catalog |
| Making data discoverable & governed | ✅ | 9 | 1 mcq | comments/tags; **UC permission inheritance (sample Q4 theme)** |

#### Module P8 — Security & Compliance 🔐 (Section 7) · ✅

| Lesson | Status | Cards | Checks | Highlights |
|--------|:------:|:-----:|--------|------------|
| Least privilege, and never a plaintext password | ✅ | 8 | 1 mcq | ACL levels; secrets `[REDACTED]`; **sample Q6** |
| Same table, different rows per user | ✅ | 9 | 1 mcq, 1 t/f | dynamic views (is_member); row filters/masks; **sample Q4** |
| De-identifying PII the right way | ✅ | 9 | 1 mcq | hashing vs tokenization; suppression; generalization |
| Actually deleting data on request | ✅ | 9 | 1 mcq, 1 t/f | DELETE + VACUUM; retention window; erasure ≠ hide |

#### Module P9 — Monitoring, Debugging & CI/CD 🔍 (Sections 5 + 9) · ✅

| Lesson | Status | Cards | Checks | Highlights |
|--------|:------:|:-----:|--------|------------|
| Seeing what your platform is doing | ✅ | 9 | 1 mcq | system tables (billing/audit); event logs; profilers |
| Being told before users complain | ✅ | 8 | 1 mcq, 1 t/f | SQL Alerts (data quality) vs Jobs notifications (health) |
| When a task fails at 3am | ✅ | 10 | 2 mcq, 1 t/f | partial-failure semantics; repairs; job-cluster cost; **sample Q9, Q5** |
| Shipping with Asset Bundles & Git | ✅ | 10 | 1 mcq, 1 t/f | databricks.yml; targets; Git Folders; CI/CD |

- **Sample-question coverage:** all 9 official sample questions are woven into
  authored MCQs (Q1/Q8 → Delta internals, Q2 → streaming tuning, Q3 →
  dimensional modelling, Q4 → dynamic views + inheritance, Q5/Q9 → jobs, Q6 →
  secrets, Q7 → data skipping).
- **Future ideas:** a mixed-section mock exam; Spark UI / query-profile
  screenshot walkthroughs; hands-on SQL sandbox cards.

---

### Certification: Databricks Certified Data Engineer Associate

- **Exam:** 45 multiple-choice questions · 90 minutes · USD 200 · valid 2 years
- **Source of truth:** `src_material/databricks/databricks-certified-data-engineer-associate`
- **Modules:** 7 (mirroring the 7 official exam sections)
- **Lessons authored:** 27 of 27 ✅ · **Cards:** 272 · all 5 official sample
  questions woven in as MCQs

#### Module E1 — The Data Intelligence Platform 🧠 (Section 1, 6%) · ✅

| Lesson | Status | Cards | Checks | Diagrams | Highlights |
|--------|:------:|:-----:|--------|----------|------------|
| What Databricks actually is | ✅ | 13 | 1 mcq, 1 t/f, 1 flashcard | platform shape (layers) | orientation lesson — vendor vocabulary only, not generic DE; DBU as the cost lens; "you don't load data into Databricks" |
| Why the lakehouse exists | ✅ | 11 | 1 mcq, 1 flashcard | architecture (compare) | library/storage-unit analogy; time-travel SQL; sample Q2 |
| Lakeflow: the word in front of everything | ✅ | 14 | 1 mcq, 1 t/f, 1 flashcard | the four members (flow) | Connect/Pipelines/Designer/Jobs; DLT→Lakeflow renames; Jobs vs Pipelines |
| Picking the right compute | ✅ | 10 | 1 mcq, 1 t/f, 1 flashcard | compute menu (compare) | DBU cost model; sample Q4 |

#### Module E2 — Ingesting Data 📥 (Section 2, 21%) · ✅

| Lesson | Status | Cards | Checks | Diagrams | Highlights |
|--------|:------:|:-----:|--------|----------|------------|
| Batch, streaming, or incremental? | ✅ | 10 | 1 mcq, 1 t/f, 1 flashcard | source→bronze (flow) | audit-log delivery contract; sample Q3 |
| COPY INTO | ✅ | 8 | 1 mcq, 1 flashcard | — | idempotency; FORMAT/COPY_OPTIONS |
| Auto Loader | ✅ | 11 | 1 mcq, 1 flashcard | pipeline (flow) | mail-carrier analogy; schema evolution; `_rescued_data`; availableNow |
| Lakeflow Connect & choosing a method | ✅ | 10 | 1 mcq, 1 t/f | sources (flow) | managed vs standard connectors; JDBC/REST; nested JSON; decision guide |

#### Module E3 — Transforming with PySpark 🔄 (Section 3, 22%) · ✅

| Lesson | Status | Cards | Checks | Diagrams | Highlights |
|--------|:------:|:-----:|--------|----------|------------|
| Bronze to silver | ✅ | 10 | 1 mcq, 1 flashcard | medallion (flow) | restaurant analogy; dropna/fillna/cast; constraints & expectations |
| Joins & unions | ✅ | 11 | 1 mcq, 1 t/f, 1 flashcard | inner vs left (compare) | broadcast joins; union() = UNION ALL trap |
| Reshaping tables | ✅ | 10 | 1 mcq, 1 t/f | explode (flow) | withColumn/split/filter/explode; grain awareness |
| Deduplication & aggregation | ✅ | 9 | 1 mcq, 1 flashcard | — | dropDuplicates keys; approx_count_distinct; summary() |
| Gold layer objects | ✅ | 10 | 1 mcq, 1 t/f, 1 flashcard | freshness vs speed (compare) | table vs view vs MV vs streaming table |
| Lakeflow Pipelines | ✅ | 15 | 1 mcq, 1 t/f, 1 flashcard | one pipeline, several tables (flow) | satnav analogy; streaming table vs MV by *source behaviour*; **`ON VIOLATION` defaults to warn** |

#### Module E4 — Orchestrating with Lakeflow Jobs 🗓️ (Section 4, 16%) · ✅

| Lesson | Status | Cards | Checks | Diagrams | Highlights |
|--------|:------:|:-----:|--------|----------|------------|
| Jobs, tasks & the DAG | ✅ | 9 | 1 mcq, 1 flashcard | nightly job (flow) | recipe analogy; fan-out/fan-in; failure isolation |
| Control flow | ✅ | 9 | 1 mcq, 1 t/f | resilient pipeline (flow) | retries + idempotency; if/else; run-if; for-each |
| Triggers | ✅ | 8 | 1 mcq, 1 flashcard | time vs data-driven (compare) | cron vs file-arrival vs table-update |

#### Module E5 — CI/CD & Asset Bundles 🚀 (Section 5, 10%) · ✅

| Lesson | Status | Cards | Checks | Diagrams | Highlights |
|--------|:------:|:-----:|--------|----------|------------|
| Git folders | ✅ | 8 | 1 mcq, 1 t/f | idea→merged (flow) | PRs live in the provider; branch workflow |
| Asset Bundles | ✅ | 11 | 1 mcq, 1 flashcard | promotion path (flow) | container analogy; databricks.yml; targets/variables; CLI verbs; sample Q5 |

#### Module E6 — Optimization & Troubleshooting 🔬 (Sections 3 + 6) · ✅

| Lesson | Status | Cards | Checks | Diagrams | Highlights |
|--------|:------:|:-----:|--------|----------|------------|
| Reading the Spark UI | ✅ | 9 | 1 mcq, 1 flashcard | triage (flow) | skew/shuffle/spill signatures; AQE; sample Q1 |
| The four tuning knobs | ✅ | 10 | 1 mcq, 1 flashcard | symptom→knob (compare) | shuffle.partitions; memory; broadcast threshold; re-measure rule |
| Monitoring jobs | ✅ | 8 | 1 mcq, 1 flashcard | failed run (flow) | run-history baselines; upstream blockers; repair runs |
| Liquid Clustering & predictive optimization | ✅ | 10 | 1 mcq, 1 t/f, 1 flashcard | — | supermarket analogy; CLUSTER BY AUTO; auto-maintenance |
| Cluster triage | ✅ | 9 | 1 mcq, 1 flashcard | triage map (flow) | startup/capacity; library scoping; driver vs executor OOM |

#### Module E7 — Governance & Security 🔐 (Section 7, 15%) · ✅

| Lesson | Status | Cards | Checks | Diagrams | Highlights |
|--------|:------:|:-----:|--------|----------|------------|
| Managed vs external tables | ✅ | 9 | 1 mcq, 1 flashcard | DROP behavior (compare) | LOCATION clause; SET MANAGED conversion |
| GRANT, REVOKE, DENY & the hierarchy | ✅ | 10 | 1 mcq, 1 t/f | securables (layers) | keycard analogy; inheritance; groups & service principals |
| Row filters, masks & ABAC | ✅ | 10 | 1 mcq, 1 flashcard | per-object vs ABAC (compare) | filter/mask functions; tag-driven policies |

- **Future ideas:** hands-on SQL sandbox cards; Spark UI screenshot walkthroughs;
  a mixed-section mock exam.

---

### Certification: Databricks Certified Data Analyst Associate

- **Exam:** 45 multiple-choice questions · 90 minutes · valid 2 years
- **Source of truth:** `src_material/databricks/databricks-certified-data-analyst-associate`
- **Modules:** 9 (mirroring the 9 official exam sections, ordered for learning flow)
- **Lessons authored:** 30 of 30 ✅ · **Cards:** 341 · all 10 official sample
  questions woven in as MCQs
- **Two lessons the exam never lists as topics:** *What Databricks is, for an
  analyst* and *Unity Catalog: the layer everything else assumes*. Nothing in
  either is an exam question by itself; everything in both is assumed by every
  exam question. Unity Catalog is named in **five of the nine** sections.
- **Product naming:** the exam guide's names are taught first, with the current
  ones noted — *Genie spaces* → **Genie Agents**, *Databricks Assistant* →
  **Genie Code**, *DeltaLive tables* → **Lakeflow Pipelines**. Verified against
  the docs in `src_material/.../research/platform-and-naming.md`.

#### Module 1 — The Platform & Unity Catalog 🏛️ (Sections 1, 9) · ✅

| Lesson | Status | Cards | Checks | Highlights |
|--------|:------:|:-----:|--------|------------|
| What Databricks is, for an analyst | ✅ | 11 | 1 mcq, 1 t/f, 1 flashcard | orientation from zero; lakehouse in one card; workspace/SQL editor/warehouse vocabulary; DBU; myth "Databricks is a database" |
| Unity Catalog: the layer everything else assumes | ✅ | 15 | 1 mcq, 1 t/f, 1 flashcard | metastore→catalog→schema→object (layers); securables and owners; **`SELECT` + `USE CATALOG` + `USE SCHEMA`**; inheritance to future tables; lineage/audit/search for free |
| Where does your data live? The 3-level namespace | ✅ | 12 | 1 mcq, 1 t/f, 1 flashcard | postal-address analogy; managed vs external (diagram); `CREATE OR REPLACE` keeps grants + history (sample Q6, Q9) |
| The pieces of the platform | ✅ | 12 | 1 mcq, 1 t/f, 1 flashcard | Delta Lake · Databricks SQL · Lakeflow · Mosaic AI · Data Intelligence Engine · Marketplace; DLT renamed twice |
| Catalog Explorer: your window on the data | ✅ | 11 | 1 mcq, 1 flashcard | Details/Permissions/Lineage tabs; table vs view (compare); certified = a steward vouches; column-level lineage |

- **Covered:** the whole of Section 1 plus the namespace half of Section 9.
- **Future ideas:** a clickable Catalog Explorer mock; "build the full table
  name" drag exercise.

#### Module 2 — Managing & Cleaning Data 🧹 (Section 2) · ✅

| Lesson | Status | Cards | Checks | Highlights |
|--------|:------:|:-----:|--------|------------|
| Finding data you can trust | ✅ | 10 | 1 mcq, 1 t/f, 1 flashcard | search covers comments and is permission-filtered; the four trust signals; tags incl. `pii=email`; `APPLY TAG` |
| Cleaning data in SQL | ✅ | 12 | 1 mcq, 1 flashcard | nulls skew `AVG`; `COALESCE`/`NULLIF`/`try_cast`; dedupe by key with `ROW_NUMBER`; clean into a view or CTAS, never the source; `= NULL` matches nothing |

#### Module 3 — Importing Data 📥 (Section 3) · ✅

| Lesson | Status | Cards | Checks | Highlights |
|--------|:------:|:-----:|--------|------------|
| Six ways data arrives | ✅ | 12 | 1 mcq, 1 t/f, 1 flashcard | UI upload · cloud storage · Delta Sharing · API · Auto Loader · Marketplace; copy-vs-connect (compare); choose by location then frequency |
| Auto Loader: files that keep arriving | ✅ | 10 | 1 mcq, 1 flashcard | bookmark analogy; checkpoint = exactly-once; `STREAM read_files()` in a streaming table; schema evolution + `_rescued_data` |

#### Module 4 — Querying with Databricks SQL 🔎 (Section 4) · ✅

| Lesson | Status | Cards | Checks | Highlights |
|--------|:------:|:-----:|--------|------------|
| Where your SQL actually runs | ✅ | 11 | 1 mcq, 1 t/f, 1 flashcard | warehouse = compute, not storage; size vs scaling (tills analogy); serverless + auto-stop; Assistant `/explain` (sample Q2) |
| Filtering & sorting a table | ✅ | 11 | 1 mcq, 1 t/f, 1 flashcard | `WHERE`/`ORDER BY`/`LIMIT`/`DISTINCT`; `AND` binds tighter than `OR`; **keep functions off the filtered column** so files can be skipped |
| Asking questions of your data: GROUP BY | ✅ | 15 | 2 mcq, 1 t/f, 1 flashcard | aggregate functions incl. `approx_count_distinct`; `WHERE` vs `HAVING`; notebook data profile — stats + histograms (sample Q1); missing `GROUP BY` (sample Q7) |
| Joins, unions & querying across systems | ✅ | 12 | 1 mcq, 1 t/f, 1 flashcard | who survives each join (compare); multi-key joins and row multiplication; `UNION` vs `UNION ALL`; **federated join** via foreign catalog |
| Creating tables of your own | ✅ | 11 | 1 mcq, 1 t/f, 1 flashcard | `LOCATION` = external; CTAS from CSV + Parquet + Delta into one governed table; `DROP`+`CREATE` discards grants and history |
| Views, materialized views & streaming tables | ✅ | 12 | 1 mcq, 1 t/f, 1 flashcard | four objects compared; refresh is incremental or full; **refreshes run on serverless, not your warehouse**; dynamic = *who*, materialized = *when* (sample Q3) |
| Delta Lake time travel | ✅ | 11 | 1 mcq, 1 t/f, 1 flashcard | `DESCRIBE HISTORY` as audit trail; `VERSION`/`TIMESTAMP AS OF`; `RESTORE`; **`VACUUM` ends time travel** (sample Q4) |

#### Module 5 — Analyzing & Optimizing Queries ⚡ (Section 5) · ✅

| Lesson | Status | Cards | Checks | Highlights |
|--------|:------:|:-----:|--------|------------|
| Photon: the engine underneath | ✅ | 11 | 1 mcq, 1 t/f, 1 flashcard | vectorized C++, Spark-compatible; on by default for SQL warehouses; **no gain under ~2 s**; different DBU rate |
| Finding and fixing a slow query | ✅ | 11 | 1 mcq, 1 t/f, 1 flashcard | history filters + metrics (sample Q10, multi-select); profile symptoms → fixes (flow); result vs disk cache; the wrong-answer checklist |
| Liquid Clustering: making filters fast | ✅ | 11 | 1 mcq, 1 t/f, 1 flashcard | min/max skipping needs grouped values; `CLUSTER BY` and `CLUSTER BY AUTO`; keys change without a rewrite; replaces partitioning |

#### Module 6 — Dashboards & Visualizations 📊 (Section 6) · ✅

| Lesson | Status | Cards | Checks | Highlights |
|--------|:------:|:-----:|--------|------------|
| Building an AI/BI dashboard | ✅ | 12 | 1 mcq, 1 t/f, 1 flashcard | Data tab vs Canvas tab; one dataset feeding many widgets; pages; global/page/widget filters; draft vs published |
| Choosing a chart that communicates | ✅ | 10 | 1 mcq, 1 t/f, 1 flashcard | question → chart type; sort bars, zero baseline; pie only for 2–3 slices; charts from the SQL editor and notebooks |
| Parameters: one query, many answers | ✅ | 10 | 1 mcq, 1 t/f, 1 flashcard | `:start_date` markers; widget re-runs the query with the value in `WHERE` (sample Q8); defaults; test the empty case |
| Sharing a dashboard, and keeping it fresh | ✅ | 11 | 1 mcq, 1 t/f, 1 flashcard | CAN VIEW/EDIT/MANAGE; publisher credentials vs viewer permissions; account-level sharing and iframes; refresh schedule + subscriptions |
| Alerts: being told, not watching | ✅ | 9 | 1 mcq, 1 t/f, 1 flashcard | query + threshold + destination + schedule (sample Q5); alert on a smoothed window; a green job ≠ good data |

#### Module 7 — AI/BI Genie Spaces 🤖 (Section 7) · ✅

| Lesson | Status | Cards | Checks | Highlights |
|--------|:------:|:-----:|--------|------------|
| What is a Genie space? | ✅ | 11 | 1 mcq, 1 t/f | briefed-colleague analogy; data + instructions + samples + trusted assets; runs with the **asker's** permissions; Genie space → Genie Agent |
| Building & improving a Genie space | ✅ | 12 | 1 mcq, 1 t/f, 1 flashcard | up to 30 tables, pro/serverless warehouse; instructions carry business rules; CAN MANAGE/EDIT/VIEW + `SELECT`; feedback and benchmarks |

#### Module 8 — Data Modeling 🧱 (Section 8) · ✅

| Lesson | Status | Cards | Checks | Highlights |
|--------|:------:|:-----:|--------|------------|
| Star, snowflake & data vault | ✅ | 11 | 1 mcq, 1 t/f, 1 flashcard | facts vs dimensions; star = one join away; snowflake normalises; hubs/links/satellites; one consistent grain |
| Bronze, silver, gold | ✅ | 11 | 1 mcq, 1 t/f, 1 flashcard | what changes per hop; restaurant analogy; **star lives in gold, data vault in silver**; a convention, not a feature |

#### Module 9 — Securing Data 🔒 (Section 9) · ✅

| Lesson | Status | Cards | Checks | Highlights |
|--------|:------:|:-----:|--------|------------|
| Roles, grants & sharing settings | ✅ | 12 | 1 mcq, 1 t/f, 1 flashcard | users/groups/service principals; **data privileges vs object ACLs** (compare); `SHOW GRANTS`; revoke where it was granted |
| Ownership & protecting personal data | ✅ | 11 | 1 mcq, 1 t/f, 1 flashcard | own with a group; classify then protect; masks vs row filters; one masked table beats filtered copies; deletion ≠ erasure until `VACUUM` |

- **Future ideas:** a hands-on SQL sandbox card type; a mixed-section mock exam;
  a clickable dashboard-builder walkthrough.
- **Quiz coverage:** all 30 lessons contain at least one interactive check (58
  MCQ/true-false cards total), so all 9 modules support practice mode, exam mode
  and the targeted struggle-review queue.

---

## Coming soon

Scoped and partly written. These are shelved separately in the app: the home
page lists them under **Coming soon** and reports *lessons written* rather than
the learner's progress, so a track that stops after Module 1 is never presented
as one you can finish. Nothing marks the shelf by hand — `certificationStatus()`
derives it from lesson statuses, and authoring the last lesson moves the track up
into *Available*.

### Certification: Databricks Certified Generative AI Engineer Associate

- **Exam:** 45 questions · 90 minutes · USD 200 · valid 2 years
- **Source of truth:** `src_material/databricks/databricks-certified-generative-ai-engineer-associate`
- **Modules:** 8 (RAG build-arc order, mapped to the 6 official exam sections)
- **Lessons authored:** 4 of 35 · **Cards:** 48 · **Recommended:** 6+ months hands-on GenAI on Databricks
- **Product naming:** the exam guide uses **Mosaic AI** names; current docs have
  renamed several (Vector Search → *Databricks AI Search*). Lessons lead with the
  **exam guide's** name and note the current one. Research + sources:
  `src_material/databricks/databricks-certified-generative-ai-engineer-associate/research/`.

#### Module GA1 — GenAI Foundations on Databricks 🧠 (Design Applications) · ✅

| Lesson | Status | Cards | Checks | Highlights |
|--------|:------:|:-----:|--------|------------|
| How large language models actually work | ✅ | 12 | 1 mcq, 1 t/f, 1 flashcard | autocomplete analogy; generation-loop flow; tokens ≈ 4 chars; context window as a desk; myth "bigger window beats retrieval"; temperature ≠ truthfulness |
| Embeddings and vector similarity | ✅ | 11 | 1 mcq, 1 t/f, 1 flashcard | map-of-meaning analogy; keyword vs semantic (compare); **HNSW/L2 vs cosine needs normalizing**; one model for query + docs |
| RAG, fine-tuning, or just prompting? | ✅ | 13 | 1 mcq, 1 t/f, 1 flashcard | new-hire analogy; retrieve-then-generate flow (simplified; GA4 completes it); RAG-vs-fine-tune (compare); myth "fine-tune on our docs" |
| The Databricks GenAI stack (Mosaic AI) | ✅ | 12 | 1 mcq, 1 t/f, 1 flashcard | stack as layers under UC; **four** index types; FM API modes; myth "the index is a copy you refresh" |

#### Module GA2 — Designing GenAI Applications 🎯 (Design Applications, 14%) · ⬜

| Lesson | Status | Notes |
|--------|:------:|-------|
| From business problem to GenAI pipeline | ⬜ | Requirement → inputs/outputs/tasks |
| Designing prompt–response pairs | ⬜ | Work backward from the needed output |
| Choosing models, tools, and chain components | ⬜ | Model tasks, retrievers, tool access |
| When one prompt isn’t enough | ⬜ | Multi-stage task decomposition |

#### Module GA3 — Preparing Data for Retrieval 📚 (Data Preparation, 14%) · ⬜

| Lesson | Status | Notes |
|--------|:------:|-------|
| Extracting text from messy documents | ⬜ | Python extraction tools; filtering noise |
| Chunking: size, overlap, and structure | ⬜ | Chunk trade-offs vs context/precision |
| From chunks to embeddings | ⬜ | Embedding into a vector store; metadata |
| Garbage in, garbage out | ⬜ | Source-data quality caps RAG quality |

#### Module GA4 — Building RAG Applications 🔗 (Application Development, 30%) · ⬜

| Lesson | Status | Notes |
|--------|:------:|-------|
| The anatomy of a RAG application | ⬜ | Retrieve-then-generate loop end to end |
| Retrieving context with Vector Search | ⬜ | Querying the index; metadata filters |
| Orchestrating with chains | ⬜ | LangChain-style wiring of prompts/models |
| Augmenting prompts with retrieved context | ⬜ | Inject chunks so it answers from your data |
| Prompt engineering that works | ⬜ | Instructions, examples, templates |

#### Module GA5 — Guardrails, Hallucinations & Model Choice 🛡️ (Application Development, 30%) · ⬜

| Lesson | Status | Notes |
|--------|:------:|-------|
| Guardrails: keeping the model in bounds | ⬜ | Constrain inputs/outputs for safety |
| Reducing hallucinations | ⬜ | Grounding techniques for factual answers |
| Defending against prompt injection | ⬜ | Malicious input hijacking a prompt |
| Choosing the right model | ⬜ | Context window vs quality/cost/latency |
| Agents and tools: giving the model hands | ⬜ | When to let a model call tools/act |

#### Module GA6 — Assembling & Deploying 🚀 (Assembling and Deploying Applications, 22%) · ⬜

| Lesson | Status | Notes |
|--------|:------:|-------|
| Packaging a chain with MLflow | ⬜ | Log a RAG chain (pyfunc / LangChain flavor) |
| Registering models in Unity Catalog | ⬜ | UC model registry; versions & aliases |
| Creating and syncing a Vector Search index | ⬜ | Index over a Delta table; keep it current |
| Serving models and endpoints | ⬜ | Mosaic AI Model Serving for real-time |
| Foundation Model APIs and external models | ⬜ | Pay-per-token vs provisioned; external routing |
| Deploying an end-to-end RAG app | ⬜ | Sequence index → chain → register → serve |

#### Module GA7 — Governance & Security 🔐 (Governance, 8%) · ⬜

| Lesson | Status | Notes |
|--------|:------:|-------|
| Governing GenAI with Unity Catalog | ⬜ | Models, indexes, data under one model |
| Masking and protecting sensitive data | ⬜ | PII out of prompts/logs/responses |
| Legal, licensing, and data provenance | ⬜ | Data-source and model-license terms |

#### Module GA8 — Evaluation & Monitoring 📊 (Evaluation and Monitoring, 12%) · ⬜

| Lesson | Status | Notes |
|--------|:------:|-------|
| How do you grade an LLM? | ⬜ | Faithfulness, relevance, toxicity, correctness |
| Evaluating with MLflow and LLM-as-a-judge | ⬜ | MLflow evaluate; model scores model |
| Monitoring GenAI in production | ⬜ | Inference tables; Lakehouse Monitoring |
| Controlling cost and latency | ⬜ | Fast & affordable without wrecking quality |

- **Weightings:** Design 14% · Data Prep 14% · **App Dev 30% (split GA4 + GA5)** ·
  Assemble & Deploy 22% · Governance 8% · Eval & Monitoring 12%.
- **Next step:** **Module GA2 (Designing GenAI Applications)**, authored a whole
  module at a time following the loop in `CLAUDE.md` — research → outline →
  review → author → sync.

---

### Certification: GitHub Copilot (GH-300)

- **Exam:** ~55–65 questions · 100 minutes · pass at 700/1000 · valid ~2 years
- **Source of truth:** `src_material/github/gh-300-github-copilot`
- **Modules:** 8 (learning-flow order, mapped to the 6 official skill domains)
- **Lessons authored:** 3 of 27 · **Skills measured as of** January 2026

#### Module G1 — Meet GitHub Copilot 🚀 (Use GitHub Copilot features) · ✅

| Lesson | Status | Cards | Checks | Highlights |
|--------|:------:|:-----:|--------|------------|
| What is GitHub Copilot? | ✅ | 13 | 1 mcq, 1 t/f, 1 flashcard | pair-programmer analogy; inline vs Chat (compare); generates ≠ searches; you stay the pilot |
| Which Copilot: Free, Pro, Business, or Enterprise? | ✅ | 12 | 1 mcq, 1 t/f, 1 flashcard | individual vs org families; capability ladder (flow); governance starts at Business |
| Getting set up in your IDE | ✅ | 11 | 1 mcq, 1 t/f, 1 flashcard | three ingredients (access+extension+sign-in); setup flow; seat must be assigned |

#### Module G2 — How Copilot Works: Data & Architecture 🧠 (Understand data and architecture) · ⬜

| Lesson | Status | Notes |
|--------|:------:|-------|
| Where your code goes and how it is used | ⬜ | Data flow/sharing; prompt building; proxy filtering; post-processing |
| The life of a code suggestion | ⬜ | Suggestion request lifecycle |
| What LLMs (and Copilot) can and cannot do | ⬜ | LLM/Copilot limitations |

#### Module G3 — Using Copilot Responsibly ⚖️ (Use GitHub Copilot responsibly) · ⬜

| Lesson | Status | Notes |
|--------|:------:|-------|
| Risks and limitations of generative AI | ⬜ | Hallucination, bias, IP, over-reliance |
| Ethical and responsible AI use | ⬜ | Potential harms + mitigation strategies |
| Trust, but verify: validating AI output | ⬜ | Why/how to validate; operate responsibly |

#### Module G4 — Prompt Engineering & Context 💬 (Apply prompt engineering and context crafting) · ⬜

| Lesson | Status | Notes |
|--------|:------:|-------|
| Anatomy of a good prompt | ⬜ | Prompt structure and context |
| How Copilot builds context | ⬜ | Open files, selection, neighboring tabs |
| Zero-shot and few-shot prompting | ⬜ | When to show examples |
| Prompt-crafting best practices | ⬜ | Principles; process flow; chat-history use |

#### Module G5 — Copilot Features in Depth 🛠️ (Use GitHub Copilot features) · ⬜

| Lesson | Status | Notes |
|--------|:------:|-------|
| Inline suggestions, Chat, and Plan Mode | ⬜ | Triggers; Chat limits/options/feedback/commands |
| GitHub Copilot in the command line | ⬜ | CLI install, commands, sessions, scripts |
| Agent Mode, Edit Mode, and MCP | ⬜ | Autonomous work; sub-agents/sessions; MCP |
| Code review, Spaces, Spark, and PR summaries | ⬜ | Review, PR summaries, Spaces, instructions files |

#### Module G6 — Boosting Developer Productivity 📈 (Improve developer productivity) · ⬜

| Lesson | Status | Notes |
|--------|:------:|-------|
| Generating, refactoring, and documenting code | ⬜ | Everyday SDLC wins |
| Learning faster and modernizing legacy code | ⬜ | Context switching; sample data; modernization |
| Writing tests with Copilot | ⬜ | Unit/integration tests; edge cases; assertions |
| Security and performance improvements | ⬜ | Security fixes; performance optimizations |

#### Module G7 — Privacy, Exclusions & Safeguards 🔒 (Configure privacy, content exclusions, and safeguards) · ⬜

| Lesson | Status | Notes |
|--------|:------:|-------|
| Content exclusions and editor settings | ⬜ | What Copilot can/can't see |
| Who owns Copilot’s output? | ⬜ | Output ownership + limitations |
| Duplication detection and security warnings | ⬜ | Safeguards + troubleshooting |

#### Module G8 — Administration & Governance 🏢 (Use GitHub Copilot features) · ⬜

| Lesson | Status | Notes |
|--------|:------:|-------|
| Organization-wide policies and settings | ⬜ | Policies; Code Review policy; feature availability |
| Auditing Copilot with audit-log events | ⬜ | Audit-log events |
| Managing subscriptions with the REST API | ⬜ | Seat/subscription management via REST API |

- **Domain weightings:** Responsible (15–20%) · Features (25–30%, split across G5 + G8) ·
  Data & architecture (10–15%) · Prompt engineering (10–15%) · Productivity (10–15%) ·
  Privacy & safeguards (10–15%).
- **Next step:** author lessons one at a time with the `author-lesson` skill,
  flipping each ⬜ to ✅.

---

## Quiz coverage across the platform

Every `mcq` / `truefalse` card in a written lesson is automatically a question in
its module's quiz — there is no separate bank. A module needs 3 to open one.
`npm run validate` prints the totals and warns on any **complete** module that
cannot fill a quiz.

| Track | Questions | Complete modules that can fill a quiz |
|-------|:---------:|:-------------------------------------:|
| Data Analyst Associate | 58 | 9 / 9 |
| Data Engineer Professional | 50 | 9 / 9 |
| Data Engineer Associate | 40 | 7 / 7 |
| Introduction to Data Engineering | 13 | 4 / 4 |
| GenAI Engineer Associate | 8 | 1 / 1 authored |
| GitHub Copilot (GH-300) | 6 | 1 / 1 authored |
| **Total** | **175** | **31 / 31** |

## Platform-level future ideas

- Exam-simulation mode (timed, 45 questions, mixed objectives) — the attempt
  already owns its `questionIds`, so this is a different pool plus a clock.
- Adaptive spaced-repetition scheduling on top of the struggle-review queue.
- Authored question banks per module, on top of the generated pool.
- "Explain in your own words" free-text reflection cards.
- Drag-and-drop and ordering exercise card types.
- Per-objective readiness heatmap tied to the official exam outline.
- Optional accounts / cloud sync (currently progress is local-only).
