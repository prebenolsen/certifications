import type { Lesson } from '@/types/content'

/**
 * Lesson 8: the medallion architecture.
 *
 * Introduces **medallion architecture**. The teaching goal is that it is a
 * *convention*, not a feature — and that keeping bronze is what makes
 * mistakes recoverable.
 */
export const medallionIntroLesson: Lesson = {
  id: 'medallion-intro',
  title: 'Bronze, silver, gold',
  summary:
    'How raw data becomes trustworthy data in named stages, and why the convention is worth more than it looks.',
  estimatedMinutes: 6,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'Which customers table is the real one?',
      body: 'A new analyst searches the catalog for customers and finds four tables. One has 2.1 million rows, one has 1.8 million, one is a week stale, one has a column called `email_2`.\n\nAll four are real, all four were built for a reason, and nothing in their names says which one a revenue report should use. So the analyst asks in chat, waits a day, and picks whichever one somebody answers with.',
      atWork:
        'Trust is not a property of the data. It is a property of the data being labelled.',
    },
    {
      id: 'concept-bronze',
      type: 'concept',
      title: 'Bronze: exactly what arrived',
      body: 'The **bronze** layer holds ingested data as it came in — same columns, same values, same mess — with maybe a timestamp and the source file name added.\n\nNothing is cleaned here, and nothing is corrected. That is the discipline: bronze is the honest record of what the source system actually sent, which makes it the thing you compare against when a number is disputed.',
      takeaways: [
        'Raw, append-only, never edited in place.',
        'Its value is being an unarguable record of what was received.',
      ],
    },
    {
      id: 'concept-silver',
      type: 'concept',
      title: 'Silver: cleaned and agreed on',
      body: 'The **silver** layer is where the real work happens. Types are fixed, duplicates removed, obviously broken rows dropped or quarantined, and columns renamed to mean the same thing across sources. Related sources are joined so that a customer from the shop and a customer from the support system are recognised as one person.\n\nSilver is where "one definition of a customer" stops being an aspiration. Most of a data engineer\'s time is spent here.',
      takeaways: [
        'Cleaned, deduplicated, conformed — one row per real-world thing.',
        'This is the layer other teams build on.',
      ],
    },
    {
      id: 'concept-gold',
      type: 'concept',
      title: 'Gold: the numbers the business asked for',
      body: 'The **gold** layer is aggregated and shaped for a specific audience or question: revenue per region per day, churn risk per customer, the exact table behind one dashboard.\n\nGold tables are small, fast, and opinionated — they encode business definitions, so "active customer" is decided once here rather than re-invented in every dashboard. There are usually several, one per question, rather than one grand table.',
      takeaways: [
        'Built per question or per audience, not per source system.',
        'Where business definitions are settled once and reused.',
      ],
    },
    {
      id: 'diagram-flow',
      type: 'diagram',
      title: 'The refinement path',
      spec: {
        kind: 'flow',
        steps: [
          {
            label: 'Source',
            sublabel: 'files, apps, databases',
            tone: 'neutral',
          },
          { label: 'Bronze', sublabel: 'raw, as received', tone: 'warn' },
          { label: 'Silver', sublabel: 'cleaned, deduplicated, joined', tone: 'accent' },
          { label: 'Gold', sublabel: 'aggregated per question', tone: 'good' },
        ],
        arrows: ['ingest, change nothing', 'clean and conform', 'aggregate for use'],
      },
      caption:
        'Data volume shrinks and trust rises left to right. The layer a table sits in tells a newcomer how much to trust it without asking anyone — which is the entire point.',
    },
    {
      id: 'concept-why-bronze',
      type: 'concept',
      title: 'Why keep bronze at all',
      body: 'It is a fair question: if silver is the clean version, why pay to store the mess?\n\nBecause the cleaning logic will turn out to be wrong. In three months someone discovers that refunds were being counted twice since February. With bronze, the fix is to correct the logic and rebuild silver and gold from data you already have. Without it, the fix requires asking the source system for three months of history — and most source systems cannot provide it, because they only hold the current state.\n\nRaw storage is cheap. Losing the ability to reprocess is not.',
      takeaways: [
        'Bronze is what makes a transformation bug recoverable rather than permanent.',
        'Source systems usually hold *current* state, not history. Bronze holds history.',
      ],
    },
    {
      id: 'mistake-feature',
      type: 'mistake',
      title: 'There is no button for this',
      myth: '"Medallion architecture is a Databricks feature you enable, and it puts the layers in place for you."',
      reality:
        'It is a **naming convention**. Nothing enforces it, nothing creates the layers, and nothing stops a dashboard from reading straight out of bronze.\n\nIts value is social rather than technical: once a whole organisation follows it, the position of a table communicates its trustworthiness, and the new analyst from the first card does not have to ask which `customers` table is the real one. A convention everyone follows is worth more than a feature only one team uses.',
    },
    {
      id: 'check-bronze-dashboard',
      type: 'truefalse',
      statement:
        'A dashboard used by the leadership team should read directly from the bronze layer, since bronze is the most complete and untouched version of the data.',
      answer: false,
      explanation:
        'Bronze is complete and *uncleaned* — duplicates, broken rows and inconsistent definitions included. Dashboards read **gold**, where the business definitions have been applied. Bronze completeness is for reprocessing, not for reporting.',
    },
    {
      id: 'flash-layers',
      type: 'flashcard',
      front: 'What are the three medallion layers, in one line each?',
      back: '**Bronze** — raw, exactly as ingested. **Silver** — cleaned, deduplicated, conformed. **Gold** — aggregated and business-ready for a specific question.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'Three layers, rising trust',
      points: [
        'The **medallion architecture** refines data through named layers: **bronze → silver → gold**.',
        '**Bronze** is untouched arrival data; **silver** is cleaned and conformed; **gold** is aggregated per question.',
        'Keeping bronze is what makes a bug in the transformation logic fixable months later.',
        'It is a **convention**, not a feature — nothing enforces it.',
        'Its payoff: where a table sits tells you how much to trust it.',
      ],
      closing:
        'The data is trustworthy. Next: the people waiting for it, and how they use it. 📊',
    },
  ],
}
