/**
 * The glossary — every term the platform expects a learner to know, defined
 * once, in one place.
 *
 * Why this file exists: content that name-drops a term it never defined is the
 * single easiest way to lose a learner. "Lakeflow Jobs" appeared 51 times
 * across the content before **Lakeflow** itself was ever explained. This file
 * is the fix and the guard rail:
 *
 * - <RichText /> underlines these terms wherever they appear in card text, so a
 *   learner who has forgotten one can click and read the definition in place.
 * - `npm run glossary` walks every card in reading order, per certification,
 *   and reports terms used *before* the lesson that introduces them — plus
 *   terms nothing introduces at all.
 *
 * Rules for adding a term:
 *
 * 1. **Vendor- and platform-specific terms only.** The learner is a data
 *    engineer: they know data, warehouses, SQL, compute, clusters, schemas,
 *    joins — and they know what Git is. Glossing those is condescending and it
 *    buries the entries that mattered. Define **Lakeflow**, **Unity Catalog**,
 *    **DBU**, **Liquid Clustering**; assume the rest.
 *    *Exception:* when the certification is **about** the thing (Git in a GitHub
 *    cert), it stops being background and gets taught properly.
 *    *Also in scope:* a generic word the platform gives a **specific** meaning —
 *    a *materialized view* in a Lakeflow pipeline is a particular managed
 *    dataset, not the textbook SQL object.
 * 2. **Proper nouns and distinctive phrases only.** "Lakeflow Pipelines", yes.
 *    "flow", "view", "sink" — no: they match ordinary prose and turn the card
 *    into a field of underlines. Define those inside the lesson that needs them.
 * 3. **Definition, not description.** One or two sentences a learner could
 *    repeat back. If it needs three, the second one belongs in `note`.
 * 4. **Cite volatile facts.** Product names drift (see the Lakeflow entries).
 *    `source` is what lets us re-verify instead of re-guessing.
 * 5. **Set `introducedIn` honestly.** A lesson that mentions the term does not
 *    introduce it. Leave it off and let the report tell the truth.
 */
import type { GlossaryTerm } from '@/types/content'

