import type { Lesson } from '@/types/content'

/**
 * Lesson: joins, set operations, and cross-system joins.
 * Maps to exam Section 4 (combine tables using join operations with single or
 * multiple keys, and set operations like union and union all) and (querying
 * cross-system analytics by joining a Delta table and a federated source).
 */
export const joinsAndSetsLesson: Lesson = {
  id: 'joins-and-sets',
  title: 'Joins, unions & querying across systems',
  summary:
    'Which rows survive each join type, joining on multiple keys, UNION versus UNION ALL — and joining a Delta table to a database you never ingested.',
  estimatedMinutes: 11,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'The revenue that shrank',
      body: 'You join `orders` to `customers` to report revenue per customer. The total comes out **lower than the orders table itself**. Nothing errored, no warning appeared.\n\nAn inner join silently dropped every order whose customer id was missing from `customers`. Join choice is not syntax — it decides which rows survive.',
      atWork:
        'A total that changes after adding a join is the classic symptom of the wrong join type. Compare row counts before and after.',
    },
    {
      id: 'concept-inner-left',
      type: 'concept',
      title: 'Inner keeps matches, left keeps everything on one side',
      body: 'An **inner join** returns only rows that match on both sides. A **left join** returns *every* row from the left table, filling the right-hand columns with nulls where there was no match. **Right join** is the mirror image; **full outer** keeps unmatched rows from both.\n\nThe question to ask is always the same: if a row has no partner, should it disappear or survive with nulls? A report of record — every order, whether or not the customer record exists — wants a **left** join.',
      takeaways: [
        'Inner = intersection; unmatched rows vanish silently.',
        'Left = the left table is sacred; right columns may be null.',
        'Full outer keeps the unmatched rows from both sides.',
      ],
    },
    {
      id: 'diagram-joins',
      type: 'diagram',
      title: 'Who survives?',
      spec: {
        kind: 'compare',
        left: {
          label: 'INNER JOIN',
          sublabel: 'orders ⋈ customers',
          tone: 'brand',
          items: [
            'Order with a known customer → kept',
            'Order with an unknown customer → **dropped**',
            'Customer with no orders → dropped',
          ],
        },
        right: {
          label: 'LEFT JOIN',
          sublabel: 'orders ⟕ customers',
          tone: 'good',
          items: [
            'Order with a known customer → kept',
            'Order with an unknown customer → kept, customer columns null',
            'Customer with no orders → not in the result',
          ],
        },
      },
      caption: 'Same two tables, same key — different survivors, and different totals.',
    },
    {
      id: 'concept-keys',
      type: 'concept',
      title: 'Multiple keys, and the join that multiplies rows',
      body: 'A join condition can use several columns: `ON a.user_id = b.user_id AND a.event_date = b.event_date`. Use every column the relationship actually needs — joining on too few keys is how one row quietly becomes five.\n\nThat is the multiplication trap: if the right-hand side has more than one row per key, the left row is repeated for each match, and any `SUM` afterwards is inflated. A **cross join** takes this to its extreme, pairing every row with every row — occasionally useful for generating combinations, catastrophic by accident.',
      takeaways: [
        'Join on all the columns that define the relationship.',
        'Duplicate keys on one side multiply rows — and inflate sums.',
        'Check the row count after a join; a jump means duplicated matches.',
      ],
    },
    {
      id: 'concept-sets',
      type: 'concept',
      title: 'Set operations: stacking, not matching',
      body: 'Joins combine tables **sideways** by key. Set operations stack them **vertically**, and require the same number of columns in the same order with compatible types.\n\n• **`UNION ALL`** — stack everything, keep duplicates. Fast: no comparison needed.\n• **`UNION`** — stack, then remove duplicate rows. Slower, because it must compare every row.\n• **`INTERSECT`** — rows present in both. **`EXCEPT`** — rows in the first but not the second.\n\nIf you know the inputs cannot overlap (this quarter plus last quarter), `UNION ALL` is both faster and more honest.',
      takeaways: [
        '`UNION` deduplicates; `UNION ALL` does not.',
        'Deduplication costs a full comparison pass — do not pay it by habit.',
        '`INTERSECT` and `EXCEPT` answer "in both" and "in one only".',
      ],
    },
    {
      id: 'example-joins',
      type: 'example',
      title: 'The everyday shapes',
      intro: 'A left join on two keys, and the two ways to stack results:',
      code: {
        language: 'sql',
        content:
          "SELECT o.order_id, o.amount, c.segment\nFROM main.sales.orders     AS o\nLEFT JOIN main.sales.customers AS c\n  ON  o.customer_id = c.customer_id\n  AND o.region      = c.region        -- both columns define the match\nWHERE o.order_date >= '2026-01-01';\n\n-- Known-disjoint inputs: no need to pay for deduplication\nSELECT * FROM main.sales.orders_2025\nUNION ALL\nSELECT * FROM main.sales.orders_2026;",
      },
      explanation:
        'The `LEFT JOIN` keeps every order even when no customer row matches — `segment` is simply null for those. Swapping it to `INNER` would drop them and quietly reduce the reported revenue.',
    },
    {
      id: 'concept-federation',
      type: 'concept',
      title: 'Joining data you never ingested',
      body: '**Lakehouse Federation** registers an external system — PostgreSQL, MySQL, SQL Server, Snowflake, Redshift, BigQuery — as a **foreign catalog** in Unity Catalog. Its tables then appear with normal three-part names, and you can join them to your Delta tables in one query.\n\nNothing is copied: Databricks pushes the query down to the source system, and your Unity Catalog permissions still apply. It is ideal for a small, slow-changing reference table that is not worth a pipeline — and a poor choice for large or heavily-hit data, because every query lands on the operational database.',
      takeaways: [
        'A foreign catalog exposes an external database as normal tables.',
        'Cross-system joins work in one query, with UC governance applied.',
        'Best for small reference data; ingest instead when volume is high.',
      ],
    },
    {
      id: 'mistake-union',
      type: 'mistake',
      title: 'Reaching for UNION by default',
      myth: '"I use `UNION` everywhere — it is the safe choice."',
      reality:
        '`UNION` removes duplicates, which means comparing every row against every other. On large results that is a real cost, paid on every run.\n\nWorse, it can hide a problem: if you did not *expect* duplicates and `UNION` silently removes them, you never learn that the source is duplicating rows. Use `UNION ALL` unless deduplication is genuinely required.',
    },
    {
      id: 'mcq-join',
      type: 'mcq',
      question:
        'A report must list every order from the last quarter with the customer’s segment where one is known, and must not lose orders whose customer record is missing. Which query shape is correct?',
      options: [
        {
          id: 'a',
          text: '`orders LEFT JOIN customers ON orders.customer_id = customers.customer_id`',
        },
        {
          id: 'b',
          text: '`orders INNER JOIN customers ON orders.customer_id = customers.customer_id`',
        },
        {
          id: 'c',
          text: '`orders UNION ALL customers`',
        },
        {
          id: 'd',
          text: '`orders CROSS JOIN customers`, filtered afterwards on matching ids',
        },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'A left join keeps every order and supplies nulls where no customer row matches — exactly the requirement.',
        b: 'An inner join drops orders with no matching customer, losing revenue from the report.',
        c: 'A union stacks rows vertically; it cannot attach customer attributes to an order.',
        d: 'A cross join pairs every order with every customer before filtering — enormously expensive and needlessly complex.',
      },
      explanation:
        '"Every row of this table, enriched where possible" is the definition of a **left join**. The moment a requirement says "do not lose any", an inner join is wrong.',
      examObjective:
        'Write queries to combine tables using various join operations (inner, left, right, and so on) with single or multiple keys, as well as set operations like union and union all, including the differences between the joins (inner, left, right, and so on).',
    },
    {
      id: 'tf-federation',
      type: 'truefalse',
      statement:
        'Joining a Delta table to a federated PostgreSQL table requires first copying the PostgreSQL data into Databricks.',
      answer: false,
      explanation:
        'Lakehouse Federation queries the source **in place**. The foreign catalog exposes its tables through Unity Catalog and Databricks pushes the query down — no copy, no pipeline, and your governance still applies.',
    },
    {
      id: 'flash-union',
      type: 'flashcard',
      front: 'What is the difference between `UNION` and `UNION ALL`?',
      back: '`UNION` removes duplicate rows (paying for a comparison pass); `UNION ALL` keeps everything and is faster. Prefer `UNION ALL` unless deduplication is genuinely needed.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You can now combine data deliberately',
      points: [
        'Inner keeps matches only; left keeps every left row with nulls where unmatched.',
        'Join on every column the relationship needs — too few keys multiplies rows.',
        '`UNION` deduplicates, `UNION ALL` does not; `INTERSECT`/`EXCEPT` compare sets.',
        'Lakehouse Federation joins external databases in place, governed by Unity Catalog.',
        'Always compare row counts before and after a join.',
      ],
      closing: 'Combined data is worth keeping. Next: creating tables of your own. 🧱',
    },
  ],
}
