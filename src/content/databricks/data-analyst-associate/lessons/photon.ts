import type { Lesson } from '@/types/content'

/**
 * Lesson: Photon.
 * Maps to exam Section 5 (understand the features, benefits, and supported
 * workloads of Photon).
 * Research: src_material/.../research/platform-and-naming.md
 */
export const photonLesson: Lesson = {
  id: 'photon',
  title: 'Photon: the engine underneath',
  summary:
    'What Photon is, the workloads it speeds up, the ones it barely touches, and where it is already switched on for you.',
  estimatedMinutes: 8,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'The same query, half the time',
      body: 'A colleague runs your aggregation on their warehouse and it finishes in half the time. Same table, same SQL, same data.\n\nTheir warehouse is running **Photon**. Understanding what it is — and which queries it actually helps — is a named exam objective and a cheap performance win.',
      atWork:
        'Photon is usually already on. The valuable knowledge is knowing when it will *not* help, so you look elsewhere.',
    },
    {
      id: 'concept-what',
      type: 'concept',
      title: 'What Photon is',
      body: '**Photon is Databricks’ native query engine, written in C++**, that executes your SQL and DataFrame work in place of the standard engine. It processes data in **columnar batches** — many values at a time — rather than row by row, which is far friendlier to modern CPUs.\n\nIt is fully compatible with the APIs of **Apache Spark** — the open-source distributed processing engine Databricks is built on. You do not rewrite anything: the same SQL runs, and the results are identical. Only the speed and the cost change.',
      takeaways: [
        'A vectorized C++ engine that replaces the standard execution engine.',
        'Compatible with Spark APIs — no query changes, identical results.',
        'Processes columnar batches instead of one row at a time.',
      ],
    },
    {
      id: 'analogy-conveyor',
      type: 'analogy',
      title: 'Trays instead of single items',
      body: 'Imagine packing an order by walking to the shelf for each individual item, then walking back. Now imagine collecting a whole tray at once and processing it in a single pass.\n\nThe work is the same; the number of trips collapses. That is vectorized execution: fewer, bigger operations instead of one per row.',
      mapping: [
        { from: 'One trip per item', to: 'Row-at-a-time execution' },
        { from: 'A tray processed in one pass', to: 'A columnar batch in Photon' },
        { from: 'Fewer trips, same order', to: 'Same results, less CPU time' },
      ],
    },
    {
      id: 'concept-workloads',
      type: 'concept',
      title: 'What it speeds up',
      body: 'Photon pays off on work that is heavy on CPU and data volume:\n\n• **Joins and aggregations** — hash joins, shuffles, `GROUP BY` over large tables.\n• **Scans and filters** over big Delta tables.\n• **Writes**, particularly Parquet/Delta writes.\n• **SQL and BI workloads** generally: dashboards, ad hoc analysis, ETL written in SQL or DataFrames.\n\nThe bigger and more complex the query, the larger the gain.',
      takeaways: [
        'Best on large scans, joins, aggregations, and writes.',
        'Covers SQL and DataFrame work alike — including ETL.',
        'Gains grow with data volume and query complexity.',
      ],
    },
    {
      id: 'concept-limits',
      type: 'concept',
      title: 'Where it does not help',
      body: 'A query that already finishes **in under about two seconds** sees no meaningful improvement: its time is dominated by planning and scheduling, not execution. Photon cannot speed up work that is not the bottleneck.\n\nThe same applies to a query that is slow because it reads far more data than it needs. Photon will read that data faster — but the real fix is a better filter or clustering, not a faster engine.',
      takeaways: [
        'Sub-two-second queries: no meaningful gain.',
        'It speeds up execution, not planning or scheduling.',
        'A badly-filtered query stays badly filtered — just quicker.',
      ],
    },
    {
      id: 'concept-where-on',
      type: 'concept',
      title: 'Where it is already enabled',
      body: 'Photon is **on by default** for SQL warehouses and serverless compute — so as an analyst you are almost certainly using it already. On classic all-purpose and job compute it is an option someone enables.\n\nOne cost note worth knowing: Photon-enabled compute consumes **DBUs at a different rate**. It usually still wins overall, because finishing sooner means fewer seconds billed — but "always cheaper" is not a promise you should make.',
      takeaways: [
        'Default on SQL warehouses and serverless compute.',
        'A checkbox on classic compute.',
        'Different DBU rate: faster, not automatically cheaper in every case.',
      ],
    },
    {
      id: 'mistake-photon-fixes',
      type: 'mistake',
      title: '"Turn on Photon" as the answer to slow',
      myth: '"The dashboard query is slow — enable Photon and it will be fine."',
      reality:
        'Photon accelerates execution. If the query is slow because it scans a whole table for a 0.5% filter, or because it waits in a queue behind twenty other users, execution was never the bottleneck.\n\nDiagnose first — the query profile and query history tell you whether you are looking at scan volume, queueing, or genuine compute. Photon only helps the last one.',
    },
    {
      id: 'mcq-photon',
      type: 'mcq',
      question:
        'Which statement about Photon is correct?',
      options: [
        {
          id: 'a',
          text: 'It is a vectorized C++ engine, compatible with Spark APIs, that speeds up large scans, joins and aggregations — and is enabled by default on SQL warehouses.',
        },
        {
          id: 'b',
          text: 'It is a rewrite of your SQL into a proprietary dialect, so queries must be adapted before they run on it.',
        },
        {
          id: 'c',
          text: 'It mainly accelerates very short queries, where its lower startup overhead matters most.',
        },
        {
          id: 'd',
          text: 'It is a storage format that replaces Delta Lake for analytical tables.',
        },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'A drop-in vectorized engine: same SQL, same results, faster execution on heavy work — and already on for SQL warehouses.',
        b: 'No query changes are needed; Photon is API-compatible with Spark.',
        c: 'The opposite: queries under about two seconds see little benefit because planning dominates.',
        d: 'Photon is an execution engine. Delta Lake remains the storage format.',
      },
      explanation:
        'Photon is **execution**, not storage and not a dialect: vectorized C++, Spark-compatible, biggest wins on large joins, aggregations and scans, on by default for SQL warehouses.',
      examObjective:
        'Understand the Features, Benefits, and Supported Workloads of Photon.',
    },
    {
      id: 'tf-photon-results',
      type: 'truefalse',
      statement:
        'Running a query with Photon can return slightly different results from running it without Photon.',
      answer: false,
      explanation:
        'Photon is API-compatible: same query, same semantics, same results. It changes how the work is executed — vectorized, in C++ — not what the answer is.',
    },
    {
      id: 'flash-photon',
      type: 'flashcard',
      front: 'Which queries gain least from Photon, and why?',
      back: 'Queries that already run in **under ~2 seconds** — their time goes on planning and scheduling rather than execution, which is the part Photon accelerates.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You now know what Photon does',
      points: [
        'A vectorized **C++ engine**, compatible with the Spark APIs — no query changes.',
        'Biggest gains on large scans, joins, aggregations, and writes.',
        'Little benefit for very short queries; it does not speed up planning.',
        'On by default for SQL warehouses and serverless; optional on classic compute.',
        'It consumes DBUs at a different rate — faster, not automatically cheaper.',
      ],
      closing:
        'Photon cannot fix a query that reads too much. Next: finding out what your query actually did. 🔬',
    },
  ],
}