export const glossary: GlossaryTerm[] = [
  /* ---------------------------------------------------------------- */
  /* The ground floor — assume nothing                                 */
  /* ---------------------------------------------------------------- */
  {
    id: 'databricks',
    term: 'Databricks',
    definition:
      'A **cloud platform** for storing and processing very large amounts of data, and for building analytics and AI on top of it. It runs on AWS, Azure, or Google Cloud and rents you compute by the second.',
    note: 'You never load data *into* Databricks — your data stays in **your** cloud storage in open formats, and Databricks reads it where it lies.',
    seeAlso: ['lakehouse', 'apache-spark', 'data-intelligence-platform'],
    introducedIn: [
      'what-is-databricks-intro',
      'what-is-databricks',
      'what-is-databricks-analyst',
    ],
  },
  {
    id: 'data-intelligence-platform',
    term: 'Data Intelligence Platform',
    definition:
      "Databricks' name for the product as a whole. The claim behind the name: data engineering, analytics, and AI belong on **one** platform over **one** copy of the data.",
    seeAlso: ['databricks', 'lakehouse'],
    introducedIn: [
      'what-is-databricks-intro',
      'what-is-databricks',
      'what-is-databricks-analyst',
    ],
  },
  {
    id: 'apache-spark',
    term: 'Apache Spark',
    aliases: ['Spark'],
    definition:
      'The open-source engine that does the processing. Its trick is **splitting one big job across many machines**: the work is broken into pieces, the pieces run in parallel, and the results are combined.',
    note: 'Databricks was founded by Spark’s creators. You write Spark code in Python (**PySpark**) or SQL; Databricks runs it.',
    seeAlso: ['databricks', 'data-intelligence-platform'],
    introducedIn: ['what-is-databricks-intro', 'what-is-databricks', 'photon'],
  },
  {
    id: 'lakehouse',
    term: 'lakehouse',
    definition:
      'Cheap, open, hold-anything cloud storage **plus** the discipline that made data warehouses trustworthy — transactions, quality rules, governance, and a full record of what changed.',
    note: 'The point is **one copy of the data** serving BI and AI alike, instead of a warehouse and a lake with jobs copying between them and drifting apart.',
    seeAlso: ['delta-lake', 'unity-catalog', 'data-intelligence-platform'],
    introducedIn: [
      'lakehouse-intro',
      'lakehouse-foundations',
      'what-is-databricks-analyst',
    ],
  },
  {
    id: 'dbu',
    term: 'DBU',
    aliases: ['Databricks Unit', 'DBUs'],
    definition:
      'A **Databricks Unit** — the unit compute is billed in, roughly "how much processing did that consume". Bigger or longer-running clusters burn more.',
    note: 'Every cluster decision is therefore a cost decision.',
    seeAlso: ['databricks'],
    introducedIn: [
      'compute-intro',
      'what-is-databricks',
      'what-is-databricks-analyst',
    ],
  },

  /* ---------------------------------------------------------------- */
  /* Lakeflow — the umbrella and its four components                   */
  /* ---------------------------------------------------------------- */
  {
    id: 'lakeflow',
    term: 'Lakeflow',
    definition:
      "Databricks' unified data engineering solution — one product family covering **ingestion**, **transformation**, and **orchestration**. It is an umbrella name, not a single tool.",
    note: 'Four components sit under it: **Lakeflow Connect** (get data in), **Lakeflow Pipelines** (transform it), **Lakeflow Designer** (build visually), and **Lakeflow Jobs** (schedule and orchestrate). Whenever you see "Lakeflow *something*", it is one of these four.',
    seeAlso: [
      'lakeflow-connect',
      'lakeflow-pipelines',
      'lakeflow-designer',
      'lakeflow-jobs',
    ],
    introducedIn: [
      'lakeflow-intro',
      'lakeflow-overview',
      'platform-components',
    ],
    source: 'https://docs.databricks.com/aws/en/data-engineering/',
  },
  {
    id: 'lakeflow-connect',
    term: 'Lakeflow Connect',
    definition:
      'The **ingestion** component of Lakeflow: built-in connectors that pull data in from databases, enterprise SaaS applications, files, and streaming sources.',
    note: '**Managed connectors** are fully hosted — point one at Salesforce or SQL Server and it ingests, including incremental change capture. **Standard connectors** cover files and message buses, where you configure more yourself.',
    seeAlso: ['lakeflow', 'auto-loader'],
    introducedIn: ['lakeflow-intro', 'lakeflow-overview', 'lakeflow-connect'],
    source: 'https://docs.databricks.com/aws/en/data-engineering/',
  },
  {
    id: 'lakeflow-pipelines',
    term: 'Lakeflow Pipelines',
    aliases: [
      'Lakeflow Spark Declarative Pipelines',
      'Lakeflow Spark Declarative Pipeline',
      'Lakeflow declarative pipelines',
      'Lakeflow declarative pipeline',
      'Lakeflow pipeline',
      'declarative pipelines',
      'declarative pipeline',
    ],
    definition:
      'The **transformation** component of Lakeflow. You declare *what each table should contain* as a query; the engine derives the dependency graph, runs it incrementally, retries failures, and enforces data-quality rules.',
    note: 'Built on **Apache Spark Declarative Pipelines**. Formerly **Delta Live Tables (DLT)**, then **Lakeflow Spark Declarative Pipelines** — the exam guide still uses the longer name; the product now says *Lakeflow pipelines*.',
    seeAlso: ['lakeflow', 'streaming-table', 'materialized-view', 'lakeflow-jobs'],
    introducedIn: [
      'lakeflow-intro',
      'lakeflow-overview',
      'lakeflow-pipelines',
      'declarative-pipelines',
      'platform-components',
    ],
    source: 'https://docs.databricks.com/aws/en/ldp/concepts',
  },
  {
    id: 'lakeflow-designer',
    term: 'Lakeflow Designer',
    definition:
      'The **visual** component of Lakeflow: a drag-and-drop (or natural-language) surface for building data preparation flows, which generates production-grade pipeline code governed by Unity Catalog.',
    note: 'It is a front end onto Lakeflow Pipelines, not a separate engine — the output is a real pipeline.',
    seeAlso: ['lakeflow', 'lakeflow-pipelines'],
    introducedIn: ['lakeflow-intro', 'lakeflow-overview'],
    source: 'https://docs.databricks.com/aws/en/data-engineering/',
  },
  {
    id: 'lakeflow-jobs',
    term: 'Lakeflow Jobs',
    aliases: ['Lakeflow Job'],
    definition:
      'The **orchestration** component of Lakeflow: runs your work on a schedule or a trigger, respects dependencies between tasks, retries failures, and keeps the run history.',
    note: 'A job is a graph (DAG) of **tasks** — notebook, SQL, dashboard, pipeline, plus control-flow tasks. Formerly called **Databricks Workflows**.',
    seeAlso: ['lakeflow', 'lakeflow-pipelines'],
    introducedIn: [
      'lakeflow-intro',
      'lakeflow-overview',
      'jobs-tasks-dag',
      'platform-components',
    ],
    source: 'https://docs.databricks.com/aws/en/data-engineering/',
  },

  /* ---------------------------------------------------------------- */
  /* Pipeline vocabulary                                               */
  /* ---------------------------------------------------------------- */
  {
    id: 'streaming-table',
    term: 'streaming table',
    aliases: ['streaming tables'],
    definition:
      'A managed table fed by an append-only source, where **each incoming record is processed exactly once**. Use it when new rows arrive and old rows never change.',
    seeAlso: ['materialized-view', 'lakeflow-pipelines'],
    introducedIn: [
      'gold-layer',
      'lakeflow-pipelines',
      'streaming-tables-vs-mvs',
      'auto-loader',
    ],
    source: 'https://docs.databricks.com/aws/en/ldp/concepts',
  },
  {
    id: 'materialized-view',
    term: 'materialized view',
    aliases: ['materialized views'],
    definition:
      'A managed table whose contents are defined by a query and **recomputed as needed** so they reflect the current state of the source data. Use it when upstream rows can change.',
    note: 'The trade-off against a **streaming table**: a materialized view can absorb updates and deletes, but may have to recompute rather than just append.',
    seeAlso: ['streaming-table', 'lakeflow-pipelines'],
    introducedIn: [
      'gold-layer',
      'lakeflow-pipelines',
      'streaming-tables-vs-mvs',
      'views-mv-streaming',
    ],
    source: 'https://docs.databricks.com/aws/en/ldp/concepts',
  },
  {
    id: 'expectation',
    term: 'pipeline expectation',
    aliases: ['pipeline expectations'],
    definition:
      'A declarative data-quality rule attached to a dataset in a Lakeflow pipeline: a SQL boolean condition plus what to do when a row fails it — **warn** (count it), **drop** it, or **fail** the run.',
    note: 'The point is that quality becomes *measurable per run*, not just enforced. Table `CHECK` constraints reject bad writes; expectations report on them.',
    seeAlso: ['lakeflow-pipelines'],
    introducedIn: ['lakeflow-pipelines', 'declarative-pipelines'],
    source: 'https://docs.databricks.com/aws/en/ldp/concepts',
  },
  {
    id: 'auto-cdc',
    term: 'AUTO CDC',
    aliases: ['APPLY CHANGES'],
    definition:
      'A pipeline flow that applies **change data capture** feeds to a target table: it handles out-of-order events and supports both **SCD Type 1** (overwrite) and **SCD Type 2** (keep history).',
    note: 'Formerly written as `APPLY CHANGES INTO`.',
    seeAlso: ['lakeflow-pipelines'],
    introducedIn: ['apply-changes-cdc'],
    source: 'https://docs.databricks.com/aws/en/ldp/concepts',
  },

  /* ---------------------------------------------------------------- */
  /* Platform foundations                                              */
  /* ---------------------------------------------------------------- */
  {
    id: 'delta-lake',
    term: 'Delta Lake',
    definition:
      'The open storage format underneath every Databricks table: Parquet data files plus a **transaction log** that gives them ACID transactions, versioning (time travel), and safe concurrent reads and writes.',
    seeAlso: ['unity-catalog'],
    introducedIn: [
      'delta-lake-intro',
      'lakehouse-foundations',
      'platform-components',
      'what-is-databricks-analyst',
    ],
  },
  {
    id: 'unity-catalog',
    term: 'Unity Catalog',
    aliases: ['UC'],
    definition:
      'The governance layer for the whole platform: one place that names, secures, and tracks the lineage of every table, volume, model, and function, across all workspaces.',
    note: 'Its three-level namespace is `catalog.schema.object` — that extra top level is what lets one metastore serve many workspaces.',
    seeAlso: ['delta-lake', 'lakehouse'],
    introducedIn: [
      'unity-catalog-intro',
      'lakehouse-foundations',
      'unity-namespace',
      'mosaic-ai-stack',
      'unity-catalog-explained',
      'what-is-databricks-analyst',
    ],
  },
  {
    id: 'auto-loader',
    term: 'Auto Loader',
    definition:
      'Incremental file ingestion at scale: it discovers new files as they land in cloud storage and loads only those, tracking what it has already seen so re-runs never double-load.',
    note: 'Invoked as `cloudFiles` in Spark. Reach for it over `COPY INTO` when files arrive continuously or number in the millions.',
    seeAlso: ['lakeflow-connect'],
    introducedIn: ['lakeflow-intro', 'auto-loader', 'ingestion-methods'],
  },
  {
    id: 'medallion',
    term: 'medallion architecture',
    aliases: ['medallion'],
    definition:
      'The convention of refining data through named layers: **bronze** (raw, as ingested), **silver** (cleaned and conformed), **gold** (aggregated and business-ready).',
    note: 'It is a naming discipline, not a feature — nothing enforces it. Its value is that anyone can tell how trustworthy a table is from where it sits.',
    introducedIn: ['medallion-intro', 'lakehouse-foundations', 'medallion'],
  },
  {
    id: 'asset-bundle',
    term: 'Databricks Asset Bundle',
    aliases: [
      'Databricks Asset Bundles',
      'Asset Bundle',
      'Asset Bundles',
      'Declarative Automation Bundle',
      'Declarative Automation Bundles',
      'DAB',
    ],
    definition:
      'A project folder that describes your Databricks resources as code — a `databricks.yml` manifest naming the jobs, pipelines and dashboards, plus the notebooks and source files themselves — so a workspace becomes the *product of a deployment* rather than something hand-edited.',
    note: 'Being renamed **Declarative Automation Bundles**; the exam guide uses both names.',
    seeAlso: ['lakeflow-jobs', 'git-folder'],
    introducedIn: ['asset-bundles', 'cicd-asset-bundles'],
  },
  {
    id: 'git-folder',
    term: 'Git folder',
    aliases: ['Git folders', 'Databricks Repos'],
    definition:
      'A workspace folder backed by a real Git repository, so notebooks can be branched, committed, and pushed from inside Databricks.',
    note: 'Formerly **Databricks Repos**.',
    seeAlso: ['asset-bundle'],
    introducedIn: ['git-folders'],
  },
  {
    id: 'liquid-clustering',
    term: 'Liquid Clustering',
    definition:
      'A Delta table layout that keeps related rows physically close so queries can skip files, and which you can **re-key without rewriting the table** — unlike partitioning, whose layout is fixed at creation.',
    seeAlso: ['delta-lake'],
    introducedIn: ['liquid-clustering'],
  },
  {
    id: 'predictive-optimization',
    term: 'predictive optimization',
    definition:
      'A Unity Catalog feature that decides for itself when to run maintenance on your tables — compaction, statistics, vacuum — based on how they are actually queried, instead of you scheduling it.',
    seeAlso: ['liquid-clustering', 'unity-catalog'],
    introducedIn: ['liquid-clustering'],
  },

  /* ---------------------------------------------------------------- */
  /* Generative AI                                                     */
  /* ---------------------------------------------------------------- */
  {
    id: 'vector-search',
    term: 'Mosaic AI Vector Search',
    aliases: ['Databricks AI Search', 'Vector Search'],
    definition:
      'The managed vector database on Databricks: it indexes embeddings and answers **nearest-neighbour** queries — "which chunks are closest in meaning to this question?"',
    note: 'Renamed **Databricks AI Search** in current docs; the exam guide still says *Mosaic AI Vector Search*. It uses **HNSW with L2 distance**, so cosine behaviour requires normalising embeddings first.',
    seeAlso: ['embedding', 'rag'],
    introducedIn: ['mosaic-ai-stack'],
    source:
      'src_material/databricks/databricks-certified-generative-ai-engineer-associate/research/foundations.md',
  },
  {
    id: 'embedding',
    term: 'embedding',
    aliases: ['embeddings'],
    definition:
      'A list of numbers representing a piece of text, positioned so that **similar meanings sit close together**. Comparing meanings becomes measuring distance.',
    seeAlso: ['vector-search', 'rag'],
    introducedIn: ['embeddings-vectors'],
  },
  {
    id: 'rag',
    term: 'RAG',
    aliases: ['Retrieval-Augmented Generation', 'retrieval-augmented generation'],
    definition:
      '**R**etrieval-**A**ugmented **G**eneration: before answering, retrieve the relevant documents and paste them into the prompt, so the model answers from supplied facts rather than memory.',
    note: 'The fix for *missing knowledge*. It does not change how the model behaves or writes — that is what fine-tuning and system prompts are for.',
    seeAlso: ['embedding', 'vector-search'],
    introducedIn: ['rag-vs-alternatives'],
  },
  {
    id: 'foundation-model-apis',
    term: 'Foundation Model APIs',
    definition:
      'Pay-per-token access to hosted foundation models on Databricks, with no endpoint to provision. Three modes: **pay-per-token**, **provisioned throughput**, and **AI Functions optimized models** for batch inference.',
    seeAlso: ['model-serving'],
    introducedIn: ['mosaic-ai-stack'],
    source:
      'src_material/databricks/databricks-certified-generative-ai-engineer-associate/research/foundations.md',
  },
  {
    id: 'model-serving',
    term: 'Mosaic AI Model Serving',
    aliases: ['Model Serving'],
    definition:
      'The service that puts a model or a chain behind a REST endpoint — handling scaling, versioning, and request logging so an application can just call it.',
    seeAlso: ['foundation-model-apis', 'mlflow'],
    introducedIn: ['analytics-ai-intro', 'mosaic-ai-stack'],
  },
  {
    id: 'mlflow',
    term: 'MLflow',
    definition:
      'The tracking and packaging layer for models: it records experiments, versions models in Unity Catalog, and wraps a model plus its dependencies into something deployable.',
    seeAlso: ['model-serving', 'unity-catalog'],
    introducedIn: ['analytics-ai-intro', 'mosaic-ai-stack'],
  },
  /* ---------------------------------------------------------------- */
  /* Databricks SQL - the analyst's surface                            */
  /* ---------------------------------------------------------------- */
  {
    id: 'databricks-sql',
    term: 'Databricks SQL',
    definition:
      'The analyst-facing half of the platform: the SQL editor, the SQL warehouses that run queries, AI/BI dashboards, alerts, and query history.',
    seeAlso: ['sql-warehouse', 'aibi-dashboard'],
    introducedIn: [
      'analytics-ai-intro',
      'platform-components',
      'query-profiling',
    ],
  },
  {
    id: 'sql-warehouse',
    term: 'SQL warehouse',
    aliases: ['SQL warehouses', 'SQL Warehouse', 'SQL Warehouses'],
    definition:
      'The compute that executes SQL queries. It stores nothing — tables live in cloud storage under Unity Catalog — so the warehouse affects only speed, concurrency, and cost.',
    note: 'Size makes one heavy query faster; scaling out serves more concurrent users. **Serverless** warehouses start in seconds; **auto-stop** prevents idle billing.',
    seeAlso: ['databricks-sql', 'dbu', 'photon'],
    introducedIn: [
      'compute-intro',
      'compute-choices',
      'sql-warehouses',
      'what-is-databricks-analyst',
    ],
  },
  {
    id: 'photon',
    term: 'Photon',
    definition:
      'Databricks’ native query engine, written in C++, that executes queries on columnar batches instead of row by row. It is API-compatible with Apache Spark, so the same SQL returns the same results — faster.',
    note: 'On by default for SQL warehouses and serverless compute; a checkbox on classic compute. Queries already finishing in under ~2 seconds gain little, and Photon compute consumes DBUs at a different rate.',
    seeAlso: ['sql-warehouse', 'apache-spark'],
    introducedIn: ['photon', 'what-is-databricks'],
    source: 'https://docs.databricks.com/aws/en/compute/photon',
  },
  {
    id: 'catalog-explorer',
    term: 'Catalog Explorer',
    definition:
      'The UI for browsing everything Unity Catalog governs — catalogs, schemas, tables, views, volumes — and for reading an object’s details, permissions, and lineage.',
    seeAlso: ['unity-catalog', 'data-lineage'],
    introducedIn: [
      'catalog-explorer-lineage',
      'access-control',
      'governance-discoverability',
    ],
  },
  {
    id: 'data-lineage',
    term: 'data lineage',
    definition:
      'The automatically captured graph of where a table’s data came from and what is built on it — down to column level, and including dashboards, notebooks, and jobs.',
    note: 'Captured from queries as they run; nobody maintains it by hand. Upstream answers "where did this come from?"; downstream answers "what breaks if I change it?".',
    seeAlso: ['unity-catalog', 'catalog-explorer'],
    introducedIn: [
      'unity-catalog-intro',
      'catalog-explorer-lineage',
      'governance-discoverability',
    ],
  },
  {
    id: 'dynamic-view',
    term: 'dynamic view',
    aliases: ['dynamic views'],
    definition:
      'A view whose results depend on **who is querying it**, branching on functions like `is_account_group_member()` or `session_user()` to filter rows or redact column values.',
    note: 'Contrast with a materialized view, which is about *when* results are computed rather than *who* may see them.',
    seeAlso: ['materialized-view', 'unity-catalog'],
    introducedIn: ['row-filters-column-masks', 'views-mv-streaming'],
    source: 'https://docs.databricks.com/aws/en/views/dynamic',
  },
  {
    id: 'query-profile',
    term: 'query profile',
    aliases: ['Query Profiler', 'query profiler'],
    definition:
      'The per-stage breakdown of one executed query: bytes and rows read, the join strategy chosen, data shuffled, and any spill to disk.',
    note: 'Query **history** finds which query was slow and since when; the **profile** explains why that execution was slow.',
    seeAlso: ['sql-warehouse'],
    introducedIn: ['query-profiling', 'query-insights-history'],
  },
  /* ---------------------------------------------------------------- */
  /* Sharing, discovery and the AI surfaces                            */
  /* ---------------------------------------------------------------- */
  {
    id: 'delta-sharing',
    term: 'Delta Sharing',
    definition:
      'An open protocol for sharing live tables with another organisation without copying them: a provider grants a **share**, and the recipient queries the provider’s current data.',
    note: 'Databricks-to-Databricks recipients see the share as a catalog; anyone else uses the open protocol with a credential file.',
    seeAlso: ['marketplace', 'unity-catalog'],
    introducedIn: [
      'delta-sharing',
      'ingestion-methods',
      'unity-catalog-explained',
    ],
  },
  {
    id: 'marketplace',
    term: 'Databricks Marketplace',
    aliases: ['Marketplace'],
    definition:
      'An open exchange where providers publish data products — datasets, notebooks, models — that you browse from your workspace and receive as a catalog you query live.',
    note: 'Built on the open sharing protocol, so nothing is copied. Public listings can grant instant access.',
    seeAlso: ['delta-sharing'],
    introducedIn: ['platform-components'],
    source: 'https://docs.databricks.com/aws/en/marketplace/',
  },
  {
    id: 'lakehouse-federation',
    term: 'Lakehouse Federation',
    aliases: ['foreign catalog'],
    definition:
      'Querying an external database (PostgreSQL, Snowflake, BigQuery and others) **in place** by registering it as a foreign catalog in Unity Catalog — no ingestion, no copy.',
    note: 'Best for small, occasionally-queried reference data: every query hits the source system, and Unity Catalog governance still applies.',
    seeAlso: ['unity-catalog'],
    introducedIn: ['lakehouse-federation', 'joins-and-sets'],
  },
  {
    id: 'aibi-dashboard',
    term: 'AI/BI dashboard',
    aliases: ['AI/BI dashboards', 'AI/BI Dashboards'],
    definition:
      'The dashboard product: a **Data tab** holding datasets (tables, views, or SQL) and a **Canvas tab** holding the widgets — visualizations, text, and images — arranged on pages.',
    note: 'Viewers see the **published** version; it refreshes on a schedule, and runs either with the publisher’s credentials or with each viewer’s own permissions.',
    seeAlso: ['databricks-sql', 'genie-space'],
    introducedIn: ['analytics-ai-intro', 'aibi-dashboards'],
  },
  {
    id: 'genie-space',
    term: 'Genie space',
    aliases: ['Genie spaces', 'Genie Agent', 'Genie Agents', 'AI/BI Genie'],
    definition:
      'A curated area where users ask questions in plain language about a chosen set of Unity Catalog tables, and get answers back as data with the generated SQL shown.',
    note: 'Current docs call these **Genie Agents** ("formerly known as Genie Spaces"). Queries run with the asking user’s own permissions, so masks and row filters still apply.',
    seeAlso: ['trusted-asset', 'databricks-assistant'],
    introducedIn: ['analytics-ai-intro', 'genie-intro'],
    source: 'https://docs.databricks.com/aws/en/genie/set-up',
  },
  {
    id: 'trusted-asset',
    term: 'trusted asset',
    aliases: ['trusted assets', 'Trusted Assets'],
    definition:
      'A SQL query reviewed and approved by a human that a Genie space uses for known questions instead of generating its own — so important metrics are always computed the agreed way.',
    seeAlso: ['genie-space'],
    introducedIn: ['genie-build-optimize', 'genie-intro'],
  },
  {
    id: 'databricks-assistant',
    term: 'Databricks Assistant',
    aliases: ['Genie Code'],
    definition:
      'The AI assistant inside the SQL editor and notebooks that writes, explains, fixes, and optimises queries with knowledge of your Unity Catalog tables.',
    note: 'Driven by slash commands — `/explain`, `/fix`, `/doc`, `/optimize`. Current docs call it **Genie Code**; the exam guide says Databricks Assistant.',
    seeAlso: ['genie-space', 'databricks-sql'],
    introducedIn: ['sql-warehouses'],
  },
  {
    id: 'data-intelligence-engine',
    term: 'Data Intelligence Engine',
    definition:
      'The layer that learns the semantics of your organisation’s data — what your table and column names actually mean — so the platform can answer natural-language questions about it.',
    seeAlso: ['data-intelligence-platform', 'genie-space'],
    introducedIn: ['platform-components'],
  },
]

/** Lookup by id, for `seeAlso` resolution. */
export const glossaryById = new Map(glossary.map((t) => [t.id, t]))
