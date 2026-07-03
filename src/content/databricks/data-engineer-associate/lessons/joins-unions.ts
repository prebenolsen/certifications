import type { Lesson } from '@/types/content'

/**
 * Lesson: combining DataFrames — joins and unions.
 * Maps to exam Section 3 (combine DataFrames: inner, left, broadcast join,
 * multiple keys, cross join, union and union all).
 */
export const joinsUnionsLesson: Lesson = {
  id: 'joins-unions',
  title: 'Joins & unions: combining DataFrames',
  summary:
    'Inner vs left vs cross joins, multi-key joins, why broadcast joins are fast, and the union() trap that silently corrupts data.',
  estimatedMinutes: 10,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'The vanishing customers',
      body: 'You join `orders` to `customers` to build a revenue-per-customer report. The total revenue in the report is **lower than in the orders table**. Nothing errored.\n\nThe cause: an **inner join** silently dropped every order whose customer id was missing from the customers table. Join choice is not syntax — it decides *which rows survive*.',
      atWork:
        'Totals that shrink after a join are the classic symptom of the wrong join type.',
    },
    {
      id: 'concept-inner-left',
      type: 'concept',
      title: 'Inner keeps matches; left keeps everything (on one side)',
      body: 'An **inner join** keeps only rows that match on **both** sides. A **left join** keeps *every* row of the left DataFrame, filling the right side with nulls where no match exists.\n\nThe question to ask: “if a row has no partner, should it disappear or survive with nulls?” Report-of-record → usually **left**. Strict intersection → **inner**. (`right` and `full` are the same idea mirrored/combined.)',
      takeaways: [
        'inner = intersection; unmatched rows vanish.',
        'left = left side is sacred; right side may be null.',
        'Wrong choice fails silently — check row counts before/after.',
      ],
    },
    {
      id: 'diagram-joins',
      type: 'diagram',
      title: 'Who survives the join?',
      spec: {
        kind: 'compare',
        left: {
          label: 'INNER join',
          sublabel: 'orders ⋈ customers',
          tone: 'brand',
          items: [
            'Order with known customer → kept',
            'Order with unknown customer → **dropped**',
            'Customer with no orders → dropped',
          ],
        },
        right: {
          label: 'LEFT join',
          sublabel: 'orders ⟕ customers',
          tone: 'good',
          items: [
            'Order with known customer → kept',
            'Order with unknown customer → kept, customer columns null',
            'Customer with no orders → not in result',
          ],
        },
      },
      caption: 'Same tables, same key — different survivors.',
    },
    {
      id: 'example-joins',
      type: 'example',
      title: 'Joins in PySpark, including multiple keys',
      intro: 'The join type is just an argument — and keys can be compound:',
      code: {
        language: 'python',
        content:
          'orders.join(customers, on="customer_id", how="inner")\norders.join(customers, on="customer_id", how="left")\n\n# Multiple keys: match on BOTH columns\nevents.join(sessions, on=["user_id", "session_date"], how="inner")\n\n# Cross join: every row x every row (no key at all)\nsizes.crossJoin(colors)      # 4 sizes x 5 colors = 20 rows',
      },
      explanation:
        'A **cross join** produces the full cartesian product — deliberately useful for generating combinations, catastrophic when it happens *by accident* (a join condition that matches everything).',
    },
    {
      id: 'concept-broadcast',
      type: 'concept',
      title: 'Broadcast joins: skip the shuffle',
      body: 'Normally, joining two big DataFrames forces a **shuffle**: rows with the same key must travel across the network to meet on the same executor. That is expensive.\n\nIf one side is **small** (a country-code lookup, a product dimension), Spark can instead **broadcast** a full copy of it to every executor. Now the big table never moves — each executor joins locally. Spark does this automatically below a size threshold, or you can force it with `broadcast()`.',
      takeaways: [
        'Shuffles move big data across the network — the costliest step in Spark.',
        'Broadcast = ship the small table everywhere; big table stays put.',
        'Force it: `df.join(F.broadcast(small_df), "key")`.',
      ],
    },
    {
      id: 'concept-union',
      type: 'concept',
      title: 'Unions: stacking, not matching',
      body: 'A **union** stacks two DataFrames with the same schema on top of each other — no keys involved. Think “this quarter’s orders + last quarter’s orders.”\n\nPySpark gives you `union()` (positional columns) and `unionByName()` (matches columns **by name** — safer when column order might differ).',
      takeaways: [
        'Join = combine sideways by key; union = stack rows.',
        'Prefer `unionByName()` — column order stops mattering.',
      ],
    },
    {
      id: 'mistake-union',
      type: 'mistake',
      title: 'The union() dedup trap',
      myth: '“SQL’s UNION removes duplicates, so DataFrame union() does too.”',
      reality:
        'DataFrame **`union()` keeps duplicates** — it behaves like SQL’s `UNION ALL`, not `UNION`. If you need deduplication, call `.distinct()` (or `dropDuplicates()`) after the union. Teams migrating SQL logic to PySpark hit this constantly.',
    },
    {
      id: 'mcq-broadcast',
      type: 'mcq',
      question:
        'A join between a 900 GB events table and a 30 MB country-lookup table is slow, and the Spark UI shows heavy shuffle for the join stage. What is the best fix?',
      options: [
        { id: 'a', text: 'Broadcast the 30 MB lookup table so the events table is joined locally on each executor without shuffling.' },
        { id: 'b', text: 'Broadcast the 900 GB events table to every executor.' },
        { id: 'c', text: 'Replace the join with a crossJoin and filter afterwards.' },
        { id: 'd', text: 'Split the events table into 100 unions of smaller joins.' },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'Classic broadcast-join case: tiny dimension × huge fact. The big side never moves.',
        b: 'Broadcasting means copying to every executor — copying 900 GB everywhere is the opposite of a fix.',
        c: 'A cross join multiplies the data massively before filtering — far worse.',
        d: 'Manual splitting adds complexity without removing the shuffle.',
      },
      explanation:
        'When one join side fits in memory, broadcasting it eliminates the shuffle of the big side — usually the single biggest join speedup available.',
      examObjective:
        'Combine DataFrames with operations such as inner join, left join, broadcast join, multiple keys, cross join, union, and union all.',
    },
    {
      id: 'tf-left',
      type: 'truefalse',
      statement:
        'After a left join of orders (1M rows) to customers, the result can have fewer than 1M rows.',
      answer: false,
      explanation:
        'A left join never drops left-side rows — every order survives (with null customer columns if unmatched). It can have **more** rows though, if a customer id matches multiple customer rows — another reason to check counts after joining.',
    },
    {
      id: 'flash-union',
      type: 'flashcard',
      front: 'DataFrame `union()` behaves like which SQL operator — UNION or UNION ALL?',
      back: '**UNION ALL** — duplicates are kept. Add `.distinct()` if you want SQL-UNION behavior.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You can now combine data deliberately',
      points: [
        'inner = intersection; left = keep all left rows; cross = all combinations.',
        'Multi-key joins: pass a list of columns.',
        'Broadcast the small side to eliminate the shuffle.',
        'union() = UNION ALL semantics; unionByName() matches by column name.',
      ],
      closing: 'Tables combined. Now let’s reshape what’s inside them. 🪚',
    },
  ],
}
