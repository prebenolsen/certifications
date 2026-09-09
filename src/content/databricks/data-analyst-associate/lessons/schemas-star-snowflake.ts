import type { Lesson } from '@/types/content'

/**
 * Lesson: star, snowflake and data vault schemas.
 * Maps to exam Section 8 (apply industry-standard data modeling techniques,
 * such as star, snowflake, and data vault schemas, to analytical workloads).
 */
export const schemasStarSnowflakeLesson: Lesson = {
  id: 'schemas-star-snowflake',
  title: 'Star, snowflake & data vault',
  summary:
    'Facts and dimensions, the two ways to arrange them, and the third model that optimises for auditability instead of querying.',
  estimatedMinutes: 10,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'The query with eleven joins',
      body: 'Answering "revenue by product category and customer segment last quarter" takes eleven joins through a chain of lookup tables. Every analyst writes it slightly differently, and two of them get different numbers.\n\nThe SQL is not the problem — the **shape of the tables** is. Dimensional modelling exists to make the common questions cheap to ask and hard to get wrong.',
      atWork:
        'A well-modelled gold layer is why one team’s dashboards agree with each other and another team’s never do.',
    },
    {
      id: 'concept-facts-dims',
      type: 'concept',
      title: 'Facts and dimensions',
      body: 'Analytical models split tables in two.\n\nA **fact** table records **events** — one row per sale, click, or shipment — holding the numeric **measures** you aggregate (amount, quantity) plus keys pointing at context. Facts are tall and narrow and grow forever.\n\nA **dimension** table holds the **context** you slice by: customer, product, store, date. Dimensions are short and wide, full of descriptive attributes.\n\nEvery analytical question is then the same shape: aggregate a measure from the fact, grouped by attributes from the dimensions.',
      takeaways: [
        'Fact = events + measures + foreign keys; grows continuously.',
        'Dimension = descriptive context you group and filter by.',
        '"Sum this, by that" maps directly onto fact and dimension.',
      ],
    },
    {
      id: 'concept-star',
      type: 'concept',
      title: 'Star schema: one join from anywhere',
      body: 'A **star schema** puts the fact table in the middle and joins each dimension **directly** to it — customer, product, date, store, each one join away. Drawn out, it looks like a star.\n\nThe dimensions are deliberately **denormalised**: `dim_product` carries category and subcategory as plain columns rather than pointing at further lookup tables. That repetition is the point — every query is a shallow join, and the SQL stays simple enough that different analysts write the same thing.',
      takeaways: [
        'Fact in the centre, every dimension one join away.',
        'Dimensions are denormalised — attributes repeat, deliberately.',
        'Simple, fast, and the default for analytical models.',
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
        arrows: ['one join', 'one join'],
      },
      caption:
        'Add dim_date and dim_store and the picture is unchanged: everything is one join from the fact.',
    },
    {
      id: 'concept-snowflake',
      type: 'concept',
      title: 'Snowflake schema: dimensions split up',
      body: 'A **snowflake schema** is a star whose dimensions have been **normalised**: `dim_product` no longer holds the category name, it holds a `category_id` pointing at `dim_category`, which may point at `dim_department`.\n\nThat removes repetition and makes a rename a one-row update. The cost is paid on every query: more joins, more complexity, and analysts who need to know the chain. Storage is cheap and analyst time is not, so the star usually wins — the snowflake earns its place with genuinely large, frequently-changing dimensions.',
      takeaways: [
        'Snowflake = normalised dimensions, joined in a chain.',
        'Less repetition and easier maintenance; more joins per query.',
        'Prefer the star unless a dimension is large and volatile.',
      ],
    },
    {
      id: 'concept-vault',
      type: 'concept',
      title: 'Data vault: built for auditability',
      body: '**Data vault** solves a different problem: tracking every change from every source system, with full history and provenance. It splits data into three kinds of table — **hubs** (the business keys), **links** (the relationships between them), and **satellites** (the descriptive attributes, with the time ranges over which they were true).\n\nThe result is superbly auditable and awkward to query directly, which is why data vault normally lives in the *integration* layer, with a star schema built on top of it for analysts.',
      takeaways: [
        'Hubs = business keys · links = relationships · satellites = attributes over time.',
        'Optimised for history, auditability, and many source systems.',
        'Not a serving model: teams build a star on top of it.',
      ],
    },
    {
      id: 'mistake-normalise',
      type: 'mistake',
      title: 'Normalising the analytical layer',
      myth: '"Repeating the category name in every product row is redundant — it should be normalised out."',
      reality:
        'Third normal form optimises for *writes* and for storage, which is right for the system taking orders. Analytical tables are written rarely and read constantly, so they optimise for **read simplicity** instead.\n\nThat is the whole idea of the star: accept controlled redundancy in dimensions so the questions stay one join deep and every analyst writes the same query.',
    },
    {
      id: 'mcq-model',
      type: 'mcq',
      question:
        'A BI team needs a model where analysts can aggregate sales by customer, product, and date with simple, consistent queries. Which model fits best, and why?',
      options: [
        {
          id: 'a',
          text: 'A star schema: a central fact table with denormalised dimensions, each one join away.',
        },
        {
          id: 'b',
          text: 'A snowflake schema, because normalising the dimensions makes queries faster.',
        },
        {
          id: 'c',
          text: 'A data vault, because hubs, links and satellites are the standard for BI serving.',
        },
        {
          id: 'd',
          text: 'A single wide table containing every column, so no joins are needed at all.',
        },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'One join from the fact to any dimension keeps analyst SQL simple and consistent — the reason the star is the default.',
        b: 'Normalising adds joins; it reduces redundancy rather than speeding queries up.',
        c: 'Data vault targets auditability and integration; teams serve BI from a star built over it.',
        d: 'One enormous table duplicates every attribute on every event row and becomes unmaintainable as dimensions change.',
      },
      explanation:
        '**Star** for serving analytics, **snowflake** when a dimension is big and volatile enough to justify normalising, **data vault** for auditable integration — with a star on top for the analysts.',
      examObjective:
        'Apply industry-standard data modeling techniques, such as star, snowflake, and data vault schemas, to analytical workloads.',
    },
    {
      id: 'tf-grain',
      type: 'truefalse',
      statement:
        'A fact table can mix daily rows and monthly summary rows to save space.',
      answer: false,
      explanation:
        'A fact table has one consistent **grain** — one row per event at one level. Mixing grains double-counts every measure the moment someone aggregates without knowing, which is among the hardest reporting bugs to find.',
    },
    {
      id: 'flash-models',
      type: 'flashcard',
      front: 'Star, snowflake, data vault — one line each.',
      back: '**Star:** fact + denormalised dimensions, one join away. **Snowflake:** star with normalised dimensions, more joins. **Data vault:** hubs, links, satellites — built for history and auditability, not for querying.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You can now read an analytical model',
      points: [
        'Facts hold events and measures; dimensions hold the context you slice by.',
        'Star: dimensions denormalised, each one join from the fact — the default.',
        'Snowflake: dimensions normalised into chains — less repetition, more joins.',
        'Data vault: hubs, links, satellites — auditable integration, served via a star.',
        'Keep a fact table at one consistent grain.',
      ],
      closing:
        'Next: where these models sit in the layers your data flows through. 🥇',
    },
  ],
}
