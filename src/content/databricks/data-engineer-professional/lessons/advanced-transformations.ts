import type { Lesson } from '@/types/content'

/**
 * Lesson: advanced Spark SQL / PySpark transformations.
 * Maps to exam Section 3 (window functions, joins, and aggregations to
 * manipulate and analyze large datasets).
 */
export const advancedTransformationsLesson: Lesson = {
  id: 'advanced-transformations',
  title: 'Windows, joins & aggregations at scale',
  summary:
    'Window functions for per-group ranking and running totals, join strategies (broadcast vs shuffle) and skew, and efficient aggregation.',
  estimatedMinutes: 11,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: '"Latest record per customer"',
      body: 'You need the most recent order per customer from a billion-row table. A self-join is slow and error-prone. A `GROUP BY` collapses the rows and loses the columns you wanted.\n\nThe right tool is a **window function** — rank within each customer and keep row 1. Windows, join strategy, and aggregation are the three transformation skills the exam leans on hardest.',
      atWork:
        'Deduplication, "top N per group," and running totals are daily work — and all are window-function problems.',
    },
    {
      id: 'concept-window',
      type: 'concept',
      title: 'Window functions compute across related rows',
      body: 'A **window function** calculates a value over a set of rows *related to the current row* — without collapsing them like `GROUP BY` does. You define the window with `PARTITION BY` (the group) and `ORDER BY` (the ordering within it).\n\n`ROW_NUMBER()`, `RANK()`, `LAG()/LEAD()`, and running `SUM() OVER (…)` all keep every input row while adding a computed column.',
      takeaways: [
        'Windows compute over related rows but keep every row.',
        '`PARTITION BY` sets the group; `ORDER BY` sets the order.',
        'Ranking, lag/lead, and running totals are window jobs.',
      ],
    },
    {
      id: 'example-window',
      type: 'example',
      title: 'Latest order per customer',
      intro: 'Rank within each customer, keep the newest:',
      code: {
        language: 'sql',
        content:
          "SELECT * FROM (\n  SELECT *,\n    ROW_NUMBER() OVER (\n      PARTITION BY customer_id\n      ORDER BY order_ts DESC\n    ) AS rn\n  FROM orders\n)\nWHERE rn = 1;",
      },
      explanation:
        '`PARTITION BY customer_id` groups rows per customer; `ORDER BY order_ts DESC` puts the newest first; `rn = 1` keeps it — with all columns intact, which a GROUP BY couldn’t do.',
    },
    {
      id: 'tf-window',
      type: 'truefalse',
      statement:
        'A window function collapses each partition into a single output row, like GROUP BY.',
      answer: false,
      explanation:
        'Window functions *retain* every input row and add a computed column. Collapsing to one row per group is what GROUP BY does — the key difference.',
    },
    {
      id: 'concept-joins',
      type: 'concept',
      title: 'Broadcast vs shuffle joins',
      body: 'By default Spark does a **shuffle (sort-merge) join**: both sides are shuffled across the network so matching keys meet — expensive on big data. If one side is **small**, Spark can **broadcast** it: send the whole small table to every executor and join locally, avoiding the shuffle of the big table.\n\nAdaptive Query Execution auto-broadcasts under a size threshold; you can also hint `/*+ BROADCAST(dim) */`.',
      takeaways: [
        'Shuffle/sort-merge join: both sides shuffled — the default for large tables.',
        'Broadcast join: ship the small side to every executor, no big shuffle.',
        'AQE auto-broadcasts small sides; a BROADCAST hint forces it.',
      ],
    },
    {
      id: 'concept-skew',
      type: 'concept',
      title: 'Skew is the join killer',
      body: 'A join slows to a crawl when one key holds a huge share of the rows (a "hot" key) — one task gets all of it while others sit idle. That’s **data skew**.\n\nAdaptive Query Execution has **skew join handling** that splits the oversized partition automatically. Recognizing skew (one straggler task, a long tail in the Spark UI) is a core troubleshooting signal.',
      takeaways: [
        'Skew = one key dominates → one overloaded task.',
        'Symptom: a single straggler task while others finish early.',
        'AQE skew-join splitting mitigates it automatically.',
      ],
    },
    {
      id: 'concept-aggregation',
      type: 'concept',
      title: 'Aggregate efficiently',
      body: 'Aggregations shuffle data by grouping key, so cost scales with the number of groups and the shuffle size. Prefer built-in aggregates (they combine partially on each partition before the shuffle) over UDFs. For huge-cardinality distinct counts, `approx_count_distinct` trades a little accuracy for a lot of speed.',
      takeaways: [
        'Aggregations shuffle by grouping key — mind the group count.',
        'Built-in aggregates pre-combine per partition; UDFs don’t.',
        '`approx_count_distinct` scales where exact COUNT(DISTINCT) won’t.',
      ],
    },
    {
      id: 'mcq-window',
      type: 'mcq',
      question:
        'You must return, for each account, the single most recent transaction *with all its columns*, from a very large table. Which approach is best?',
      options: [
        {
          id: 'a',
          text: 'ROW_NUMBER() OVER (PARTITION BY account_id ORDER BY txn_ts DESC), then filter rn = 1.',
        },
        {
          id: 'b',
          text: 'GROUP BY account_id with MAX(txn_ts), then hope the other columns come along.',
        },
        { id: 'c', text: 'A self-join of the table to itself on account_id and max timestamp.' },
        { id: 'd', text: 'Collect all rows to the driver and pick the latest per account in Python.' },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'Correct — a windowed ROW_NUMBER keeps all columns and scales, taking exactly the newest row per account.',
        b: 'GROUP BY MAX() gives the timestamp but not the rest of that row’s columns.',
        c: 'A self-join is more expensive and breaks on ties without extra logic.',
        d: 'Collecting a very large table to the driver will OOM — never do this at scale.',
      },
      explanation:
        '"Top-1 per group, all columns" is the canonical window-function pattern: ROW_NUMBER partitioned by the group, ordered by recency, filtered to 1.',
      examObjective:
        'Write efficient Spark SQL and PySpark code to apply advanced transformations, including window functions, joins, and aggregations.',
    },
    {
      id: 'flash-window-vs-groupby',
      type: 'flashcard',
      front: 'What’s the key difference between a window function and GROUP BY?',
      back: 'A window function keeps every input row (adding a computed column); GROUP BY collapses each group to a single row.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You can now transform at scale',
      points: [
        'Window functions compute over related rows without collapsing them.',
        '"Top-N per group" = ROW_NUMBER partitioned + ordered, filtered.',
        'Broadcast small sides to skip the big shuffle; AQE does it automatically.',
        'Watch for skew — one hot key overloads one task.',
        'Prefer built-in aggregates; use approx_count_distinct at high cardinality.',
      ],
      closing: 'Next: catching the rows that shouldn’t pass — quarantining bad data. 🧪',
    },
  ],
}
