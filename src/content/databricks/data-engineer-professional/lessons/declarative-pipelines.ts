import type { Lesson } from '@/types/content'

/**
 * Lesson: Lakeflow Spark Declarative Pipelines.
 * Maps to exam Section 1 (build reliable batch + streaming pipelines with
 * declarative pipelines and Auto Loader; data quality expectations).
 */
export const declarativePipelinesLesson: Lesson = {
  id: 'declarative-pipelines',
  title: 'Pipelines you declare, not orchestrate',
  summary:
    'Lakeflow Spark Declarative Pipelines: define tables as queries, let the engine handle dependencies, incremental processing, retries, and data-quality expectations.',
  estimatedMinutes: 11,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'The pipeline nobody wants to touch',
      body: 'A hand-built pipeline has 14 notebooks wired together with careful ordering, manual checkpoints, and try/except retries. One reordering and it breaks. Onboarding a new engineer takes a week.\n\nDeclarative pipelines flip this: you describe *what each table is*, and the engine works out the order, the incremental reads, the retries, and the quality checks.',
      atWork:
        'Professional-level ETL is judged on maintainability. Declarative pipelines are how Databricks wants you to get there.',
    },
    {
      id: 'analogy-spreadsheet',
      type: 'analogy',
      title: 'Like a spreadsheet, not a script',
      body: 'In a spreadsheet you write a cell as `= A1 + B1` and never think about *when* it recalculates — the sheet figures out the dependency graph and recomputes what changed. Declarative pipelines do the same for tables: you write each table as a query over others, and the engine derives the DAG and updates only what needs updating.',
      mapping: [
        { from: 'A cell formula', to: 'A table defined as a query' },
        { from: 'The spreadsheet’s recalc engine', to: 'The pipeline runtime resolving the DAG' },
        { from: 'Only changed cells recompute', to: 'Incremental processing of new data' },
      ],
    },
    {
      id: 'concept-what',
      type: 'concept',
      title: 'Define tables, not steps',
      body: 'In a declarative pipeline you write **streaming tables** and **materialized views** as SQL or Python queries. The runtime reads the queries, builds the dependency graph automatically, and manages execution order, checkpoints, incremental reads, and retries.\n\nYou don’t call one notebook after another — you declare the target tables and their sources.',
      takeaways: [
        'Each dataset is defined as a query over its sources.',
        'The engine derives the DAG and execution order.',
        'Checkpoints, retries, and incremental reads are managed for you.',
      ],
    },
    {
      id: 'example-pipeline',
      type: 'example',
      title: 'A two-hop pipeline in SQL',
      intro: 'Bronze streams from cloud files; silver reads bronze — no orchestration code:',
      code: {
        language: 'sql',
        content:
          "CREATE OR REFRESH STREAMING TABLE bronze_orders\nAS SELECT * FROM STREAM read_files('/landing/orders', format => 'json');\n\nCREATE OR REFRESH STREAMING TABLE silver_orders\n  (CONSTRAINT valid_id EXPECT (order_id IS NOT NULL) ON VIOLATION DROP ROW)\nAS SELECT * FROM STREAM(bronze_orders) WHERE amount > 0;",
      },
      explanation:
        '`read_files` is Auto Loader under the hood — incremental file ingestion. The engine sees silver depends on bronze and runs them in order, streaming only new rows.',
    },
    {
      id: 'concept-expectations',
      type: 'concept',
      title: 'Expectations: data quality as code',
      body: 'An **expectation** is a named constraint on a pipeline table. Each has a boolean rule and an action on violation:\n\n**EXPECT** (warn) — keep the row, record the failure in metrics. **EXPECT … ON VIOLATION DROP ROW** — drop bad rows. **EXPECT … ON VIOLATION FAIL UPDATE** — stop the pipeline. Every expectation’s pass/fail rate is tracked in the event log automatically.',
      takeaways: [
        'Expectations are named data-quality rules on a table.',
        'Actions: warn (keep), DROP ROW, or FAIL UPDATE.',
        'Results are logged as metrics for observability.',
      ],
    },
    {
      id: 'tf-order',
      type: 'truefalse',
      statement:
        'In a declarative pipeline you must manually specify the order in which the bronze and silver tables run.',
      answer: false,
      explanation:
        'You never specify order. The runtime infers the dependency graph from each table’s query (silver reads bronze ⇒ bronze runs first) and schedules accordingly.',
    },
    {
      id: 'concept-batch-stream',
      type: 'concept',
      title: 'Same pipeline, batch or streaming',
      body: 'A **streaming table** ingests incrementally — each run processes only new data (great for continuous or frequent loads). A **materialized view** computes a full result and keeps it fresh by recomputing (or incrementally updating) when sources change — great for aggregations.\n\nOne pipeline can mix both: stream raw data into bronze/silver tables, then serve gold aggregates as materialized views.',
      takeaways: [
        'Streaming table = incremental, append-oriented ingestion.',
        'Materialized view = maintained query result (often aggregates).',
        'Mix them in one pipeline: streamed silver → materialized gold.',
      ],
    },
    {
      id: 'mcq-pipeline',
      type: 'mcq',
      question:
        'A team needs a production ETL flow that ingests new JSON files continuously, drops rows failing a quality rule, and keeps a downstream aggregate fresh — with minimal orchestration code. What best fits?',
      options: [
        {
          id: 'a',
          text: 'A declarative pipeline: streaming tables with read_files + expectations, feeding a materialized view.',
        },
        {
          id: 'b',
          text: 'A chain of notebooks in a job, each manually checkpointing and ordered by task dependencies.',
        },
        {
          id: 'c',
          text: 'A single batch notebook that overwrites all tables from scratch on every run.',
        },
        {
          id: 'd',
          text: 'A Structured Streaming script with hand-written retry/except logic around every write.',
        },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'Correct — streaming tables handle incremental ingest, expectations drop bad rows, and a materialized view keeps the aggregate fresh, all declaratively.',
        b: 'That’s exactly the manual orchestration declarative pipelines remove.',
        c: 'Full overwrites don’t ingest incrementally and waste compute.',
        d: 'Hand-rolled retry logic is the maintenance burden you’re trying to avoid.',
      },
      explanation:
        'Continuous ingest + quality enforcement + fresh aggregates + minimal code is the exact sweet spot of Lakeflow declarative pipelines.',
      examObjective:
        'Build and manage reliable, production-ready data pipelines for batch and streaming data using Lakeflow Spark Declarative Pipelines and Auto Loader.',
    },
    {
      id: 'flash-expectations',
      type: 'flashcard',
      front: 'What are the three on-violation actions for a declarative-pipeline expectation?',
      back: 'Warn (keep the row, record it), **DROP ROW** (discard bad rows), and **FAIL UPDATE** (stop the pipeline).',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You can now build a declarative pipeline',
      points: [
        'Define tables as queries; the engine derives the DAG and execution order.',
        '`read_files` (Auto Loader) gives incremental file ingestion.',
        'Expectations enforce quality: warn, DROP ROW, or FAIL UPDATE.',
        'Streaming tables ingest incrementally; materialized views keep results fresh.',
        'Retries, checkpoints, and lineage are handled for you.',
      ],
      closing: 'Next: when to reach for a streaming table vs a materialized view. ⚖️',
    },
  ],
}
