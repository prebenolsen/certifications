import type { Lesson } from '@/types/content'

/**
 * Lesson: deduplication and aggregation on DataFrames.
 * Maps to exam Section 3 (perform data deduplication and aggregate operations
 * such as count, approximate count distinct, and mean, summary).
 */
export const dedupAggregationLesson: Lesson = {
  id: 'dedup-aggregation',
  title: 'Deduplication & aggregation',
  summary:
    'dropDuplicates done right, groupBy/agg fundamentals, and why approx_count_distinct exists (and when “approximately right” beats “exactly slow”).',
  estimatedMinutes: 9,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'Revenue that doubled overnight',
      body: 'A retry bug in the ingestion job delivered many events **twice**. Nobody noticed until the CFO asked why Tuesday’s revenue doubled.\n\nDuplicates are not a cosmetic problem — every `SUM` and `COUNT` downstream silently inherits them. Deduplication is a standard stop on the way to silver.',
      atWork:
        'At-least-once delivery is everywhere (retries, replays, reconnects). Assume duplicates exist until proven otherwise.',
    },
    {
      id: 'concept-dedup',
      type: 'concept',
      title: 'dropDuplicates — and choosing the key',
      body: '`df.distinct()` removes rows that are identical in **every** column. Usually you want `df.dropDuplicates(["event_id"])` instead: keep one row per **business key**.\n\nCareful: which row survives is arbitrary. If it matters (e.g. keep the *latest* update per key), sort or window first — dedup is a decision, not just a function call.',
      takeaways: [
        'distinct() = fully identical rows; dropDuplicates(cols) = one per key.',
        'Decide deliberately *which* duplicate should survive.',
      ],
    },
    {
      id: 'concept-groupby',
      type: 'concept',
      title: 'groupBy + agg: the summarizing machine',
      body: 'Aggregation collapses many rows into summaries per group:\n\n`df.groupBy("country").agg(F.count("*"), F.mean("amount"), F.sum("amount"))`\n\n`count`, `mean` (avg), `sum`, `min`, `max` are the everyday five. For a fast statistical overview of a whole DataFrame, `df.summary()` prints count, mean, stddev, min, quartiles, and max per numeric column — the first thing to run on unfamiliar data.',
      takeaways: [
        'groupBy defines the groups; agg computes per group.',
        'df.summary() = instant statistical profile of a DataFrame.',
      ],
    },
    {
      id: 'concept-approx',
      type: 'concept',
      title: 'approx_count_distinct: fast, slightly fuzzy counting',
      body: 'Counting **exact** distinct values (`countDistinct`) on billions of rows is expensive: every unique value must be tracked and shuffled.\n\n`approx_count_distinct("user_id")` uses a clever sketch (HyperLogLog) that answers “how many unique users?” with a small, tunable error (default ~5%, adjustable via `rsd`) at a **fraction of the cost**. For dashboards and monitoring, approximately-right-now beats exactly-right-later.',
      takeaways: [
        'Exact distinct counts shuffle heavily at scale.',
        'approx_count_distinct trades a few % accuracy for big speed.',
        'Use exact counts when the number is contractual (billing!).',
      ],
    },
    {
      id: 'example-agg',
      type: 'example',
      title: 'The full pattern',
      intro: 'Dedup, then summarize per group:',
      code: {
        language: 'python',
        content:
          'from pyspark.sql import functions as F\n\nclean = events.dropDuplicates(["event_id"])\n\ndaily = (clean\n  .groupBy("event_date")\n  .agg(\n    F.count("*").alias("events"),\n    F.approx_count_distinct("user_id").alias("unique_users_approx"),\n    F.mean("duration_ms").alias("avg_duration_ms"),\n  ))\n\nclean.summary().show()   # count, mean, stddev, min, 25/50/75%, max',
      },
      explanation:
        'Dedup **before** aggregating — the whole point is that sums and counts should not see the duplicates.',
    },
    {
      id: 'mistake-order',
      type: 'mistake',
      title: 'Aggregating first, deduplicating never',
      myth: '“We can clean up duplicates later — let’s build the daily aggregates first.”',
      reality:
        'Once rows are collapsed into aggregates, the duplicates are **baked in** and undetectable — you cannot un-sum a number. Dedup belongs upstream (bronze→silver), so every consumer inherits clean counts. “Later” never comes.',
    },
    {
      id: 'mcq-approx',
      type: 'mcq',
      question:
        'A daily monitoring dashboard needs “unique visitors” over ~5 billion events, refreshed hourly. Exact countDistinct makes the job miss its SLA. What is the standard fix?',
      options: [
        { id: 'a', text: 'Use approx_count_distinct, accepting a small bounded error for a large speedup.' },
        { id: 'b', text: 'Run countDistinct on a 1% random sample and multiply by 100.' },
        { id: 'c', text: 'count("*") — total events approximate unique visitors well enough.' },
        { id: 'd', text: 'Cache the DataFrame and rerun exact countDistinct.' },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'Exactly what the function exists for: monitoring-grade distinct counts at scale.',
        b: 'Distinct counts don’t scale linearly with samples — heavy hitters and rare values break the multiplication.',
        c: 'Total events ≠ unique visitors; one user can produce thousands of events.',
        d: 'Caching does not remove the shuffle that makes exact distinct counting slow.',
      },
      explanation:
        'For operational metrics, a ~2–5% error is invisible; the 10–100× speedup is not. Save exact distinct counts for numbers with legal or billing weight.',
      examObjective:
        'Perform data deduplication operations and aggregate operations on DataFrames, such as count, approximate count distinct, and mean, summary.',
    },
    {
      id: 'flash-dedup',
      type: 'flashcard',
      front: 'distinct() vs dropDuplicates(["order_id"]) — what’s the difference?',
      back: '`distinct()` removes rows identical in **all** columns; `dropDuplicates([cols])` keeps one row per **key**, dropping others even if they differ elsewhere.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You now summarize with confidence',
      points: [
        'Dedup by business key, upstream, deliberately choosing the survivor.',
        'groupBy().agg() with count/mean/sum is the summarizing workhorse.',
        'df.summary() profiles a DataFrame in one call.',
        'approx_count_distinct: bounded error, huge speedup — perfect for dashboards.',
      ],
      closing: 'Silver is clean and summarized. Time to build the gold layer. 🥇',
    },
  ],
}
