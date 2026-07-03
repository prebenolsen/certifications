import type { Lesson } from '@/types/content'

/**
 * Lesson: manipulating columns, rows, and nested structures.
 * Maps to exam Section 3 (add, drop, split, rename columns, apply filters,
 * explode arrays).
 */
export const reshapingDataLesson: Lesson = {
  id: 'reshaping-data',
  title: 'Reshaping tables: columns, rows & arrays',
  summary:
    'The everyday moves — add, rename, drop, split, filter — plus explode(), the trick that unfolds nested arrays into analyzable rows.',
  estimatedMinutes: 9,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'The table is right, the shape is wrong',
      body: 'Silver has everything the marketing team asked for… technically. The name is one `full_name` column and they need first/last split. Amounts are in cents, they want euros. And each order row holds an **array of items**, while their tool needs **one row per item**.\n\nNo new data required — just reshaping. These small moves are 80% of day-to-day PySpark.',
      atWork:
        'Most transformation code is not clever algorithms — it is reshaping data to match what a consumer expects.',
    },
    {
      id: 'concept-columns',
      type: 'concept',
      title: 'The column toolkit',
      body: 'Four verbs cover nearly everything:\n\n• **Add / derive**: `withColumn("price_eur", col("price_cents") / 100)`\n• **Rename**: `withColumnRenamed("cust_nm", "customer_name")`\n• **Drop**: `drop("legacy_id", "temp_col")`\n• **Split**: `split(col("full_name"), " ")` gives an array you can index — `.getItem(0)` for the first name.\n\nEach returns a **new** DataFrame; the original is untouched.',
      takeaways: [
        'withColumn adds or replaces; withColumnRenamed renames; drop removes.',
        'split() turns one string column into an array of parts.',
        'DataFrames are immutable — every operation returns a new one.',
      ],
    },
    {
      id: 'concept-filter',
      type: 'concept',
      title: 'Filtering rows',
      body: '`filter()` (alias: `where()`) keeps rows matching a condition:\n\n`df.filter(col("status") == "active")`\n`df.filter((col("amount") > 100) & (col("country") == "NO"))`\n\nNote the PySpark quirks: `&`/`|` instead of `and`/`or`, and **parentheses around each condition** — forgetting them is a classic error.',
      takeaways: [
        'filter == where; both keep matching rows.',
        'Use & | with parentheses, not Python’s and/or.',
      ],
    },
    {
      id: 'concept-explode',
      type: 'concept',
      title: 'explode(): arrays become rows',
      body: 'Nested JSON often gives you a row like `order 42 → items: [book, pen, mug]`. Aggregating “revenue per item” is impossible in that shape.\n\n`explode(col("items"))` **unfolds the array**: one output row per element, with all other columns copied along. Three items → three rows. It is the standard bridge from nested bronze data to flat, analyzable silver tables.',
      takeaways: [
        'explode = one row per array element.',
        'Other columns are duplicated onto each new row.',
        'Row count grows — expect and verify that.',
      ],
    },
    {
      id: 'diagram-explode',
      type: 'diagram',
      title: 'What explode does to a row',
      spec: {
        kind: 'flow',
        steps: [
          { label: 'order 42', sublabel: 'items = [book, pen, mug]', tone: 'brand' },
          { label: 'explode("items")', tone: 'neutral' },
          { label: '3 rows', sublabel: '42·book — 42·pen — 42·mug', tone: 'good' },
        ],
      },
      caption: 'One nested row in, one flat row per element out.',
    },
    {
      id: 'example-reshape',
      type: 'example',
      title: 'All the moves in one job',
      intro: 'The marketing reshape, start to finish:',
      code: {
        language: 'python',
        content:
          'from pyspark.sql import functions as F\n\nresult = (orders\n  .withColumn("price_eur", F.col("price_cents") / 100)\n  .withColumn("name_parts", F.split("full_name", " "))\n  .withColumn("first_name", F.col("name_parts").getItem(0))\n  .withColumnRenamed("cust_id", "customer_id")\n  .drop("price_cents", "name_parts", "full_name")\n  .filter(F.col("status") == "completed")\n  .withColumn("item", F.explode("items"))\n  .drop("items"))',
      },
      explanation:
        'Read it top to bottom like a recipe: derive, split, rename, drop, filter, explode. Chained single-purpose steps beat one clever expression — future-you can debug them.',
    },
    {
      id: 'mistake-explode-count',
      type: 'mistake',
      title: 'Counting after explode',
      myth: '“Row count changed after my transformation — something is broken.”',
      reality:
        'After `explode()`, growing row counts are **correct**: you traded one-row-per-order for one-row-per-item. The real danger is the opposite mistake — `count()`-ing exploded rows and reporting them as “orders”. Know which **grain** (row-meaning) each table has, and name tables after it (`order_items`, not `orders2`).',
    },
    {
      id: 'mcq-reshape',
      type: 'mcq',
      question:
        'A DataFrame has a `tags` column of type array<string>, and you need to count how many times each individual tag occurs across all rows. Which is the right first step?',
      options: [
        { id: 'a', text: 'df.withColumn("tag", explode("tags")) — then group by tag and count.' },
        { id: 'b', text: 'df.filter(col("tags").isNotNull()).count()' },
        { id: 'c', text: 'df.withColumnRenamed("tags", "tag") — then group by tag.' },
        { id: 'd', text: 'df.drop("tags").distinct()' },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'Unfold the array to one row per tag, then a normal groupBy/count works.',
        b: 'That counts rows that *have* tags — not occurrences of each tag.',
        c: 'Renaming doesn’t change the type — you’d be grouping by whole arrays.',
        d: 'Dropping the column removes exactly the data you need.',
      },
      explanation:
        'Aggregating array *elements* always starts with `explode()` — get to one-row-per-element, then use ordinary grouping.',
      examObjective:
        'Manipulate columns, rows, and table structures by adding, dropping, splitting, renaming column names, applying filters, and exploding arrays.',
    },
    {
      id: 'tf-immutable',
      type: 'truefalse',
      statement: 'df.drop("col_x") removes the column from df itself.',
      answer: false,
      explanation:
        'DataFrames are **immutable** — `drop()` returns a *new* DataFrame without the column; `df` is unchanged. Forgetting to assign the result (`df = df.drop(...)`) is a beginner classic.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You can now bend tables to any shape',
      points: [
        'withColumn / withColumnRenamed / drop / split cover column surgery.',
        'filter(where) with & | and parentheses selects rows.',
        'explode() unfolds arrays into one row per element — the grain changes.',
        'Every operation returns a new DataFrame; assign the result.',
      ],
      closing: 'Shaped and clean — time to summarize it. Aggregations next. 🧮',
    },
  ],
}
