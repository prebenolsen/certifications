# Content Inventory

The living knowledge inventory for the platform. It must always reflect the
**current state of the application**. Update it in the same change that adds or
edits content.

Status legend: ✅ complete · 🚧 in progress · ⬜ planned

Run `npm run validate` to check this content structurally; the numbers below
can be regenerated from its summary line.

---

## Certification: Databricks Certified Generative AI Engineer Associate

- **Exam:** 45 questions · 90 minutes · USD 200 · valid 2 years
- **Source of truth:** `src_material/databricks/databricks-certified-generative-ai-engineer-associate`
- **Modules:** 8 (RAG build-arc order, mapped to the 6 official exam sections)
- **Lessons authored:** 0 of 35 · **Recommended:** 6+ months hands-on GenAI on Databricks

### Module GA1 — GenAI Foundations on Databricks 🧠 (Design Applications) · ⬜

| Lesson | Status | Notes |
|--------|:------:|-------|
| How large language models actually work | ⬜ | Tokens, next-token prediction, context windows |
| Embeddings and vector similarity | ⬜ | Meaning as distance; basis of semantic search |
| RAG, fine-tuning, or just prompting? | ⬜ | Choosing how to add knowledge/behavior |
| The Databricks GenAI stack (Mosaic AI) | ⬜ | Vector Search, Model Serving, FM APIs, MLflow, UC |

### Module GA2 — Designing GenAI Applications 🎯 (Design Applications, 14%) · ⬜

| Lesson | Status | Notes |
|--------|:------:|-------|
| From business problem to GenAI pipeline | ⬜ | Requirement → inputs/outputs/tasks |
| Designing prompt–response pairs | ⬜ | Work backward from the needed output |
| Choosing models, tools, and chain components | ⬜ | Model tasks, retrievers, tool access |
| When one prompt isn’t enough | ⬜ | Multi-stage task decomposition |

### Module GA3 — Preparing Data for Retrieval 📚 (Data Preparation, 14%) · ⬜

| Lesson | Status | Notes |
|--------|:------:|-------|
| Extracting text from messy documents | ⬜ | Python extraction tools; filtering noise |
| Chunking: size, overlap, and structure | ⬜ | Chunk trade-offs vs context/precision |
| From chunks to embeddings | ⬜ | Embedding into a vector store; metadata |
| Garbage in, garbage out | ⬜ | Source-data quality caps RAG quality |

### Module GA4 — Building RAG Applications 🔗 (Application Development, 30%) · ⬜

| Lesson | Status | Notes |
|--------|:------:|-------|
| The anatomy of a RAG application | ⬜ | Retrieve-then-generate loop end to end |
| Retrieving context with Vector Search | ⬜ | Querying the index; metadata filters |
| Orchestrating with chains | ⬜ | LangChain-style wiring of prompts/models |
| Augmenting prompts with retrieved context | ⬜ | Inject chunks so it answers from your data |
| Prompt engineering that works | ⬜ | Instructions, examples, templates |

### Module GA5 — Guardrails, Hallucinations & Model Choice 🛡️ (Application Development, 30%) · ⬜

| Lesson | Status | Notes |
|--------|:------:|-------|
| Guardrails: keeping the model in bounds | ⬜ | Constrain inputs/outputs for safety |
| Reducing hallucinations | ⬜ | Grounding techniques for factual answers |
| Defending against prompt injection | ⬜ | Malicious input hijacking a prompt |
| Choosing the right model | ⬜ | Context window vs quality/cost/latency |
| Agents and tools: giving the model hands | ⬜ | When to let a model call tools/act |

### Module GA6 — Assembling & Deploying 🚀 (Assembling and Deploying Applications, 22%) · ⬜

| Lesson | Status | Notes |
|--------|:------:|-------|
| Packaging a chain with MLflow | ⬜ | Log a RAG chain (pyfunc / LangChain flavor) |
| Registering models in Unity Catalog | ⬜ | UC model registry; versions & aliases |
| Creating and syncing a Vector Search index | ⬜ | Index over a Delta table; keep it current |
| Serving models and endpoints | ⬜ | Mosaic AI Model Serving for real-time |
| Foundation Model APIs and external models | ⬜ | Pay-per-token vs provisioned; external routing |
| Deploying an end-to-end RAG app | ⬜ | Sequence index → chain → register → serve |

