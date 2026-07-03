import type { Lesson } from '@/types/content'

/**
 * Lesson: gold-layer objects — tables, views, materialized views, streaming
 * tables. Maps to exam Section 3 (understand the difference between, and how
 * to build, gold layer objects for BI and analytics teams in Unity Catalog).
 */
export const goldLayerLesson: Lesson = {
  id: 'gold-layer',
  title: 'Gold layer: tables, views, materialized views & streaming tables',
  summary:
    'Four ways to serve business-ready data, what each trades between freshness, cost, and speed — and how to pick per consumer.',
  estimatedMinutes: 10,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'Three consumers, three demands',
      body: 'The BI team wants a **fast, always-ready** revenue summary for their dashboard. The finance analyst wants numbers that are **always current** when she queries, cost be damned. And the ops team wants order counts that update **as events stream in**.\n\nSame silver data — three different gold objects. Choosing which is a designed decision, not a default.',
      atWork:
        '“Just make it a table” is how you end up with either stale dashboards or a huge compute bill.',
    },
    {
      id: 'concept-table-view',
      type: 'concept',
      title: 'Table vs view: stored vs computed',
      body: 'A **table** physically stores rows. Reading it is fast; keeping it current requires a job that refreshes it.\n\nA **view** stores only a **query**. Every read re-runs that query against the underlying tables — results are always current, but you pay the computation on every read, and a slow query makes a slow dashboard.',
      takeaways: [
        'Table = precomputed rows; fast reads, needs refreshing.',
        'View = saved query; always fresh, computed on every read.',
      ],
    },
    {
      id: 'concept-mv-st',
      type: 'concept',
      title: 'Materialized views & streaming tables: the best of both',
      body: 'A **materialized view** stores its results like a table but **refreshes itself** from its definition — and the refresh is **incremental** where possible: only what changed gets recomputed. Ideal for aggregations serving BI.\n\nA **streaming table** continuously (or on schedule) **appends** new data from a streaming source — the standard object for ingestion and incremental processing steps.',
      takeaways: [
        'Materialized view = precomputed + auto-refreshed transformation.',
        'Streaming table = incrementally appended from a stream.',
        'Both are Unity Catalog objects with governance built in.',
      ],
    },
    {
      id: 'diagram-gold',
      type: 'diagram',
      title: 'Freshness vs read speed',
      spec: {
        kind: 'compare',
        left: {
          label: 'Computed on read',
          sublabel: 'always fresh',
          tone: 'accent',
          items: [
            '**View** — free to define, costs at query time',
            'Great for: light transformations, security layers',
            'Risk: slow dashboards on heavy queries',
          ],
        },
        right: {
          label: 'Precomputed',
          sublabel: 'instant reads',
          tone: 'good',
          items: [
            '**Table** — you refresh it with jobs',
            '**Materialized view** — refreshes itself, incrementally',
            '**Streaming table** — appends continuously from streams',
          ],
        },
      },
      caption:
        'Ask per consumer: how fresh must it be, how fast must reads be, who pays the compute?',
    },
    {
      id: 'example-gold',
      type: 'example',
      title: 'Building all four in SQL',
      intro: 'Gold objects are one CREATE statement each:',
      code: {
        language: 'sql',
        content:
          "CREATE TABLE gold.revenue_snapshot AS\n  SELECT region, SUM(amount) AS revenue FROM silver.orders GROUP BY region;\n\nCREATE VIEW gold.active_customers AS\n  SELECT * FROM silver.customers WHERE status = 'active';\n\nCREATE MATERIALIZED VIEW gold.daily_revenue AS\n  SELECT order_date, SUM(amount) AS revenue\n  FROM silver.orders GROUP BY order_date;\n\nCREATE STREAMING TABLE gold.order_events AS\n  SELECT * FROM STREAM read_files('s3://landing/orders/');",
      },
      explanation:
        'The materialized view keeps `daily_revenue` precomputed and refreshes incrementally as `silver.orders` changes; the streaming table keeps pulling new files as they land.',
    },
    {
      id: 'mistake-view-cheap',
      type: 'mistake',
      title: '“Views are free”',
      myth: '“Make everything a view — no storage cost, always up to date, what’s not to like?”',
      reality:
        'A view’s cost is **deferred, not removed**: every dashboard tile, every user, every auto-refresh re-runs the full query. A heavy aggregation viewed by 200 people costs far more as a view than as a materialized view computed once per refresh. Views are for *cheap* transformations and security filtering.',
    },
    {
      id: 'mcq-gold',
      type: 'mcq',
      question:
        'A BI dashboard shows revenue aggregated from a large silver table. It is viewed by hundreds of users all day; data freshness within one hour is fine. Recomputing the aggregation on every view is too slow and expensive. Which gold object fits best?',
      options: [
        { id: 'a', text: 'A view over the silver table.' },
        { id: 'b', text: 'A materialized view, refreshed on a schedule.' },
        { id: 'c', text: 'A streaming table reading from the silver table.' },
        { id: 'd', text: 'Give every user a copy of the silver table.' },
      ],
      correct: ['b'],
      optionFeedback: {
        a: 'A view re-runs the heavy aggregation on every one of those hundreds of views.',
        b: 'Precomputed for instant reads, self-refreshing (incrementally) within the freshness window — the textbook case.',
        c: 'Streaming tables are for *appending* incoming data, not for serving aggregations.',
        d: 'Hundreds of drifting copies is the problem the lakehouse exists to end.',
      },
      explanation:
        'Heavy aggregation + many readers + relaxed freshness = **materialized view**. The compute happens once per refresh instead of once per reader.',
      examObjective:
        'Understand the difference between, and how to build, gold layer objects such as materialized views, views, streaming tables, and tables in Unity Catalog.',
    },
    {
      id: 'tf-mv',
      type: 'truefalse',
      statement:
        'A materialized view must fully recompute all its data on every refresh.',
      answer: false,
      explanation:
        'Where the engine can, materialized view refreshes are **incremental** — only data affected by upstream changes is recomputed. That efficiency is a key reason to prefer them over hand-rolled CREATE TABLE refresh jobs.',
    },
    {
      id: 'flash-gold',
      type: 'flashcard',
      front: 'Always-fresh security filter · heavy BI aggregation · continuous ingest — which gold object for each?',
      back: 'Filter → **view** · BI aggregation → **materialized view** · continuous ingest → **streaming table**.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You now design the serving layer',
      points: [
        'Table: stored rows, you own the refresh.',
        'View: stored query, fresh but paid per read.',
        'Materialized view: precomputed + self-refreshing (incrementally).',
        'Streaming table: appends continuously from streaming sources.',
        'Pick per consumer: freshness need × read volume × compute cost.',
      ],
      closing: 'Pipelines built by hand so far — next module, we make them run themselves. 🗓️',
    },
  ],
}
