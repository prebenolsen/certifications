import type { Lesson } from '@/types/content'

/**
 * Lesson: Change Data Feed (CDF).
 * Maps to exam Section 6 (apply CDF to address limitations of streaming tables
 * and enhance latency).
 */
export const changeDataFeedLesson: Lesson = {
  id: 'change-data-feed',
  title: 'Reading only what changed: CDF',
  summary:
    'Change Data Feed exposes row-level inserts, updates, and deletes so downstream tables update incrementally instead of rescanning everything.',
  estimatedMinutes: 9,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'Ten rows changed; you reprocessed ten million',
      body: 'A silver table updates 10 customer records overnight. Your gold aggregation, unable to tell what changed, rescans all 10 million rows to rebuild.\n\nChange Data Feed lets the downstream job ask a precise question: "what rows changed since I last ran?" — and get back exactly those, with how they changed.',
      atWork:
        'CDF is the exam’s answer to "how do I make this incremental and lower-latency without a full rescan?"',
    },
    {
      id: 'concept-what',
      type: 'concept',
      title: 'What Change Data Feed is',
      body: 'Change Data Feed (CDF) makes a Delta table emit a **row-level change stream**: for every commit, which rows were inserted, updated (before *and* after images), or deleted. You enable it per table with `delta.enableChangeDataFeed = true`.\n\nDownstream consumers read the changes between two versions instead of the whole table.',
      takeaways: [
        'CDF records row-level inserts/updates/deletes per commit.',
        'Enable with `delta.enableChangeDataFeed = true`.',
        'Consumers read *changes between versions*, not full snapshots.',
      ],
    },
    {
      id: 'example-read',
      type: 'example',
      title: 'Enabling and reading the feed',
      intro: 'Turn it on, then query the changes:',
      code: {
        language: 'sql',
        content:
          "ALTER TABLE silver.customers\n  SET TBLPROPERTIES (delta.enableChangeDataFeed = true);\n\n-- Every change since version 100, with a _change_type column\nSELECT * FROM table_changes('silver.customers', 100);\n-- _change_type ∈ {insert, update_preimage, update_postimage, delete}",
      },
      explanation:
        'Each returned row carries `_change_type`, `_commit_version`, and `_commit_timestamp`. A MERGE downstream can apply just these rows — turning a full rebuild into a tiny incremental update.',
    },
    {
      id: 'concept-streaming-tables',
      type: 'concept',
      title: 'Why it helps streaming tables',
      body: 'A streaming table can read an **append-only** source cleanly, but chokes when the source has **updates and deletes** — a streaming read normally expects new rows only. CDF gives the streaming table a well-defined change stream to consume, so it can propagate updates and deletes downstream and keep latency low.\n\nWithout CDF you’d fall back to periodic full refreshes; with it, only the deltas flow.',
      takeaways: [
        'Streaming reads assume append-only sources.',
        'CDF turns updates/deletes into a consumable change stream.',
        'Result: incremental propagation and lower latency.',
      ],
    },
    {
      id: 'mistake-history',
      type: 'mistake',
      title: 'CDF is not the same as time travel',
      myth: '“I have time travel, so I can already read a clean change feed between versions.”',
      reality:
        'Time travel gives you full **snapshots** at versions N and N+1 — you’d have to *diff* them yourself, and it doesn’t distinguish an update from a delete-plus-insert. CDF records the actual **row-level change events** with types. They solve different problems.',
    },
    {
      id: 'mcq-cdf',
      type: 'mcq',
      question:
        'A gold aggregation must update within minutes of small update/delete changes to a large silver table, without rescanning the whole table each run. What should you use?',
      options: [
        { id: 'a', text: 'Enable Change Data Feed on silver and MERGE only the changed rows into gold.' },
        { id: 'b', text: 'Recompute the gold table from a full scan of silver on a tighter schedule.' },
        { id: 'c', text: 'Use time travel to read silver VERSION AS OF the previous run and overwrite gold.' },
        { id: 'd', text: 'Partition silver by a random hash so each run reads fewer files.' },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'Correct — CDF exposes exactly the changed rows with types, so a MERGE applies a small incremental update quickly.',
        b: 'A more frequent full scan is more expensive, not incremental, and won’t hit low latency at scale.',
        c: 'Reading a full prior snapshot still means diffing entire tables and can’t cleanly separate updates from deletes.',
        d: 'Random-hash partitioning doesn’t identify what changed and hurts skipping.',
      },
      explanation:
        'CDF addresses the exact limitation here: propagate row-level updates/deletes incrementally to lower latency without a full rescan.',
      examObjective:
        'Apply Change Data Feed (CDF) to address specific limitations of streaming tables and enhance latency.',
    },
    {
      id: 'flash-change-type',
      type: 'flashcard',
      front: 'What column identifies the kind of change in a CDF read, and what are its values?',
      back: '`_change_type` — `insert`, `update_preimage`, `update_postimage`, and `delete`.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You can now propagate only the deltas',
      points: [
        'CDF emits row-level inserts/updates/deletes per commit.',
        'Enable via `delta.enableChangeDataFeed = true`; read with `table_changes(...)`.',
        'It lets streaming tables handle update/delete sources incrementally.',
        'Not the same as time travel, which gives whole snapshots to diff yourself.',
        'Pair CDF with MERGE for cheap, low-latency downstream updates.',
      ],
      closing: 'Next: when a query is still slow, read the profile to find out why. 🔎',
    },
  ],
}
