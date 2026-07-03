import type { Lesson } from '@/types/content'

/**
 * Lesson: COPY INTO for incremental file loading.
 * Maps to exam Section 2 (use COPY INTO to incrementally load files from
 * cloud object storage into Unity Catalog–governed tables).
 */
export const copyIntoLesson: Lesson = {
  id: 'copy-into',
  title: 'COPY INTO: incremental loading in plain SQL',
  summary:
    'One SQL command that loads only the files it has not seen before — and why running it twice never duplicates data.',
  estimatedMinutes: 8,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'The double-load disaster',
      body: 'A partner drops order files into `s3://partner/orders/` every week. Your loader script reads *the whole folder* each Sunday and appends it to the table. Three weeks in, every early order exists **three times**, and revenue dashboards are triple-counting.\n\nWhat you needed was a loader that **remembers which files it already ingested**.',
      atWork:
        'Duplicate rows after a re-run are the classic symptom of a non-idempotent loader.',
    },
    {
      id: 'concept-copyinto',
      type: 'concept',
      title: 'What COPY INTO does',
      body: '`COPY INTO` is a SQL command that loads files from cloud object storage (S3/ADLS/GCS) into a Delta table — and keeps track of **every file it has already loaded**.\n\nRun it again tomorrow: it loads only the *new* files. Run it twice by accident: the second run loads **nothing**. That property is called **idempotency**, and it is what makes the command safe to schedule.',
      takeaways: [
        'SQL-native incremental file loading.',
        '**Idempotent**: already-loaded files are skipped automatically.',
        'Destination is a Unity Catalog–governed Delta table.',
      ],
    },
    {
      id: 'example-copyinto',
      type: 'example',
      title: 'The command, annotated',
      intro: 'A typical weekly load of partner CSVs:',
      code: {
        language: 'sql',
        content:
          "COPY INTO sales.bronze_orders\nFROM 's3://partner/orders/'\nFILEFORMAT = CSV\nFORMAT_OPTIONS ('header' = 'true', 'inferSchema' = 'true')\nCOPY_OPTIONS ('mergeSchema' = 'true');",
      },
      explanation:
        '`FILEFORMAT` supports CSV, JSON, Parquet, and more. `FORMAT_OPTIONS` configures parsing; `mergeSchema` in `COPY_OPTIONS` lets new columns in incoming files extend the table schema instead of failing the load.',
    },
    {
      id: 'concept-when',
      type: 'concept',
      title: 'When COPY INTO is the right tool',
      body: 'Reach for `COPY INTO` when:\n\n• the source is **files in cloud storage**,\n• volumes are modest — **thousands** of files, not millions,\n• you want **SQL-first** simplicity on a schedule (e.g. a Lakeflow Job running nightly).\n\nWhen files arrive **continuously** or number in the **millions**, its per-run file listing becomes the bottleneck — that is Auto Loader territory (next lesson).',
      takeaways: [
        'Scheduled, moderate-volume file loads → COPY INTO.',
        'Millions of files / continuous arrival → Auto Loader.',
      ],
    },
    {
      id: 'mistake-rerun',
      type: 'mistake',
      title: 'The re-run fear',
      myth: '“Our COPY INTO job ran twice last night — we must have duplicate data now.”',
      reality:
        '`COPY INTO` tracks loaded files as state on the **target table**. The second run saw no new files and loaded zero rows. Re-runs are safe by design — that is the whole point of the command.',
    },
    {
      id: 'mcq-copyinto',
      type: 'mcq',
      question:
        'A team receives a few hundred Parquet files per day in ADLS and wants a simple, SQL-based, scheduled load into a Unity Catalog table. Re-running the load must never duplicate rows. Which approach fits best?',
      options: [
        { id: 'a', text: 'CREATE TABLE AS SELECT over the whole folder every night.' },
        { id: 'b', text: 'COPY INTO the target table on a nightly schedule.' },
        { id: 'c', text: 'A Python notebook that lists the folder and appends everything it finds.' },
        { id: 'd', text: 'Manually upload each file through the UI.' },
      ],
      correct: ['b'],
      optionFeedback: {
        a: 'CTAS rebuilds from scratch — a full reload, not incremental, and it rewrites the table nightly.',
        b: 'Incremental, idempotent, SQL-native, and schedulable — exactly the COPY INTO use case.',
        c: 'Appending “everything it finds” is the double-load disaster from the first card.',
        d: 'Hundreds of files per day rules out manual anything.',
      },
      explanation:
        'Moderate daily file volume + SQL + schedule + idempotency = the textbook `COPY INTO` scenario.',
      examObjective:
        'Use the COPY INTO command to incrementally load files from cloud object storage (ADLS/S3/GCS) into Unity Catalog–governed tables.',
    },
    {
      id: 'flash-copyinto',
      type: 'flashcard',
      front: 'Why is it safe to run the same COPY INTO command twice?',
      back: 'It records which files were already loaded and **skips them** — the command is idempotent.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You now own the simplest incremental loader',
      points: [
        'COPY INTO = SQL incremental loading from cloud storage into Delta.',
        'It remembers loaded files → re-runs are harmless.',
        'FORMAT_OPTIONS parses the files; COPY_OPTIONS (mergeSchema) evolves the table.',
        'Right size: thousands of files on a schedule; beyond that, Auto Loader.',
      ],
      closing: 'And when the files never stop coming? Meet Auto Loader. 🚚',
    },
  ],
}
