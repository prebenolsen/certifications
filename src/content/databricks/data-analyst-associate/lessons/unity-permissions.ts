import type { Lesson } from '@/types/content'

/**
 * Lesson: securing workspace objects with Unity Catalog roles and sharing.
 * Maps to exam Section 9 (use Unity Catalog roles and sharing settings to
 * ensure workspace objects are secure). Builds on the privilege model taught in
 * "Unity Catalog: the layer everything else assumes" — here it is applied to the
 * objects an analyst creates and shares.
 */
export const unityPermissionsLesson: Lesson = {
  id: 'unity-permissions',
  title: 'Roles, grants & sharing settings',
  summary:
    'Who receives access, the levels you can give on dashboards, queries and warehouses, how to take access away — and checking what you have actually granted.',
  estimatedMinutes: 10,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'The intern and the salary table',
      body: 'A new intern joins the Analytics group on Monday and, out of curiosity, queries `hr.people.salaries`. It works.\n\nMonths earlier someone granted the group `SELECT` at the **catalog** level "temporarily" so a project would not be blocked. That grant inherited down to every schema and table underneath it, including the one nobody meant to share.\n\nSecuring things is rarely about locking down. It is about granting at the right level in the first place.',
      atWork:
        '"Who can read this?" should always be answerable in one query. If it is not, the grants are too broad.',
    },
    {
      id: 'concept-principals',
      type: 'concept',
      title: 'Three kinds of identity',
      body: 'Access is granted to **principals**, and there are three:\n\n• **Users** — individual people.\n• **Groups** — collections of users (and other groups). Grant here by default: membership changes then belong to whoever runs joiners and leavers, not to you.\n• **Service principals** — identities for automation: a scheduled dashboard refresh, a pipeline, an external tool.\n\nGranting to individuals is how permissions rot. The person changes team, keeps the access, and nobody remembers why they had it.',
      takeaways: [
        'Users, groups, and service principals can all hold access.',
        'Grant to **groups** so access follows team membership.',
        'Automation should run as a **service principal**, not a person’s account.',
      ],
    },
    {
      id: 'concept-two-planes',
      type: 'concept',
      title: 'Two things to secure: the data and the object',
      body: 'An analyst deals with two separate permission systems, and confusing them is the classic mistake.\n\n**Data** in Unity Catalog is secured with SQL privileges — `SELECT` on a table, plus `USE CATALOG` and `USE SCHEMA` to reach it.\n\n**Workspace objects** — dashboards, queries, alerts, notebooks, SQL warehouses, Genie spaces — are secured with **access levels** in their Share dialog: typically CAN VIEW, CAN RUN, CAN EDIT, CAN MANAGE.\n\nSomeone can hold CAN VIEW on a dashboard and still see nothing, because they lack `SELECT` on the tables behind it.',
      takeaways: [
        'Data grants: `SELECT`, `USE CATALOG`, `USE SCHEMA`.',
        'Object levels: CAN VIEW / CAN RUN / CAN EDIT / CAN MANAGE.',
        'Access to an object is not access to the data inside it.',
      ],
    },
    {
      id: 'diagram-levels',
      type: 'diagram',
      title: 'Two permission systems, one user',
      spec: {
        kind: 'compare',
        left: {
          label: 'Unity Catalog privileges',
          sublabel: 'the data itself',
          tone: 'brand',
          items: [
            '`SELECT` on tables and views',
            '`USE CATALOG` / `USE SCHEMA` to traverse',
            'Inherited downwards, to future objects too',
          ],
        },
        right: {
          label: 'Workspace object ACLs',
          sublabel: 'the things you build',
          tone: 'accent',
          items: [
            'Dashboards, queries, alerts, warehouses, Genie spaces',
            'CAN VIEW · CAN RUN · CAN EDIT · CAN MANAGE',
            'Granted in the object’s Share dialog',
          ],
        },
      },
      caption:
        'A viewer usually needs both: permission to open the dashboard, and permission to read the data behind it.',
    },
    {
      id: 'concept-least-privilege',
      type: 'concept',
      title: 'Grant at the level that matches the intent',
      body: 'Because grants **inherit downwards**, the level you choose is the real decision. `GRANT SELECT ON SCHEMA sales.reporting` is right for "this team owns this domain" — including tables created next month. The same grant on the whole `sales` catalog quietly hands over every schema in it, forever.\n\nThe practical rule: grant on a **schema** for a team’s working area, on a **table** for anything sensitive, and keep genuinely sensitive data in its own schema so a broad grant cannot reach it by accident.',
      takeaways: [
        'Schema-level grants cover current and future tables — convenient and risky.',
        'Sensitive tables belong in their own tightly-granted schema.',
        'Give the smallest level that lets the person do their job.',
      ],
    },
    {
      id: 'example-manage',
      type: 'example',
      title: 'Granting, checking, and taking away',
      intro: 'The three statements that cover most of an analyst’s governance work:',
      code: {
        language: 'sql',
        content:
          "-- Give a team read access to a working area\nGRANT USE CATALOG ON CATALOG sales TO `analysts`;\nGRANT USE SCHEMA  ON SCHEMA  sales.reporting TO `analysts`;\nGRANT SELECT      ON SCHEMA  sales.reporting TO `analysts`;\n\n-- Audit: who has what, right now?\nSHOW GRANTS ON SCHEMA sales.reporting;\n\n-- Remove an access that should never have been granted\nREVOKE SELECT ON CATALOG sales FROM `analysts`;",
      },
      explanation:
        '`SHOW GRANTS` is the one to remember: it answers "who can read this?" directly, and it is how you find the over-broad catalog-level grant that let the intern into the salary table.',
    },
    {
      id: 'concept-ownership-sharing',
      type: 'concept',
      title: 'Ownership, and sharing beyond the workspace',
      body: 'Every object has an **owner** — by default whoever created it — who can grant, revoke, alter, and transfer ownership. Objects owned by a person who leaves become somebody’s problem, so transfer ownership of shared assets to a **group**.\n\nSharing settings reach further out too: a dashboard can be shared with people who have no workspace access, and **Delta Sharing** exposes tables to other organisations entirely. Both are deliberate acts — check what a share contains before it leaves the building.',
      takeaways: [
        'The creator owns the object; move ownership of shared assets to a group.',
        'Dashboards can reach account users without workspace access.',
        'Delta Sharing sends data outside the organisation — review before sharing.',
      ],
    },
    {
      id: 'mistake-revoke',
      type: 'mistake',
      title: 'Revoking something that was never granted there',
      myth: '"The group inherited SELECT from the catalog, so I will REVOKE SELECT on that one table to block them."',
      reality:
        'You cannot revoke a grant that does not exist at that level. The table-level `REVOKE` does nothing, the inherited catalog-level access still applies, and everyone believes the problem is fixed.\n\nFix it where it was granted — revoke at the catalog and re-grant narrowly — or, for a single object exception, use a `DENY`, which overrides what was inherited.',
    },
    {
      id: 'mcq-permissions',
      type: 'mcq',
      question:
        'The analytics group must query every current and future table in `sales.reporting`, and nothing else in the `sales` catalog. Which set of grants is correct?',
      options: [
        {
          id: 'a',
          text: 'USE CATALOG on `sales`, plus USE SCHEMA and SELECT on `sales.reporting`, granted to the group.',
        },
        {
          id: 'b',
          text: 'SELECT on the `sales` catalog — simplest, and it covers the schema too.',
        },
        {
          id: 'c',
          text: 'SELECT on each existing table in `sales.reporting`, granted to each analyst individually.',
        },
        {
          id: 'd',
          text: 'Make every analyst an owner of the `sales.reporting` schema.',
        },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'Traversal on the catalog, and SELECT at schema level so future tables are included — scoped exactly to the requirement.',
        b: 'Catalog-level SELECT leaks every other schema in the catalog: the intern-and-salaries story.',
        c: 'Per-table, per-person grants miss future tables and future analysts, and become unmaintainable.',
        d: 'Ownership confers far more than reading, including the right to drop the objects.',
      },
      explanation:
        'Grant at the level that matches the sentence: "everything in this schema" → **schema-level `SELECT`**, plus the `USE` privileges needed to reach it — and always to a **group**.',
      examObjective:
        'Use Unity Catalog roles and sharing settings to ensure workspace objects are secure.',
    },
    {
      id: 'tf-object-vs-data',
      type: 'truefalse',
      statement:
        'Giving someone CAN VIEW on a dashboard is enough for them to see its data in every case.',
      answer: false,
      explanation:
        'Not when the dashboard runs with each viewer’s own permissions — then they also need `SELECT` on the underlying tables. Only a dashboard published with the **publisher’s credentials** shows data without the viewer holding their own grants.',
    },
    {
      id: 'flash-show-grants',
      type: 'flashcard',
      front: 'Which command answers "who currently has access to this schema?"',
      back: '`SHOW GRANTS ON SCHEMA catalog.schema` — it lists the principals and privileges, which is how you find over-broad grants.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You can now secure what you build',
      points: [
        'Grant to **groups**; run automation as **service principals**.',
        'Two systems: Unity Catalog privileges for data, object ACLs for dashboards and queries.',
        'Grants inherit downwards — choose the level deliberately.',
        '`SHOW GRANTS` audits, `REVOKE` removes, `DENY` overrides an inherited grant.',
        'Transfer ownership of shared assets to a group, not a person.',
      ],
      closing:
        'One last topic: the data that needs more than a grant to keep it safe. 🕵️',
    },
  ],
}