### Module GA7 — Governance & Security 🔐 (Governance, 8%) · ⬜

| Lesson | Status | Notes |
|--------|:------:|-------|
| Governing GenAI with Unity Catalog | ⬜ | Models, indexes, data under one model |
| Masking and protecting sensitive data | ⬜ | PII out of prompts/logs/responses |
| Legal, licensing, and data provenance | ⬜ | Data-source and model-license terms |

### Module GA8 — Evaluation & Monitoring 📊 (Evaluation and Monitoring, 12%) · ⬜

| Lesson | Status | Notes |
|--------|:------:|-------|
| How do you grade an LLM? | ⬜ | Faithfulness, relevance, toxicity, correctness |
| Evaluating with MLflow and LLM-as-a-judge | ⬜ | MLflow evaluate; model scores model |
| Monitoring GenAI in production | ⬜ | Inference tables; Lakehouse Monitoring |
| Controlling cost and latency | ⬜ | Fast & affordable without wrecking quality |

- **Weightings:** Design 14% · Data Prep 14% · **App Dev 30% (split GA4 + GA5)** ·
  Assemble & Deploy 22% · Governance 8% · Eval & Monitoring 12%.
- **Next step:** author lessons one at a time with the `author-lesson` skill,
  flipping each ⬜ to ✅.

---

## Certification: GitHub Copilot (GH-300)

- **Exam:** ~55–65 questions · 100 minutes · pass at 700/1000 · valid ~2 years
- **Source of truth:** `src_material/github/gh-300-github-copilot`
- **Modules:** 8 (learning-flow order, mapped to the 6 official skill domains)
- **Lessons authored:** 3 of 27 · **Skills measured as of** January 2026

### Module G1 — Meet GitHub Copilot 🚀 (Use GitHub Copilot features) · ✅

| Lesson | Status | Cards | Checks | Highlights |
|--------|:------:|:-----:|--------|------------|
| What is GitHub Copilot? | ✅ | 13 | 1 mcq, 1 t/f, 1 flashcard | pair-programmer analogy; inline vs Chat (compare); generates ≠ searches; you stay the pilot |
| Which Copilot: Free, Pro, Business, or Enterprise? | ✅ | 12 | 1 mcq, 1 t/f, 1 flashcard | individual vs org families; capability ladder (flow); governance starts at Business |
| Getting set up in your IDE | ✅ | 11 | 1 mcq, 1 t/f, 1 flashcard | three ingredients (access+extension+sign-in); setup flow; seat must be assigned |

### Module G2 — How Copilot Works: Data & Architecture 🧠 (Understand data and architecture) · ⬜

| Lesson | Status | Notes |
|--------|:------:|-------|
| Where your code goes and how it is used | ⬜ | Data flow/sharing; prompt building; proxy filtering; post-processing |
| The life of a code suggestion | ⬜ | Suggestion request lifecycle |
| What LLMs (and Copilot) can and cannot do | ⬜ | LLM/Copilot limitations |

### Module G3 — Using Copilot Responsibly ⚖️ (Use GitHub Copilot responsibly) · ⬜

| Lesson | Status | Notes |
|--------|:------:|-------|
| Risks and limitations of generative AI | ⬜ | Hallucination, bias, IP, over-reliance |
| Ethical and responsible AI use | ⬜ | Potential harms + mitigation strategies |
| Trust, but verify: validating AI output | ⬜ | Why/how to validate; operate responsibly |

### Module G4 — Prompt Engineering & Context 💬 (Apply prompt engineering and context crafting) · ⬜

| Lesson | Status | Notes |
|--------|:------:|-------|
| Anatomy of a good prompt | ⬜ | Prompt structure and context |
| How Copilot builds context | ⬜ | Open files, selection, neighboring tabs |
| Zero-shot and few-shot prompting | ⬜ | When to show examples |
| Prompt-crafting best practices | ⬜ | Principles; process flow; chat-history use |

