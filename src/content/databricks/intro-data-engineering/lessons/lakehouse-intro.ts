import type { Lesson } from '@/types/content'

/**
 * Lesson 3: the lakehouse.
 *
 * Introduces **lakehouse**. Deliberately does *not* name Delta Lake or Unity
 * Catalog — they are the next two lessons, and naming them here would put the
 * answer before the problem.
 */
export const lakehouseIntroLesson: Lesson = {
  id: 'lakehouse-intro',
  title: 'Warehouse, lake, lakehouse',
  summary:
    'Why there used to be two separate systems, what each was good at, and what the lakehouse combines them into.',
  estimatedMinutes: 6,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'Two systems, two answers',
      body: 'A finance director and a data scientist are in the same meeting, both looking at revenue for last quarter. The numbers differ by 4%.\n\nNeither is lying. Finance is reading a **data warehouse**, refreshed nightly from a curated set of tables. The data scientist is reading a **data lake**, filled by a different job with slightly different rules about what counts as a completed sale.\n\nThe rest of the meeting is spent reconciling the two instead of deciding anything.',
      atWork:
        'Two copies of the truth is not a storage problem. It is a credibility problem, and it lands on the data team.',
    },
    {
      id: 'concept-warehouse',
      type: 'concept',
      title: 'The data warehouse',
      body: 'A **data warehouse** stores structured, carefully modelled data for analysis. Every table has a defined shape, decided before anything is loaded, and the loading process rejects whatever does not fit.\n\nThat discipline is exactly why finance trusts it: queries are fast, the numbers are consistent, and permissions are enforced.\n\nThe cost of the discipline is rigidity. Adding a new field means changing the model. Data with no obvious shape — logs, images, free text, half-documented JSON from a third party — does not fit at all. And warehouse storage is expensive per terabyte.',
      takeaways: [
        'Strong on: speed, consistency, governance, trust.',
        'Weak on: anything unstructured, and anything whose shape is not known yet.',
      ],
    },
    {
      id: 'concept-lake',
      type: 'concept',
      title: 'The data lake',
      body: 'A **data lake** is the opposite trade. It is cheap cloud storage that accepts any file — CSV, JSON, images, audio, whatever a system produces — with no shape declared in advance.\n\nThat is genuinely useful: a company receiving millions of JSON files a day can keep all of them for very little money and decide later what to do with them. Machine learning in particular needs that raw, unfiltered history.\n\nWhat a plain lake does not give you is any guarantee. Nothing stops two jobs writing the same folder at once, nothing rejects a file with a corrupted column, nothing records what changed or who may read it. Enough of that and the lake becomes a *data swamp*: full of data nobody trusts.',
      takeaways: [
        'Strong on: cost, scale, and holding anything.',
        'Weak on: correctness, consistency and governance — the things a warehouse was built for.',
      ],
    },
    {
      id: 'diagram-compare',
      type: 'diagram',
      title: 'The old choice',
      spec: {
        kind: 'compare',
        left: {
          label: 'Data warehouse',
          sublabel: 'built for reporting',
          tone: 'accent',
          items: [
            'Structured tables, shape decided up front',
            'Fast, consistent queries',
            'Transactions and permissions',
            'Expensive per terabyte',
            'Cannot hold logs, images, free text',
          ],
        },
        right: {
          label: 'Data lake',
          sublabel: 'built for storing everything',
          tone: 'warn',
          items: [
            'Any file, any format, no shape required',
            'Very cheap at any scale',
            'Keeps full raw history for AI',
            'No transactions, no quality rules',
            'Becomes a swamp without discipline',
          ],
        },
      },
      caption:
        'Most organisations ended up running **both**, plus jobs copying data between them. Two systems, two sets of permissions, two versions of every number — and a meeting to work out which one is right.',
    },
    {
      id: 'concept-lakehouse',
      type: 'concept',
      title: 'The lakehouse',
      body: 'A **lakehouse** keeps the lake and adds the warehouse\'s discipline on top of it.\n\nThe storage stays as it was: cheap, open, holds anything. What is added is the machinery that made warehouses trustworthy — transactions so a half-finished write is never visible, enforced table shapes, quality rules, permissions, and a full record of what changed and when.\n\nThe point is not the file format. The point is that **one copy of the data** now serves the finance dashboard and the machine-learning model, so there is nothing to reconcile.',
      takeaways: [
        'Lakehouse = lake storage **plus** warehouse guarantees.',
        'One copy, one set of permissions, one number.',
        'This is the idea the entire Databricks platform is built around.',
      ],
    },
    {
      id: 'mistake-nicer-ui',
      type: 'mistake',
      title: 'What actually makes it a lakehouse',
      myth: '"A lakehouse is just a data lake with a friendlier interface bolted on top."',
      reality:
        'The interface is not the difference. Two things are: a **transaction record** kept alongside the files, so every reader sees a complete and consistent version of a table, and a **governance layer** that names and secures those tables centrally.\n\nWithout both, it is a lake with a nicer front end — and it will drift into a swamp exactly as before. Those two things are the next two lessons of this course.',
    },
    {
      id: 'check-separate-copy',
      type: 'truefalse',
      statement:
        'In a lakehouse, reporting teams still need their own separate copy of the data in a traditional warehouse.',
      answer: false,
      explanation:
        'That copy is the problem the lakehouse exists to remove. Reporting and machine learning read the **same** governed tables, which is why the two-different-numbers meeting stops happening.',
    },
    {
      id: 'flash-lakehouse',
      type: 'flashcard',
      front: 'What does a **lakehouse** combine, and what does that buy you?',
      back: 'Cheap open storage that holds anything (the **lake**) plus transactions, quality rules and governance (the **warehouse**). The payoff: **one copy of the data** serving reporting and AI alike.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'One copy, not two',
      points: [
        'A **warehouse** is trustworthy and rigid; a **lake** is cheap and lawless.',
        'Running both means copies that drift, and numbers that disagree.',
        'A **lakehouse** is lake storage with warehouse guarantees layered over it.',
        'What makes it work: a transaction record next to the files, and a central governance layer.',
        'The goal is **one copy of the data** for reporting and AI.',
      ],
      closing:
        'Next: the two layers that deliver on that promise — starting with the one that turns a folder of files into a table you can trust. 🧱',
    },
  ],
}
