import type { Lesson } from '@/types/content'

/**
 * Lesson: quarantining bad data.
 * Maps to exam Section 3 (develop a quarantining process for bad data with
 * Lakeflow declarative pipelines or Auto Loader in classic jobs).
 */
export const dataQuarantineLesson: Lesson = {
  id: 'data-quarantine',
  title: 'Quarantining bad data',
  summary:
    'Route failing rows to a quarantine table — with declarative-pipeline expectations or a split in a classic job — so bad data neither blocks the pipeline nor poisons downstream tables.',
  estimatedMinutes: 9,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'Drop it, or keep it?',
      body: 'A batch arrives with 200 malformed rows out of a million. Fail the whole load? Now good data waits on bad. Silently drop the 200? Now you’ve lost records you can’t audit or fix.\n\nThe professional answer is a third door: **quarantine** the bad rows into their own table — the pipeline keeps flowing, and nothing is lost.',
      atWork:
        'Regulators and analysts both ask "where did the rejected rows go?" Quarantine is the answer that satisfies them.',
    },
    {
      id: 'concept-quarantine',
      type: 'concept',
      title: 'Quarantine = keep bad rows, separately',
      body: 'A **quarantine** pattern splits an incoming dataset into two streams: rows that pass your quality rules flow to the clean table, and rows that fail are **written to a separate quarantine table** (with the reason) instead of being dropped or blocking the run.\n\nSomeone can later inspect, fix, and re-ingest the quarantined rows — bad data is contained, not destroyed.',
      takeaways: [
        'Valid rows → clean table; invalid rows → quarantine table.',
        'Bad data is contained and auditable, not lost.',
        'The pipeline keeps running despite bad rows.',
      ],
    },
    {
      id: 'concept-expectations-quarantine',
      type: 'concept',
      title: 'Quarantine with pipeline expectations',
      body: 'In a declarative pipeline, an expectation with **DROP ROW** discards bad rows — but to *keep* them, add a quarantine table defined by the **inverse** condition. Define a boolean rule once; the clean table keeps rows where it’s true, the quarantine table keeps rows where it’s false.\n\nEither way, the expectation’s pass/fail counts land in the event log for monitoring.',
      takeaways: [
        'EXPECT … DROP ROW discards; a quarantine table captures instead.',
        'Clean table = rule true; quarantine table = rule false.',
        'Violation metrics are tracked in the event log.',
      ],
    },
    {
      id: 'example-quarantine',
      type: 'example',
      title: 'Split valid and invalid',
      intro: 'One rule, two tables — nothing dropped:',
      code: {
        language: 'sql',
        content:
          "-- Clean: rows that pass\nCREATE OR REFRESH STREAMING TABLE orders_clean AS\nSELECT * FROM STREAM(bronze_orders)\nWHERE amount > 0 AND order_id IS NOT NULL;\n\n-- Quarantine: the exact inverse, with a reason\nCREATE OR REFRESH STREAMING TABLE orders_quarantine AS\nSELECT *, 'failed amount/id check' AS quarantine_reason\nFROM STREAM(bronze_orders)\nWHERE NOT (amount > 0 AND order_id IS NOT NULL);",
      },
      explanation:
        'The two WHERE clauses are exact opposites, so every row lands in exactly one table. The quarantine table records *why*, so bad rows can be triaged and re-ingested.',
    },
    {
      id: 'concept-classic-job',
      type: 'concept',
      title: 'Quarantine in a classic Auto Loader job',
      body: 'Without declarative pipelines, do the same split by hand: read with Auto Loader, then write two DataFrames — `df.filter(rule)` to the clean table and `df.filter(~rule)` to the quarantine table. Auto Loader’s **`_rescued_data`** column already captures fields that didn’t match the schema, giving you a built-in signal for malformed rows to quarantine.',
      takeaways: [
        'Classic job: filter valid vs invalid into two writes.',
        'Auto Loader’s `_rescued_data` flags schema-mismatched fields.',
        'Same outcome as expectations, more manual.',
      ],
    },
    {
      id: 'tf-drop',
      type: 'truefalse',
      statement:
        'Using an EXPECT … ON VIOLATION DROP ROW expectation keeps the rejected rows available for later inspection.',
      answer: false,
      explanation:
        'DROP ROW *discards* failing rows (only counts remain in the event log). To retain them, write a quarantine table on the inverse condition — that’s the whole point of quarantining.',
    },
    {
      id: 'mcq-quarantine',
      type: 'mcq',
      question:
        'A pipeline must keep processing when some rows fail validation, must not let bad rows reach silver, and must retain rejected rows for auditing and re-ingestion. What’s the best design?',
      options: [
        {
          id: 'a',
          text: 'Split on the quality rule: valid rows to the clean table, invalid rows (with a reason) to a quarantine table.',
        },
        {
          id: 'b',
          text: 'Add EXPECT … ON VIOLATION FAIL UPDATE so the run stops on any bad row.',
        },
        {
          id: 'c',
          text: 'Add EXPECT … ON VIOLATION DROP ROW and move on.',
        },
        { id: 'd', text: 'Let bad rows into silver and filter them at query time.' },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'Correct — a valid/invalid split keeps the pipeline flowing, protects silver, and retains rejected rows for audit and re-ingest.',
        b: 'FAIL UPDATE halts the pipeline on bad rows — the opposite of "keep processing."',
        c: 'DROP ROW keeps flowing but discards the rows, failing the audit/re-ingest requirement.',
        d: 'Letting bad rows into silver is exactly what quarantine prevents.',
      },
      explanation:
        'Keep flowing + protect downstream + retain rejects = a quarantine split (valid vs inverse-invalid), not FAIL UPDATE or DROP ROW.',
      examObjective:
        'Develop a quarantining process for bad data with Lakeflow Spark Declarative Pipelines, or Auto Loader in classic jobs.',
    },
    {
      id: 'flash-inverse',
      type: 'flashcard',
      front: 'How do you retain failing rows instead of dropping them in a declarative pipeline?',
      back: 'Write a **quarantine table** defined by the **inverse** of the quality rule (plus a reason), so bad rows are kept separately rather than discarded.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You can now quarantine bad data',
      points: [
        'Quarantine routes failing rows to their own table — not dropped, not blocking.',
        'Declarative pipelines: clean = rule true, quarantine = rule false.',
        'DROP ROW discards; a quarantine table retains for audit/re-ingest.',
        'Classic jobs: filter valid vs invalid; `_rescued_data` flags bad rows.',
        'Bad data stays contained and fixable.',
      ],
      closing: 'Next module: cutting cost with managed tables and self-optimizing storage. ⚡',
    },
  ],
}
