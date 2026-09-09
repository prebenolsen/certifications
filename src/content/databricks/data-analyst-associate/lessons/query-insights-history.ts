import type { Lesson } from '@/types/content'

/**
 * Lesson: query history, the query profile, caching, and fixing a query.
 * Maps to exam Section 5 (identify poorly performing queries via Query Insights
 * and the Query Profiler; utilize query history and caching to reduce
 * development time and query latency; fix a query to achieve the desired
 * results). Covers sample question 10.
 * Research: src_material/.../research/platform-and-naming.md
 */
export const queryInsightsHistoryLesson: Lesson = {
  id: 'query-insights-history',
  title: 'Finding and fixing a slow query',
  summary:
    'Query history to spot which query is slow and since when, the query profile to see why, caching to avoid the work entirely — and the everyday query mistakes worth recognising.',
  estimatedMinutes: 11,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: '"The dashboard is slow" — which part?',
      body: 'A dashboard with eleven charts takes two minutes to load. Someone suggests a bigger warehouse. Someone else blames the network.\n\nNeither of them has looked. **Query history** shows which of the eleven queries actually took the time, and the **query profile** shows what that query spent it on. Guessing costs days; looking costs a minute.',
      atWork:
        'Every performance conversation should start with "what does the history say?" — it usually ends there too.',
    },
    {
      id: 'concept-history',
      type: 'concept',
      title: 'Query history: what ran, by whom, and how long it took',
      body: '**Query history** records the queries executed on your SQL warehouses. You can **filter by user, date range, compute resource, and status** (finished, failed, cancelled) to find the run you care about.\n\nEach entry carries **execution metrics**: total duration, how much of it was compilation, rows and bytes read, and how much came from cache. That is enough to answer both "which query is slow?" and "was it always this slow?"',
      takeaways: [
        'Filter by user, date range, compute, and status.',
        'Metrics per query: duration, rows and bytes read, cache hits.',
        'Compare today against last week to spot a regression.',
      ],
    },
    {
      id: 'mcq-history',
      type: 'mcq',
      question: 'Which two statements about Query History in Databricks are true?',
      options: [
        {
          id: 'a',
          text: 'It only tracks queries executed from notebooks, not through SQL warehouses.',
        },
        {
          id: 'b',
          text: 'You can filter by user, date range, compute resource and query status to locate specific patterns.',
        },
        {
          id: 'c',
          text: 'It automatically deletes all records after 24 hours to save storage.',
        },
        {
          id: 'd',
          text: 'It provides detailed execution metrics, including query duration and I/O performance.',
        },
        {
          id: 'e',
          text: 'It is only available on premium workspaces with enterprise licensing.',
        },
      ],
      correct: ['b', 'd'],
      optionFeedback: {
        a: 'Backwards — SQL warehouse queries are exactly what it records.',
        b: 'Those four filters are how you narrow thousands of executions down to the one you care about.',
        c: 'History is retained well beyond a day; comparing against last week is a standard use of it.',
        d: 'Duration, rows and bytes read, and cache usage are all recorded per query.',
        e: 'Query history is not gated behind an enterprise-only licence.',
      },
      explanation:
        'Query history is the fleet view: **filterable** (user, date, compute, status) and **metric-rich** (duration, I/O). Pick the slow execution here, then open its profile.',
      examObjective:
        'Utilize query history and caching to reduce development time and query latency',
    },
    {
      id: 'concept-profile',
      type: 'concept',
      title: 'The query profile: where the time went',
      body: 'Open a query from history and its **query profile** shows the executed plan stage by stage: **bytes and rows read** per scan, which **join** strategy ran, how much data was **shuffled** across the network, and whether anything **spilled** to disk.\n\nThree signatures cover most slow queries:\n\n• **Huge bytes read for a selective filter** → file skipping is not working.\n• **A large shuffle on a join with one small side** → it should have been broadcast.\n• **Spill to disk** → the stage handled more data than fit in memory.',
      takeaways: [
        'The profile shows the plan that actually ran, with per-stage metrics.',
        'Bytes read ≫ result size means poor data skipping.',
        'History finds the slow query; the profile explains it.',
      ],
    },
    {
      id: 'diagram-symptoms',
      type: 'diagram',
      title: 'Symptom → cause → fix',
      spec: {
        kind: 'flow',
        steps: [
          {
            label: 'Huge bytes read',
            sublabel: 'poor skipping → filter directly, cluster the table',
            tone: 'warn',
          },
          {
            label: 'Big join shuffle',
            sublabel: 'small side not broadcast → let the engine broadcast it',
            tone: 'accent',
          },
          {
            label: 'Spill to disk',
            sublabel: 'stage too big → filter earlier, reduce the data',
            tone: 'bad',
          },
        ],
      },
      caption:
        'Read the metric, then choose the fix. Adding compute is what you do when none of these apply.',
    },
    {
      id: 'concept-caching',
      type: 'concept',
      title: 'Caching: the fastest query is the one that does not run',
      body: 'Databricks caches at two levels. The **result cache** returns a stored answer when the identical query is re-run and the underlying data has not changed — which is why the second click on a dashboard is instant. The **disk cache** keeps recently-read data files on the warehouse’s local storage, so a later query re-reads them without going back to cloud storage.\n\nFor an analyst this matters while developing: iterating on the same query benefits enormously, and a cache hit shows up in query history as bytes that never had to be read.',
      takeaways: [
        'Result cache: identical query, unchanged data → instant answer.',
        'Disk cache: recently-read files stay local to the warehouse.',
        'Cache usage is visible in the query metrics.',
      ],
    },
    {
      id: 'concept-fix-query',
      type: 'concept',
      title: 'Fixing a query that returns the wrong answer',
      body: 'Not every problem is speed. The exam also asks you to spot a query that runs happily and answers the wrong question. The usual suspects:\n\n• Aggregating without a **`GROUP BY`** for the non-aggregated column.\n• Filtering an aggregate in `WHERE` instead of **`HAVING`**.\n• An **inner join** where a left join was needed, silently dropping rows.\n• `= NULL` instead of **`IS NULL`**, matching nothing.\n• A missing join key, multiplying rows and inflating every `SUM`.\n\nThe `/explain` command in the Assistant is genuinely good at walking through an inherited query and pointing at these.',
      takeaways: [
        'A query that runs is not a query that is right.',
        'Check row counts before and after joins; check totals against a known figure.',
        '`/explain` walks through the logic step by step.',
      ],
    },
    {
      id: 'mistake-bigger-warehouse',
      type: 'mistake',
      title: 'Sizing up before diagnosing',
      myth: '"The query is slow, so we need a bigger warehouse."',
      reality:
        'A bigger warehouse reads the *same excess data* faster and costs more per second. If the profile shows 400 GB read for a query returning 2,000 rows, the problem is what is being read — not how fast it is read.\n\nDiagnose first. Size up only when the profile shows the compute itself is genuinely the constraint.',
    },
    {
      id: 'tf-cache',
      type: 'truefalse',
      statement:
        'Re-running the identical query after the underlying table has been updated will still return the cached result.',
      answer: false,
      explanation:
        'The result cache is invalidated when the underlying data changes — otherwise it would serve stale answers. A cache hit requires the same query **and** unchanged source data.',
    },
    {
      id: 'flash-history-profile',
      type: 'flashcard',
      front: 'Query history versus query profile — which answers which question?',
      back: '**History:** which query was slow, for whom, and since when (filterable, with duration and I/O). **Profile:** why that one execution was slow — bytes read, join strategy, shuffle, spill.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You can now diagnose instead of guess',
      points: [
        'Query history filters by user, date, compute and status, with per-query metrics.',
        'The query profile shows the executed plan: bytes read, joins, shuffle, spill.',
        'Bytes read ≫ result size = poor data skipping, not slow hardware.',
        'Result and disk caching remove work entirely — visible in the metrics.',
        'Wrong answers usually mean a missing `GROUP BY`, `HAVING`, join key, or `IS NULL`.',
      ],
      closing:
        'Poor data skipping came up twice. Next: the feature that fixes it. 💧',
    },
  ],
}
