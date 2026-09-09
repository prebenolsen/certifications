import type { Lesson } from '@/types/content'

/**
 * Lesson: discovering trustworthy data and tagging assets.
 * Maps to exam Section 2 (use Unity Catalog to discover, query, and manage
 * certified datasets; use the Catalog Explorer to tag a data asset and view
 * its lineage).
 */
export const discoverCertifiedLesson: Lesson = {
  id: 'discover-certified',
  title: 'Finding data you can trust',
  summary:
    'Search across a governed estate, read the signals that separate an approved dataset from an abandoned one, and tag assets so the next person finds them faster.',
  estimatedMinutes: 9,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'Four tables called revenue',
      body: 'Search for "revenue" and you get `revenue`, `revenue_v2`, `revenue_final`, and `finance_revenue_daily`. Three are somebody’s abandoned experiment. One is what the CFO’s number comes from.\n\nPicking wrong is not a small mistake — it is a board deck with numbers nobody else can reproduce. Unity Catalog records the signals that tell them apart.',
      atWork:
        'Rebuilding a metric because you could not find the approved table is one of the most common wasted weeks in analytics.',
    },
    {
      id: 'concept-search',
      type: 'concept',
      title: 'Search knows more than table names',
      body: 'Workspace search looks across **table names, column names, and the comments attached to them** — so "customer churn" can find a table whose name says nothing of the sort but whose description does.\n\nResults are **permission-filtered**: you only see assets you are allowed to see. An empty result can mean the data does not exist *or* that nobody has granted you access to it — worth checking before concluding it was never built.',
      takeaways: [
        'Search covers names, columns, and comments — descriptions pay off.',
        'Results are filtered to your permissions.',
        '"Not found" sometimes means "not granted".',
      ],
    },
    {
      id: 'concept-signals',
      type: 'concept',
      title: 'The four signals that separate real from abandoned',
      body: 'Before building on a table, read its page for four things:\n\n• **Certified** — a steward has reviewed it and vouches for it.\n• **Owner** — a named team beats a departed individual.\n• **Description and tags** — someone documented it, which means someone cares.\n• **Lineage** — what feeds it, and who already depends on it. A table with twelve downstream dashboards is load-bearing; one with none may be a leftover.',
      takeaways: [
        'Certification is the strongest signal, but it is a human judgement, not a guarantee.',
        'Heavy downstream lineage = a table the business already trusts.',
        'No owner, no description, no dependants: treat with suspicion.',
      ],
    },
    {
      id: 'concept-tags',
      type: 'concept',
      title: 'Tags: labels that make the estate searchable',
      body: 'A **tag** is a key-value label you attach to a catalog, schema, table, or **column** — `domain=finance`, `certified=true`, `pii=email`.\n\nTags do two jobs. They make assets findable by *category* rather than by remembered name, and they drive governance: tagging a column `pii=email` is what lets a policy mask that column everywhere it appears. Applying one needs the **`APPLY TAG`** privilege on the object.',
      takeaways: [
        'Tags are key-value pairs on any securable, down to a single column.',
        'They power both discovery and PII-classification policies.',
        'Adding one requires the `APPLY TAG` privilege.',
      ],
    },
    {
      id: 'example-tagging',
      type: 'example',
      title: 'Documenting a table so the next person finds it',
      intro:
        'Everything here has a Catalog Explorer equivalent — the UI writes the same statements:',
      code: {
        language: 'sql',
        content:
          "COMMENT ON TABLE main.finance.revenue_daily IS\n  'Certified daily revenue by store. Source of truth for finance dashboards.';\n\nALTER TABLE main.finance.revenue_daily\n  SET TAGS ('domain' = 'finance', 'certified' = 'true');\n\n-- Tag a single column so masking policies can find it\nALTER TABLE main.crm.customers\n  ALTER COLUMN email SET TAGS ('pii' = 'email');",
      },
      explanation:
        'The comment answers "what is this and can I trust it?" in search results. The table tags make it findable by domain. The **column** tag is the one governance teams care about: it marks the field as PII wherever it travels.',
    },
    {
      id: 'mistake-name',
      type: 'mistake',
      title: 'Choosing a table by its name',
      myth: '"`revenue_final` sounds like the finished one — I will use that."',
      reality:
        'File names lie, and `_final` is the least reliable word in any data estate. The dependable signals are recorded in the catalog: is it **certified**, who **owns** it, what does its **lineage** show feeding it, and how many dashboards already read it.\n\nCheck those four and the naming stops mattering.',
    },
    {
      id: 'tf-search',
      type: 'truefalse',
      statement:
        'If a search returns no results, the dataset definitely does not exist in the metastore.',
      answer: false,
      explanation:
        'Search is **permission-filtered**. A table you have no privileges on simply does not appear for you — so "no results" can mean it exists and you have not been granted access to it.',
    },
    {
      id: 'mcq-tag-lineage',
      type: 'mcq',
      question:
        'A governance team wants every column holding email addresses labelled so that a masking policy can find them, and wants to know which dashboards would be affected before applying it. What should they do in Catalog Explorer?',
      options: [
        {
          id: 'a',
          text: 'Tag the columns (e.g. `pii = email`) and check each table’s Lineage tab for downstream dashboards.',
        },
        {
          id: 'b',
          text: 'Rename the columns to include "pii" so they can be found by searching.',
        },
        {
          id: 'c',
          text: 'Add a comment on each table describing the sensitivity, which automatically applies masking.',
        },
        {
          id: 'd',
          text: 'Drop and recreate the tables with the sensitive columns removed.',
        },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'Column tags are the machine-readable classification policies act on, and lineage shows what a change would affect before you make it.',
        b: 'Renaming columns breaks every query that uses them and still gives policies nothing to match on.',
        c: 'Comments are for humans; they document sensitivity but enforce nothing.',
        d: 'Deleting the data destroys legitimate analysis — masking exists precisely to avoid this.',
      },
      explanation:
        'Tagging classifies (**`APPLY TAG`** on the column) and lineage predicts impact. Between them you can label sensitive data across the estate and know what depends on it before changing anything.',
      examObjective:
        'Use the Catalog Explorer to tag a data asset and view its lineage.',
    },
    {
      id: 'flash-certified',
      type: 'flashcard',
      front: 'What does it mean when a data asset is marked **certified**?',
      back: 'A data steward has reviewed it and vouches for it. It is recorded trust — a human judgement in metadata — not a technical guarantee of freshness or correctness.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You can now find the right table',
      points: [
        'Search spans names, columns, and comments — and is filtered to your permissions.',
        'Judge a table by four signals: certified, owner, description/tags, lineage.',
        'Tags are key-value labels on any securable, including single columns.',
        'Column tags drive PII policies; applying one needs `APPLY TAG`.',
        'Lineage tells you who depends on a table before you change it.',
      ],
      closing:
        'Found a trustworthy table with messy values in it? That is the next lesson. 🧽',
    },
  ],
}
