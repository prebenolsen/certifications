import type { Lesson } from '@/types/content'

/**
 * Lesson: the lakehouse, Delta Lake, and Unity Catalog.
 * Maps to exam Section 1 (core components of the Data Intelligence Platform:
 * architecture, Delta Lake, Unity Catalog). Covers sample question 2.
 */
export const lakehouseFoundationsLesson: Lesson = {
  id: 'lakehouse-foundations',
  title: 'Why the lakehouse exists',
  summary:
    'Data warehouses vs data lakes, and how Delta Lake + Unity Catalog turn cheap cloud storage into one governed source of truth.',
  estimatedMinutes: 10,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'Two copies of the truth',
      body: 'Your company keeps a **data warehouse** for dashboards and a separate **data lake** for machine learning. Every night, jobs copy data between them. The copies drift. The BI team and the ML team report *different revenue numbers* for the same month.\n\nThe lakehouse exists to kill this problem: **one copy of the data** that serves BI, ML, and everything in between.',
      atWork:
        'When two teams argue about whose number is right, the root cause is usually two storage systems pretending to be one.',
    },
    {
      id: 'analogy-kitchen',
      type: 'analogy',
      title: 'A warehouse, a lake, and a lakehouse',
      body: 'A **data warehouse** is a fine-dining kitchen: everything in its place, strict menu, fast service — but expensive, and it only cooks what is on the menu.\n\nA **data lake** is a giant pantry: cheap, holds anything in any format — but nothing is labeled and half of it is expired.\n\nA **lakehouse** builds the professional kitchen *inside* the pantry: keep the cheap, hold-anything storage, add the discipline (transactions, quality, governance) that made the warehouse trustworthy.',
      mapping: [
        { from: 'Fine-dining kitchen', to: 'Warehouse: reliable but rigid & costly' },
        { from: 'Giant pantry', to: 'Lake: cheap & flexible but chaotic' },
        { from: 'Kitchen inside the pantry', to: 'Lakehouse: cheap storage + warehouse discipline' },
      ],
    },
    {
      id: 'concept-delta',
      type: 'concept',
      title: 'Delta Lake: the discipline layer',
      body: 'Delta Lake is an **open table format** that sits on top of ordinary files (Parquet) in your cloud storage. Next to the data files it keeps a **transaction log** (`_delta_log`) that records every change as an ordered set of commits.\n\nThat log is what upgrades plain files into a real table: **ACID transactions** (writers never corrupt readers), and a full history you can query.',
      takeaways: [
        'Delta Lake = Parquet files + a transaction log.',
        'The log gives you **ACID transactions** on cheap object storage.',
        'It is an open format — not a proprietary database.',
      ],
    },
    {
      id: 'concept-timetravel',
      type: 'concept',
      title: 'Time travel: the undo button',
      body: 'Because every change is a logged commit, Delta can reconstruct the table **as it was at any earlier version**. This is called **time travel**.\n\nBad ingest at 2am? Query yesterday’s version, or `RESTORE` the table to it. Auditor asks what the data looked like last quarter? The history answers.',
      takeaways: [
        'Every write creates a new table **version**.',
        'Time travel = query or restore an earlier version.',
        'This is your rollback story after a bad load.',
      ],
    },
    {
      id: 'example-timetravel',
      type: 'example',
      title: 'Time travel in two lines',
      intro: 'The history is plain SQL away:',
      code: {
        language: 'sql',
        content:
          "DESCRIBE HISTORY sales.orders;          -- every version + who/what/when\n\nSELECT * FROM sales.orders VERSION AS OF 42;\nSELECT * FROM sales.orders TIMESTAMP AS OF '2026-07-01';\n\nRESTORE TABLE sales.orders TO VERSION AS OF 42;  -- the actual rollback",
      },
      explanation:
        '`DESCRIBE HISTORY` doubles as an **audit trail**: every commit records the operation, user, and timestamp — which is exactly what regulators ask for.',
    },
    {
      id: 'concept-uc',
      type: 'concept',
      title: 'Unity Catalog: one place to govern everything',
      body: 'Unity Catalog is the platform’s **governance layer**. Every table, view, volume, and model gets a three-part address — `catalog.schema.table` — plus **one central place** for permissions, lineage, and audit logs.\n\nWithout it, each workspace manages its own access rules and nobody can answer “who can read customer emails?” With it, that is one query.',
      takeaways: [
        'One namespace: `catalog.schema.table`.',
        'One permission model across all workspaces.',
        'Automatic **lineage** and **audit logs**.',
      ],
    },
    {
      id: 'diagram-architecture',
      type: 'diagram',
      title: 'Where things actually run',
      spec: {
        kind: 'compare',
        left: {
          label: 'Control plane',
          sublabel: 'runs in Databricks’ cloud account',
          tone: 'brand',
          items: [
            'Web UI, notebooks interface',
            'Job scheduler & cluster manager',
            'Unity Catalog metadata',
          ],
        },
        right: {
          label: 'Compute plane + storage',
          sublabel: 'runs in *your* cloud account',
          tone: 'accent',
          items: [
            'Clusters & SQL warehouses doing the work',
            'Your data files (S3 / ADLS / GCS)',
            'Serverless compute runs in Databricks’ account instead',
          ],
        },
      },
      caption:
        'Databricks orchestrates from its **control plane**; your data and (classic) compute stay in **your** cloud account.',
    },
    {
      id: 'mistake-delta',
      type: 'mistake',
      title: 'What Delta Lake is not',
      myth: '“Delta Lake is a separate storage service — my data gets copied into Databricks.”',
      reality:
        'Delta Lake is a **format**, not a place. Your data stays as files in *your* object storage (S3/ADLS/GCS); the `_delta_log` folder next to them is what makes them behave like a transactional table.',
    },
    {
      id: 'mcq-platform',
      type: 'mcq',
      question:
        'A data engineer needs rapid pipeline iteration with reliable rollbacks after bad ingests, audit trails for compliance, and one consistent source of truth for both AI and BI workloads. Which approach meets all of these requirements?',
      options: [
        { id: 'a', text: 'CSV files on DBFS with manual file versioning and nightly copies for rollback.' },
        { id: 'b', text: 'Delta Lake ACID transactions and time travel, governed by Unity Catalog for consistent access and lineage.' },
        { id: 'c', text: 'Cloud object storage only, with ad hoc SQL queries for recovery and governance.' },
        { id: 'd', text: 'Ephemeral in-memory DataFrames for audit trails and BI distribution.' },
      ],
      correct: ['b'],
      optionFeedback: {
        a: 'Manual copies give neither transactions nor an audit trail — and they drift.',
        b: 'Time travel = rollback, the transaction log + UC = audit and lineage, one governed table = one truth.',
        c: 'Plain object storage has no transactions, no history, no permissions model.',
        d: 'In-memory DataFrames vanish when the cluster stops — the opposite of an audit trail.',
      },
      explanation:
        'Each requirement maps to a platform piece: rollbacks → **time travel**, audit → **transaction log + Unity Catalog**, one source of truth for AI *and* BI → **one governed Delta table**.',
      examObjective:
        'Understand the core components of the Databricks Data Intelligence Platform, such as its architecture, Delta Lake, and Unity Catalog.',
    },
    {
      id: 'flash-log',
      type: 'flashcard',
      front: 'What single mechanism gives Delta Lake ACID transactions, time travel, *and* an audit history?',
      back: 'The **transaction log** (`_delta_log`) — an ordered record of every commit to the table.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You now understand the platform’s foundation',
      points: [
        'A lakehouse = cheap open storage **plus** warehouse discipline.',
        'Delta Lake adds a transaction log to files → ACID + time travel.',
        '`DESCRIBE HISTORY`, `VERSION AS OF`, `RESTORE` are your rollback kit.',
        'Unity Catalog centralizes naming, permissions, lineage, and audit.',
        'Control plane = Databricks’ account; compute + data live in yours.',
      ],
      closing: 'Next: the machines that do the work — and how not to overpay for them. 💸',
    },
  ],
}
