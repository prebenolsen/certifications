import type { Lesson } from '@/types/content'

/**
 * Lesson: Aggregations and GROUP BY. Maps to exam Section 4 (aggregate
 * operations, fixing queries). Directly answers sample question 7.
 */
export const aggregationsGroupByLesson: Lesson = {
  id: 'aggregations-groupby',
  title: 'Asking questions of your data: GROUP BY',
  summary:
    'Aggregate functions squash many rows into one number. GROUP BY lets you get one number per category. The #1 exam trap lives here.',
  estimatedMinutes: 10,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'From a million rows to one insight',
      body: 'You have a `customers` table with a row per customer. Nobody wants to scroll a million rows. The real questions are: *How many customers do we have? How many per region? What is the average order value?*\n\nAnswering these means **aggregating** — collapsing many rows into a summary.',
      atWork:
        'Almost every dashboard number you have ever seen — totals, averages, counts — is an aggregate query running behind the scenes.',
    },
    {
      id: 'concept-aggregates',
      type: 'concept',
      title: 'Aggregate functions squash rows into a single value',
      body: 'An **aggregate function** takes many rows and returns **one** value.\n\nThe ones the exam expects you to know:\n• `count(*)` — how many rows\n• `count(DISTINCT x)` — how many *different* values\n• `approx_count_distinct(x)` — a fast, slightly-approximate distinct count for huge data\n• `avg(x)` / `mean(x)` — the average\n• `sum`, `min`, `max` — the usual suspects',
      takeaways: [
        'Aggregates turn *many rows* into *one number*.',
        '`approx_count_distinct` trades a tiny bit of accuracy for a lot of speed on big tables.',
      ],
    },
    {
      id: 'analogy-blender',
      type: 'analogy',
      title: 'Aggregation is a blender',
      body: 'Put a basket of fruit (your rows) into a blender and you get **one** smoothie (one value). You cannot un-blend it back into individual fruits.\n\nThat is why `SELECT name, count(*)` is suspicious: you asked for one blended number *and* an individual fruit at the same time. SQL needs to know how to reconcile that — which is exactly what `GROUP BY` is for.',
      mapping: [
        { from: 'Basket of fruit', to: 'Many input rows' },
        { from: 'One smoothie', to: 'One aggregated value' },
        { from: 'Separate smoothies per fruit type', to: 'GROUP BY category' },
      ],
    },
    {
      id: 'concept-groupby',
      type: 'concept',
      title: 'GROUP BY: one summary per category',
      body: 'Often you do not want *one* grand total — you want **one number per group**. `GROUP BY` splits rows into buckets that share a value, then runs the aggregate **inside each bucket**.\n\n`GROUP BY region` makes one bucket per region; `count(*)` then counts the rows in each bucket.',
      takeaways: [
        'GROUP BY creates one output row per distinct group.',
        'Every non-aggregated column in your SELECT must appear in GROUP BY.',
      ],
    },
    {
      id: 'diagram-groupby',
      type: 'diagram',
      title: 'How GROUP BY collapses rows',
      diagramId: 'group-by-flow',
      caption:
        'Five customer rows become two result rows — one per region — each carrying its own count.',
    },
    {
      id: 'example-groupby',
      type: 'example',
      title: 'Customers per region, done right',
      intro: 'To count customers in each region:',
      code: {
        language: 'sql',
        content:
          'SELECT region, count(*) AS number_of_customers\nFROM customers\nGROUP BY region\nORDER BY number_of_customers DESC;',
      },
      explanation:
        '`GROUP BY region` makes the buckets, `count(*)` counts each, and `ORDER BY` just sorts the finished result for readability. Note that `ORDER BY` is about *presentation* — it never does the grouping for you.',
    },
    {
      id: 'mistake-missing-groupby',
      type: 'mistake',
      title: 'The single most-tested SQL trap',
      myth: '"`ORDER BY region` will group my rows by region for me."',
      reality:
        '`ORDER BY` only **sorts** the final output — it never groups. Without a `GROUP BY`, `SELECT region, count(*)` is ambiguous and fails (or returns one grand total). This is exactly sample Question 7: the fix is to add `GROUP BY region`.',
    },
    {
      id: 'mcq-fix-query',
      type: 'mcq',
      question:
        'This query was meant to return the number of customers in each region but did not work:\n`SELECT region, count(*) AS number_of_customers FROM customers ORDER BY region;`\nWhat is the problem?',
      options: [
        { id: 'a', text: 'It is missing a `GROUP BY region` clause.' },
        { id: 'b', text: '`ORDER BY` is not allowed alongside an aggregation.' },
        { id: 'c', text: 'It is missing a `HAVING` clause.' },
        { id: 'd', text: '`region` should only appear in `ORDER BY`, not `SELECT`.' },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'Correct — you select a plain column next to an aggregate, so you must group by that column.',
        b: 'ORDER BY is perfectly fine with aggregation; it just sorts the result.',
        c: 'HAVING filters groups after aggregation; it is not what makes grouping happen.',
        d: 'You *want* region in SELECT so it shows in the output — it just also needs to be in GROUP BY.',
      },
      explanation:
        'When you SELECT a non-aggregated column (`region`) beside an aggregate (`count(*)`), SQL needs a `GROUP BY region` to know how to bucket the rows.',
      examObjective: 'Fix a query to achieve the desired results.',
    },
    {
      id: 'concept-where-having',
      type: 'concept',
      title: 'WHERE vs HAVING: filter before or after grouping',
      body: '`WHERE` filters **individual rows before** they are grouped.\n`HAVING` filters **whole groups after** aggregation.\n\nSo "only customers created this year" is a `WHERE`. But "only regions with more than 100 customers" is a `HAVING count(*) > 100`, because it filters on an aggregate that does not exist until *after* grouping.',
      takeaways: [
        'WHERE = before grouping, works on raw rows.',
        'HAVING = after grouping, works on aggregate results.',
      ],
    },
    {
      id: 'tf-having',
      type: 'truefalse',
      statement:
        'You can use `WHERE count(*) > 100` to keep only large groups.',
      answer: false,
      explanation:
        'No — `WHERE` runs *before* aggregation, so `count(*)` does not exist yet. To filter on an aggregate you must use `HAVING count(*) > 100`.',
    },
    {
      id: 'flash-approx',
      type: 'flashcard',
      front:
        'Why might you choose `approx_count_distinct(user_id)` over `count(DISTINCT user_id)`?',
      back: 'On very large tables the approximate version is much faster and cheaper, trading a small, bounded error for big performance gains — ideal for dashboards where an exact distinct count is not essential.',
    },
    {
      id: 'concept-profile',
      type: 'concept',
      title: 'Summary statistics before you aggregate anything',
      body: 'Before writing a single `GROUP BY`, get the shape of the data. Running a notebook cell that returns a DataFrame gives you a **data profile** alongside the results: for every column, summary statistics — count, mean, standard deviation, min, max and quartiles for numeric columns, plus null counts — and a **histogram** of how the values are distributed.\n\nStrings and dates get profiled too, not just numbers. It is the fastest way to spot the problems that would otherwise surface as a wrong average: unexpected nulls, a suspicious maximum, a category that dominates everything.',
      takeaways: [
        'The notebook data profile summarises **every** column type, not only numerics.',
        'You get distributions (histograms) as well as summary statistics.',
        'Profile first — it catches the data-quality problems that corrupt aggregates.',
      ],
    },
    {
      id: 'mcq-profile',
      type: 'mcq',
      question:
        'An analyst wants to understand a new customer dataset quickly: distributions, potential quality issues, and summary statistics. What do the data preview features in a notebook automatically provide?',
      options: [
        { id: 'a', text: 'Row count and column names.' },
        {
          id: 'b',
          text: 'Summary statistics for numeric, string and date columns, plus histograms showing the value distribution of each column.',
        },
        {
          id: 'c',
          text: 'Data type information, null counts and standard deviation for numeric columns only.',
        },
        {
          id: 'd',
          text: 'Real-time performance metrics and query execution statistics for the dataset.',
        },
      ],
      correct: ['b'],
      optionFeedback: {
        a: 'That is the bare schema — the profile goes considerably further.',
        b: 'The profile covers numeric, string and date columns and visualises each distribution.',
        c: 'Profiling is not limited to numeric columns; strings and dates are summarised too.',
        d: 'Execution metrics describe how a query ran, not what the data contains.',
      },
      explanation:
        'The data profile answers "what is in this table?" — per-column summary statistics across types, with histograms for the distributions. Execution metrics are a different tool entirely.',
      examObjective:
        'Perform aggregate operations such as count, approximate count distinct, mean, and summary statistics.',
    },
    {
      id: 'summary',
      type: 'summary',
      title: 'The mental model',
      points: [
        'Aggregate = many rows in, one value out.',
        'GROUP BY = one aggregated value per category.',
        'Every plain column in SELECT must be in GROUP BY.',
        'WHERE filters rows *before* grouping; HAVING filters groups *after*.',
        'ORDER BY only sorts — it never groups.',
      ],
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You can now interrogate a table',
      points: [
        'You know the core aggregate functions, including `approx_count_distinct`.',
        'You understand how GROUP BY buckets rows.',
        'You will never again confuse ORDER BY with GROUP BY.',
        'You can filter before (WHERE) and after (HAVING) aggregation.',
      ],
      closing:
        'One table summarised. Next: pulling several tables together. 🤝',
    },
  ],
}
