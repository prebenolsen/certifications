import type { Lesson } from '@/types/content'

/**
 * Lesson: Delta Lake time travel and table history.
 * Maps to exam Section 4 (use Delta Lake's time travel to access and query
 * historical data versions) and Section 5 (utilize Delta Lake to audit and view
 * history, validate results, and compare historical results or trends).
 * Covers sample question 4 (VACUUM removes the files time travel needs).
 */
export const timeTravelLesson: Lesson = {
  id: 'time-travel',
  title: 'Delta Lake time travel',
  summary:
    'Query a table as it was at any earlier version, audit who changed what, compare then against now — and understand the one operation that takes history away.',
  estimatedMinutes: 10,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'Yesterday’s number changed overnight',
      body: 'The revenue figure you reported on Monday is different when you rerun the query on Tuesday. Nobody edited your query. Something upstream reloaded the table.\n\nIn most systems this is unprovable. On Databricks, every write creates a numbered **version**, so you can query the table exactly as it was on Monday and see precisely what changed.',
      atWork:
        '"The number moved" is answerable in about thirty seconds here — and unanswerable almost everywhere else.',
    },
    {
      id: 'concept-versions',
      type: 'concept',
      title: 'Every write creates a version',
      body: 'Delta records each change to a table as a numbered commit in its transaction log. Version 41 is the table before this morning’s load; version 42 is after it.\n\nBecause the older data files are still there, the engine can reconstruct any earlier version on demand. That is all **time travel** is: reading the table as of a version number or a timestamp.',
      takeaways: [
        'Each write commits a new, numbered table version.',
        'Time travel = reading an earlier version instead of the latest.',
        'It works because the previous files still exist — remember that for later.',
      ],
    },
    {
      id: 'concept-history',
      type: 'concept',
      title: 'DESCRIBE HISTORY: the audit trail',
      body: '`DESCRIBE HISTORY main.sales.orders` lists every version with the **operation** (WRITE, MERGE, DELETE, RESTORE), **who** ran it, **when**, and how many rows and files it touched.\n\nThat single command answers both of the questions that follow a suspicious number: *what happened to this table*, and *when did it happen* — which then tells you which version to compare against.',
      takeaways: [
        'History shows operation, user, timestamp, and row counts per version.',
        'It doubles as the audit trail auditors ask for.',
        'Read history first, then pick the version to query.',
      ],
    },
    {
      id: 'example-time-travel',
      type: 'example',
      title: 'Reading the past, and comparing it to now',
      intro: 'Three shapes you will use constantly:',
      code: {
        language: 'sql',
        content:
          "DESCRIBE HISTORY main.sales.orders;              -- what happened, and when\n\nSELECT * FROM main.sales.orders VERSION AS OF 41;\nSELECT * FROM main.sales.orders TIMESTAMP AS OF '2026-09-07';\n\n-- Compare then against now in one query\nSELECT 'monday' AS as_of, sum(amount) AS revenue\nFROM main.sales.orders VERSION AS OF 41\nUNION ALL\nSELECT 'today', sum(amount) FROM main.sales.orders;",
      },
      explanation:
        'The last query is the everyday one: the same metric at two versions, side by side. If Monday’s total is higher, the load did not add rows — it replaced them, and now you can prove it.',
    },
    {
      id: 'concept-restore',
      type: 'concept',
      title: 'RESTORE: putting the table back',
      body: 'Reading an old version is safe and read-only. When a load genuinely corrupted a table, `RESTORE TABLE main.sales.orders TO VERSION AS OF 41` makes that earlier version current again.\n\nA restore is itself a new version — it does not erase what happened, it adds a commit that returns the contents. The history remains complete, which is exactly what you want when explaining the incident afterwards.',
      takeaways: [
        '`VERSION AS OF` reads; `RESTORE` rolls the table back.',
        'A restore appends a new version rather than deleting history.',
        'This is the rollback story after a bad load.',
      ],
    },
    {
      id: 'concept-vacuum-limit',
      type: 'concept',
      title: 'Why time travel eventually runs out',
      body: 'Old versions survive only while their **data files** still exist. `VACUUM` permanently deletes files that are no longer part of the current version and are older than the retention threshold — **seven days by default**.\n\nAfter a `VACUUM`, versions that depended on those files can no longer be reconstructed, and querying them fails. That is not a bug: keeping every file forever would mean paying storage for every version of every table indefinitely.',
      takeaways: [
        '`VACUUM` deletes unreferenced files past the retention window (default 7 days).',
        'Once the files are gone, so is time travel to those versions.',
        'Retention is a trade-off between recoverability and storage cost.',
      ],
    },
    {
      id: 'mcq-vacuum',
      type: 'mcq',
      question:
        'An analyst tries to query a Delta table as it existed 30 days ago and gets an error. What is the most likely reason?',
      options: [
        {
          id: 'a',
          text: 'The schema was updated after that date, which blocks time travel to earlier versions.',
        },
        {
          id: 'b',
          text: 'The data files and log entries needed for that version were removed by a VACUUM operation.',
        },
        {
          id: 'c',
          text: 'The table’s permissions were changed, which disables time travel.',
        },
        {
          id: 'd',
          text: 'The table was renamed, which removes access to historical versions.',
        },
      ],
      correct: ['b'],
      optionFeedback: {
        a: 'Schema changes are just further versions; they do not invalidate earlier ones.',
        b: 'Time travel needs the old files. `VACUUM` removes files past the retention window, and 30 days is well beyond the 7-day default.',
        c: 'Permissions govern who may read a table, not which versions exist.',
        d: 'A rename only updates the catalog pointer; the files and history are untouched.',
      },
      explanation:
        'Time travel is bounded by **file retention**, not by any setting on the table. Beyond the retention window, `VACUUM` has removed the files those versions were made of.',
      examObjective:
        "Use Delta Lake's time travel to access and query historical data versions.",
    },
    {
      id: 'mistake-backup',
      type: 'mistake',
      title: '"Time travel is our backup"',
      myth: '"We do not need backups — Delta keeps every version of every table."',
      reality:
        'Time travel is a **short-window undo**, not a backup. The default retention is seven days, and any `VACUUM` enforces it.\n\nIt is superb for the mistake you noticed this morning and useless for the one you noticed next quarter. Anything with a legal retention requirement needs a deliberate copy, not history.',
    },
    {
      id: 'tf-history',
      type: 'truefalse',
      statement:
        '`DESCRIBE HISTORY` tells you which user ran each operation on the table.',
      answer: true,
      explanation:
        'Each version records the operation, the user, the timestamp, and the rows and files affected — which is why history serves as an audit trail as well as a menu of versions to travel to.',
    },
    {
      id: 'flash-syntax',
      type: 'flashcard',
      front: 'How do you read a Delta table as of an earlier version, and as of a date?',
      back: '`SELECT * FROM tbl VERSION AS OF 41` and `SELECT * FROM tbl TIMESTAMP AS OF \'2026-09-07\'`. Use `DESCRIBE HISTORY tbl` to find the version you want.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You can now query the past',
      points: [
        'Every write creates a numbered version of the table.',
        '`DESCRIBE HISTORY` shows operation, user, time, and rows per version.',
        '`VERSION AS OF` / `TIMESTAMP AS OF` read an earlier state; `RESTORE` brings it back.',
        'Compare a metric across versions to prove what changed.',
        '`VACUUM` deletes old files past the retention window (7 days by default) — and time travel with them.',
      ],
      closing:
        'Next module: making the queries you have written fast, and finding out why they are not. ⚡',
    },
  ],
}
