import type { Lesson } from '@/types/content'

/**
 * Lesson: Lakeflow Pipelines for the Associate.
 * Touches exam Section 3 (gold-layer objects: materialized views, streaming
 * tables; data-quality checks), Section 4 (pipeline tasks) and Section 5
 * (deploying pipelines via bundles).
 *
 * The exam guide never gives pipelines their own section — it references them
 * from three others, which is how the gap went unnoticed until the glossary
 * report flagged `pipeline expectation` as used-and-never-introduced.
 * Research + verified syntax: src_material/.../research/lakeflow.md
 */
export const lakeflowPipelinesLesson: Lesson = {
  id: 'lakeflow-pipelines',
  title: 'Lakeflow Pipelines: describe the table, not the steps',
  summary:
    'Declaring what each table should contain and letting the engine work out the order, the incremental reads, the retries, and the quality checks.',
  estimatedMinutes: 11,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'The table nobody noticed had gone stale',
      body: 'You add a new silver table between bronze and gold. It works. Two weeks later someone spots that the gold dashboard has been a day behind ever since.\n\nThe cause: the new table was inserted into the job, but the *task order* was never updated, so gold kept running **before** the new silver step. Nothing failed. Nothing alerted. The numbers were just quietly wrong.',
      atWork:
        'Hand-maintained ordering is where pipelines rot: every new table is another chance to get the sequence subtly wrong, and wrong-but-succeeding is the worst failure mode there is.',
    },
    {
      id: 'analogy-gps',
      type: 'analogy',
      title: 'Turn-by-turn notes vs. a destination',
      body: 'Writing a pipeline as ordered steps is like driving with turn-by-turn notes you wrote yourself: fine until a road closes, and useless the moment the route changes — you have to rewrite the whole list.\n\nA **satnav** works the other way round. You give it the **destination**. It works out the route, and when something changes it re-plans without you touching anything.\n\nLakeflow Pipelines is the satnav. You declare *what each table should contain*; the engine derives the route.',
      mapping: [
        { from: 'Your handwritten turn list', to: 'Notebooks wired together in a fixed order' },
        { from: 'Typing in the destination', to: 'Declaring what each table should contain' },
        { from: 'The satnav planning the route', to: 'The engine deriving the dependency graph' },
        { from: 'Re-planning around a closed road', to: 'Retrying and reprocessing only what changed' },
      ],
    },
    {
      id: 'concept-declarative',
      type: 'concept',
      title: 'Declarative: the destination, not the directions',
      body: 'In everything you have written so far, **you** control the order: read this, transform that, write there, then the next notebook.\n\nIn a pipeline you instead write, for each table, a query that says **what should be in it**. You never say "run this after that". The engine reads your queries, sees that `silver_orders` selects from `bronze_orders`, and derives the order itself.',
      takeaways: [
        'You describe the **result**; the engine derives the **procedure**.',
        'Dependencies come from your queries — nothing to keep in sync by hand.',
        'Add a table in the middle and the graph re-derives itself.',
      ],
    },
    {
      id: 'concept-pipeline',
      type: 'concept',
      title: 'What "a pipeline" actually is',
      body: 'A **pipeline** is the unit you develop, deploy, and run — the **container** for the datasets you define inside it: streaming tables, materialized views, views, and sinks.\n\nSo "a pipeline" is not one script. It is one *deployable thing* holding a set of table definitions that belong together, plus the settings for how they run.',
      takeaways: [
        'A pipeline **contains** the datasets you declare in it.',
        'It is what you deploy, schedule, and monitor as a unit.',
        'Its output tables are governed by Unity Catalog like any others.',
      ],
    },
    {
      id: 'diagram-pipeline',
      type: 'diagram',
      title: 'One pipeline, several declared tables',
      spec: {
        kind: 'flow',
        steps: [
          { label: 'Cloud files', sublabel: 'new orders land continuously', tone: 'neutral' },
          { label: 'orders_raw', sublabel: 'streaming table · append-only', tone: 'accent' },
          { label: 'orders_valid', sublabel: 'streaming table · expectations applied', tone: 'accent' },
          { label: 'daily_revenue', sublabel: 'materialized view · recomputed', tone: 'good' },
        ],
        arrows: ['ingest', 'clean', 'aggregate'],
      },
      caption:
        'You write three `CREATE` statements, in **any order**. The engine sees that each selects from the one before it and builds this graph itself. All three live in **one pipeline**.',
    },
    {
      id: 'concept-streaming-table',
      type: 'concept',
      title: 'Streaming table: for data that only ever arrives',
      body: 'You met streaming tables as gold objects. Inside a pipeline they are what you declare for an **append-only** source: each incoming record is processed **exactly once** and never revisited — event streams, log files, new files landing in cloud storage.\n\nBecause each record is handled once, work stays proportional to *what arrived*, not to the size of the table.',
      takeaways: [
        'Append-only sources; **exactly-once** processing per record.',
        'Cost scales with new data, not total data.',
        '"Streaming" is about the processing model — it does not have to run continuously.',
      ],
    },
    {
      id: 'concept-materialized-view',
      type: 'concept',
      title: 'Materialized view: for results that must stay correct',
      body: 'The counterpart for data that does not simply append: a table defined by a query, **recomputed as needed** to reflect the current state of its sources.\n\nUse it when upstream rows can **change** — corrections, late-arriving updates, deletes — or when the query aggregates or joins, which appending cannot express. The engine keeps it consistent; you write no refresh logic.',
      takeaways: [
        'Handles **updates and deletes** upstream; a streaming table cannot.',
        'Aggregations and joins usually want a materialized view.',
        'You declare the query once; refreshing is the engine’s problem.',
      ],
    },
    {
      id: 'mistake-choosing',
      type: 'mistake',
      title: 'How to choose between them',
      myth: '"Streaming tables are for real-time dashboards; materialized views are for batch reports. Pick based on how fresh the data needs to be."',
      reality:
        'Freshness is not the deciding question — **what the source does** is.\n\n• Does the source only ever **append**? → **streaming table**. Cheap, exactly-once, work proportional to new rows.\n• Can existing rows **change or disappear**, or does the query **aggregate**? → **materialized view**, because appending cannot express "that number went down".\n\nBoth can be scheduled hourly, and both can run continuously. Freshness is a setting; the source’s behaviour is the constraint.',
    },
    {
      id: 'example-sql',
      type: 'example',
      title: 'What it looks like in SQL',
      intro:
        'A streaming table that reads new files as they land and refuses rows without a valid date:',
      code: {
        language: 'sql',
        content: `CREATE OR REFRESH STREAMING TABLE orders_valid(
  CONSTRAINT valid_date
  EXPECT (order_datetime IS NOT NULL AND length(order_datetime) > 0)
  ON VIOLATION DROP ROW
) AS
SELECT * FROM STREAM read_files("/databricks-datasets/retail-org/sales_orders");

CREATE OR REFRESH MATERIALIZED VIEW daily_revenue AS
SELECT date(order_datetime) AS day, sum(amount) AS revenue
FROM orders_valid
GROUP BY 1;`,
      },
      explanation:
        'Note what is **absent**: no loop, no checkpoint handling, no "run this after that", no refresh schedule in the code. `daily_revenue` reads from `orders_valid`, and that single fact is the entire dependency declaration.',
    },
    {
      id: 'concept-expectations',
      type: 'concept',
      title: 'Expectations: quality rules that report, not just block',
      body: 'An **expectation** is a data-quality rule attached to a dataset: a name, a SQL boolean condition, and what to do when a row fails it.\n\n`CONSTRAINT valid_date EXPECT (…) ON VIOLATION DROP ROW`\n\nThe value is not only enforcement — it is **measurement**. Every run records how many rows violated each expectation, so "our data quality" becomes a number you can watch over time instead of an opinion.',
      takeaways: [
        'A named rule, a condition, and an action.',
        'Violations are **counted per run** in the pipeline event log.',
        'The expression can use columns and built-in functions — but **no subqueries**.',
      ],
    },
    {
      id: 'check-on-violation',
      type: 'truefalse',
      statement:
        'If you write an expectation without an `ON VIOLATION` clause, rows that fail it are dropped.',
      answer: false,
      explanation:
        'The default is **warn**, not drop. Violating rows are **kept** in the table and the violation count is recorded in the event log. You get `DROP ROW` or `FAIL UPDATE` only by asking for them — a favourite exam trap, and a real-world one too.',
    },
    {
      id: 'concept-running',
      type: 'concept',
      title: 'How a pipeline gets run, and shipped',
      body: 'A pipeline is not its own scheduler. Two things connect it to the rest of what you have learned:\n\n• **Lakeflow Jobs** runs it — a job can contain a **pipeline task** that triggers the pipeline, alongside notebook, SQL, and dashboard tasks. Pipelines answer *what*; jobs answer *when*.\n• **Asset Bundles** ship it — a pipeline is a resource declared in `databricks.yml`, promoted through dev, test, and prod like any other.',
      takeaways: [
        'Pipeline task in a job = how a pipeline is scheduled.',
        'Bundles = how a pipeline moves between environments.',
      ],
    },
    {
      id: 'mcq-choose',
      type: 'mcq',
      question:
        'A team ingests an append-only clickstream and must publish an hourly revenue-by-region figure. Customer records upstream are occasionally corrected retroactively, and rows with a null region must be excluded and the exclusions counted. Which design fits?',
      options: [
        {
          id: 'a',
          text: 'Streaming table for the clickstream with an expectation using `ON VIOLATION DROP ROW`; materialized view for the revenue aggregate.',
        },
        {
          id: 'b',
          text: 'Materialized view for the clickstream; streaming table for the revenue aggregate.',
        },
        {
          id: 'c',
          text: 'Streaming tables for both, with the null regions filtered in a `WHERE` clause.',
        },
        {
          id: 'd',
          text: 'Two notebooks scheduled an hour apart, with the second reading the first table.',
        },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'Append-only source → streaming table. Aggregate over data that can be corrected → materialized view. Exclude-and-count → an expectation with `DROP ROW`.',
        b: 'Backwards: the append-only source is what a streaming table is for, and an aggregate over changeable data is what a materialized view is for.',
        c: 'A `WHERE` clause silently discards the rows — the requirement was to **count** the exclusions, which is what an expectation gives you.',
        d: 'This is the hand-ordered design the pipeline replaces, and it reintroduces exactly the ordering bug pipelines exist to remove.',
      },
      explanation:
        'Three requirements, three decisions: **append-only** → streaming table · **retroactive corrections + aggregation** → materialized view · **exclude and count** → expectation with `ON VIOLATION DROP ROW`.',
      examObjective:
        'Understand the difference between, and how to build, Gold layer objects such as materialized views, views, streaming tables, and tables for BI and analytics teams in Unity Catalog.',
    },
    {
      id: 'flash-violation',
      type: 'flashcard',
      front: 'Name the three `ON VIOLATION` behaviours for a pipeline expectation, and the default.',
      back: '**warn** (the default when the clause is omitted — rows kept, violations counted), **`DROP ROW`**, and **`FAIL UPDATE`**.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You can now read a pipeline',
      points: [
        'Declare **what each table contains**; the engine derives the order.',
        'A **pipeline** is the container for the datasets defined inside it.',
        '**Streaming table** = append-only source, exactly-once, cheap.',
        '**Materialized view** = source rows can change, or the query aggregates.',
        '**Expectations** validate and *count*; the default action is **warn**, not drop.',
        'Jobs run pipelines (**pipeline task**); bundles promote them between environments.',
      ],
      closing:
        'The name has changed twice — *Delta Live Tables* → *Lakeflow Spark Declarative Pipelines* → *Lakeflow pipelines*. Expect any of the three. ♻️',
    },
  ],
}
