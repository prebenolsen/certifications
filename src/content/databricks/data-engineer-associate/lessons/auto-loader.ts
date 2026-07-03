import type { Lesson } from '@/types/content'

/**
 * Lesson: Auto Loader — incremental file ingestion at scale.
 * Maps to exam Section 2 (use Auto Loader with schema enforcement and schema
 * evolution in batch modes, e.g. directory listing or file notification).
 */
export const autoLoaderLesson: Lesson = {
  id: 'auto-loader',
  title: 'Auto Loader: ingestion that never forgets',
  summary:
    'How cloudFiles discovers new files at any scale, keeps exactly-once guarantees with checkpoints, and handles schemas that change under you.',
  estimatedMinutes: 11,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'When COPY INTO runs out of breath',
      body: 'Your IoT platform lands **hundreds of thousands of small JSON files a day** into cloud storage. A scheduled `COPY INTO` now spends most of its runtime just *listing the folder* to figure out what is new.\n\nAuto Loader was built for exactly this: discover new files **efficiently at any scale** and load them with exactly-once guarantees.',
      atWork:
        'File-listing time growing faster than data volume is the tell-tale sign you have outgrown COPY INTO.',
    },
    {
      id: 'analogy-mailcarrier',
      type: 'analogy',
      title: 'A mail carrier with a delivery log',
      body: 'Auto Loader works like a mail carrier who keeps a **logbook of every letter already delivered**. Each round, they check the log, deliver only the new letters, and log them. If the carrier is sick for a week, nothing is lost — the log shows exactly where to resume.\n\nThat logbook is the **checkpoint**, and it is why Auto Loader can crash, restart, and never deliver a file twice or skip one.',
      mapping: [
        { from: 'Delivery logbook', to: 'Checkpoint (tracks processed files)' },
        { from: 'Only new letters delivered', to: 'Incremental discovery' },
        { from: 'Resume after sick leave', to: 'Exactly-once recovery after failure' },
      ],
    },
    {
      id: 'concept-cloudfiles',
      type: 'concept',
      title: 'The cloudFiles source',
      body: 'Auto Loader is a Structured Streaming source called **`cloudFiles`**. You point it at a storage path; it discovers new files incrementally and processes them as a stream.\n\nIt keeps its state (which files are done, plus the inferred schema) in a **checkpoint location** — delete that, and it starts over from scratch.',
      takeaways: [
        'Auto Loader = the `cloudFiles` streaming source.',
        'The **checkpoint** stores progress → exactly-once processing.',
        'Runs continuously *or* as a scheduled batch (`trigger(availableNow=True)`).',
      ],
    },
    {
      id: 'concept-discovery',
      type: 'concept',
      title: 'Two ways to spot new files',
      body: '**Directory listing** (default): Auto Loader lists the path and diffs against its log. Zero extra setup; fine for most volumes.\n\n**File notification**: Auto Loader subscribes to the cloud storage’s **event notifications** — the storage *tells it* when a file lands. No listing at all, which scales to millions of files and very frequent arrivals, at the cost of extra cloud setup.',
      takeaways: [
        'Directory listing = simple default.',
        'File notification = event-driven, for extreme file counts/frequency.',
      ],
    },
    {
      id: 'concept-schema',
      type: 'concept',
      title: 'Schemas that change under you',
      body: 'Auto Loader can **infer the schema** from the files and store it in a schema location. From then on it does **schema enforcement**: rows must fit the schema.\n\nWhen a *new column* appears in incoming files, **schema evolution** (mode `addNewColumns`) grows the table instead of failing. And data that does not fit its column’s type is captured — not dropped — in the **`_rescued_data`** column, so nothing silently disappears.',
      takeaways: [
        'Enforcement: bad rows can’t corrupt the table.',
        'Evolution: new columns extend the schema automatically.',
        '`_rescued_data` catches mismatches instead of losing them.',
      ],
    },
    {
      id: 'example-autoloader',
      type: 'example',
      title: 'A complete Auto Loader ingest',
      intro: 'JSON landing zone → Unity Catalog bronze table, run as a scheduled batch:',
      code: {
        language: 'python',
        content:
          '(spark.readStream\n  .format("cloudFiles")\n  .option("cloudFiles.format", "json")\n  .option("cloudFiles.schemaLocation", checkpoint_path)\n  .option("cloudFiles.schemaEvolutionMode", "addNewColumns")\n  .load("s3://iot/landing/")\n  .writeStream\n  .option("checkpointLocation", checkpoint_path)\n  .trigger(availableNow=True)          # batch-style: drain new files, then stop\n  .toTable("iot.bronze_readings"))',
      },
      explanation:
        '`trigger(availableNow=True)` makes a *streaming* source behave like an **incremental batch job**: process everything new, then shut down — perfect for a nightly Lakeflow Job. Remove it and the same code runs continuously.',
    },
    {
      id: 'diagram-autoloader',
      type: 'diagram',
      title: 'The moving parts',
      spec: {
        kind: 'flow',
        steps: [
          { label: 'Landing zone', sublabel: 'files keep arriving', tone: 'neutral' },
          { label: 'Auto Loader', sublabel: 'checkpoint + schema location', tone: 'brand' },
          { label: 'Bronze Delta table', sublabel: 'Unity Catalog–governed', tone: 'warn' },
        ],
        arrows: ['discovers new files', 'exactly-once append'],
      },
      caption:
        'The checkpoint is the memory. Lose it and Auto Loader forgets which files were processed.',
    },
    {
      id: 'mistake-vs-copyinto',
      type: 'mistake',
      title: 'Auto Loader vs COPY INTO — not interchangeable',
      myth: '“Auto Loader and COPY INTO do the same thing, so pick whichever syntax you like.”',
      reality:
        'Both load files incrementally, but they scale differently. **COPY INTO**: SQL-first, great up to thousands of files per run. **Auto Loader**: streaming-based, handles **millions of files**, continuous arrival, schema evolution, and file-notification mode. High volume or high frequency → Auto Loader, every time.',
    },
    {
      id: 'mcq-schema',
      type: 'mcq',
      question:
        'An Auto Loader pipeline ingests JSON with schema evolution mode `addNewColumns`. One morning the source system adds a `device_firmware` field to its events. What happens on the next run?',
      options: [
        { id: 'a', text: 'The stream fails permanently until an engineer recreates the table.' },
        { id: 'b', text: 'The new field is silently dropped from all rows.' },
        { id: 'c', text: 'The stream updates the schema to include the new column and continues; the table gains `device_firmware`.' },
        { id: 'd', text: 'All new rows are quarantined into a separate error table.' },
      ],
      correct: ['c'],
      optionFeedback: {
        a: 'The stream does stop when it first sees the new column — but on restart it picks up the evolved schema and proceeds. No table rebuild.',
        b: 'Silent dropping is exactly what schema evolution and _rescued_data prevent.',
        c: 'addNewColumns = evolve the schema, keep the data, keep going.',
        d: 'Type *mismatches* go to `_rescued_data` within the same table — new columns just extend the schema.',
      },
      explanation:
        'Schema evolution grows the table when new columns appear; `_rescued_data` catches values that don’t match existing column types. Together: nothing is silently lost.',
      examObjective:
        'Use Auto Loader with schema enforcement and schema evolution in batch modes (directory listing or file notification) to land data into Unity Catalog–governed tables.',
    },
    {
      id: 'flash-checkpoint',
      type: 'flashcard',
      front: 'What single thing remembers which files Auto Loader has already processed?',
      back: 'The **checkpoint** (checkpoint location). It also anchors exactly-once guarantees — protect it like production state.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You now understand ingestion at scale',
      points: [
        'Auto Loader = `cloudFiles` streaming source for incremental file ingestion.',
        'Checkpoint = memory → exactly-once, crash-safe processing.',
        'Directory listing by default; file notification for extreme scale.',
        'Schema inference + enforcement + evolution; `_rescued_data` saves misfits.',
        '`trigger(availableNow=True)` = run it like a batch job on a schedule.',
      ],
      closing: 'Files handled. But what about data living inside databases and SaaS apps? 🔌',
    },
  ],
}
