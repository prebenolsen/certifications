import type { Lesson } from '@/types/content'

/**
 * Lesson: SQL warehouses and the Databricks Assistant.
 * Maps to exam Section 4 (explain the role a SQL Warehouse plays in query
 * execution; utilize Databricks Assistant within a Notebook or SQL Editor to
 * facilitate query writing and debugging). Covers sample question 2.
 * Research: src_material/.../research/platform-and-naming.md
 */
export const sqlWarehousesLesson: Lesson = {
  id: 'sql-warehouses',
  title: 'Where your SQL actually runs',
  summary:
    'What a SQL warehouse is, how size and concurrency differ, why serverless starts in seconds — and the Assistant commands that explain and fix a query.',
  estimatedMinutes: 10,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'The dropdown you have to fill in',
      body: 'You open the SQL editor, paste a query, hit run — and nothing happens, because no **SQL warehouse** is selected. Meanwhile finance is asking why the analytics bill doubled last month.\n\nBoth are the same topic. The warehouse is the compute that answers your queries, and it is the thing you are billed for.',
      atWork:
        'Analysts rarely choose a warehouse deliberately. The ones who do are the reason a team’s costs stay flat.',
    },
    {
      id: 'concept-what',
      type: 'concept',
      title: 'A SQL warehouse is compute, not storage',
      body: 'The name misleads people: a **SQL warehouse is not a data warehouse**. It stores nothing. It is a pool of compute that receives your SQL, plans it, reads the table files, and returns rows.\n\nYour tables live in cloud storage and are governed by Unity Catalog no matter which warehouse you use. Two warehouses querying the same table see exactly the same data — they differ only in speed, concurrency, and cost.',
      takeaways: [
        'The warehouse executes queries; the data lives elsewhere.',
        'Switching warehouse never changes results — only speed and cost.',
        'No warehouse selected = no query runs.',
      ],
    },
    {
      id: 'analogy-checkouts',
      type: 'analogy',
      title: 'Tills at a supermarket',
      body: 'A supermarket has one stock room and many checkouts. Opening a bigger, faster till gets one large trolley through quicker. Opening *more* tills gets a queue of shoppers through quicker. They fix different problems.\n\nA warehouse **size** is how fast one till scans; **scaling** is how many tills are open.',
      mapping: [
        { from: 'The stock room', to: 'Your tables in cloud storage' },
        { from: 'A bigger, faster till', to: 'A larger warehouse size — one heavy query finishes sooner' },
        { from: 'More tills open', to: 'Scaling out — more users served at once' },
      ],
    },
    {
      id: 'concept-size-scale',
      type: 'concept',
      title: 'Size for heavy queries, scaling for many users',
      body: '**Size** (Small, Medium, Large…) sets how much compute one query can use. A single enormous aggregation finishes faster on a bigger warehouse.\n\n**Scaling** sets how many clusters the warehouse may add when queries queue. Twenty analysts running modest queries at 9am need *more clusters*, not a bigger one.\n\nDiagnose before spending: a slow single query is a size or query problem; a queue of waiting queries is a concurrency problem.',
      takeaways: [
        'One heavy query slow → larger size.',
        'Many users queuing → scale out (more clusters).',
        'Upsizing to fix a queue wastes money and fixes nothing.',
      ],
    },
    {
      id: 'concept-serverless-autostop',
      type: 'concept',
      title: 'Serverless, and the auto-stop that saves the bill',
      body: '**Serverless** warehouses run on capacity Databricks keeps warm, so they start in seconds instead of minutes — the difference between an analyst waiting and an analyst working. **Pro** and **classic** warehouses run in your own cloud account and take longer to start.\n\nEvery warehouse has an **auto-stop** setting. A warehouse left running overnight bills for hours in which nobody ran a query, which is the single most common source of surprise analytics cost.',
      takeaways: [
        'Serverless = near-instant start, managed by Databricks.',
        'Auto-stop shuts an idle warehouse down — leave it enabled.',
        'Idle warehouses, not big queries, cause most surprise bills.',
      ],
    },
    {
      id: 'concept-assistant',
      type: 'concept',
      title: 'The Databricks Assistant',
      body: 'The **Databricks Assistant** (now also branded **Genie Code**) sits inside the SQL editor and notebooks. It can write a query from a description, explain one you inherited, and diagnose an error — and it knows *your* catalog, so it suggests real table and column names.\n\nIt is driven with slash commands: **`/explain`** walks through what a query does and where it goes wrong, **`/fix`** proposes a correction, **`/doc`** adds comments, and **`/optimize`** suggests a faster form. `/fix` and `/doc` show a diff you accept or reject.',
      takeaways: [
        '`/explain` — step-by-step explanation of a query and its problems.',
        '`/fix`, `/doc`, `/optimize` — correct, document, speed up.',
        'It is aware of your Unity Catalog tables, not generic SQL.',
      ],
    },
    {
      id: 'mcq-assistant',
      type: 'mcq',
      question:
        'An analyst cannot work out why a complex inherited SQL query returns the wrong results. Which Databricks Assistant command gives a step-by-step explanation of the query and its potential issues?',
      options: [
        { id: 'a', text: '/help' },
        { id: 'b', text: '/generate' },
        { id: 'c', text: '/explain' },
        { id: 'd', text: '/optimize' },
      ],
      correct: ['c'],
      optionFeedback: {
        a: '/help covers using the Assistant itself, not the query in front of you.',
        b: 'Generating writes new SQL from a description; here a query already exists and needs interpreting.',
        c: '/explain walks through what the query does step by step and flags where it goes wrong.',
        d: '/optimize targets performance — it assumes the results are already correct.',
      },
      explanation:
        'Match the verb to the need: **understand** an existing query → `/explain`. Write one → generate. Make a correct query faster → `/optimize`.',
      examObjective:
        'Utilize Databricks Assistant within a Notebook or SQL Editor to facilitate query writing and debugging.',
    },
    {
      id: 'mistake-warehouse-storage',
      type: 'mistake',
      title: '"My tables live in the warehouse"',
      myth: '"If I stop the SQL warehouse, do I lose my tables?"',
      reality:
        'No. Tables are files in cloud storage registered in Unity Catalog; the warehouse only reads them. Stopping it costs you nothing but startup time on the next query.\n\nThe same logic answers a second question: a colleague running the identical query on a different warehouse gets the identical answer — different compute, same governed data.',
    },
    {
      id: 'tf-autostop',
      type: 'truefalse',
      statement:
        'A SQL warehouse only costs money while it is actually executing queries.',
      answer: false,
      explanation:
        'A running warehouse bills for the time it is **up**, not just the seconds it is busy. That is what **auto-stop** exists for — it terminates the warehouse after an idle period so an empty afternoon does not appear on the invoice.',
    },
    {
      id: 'flash-size-vs-scale',
      type: 'flashcard',
      front: 'One query is slow versus twenty users are queuing — which warehouse setting fixes each?',
      back: 'Slow single query → increase the **size**. Users queuing → **scale out** to more clusters. Sizing up to fix a queue costs more and does not help.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You now know where your SQL runs',
      points: [
        'A SQL warehouse is **compute**; your data lives in cloud storage under Unity Catalog.',
        'Size makes one query faster; scaling serves more users at once.',
        'Serverless starts in seconds; auto-stop prevents idle billing.',
        'The Assistant knows your catalog: `/explain`, `/fix`, `/doc`, `/optimize`.',
        'Stopping a warehouse never affects your tables.',
      ],
      closing: 'Compute sorted. Next: the two clauses every query starts with. 🔍',
    },
  ],
}
