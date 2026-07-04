import type { Lesson } from '@/types/content'

/**
 * Lesson: APPLY CHANGES for CDC and SCD in declarative pipelines.
 * Maps to exam Section 1 (use APPLY CHANGES APIs to simplify CDC in Lakeflow
 * Spark Declarative Pipelines).
 */
export const applyChangesCdcLesson: Lesson = {
  id: 'apply-changes-cdc',
  title: 'CDC without the plumbing: APPLY CHANGES',
  summary:
    'Use APPLY CHANGES INTO to apply an out-of-order change feed to a target table as SCD Type 1 or Type 2 — no hand-written MERGE.',
  estimatedMinutes: 10,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'The MERGE that keeps breaking',
      body: 'You’re applying a change feed (inserts, updates, deletes) from a source database into a Delta table. Your hand-written MERGE works until two updates for the same key arrive **out of order** and the older one wins — silently corrupting the record.\n\nAPPLY CHANGES exists to make CDC correct and boring: order handling, deletes, and history are built in.',
      atWork:
        'CDC ingestion is everywhere in production. The exam wants you to reach for APPLY CHANGES, not reinvent MERGE.',
    },
    {
      id: 'concept-what',
      type: 'concept',
      title: 'What APPLY CHANGES does',
      body: '`APPLY CHANGES INTO` (also written `AUTO CDC` / `create_auto_cdc_flow`) applies a stream of change records to a target streaming table in a declarative pipeline. You tell it the **key**, the **sequencing column** (to order changes), and optionally which column marks a **delete**.\n\nThe engine handles out-of-order events, upserts, and deletes for you — no MERGE to maintain.',
      takeaways: [
        'Applies an insert/update/delete change feed to a target table.',
        'You provide KEYS and a SEQUENCE BY column for ordering.',
        'Out-of-order handling, upserts, and deletes are built in.',
      ],
    },
    {
      id: 'example-apply',
      type: 'example',
      title: 'APPLY CHANGES in SQL',
      intro: 'Declare the target, then apply the change feed into it:',
      code: {
        language: 'sql',
        content:
          "CREATE OR REFRESH STREAMING TABLE customers;\n\nAPPLY CHANGES INTO live.customers\nFROM STREAM(live.customers_cdc)\n  KEYS (customer_id)\n  APPLY AS DELETE WHEN operation = 'DELETE'\n  SEQUENCE BY sequence_num\n  COLUMNS * EXCEPT (operation, sequence_num)\n  STORED AS SCD TYPE 1;",
      },
      explanation:
        '`SEQUENCE BY sequence_num` guarantees the *latest* change wins regardless of arrival order. `APPLY AS DELETE WHEN` turns delete events into row removals. `STORED AS SCD TYPE 1` keeps only the current value.',
    },
    {
      id: 'concept-scd',
      type: 'concept',
      title: 'SCD Type 1 vs Type 2',
      body: '**SCD Type 1** overwrites: the target holds only the *current* version of each key. Simple and compact — use when history doesn’t matter.\n\n**SCD Type 2** preserves history: each change closes the old row (sets an end timestamp / current flag) and opens a new one. Use when you need to answer "what did this record look like *then*?" APPLY CHANGES manages the start/end bookkeeping for you.',
      takeaways: [
        'Type 1 = keep only the current value (overwrite).',
        'Type 2 = keep full history with validity ranges.',
        'APPLY CHANGES maintains the Type 2 open/close records automatically.',
      ],
    },
    {
      id: 'tf-sequence',
      type: 'truefalse',
      statement:
        'Without a SEQUENCE BY column, APPLY CHANGES can still guarantee the newest update wins when events arrive out of order.',
      answer: false,
      explanation:
        'The SEQUENCE BY column is exactly how APPLY CHANGES orders competing changes for the same key. Without it there is no basis to know which update is newest.',
    },
    {
      id: 'mcq-cdc',
      type: 'mcq',
      question:
        'A pipeline ingests a CDC feed with inserts, updates, and deletes, where events for the same key can arrive out of order, and the business needs the full change history retained. What is the best approach?',
      options: [
        {
          id: 'a',
          text: 'APPLY CHANGES INTO with KEYS, SEQUENCE BY, APPLY AS DELETE WHEN, STORED AS SCD TYPE 2.',
        },
        {
          id: 'b',
          text: 'A hand-written MERGE in a scheduled notebook, ordering by arrival time.',
        },
        {
          id: 'c',
          text: 'Append every change event to the target and let analysts figure out the latest state.',
        },
        {
          id: 'd',
          text: 'A streaming table that overwrites the target on every micro-batch.',
        },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'Correct — APPLY CHANGES handles out-of-order events via SEQUENCE BY, deletes via APPLY AS DELETE, and history via SCD Type 2.',
        b: 'A MERGE ordering by arrival time gets out-of-order updates wrong and is a maintenance burden.',
        c: 'Appending raw events pushes correctness onto every consumer and loses a clean current state.',
        d: 'Overwriting keeps no history and mishandles per-key ordering.',
      },
      explanation:
        'Out-of-order CDC + retained history is the textbook case for APPLY CHANGES with SEQUENCE BY and SCD Type 2.',
      examObjective:
        'Use APPLY CHANGES APIs to simplify CDC in Lakeflow Spark Declarative Pipelines.',
    },
    {
      id: 'flash-sequence-by',
      type: 'flashcard',
      front: 'What does the SEQUENCE BY clause in APPLY CHANGES control?',
      back: 'The ordering of change events per key, so the **latest** change wins even when events arrive out of order.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You can now apply a change feed correctly',
      points: [
        'APPLY CHANGES INTO applies an insert/update/delete feed to a target table.',
        'KEYS identify the row; SEQUENCE BY orders competing changes.',
        'APPLY AS DELETE WHEN turns delete markers into removals.',
        'SCD Type 1 keeps current values; Type 2 keeps history — both managed for you.',
        'It replaces fragile hand-written MERGE logic for CDC.',
      ],
      closing: 'Next: the configs and control flow that make a pipeline production-ready. ⚙️',
    },
  ],
}
