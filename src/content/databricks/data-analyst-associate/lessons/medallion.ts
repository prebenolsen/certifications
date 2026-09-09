import type { Lesson } from '@/types/content'

/**
 * Lesson: the medallion architecture and how models align to it.
 * Maps to exam Section 8 (understand how industry-standard models align with
 * the Medallion Architecture).
 */
export const medallionLesson: Lesson = {
  id: 'medallion',
  title: 'Bronze, silver, gold',
  summary:
    'The three layers data passes through, what changes at each hop, which one an analyst should build on — and where a star schema belongs.',
  estimatedMinutes: 9,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'Two dashboards, one source, different numbers',
      body: 'Two analysts build revenue dashboards from the same company data. One reads a raw ingested table and filters out test orders; the other reads a curated table where that was already done — differently.\n\nThe numbers disagree, and both are defensible. The **medallion architecture** exists to stop this: it names how refined a table is, so everyone builds on the same rung.',
      atWork:
        'Knowing which layer a table sits in tells you how much cleaning has already happened — and whether it is safe for a report.',
    },
    {
      id: 'concept-layers',
      type: 'concept',
      title: 'Three layers, three jobs',
      body: '**Bronze** — raw, exactly as ingested. Nothing is corrected, so it stays a faithful record you can replay from. Append-only, and not where reports should read from.\n\n**Silver** — cleaned and conformed: types fixed, nulls handled, duplicates removed, codes standardised, sources joined into consistent entities. This is the trustworthy working layer.\n\n**Gold** — business-ready: aggregated, modelled, named for the business rather than the source system. This is what dashboards and Genie spaces read.',
      takeaways: [
        'Bronze = raw and replayable; silver = cleaned; gold = business-ready.',
        'Each hop raises quality and narrows the audience.',
        'Analysts should be reading gold, occasionally silver, almost never bronze.',
      ],
    },
    {
      id: 'diagram-medallion',
      type: 'diagram',
      title: 'What changes at each hop',
      spec: {
        kind: 'flow',
        steps: [
          {
            label: 'Bronze',
            sublabel: 'raw, as ingested · append-only',
            tone: 'warn',
          },
          {
            label: 'Silver',
            sublabel: 'cleaned, typed, deduplicated, conformed',
            tone: 'accent',
          },
          {
            label: 'Gold',
            sublabel: 'aggregated and modelled for the business',
            tone: 'good',
          },
        ],
        arrows: ['clean · type · dedupe', 'model · aggregate'],
      },
      caption:
        'Bronze is never edited in place — it is the record you can rebuild everything else from.',
    },
    {
      id: 'analogy-kitchen',
      type: 'analogy',
      title: 'Delivery, prep, service',
      body: 'A restaurant does not cook straight from the delivery van. Goods arrive at the **loading dock** untouched, get washed and portioned at the **prep station**, and are plated as **dishes** for service.\n\nNobody serves from the dock, and nobody re-washes vegetables at the pass. The layers exist so each job happens once, in the right place.',
      mapping: [
        { from: 'Loading dock — as delivered', to: 'Bronze: raw, unmodified' },
        { from: 'Prep station — washed, portioned', to: 'Silver: cleaned and conformed' },
        { from: 'Plated dishes', to: 'Gold: business-ready tables' },
      ],
    },
    {
      id: 'concept-alignment',
      type: 'concept',
      title: 'Where the models fit',
      body: 'Dimensional models live in **gold**. A star schema — a fact table surrounded by dimensions — is what a well-built gold layer usually looks like, because it is shaped for the questions people ask.\n\n**Data vault**, when a company uses it, sits between: it is an integration pattern for the **silver** layer, collecting history from many source systems. Analysts still read a star built on top of it.\n\nAnd **bronze** has no model at all, by design. Imposing one would mean altering data before you know what is wrong with it.',
      takeaways: [
        'Star (and snowflake) schemas belong in **gold**.',
        'Data vault is a **silver**-layer integration pattern, served through gold.',
        'Bronze is deliberately unmodelled.',
      ],
    },
    {
      id: 'concept-not-a-feature',
      type: 'concept',
      title: 'It is a convention, not a feature',
      body: 'There is no switch that makes a table "silver". The layers are a **naming discipline** — usually catalogs or schemas called `bronze`, `silver`, `gold` — and their value is entirely social: anyone can tell how refined a table is from where it sits.\n\nThat is also why the convention needs enforcing with permissions and documentation. A gold-layer name on an unvalidated table is worse than no convention at all, because people trust it.',
      takeaways: [
        'Nothing enforces the layers technically — they are names plus discipline.',
        'The payoff is that "which layer is this?" answers "can I trust it?".',
        'Back the convention with grants: not everyone should write to gold.',
      ],
    },
    {
      id: 'mistake-bronze-report',
      type: 'mistake',
      title: 'Reporting straight from bronze',
      myth: '"Bronze has the most complete data, so my report should read it — nothing has been filtered out yet."',
      reality:
        'Bronze is complete precisely because it contains the duplicates, test records, and broken types nobody has fixed yet. Reporting from it means re-implementing silver’s cleaning inside your query — differently from everyone else, and again next month.\n\nRead gold. If gold is missing something you need, the fix is to extend the gold layer, not to bypass it.',
    },
    {
      id: 'mcq-medallion',
      type: 'mcq',
      question:
        'A team is designing where to put a star schema of sales facts and customer dimensions for BI users. Which layer should it live in, and why?',
      options: [
        {
          id: 'a',
          text: 'Gold — dimensional models are the business-ready serving layer that dashboards and Genie read.',
        },
        {
          id: 'b',
          text: 'Bronze — so the model reflects the raw data exactly as ingested.',
        },
        {
          id: 'c',
          text: 'Silver — because dimensional models are a cleaning technique.',
        },
        {
          id: 'd',
          text: 'It does not matter; the layer names are only labels and carry no meaning.',
        },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'Star schemas are shaped for business questions, which is exactly what the gold layer is for.',
        b: 'Bronze is raw and unmodelled by design; modelling it would destroy the replayable record.',
        c: 'Silver conforms and cleans entities; the dimensional shape for consumption is added on the way to gold.',
        d: 'The names are a convention, but the convention is what tells people how much they can trust a table.',
      },
      explanation:
        'Bronze raw, silver clean, **gold modelled for consumption** — which is where a star schema, aggregates, and the tables your dashboards read all belong.',
      examObjective:
        'Understand how industry-standard models align with the Medallion Architecture.',
    },
    {
      id: 'tf-bronze',
      type: 'truefalse',
      statement:
        'Bad rows should be corrected in the bronze table so every downstream consumer gets clean data.',
      answer: false,
      explanation:
        'Bronze’s value is being a faithful record of what the source actually sent. Correct in **silver** instead: bronze stays replayable, and if the cleaning logic turns out to be wrong you can rebuild from it.',
    },
    {
      id: 'flash-layers',
      type: 'flashcard',
      front: 'What happens at each medallion hop, and where does a star schema live?',
      back: 'Bronze = raw as ingested · silver = cleaned, typed, deduplicated, conformed · gold = aggregated and modelled. A **star schema lives in gold**.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You can now place any table',
      points: [
        'Bronze raw and append-only; silver cleaned and conformed; gold business-ready.',
        'Star and snowflake schemas belong in gold; data vault integrates in silver.',
        'Bronze is deliberately unmodelled and never edited in place.',
        'The layers are a naming convention — back them with permissions.',
        'Build reports on gold; extend gold rather than bypassing it.',
      ],
      closing:
        'Final module: making sure only the right people can read any of it. 🔒',
    },
  ],
}