### Module G5 — Copilot Features in Depth 🛠️ (Use GitHub Copilot features) · ⬜

| Lesson | Status | Notes |
|--------|:------:|-------|
| Inline suggestions, Chat, and Plan Mode | ⬜ | Triggers; Chat limits/options/feedback/commands |
| GitHub Copilot in the command line | ⬜ | CLI install, commands, sessions, scripts |
| Agent Mode, Edit Mode, and MCP | ⬜ | Autonomous work; sub-agents/sessions; MCP |
| Code review, Spaces, Spark, and PR summaries | ⬜ | Review, PR summaries, Spaces, instructions files |

### Module G6 — Boosting Developer Productivity 📈 (Improve developer productivity) · ⬜

| Lesson | Status | Notes |
|--------|:------:|-------|
| Generating, refactoring, and documenting code | ⬜ | Everyday SDLC wins |
| Learning faster and modernizing legacy code | ⬜ | Context switching; sample data; modernization |
| Writing tests with Copilot | ⬜ | Unit/integration tests; edge cases; assertions |
| Security and performance improvements | ⬜ | Security fixes; performance optimizations |

### Module G7 — Privacy, Exclusions & Safeguards 🔒 (Configure privacy, content exclusions, and safeguards) · ⬜

| Lesson | Status | Notes |
|--------|:------:|-------|
| Content exclusions and editor settings | ⬜ | What Copilot can/can't see |
| Who owns Copilot’s output? | ⬜ | Output ownership + limitations |
| Duplication detection and security warnings | ⬜ | Safeguards + troubleshooting |

### Module G8 — Administration & Governance 🏢 (Use GitHub Copilot features) · ⬜

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

## Certification: Databricks Certified Data Engineer Professional

- **Exam:** 59 multiple-choice questions · 120 minutes · USD 200 · valid 2 years
- **Source of truth:** `src_material/databricks/databricks-certified-data-engineer-professional`
- **Modules:** 9 (learning-flow order, mapped to the 10 official exam sections)
- **Lessons authored:** 31 of 31 ✅ · **Cards:** 283 · **all 9 official sample
  questions woven in as MCQs**

### Module P1 — Advanced Development in Python & SQL 🐍 (Section 1) · ✅

| Lesson | Status | Cards | Checks | Highlights |
|--------|:------:|:-----:|--------|------------|
| A Python project that scales | ✅ | 9 | 1 mcq | src-layout package; wheels; `%run` ≠ modularity |
| Installing the right libraries, the right way | ✅ | 9 | 1 mcq, 1 t/f | PyPI/wheel/source; notebook vs cluster scope; restartPython |
| When you need a UDF | ✅ | 9 | 1 mcq | built-in > SQL > Pandas > Python UDF ladder |
| Testing an ETL pipeline | ✅ | 10 | 1 mcq, 1 t/f | DataFrame.transform; assertDataFrameEqual/assertSchemaEqual |

### Module P2 — Declarative Pipelines & Streaming 🌊 (Section 1) · ✅

| Lesson | Status | Cards | Checks | Highlights |
|--------|:------:|:-----:|--------|------------|
| Pipelines you declare, not orchestrate | ✅ | 10 | 1 mcq, 1 t/f | declarative DAG; expectations (DROP ROW / FAIL UPDATE) |
| Streaming table or materialized view? | ✅ | 8 | 1 mcq | incremental vs maintained result; late-data trap |
| CDC without the plumbing: APPLY CHANGES | ✅ | 8 | 1 mcq, 1 t/f | KEYS/SEQUENCE BY; SCD Type 1 vs 2 |
| Keeping a stream under its SLA | ✅ | 9 | 1 mcq | micro-batch model; trigger interval; **sample Q2** |
| Configs, environments & control flow | ✅ | 9 | 1 mcq, 1 t/f | if/else & for-each; high-memory; disallow retries |

