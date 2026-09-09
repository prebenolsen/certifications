import type { Lesson } from '@/types/content'

/**
 * Lesson 5: Unity Catalog, the governance layer.
 *
 * Introduces **Unity Catalog** and **data lineage**. Privilege names, row
 * filters and column masks are certification material — this lesson answers
 * only "what is it and why does everything assume it".
 */
export const unityCatalogIntroLesson: Lesson = {
  id: 'unity-catalog-intro',
  title: 'Unity Catalog: names, permissions, lineage',
  summary:
    'One place that names every table, controls who can read it, and records where its data came from.',
  estimatedMinutes: 6,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'Three teams, three tables called customers',
      body: 'Sales, support and marketing each built a `customers` table. Two of them exclude cancelled accounts; nobody remembers which two.\n\nAccess is managed by handing out storage keys, tracked in a spreadsheet. A contractor who left in March still has one. When a column is renamed, the way you find out what broke is that someone complains.\n\nEvery individual table here is a well-behaved Delta table. The problem is that nothing sits above them.',
      atWork:
        'Ask "who can read this, and where did the number come from?" If answering takes a week, that is the gap this lesson is about.',
    },
    {
      id: 'concept-uc',
      type: 'concept',
      title: 'One layer, three questions',
      body: '**Unity Catalog** is the governance layer for the whole platform. It is the single place that answers three questions about every table, file, dashboard and model on it:\n\n**What is this called?** — one name, meaning one thing, across every team and every environment.\n\n**Who may use it?** — permissions granted centrally, enforced whenever anyone queries.\n\n**Where did it come from?** — an automatic record of what was used to build it, and what has been built on it.\n\nIf Delta Lake makes a single table trustworthy, Unity Catalog makes the *collection* of them manageable.',
      takeaways: [
        'It governs more than tables: files, machine-learning models and dashboards too.',
        'One set of rules covering every environment, rather than per-team arrangements.',
      ],
    },
    {
      id: 'concept-names',
      type: 'concept',
      title: 'The three-level name',
      body: 'Every table has a three-part name: **`catalog.schema.table`**.\n\nA **catalog** is the top-level container — commonly one per environment or per business domain, such as `prod` and `dev`.\nA **schema** groups related tables inside a catalog, such as `sales` or `support`.\nThe **table** is the data itself.\n\nSo `prod.sales.orders` is unambiguous: there is exactly one table with that name, and `dev.sales.orders` is visibly a different thing. The third level is what lets production and development data live side by side under one set of rules instead of in separate, drifting systems.',
      takeaways: [
        'Three levels: **catalog → schema → table**.',
        'The name itself tells you which environment and which domain you are in.',
      ],
    },
    {
      id: 'analogy-address',
      type: 'analogy',
      title: 'A postal address',
      body: 'There are many streets called Station Road, so a street name alone will not deliver a letter. Country, then city, then street and number identifies exactly one door — and the address itself tells you roughly where you are going.',
      mapping: [
        { from: 'Country', to: 'Catalog — e.g. `prod`' },
        { from: 'City', to: 'Schema — e.g. `sales`' },
        { from: 'Street and number', to: 'Table — e.g. `orders`' },
        { from: 'The full address', to: '`prod.sales.orders`' },
      ],
    },
    {
      id: 'diagram-layers',
      type: 'diagram',
      title: 'What contains what',
      spec: {
        kind: 'layers',
        layers: [
          {
            label: 'Metastore',
            sublabel: 'one per region, shared by every workspace',
            tone: 'neutral',
          },
          { label: 'Catalog', sublabel: 'prod · dev · finance', tone: 'accent' },
          { label: 'Schema', sublabel: 'sales · support · marketing', tone: 'brand' },
          {
            label: 'Tables, views, files, models, functions',
            sublabel: 'the things you actually query and use',
            tone: 'good',
          },
        ],
      },
      caption:
        'The **metastore** is the outer container you rarely name out loud — it is what makes several teams and several environments share one rulebook. Everything below it is addressed by the three-level name.',
    },
    {
      id: 'concept-permissions',
      type: 'concept',
      title: 'Permissions on objects, not on files',
      body: 'Access is granted on the object — "the support team may read `prod.sales.orders`" — and enforced every time a query runs, whichever tool the query came from.\n\nNobody is handed a storage key. That is the important shift: with storage keys, access is all-or-nothing at the folder level and impossible to audit. With Unity Catalog, permission is specific, revocable in one place, and logged.\n\nGrants also apply downward. Give a team read access to the `sales` schema and it covers the tables in it — including tables that do not exist yet.',
      takeaways: [
        'Permissions follow the object, not the storage location.',
        'A grant on a schema covers future tables in it, so new tables are not accidentally invisible or accidentally public.',
      ],
    },
    {
      id: 'concept-lineage',
      type: 'concept',
      title: 'Lineage nobody has to maintain',
      body: 'As queries run, Unity Catalog records what read from what. The result is **data lineage**: a graph, down to individual columns, of where each table\'s data came from and what has been built on top of it — including dashboards, notebooks and scheduled jobs.\n\nIt answers the two questions that otherwise cost days. Looking upstream: *where did this number actually come from?* Looking downstream: *if I change this column, what breaks?*\n\nNobody draws it and nobody keeps it up to date. It is a by-product of running queries.',
      takeaways: [
        'Upstream = provenance. Downstream = blast radius.',
        'Captured automatically, so it does not rot the way a hand-drawn diagram does.',
      ],
    },
    {
      id: 'mistake-later',
      type: 'mistake',
      title: 'The tempting order of work',
      myth: '"Get the pipelines working first. Governance is a tidy-up job for when we go to production."',
      reality:
        'Retrofitting governance means renaming tables people already query, revoking access people already rely on, and reconstructing history nobody recorded. It is one of the most expensive kinds of rework in a data platform.\n\nIt is also why this course covers Unity Catalog before any pipeline: the name a table has, and who may read it, are decided when the table is created — by whoever created it, deliberately or not.',
    },
    {
      id: 'mcq-role',
      type: 'mcq',
      question:
        'A data engineer is about to rename a column in `prod.sales.orders`. Which Unity Catalog capability tells them what will break?',
      options: [
        { id: 'a', text: 'Time travel — query the table as it was before the rename.' },
        { id: 'b', text: 'Downstream lineage — the recorded list of tables, dashboards and jobs built on that table.' },
        { id: 'c', text: 'The transaction log — the ordered record of every change to the table.' },
        { id: 'd', text: 'The three-level namespace — the full `catalog.schema.table` name.' },
      ],
      correct: ['b'],
      optionFeedback: {
        a: 'Time travel shows what the table used to contain, not who depends on it.',
        b: 'Downstream lineage is precisely the "what breaks if I change this?" answer.',
        c: 'The log describes changes to this one table; it knows nothing about its consumers.',
        d: 'The name identifies the table but says nothing about what reads from it.',
      },
      explanation:
        'Lineage is captured automatically as queries run, so the dependency list is already there before anyone needs it — which is the difference between a five-minute check and a week of asking around.',
    },
    {
      id: 'flash-namespace',
      type: 'flashcard',
      front: 'What are the three levels of a Unity Catalog table name?',
      back: '**`catalog.schema.table`** — for example `prod.sales.orders`. The catalog is usually an environment or domain, the schema groups related tables.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'The layer everything else assumes',
      points: [
        '**Unity Catalog** governs the whole platform: names, permissions, and lineage.',
        'Every object has a three-level name: **catalog → schema → table**.',
        'Permissions are granted on objects and enforced at query time — no storage keys handed out.',
        'A grant on a schema covers tables that do not exist yet.',
        '**Data lineage** is recorded automatically: upstream for provenance, downstream for blast radius.',
      ],
      closing:
        'Storage and governance are settled. Next: where the work actually runs, and what it costs. ⚙️',
    },
  ],
}
