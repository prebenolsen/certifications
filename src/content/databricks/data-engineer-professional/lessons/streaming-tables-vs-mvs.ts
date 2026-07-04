import type { Lesson } from '@/types/content'

/**
 * Lesson: streaming tables vs materialized views.
 * Maps to exam Section 1 (explain the advantages and disadvantages of streaming
 * tables compared to materialized views).
 */
export const streamingTablesVsMvsLesson: Lesson = {
  id: 'streaming-tables-vs-mvs',
  title: 'Streaming table or materialized view?',
  summary:
    'The trade-offs between streaming tables (incremental, append-oriented) and materialized views (maintained query results) — and how to choose per dataset.',
  estimatedMinutes: 9,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'Two tables, two wrong choices',
      body: 'An engineer made the raw ingest a materialized view (so it re-reads all source files every run — slow and expensive) and made a complex aggregate a streaming table (so it can’t recompute correctly when late data changes old groups).\n\nBoth are backwards. Knowing which object fits which job is a core Professional skill.',
      atWork:
        'Pick the wrong object and you either overpay on every run or get subtly wrong numbers.',
    },
    {
      id: 'concept-streaming-table',
      type: 'concept',
      title: 'Streaming tables process each row once',
      body: 'A **streaming table** reads its source as a stream and processes **only new data** each run, appending results. It’s built on Structured Streaming, so it keeps a checkpoint and never reprocesses rows it already handled.\n\nThat makes it ideal for **ingestion and append-only transforms** on ever-growing sources — bronze/silver layers.',
      takeaways: [
        'Reads only new data since the last run (incremental).',
        'Append-oriented; keeps a checkpoint of progress.',
        'Best for ingestion and row-by-row silver transforms.',
      ],
    },
    {
      id: 'concept-mv',
      type: 'concept',
      title: 'Materialized views maintain a full result',
      body: 'A **materialized view** stores the result of a query and keeps it up to date when sources change — recomputing, or incrementally updating when it can. Because it always reflects the *entire* current source, it handles **aggregations, joins, and updates/deletes** correctly.\n\nThat correctness costs more compute than a pure append, since maintaining the result may reprocess data.',
      takeaways: [
        'Stores and maintains a query result over the whole source.',
        'Correct for aggregations, joins, and changing source rows.',
        'More expensive than an append-only streaming table.',
      ],
    },
    {
      id: 'diagram-compare',
      type: 'diagram',
      title: 'The trade-off in one view',
      spec: {
        kind: 'compare',
        left: {
          label: 'Streaming table',
          sublabel: 'incremental append',
          tone: 'brand',
          items: [
            '+ Processes each row once — cheap, low latency',
            '+ Perfect for ingestion / append transforms',
            '– Source must be append-only for clean semantics',
            '– Not for aggregates over changing history',
          ],
        },
        right: {
          label: 'Materialized view',
          sublabel: 'maintained result',
          tone: 'accent',
          items: [
            '+ Always correct over the full source',
            '+ Handles aggregations, joins, updates/deletes',
            '– Maintenance can reprocess data — costlier',
            '– Higher latency than a pure append',
          ],
        },
      },
      caption:
        'Streaming table = cheap and incremental but append-oriented; materialized view = correct over everything but costlier.',
    },
    {
      id: 'mistake-agg-streaming',
      type: 'mistake',
      title: 'Aggregating in a streaming table',
      myth: '“I’ll make my gold revenue-by-day table a streaming table so it’s cheap and incremental.”',
      reality:
        'If a *late* record lands for an old day, an append-only streaming table can’t revise that day’s already-emitted total without complex stateful logic. A **materialized view** recomputes the affected groups correctly. Use streaming tables for ingestion, materialized views for aggregates.',
    },
    {
      id: 'mcq-choose',
      type: 'mcq',
      question:
        'Which pairing correctly matches the object to the job?',
      options: [
        {
          id: 'a',
          text: 'Streaming table for incremental JSON ingestion; materialized view for a daily revenue aggregate.',
        },
        {
          id: 'b',
          text: 'Materialized view for raw ingestion; streaming table for a multi-table join with updates.',
        },
        {
          id: 'c',
          text: 'Streaming table for both, to minimize cost regardless of correctness.',
        },
        {
          id: 'd',
          text: 'Materialized view for both, since it is always the safest option.',
        },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'Correct — incremental ingest suits a streaming table; an aggregate that must revise past groups suits a materialized view.',
        b: 'Backwards: ingestion should be incremental (streaming table), and a join over changing rows needs a materialized view.',
        c: 'A streaming table can’t correctly maintain aggregates over changing history.',
        d: 'Materializing raw ingestion re-reads all files each run — needlessly expensive.',
      },
      explanation:
        'Streaming tables win for append-only ingestion; materialized views win when the result must stay correct over changing/aggregated data.',
      examObjective:
        'Explain the advantages and disadvantages of streaming tables compared to materialized views.',
    },
    {
      id: 'flash-late-data',
      type: 'flashcard',
      front: 'Why is a materialized view better than a streaming table for a daily aggregate?',
      back: 'It recomputes affected groups when *late* or changed source rows arrive; an append-only streaming table can’t revise a total it already emitted.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You can now pick the right object',
      points: [
        'Streaming table: incremental, append-oriented, cheap — for ingestion/silver.',
        'Materialized view: maintained result over the full source — for aggregates/joins.',
        'Streaming tables assume append-only sources for clean semantics.',
        'Materialized views cost more but stay correct when history changes.',
        'Rule of thumb: ingest with streaming tables, aggregate with materialized views.',
      ],
      closing: 'Next: handling sources that update and delete — APPLY CHANGES. 🔀',
    },
  ],
}
