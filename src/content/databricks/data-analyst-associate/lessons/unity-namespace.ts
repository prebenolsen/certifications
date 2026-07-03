import type { Lesson } from '@/types/content'

/**
 * Lesson: The Unity Catalog 3-level namespace + managed vs external tables.
 * Maps to exam Section 1 (catalogs/schemas/tables) and Section 9 (3-level
 * namespace). Also directly answers sample questions 6 & 9.
 */
export const unityNamespaceLesson: Lesson = {
  id: 'unity-namespace',
  title: 'Where does your data live? The 3-level namespace',
  summary:
    'Catalogs, schemas, tables — and why every table has a three-part name. Plus the managed vs external distinction the exam loves to test.',
  estimatedMinutes: 9,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'A tale of two "orders" tables',
      body: 'Your company has a `sales` team and a `marketing` team. Both create a table called `orders`. In an old-school database this is a headache — names collide, and you need clever prefixes like `sales_orders` to keep them apart.\n\nUnity Catalog solves this with a simple idea: give every table a **full address**, not just a name.',
      atWork:
        'When a colleague says "query the orders table," your first question should be: *which* orders table? The full address removes all doubt.',
    },
    {
      id: 'analogy-address',
      type: 'analogy',
      title: 'A table address is like a postal address',
      body: 'You would never mail a letter to just "Apartment 4". You need **City → Street → Apartment**. Unity Catalog works the same way: to find a table you go **Catalog → Schema → Table**.',
      mapping: [
        { from: 'City', to: 'Catalog (the biggest container)' },
        { from: 'Street', to: 'Schema (a group of related tables)' },
        { from: 'Apartment', to: 'Table (the actual data)' },
      ],
    },
    {
      id: 'concept-namespace',
      type: 'concept',
      title: 'The three-level namespace',
      body: 'Every table in Unity Catalog is addressed with **three parts** separated by dots:\n\n`catalog.schema.table`\n\nThe **catalog** is the top-level container (often one per environment or business unit). Inside it are **schemas** (also called databases) that group related tables. Inside those are the **tables** and **views** themselves.',
      takeaways: [
        'The full name is `catalog.schema.table` — three levels, always.',
        'A **schema** and a **database** mean the same thing in Databricks.',
        'This is why two `orders` tables can coexist: `sales.orders` ≠ `marketing.orders`.',
      ],
    },
    {
      id: 'diagram-namespace',
      type: 'diagram',
      title: 'One catalog, many schemas, many tables',
      diagramId: 'unity-namespace',
      caption:
        'The catalog `main` contains schemas `sales` and `marketing`. Volumes live at the schema level too — they hold non-tabular files.',
    },
    {
      id: 'tf-namespace',
      type: 'truefalse',
      statement:
        'To fully qualify a table you only need `schema.table` in Unity Catalog.',
      answer: false,
      explanation:
        'Unity Catalog uses **three** levels: `catalog.schema.table`. The two-part `schema.table` form was the norm in the older Hive metastore. If you omit the catalog, Databricks fills in your *current* catalog for you — which can point you at the wrong table.',
    },
    {
      id: 'concept-managed-external',
      type: 'concept',
      title: 'Two kinds of tables: managed vs external',
      body: "Both kinds show up in Unity Catalog and you query them the same way. The difference is **who owns the underlying data files**.\n\nA **managed table**: Databricks controls the storage. It decides where the files live and manages their lifecycle.\n\nAn **external table**: *you* point Databricks at a storage location you control (for example, your own S3 bucket). Databricks just keeps a pointer to it.",
      takeaways: [
        'Managed = Databricks owns the data files.',
        'External = you own the files; Databricks stores a pointer.',
        'You query both exactly the same way — the difference is ownership.',
      ],
    },
    {
      id: 'diagram-managed-external',
      type: 'diagram',
      title: 'What DROP TABLE deletes',
      diagramId: 'managed-vs-external',
      caption:
        'The critical difference: dropping a **managed** table deletes its data files. Dropping an **external** table removes only the catalog entry — your files stay put.',
    },
    {
      id: 'mistake-drop',
      type: 'mistake',
      title: 'A dangerous assumption about DROP TABLE',
      myth: '"`DROP TABLE` always deletes the data, so my files are gone forever."',
      reality:
        'Only for **managed** tables. For an **external** table, `DROP TABLE` deletes just the metadata — the actual files in your storage are untouched, so you can re-create the table over them. This is exactly what sample Question 9 tests.',
    },
    {
      id: 'example-create',
      type: 'example',
      title: 'Creating a table the exam way',
      intro:
        'Sample Question 6 asks: create an empty table, and if it already exists, replace it **while keeping its privileges and history**. The right tool is `CREATE OR REPLACE`:',
      code: {
        language: 'sql',
        content:
          'CREATE OR REPLACE TABLE warehouse_db.product_inventory (\n  width  INT,\n  length INT,\n  height INT\n);',
      },
      explanation:
        '`CREATE OR REPLACE` swaps the definition in place — so grants (privileges) and Delta history survive. Contrast that with `DROP TABLE` then `CREATE TABLE`, which throws away privileges and history. And `IF NOT EXISTS` would *skip* creation if the table already exists, so it can never replace anything.',
    },
    {
      id: 'mcq-namespace',
      type: 'mcq',
      question:
        'A `DROP TABLE IF EXISTS customer_orders;` runs successfully. Ten days later `SHOW TABLES` no longer lists it, yet the data files still sit untouched in storage. What best explains this?',
      options: [
        { id: 'a', text: 'It was a managed table with automatic cleanup disabled.' },
        { id: 'b', text: 'It was an external table referencing data in a separate storage location.' },
        { id: 'c', text: 'The table exceeded a 10 GB threshold for auto-deletion.' },
        { id: 'd', text: 'The table was created without a default storage location.' },
      ],
      correct: ['b'],
      optionFeedback: {
        b: 'External tables only store a pointer, so DROP removes the catalog entry but never the files.',
        a: 'Managed tables delete their files on DROP — there is no "cleanup disabled" flag that keeps them.',
        c: 'There is no size threshold that governs file deletion.',
        d: 'A missing default location would not preserve files after a DROP.',
      },
      explanation:
        'Because the files survived the DROP, the table must have been **external** — Databricks never owned those files, so it only removed the metadata pointer.',
      examObjective:
        'Understand catalogs, schemas, managed and external tables, access controls, views, certified tables, and lineage.',
    },
    {
      id: 'flash-namespace',
      type: 'flashcard',
      front: 'What are the three parts of a Unity Catalog table name, in order?',
      back: '`catalog.schema.table` — biggest container to smallest. (Schema and database are the same thing.)',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You now understand where data lives',
      points: [
        'Every table has a three-part address: `catalog.schema.table`.',
        'Schemas group tables; catalogs group schemas.',
        'Managed tables: Databricks owns the files (DROP deletes them).',
        'External tables: you own the files (DROP keeps them).',
        'Use `CREATE OR REPLACE` to redefine a table while keeping grants and history.',
      ],
      closing:
        'Next up: once you can find your data, you need to *ask questions of it* — that means aggregations. 📊',
    },
  ],
}
