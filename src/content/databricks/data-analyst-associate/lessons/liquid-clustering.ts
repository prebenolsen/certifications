import type { Lesson } from '@/types/content'

/**
 * Lesson: Liquid Clustering for analysts.
 * Maps to exam Section 5 (apply Liquid Clustering to improve query speed when
 * filtering large tables on specific columns).
 */
export const liquidClusteringLesson: Lesson = {
  id: 'liquid-clustering',
  title: 'Liquid Clustering: making filters fast',
  summary:
    'Why a filtered query still reads the whole table, how clustering packs related rows together so most files are skipped, and how to change your mind later.',
  estimatedMinutes: 9,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'A tiny filter, an enormous scan',
      body: 'Your query asks for one region — about 0.5% of the rows — and the profile says it read almost the entire table.\n\nThe filter is written correctly. The problem is *where those rows physically are*: scattered across every file, so no file can be ruled out. **Liquid Clustering** is how you fix that.',
      atWork:
        'This is the single most common cause of a slow dashboard query on a large table.',
    },
    {
      id: 'concept-skipping',
      type: 'concept',
      title: 'Why file skipping needs help',
      body: 'Delta records the **minimum and maximum value of every column in each data file**. When you filter, the engine compares your value against those ranges and skips any file that cannot contain a match.\n\nThat only works if the values are **physically grouped**. If EU rows are scattered evenly across all 40,000 files, every file’s range spans every region, nothing can be ruled out, and the whole table is read despite a perfectly good filter.',
      takeaways: [
        'Every file carries min/max statistics per column.',
        'Tight ranges → files can be skipped. Overlapping ranges → nothing is skipped.',
        'How the data is *laid out* decides whether your filter helps.',
      ],
    },
    {
      id: 'analogy-shelves',
      type: 'analogy',
      title: 'A warehouse that sorts itself',
      body: 'Imagine a warehouse where every box holds a random mix of products. To find all the blue ones you open every box.\n\nNow imagine the staff quietly reorganise boxes so similar products sit together. Ask for blue and they hand you three boxes and ignore the rest — same warehouse, a fraction of the work.',
      mapping: [
        { from: 'A box of mixed products', to: 'A data file containing every region' },
        { from: 'Boxes grouped by product', to: 'Clustering on the columns you filter' },
        { from: 'Fetching three boxes, not all', to: 'File skipping using min/max statistics' },
      ],
    },
    {
      id: 'concept-cluster-by',
      type: 'concept',
      title: 'CLUSTER BY the columns you filter on',
      body: 'Declaring `CLUSTER BY (region, order_date)` tells Databricks to organise the table’s files so rows with similar values sit together. Filters on those columns then skip most files.\n\nPick the columns your queries actually filter and join on — usually a date plus one or two dimensions. Clustering columns nobody filters on costs maintenance and buys nothing.',
      takeaways: [
        'Cluster on the columns in your `WHERE` and `JOIN` clauses.',
        'A date plus one or two dimensions covers most analytical tables.',
        'Clustering is maintained incrementally as new data arrives.',
      ],
    },
    {
      id: 'example-cluster',
      type: 'example',
      title: 'Declaring it, and changing your mind',
      intro: 'One clause at creation — and a cheap decision to revisit later:',
      code: {
        language: 'sql',
        content:
          "CREATE TABLE main.sales.orders (\n  order_id BIGINT, region STRING, order_date DATE, amount DECIMAL(10,2)\n) CLUSTER BY (order_date, region);\n\n-- Six months on, the dashboards filter differently. No table rewrite:\nALTER TABLE main.sales.orders CLUSTER BY (order_date, customer_id);\n\n-- Or let Databricks choose, from how the table is actually queried:\nALTER TABLE main.sales.orders CLUSTER BY AUTO;",
      },
      explanation:
        'Changing the clustering keys is a **metadata** change: new data lands in the new arrangement and background maintenance gradually reorganises the rest. Nothing has to be rebuilt, which is exactly what static partitioning could never offer.',
    },
    {
      id: 'concept-vs-partitioning',
      type: 'concept',
      title: 'Why this replaced partitioning',
      body: 'The old approach was **partitioning**: a directory per value of a column. It worked when you chose a low-cardinality column and never changed your mind. Choose a timestamp or a customer id and you got millions of near-empty files and slower queries — and fixing it meant rewriting the entire table.\n\nLiquid Clustering removes both traps. It handles high-cardinality and skewed columns, and the keys can change without a rewrite. For new tables it is the default answer; a table is either partitioned or Liquid-Clustered, never both.',
      takeaways: [
        'Partitioning is rigid: wrong column = tiny files, and changing it means a rewrite.',
        'Liquid Clustering copes with high cardinality and evolves with your queries.',
        'A table uses one or the other — they are mutually exclusive.',
      ],
    },
    {
      id: 'mistake-cluster-everything',
      type: 'mistake',
      title: 'Clustering on everything, just in case',
      myth: '"I will cluster on eight columns so every possible filter is fast."',
      reality:
        'Clustering works by grouping related rows together, and you cannot group by everything at once — each extra key dilutes the others. A handful of keys chosen from real query patterns beats a long speculative list.\n\nIf you genuinely do not know how the table gets queried, `CLUSTER BY AUTO` decides from observed usage instead of guesswork.',
    },
    {
      id: 'mcq-clustering',
      type: 'mcq',
      question:
        'A 3 TB table is queried mostly with `WHERE order_date BETWEEN … AND region = …`, and the query profile shows almost the whole table being read each time. What is the appropriate fix?',
      options: [
        {
          id: 'a',
          text: 'Apply Liquid Clustering on `order_date` and `region` so related rows sit together and most files can be skipped.',
        },
        {
          id: 'b',
          text: 'Increase the SQL warehouse size so the scan completes faster.',
        },
        {
          id: 'c',
          text: 'Add `LIMIT 1000` to the dashboard queries so less data is read.',
        },
        {
          id: 'd',
          text: 'Rewrite the filters as `year(order_date) = 2026` to help the engine.',
        },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'Clustering on the filtered columns tightens each file’s min/max ranges, so the engine can skip files instead of reading them.',
        b: 'A larger warehouse reads the same excess data faster and costs more; the scan volume is the problem.',
        c: '`LIMIT` caps rows returned, not rows read — and it changes the answer.',
        d: 'Wrapping the column in a function makes skipping *worse*, because the statistics can no longer be used.',
      },
      explanation:
        'Filters that are already well written but still read everything are a **layout** problem. `CLUSTER BY` the filtered columns so file skipping can do its job.',
      examObjective:
        'Apply Liquid Clustering to improve query speed when filtering large tables on specific columns.',
    },
    {
      id: 'tf-rewrite',
      type: 'truefalse',
      statement:
        'Changing a table’s clustering columns requires rewriting the whole table.',
      answer: false,
      explanation:
        'That is the headline advantage over partitioning. `ALTER TABLE … CLUSTER BY (...)` changes the keys as a metadata operation: new data follows them immediately and background maintenance reorganises existing data over time.',
    },
    {
      id: 'flash-cluster',
      type: 'flashcard',
      front: 'Which columns should you cluster a table on?',
      back: 'The ones your queries **filter and join on** — typically a date plus one or two dimensions. Or `CLUSTER BY AUTO` to let Databricks choose from observed query patterns.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You can now make big-table filters fast',
      points: [
        'Delta skips files using per-file min/max statistics.',
        'Skipping only works when the filtered values are physically grouped.',
        '`CLUSTER BY (cols)` groups them; choose the columns you filter and join on.',
        'Keys can be changed later without rewriting the table; `CLUSTER BY AUTO` picks them for you.',
        'It replaces partitioning for new tables — a table uses one or the other.',
      ],
      closing:
        'Fast, correct queries deserve an audience. Next module: dashboards. 📊',
    },
  ],
}
