import type { Lesson } from '@/types/content'

/**
 * Lesson: filtering and sorting.
 * Maps to exam Section 4 (perform sorting and filtering operations on a table).
 */
export const filteringSortingLesson: Lesson = {
  id: 'filtering-sorting',
  title: 'Filtering & sorting a table',
  summary:
    'WHERE, ORDER BY, LIMIT and DISTINCT — the clauses you write every day, plus the filter shapes that quietly make a query read the whole table.',
  estimatedMinutes: 9,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'Two queries, same answer, one bill',
      body: 'Two analysts ask for last month’s Norwegian orders. One query returns in three seconds; the other takes four minutes and reads the entire table.\n\nThe SQL looks almost identical. The difference is *how* the filter is written — and on a billion-row table, that is the whole difference between a fast dashboard and an expensive one.',
      atWork:
        'Filtering is the cheapest performance tuning available: rows never read cost nothing.',
    },
    {
      id: 'concept-where',
      type: 'concept',
      title: 'WHERE: keeping the rows you want',
      body: '`WHERE` tests each row and keeps the ones where the condition is true. The building blocks:\n\n• Comparisons: `=`, `<>`, `<`, `>=`\n• Ranges: `BETWEEN \'2026-01-01\' AND \'2026-01-31\'`\n• Sets: `country IN (\'NO\', \'SE\', \'DK\')`\n• Patterns: `email LIKE \'%@acme.com\'`\n• Missing values: `IS NULL` / `IS NOT NULL`\n\nCombine them with `AND` / `OR`, and use parentheses whenever both appear — `AND` binds tighter than `OR`, which is a classic source of quietly wrong results.',
      takeaways: [
        '`WHERE` filters individual rows before anything else happens.',
        '`IN`, `BETWEEN`, `LIKE` are shorthand for common comparisons.',
        'Mixing `AND` and `OR` without parentheses changes the meaning.',
      ],
    },
    {
      id: 'concept-order-limit',
      type: 'concept',
      title: 'ORDER BY and LIMIT: the last things to happen',
      body: '`ORDER BY col DESC` sorts the final result; `LIMIT 100` returns only the first rows of it. Sorting happens **after** filtering and grouping, so it never changes which rows qualify — only the order they come back in.\n\nSorting is not free: the engine must compare rows across the whole result. Sorting a hundred rows for a dashboard is nothing; sorting fifty million to look at the top ten is waste — filter first, then sort.',
      takeaways: [
        '`ORDER BY` runs last and only reorders; it never groups or filters.',
        '`LIMIT` caps the returned rows — after the sort has been computed.',
        'Filter before you sort, especially on large tables.',
      ],
    },
    {
      id: 'concept-distinct',
      type: 'concept',
      title: 'DISTINCT: fewer rows, more work',
      body: '`SELECT DISTINCT region FROM orders` returns each region once. Useful — but `DISTINCT` makes the engine compare rows across the entire result to eliminate repeats, which is expensive on big tables.\n\nTwo habits worth having: put `DISTINCT` on the smallest column list that answers the question, and be suspicious when you need it on a supposedly unique key — that is usually a duplicate-data problem to fix upstream, not a query to patch.',
      takeaways: [
        '`DISTINCT` removes repeated rows across all selected columns.',
        'It costs a comparison pass — select fewer columns when you use it.',
        'Needing `DISTINCT` on a primary key is a data-quality signal.',
      ],
    },
    {
      id: 'concept-sargable',
      type: 'concept',
      title: 'Filters the engine can skip files with',
      body: 'Delta records the **minimum and maximum value of each column in every data file**. When you filter on a column directly, the engine compares your value to those ranges and skips files that cannot match — often reading a handful of files instead of thousands.\n\nWrapping the column in a function defeats this. `WHERE year(order_date) = 2026` hides the column inside a call, so the ranges cannot be used and every file is read. `WHERE order_date >= \'2026-01-01\' AND order_date < \'2027-01-01\'` asks the same question in a form the engine can skip with.',
      takeaways: [
        'Compare the column directly; keep functions off the filtered column.',
        'A date range beats `year(col) = …` — same answer, far fewer files read.',
        'This is why filtering is a performance topic, not just a syntax one.',
      ],
    },
    {
      id: 'example-filter',
      type: 'example',
      title: 'The same question, written two ways',
      intro: 'Both return January’s Norwegian orders. Only one lets the engine skip files:',
      code: {
        language: 'sql',
        content:
          "-- Reads every file: the column is buried inside functions\nSELECT * FROM main.sales.orders\nWHERE year(order_date) = 2026 AND month(order_date) = 1\n  AND upper(country) = 'NO';\n\n-- Skippable: plain comparisons on the columns themselves\nSELECT order_id, order_date, amount\nFROM main.sales.orders\nWHERE order_date >= '2026-01-01'\n  AND order_date <  '2026-02-01'\n  AND country = 'NO'\nORDER BY order_date DESC\nLIMIT 100;",
      },
      explanation:
        'The second version also selects three columns instead of `*`. On a columnar format that alone avoids reading every other column — two easy habits that compound on large tables.',
    },
    {
      id: 'mistake-order-by-group',
      type: 'mistake',
      title: 'ORDER BY does not group anything',
      myth: '"`SELECT region, count(*) FROM customers ORDER BY region` gives me a count per region."',
      reality:
        '`ORDER BY` only sorts. Without `GROUP BY region`, there is nothing telling SQL to produce one row per region, and the query fails or returns a single meaningless total.\n\nThe fix is `GROUP BY region` — sorting arranges rows, grouping creates them.',
    },
    {
      id: 'tf-order-filter',
      type: 'truefalse',
      statement:
        'Adding `ORDER BY amount DESC LIMIT 10` means the engine only reads ten rows.',
      answer: false,
      explanation:
        'To know which ten are largest, the engine must consider every row that survived the `WHERE` clause. `LIMIT` caps what is **returned**, not what is read — the way to read less is a better filter.',
    },
    {
      id: 'mcq-filter',
      type: 'mcq',
      question:
        'A dashboard query over a 2-billion-row table filters with `WHERE year(order_date) = 2026 AND region = \'EU\'` and is slow. Which rewrite is most likely to speed it up without changing the results?',
      options: [
        {
          id: 'a',
          text: "Replace the function with a range: `order_date >= '2026-01-01' AND order_date < '2027-01-01' AND region = 'EU'`.",
        },
        {
          id: 'b',
          text: 'Add `ORDER BY order_date` so the engine can find the rows in order.',
        },
        {
          id: 'c',
          text: 'Add `DISTINCT` to reduce the number of rows the engine handles.',
        },
        {
          id: 'd',
          text: 'Remove the `region` filter so there is only one condition to evaluate.',
        },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'A direct comparison on the column lets Delta use per-file min/max statistics and skip files that cannot match.',
        b: 'Sorting adds work at the end; it never reduces what is read.',
        c: '`DISTINCT` adds a comparison pass and would change the results.',
        d: 'Dropping a filter returns different data and reads *more*, not less.',
      },
      explanation:
        'Keep functions off the filtered column. `year(order_date) = 2026` hides the column from the file-skipping statistics; the equivalent date range does not.',
      examObjective: 'Perform sorting and filtering operations on a table.',
    },
    {
      id: 'flash-sargable',
      type: 'flashcard',
      front: 'Why is `WHERE year(order_date) = 2026` slower than the equivalent date range?',
      back: 'Wrapping the column in a function stops Delta using each file’s **min/max statistics**, so no files can be skipped and the whole table is read.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You can now cut a table down to the rows you need',
      points: [
        '`WHERE` keeps rows; combine conditions carefully — `AND` binds tighter than `OR`.',
        '`ORDER BY` runs last and only sorts; `LIMIT` caps what is returned, not what is read.',
        '`DISTINCT` costs a comparison pass — and often signals duplicate data upstream.',
        'Filter the column directly so Delta can skip files it cannot match.',
        'Select the columns you need instead of `*`.',
      ],
      closing: 'Rows narrowed. Next: turning many rows into one number. 📊',
    },
  ],
}
