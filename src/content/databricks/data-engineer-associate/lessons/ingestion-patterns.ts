import type { Lesson } from '@/types/content'

/**
 * Lesson: ingestion patterns — batch, streaming, incremental.
 * Maps to exam Section 2 (enable and detail data ingestion patterns; import
 * from local files and connectors). Covers sample question 3.
 */
export const ingestionPatternsLesson: Lesson = {
  id: 'ingestion-patterns',
  title: 'Batch, streaming, or incremental?',
  summary:
    'The three ways data arrives, why “incremental” is the pattern you will use most, and the ingestion menu Databricks offers.',
  estimatedMinutes: 9,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'Three sources, three rhythms',
      body: 'Monday morning you inherit three feeds: a **nightly full dump** from the ERP system, **clickstream events** arriving every second, and a partner who **drops a few CSV files** into cloud storage at random times.\n\nOne ingestion style cannot serve all three. Recognizing the *rhythm* of a source is the first design decision of every pipeline.',
      atWork:
        'The interview question “how would you ingest this?” is really asking: batch, streaming, or incremental — and why?',
    },
    {
      id: 'concept-patterns',
      type: 'concept',
      title: 'The three patterns',
      body: '**Batch**: process a bounded chunk on a schedule (e.g. last night’s dump). Simple, predictable, fine when hours of latency are OK.\n\n**Streaming**: process events continuously as they arrive, for latency of seconds to minutes.\n\n**Incremental**: on each run, pick up **only what is new** since the last run — never reprocess history. This is the pattern behind `COPY INTO` and Auto Loader, and it is the workhorse of real pipelines.',
      takeaways: [
        'Batch = bounded chunks on a schedule.',
        'Streaming = continuous, low latency.',
        'Incremental = only-the-new-stuff; cheap and idempotent.',
      ],
    },
    {
      id: 'diagram-patterns',
      type: 'diagram',
      title: 'Same source, three rhythms',
      spec: {
        kind: 'flow',
        steps: [
          { label: 'Source', sublabel: 'files, DBs, events', tone: 'neutral' },
          { label: 'Ingest', sublabel: 'batch · streaming · incremental', tone: 'brand' },
          { label: 'Bronze table', sublabel: 'raw, governed by Unity Catalog', tone: 'warn' },
        ],
        arrows: [null, 'lands as Delta'],
      },
      caption:
        'Whatever the rhythm, the destination is the same: a **Unity Catalog–governed Delta table** in the bronze layer.',
    },
    {
      id: 'concept-menu',
      type: 'concept',
      title: 'The ingestion menu',
      body: 'Databricks gives you a tool per situation:\n\n• **UI file upload** — one-off small files, straight to a table.\n• **`COPY INTO`** — SQL command that incrementally loads files from cloud storage.\n• **Auto Loader** — continuously (or on a schedule) discovers and loads new files at scale.\n• **Lakeflow Connect** — connectors for enterprise sources (databases, SaaS apps).\n• **JDBC/REST in notebooks** — code your own pull when no connector exists.',
      takeaways: [
        'Small one-off → UI upload.',
        'Files in cloud storage → COPY INTO or Auto Loader.',
        'Enterprise systems → Lakeflow Connect; custom APIs → notebook code.',
      ],
    },
    {
      id: 'mistake-streaming',
      type: 'mistake',
      title: '“Streaming means milliseconds”',
      myth: '“If the business asks for ‘real-time’, we need a millisecond-latency streaming system.”',
      reality:
        'On Databricks, streaming runs as **micro-batches**, and most “real-time” business needs are happily met by incremental loads every few minutes. The same Auto Loader stream can even run in a **batch trigger** mode — one pattern, two rhythms. Ask for the actual freshness requirement in minutes before reaching for exotic tools.',
    },
    {
      id: 'scenario-auditlogs',
      type: 'scenario',
      title: 'Know your source before you build',
      body: 'You are asked to consume **Databricks audit logs** delivered to a customer-owned S3 bucket. Before writing any code, you check the delivery contract: the logs arrive as **JSON** files, events typically show up **within ~15 minutes**, and — importantly — **new deliveries can overwrite existing files**.\n\nThat last fact changes your design: an ingest that assumes files are immutable would silently miss updates.',
      atWork:
        'For every new source, ask three questions first: what format? how fresh? can files change after landing?',
    },
    {
      id: 'mcq-auditlogs',
      type: 'mcq',
      question:
        'Before building a pipeline over Databricks audit logs in a customer-owned S3 bucket, an engineer wants to confirm the delivery format, typical latency, and whether files may be overwritten. What is the audit log storage behavior?',
      options: [
        { id: 'a', text: 'JSON files, events typically logged within ~15 minutes of delivery starting, and new deliveries can overwrite existing files.' },
        { id: 'b', text: 'CSV files with sub-minute latency guarantees; overwrites never occur once a file is written.' },
        { id: 'c', text: 'Parquet files with eventual consistency beyond 24 hours; overwrites disabled to simplify streaming.' },
        { id: 'd', text: 'JSON files delivered weekly; overwrites completely replace prior content without appending.' },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'JSON, ~15-minute typical latency, and overwrites possible — design your ingest accordingly.',
        b: 'No sub-minute guarantee, and immutability is not promised.',
        c: 'Audit logs are JSON, not Parquet, and latency is minutes — not a day.',
        d: 'Delivery is continual (minutes), not a weekly batch.',
      },
      explanation:
        'The lesson behind the trivia: **verify the delivery contract** (format, latency, mutability) before choosing an ingestion pattern.',
      examObjective:
        'Enable and detail data ingestion patterns, including batch, streaming, and incremental loading.',
    },
    {
      id: 'tf-incremental',
      type: 'truefalse',
      statement: 'An incremental load reprocesses the entire source dataset on every run.',
      answer: false,
      explanation:
        'That is a **full batch reload**. Incremental loading tracks what was already ingested and processes **only new data** — which is what makes tools like `COPY INTO` and Auto Loader cheap to run frequently.',
    },
    {
      id: 'flash-patterns',
      type: 'flashcard',
      front: 'Nightly ERP dump · continuous clickstream · random file drops — name the pattern for each.',
      back: 'Nightly dump → **batch** · clickstream → **streaming** · random file drops → **incremental** (Auto Loader / COPY INTO).',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You now speak ingestion',
      points: [
        'Batch = scheduled chunks; streaming = continuous micro-batches; incremental = only-what’s-new.',
        'Incremental is the everyday workhorse — idempotent and cheap.',
        'The menu: UI upload, COPY INTO, Auto Loader, Lakeflow Connect, JDBC/REST notebooks.',
        'Always verify a source’s format, latency, and mutability first.',
      ],
      closing: 'Next: the simplest incremental tool in the box — COPY INTO. 📄',
    },
  ],
}
