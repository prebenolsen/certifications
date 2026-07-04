import type { Lesson } from '@/types/content'

/**
 * Lesson: Liquid Clustering vs partitioning and ZORDER.
 * Maps to exam Section 10 (simplify layout with Liquid Clustering; identify its
 * benefits over partitioning and ZORDER) and Section 6 (delta optimizations).
 */
export const liquidClusteringLesson: Lesson = {
  id: 'liquid-clustering',
  title: 'Liquid Clustering beats partitioning',
  summary:
    'Why Liquid Clustering replaces static partitioning and ZORDER for most tables, and how CLUSTER BY (and CLUSTER BY AUTO) simplifies layout.',
  estimatedMinutes: 9,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'The layout decision you made last year is now wrong',
      body: 'You partitioned by `country` in 2024. In 2025, 80% of traffic is one country and analysts mostly filter by `event_date`. Your partitioning now hurts — but changing it means rewriting the whole table.\n\nStatic layout choices rot. Liquid Clustering exists so you can change your mind cheaply.',
      atWork:
        'The exam wants you to know *when* to reach for Liquid Clustering instead of partitioning or ZORDER — and why.',
    },
    {
      id: 'concept-what',
      type: 'concept',
      title: 'What Liquid Clustering is',
      body: 'Liquid Clustering lets you declare `CLUSTER BY (cols)` on a Delta table. Databricks then physically organizes the data by those columns and **maintains that clustering incrementally** as new data arrives — no rigid directory structure, no full rewrite.\n\nIt is the modern replacement for both partitioning and ZORDER, and the two clustering keys can be changed later without rewriting existing data.',
      takeaways: [
        '`CLUSTER BY (cols)` declares the clustering keys.',
        'Clustering is maintained incrementally, not as a big rewrite.',
        'One feature replaces both partitioning and ZORDER.',
      ],
    },
    {
      id: 'diagram-vs',
      type: 'diagram',
      title: 'Static partitioning vs Liquid Clustering',
      spec: {
        kind: 'compare',
        left: {
          label: 'Partitioning + ZORDER',
          sublabel: 'the old way',
          tone: 'warn',
          items: [
            'Fixed directory per partition value',
            'Wrong cardinality → tiny files or skew',
            'Changing the key = full rewrite',
            'ZORDER is a separate, periodic OPTIMIZE',
          ],
        },
        right: {
          label: 'Liquid Clustering',
          sublabel: 'CLUSTER BY',
          tone: 'good',
          items: [
            'No directory layout to get wrong',
            'Handles skew and high cardinality',
            'Change keys without rewriting old data',
            'Clustering maintained as data lands',
          ],
        },
      },
      caption:
        'Liquid Clustering removes the irreversible, cardinality-sensitive layout decision.',
    },
    {
      id: 'concept-benefits',
      type: 'concept',
      title: 'Why it wins',
      body: 'Three concrete advantages over partitioning/ZORDER:\n\n**Flexibility** — change clustering keys any time; only new data reorganizes. **No skew traps** — it works well even on high-cardinality columns that would wreck partitioning. **Self-maintaining** — predictive optimization clusters new data automatically, so you don’t schedule OPTIMIZE ZORDER jobs.',
      takeaways: [
        'Evolvable: keys can change without a rewrite.',
        'Safe on high-cardinality and skewed columns.',
        'Automatically maintained — no manual ZORDER cadence.',
      ],
    },
    {
      id: 'example-cluster-by',
      type: 'example',
      title: 'Declaring and changing clustering',
      intro: 'It is one clause — and you can revise it later:',
      code: {
        language: 'sql',
        content:
          "-- Cluster on the columns queries filter and join by\nCREATE TABLE events (event_date DATE, user_id LONG, action STRING)\nUSING DELTA\nCLUSTER BY (event_date, user_id);\n\n-- Change your mind next quarter — no rewrite of old data\nALTER TABLE events CLUSTER BY (event_date, action);\n\n-- Let Databricks choose keys from your query history\nCREATE TABLE events2 (...) CLUSTER BY AUTO;",
      },
      explanation:
        '`CLUSTER BY AUTO` hands key selection to Databricks, which picks and adapts clustering columns from observed query patterns — the layout decision maintains itself.',
    },
    {
      id: 'mistake-both',
      type: 'mistake',
      title: 'You can’t partition and Liquid-Cluster the same table',
      myth: '“I’ll partition by date *and* add Liquid Clustering for the other columns.”',
      reality:
        'Liquid Clustering and partitioning are **mutually exclusive** on a table — you pick one layout strategy. For most tables, choose Liquid Clustering. Reserve partitioning for the specific big-table, low-cardinality cases where you truly need physical directory separation.',
    },
    {
      id: 'mcq-choose',
      type: 'mcq',
      question:
        'A 5 TB Delta table is queried with a mix of filters that changes every few months, and one candidate column has millions of distinct values. Which layout strategy is the best fit?',
      options: [
        { id: 'a', text: 'Partition by the high-cardinality column so each value is isolated.' },
        { id: 'b', text: 'Liquid Clustering with CLUSTER BY on the common filter columns.' },
        { id: 'c', text: 'Partition by date and run OPTIMIZE ZORDER on the rest nightly.' },
        { id: 'd', text: 'No layout strategy — rely entirely on the cluster having more cores.' },
      ],
      correct: ['b'],
      optionFeedback: {
        a: 'Partitioning on a high-cardinality column creates millions of tiny files — the classic anti-pattern.',
        b: 'Correct — Liquid Clustering handles high cardinality, adapts as filters change, and self-maintains.',
        c: 'ZORDER helps but is periodic and static; changing needs still means rewrites, and shifting filters make it stale.',
        d: 'Throwing hardware at bad layout is the expensive, non-scalable answer.',
      },
      explanation:
        'Shifting query patterns + high cardinality is exactly what Liquid Clustering was built for: evolvable keys, no skew traps, automatic maintenance.',
      examObjective:
        'Identify the benefits of using Liquid Clustering over Partitioning and ZORDER.',
    },
    {
      id: 'flash-mutually-exclusive',
      type: 'flashcard',
      front: 'Can a Delta table use both partitioning and Liquid Clustering?',
      back: 'No — they are mutually exclusive. Choose one. Liquid Clustering is the default for most tables.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You can now choose a table’s layout',
      points: [
        'Liquid Clustering = `CLUSTER BY`, maintained incrementally, replaces partitioning + ZORDER.',
        'Its wins: change keys without rewrites, safe on high cardinality, self-maintaining.',
        '`CLUSTER BY AUTO` lets Databricks pick keys from query history.',
        'A table is either partitioned or Liquid-Clustered, not both.',
        'Prefer Liquid Clustering unless you have a specific big-table partitioning need.',
      ],
      closing: 'Next: the reason well-clustered tables fly — the files Spark never reads. ⚡',
    },
  ],
}
