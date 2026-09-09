import type { Lesson } from '@/types/content'

/**
 * Lesson: views, materialized views, streaming tables and dynamic views.
 * Maps to exam Section 4 (create a materialized view, including knowing when to
 * use Streaming Tables and Materialized Views, and differentiate between dynamic
 * and materialized views). Covers sample question 3.
 * Research: src_material/.../research/platform-and-naming.md
 */
export const viewsMvStreamingLesson: Lesson = {
  id: 'views-mv-streaming',
  title: 'Views, materialized views & streaming tables',
  summary:
    'Four objects that look like tables: which stores rows, which stores a query, which keeps itself fresh, and which shows different data to different people.',
  estimatedMinutes: 11,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'Two dashboards, two wrong choices',
      body: 'The executive dashboard runs a heavy aggregation as a plain **view** — recomputed from scratch every time one of 200 people opens it, and slow every single time.\n\nThe sensor feed was built as a **materialized view**, so every refresh rescans the entire history to add a few thousand new readings.\n\nBoth work. Both are the wrong object, and the bill shows it.',
      atWork:
        'Choosing between these four is a design decision you make once and everyone pays for daily.',
    },
    {
      id: 'concept-view',
      type: 'concept',
      title: 'View: a stored query',
      body: 'A **view** stores no data — only its `SELECT`. Every read re-runs that query against the current source tables.\n\nSo a view is always perfectly fresh and costs nothing to store, but you pay the full computation on every single read. Perfect for a light transformation or an approved column subset; painful for a heavy aggregation that hundreds of people open.',
      takeaways: [
        'Stores a query, not rows. Always current.',
        'Costs compute on every read — no storage.',
        'Best for cheap transformations and publishing an approved slice.',
      ],
    },
    {
      id: 'concept-mv',
      type: 'concept',
      title: 'Materialized view: results stored and kept current',
      body: 'A **materialized view** is a Unity Catalog managed table that physically stores the results of its query, and **refreshes itself** to reflect changes in the sources. Reads are as fast as a table because the answer is already computed.\n\nRefreshes can be **incremental** (only what changed is recomputed) or **full**, and Databricks picks the cheaper option. Critically, that refresh runs on a **serverless pipeline**, not on your SQL warehouse — so warehouse size neither helps nor limits it.',
      takeaways: [
        'Precomputed results, refreshed automatically — fast reads, no manual rebuild.',
        'Refresh is incremental where possible, otherwise full.',
        'The refresh runs on serverless compute, not your SQL warehouse.',
      ],
    },
    {
      id: 'example-mv',
      type: 'example',
      title: 'Creating and scheduling one',
      intro: 'A dashboard aggregate that maintains itself:',
      code: {
        language: 'sql',
        content:
          "CREATE OR REPLACE MATERIALIZED VIEW main.analytics.daily_revenue\nSCHEDULE CRON '0 0 6 * * ?' AT TIME ZONE 'UTC'\nAS\nSELECT date(order_ts) AS day,\n       region,\n       sum(amount)     AS revenue\nFROM main.sales.orders\nGROUP BY date(order_ts), region;",
      },
      explanation:
        'The heavy `GROUP BY` runs once per refresh instead of once per viewer. Drop the `SCHEDULE` clause and you refresh it on demand; add `TRIGGER ON UPDATE` instead and it refreshes when the source tables change.',
    },
    {
      id: 'concept-streaming-table',
      type: 'concept',
      title: 'Streaming table: for data that only ever arrives',
      body: 'A **streaming table** processes **only the new rows** since its last refresh and appends them. Nothing already handled is looked at again, so the work stays proportional to what arrived rather than to the size of the table.\n\nThat makes it the right object for continuously arriving data — sensor readings, clickstream, files landing in a volume. Like materialized views, it refreshes on serverless compute.',
      takeaways: [
        'Processes new rows once, appends them — cost scales with arrivals.',
        'The natural home for continuously arriving source data.',
        '"Streaming" describes the processing model; it can run on a schedule.',
      ],
    },
    {
      id: 'mistake-choosing',
      type: 'mistake',
      title: 'Choosing by freshness instead of by source',
      myth: '"Streaming tables are for real-time things and materialized views are for batch reports — I pick based on how fresh the data must be."',
      reality:
        'Freshness is a schedule setting on both. The deciding question is **what the source does**.\n\nIf rows are only ever *added*, a streaming table processes each one once — cheap and incremental. If existing rows can **change**, or the query **aggregates** over history, a materialized view is required: appending cannot express "that total went down".',
    },
    {
      id: 'diagram-four',
      type: 'diagram',
      title: 'Stored query or stored rows?',
      spec: {
        kind: 'compare',
        left: {
          label: 'Computed on read',
          sublabel: 'always current',
          tone: 'accent',
          items: [
            '**View** — a stored query, recomputed every read',
            '**Dynamic view** — a view whose result depends on who asks',
            'No storage; cost lands on every reader',
          ],
        },
        right: {
          label: 'Stored and maintained',
          sublabel: 'fast reads',
          tone: 'good',
          items: [
            '**Materialized view** — results refreshed from the sources',
            '**Streaming table** — new rows appended incrementally',
            'Refreshed by serverless compute, not your warehouse',
          ],
        },
      },
      caption:
        'Left: pay per read, always fresh. Right: pay per refresh, instant to read.',
    },
    {
      id: 'concept-dynamic-view',
      type: 'concept',
      title: 'Dynamic view: the same query, different answers',
      body: 'A **dynamic view** applies logic based on *who is running it*, using functions such as `is_account_group_member(\'finance\')` and `session_user()`.\n\n`CASE WHEN is_account_group_member(\'finance\') THEN email ELSE \'REDACTED\' END AS email` gives finance the real address and everyone else the literal string — one view, one definition, different results per viewer.\n\nThis is the difference the exam draws: a **materialized view** is about *when* results are computed; a **dynamic view** is about *who* sees what.',
      takeaways: [
        'Branches on group membership or user identity at query time.',
        'Used for row filtering and column masking without copying tables.',
        'Materialized = when it is computed; dynamic = who sees what.',
      ],
    },
    {
      id: 'mcq-choose',
      type: 'mcq',
      question:
        'An analyst needs two objects: one for real-time analysis of continuously arriving sensor data, and one for frequent, complex queries on static data powering a BI dashboard. What should they use?',
      options: [
        {
          id: 'a',
          text: 'A streaming table for the sensor data, and a materialized view for the BI queries.',
        },
        {
          id: 'b',
          text: 'A materialized view for the sensor data, and a streaming table for the BI queries.',
        },
        {
          id: 'c',
          text: 'A materialized view for both, to maximise freshness.',
        },
        {
          id: 'd',
          text: 'A streaming table for both, to simplify the pipeline.',
        },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'Continuously arriving, append-only data suits a streaming table; a heavy repeated aggregation suits precomputed, self-refreshing results.',
        b: 'Backwards on both counts: a materialized view would rescan the sensor history, and a streaming table cannot maintain an aggregate over static data.',
        c: 'Materializing the sensor feed reprocesses history on every refresh — expensive and unnecessary for append-only data.',
        d: 'A streaming table appends new rows; it cannot serve a complex aggregate over an existing static dataset.',
      },
      explanation:
        'Match the object to the **source behaviour**: append-only arrivals → **streaming table**; repeated heavy queries over data that can change → **materialized view**.',
      examObjective:
        'Create a materialized view, including knowing when to use Streaming Tables and Materialized Views, and differentiate between dynamic and materialized views.',
    },
    {
      id: 'tf-mv-compute',
      type: 'truefalse',
      statement:
        'Making a SQL warehouse larger will make a materialized view refresh faster.',
      answer: false,
      explanation:
        'Creation and refresh of a materialized view or streaming table run on a **serverless pipeline**, independent of the SQL warehouse. Warehouse size affects the queries *reading* the object, not the refresh that maintains it.',
    },
    {
      id: 'flash-dynamic-vs-mv',
      type: 'flashcard',
      front: 'Dynamic view versus materialized view — what does each one actually decide?',
      back: '**Dynamic view:** *who* sees what — results branch on the caller’s identity or group. **Materialized view:** *when* results are computed — they are stored and refreshed rather than recomputed per read.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You can now pick the right object',
      points: [
        '**View** — stored query: always fresh, recomputed on every read.',
        '**Materialized view** — stored results, refreshed incrementally or fully.',
        '**Streaming table** — new rows processed once and appended.',
        '**Dynamic view** — results depend on who is asking.',
        'Choose by what the **source** does, not by how fresh you want it.',
        'Refreshes run on serverless compute, not your SQL warehouse.',
      ],
      closing:
        'Next: reading a table as it was last Tuesday — Delta Lake time travel. 🕰️',
    },
  ],
}
