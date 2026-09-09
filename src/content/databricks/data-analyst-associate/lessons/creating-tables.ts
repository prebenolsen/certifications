import type { Lesson } from '@/types/content'

/**
 * Lesson: creating tables, including unified datasets from several formats.
 * Maps to exam Section 4 (create managed tables and external tables, including
 * creating tables by joining data from multiple sources such as CSV, Parquet and
 * Delta tables to create unified datasets, including Unity Catalog).
 */
export const creatingTablesLesson: Lesson = {
  id: 'creating-tables',
  title: 'Creating tables of your own',
  summary:
    'Managed and external tables in SQL, and building one unified table from a CSV, a Parquet folder and a Delta table with CREATE TABLE AS SELECT.',
  estimatedMinutes: 10,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'Three formats, one report',
      body: 'The campaign budgets arrived as a **CSV**. The web events sit in a **Parquet** folder in cloud storage. Customers are a governed **Delta** table. The report needs all three, joined, refreshed weekly.\n\nRe-joining them in every query is slow and easy to get wrong. Making one table out of them is a single statement — once you know where it will live and who will own the files.',
      atWork:
        'A "unified dataset" is usually just a well-named table built by one CTAS that the whole team then reuses.',
    },
    {
      id: 'concept-create',
      type: 'concept',
      title: 'Creating a table puts it in the namespace',
      body: 'A new table always lands at a three-part address: `CREATE TABLE main.analytics.campaign_summary (…)`. The catalog and schema decide who can reach it, so where you create a table *is* a governance decision, not just tidiness.\n\nIf you omit the catalog and schema, Databricks uses your current ones — which is how tables end up in someone’s personal sandbox and nobody can find them later.',
      takeaways: [
        'Name the full `catalog.schema.table` when creating anything shared.',
        'The schema you choose determines who inherits access to it.',
        'You become the **owner** of what you create.',
      ],
    },
    {
      id: 'concept-managed-external',
      type: 'concept',
      title: 'Managed or external — the LOCATION clause decides',
      body: 'Write `CREATE TABLE …` with no location and you get a **managed** table: Databricks controls the files and their lifecycle, and dropping the table deletes them.\n\nAdd `LOCATION \'s3://…\'` and you get an **external** table: the files stay somewhere you control, and dropping the table removes only the catalog entry.\n\nDefault to managed. Choose external when another system must read the same files from a path you own — that is the only reason worth the extra housekeeping.',
      takeaways: [
        'No `LOCATION` → managed; `LOCATION` → external.',
        'Managed tables also get automatic maintenance from the platform.',
        'External is for genuine cross-system file sharing, not for safety.',
      ],
    },
    {
      id: 'concept-ctas',
      type: 'concept',
      title: 'CREATE TABLE AS SELECT: the query becomes the table',
      body: '**CTAS** builds a table from the result of a query: `CREATE TABLE … AS SELECT …`. The columns and types come from the query, so you never declare a schema by hand.\n\nThis is how a unified dataset gets made. Read each source in the `SELECT` — `read_files(...)` for the CSV and the Parquet folder, a normal table reference for the Delta table — join them, and the result is one governed Delta table regardless of what the inputs were.',
      takeaways: [
        'CTAS derives the schema from the query — no column list needed.',
        'Whatever the input formats, the output is a Delta table.',
        '`read_files(path, format => …)` reads files that are not tables yet.',
      ],
    },
    {
      id: 'example-ctas',
      type: 'example',
      title: 'One table from three formats',
      intro: 'CSV plus Parquet plus Delta, joined into a single governed table:',
      code: {
        language: 'sql',
        content:
          "CREATE OR REPLACE TABLE main.analytics.campaign_summary AS\nSELECT\n  b.campaign_id,\n  b.budget,\n  c.segment,\n  count(e.event_id) AS events\nFROM read_files('/Volumes/main/landing/budgets/', format => 'csv',\n                header => true)            AS b\nJOIN read_files('/Volumes/main/landing/events/', format => 'parquet') AS e\n  ON e.campaign_id = b.campaign_id\nLEFT JOIN main.crm.customers AS c            -- an existing Delta table\n  ON c.customer_id = e.customer_id\nGROUP BY b.campaign_id, b.budget, c.segment;",
      },
      explanation:
        'Three formats in, one Delta table out — with ACID transactions, versions, and Unity Catalog permissions from the moment it exists. `CREATE OR REPLACE` means the weekly rebuild keeps the table’s grants and history instead of discarding them.',
    },
    {
      id: 'diagram-unify',
      type: 'diagram',
      title: 'Many sources, one governed table',
      spec: {
        kind: 'flow',
        steps: [
          {
            label: 'CSV · Parquet · Delta',
            sublabel: 'files in volumes + existing tables',
            tone: 'neutral',
          },
          {
            label: 'CREATE TABLE AS SELECT',
            sublabel: 'join and shape in one query',
            tone: 'brand',
          },
          {
            label: 'One Delta table',
            sublabel: 'governed by Unity Catalog',
            tone: 'good',
          },
        ],
        arrows: ['read_files / table refs', 'stored as Delta'],
      },
      caption:
        'The input format stops mattering the moment the data lands as a Delta table.',
    },
    {
      id: 'mistake-drop-recreate',
      type: 'mistake',
      title: 'Rebuilding a table by dropping it first',
      myth: '"To refresh the table each week I drop it and create it again."',
      reality:
        '`DROP` then `CREATE` throws away everything attached to the table: its **grants**, its **history**, its comments and tags. Colleagues lose access without anyone touching permissions, and your rollback options disappear.\n\n`CREATE OR REPLACE TABLE` swaps the contents in place and keeps all of it. It is the same amount of typing and a much better outcome.',
    },
    {
      id: 'mcq-ctas',
      type: 'mcq',
      question:
        'An analyst must combine a CSV of budgets in a volume, a Parquet folder of events, and an existing Delta customers table into one reusable, governed table that is rebuilt weekly without losing its permissions. What should they do?',
      options: [
        {
          id: 'a',
          text: '`CREATE OR REPLACE TABLE main.analytics.summary AS SELECT …` joining `read_files()` over the CSV and Parquet paths with the Delta table.',
        },
        {
          id: 'b',
          text: 'Convert the CSV and Parquet files to Delta by hand each week, then `DROP TABLE` and `CREATE TABLE` from the three sources.',
        },
        {
          id: 'c',
          text: 'Create three separate external tables and ask users to join them in every query.',
        },
        {
          id: 'd',
          text: 'Upload all three sources through the workspace UI as one table.',
        },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'One CTAS reads every format, produces a Delta table, and `OR REPLACE` preserves grants and history on each rebuild.',
        b: 'The manual conversion is unnecessary and `DROP`/`CREATE` discards grants and history every week.',
        c: 'Pushing the join into every query repeats the work and invites inconsistent results.',
        d: 'The UI upload handles one file at a time and cannot join sources.',
      },
      explanation:
        '`CREATE OR REPLACE TABLE … AS SELECT` is the unified-dataset pattern: read whatever formats the sources use, join them once, land a governed Delta table, and keep its privileges across rebuilds.',
      examObjective:
        'Create managed tables and external tables, including creating tables by joining data from multiple sources (e.g., CSV, Parquet, Delta tables) to create unified datasets, including Unity Catalog.',
    },
    {
      id: 'tf-ctas-schema',
      type: 'truefalse',
      statement:
        'With `CREATE TABLE … AS SELECT` you must declare the column names and types before the query.',
      answer: false,
      explanation:
        'CTAS takes its schema **from the query result** — column names come from the select list (use aliases to control them) and types are inferred. Declaring a schema is only needed when you create an empty table up front.',
    },
    {
      id: 'flash-location',
      type: 'flashcard',
      front: 'What single clause in `CREATE TABLE` makes the table external instead of managed?',
      back: '`LOCATION \'<path>\'`. With it, you own the files and `DROP TABLE` keeps them; without it, the table is managed and `DROP` deletes the data.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You can now build tables for other people',
      points: [
        'A table is created at `catalog.schema.table` — that placement decides access.',
        'No `LOCATION` = managed (files owned by Databricks); `LOCATION` = external.',
        'CTAS derives the schema from the query and always lands Delta.',
        '`read_files()` pulls CSV/JSON/Parquet straight into a query.',
        '`CREATE OR REPLACE` keeps grants and history; `DROP` + `CREATE` throws them away.',
      ],
      closing:
        'Stored results are one option. Next: the objects that keep themselves up to date. 🔄',
    },
  ],
}
