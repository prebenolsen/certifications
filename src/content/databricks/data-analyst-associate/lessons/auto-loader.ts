import type { Lesson } from '@/types/content'

/**
 * Lesson: Auto Loader for analysts.
 * Maps to exam Section 3 (the Auto Loader feature) and touches Section 4
 * (streaming tables). Kept at the level an analyst needs: what it guarantees
 * and how to declare it in SQL, not Spark internals.
 * Research: src_material/.../research/platform-and-naming.md
 */
export const autoLoaderLesson: Lesson = {
  id: 'auto-loader',
  title: 'Auto Loader: files that keep arriving',
  summary:
    'Incremental file ingestion that never loads the same file twice — what the checkpoint guarantees, and the SQL that sets one up.',
  estimatedMinutes: 9,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'The folder that never stops filling',
      body: 'Sales exports one file per store per hour into cloud storage. By spring the folder holds 400,000 files.\n\nReloading the whole folder nightly gets slower every week and eventually misses its window. Loading "just the new ones" means something has to *remember* which ones were already loaded. That memory is what Auto Loader is.',
      atWork:
        'A load whose runtime grows with the folder, not with the new data, is the sign you needed Auto Loader.',
    },
    {
      id: 'analogy-bookmark',
      type: 'analogy',
      title: 'A bookmark, not a re-read',
      body: 'You do not restart a novel each evening to find your place — you keep a bookmark and continue from it. If you skip a week, the bookmark still knows exactly where you stopped.\n\nAuto Loader keeps a bookmark over a storage folder. Each run reads only what arrived after it, then moves the bookmark.',
      mapping: [
        { from: 'The bookmark', to: 'The checkpoint — what has been processed' },
        { from: 'Reading only the new pages', to: 'Incremental file discovery' },
        { from: 'Coming back after a week away', to: 'Restart and resume without reloading' },
      ],
    },
    {
      id: 'concept-what',
      type: 'concept',
      title: 'What Auto Loader does',
      body: 'Auto Loader watches a cloud storage path and loads **only files it has not seen before**. It records its progress in a **checkpoint**, so it processes each file **exactly once** even if a run crashes halfway and restarts.\n\nIn SQL you rarely call it by name: you write `read_files(...)` and Auto Loader is what runs underneath.',
      takeaways: [
        'Loads only new files; the checkpoint is the memory that makes that possible.',
        'Exactly-once — a re-run never double-loads.',
        'In Databricks SQL it appears as `read_files(...)`.',
      ],
    },
    {
      id: 'concept-streaming-table',
      type: 'concept',
      title: 'The analyst’s way to use it: a streaming table',
      body: 'You do not have to write Spark code. A **streaming table** is a Unity Catalog table you declare in SQL that keeps loading new data on a schedule:\n\n`CREATE OR REFRESH STREAMING TABLE … AS SELECT * FROM STREAM read_files(…)`\n\nEach refresh processes only rows that arrived since the last one and appends them. The refresh runs on **serverless compute**, not on your SQL warehouse — so warehouse size does not limit it.',
      takeaways: [
        'A streaming table wraps Auto Loader in one SQL statement.',
        'Each refresh appends only new data.',
        'Refreshes run on serverless pipelines, not your SQL warehouse.',
      ],
    },
    {
      id: 'example-streaming-table',
      type: 'example',
      title: 'Ingesting a landing folder in SQL',
      intro: 'One statement, refreshed hourly:',
      code: {
        language: 'sql',
        content:
          "CREATE OR REFRESH STREAMING TABLE main.bronze.store_sales\nSCHEDULE EVERY 1 HOUR\nAS SELECT *\n   FROM STREAM read_files(\n     '/Volumes/main/landing/store_sales/',\n     format => 'json'\n   );",
      },
      explanation:
        'The `STREAM` keyword is what makes the read incremental. `SCHEDULE EVERY 1 HOUR` gives the table its own refresh cadence — no separate job to build. Point it at a **volume** so the storage path is governed by Unity Catalog like everything else.',
    },
    {
      id: 'concept-schema',
      type: 'concept',
      title: 'When the incoming files change shape',
      body: 'Auto Loader infers the schema from the files and remembers it. Two behaviours follow.\n\n**Schema evolution**: when a genuinely new column appears in incoming files, the table can grow to include it rather than failing forever.\n\n**Rescued data**: a value that does not fit its column’s type is not silently dropped — it is captured in a `_rescued_data` column, so you can see what arrived and decide what to do.',
      takeaways: [
        'New columns can extend the table automatically.',
        '`_rescued_data` catches values that did not fit — nothing disappears quietly.',
        'Check `_rescued_data` when a source "changed something" upstream.',
      ],
    },
    {
      id: 'mistake-reload',
      type: 'mistake',
      title: '"Just reload the whole folder, it is simpler"',
      myth: '"A full reload every night is easier to reason about than incremental loading."',
      reality:
        'It is simpler on day one and unsustainable by month six: the cost and runtime grow with the *total* number of files, not with the new ones, and every reload rewrites data that never changed.\n\nAuto Loader’s work is proportional to what arrived. That is the difference between a load that takes the same four minutes all year and one that quietly grows until it misses the morning deadline.',
    },
    {
      id: 'mcq-autoloader',
      type: 'mcq',
      question:
        'JSON files land in a storage volume throughout the day. An analyst needs a bronze table refreshed hourly, loading only new files, with no chance of loading a file twice. What should they create?',
      options: [
        {
          id: 'a',
          text: 'A streaming table defined with `SELECT * FROM STREAM read_files(...)` and an hourly schedule.',
        },
        {
          id: 'b',
          text: 'A scheduled query that runs `CREATE OR REPLACE TABLE ... AS SELECT * FROM ...` over the whole folder each hour.',
        },
        {
          id: 'c',
          text: 'A view over the folder path, so the files are read fresh on every query.',
        },
        {
          id: 'd',
          text: 'An hourly reminder to upload the newest files through the workspace UI.',
        },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'The `STREAM` read is incremental and the checkpoint guarantees exactly-once, so each refresh handles only what arrived.',
        b: 'A full rebuild reprocesses every file every hour — the cost grows forever and it is not incremental.',
        c: 'A view re-reads everything on every query and gives no exactly-once guarantee.',
        d: 'Manual upload cannot meet an hourly schedule and puts a person in the pipeline.',
      },
      explanation:
        'Files arriving continuously plus "only the new ones, exactly once" is the Auto Loader case, and in Databricks SQL that means a **streaming table** built on `STREAM read_files(...)`.',
      examObjective:
        'Explain the approaches for bringing data into Databricks, covering ingestion from S3, data sharing with external systems via Delta Sharing, API-driven data intake, the Auto Loader feature, and Marketplace.',
    },
    {
      id: 'flash-checkpoint',
      type: 'flashcard',
      front: 'What stops Auto Loader from loading the same file twice?',
      back: 'The **checkpoint** — it records which files have been processed, so a restart resumes instead of reloading. That is what makes ingestion exactly-once.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You can now ingest continuously arriving files',
      points: [
        'Auto Loader loads only files it has not seen; the checkpoint is its memory.',
        'Exactly-once: re-runs and restarts never double-load.',
        'In SQL it is `read_files(...)`, usually inside a **streaming table**.',
        'Streaming-table refreshes run on serverless compute, not your warehouse.',
        'Schema evolution adds new columns; `_rescued_data` keeps values that did not fit.',
      ],
      closing:
        'Data is in. Next module: the querying that the biggest slice of this exam is about. 🔎',
    },
  ],
}
