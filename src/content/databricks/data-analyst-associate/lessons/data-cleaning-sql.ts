import type { Lesson } from '@/types/content'

/**
 * Lesson: cleaning Unity Catalog tables in SQL.
 * Maps to exam Section 2 (perform data cleaning on Unity Catalog tables in SQL,
 * including removing invalid data or handling missing values).
 */
export const dataCleaningSqlLesson: Lesson = {
  id: 'data-cleaning-sql',
  title: 'Cleaning data in SQL',
  summary:
    'Nulls that quietly change your averages, invalid rows, duplicates, and the safest place to put the fix — with the SQL an analyst actually uses.',
  estimatedMinutes: 10,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'The average that was quietly wrong',
      body: 'You report average order value: **€84**. Finance says it is €61. Neither of you made an arithmetic error.\n\nA third of the orders have `NULL` in `amount`, and `AVG()` **skips nulls** — so you averaged two thirds of the data without noticing. Cleaning is not tidiness. It is the difference between a number and the *right* number.',
      atWork:
        'Almost every "our numbers disagree" argument is really a disagreement about how missing values were handled.',
    },
    {
      id: 'concept-nulls-behave',
      type: 'concept',
      title: 'How SQL treats missing values',
      body: '`NULL` means *unknown*, and it spreads: any arithmetic involving it returns `NULL`, and comparisons return unknown rather than true or false. Two consequences bite constantly:\n\n• **`WHERE amount = NULL` never matches anything.** You must write `IS NULL` / `IS NOT NULL`.\n• **Aggregates ignore nulls.** `AVG(amount)` divides by the count of *non-null* values, and `COUNT(amount)` is smaller than `COUNT(*)` whenever nulls exist.',
      takeaways: [
        'Compare with `IS NULL` / `IS NOT NULL`, never `= NULL`.',
        '`COUNT(*)` counts rows; `COUNT(col)` counts non-null values.',
        '`AVG` and `SUM` silently skip nulls — check before trusting either.',
      ],
    },
    {
      id: 'concept-handling',
      type: 'concept',
      title: 'Three ways to handle a missing value',
      body: 'There is no default right answer — you choose per column:\n\n• **Drop the row** — when the missing field makes the row useless (an order with no `order_id`).\n• **Substitute a value** — `COALESCE(phone, \'unknown\')` for a display field, or `COALESCE(discount, 0)` where zero is genuinely the meaning.\n• **Leave it null** — when "we do not know" is the honest answer, and you would rather the average reflect only the known values.\n\nSubstituting zero into a *measure* is the dangerous one: it drags averages down and looks like real data.',
      takeaways: [
        '`COALESCE(a, b)` returns the first non-null argument.',
        'Defaulting a measure to 0 changes your averages — usually wrong.',
        'Document the choice; it is the thing two reports will disagree about.',
      ],
    },
    {
      id: 'example-cleaning',
      type: 'example',
      title: 'The cleanup toolkit',
      intro: 'Four moves that cover most of the work:',
      code: {
        language: 'sql',
        content:
          "SELECT\n  order_id,\n  COALESCE(channel, 'unknown')        AS channel,      -- fill a label\n  NULLIF(discount_code, '')           AS discount_code, -- '' really means null\n  try_cast(amount AS DECIMAL(10,2))   AS amount,        -- bad text -> NULL, no error\n  CASE WHEN country IN ('NO','Norway') THEN 'NO'\n       ELSE country END               AS country        -- standardise codes\nFROM main.bronze.orders\nWHERE order_id IS NOT NULL          -- unusable without a key\n  AND amount   IS NOT NULL          -- keep the average honest\n  AND order_ts >= '2024-01-01';     -- drop known-bad historical junk",
      },
      explanation:
        '`NULLIF(x, \'\')` turns empty strings into real nulls, so they stop masquerading as values. `try_cast` returns `NULL` instead of failing the whole query on one unparseable row — the difference between a report that runs and one that errors at 07:00.',
    },
    {
      id: 'concept-duplicates',
      type: 'concept',
      title: 'Duplicates: decide what "the same" means',
      body: '`SELECT DISTINCT` removes rows identical in **every** column. That is rarely what you want — near-duplicates differ in a timestamp or a load id.\n\nThe usual requirement is *one row per business key*: the latest record per `order_id`. `GROUP BY` collapses the row and loses columns, so the tool is a **window function** — number the rows per key, newest first, then keep number 1.',
      takeaways: [
        '`DISTINCT` = fully identical rows only.',
        'One row per key = `ROW_NUMBER() OVER (PARTITION BY key ORDER BY ts DESC)`, filtered to 1.',
        'Decide deliberately which duplicate survives.',
      ],
    },
    {
      id: 'example-dedup',
      type: 'example',
      title: 'One row per order, newest wins',
      intro: 'Rank within each key, then keep the top one:',
      code: {
        language: 'sql',
        content:
          "SELECT * FROM (\n  SELECT *,\n    ROW_NUMBER() OVER (\n      PARTITION BY order_id\n      ORDER BY updated_at DESC\n    ) AS rn\n  FROM main.bronze.orders\n)\nWHERE rn = 1;",
      },
      explanation:
        '`PARTITION BY order_id` starts the numbering again for each order; `ORDER BY updated_at DESC` puts the newest first; `rn = 1` keeps it — with every column intact, which a `GROUP BY` could not do.',
    },
    {
      id: 'concept-where-to-put-it',
      type: 'concept',
      title: 'Where the cleaning should live',
      body: 'Do **not** clean by deleting rows from the source table. That destroys the raw record, breaks anyone else reading it, and cannot be undone by re-running your query.\n\nWrite the cleaned result somewhere new instead:\n\n• A **view** — the definition everyone shares, always current, no storage.\n• A **new table** via `CREATE OR REPLACE TABLE … AS SELECT` — when you want stored, fast-to-read results.\n\nEither way the source stays intact and your logic is one object other people can reuse.',
      takeaways: [
        'Never fix data by deleting from the source table.',
        'A cleaning **view** publishes the rules once, for everyone.',
        '`CREATE OR REPLACE TABLE … AS SELECT` when you need stored results.',
      ],
    },
    {
      id: 'diagram-clean',
      type: 'diagram',
      title: 'Two places to put the fix',
      spec: {
        kind: 'compare',
        left: {
          label: 'Cleaning view',
          sublabel: 'rules, stored once',
          tone: 'good',
          items: [
            'Always reflects the current source',
            'No storage, no refresh to schedule',
            'Recomputed on every read',
          ],
        },
        right: {
          label: 'Cleaned table (CTAS)',
          sublabel: 'results, stored once',
          tone: 'brand',
          items: [
            'Fast repeated reads',
            'Frozen until you rebuild it',
            'Costs storage; needs a refresh plan',
          ],
        },
      },
      caption:
        'Same SQL either way. Choose by how often it is read and how fresh it must be.',
    },
    {
      id: 'mistake-equals-null',
      type: 'mistake',
      title: 'The filter that silently matches nothing',
      myth: '"`WHERE phone = NULL` finds every customer with a missing phone number."',
      reality:
        'It matches **zero rows, always** — comparing anything to `NULL` yields unknown, not true. The correct filter is `WHERE phone IS NULL`.\n\nThe cruelty is that it does not error. The query succeeds, returns an empty result, and you conclude there is no missing data.',
    },
    {
      id: 'mcq-cleaning',
      type: 'mcq',
      question:
        'A table has some rows with a null `order_id`, some `amount` values stored as unparseable text, and occasional duplicate rows per `order_id`. Which approach produces a clean, reusable dataset without harming the source?',
      options: [
        {
          id: 'a',
          text: 'Build a view: filter out null `order_id`, use `try_cast` on `amount`, and keep one row per `order_id` with `ROW_NUMBER()`.',
        },
        {
          id: 'b',
          text: 'Run DELETE statements against the source table to remove the bad rows permanently.',
        },
        {
          id: 'c',
          text: 'Use `SELECT DISTINCT` and `COALESCE(order_id, 0)` so no rows are lost.',
        },
        {
          id: 'd',
          text: 'Filter with `WHERE order_id != NULL` and cast `amount` with `CAST`.',
        },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'The rules live in one reusable object, the source stays intact, and `try_cast` nulls bad values instead of failing the query.',
        b: 'Deleting from the source destroys the raw record for everyone else and cannot be re-run.',
        c: 'Inventing `order_id = 0` corrupts joins downstream, and `DISTINCT` misses duplicates that differ in a timestamp.',
        d: '`!= NULL` matches nothing, and plain `CAST` fails the whole query on the first unparseable value.',
      },
      explanation:
        'Clean **into** a new object, never in place: filter unusable rows, `try_cast` risky conversions, deduplicate on the business key with a window function, and publish it as a view everyone can reuse.',
      examObjective:
        'Perform data cleaning on Unity Catalog Tables in SQL, including removing invalid data or handling missing values.',
    },
    {
      id: 'flash-count',
      type: 'flashcard',
      front: 'What is the difference between `COUNT(*)` and `COUNT(amount)`?',
      back: '`COUNT(*)` counts **rows**. `COUNT(amount)` counts **non-null values** of that column — so a gap between them is exactly your number of missing values.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You can now clean a table honestly',
      points: [
        '`NULL` is unknown: use `IS NULL`, and remember aggregates skip nulls.',
        'Per column, choose: drop the row, substitute a value, or keep the null.',
        '`COALESCE`, `NULLIF`, `try_cast` and `CASE` are the everyday tools.',
        'Deduplicate on the business key with `ROW_NUMBER()`, not `DISTINCT`.',
        'Publish the cleaning as a view or a CTAS table — never delete from the source.',
      ],
      closing:
        'Next module: how data gets into Databricks in the first place. 📥',
    },
  ],
}
