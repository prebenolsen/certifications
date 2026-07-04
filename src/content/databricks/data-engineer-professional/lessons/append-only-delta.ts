import type { Lesson } from '@/types/content'

/**
 * Lesson: an append-only Delta pipeline for batch and streaming.
 * Maps to exam Section 2 (create an append-only data pipeline capable of
 * handling both batch and streaming data using Delta).
 */
export const appendOnlyDeltaLesson: Lesson = {
  id: 'append-only-delta',
  title: 'One append-only table, batch or stream',
  summary:
    'Build a bronze table that accepts both batch backfills and continuous streams without duplicating rows — via idempotent, exactly-once appends.',
  estimatedMinutes: 9,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'The backfill that doubled the data',
      body: 'A stream feeds your bronze table continuously. Then you run a one-off batch backfill to catch a gap — and reprocess a file the stream had already ingested. Now half of yesterday is in the table twice.\n\nAn append-only pipeline that serves *both* batch and streaming has to make appends **exactly-once**, or duplicates creep in.',
      atWork:
        'Bronze layers commonly take both a live stream and occasional batch loads; avoiding duplicates is the whole game.',
    },
    {
      id: 'concept-append-only',
      type: 'concept',
      title: 'Append-only means bronze stays raw',
      body: 'A bronze **append-only** table only ever *adds* rows — no updates, no deletes. That keeps ingestion simple and fast, preserves the full raw history, and plays perfectly with streaming (which expects append semantics).\n\nCorrections and deduplication happen *downstream* in silver, not by mutating bronze.',
      takeaways: [
        'Bronze only appends — never mutates existing rows.',
        'Keeps a complete, replayable raw history.',
        'Fixes and dedup live downstream in silver.',
      ],
    },
    {
      id: 'concept-streaming-append',
      type: 'concept',
      title: 'Streaming appends are exactly-once',
      body: 'A Structured Streaming append into Delta is **exactly-once** by construction: the **checkpoint** records which source offsets/files were processed, and Delta commits atomically. If the stream restarts, it resumes after the last committed offset — no row is appended twice.\n\nSo the *streaming* side handles duplicates automatically. The risk is the *batch* side stepping on the same data.',
      takeaways: [
        'Checkpoint + atomic Delta commit = exactly-once streaming append.',
        'Restarts resume after the last committed offset.',
        'Duplication risk comes from a separate batch path overlapping.',
      ],
    },
    {
      id: 'concept-idempotent-batch',
      type: 'concept',
      title: 'Make batch appends idempotent',
      body: 'To let a batch load coexist with the stream safely, make it **idempotent** so re-running it never duplicates. Two tools: **`txnAppId` + `txnVersion`** options make a batch write idempotent (Delta ignores a repeat of the same app/version), and **MERGE on a natural key** inserts only rows that aren’t already present.\n\nEither way, a repeated backfill becomes a no-op instead of a doubling.',
      takeaways: [
        'Idempotent batch write = safe to re-run.',
        '`txnAppId`/`txnVersion` dedupe repeated batch commits.',
        'MERGE on a key inserts only genuinely new rows.',
      ],
    },
    {
      id: 'example-availablenow',
      type: 'example',
      title: 'Batch and stream, same code',
      intro: 'The same Auto Loader query runs continuously or as a one-shot batch:',
      code: {
        language: 'python',
        content:
          "reader = (spark.readStream.format('cloudFiles')\n    .option('cloudFiles.format', 'json')\n    .load('/landing/events'))\n\n# Continuous stream\nreader.writeStream.option('checkpointLocation', ckpt) \\\n    .trigger(processingTime='30 seconds').toTable('bronze.events')\n\n# Same logic as a scheduled batch — shares the checkpoint, so no re-ingest\nreader.writeStream.option('checkpointLocation', ckpt) \\\n    .trigger(availableNow=True).toTable('bronze.events')",
      },
      explanation:
        'Because both share one **checkpoint**, `availableNow` picks up only files the stream hasn’t processed — batch and streaming append the same table with no duplicates.',
    },
    {
      id: 'mistake-overwrite',
      type: 'mistake',
      title: 'Dedup by overwriting bronze',
      myth: '“To avoid duplicates, I’ll just overwrite the bronze table on each batch run.”',
      reality:
        'Overwriting destroys the raw history the append-only bronze exists to preserve, and it breaks any stream reading from it. Achieve exactly-once through **checkpoints** (streaming) and **idempotent writes/MERGE** (batch) — not by clobbering the table.',
    },
    {
      id: 'mcq-append',
      type: 'mcq',
      question:
        'A bronze table is fed by a continuous stream and an occasional batch backfill of the same landing directory. How do you prevent duplicate rows across both paths?',
      options: [
        {
          id: 'a',
          text: 'Share one checkpoint (use availableNow for the batch run), or make batch writes idempotent with txnAppId/txnVersion or a MERGE on the key.',
        },
        {
          id: 'b',
          text: 'Overwrite the bronze table on every batch run.',
        },
        { id: 'c', text: 'Run the batch and stream on separate tables and union them at query time.' },
        { id: 'd', text: 'Disable the checkpoint so each run starts fresh.' },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'Correct — a shared checkpoint (or idempotent batch writes / MERGE) guarantees exactly-once appends across both paths.',
        b: 'Overwriting loses raw history and breaks downstream streams.',
        c: 'Two tables plus query-time union still double-counts the overlapping data.',
        d: 'Disabling the checkpoint reprocesses everything and *causes* duplicates.',
      },
      explanation:
        'Exactly-once bronze = streaming checkpoints + idempotent batch writes (txnAppId/txnVersion or MERGE), keeping the table append-only.',
      examObjective:
        'Create an append-only data pipeline capable of handling both batch and streaming data using Delta.',
    },
    {
      id: 'flash-checkpoint',
      type: 'flashcard',
      front: 'What makes a Structured Streaming append into Delta exactly-once?',
      back: 'The **checkpoint** tracks processed offsets/files and Delta commits atomically, so a restart resumes without re-appending.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You can now build an append-only pipeline',
      points: [
        'Bronze appends only — preserving raw, replayable history.',
        'Streaming appends are exactly-once via checkpoint + atomic commit.',
        'Make batch appends idempotent (txnAppId/txnVersion or MERGE on a key).',
        'Sharing a checkpoint lets batch (availableNow) and stream coexist safely.',
        'Never dedup by overwriting bronze.',
      ],
      closing: 'Next module: advanced transforms and catching the rows that shouldn’t pass. 🔄',
    },
  ],
}
