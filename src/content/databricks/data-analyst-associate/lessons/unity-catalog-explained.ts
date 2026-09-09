import type { Lesson } from '@/types/content'

/**
 * Lesson: what Unity Catalog is and how its governance model works.
 * Maps to exam Section 1 (Unity Catalog as a core component; access controls)
 * and Section 9 (roles and sharing settings; the 3-level namespace).
 *
 * The thorough breakdown. Unity Catalog is named in five of the nine exam
 * sections, and every later lesson assumes it — so it is taught properly here,
 * before the namespace mechanics in the next lesson.
 * Research: src_material/.../research/platform-and-naming.md
 */
export const unityCatalogExplainedLesson: Lesson = {
  id: 'unity-catalog-explained',
  title: 'Unity Catalog: the layer everything else assumes',
  summary:
    'One governance layer over every workspace: what it holds, who owns what, the three privileges it takes to read a table, and the lineage and audit you get for free.',
  estimatedMinutes: 11,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'Nobody could answer "who can read the salary table?"',
      body: 'Before a central catalog, each workspace kept its own permissions. Finance had one, marketing had another, the data science team a third — and the same customer table was registered separately in all of them, with different access rules.\n\nWhen the auditor asked who could read customer emails, the honest answer was: *we would have to check three systems and hope.*',
      atWork:
        'Unity Catalog is named in five of the nine exam sections. Nothing else in this certification makes sense without it.',
    },
    {
      id: 'concept-what',
      type: 'concept',
      title: 'What Unity Catalog is',
      body: '**Unity Catalog is the governance layer for the whole platform** — one place that names, secures, and tracks every table, view, volume, function, and model, across *all* of your company’s workspaces.\n\nIt is not a storage system and not a query engine. It is the answer to four questions that used to be answered per workspace: what data exists, who may use it, where it came from, and who touched it.',
      takeaways: [
        'One governance layer, shared by every workspace in the account.',
        'It governs data **and** AI assets — tables, views, volumes, functions, models.',
        'Not storage, not compute: naming, permissions, lineage, and audit.',
      ],
    },
    {
      id: 'analogy-library',
      type: 'analogy',
      title: 'The catalogue and the membership desk',
      body: 'A library needs two things that have nothing to do with the shelves: a **catalogue** saying what exists and where, and a **membership desk** deciding who may borrow what.\n\nUnity Catalog is both, for your data. The files on cloud storage are the shelves — Unity Catalog is what makes them findable and what stops the wrong person walking out with them.',
      mapping: [
        { from: 'The catalogue of holdings', to: 'Catalogs, schemas, and the objects inside them' },
        { from: 'The membership desk', to: 'Grants: who may read or change each object' },
        { from: 'The borrowing record', to: 'Lineage and audit logs' },
      ],
    },
    {
      id: 'concept-hierarchy',
      type: 'concept',
      title: 'What it holds, from the top down',
      body: 'Unity Catalog nests four levels:\n\n• **Metastore** — the top container, one per region, shared by the workspaces attached to it.\n• **Catalog** — the first level of the data path. Usually one per environment or business domain.\n• **Schema** — a group of related objects. *Schema* and *database* mean the same thing here.\n• **Objects** — **tables**, **views**, **volumes** (folders of non-tabular files like PDFs or images), **functions**, and **models**.\n\nThat middle path — catalog, schema, object — is how you address a table, which the next lesson covers properly.',
      takeaways: [
        'Metastore ⊃ catalog ⊃ schema ⊃ table / view / volume / function / model.',
        'A **volume** is how non-tabular files get governed like tables.',
        'One metastore can serve many workspaces — that is the point.',
      ],
    },
    {
      id: 'diagram-hierarchy',
      type: 'diagram',
      title: 'The containers, outermost first',
      spec: {
        kind: 'layers',
        layers: [
          {
            label: 'Metastore',
            sublabel: 'one per region · shared by many workspaces',
            tone: 'neutral',
          },
          {
            label: 'Catalog',
            sublabel: 'per environment or business domain',
            tone: 'brand',
          },
          {
            label: 'Schema',
            sublabel: 'a group of related objects (= database)',
            tone: 'accent',
          },
          {
            label: 'Table · view · volume · function · model',
            sublabel: 'the things you actually query',
            tone: 'good',
          },
        ],
      },
      caption:
        'Each level is a **securable object** — something you can grant permissions on. Grants made high up flow downwards.',
    },
    {
      id: 'concept-securable-owner',
      type: 'concept',
      title: 'Securables and owners',
      body: 'A **securable object** is anything you can grant permissions on — a catalog, a schema, a table, a view, a volume, a function.\n\nEvery securable has an **owner**: by default whoever created it. The owner can grant and revoke access to it, alter it, and transfer ownership. In practice ownership should sit with a **group** (the team that maintains the data), not one person who might change jobs.',
      takeaways: [
        'Securable = anything grantable. Owner = who controls it.',
        'The creator becomes the owner unless it is reassigned.',
        'Own data with a **group**, so access survives staff changes.',
      ],
    },
    {
      id: 'concept-privileges',
      type: 'concept',
      title: 'Reading one table takes three grants',
      body: 'This surprises everyone once. To query `sales.reporting.orders` you need:\n\n• **`SELECT`** on the table — permission to read it, and\n• **`USE CATALOG`** on `sales`, and\n• **`USE SCHEMA`** on `sales.reporting`.\n\nThe two `USE` privileges are the right to *walk through* the containers on the way to the object. Without them, a perfectly valid `SELECT` grant still leaves the analyst staring at "table not found".',
      takeaways: [
        '`SELECT` on the object, plus `USE CATALOG` and `USE SCHEMA` on its parents.',
        '`USE` grants traversal, not reading — it reveals nothing on its own.',
        '"Table not found" for one user is usually a missing `USE`, not a missing `SELECT`.',
      ],
    },
    {
      id: 'concept-inheritance',
      type: 'concept',
      title: 'Grants flow downhill — including to tables that do not exist yet',
      body: 'A privilege granted on a container applies to everything inside it. `GRANT SELECT ON SCHEMA sales.reporting` lets the grantee read **every table in that schema, including ones created next month**.\n\nThat is the convenience and the danger. Grant at the level that matches the intent: schema-level for "this team owns this domain", table-level for anything sensitive.',
      takeaways: [
        'Container grants cover current **and future** children.',
        'Grant at the narrowest level that expresses the intent.',
        'Sensitive tables belong in their own tightly-granted schema.',
      ],
    },
    {
      id: 'example-grants',
      type: 'example',
      title: 'Giving a team read access, properly',
      intro: 'Three statements, because there are three levels to pass:',
      code: {
        language: 'sql',
        content:
          "GRANT USE CATALOG ON CATALOG sales TO `analysts`;\nGRANT USE SCHEMA  ON SCHEMA  sales.reporting TO `analysts`;\nGRANT SELECT      ON SCHEMA  sales.reporting TO `analysts`;\n\n-- Who has what, right now:\nSHOW GRANTS ON SCHEMA sales.reporting;",
      },
      explanation:
        'Granting `SELECT` at the **schema** level covers every table in it, now and later — no per-table maintenance. Grant to the **group** `analysts`, never to individuals: joiners and leavers then become an HR change, not a SQL change.',
    },
    {
      id: 'mistake-select-enough',
      type: 'mistake',
      title: 'The grant that looks broken but is not',
      myth: '"I granted SELECT on the table and she still gets an error — the grant must have failed."',
      reality:
        'The grant worked. She cannot **reach** the table: reading needs `USE CATALOG` on the catalog and `USE SCHEMA` on the schema as well.\n\nIt is deliberately this way. Without the `USE` privileges, someone with a stray table grant cannot even discover what else lives in that catalog.',
    },
    {
      id: 'concept-for-free',
      type: 'concept',
      title: 'What else you get, without doing anything',
      body: 'Because every query goes through Unity Catalog, four things come along automatically:\n\n• **Lineage** — which tables and dashboards were built from this one, captured as queries run.\n• **Audit logs** — who ran what, and when.\n• **Discovery** — search across table and column names and their comments, filtered to what you are allowed to see.\n• **Sharing** — the same governance extends outside the company through **Delta Sharing**, an open protocol for letting another organisation query your live tables without copying them.',
      takeaways: [
        'Lineage and audit are automatic, not something you switch on per table.',
        'Search results are permission-filtered: you cannot find what you cannot access.',
      ],
    },
    {
      id: 'tf-inheritance',
      type: 'truefalse',
      statement:
        'A table created next month in a schema will be readable by a group that was granted SELECT on that schema today.',
      answer: true,
      explanation:
        'Container grants cover **current and future** objects. That is what makes schema-level grants low-maintenance — and why a broad grant on a catalog is a standing risk.',
    },
    {
      id: 'mcq-privileges',
      type: 'mcq',
      question:
        'An analyst has been granted `SELECT` on the table `sales.reporting.orders`, but every query returns an error saying the table cannot be found. What is the most likely cause?',
      options: [
        {
          id: 'a',
          text: 'They are missing `USE CATALOG` on `sales` and/or `USE SCHEMA` on `sales.reporting`.',
        },
        {
          id: 'b',
          text: 'SELECT grants only take effect after the table owner restarts the SQL warehouse.',
        },
        {
          id: 'c',
          text: 'They must be made the owner of the table before they can read it.',
        },
        {
          id: 'd',
          text: 'SELECT cannot be granted on a table, only on a schema.',
        },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'Reading a table needs all three: `SELECT` on it, plus `USE CATALOG` and `USE SCHEMA` on the containers above it.',
        b: 'Grants apply immediately; no restart is involved.',
        c: 'Ownership grants far more than reading, and is never required to query a table.',
        d: 'SELECT is grantable at table, schema, or catalog level.',
      },
      explanation:
        'The classic Unity Catalog stumble: the `USE` privileges are the right to traverse the containers. Without them, a valid `SELECT` grant is unusable — and the object looks like it does not exist.',
      examObjective:
        'Use Unity Catalog roles and sharing settings to ensure workspace objects are secure.',
    },
    {
      id: 'flash-three-grants',
      type: 'flashcard',
      front: 'Name the three privileges needed to query `catalog.schema.table`.',
      back: '**`SELECT`** on the table, **`USE CATALOG`** on its catalog, and **`USE SCHEMA`** on its schema.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You now understand the governance layer',
      points: [
        'Unity Catalog names, secures, and tracks every data and AI asset across all workspaces.',
        'Metastore ⊃ catalog ⊃ schema ⊃ table / view / volume / function / model.',
        'Every securable has an **owner**; own data with groups, not people.',
        'Querying a table takes `SELECT` **plus** `USE CATALOG` and `USE SCHEMA`.',
        'Grants inherit downwards, to current *and future* objects.',
        'Lineage, audit, permission-filtered search, and sharing come along automatically.',
      ],
      closing:
        'Now that you know what the containers are for, the next lesson gives every table its address. 📮',
    },
  ],
}
