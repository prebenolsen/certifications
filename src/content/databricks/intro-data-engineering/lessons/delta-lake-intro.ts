import type { Lesson } from '@/types/content'

/**
 * Lesson 4: Delta Lake, the storage layer.
 *
 * Introduces **Delta Lake**. Kept to the transaction log and what the log
 * buys — file layout, compaction and clustering belong to the certification
 * tracks, not to an orientation course.
 */
export const deltaLakeIntroLesson: Lesson = {
  id: 'delta-lake-intro',
  title: 'Delta Lake: files that behave like a table',
  summary:
    'Data files plus a transaction log — and what that log buys you: safe concurrent writes, and the ability to read the table as it was yesterday.',
  estimatedMinutes: 6,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'The dashboard that read half a file',
      body: 'A nightly job replaces the contents of a folder: delete the old files, write the new ones. It takes about eleven minutes.\n\nAt 02:14, in the middle of that window, a scheduled report queries the folder. Some new files exist, most old ones are gone. The report shows roughly a third of the orders and emails itself to the leadership team.\n\nNothing failed. No error was raised. A plain folder of files has no concept of "the write is not finished yet".',
      atWork:
        'This class of bug is not caught by testing — it depends entirely on when someone happens to read.',
    },
    {
      id: 'concept-delta',
      type: 'concept',
      title: 'What a Delta table actually is',
      body: '**Delta Lake** is the storage format underneath essentially every table on Databricks. A Delta table is two things sitting in one folder in cloud storage:\n\n**The data files** — ordinary columnar files (Parquet), which is where the rows live.\n\n**The transaction log** — a small, ordered list of every change ever made to the table: which files were added, which were removed, and by which operation.\n\nThe files are not the table. **The log is the table.** To read the table, an engine reads the log first to learn which files currently count.',
      takeaways: [
        'Delta table = data files **plus** a transaction log.',
        'The log is the authority on what the table contains right now.',
      ],
    },
    {
      id: 'analogy-ledger',
      type: 'analogy',
      title: 'A ledger, not a filing cabinet',
      body: 'A bank does not keep your balance written on a card that gets erased and rewritten. It keeps a ledger of every transaction, in order, and the balance is whatever the ledger adds up to.\n\nMistakes are not corrected by scratching out a line. A correcting entry is appended, and the history of what happened remains readable.',
      mapping: [
        { from: 'Each ledger entry', to: 'One committed change to the table' },
        { from: 'The current balance', to: 'The current version of the table' },
        { from: 'An entry only counts once written down', to: 'Data files are ignored until the log commits them' },
        { from: 'Last month\'s statement still exists', to: 'Older versions of the table are still readable' },
      ],
    },
    {
      id: 'concept-acid',
      type: 'concept',
      title: 'What the log buys you',
      body: 'A change becomes real at one instant: the moment its entry is appended to the log. That single fact removes a whole category of problem.\n\n**A reader sees the table before the change or after it** — never halfway through. The 02:14 report would have read a complete, consistent version of the table.\n\n**A failed job leaves nothing behind.** If the run dies after writing four of nine files, no log entry was committed, so those files simply do not count.\n\n**Two writers can work at once** without silently overwriting each other, because the log arbitrates the order.',
      takeaways: [
        'Writes are all-or-nothing.',
        'Readers are never blocked by writers, and never see a partial write.',
      ],
    },
    {
      id: 'concept-time-travel',
      type: 'concept',
      title: 'Time travel, for free',
      body: 'Because the log records every version rather than overwriting the last one, the old versions are still describable. So you can ask for the table **as it was**: yesterday, or at a specific version number.\n\nTwo everyday uses. Debugging: "this number changed overnight — what did the table look like before the run?" And recovery: a job loaded a bad file, so you roll the table back to the version before it, rather than reconstructing it by hand.',
      takeaways: [
        'Querying an earlier version of a table is a normal operation, not a restore from backup.',
        'Old versions are cleaned up on a retention schedule — it is history, not forever.',
      ],
    },
    {
      id: 'diagram-commit',
      type: 'diagram',
      title: 'What happens when you write',
      spec: {
        kind: 'flow',
        steps: [
          { label: 'A job writes rows', sublabel: 'new data files land in the folder', tone: 'neutral' },
          { label: 'Files exist, invisible', sublabel: 'no reader counts them yet', tone: 'warn' },
          { label: 'Commit appended to the log', sublabel: 'one atomic entry', tone: 'brand' },
          { label: 'New version is live', sublabel: 'every reader sees it at once', tone: 'good' },
        ],
        arrows: ['still uncommitted', 'the deciding moment', 'consistently'],
      },
      caption:
        'The middle step is the one that matters: files can be sitting in storage and still not be part of the table. If the job dies there, nothing was ever visible and there is nothing to clean up.',
    },
    {
      id: 'mistake-proprietary',
      type: 'mistake',
      title: 'Is this a lock-in format?',
      myth: '"Delta Lake is a proprietary Databricks format, so once my tables are Delta they can only be read by Databricks."',
      reality:
        'Delta Lake is **open source**, and the data underneath is plain Parquet. The log is a documented format that other engines can and do read.\n\nThis matters more than it sounds: it is what makes the promise from the previous lesson real. Your data sits in your own storage in an open format, so "one copy of the data" is not one copy trapped inside one vendor.',
    },
    {
      id: 'check-partial',
      type: 'truefalse',
      statement:
        'While a job is halfway through writing a Delta table, a query against that table can return partially written data.',
      answer: false,
      explanation:
        'The new files are invisible until the log commits them, and the commit is a single atomic step. A query sees the version before the write or the version after it — nothing in between.',
    },
    {
      id: 'flash-delta',
      type: 'flashcard',
      front: 'What two things make up a **Delta table**?',
      back: 'Columnar **data files** (Parquet) and a **transaction log** recording every change. The log decides which files currently belong to the table.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'Files, made trustworthy',
      points: [
        '**Delta Lake** is the format under Databricks tables: data files plus a transaction log.',
        'A change is real only once it is committed to the log — so writes are **all-or-nothing**.',
        'Readers never see a half-finished write, and a crashed job leaves nothing to clean up.',
        'Every version is recorded, so you can query or roll back to an earlier state.',
        'It is **open source** over open Parquet files, not a lock-in format.',
      ],
      closing:
        'Delta Lake makes one table trustworthy. Next: the layer that keeps track of all of them. 🗂️',
    },
  ],
}
