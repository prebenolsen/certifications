import type { Lesson } from '@/types/content'

/**
 * Lesson: Liquid Clustering and predictive optimization.
 * Maps to exam Section 6 (understand the features of Liquid Clustering and
 * predictive optimization).
 */
export const liquidClusteringLesson: Lesson = {
  id: 'liquid-clustering',
  title: 'Liquid Clustering & predictive optimization',
  summary:
    'How modern Delta tables lay themselves out for your queries — clustering that can change its mind, and maintenance that runs itself.',
  estimatedMinutes: 9,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'The partition scheme that aged badly',
      body: 'Two years ago someone partitioned the events table by `country`. Sensible then. Today 80% of queries filter by `event_date` and scan **every** country partition; meanwhile tiny countries created thousands of near-empty files. Re-partitioning means **rewriting the whole table** and updating every pipeline that writes to it.\n\nLiquid Clustering exists so that a layout decision made on day one doesn’t become a renovation project in year two.',
      atWork:
        'Ask any long-lived data team about their partition columns — someone will sigh. That sigh is this lesson.',
    },
    {
      id: 'analogy-shelves',
      type: 'analogy',
      title: 'A supermarket that re-shelves itself',
      body: 'Hive-style partitioning is like bolting the supermarket shelves to the floor based on how customers shopped in 2023. Shopping habits change; the shelves don’t — until you close the store and rebuild it.\n\n**Liquid Clustering** is a store that quietly rearranges its shelves based on what people actually buy together *now* — while staying open.',
      mapping: [
        { from: 'Bolted-down shelves', to: 'Hive partitioning (rigid directories)' },
        { from: 'Rearranging while open', to: 'Clustering evolves without rewriting the table' },
        { from: 'What customers buy together', to: 'The columns your queries filter on' },
      ],
    },
    {
      id: 'concept-liquid',
      type: 'concept',
      title: 'What Liquid Clustering does',
      body: 'Declare clustering columns with `CLUSTER BY` and Delta organizes data files so rows with similar values sit together. Queries filtering on those columns then **skip** irrelevant files entirely.\n\nThe differences from partitioning that matter:\n\n• **No rigid directories** — no small-file explosion from high-cardinality columns.\n• **Keys can change**: `ALTER TABLE ... CLUSTER BY (new_cols)` — no table rewrite; new data follows the new keys and maintenance gradually reorganizes the rest.\n• Works incrementally as data arrives.',
      takeaways: [
        '`CLUSTER BY` = file-skipping on your filter columns.',
        'Changing keys is a metadata operation, not a rewrite.',
        'Replaces both Hive partitioning and ZORDER for new tables.',
      ],
    },
    {
      id: 'example-liquid',
      type: 'example',
      title: 'Declaring and evolving clustering',
      intro: 'Day one, and the day priorities change:',
      code: {
        language: 'sql',
        content:
          'CREATE TABLE events (\n  event_date DATE, country STRING, user_id BIGINT, payload STRING\n) CLUSTER BY (event_date, country);\n\n-- Two years later, queries changed. No rewrite needed:\nALTER TABLE events CLUSTER BY (event_date, user_id);\n\n-- Or let Databricks pick keys from actual query patterns:\nCREATE TABLE events_v2 (...) CLUSTER BY AUTO;',
      },
      explanation:
        '`CLUSTER BY AUTO` hands key selection to the platform, which watches how the table is actually queried — clustering chosen by evidence instead of guesswork.',
    },
    {
      id: 'concept-po',
      type: 'concept',
      title: 'Predictive optimization: maintenance on autopilot',
      body: 'Delta tables need housekeeping: `OPTIMIZE` (compact small files), `VACUUM` (delete unreferenced files), statistics updates. Teams traditionally ran these on hand-built schedules — too often (wasted compute) or too rarely (slow tables).\n\n**Predictive optimization** makes Unity Catalog do it: it observes each table’s usage and **runs the right maintenance at the right time automatically**, prioritizing tables where the work pays for itself in query savings.',
      takeaways: [
        'Auto-runs OPTIMIZE / VACUUM / stats — no cron jobs to own.',
        'Decides *per table*, from actual usage patterns.',
        'Works on Unity Catalog managed tables.',
      ],
    },
    {
      id: 'mistake-partition-reflex',
      type: 'mistake',
      title: 'The partitioning reflex',
      myth: '“New big table? First decide the partition columns — that’s just table design 101.”',
      reality:
        'On current Databricks, the default answer is **Liquid Clustering** (or `CLUSTER BY AUTO`), not Hive partitioning. Partitioning still exists, but choosing it means accepting rigid directories, small-file risk, and expensive future changes. The exam and the docs now treat liquid clustering as the recommended layout for new Delta tables.',
    },
    {
      id: 'tf-rewrite',
      type: 'truefalse',
      statement:
        'Changing the clustering columns of a liquid-clustered table requires rewriting the entire table.',
      answer: false,
      explanation:
        'That is the headline feature: `ALTER TABLE ... CLUSTER BY (...)` changes keys **without** a rewrite. Newly written data follows the new keys, and background maintenance reorganizes existing data over time.',
    },
    {
      id: 'mcq-po',
      type: 'mcq',
      question:
        'A team owns hundreds of Unity Catalog managed tables. Some are queried constantly, others rarely. They want small-file compaction and old-file cleanup handled with minimal engineering effort and compute spent where it pays off. What fits best?',
      options: [
        { id: 'a', text: 'A nightly job running OPTIMIZE and VACUUM on every table in a loop.' },
        { id: 'b', text: 'Enable predictive optimization and let the platform schedule maintenance per table based on usage.' },
        { id: 'c', text: 'Document a runbook and have the on-call engineer run maintenance manually.' },
        { id: 'd', text: 'Disable VACUUM entirely so no cleanup is ever needed.' },
      ],
      correct: ['b'],
      optionFeedback: {
        a: 'Works, but burns compute optimizing tables nobody queries — exactly what per-table usage awareness avoids.',
        b: 'This is predictive optimization’s job description: right maintenance, right table, right time, automatically.',
        c: 'Manual maintenance across hundreds of tables is a full-time job nobody wants.',
        d: 'Skipping cleanup means unbounded storage growth and slower queries — VACUUM exists for a reason.',
      },
      explanation:
        'Predictive optimization replaces hand-rolled maintenance schedules with usage-driven automation — its value grows with the number of tables.',
      examObjective: 'Understand the features of Liquid Clustering and predictive optimization.',
    },
    {
      id: 'flash-liquid',
      type: 'flashcard',
      front: 'Liquid Clustering vs Hive partitioning — the two-word advantage?',
      back: '**It adapts.** Clustering keys evolve with query patterns via ALTER TABLE — no directory structure, no full rewrite.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'Your tables now maintain themselves',
      points: [
        'CLUSTER BY colocates data for file-skipping on filter columns.',
        'Keys evolve without rewrites; CLUSTER BY AUTO picks them from usage.',
        'Liquid clustering is the default choice for new tables — not partitioning.',
        'Predictive optimization auto-runs OPTIMIZE/VACUUM/stats where it pays off.',
      ],
      closing: 'One more ops skill: what to do when the cluster itself misbehaves. 🚑',
    },
  ],
}