### Module P3 — Ingestion & Acquisition 📥 (Section 2) · ✅

| Lesson | Status | Cards | Checks | Highlights |
|--------|:------:|:-----:|--------|------------|
| Every format, one landing zone | ✅ | 9 | 1 mcq, 1 t/f | self-describing vs text; binaryFile; land as Delta |
| One append-only table, batch or stream | ✅ | 9 | 1 mcq | checkpoints; idempotent batch (txnAppId / MERGE) |

### Module P4 — Transformation, Cleansing & Quality 🔄 (Section 3) · ✅

| Lesson | Status | Cards | Checks | Highlights |
|--------|:------:|:-----:|--------|------------|
| Windows, joins & aggregations at scale | ✅ | 10 | 1 mcq, 1 t/f | ROW_NUMBER top-N; broadcast vs shuffle; skew |
| Quarantining bad data | ✅ | 9 | 1 mcq, 1 t/f | valid/inverse split; `_rescued_data`; DROP ROW ≠ retain |

### Module P5 — Data Modelling with Delta 🏗️ (Section 10) · ✅

| Lesson | Status | Cards | Checks | Highlights |
|--------|:------:|:-----:|--------|------------|
| What the transaction log actually does | ✅ | 11 | 2 mcq | metastore vs data ops; RENAME/DROP; clones; **sample Q1, Q8** |
| Modelling for the questions you ask | ✅ | 10 | 1 mcq, 1 t/f | partition cardinality; star schema; **sample Q3** |
| Liquid Clustering beats partitioning | ✅ | 9 | 1 mcq | CLUSTER BY (AUTO); vs partitioning/ZORDER |

### Module P6 — Cost & Performance Optimization ⚡ (Section 6) · ✅

| Lesson | Status | Cards | Checks | Highlights |
|--------|:------:|:-----:|--------|------------|
| Why managed tables cost you less | ✅ | 9 | 1 mcq, 1 t/f | predictive optimization; auto OPTIMIZE/VACUUM |
| The files Spark never reads | ✅ | 10 | 1 mcq, 1 t/f | min/max skipping; maxPartitionBytes; deletion vectors; **sample Q7** |
| Reading only what changed: CDF | ✅ | 8 | 1 mcq | table_changes; streaming-table limits |
| Finding the bottleneck in a query | ✅ | 9 | 1 mcq | profile: bad skipping / wrong join / shuffle+spill |

### Module P7 — Sharing, Federation & Governance 🔗 (Sections 4 + 8) · ✅

| Lesson | Status | Cards | Checks | Highlights |
|--------|:------:|:-----:|--------|------------|
| Sharing live data without copies | ✅ | 9 | 1 mcq | Delta Sharing D2D vs D2O; open protocol |
| Querying data you never ingested | ✅ | 9 | 1 mcq, 1 t/f | Lakehouse Federation; connection + foreign catalog |
| Making data discoverable & governed | ✅ | 9 | 1 mcq | comments/tags; **UC permission inheritance (sample Q4 theme)** |

### Module P8 — Security & Compliance 🔐 (Section 7) · ✅

| Lesson | Status | Cards | Checks | Highlights |
|--------|:------:|:-----:|--------|------------|
| Least privilege, and never a plaintext password | ✅ | 8 | 1 mcq | ACL levels; secrets `[REDACTED]`; **sample Q6** |
| Same table, different rows per user | ✅ | 9 | 1 mcq, 1 t/f | dynamic views (is_member); row filters/masks; **sample Q4** |
| De-identifying PII the right way | ✅ | 9 | 1 mcq | hashing vs tokenization; suppression; generalization |
| Actually deleting data on request | ✅ | 9 | 1 mcq, 1 t/f | DELETE + VACUUM; retention window; erasure ≠ hide |

### Module P9 — Monitoring, Debugging & CI/CD 🔍 (Sections 5 + 9) · ✅

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
| flashcard | ✅ | Click-to-flip; self-graded recall ("I knew this" / "I didn't"), tracked apart from quiz accuracy |
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
