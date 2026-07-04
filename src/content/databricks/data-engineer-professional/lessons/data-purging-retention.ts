import type { Lesson } from '@/types/content'

/**
 * Lesson: compliant data purging and retention.
 * Maps to exam Section 7 (develop a data purging solution ensuring compliance
 * with data retention policies).
 */
export const dataPurgingRetentionLesson: Lesson = {
  id: 'data-purging-retention',
  title: 'Actually deleting data on request',
  summary:
    'Why a DELETE isn’t gone yet — how time travel and old files keep data recoverable, and how VACUUM plus purge patterns make deletion truly compliant.',
  estimatedMinutes: 10,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'You deleted it — but it’s still there',
      body: 'A customer invokes their right to be forgotten. You run `DELETE FROM customers WHERE id = 42`, confirm zero rows return, and close the ticket. But `SELECT … VERSION AS OF` yesterday still shows them, and their data still sits in old Parquet files.\n\nCompliant deletion means the data is *actually unrecoverable* — not just hidden from the latest version.',
      atWork:
        'Retention and "right to erasure" rules are audited. The exam wants you to know DELETE alone isn’t enough.',
    },
    {
      id: 'concept-delete-not-gone',
      type: 'concept',
      title: 'DELETE hides; it doesn’t erase',
      body: 'A Delta `DELETE` writes a **new version** that excludes the rows — but the old data files (or deletion-vector-marked rows) still exist so **time travel** can reconstruct the prior version. The record is removed from *current* reads yet remains recoverable in history.\n\nFor compliance you must also remove the underlying files that still contain it.',
      takeaways: [
        'DELETE creates a new version; old files remain.',
        'Time travel can still read the deleted rows.',
        'Hidden ≠ erased — history keeps a copy.',
      ],
    },
    {
      id: 'concept-vacuum',
      type: 'concept',
      title: 'VACUUM removes the old files',
      body: '**VACUUM** permanently deletes data files no longer referenced by the current table version and **older than the retention threshold** (default 7 days). After a DELETE, once the tombstoned files age past retention, `VACUUM` physically removes them — and *then* the data is truly gone and time travel can no longer reach it.\n\nRetention is a trade-off: longer windows aid recovery/audit; compliance may require shortening it.',
      takeaways: [
        'VACUUM physically deletes unreferenced, past-retention files.',
        'Only after VACUUM is deleted data unrecoverable.',
        'The retention window balances recovery vs erasure duty.',
      ],
    },
    {
      id: 'example-purge',
      type: 'example',
      title: 'A purge that actually purges',
      intro: 'Delete, then remove the files that still held the data:',
      code: {
        language: 'sql',
        content:
          "DELETE FROM customers WHERE id = 42;   -- new version excludes the row\n\n-- Later, once tombstoned files pass the retention window:\nVACUUM customers;                      -- default 7-day retention\n\n-- For a legal deadline, shorten retention deliberately:\nSET spark.databricks.delta.retentionDurationCheck.enabled = false;\nVACUUM customers RETAIN 0 HOURS;       -- irreversible — use with care",
      },
      explanation:
        '`VACUUM` after the DELETE is what makes erasure real. Shortening `RETAIN` meets a tight legal deadline but permanently removes time-travel history — do it deliberately.',
    },
    {
      id: 'concept-retention-policy',
      type: 'concept',
      title: 'Retention policies cut both ways',
      body: 'A retention policy sets **how long you keep data** — a maximum (must delete after N years) *and* sometimes a minimum (must retain for audit). A compliant purge solution enforces both: a scheduled job that deletes records past their max age, then VACUUMs so they’re unrecoverable, while never purging data still inside a required minimum window.\n\nAutomate it and log it, because auditors ask for proof.',
      takeaways: [
        'Policies set max keep (must delete) and min keep (must retain).',
        'Purge job: DELETE past-max records, then VACUUM.',
        'Automate and log for auditability.',
      ],
    },
    {
      id: 'tf-vacuum',
      type: 'truefalse',
      statement:
        'After a DELETE removes rows from the current version of a Delta table, those rows can no longer be recovered by anyone.',
      answer: false,
      explanation:
        'Until VACUUM removes the underlying files (past the retention window), time travel can still reconstruct the pre-DELETE version. Erasure requires DELETE **and** VACUUM.',
    },
    {
      id: 'mcq-purge',
      type: 'mcq',
      question:
        'To comply with a right-to-erasure request, a customer’s records must be made truly unrecoverable. What is the correct sequence?',
      options: [
        {
          id: 'a',
          text: 'DELETE the rows, then VACUUM (with an appropriate short retention) so the underlying files are physically removed.',
        },
        {
          id: 'b',
          text: 'DELETE the rows — the new version excludes them, so the job is done.',
        },
        { id: 'c', text: 'Overwrite the whole table without the customer and keep all prior versions.' },
        { id: 'd', text: 'Add a row filter so the customer’s rows are hidden from queries.' },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'Correct — DELETE removes them from current reads; VACUUM removes the files so time travel can’t recover them.',
        b: 'DELETE alone leaves the data recoverable via time travel until VACUUM.',
        c: 'Keeping prior versions means the customer’s data is still stored and recoverable.',
        d: 'A row filter only hides rows; the data remains stored — not erasure.',
      },
      explanation:
        'True erasure = DELETE **plus** VACUUM (past retention). Hiding via filters or leaving history intact does not make data unrecoverable.',
      examObjective:
        'Develop a data purging solution ensuring compliance with data retention policies.',
    },
    {
      id: 'flash-erasure',
      type: 'flashcard',
      front: 'What two operations are required to make deleted Delta data truly unrecoverable?',
      back: '**DELETE** (excludes rows from the current version) **and VACUUM** (physically removes the old files past retention).',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You can now purge compliantly',
      points: [
        'DELETE hides rows from current reads but leaves them in history.',
        'Time travel can recover deleted rows until the files are removed.',
        'VACUUM permanently deletes unreferenced files past the retention window.',
        'Erasure = DELETE + VACUUM; shorten retention deliberately for deadlines.',
        'Retention policies enforce both max (delete) and min (retain) — automate and log.',
      ],
      closing: 'Next module: seeing, alerting on, and deploying all of this. 🔍',
    },
  ],
}
