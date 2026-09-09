import type { Lesson } from '@/types/content'

/**
 * Lesson: Catalog Explorer — browsing objects, views vs tables, lineage.
 * Maps to exam Section 1 (understand catalogs, schemas, managed and external
 * tables, access controls, views, certified tables, and lineage within the
 * Catalog Explorer interface).
 */
export const catalogExplorerLineageLesson: Lesson = {
  id: 'catalog-explorer-lineage',
  title: 'Catalog Explorer: your window on the data',
  summary:
    'Browse catalogs and schemas, read a table’s page, tell a view from a table, check who has access, and follow lineage upstream and downstream.',
  estimatedMinutes: 9,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'Someone sends you a table name',
      body: '"Use `main.finance.revenue_daily` for the board deck." Before you build anything on it you want to know: what columns does it have, where did it come from, is anyone else using it, and am I even allowed to read it?\n\nAll four answers live on one page in **Catalog Explorer**.',
      atWork:
        'Ten seconds in Catalog Explorer regularly prevents a day of building on the wrong table.',
    },
    {
      id: 'concept-explorer',
      type: 'concept',
      title: 'What Catalog Explorer is',
      body: '**Catalog Explorer** is the browser for everything Unity Catalog governs. The left side is a tree — catalogs, then schemas, then the tables, views, volumes, functions, and models inside them.\n\nIt shows only what you have permission to see, so an empty-looking catalog usually means missing access rather than missing data.',
      takeaways: [
        'The tree mirrors the hierarchy: catalog → schema → object.',
        'Everything is permission-filtered — you cannot browse what you cannot access.',
        'It is also where you edit descriptions, tags, and permissions.',
      ],
    },
    {
      id: 'concept-table-page',
      type: 'concept',
      title: 'Reading a table’s page',
      body: 'Open a table and you get its whole story in tabs:\n\n• **Overview / Columns** — the schema, with a comment per column.\n• **Sample data** — the first rows, so you can see what the values actually look like.\n• **Details** — the important one for the exam: whether the table is **managed or external**, its type, owner, size, and storage location.\n• **Permissions** — who has been granted what, editable here instead of in SQL.\n• **Lineage** — what it was built from and what depends on it.',
      takeaways: [
        '**Details** tells you managed vs external without running any SQL.',
        '**Permissions** is the UI equivalent of `GRANT` / `SHOW GRANTS`.',
        'Sample data answers "what does this column really contain?" instantly.',
      ],
    },
    {
      id: 'concept-views',
      type: 'concept',
      title: 'A view is a saved query, not a copy',
      body: 'Alongside tables you will see **views**. A view stores no data at all — only a query. Every time someone reads a view, that query runs against the underlying tables.\n\nSo a view is always current with its sources, costs compute on every read, and disappears into an error if a table it depends on is dropped. Analysts use views constantly to publish "the approved version" of a dataset: the right columns, the right filters, one definition everyone shares.',
      takeaways: [
        'View = stored query. Table = stored rows.',
        'Views are always fresh; you pay to recompute them on each read.',
        'A view is the standard way to publish an approved slice of a table.',
      ],
    },
    {
      id: 'diagram-table-view',
      type: 'diagram',
      title: 'Table or view?',
      spec: {
        kind: 'compare',
        left: {
          label: 'Table',
          sublabel: 'rows are stored',
          tone: 'brand',
          items: [
            'Reads are fast — the data is sitting there',
            'Needs refreshing to stay current',
            'Managed or external decides who owns the files',
          ],
        },
        right: {
          label: 'View',
          sublabel: 'a query is stored',
          tone: 'accent',
          items: [
            'Always reflects the current source data',
            'Recomputed on every single read',
            'Breaks if an underlying table is dropped',
          ],
        },
      },
      caption:
        'Same three-part name, same way to query them. The difference is whether rows or a query definition is stored.',
    },
    {
      id: 'concept-certified',
      type: 'concept',
      title: 'Certified tables: someone stands behind this one',
      body: 'A **certified** data asset carries a badge saying a data steward has reviewed it and vouches for it. In a catalog with 1,200 tables named things like `revenue_v3_final`, certification is how you tell the approved source of truth from someone’s abandoned experiment.\n\nIt is a **human judgement recorded as metadata**, not a technical guarantee: certification does not make a table fresh, correct, or fast. It tells you a person accepted responsibility for it.',
      takeaways: [
        'Certification = a steward vouching for the asset, shown as a badge.',
        'It is metadata and trust, not a technical property of the data.',
        'In search results, prefer certified assets over similarly-named alternatives.',
      ],
    },
    {
      id: 'concept-lineage',
      type: 'concept',
      title: 'Lineage: what fed this, and what drinks from it',
      body: '**Lineage** is the graph of where a table’s data came from and what is built on top of it — captured automatically as queries run, down to **column level**, and covering dashboards, notebooks, and jobs as well as tables.\n\nTwo questions it answers daily. *Upstream:* "this number looks wrong — which table does it actually come from?" *Downstream:* "if I change this column, whose dashboard breaks?"',
      takeaways: [
        'Captured automatically from executed queries — nobody maintains it by hand.',
        'Upstream = sources. Downstream = dependants, including dashboards.',
        'Column-level lineage traces a single suspicious field to its origin.',
      ],
    },
    {
      id: 'mistake-view-copy',
      type: 'mistake',
      title: '"I made a view, so the data is safe from changes"',
      myth: '"I created a view of the table, so my report has its own stable copy of the data."',
      reality:
        'A view holds **no data**. It re-runs its query every time, against whatever the source contains *now* — so yesterday’s numbers can change under your report, and dropping the source table breaks the view outright.\n\nIf you genuinely need stored results, that is a table — or one of the self-refreshing objects you meet in the querying module — not a view.',
    },
    {
      id: 'mcq-explorer',
      type: 'mcq',
      question:
        'An analyst must confirm whether `main.finance.revenue_daily` is a managed or an external table, and find out which dashboards would break if a column were renamed. Where do they look?',
      options: [
        {
          id: 'a',
          text: 'The table’s **Details** tab in Catalog Explorer for managed vs external, and its **Lineage** tab for downstream dashboards.',
        },
        {
          id: 'b',
          text: 'The query history, which records the table type and every dependent dashboard.',
        },
        {
          id: 'c',
          text: 'The SQL warehouse monitoring page.',
        },
        {
          id: 'd',
          text: 'They must ask the table owner — neither fact is recorded in the platform.',
        },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'Details carries the table type, owner, and location; Lineage shows downstream dashboards, notebooks, and tables.',
        b: 'Query history records executions and their metrics, not object metadata or dependency graphs.',
        c: 'Warehouse monitoring covers compute, not data assets.',
        d: 'Both facts are recorded automatically — that is the point of Catalog Explorer and lineage.',
      },
      explanation:
        'Catalog Explorer is the single place for object metadata: **Details** for managed vs external, **Permissions** for access, and **Lineage** for what a change would break.',
      examObjective:
        'Understand catalogs, schemas, managed and external tables, access controls, views, certified tables, and lineage within the Catalog Explorer interface.',
    },
    {
      id: 'flash-lineage',
      type: 'flashcard',
      front: 'Upstream lineage and downstream lineage — what question does each answer?',
      back: '**Upstream:** where did this data come from? **Downstream:** what would break if I changed it — which tables, dashboards, and notebooks depend on it?',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You can now inspect any data asset',
      points: [
        'Catalog Explorer browses everything Unity Catalog governs, filtered to your permissions.',
        'A table’s **Details** tab reveals managed vs external, owner, and location.',
        'A **view** stores a query, not rows — always fresh, recomputed per read.',
        '**Certified** means a steward vouches for the asset; it is trust metadata, not a guarantee.',
        '**Lineage** is captured automatically: upstream sources, downstream dependants, column level.',
      ],
      closing:
        'Next module: using all this to find data you can actually trust — and cleaning it when you cannot. 🧹',
    },
  ],
}
