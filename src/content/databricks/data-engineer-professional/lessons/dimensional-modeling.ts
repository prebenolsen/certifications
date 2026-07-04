import type { Lesson } from '@/types/content'

/**
 * Lesson: choosing a partition column and dimensional modelling.
 * Maps to exam Section 10 (design scalable Delta models; dimensional models).
 * Covers sample question 3 (good partition candidate = a DATE column).
 */
export const dimensionalModelingLesson: Lesson = {
  id: 'dimensional-modeling',
  title: 'Modelling for the questions you ask',
  summary:
    'Pick a partition column by cardinality and query pattern, and shape analytics data as star-schema facts and dimensions.',
  estimatedMinutes: 10,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'A million tiny files',
      body: 'A teammate partitioned a posts table by `post_time` (a timestamp). Every distinct second became its own directory. The table now has millions of near-empty files, and every query crawls.\n\nPartitioning is a physical-layout decision. Get the column wrong and you make queries *slower*, not faster.',
      atWork:
        'The exam loves handing you a schema and asking which column to partition on. It is really testing whether you understand cardinality.',
    },
    {
      id: 'analogy-filing',
      type: 'analogy',
      title: 'Partitioning is a filing cabinet',
      body: 'A partition column decides the drawers in your filing cabinet. Filing by **year-month** gives you a handful of fat drawers you can grab in one pull. Filing by **exact timestamp** gives you a million drawers each holding one sheet — finding anything means opening all of them.',
      mapping: [
        { from: 'A drawer', to: 'A partition (a folder of files)' },
        { from: 'Too many one-sheet drawers', to: 'High-cardinality column → tiny-file problem' },
        { from: 'A few fat, labeled drawers', to: 'Low-cardinality column you filter on' },
      ],
    },
    {
      id: 'concept-cardinality',
      type: 'concept',
      title: 'Good partition columns are low-cardinality and filtered on',
      body: 'A partition column should have **few distinct values** (low cardinality) so each partition holds a healthy amount of data, and it should be a column your queries **filter on**, so the engine can skip whole partitions.\n\n`date` fits both: dozens-to-thousands of values, and almost every query says "the last N days." A `TIMESTAMP` has near-unique values — too many partitions. `user_id` or `post_id` are effectively unique — the worst possible choice.',
      takeaways: [
        'Low cardinality → partitions large enough to be efficient.',
        'Frequently filtered → partition pruning actually helps.',
        'A DATE beats a TIMESTAMP; an id column is a trap.',
      ],
    },
    {
      id: 'mcq-partition',
      type: 'mcq',
      question:
        'A Delta table has schema `user_id LONG, post_text STRING, post_id STRING, longitude FLOAT, latitude FLOAT, post_time TIMESTAMP, date DATE`. Which column is the best candidate for partitioning?',
      options: [
        { id: 'a', text: 'post_id' },
        { id: 'b', text: 'post_time' },
        { id: 'c', text: 'date' },
        { id: 'd', text: 'user_id' },
      ],
      correct: ['c'],
      optionFeedback: {
        a: 'post_id is unique per row — one partition per record, the tiny-file nightmare.',
        b: 'A TIMESTAMP is nearly unique too; partitioning on it explodes the partition count.',
        c: 'Correct — a DATE is low-cardinality and the column queries filter on, enabling partition pruning.',
        d: 'user_id has very high cardinality and skews badly (some users post far more than others).',
      },
      explanation:
        'The best partition column is **low-cardinality and commonly filtered**. `date` is exactly that; timestamp and id columns are too granular.',
      examObjective:
        'Design and implement scalable data models using Delta Lake to manage large datasets.',
    },
    {
      id: 'concept-dont-overpartition',
      type: 'concept',
      title: 'Most tables should not be partitioned at all',
      body: 'Databricks guidance: **don’t partition tables under ~1 TB**. Below that, partitioning usually creates small files and hurts more than it helps. Delta’s file-level statistics already skip data without any partitioning.\n\nWhen you *do* need to shape layout, the modern default is **Liquid Clustering** (`CLUSTER BY`), not partitioning — it adapts as data and queries evolve.',
      takeaways: [
        'Small/medium tables: no partitioning; rely on data skipping.',
        'Partitioning is a big-table, low-cardinality tool.',
        'Liquid Clustering is the modern replacement for most layout needs.',
      ],
    },
    {
      id: 'concept-star',
      type: 'concept',
      title: 'Dimensional modelling: facts and dimensions',
      body: 'For analytics, model gold-layer data as a **star schema**: a central **fact** table of measurable events (one row per sale, click, or post) surrounded by **dimension** tables describing the context (customer, product, date).\n\nFacts are tall and narrow with foreign keys and numbers; dimensions are short and wide with descriptive attributes. Analysts join facts to dimensions to slice metrics by any attribute.',
      takeaways: [
        'Fact = events + measures + foreign keys (grows fast).',
        'Dimension = descriptive context (customer, product, date).',
        'Star schema keeps aggregation queries simple and fast.',
      ],
    },
    {
      id: 'diagram-star',
      type: 'diagram',
      title: 'A star schema',
      spec: {
        kind: 'flow',
        steps: [
          { label: 'dim_customer', sublabel: 'who', tone: 'accent' },
          { label: 'fact_sales', sublabel: 'events + measures', tone: 'brand' },
          { label: 'dim_product', sublabel: 'what', tone: 'accent' },
        ],
        arrows: ['joins', 'joins'],
      },
      caption:
        'One fact table in the middle, dimensions radiating out — analysts join to slice measures by any attribute.',
    },
    {
      id: 'tf-grain',
      type: 'truefalse',
      statement:
        'A fact table should mix daily and monthly rows in the same table to save space.',
      answer: false,
      explanation:
        'A fact table has a single, consistent **grain** (one row per event at one level). Mixing grains double-counts measures and corrupts aggregations — use separate tables or a materialized view for rollups.',
    },
    {
      id: 'flash-partition',
      type: 'flashcard',
      front: 'Two properties of a good partition column?',
      back: '**Low cardinality** (so partitions are big enough) and **frequently used in query filters** (so pruning helps). A DATE fits; a timestamp or id does not.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You can now shape a table for scale',
      points: [
        'Partition on low-cardinality, frequently-filtered columns — a DATE, not a timestamp or id.',
        'Don’t partition small/medium tables; data skipping already helps.',
        'Liquid Clustering is the modern default over partitioning.',
        'Model analytics as a star: one fact table, many dimensions.',
        'Keep a fact table at a single consistent grain.',
      ],
      closing: 'Next: why Liquid Clustering makes most partitioning decisions obsolete. 🌊',
    },
  ],
}
