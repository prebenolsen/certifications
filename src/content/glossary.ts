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
 * 1. **Proper nouns and distinctive phrases only.** "Lakeflow Pipelines", yes.
 *    "flow", "view", "sink" — no: they match ordinary prose and turn the card
 *    into a field of underlines. Define those inside the lesson that needs them.
 * 2. **Definition, not description.** One or two sentences a learner could
 *    repeat back. If it needs three, the second one belongs in `note`.
 * 3. **Cite volatile facts.** Product names drift (see the Lakeflow entries).
 *    `source` is what lets us re-verify instead of re-guessing.
 * 4. **Set `introducedIn` honestly.** A lesson that mentions the term does not
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
    introducedIn: ['what-is-databricks'],
  },
  {
    id: 'data-intelligence-platform',
    term: 'Data Intelligence Platform',
    definition:
      "Databricks' name for the product as a whole. The claim behind the name: data engineering, analytics, and AI belong on **one** platform over **one** copy of the data.",
    seeAlso: ['databricks', 'lakehouse'],
    introducedIn: ['what-is-databricks'],
  },
  {
    id: 'apache-spark',
    term: 'Apache Spark',
    aliases: ['Spark'],
    definition:
      'The open-source engine that does the processing. Its trick is **splitting one big job across many machines**: the work is broken into pieces, the pieces run in parallel, and the results are combined.',
    note: 'Databricks was founded by Spark’s creators. You write Spark code in Python (**PySpark**) or SQL; Databricks runs it.',
    seeAlso: ['databricks', 'pyspark'],
    introducedIn: ['what-is-databricks'],
  },
  {
    id: 'pyspark',
    term: 'PySpark',
    definition:
      'The Python API for Apache Spark — how most transformation code on Databricks is written, when it is not written in SQL.',
    seeAlso: ['apache-spark'],
    introducedIn: ['what-is-databricks'],
  },
  {
    id: 'lakehouse',
    term: 'lakehouse',
    definition:
      'Cheap, open, hold-anything cloud storage **plus** the discipline that made data warehouses trustworthy — transactions, quality rules, governance, and a full record of what changed.',
    note: 'The point is **one copy of the data** serving BI and AI alike, instead of a warehouse and a lake with jobs copying between them and drifting apart.',
    seeAlso: ['delta-lake', 'unity-catalog', 'data-intelligence-platform'],
    introducedIn: ['lakehouse-foundations'],
  },
  {
    id: 'dbu',
    term: 'DBU',
    aliases: ['Databricks Unit', 'DBUs'],
    definition:
      'A **Databricks Unit** — the unit compute is billed in, roughly "how much processing did that consume". Bigger or longer-running clusters burn more.',
    note: 'Every cluster decision is therefore a cost decision.',
    seeAlso: ['cluster', 'databricks'],
    introducedIn: ['what-is-databricks'],
  },
  {
    id: 'workspace',
    term: 'workspace',
    definition:
      'The environment you log into: your notebooks, jobs, pipelines, dashboards, and settings. Companies usually run several — dev, test, prod.',
    seeAlso: ['unity-catalog', 'cluster'],
    introducedIn: ['what-is-databricks'],
  },
  {
    id: 'cluster',
    term: 'cluster',
    aliases: ['clusters'],
    definition:
      'The group of machines that actually runs your code. A notebook with no cluster attached does nothing.',
    note: '**All-purpose** clusters are for people working interactively; **job** clusters are created for a scheduled run and deleted when it ends, at a cheaper rate.',
    seeAlso: ['dbu', 'workspace'],
    introducedIn: ['what-is-databricks', 'compute-choices'],
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
    introducedIn: ['lakeflow-overview'],
    source: 'https://docs.databricks.com/aws/en/data-engineering/',
  },
  {
    id: 'lakeflow-connect',
    term: 'Lakeflow Connect',
    definition:
      'The **ingestion** component of Lakeflow: built-in connectors that pull data in from databases, enterprise SaaS applications, files, and streaming sources.',
    note: '**Managed connectors** are fully hosted — point one at Salesforce or SQL Server and it ingests, including incremental change capture. **Standard connectors** cover files and message buses, where you configure more yourself.',
    seeAlso: ['lakeflow', 'auto-loader'],
    introducedIn: ['lakeflow-overview', 'lakeflow-connect'],
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
    introducedIn: ['lakeflow-overview', 'lakeflow-pipelines', 'declarative-pipelines'],
    source: 'https://docs.databricks.com/aws/en/ldp/concepts',
  },
  {
    id: 'lakeflow-designer',
    term: 'Lakeflow Designer',
    definition:
      'The **visual** component of Lakeflow: a drag-and-drop (or natural-language) surface for building data preparation flows, which generates production-grade pipeline code governed by Unity Catalog.',
    note: 'It is a front end onto Lakeflow Pipelines, not a separate engine — the output is a real pipeline.',
    seeAlso: ['lakeflow', 'lakeflow-pipelines'],
    introducedIn: ['lakeflow-overview'],
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
    introducedIn: ['lakeflow-overview', 'jobs-tasks-dag'],
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
    introducedIn: ['gold-layer', 'lakeflow-pipelines', 'streaming-tables-vs-mvs'],
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
    introducedIn: ['gold-layer', 'lakeflow-pipelines', 'streaming-tables-vs-mvs'],
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
    introducedIn: ['lakehouse-foundations'],
  },
  {
    id: 'unity-catalog',
    term: 'Unity Catalog',
    aliases: ['UC'],
    definition:
      'The governance layer for the whole platform: one place that names, secures, and tracks the lineage of every table, volume, model, and function, across all workspaces.',
    note: 'Its three-level namespace is `catalog.schema.object` — that extra top level is what lets one metastore serve many workspaces.',
    seeAlso: ['delta-lake', 'lakehouse'],
    introducedIn: ['lakehouse-foundations', 'unity-namespace', 'mosaic-ai-stack'],
  },
  {
    id: 'auto-loader',
    term: 'Auto Loader',
    definition:
      'Incremental file ingestion at scale: it discovers new files as they land in cloud storage and loads only those, tracking what it has already seen so re-runs never double-load.',
    note: 'Invoked as `cloudFiles` in Spark. Reach for it over `COPY INTO` when files arrive continuously or number in the millions.',
    seeAlso: ['lakeflow-connect'],
    introducedIn: ['auto-loader'],
  },
  {
    id: 'medallion',
    term: 'medallion architecture',
    aliases: ['medallion'],
    definition:
      'The convention of refining data through named layers: **bronze** (raw, as ingested), **silver** (cleaned and conformed), **gold** (aggregated and business-ready).',
    note: 'It is a naming discipline, not a feature — nothing enforces it. Its value is that anyone can tell how trustworthy a table is from where it sits.',
    introducedIn: ['lakehouse-foundations'],
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
    introducedIn: ['mosaic-ai-stack'],
  },
  {
    id: 'mlflow',
    term: 'MLflow',
    definition:
      'The tracking and packaging layer for models: it records experiments, versions models in Unity Catalog, and wraps a model plus its dependencies into something deployable.',
    seeAlso: ['model-serving', 'unity-catalog'],
    introducedIn: ['mosaic-ai-stack'],
  },
]

/** Lookup by id, for `seeAlso` resolution. */
export const glossaryById = new Map(glossary.map((t) => [t.id, t]))
