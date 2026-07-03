import type { Lesson } from '@/types/content'

/**
 * Lesson: access control — GRANT, REVOKE, DENY, principals, and the hierarchy.
 * Maps to exam Section 7 (configure access controls using the UI and SQL by
 * applying GRANT, REVOKE, and DENY privileges to principals at appropriate
 * levels of the security hierarchy).
 */
export const accessControlLesson: Lesson = {
  id: 'access-control',
  title: 'GRANT, REVOKE, DENY & the privilege hierarchy',
  summary:
    'Principals, privileges, and inheritance: giving the right people the right access at the right level — and taking it away cleanly.',
  estimatedMinutes: 10,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'The intern and the salary table',
      body: 'A new intern, added to the “Analytics” group on day one, runs `SELECT * FROM hr.compensation.salaries` — and it *works*. Someone once granted broad access at the catalog level “temporarily,” and it inherited down to every table, including that one.\n\nAccess control is not about whether you *can* restrict data — it is about understanding **where** a permission granted becomes permissions everywhere below.',
      atWork:
        '“Who can read this table, and why?” should always be answerable. Inheritance is usually the surprising part of the answer.',
    },
    {
      id: 'analogy-keycards',
      type: 'analogy',
      title: 'Keycards for a building',
      body: 'Office access works in levels: a card for the **building**, the **floor**, or a single **room**. Give someone building-level access and every floor and room inside opens too.\n\nUnity Catalog privileges work the same way: grants at a **catalog** flow down to its schemas and their tables. The higher you grant, the more doors you just opened — now and for every room built later.',
      mapping: [
        { from: 'Building card', to: 'Privilege on a catalog' },
        { from: 'Floor card', to: 'Privilege on a schema' },
        { from: 'Room card', to: 'Privilege on a single table/view' },
      ],
    },
    {
      id: 'concept-hierarchy',
      type: 'concept',
      title: 'The securable hierarchy and inheritance',
      body: 'Securables nest: **metastore → catalog → schema → table/view/volume/function**. A privilege granted on a container applies to everything inside it — including objects created *after* the grant.\n\nOne practical wrinkle: to touch a table, a principal also needs **`USE CATALOG`** and **`USE SCHEMA`** on its containers — the right to walk through the building to reach the room.',
      takeaways: [
        'Grants inherit downward through the hierarchy.',
        'USE CATALOG / USE SCHEMA are prerequisites to reach any table.',
        'Grant at the level that matches the intent — no broader.',
      ],
    },
    {
      id: 'diagram-hierarchy',
      type: 'diagram',
      title: 'Where a grant lands, everything below inherits',
      spec: {
        kind: 'layers',
        layers: [
          { label: 'Metastore', sublabel: 'one per region — top of the hierarchy', tone: 'neutral' },
          { label: 'Catalog', sublabel: 'GRANT here → all schemas below', tone: 'brand' },
          { label: 'Schema', sublabel: 'GRANT here → all tables below', tone: 'accent' },
          { label: 'Table / view / volume', sublabel: 'the most precise grant', tone: 'good' },
        ],
      },
      caption: 'Inheritance flows inward/downward. Precision beats convenience for sensitive data.',
    },
    {
      id: 'concept-principals',
      type: 'concept',
      title: 'Principals: who receives access',
      body: 'Three kinds of identity can hold privileges:\n\n• **Users** — humans.\n• **Groups** — collections of users (and other groups). Grant to groups, manage membership — access management becomes an HR process instead of SQL.\n• **Service principals** — identities for automation: jobs, CI/CD, external tools. Pipelines should run as service principals, never as “whoever created the job.”',
      takeaways: [
        'Grant to **groups**, not individuals — people change teams.',
        'Automation runs as **service principals**.',
      ],
    },
    {
      id: 'example-grants',
      type: 'example',
      title: 'The three verbs in SQL',
      intro: 'Everything here also has a Catalog Explorer UI equivalent:',
      code: {
        language: 'sql',
        content:
          "GRANT USE CATALOG ON CATALOG sales TO `analysts`;\nGRANT USE SCHEMA ON SCHEMA sales.reporting TO `analysts`;\nGRANT SELECT ON SCHEMA sales.reporting TO `analysts`;  -- all tables, incl. future\n\nREVOKE SELECT ON SCHEMA sales.reporting FROM `analysts`;\n\n-- DENY: an explicit block that wins over any inherited GRANT\nDENY SELECT ON TABLE sales.reporting.salaries TO `analysts`;\n\nSHOW GRANTS ON SCHEMA sales.reporting;  -- audit who has what",
      },
      explanation:
        '`REVOKE` removes a grant that exists; `DENY` actively **blocks**, overriding anything inherited from above — the tool for “everyone except this table.”',
    },
    {
      id: 'mistake-revoke-deny',
      type: 'mistake',
      title: 'REVOKE vs DENY confusion',
      myth: '“The group inherited SELECT from the catalog, so I’ll REVOKE SELECT on the salaries table to block them.”',
      reality:
        'You cannot revoke what was never granted *at that level* — the table-level REVOKE does nothing, and the inherited catalog-level access still applies. To override an inherited privilege on one object, use **DENY**, which always wins. (Better still: don’t grant that broadly at the catalog level to begin with.)',
    },
    {
      id: 'mcq-grants',
      type: 'mcq',
      question:
        'The analytics group needs to query every current and future table in the schema `sales.reporting` — and nothing else in the `sales` catalog. Which grant set is correct?',
      options: [
        { id: 'a', text: 'GRANT SELECT ON CATALOG sales — simplest and covers the schema too.' },
        { id: 'b', text: 'GRANT USE CATALOG ON sales + USE SCHEMA and SELECT ON sales.reporting, to the group.' },
        { id: 'c', text: 'GRANT SELECT on each existing table in sales.reporting to each analyst individually.' },
        { id: 'd', text: 'Make every analyst the owner of the schema.' },
      ],
      correct: ['b'],
      optionFeedback: {
        a: 'Catalog-level SELECT leaks every other schema in the catalog — the intern-and-salaries story.',
        b: 'USE on the containers to reach it, SELECT at schema level so future tables are included — scoped exactly to the requirement.',
        c: 'Misses future tables and future analysts — a maintenance treadmill.',
        d: 'Ownership grants full control (including drops) — infinitely more than “query”.',
      },
      explanation:
        'Grant at the level matching the sentence: “everything in this schema” → schema-level SELECT, plus the USE privileges to get there. To a **group**.',
      examObjective:
        'Configure access controls using the UI and SQL by applying GRANT, REVOKE, and DENY privileges to principals (users, groups, service principals) at appropriate levels of the security hierarchy.',
    },
    {
      id: 'tf-inherit',
      type: 'truefalse',
      statement:
        'A table created next month in a schema will automatically be readable by a group that was granted SELECT on that schema today.',
      answer: true,
      explanation:
        'Container-level grants cover **future** objects too — that is inheritance’s convenience and its risk. It is why sensitive tables belong in their own tightly-granted schema.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You now hand out keys deliberately',
      points: [
        'Hierarchy: metastore → catalog → schema → table; grants inherit down.',
        'USE CATALOG / USE SCHEMA are the corridors to any table.',
        'Grant to groups; run automation as service principals.',
        'REVOKE removes a grant; DENY overrides inheritance.',
      ],
      closing: 'Last stop: hiding *parts* of tables — rows and columns. 🎭',
    },
  ],
}
