import type { Lesson } from '@/types/content'

/**
 * Lesson: managed vs external tables in Unity Catalog, and operations on them.
 * Maps to exam Section 7 (differentiate between managed and external tables
 * and perform basic operations — create, modify, delete, convert).
 */
export const managedExternalTablesLesson: Lesson = {
  id: 'managed-external-tables',
  title: 'Managed vs external tables',
  summary:
    'Who owns the files, what DROP really deletes, how to create each kind — and how to convert between them.',
  estimatedMinutes: 9,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'The DROP that didn’t delete (and the one that did)',
      body: 'Two engineers each drop a deprecated table. For the first, the underlying Parquet files vanish with it. For the second, the files sit untouched in an S3 bucket — which is lucky, because a downstream team still needed them.\n\nSame command, opposite outcomes. The difference is one property set at creation time: **managed or external**.',
      atWork:
        'Before dropping any table, know which kind it is — `DESCRIBE EXTENDED` tells you. This is also a guaranteed exam topic.',
    },
    {
      id: 'concept-two-kinds',
      type: 'concept',
      title: 'One difference: who owns the storage',
      body: 'A **managed table**: Unity Catalog controls both the metadata *and* the data files, which live in storage the metastore manages. Drop the table → **files are deleted** too.\n\nAn **external table**: Unity Catalog holds the metadata, but the files live at a **location you specify and own** (`LOCATION \'s3://...\'`). Drop the table → only the catalog entry disappears; **your files stay**.\n\nYou query both identically — the difference is lifecycle, not syntax.',
      takeaways: [
        'Managed = platform owns files; DROP deletes data.',
        'External = you own files at your LOCATION; DROP keeps data.',
        'Queries look identical for both.',
      ],
    },
    {
      id: 'diagram-managed-external',
      type: 'diagram',
      title: 'What DROP TABLE actually removes',
      spec: {
        kind: 'compare',
        left: {
          label: 'Managed table',
          sublabel: 'no LOCATION at creation',
          tone: 'brand',
          items: [
            'Files live in metastore-managed storage',
            'DROP → metadata **and files** deleted',
            'Full platform features (e.g. predictive optimization)',
          ],
        },
        right: {
          label: 'External table',
          sublabel: 'created WITH LOCATION',
          tone: 'accent',
          items: [
            'Files live in *your* bucket/container',
            'DROP → metadata only; **files survive**',
            'For data shared with non-Databricks tools',
          ],
        },
      },
      caption: 'Default to managed; go external when other systems must read the same files.',
    },
    {
      id: 'example-create',
      type: 'example',
      title: 'Create, modify, delete — both kinds',
      intro: 'The LOCATION clause is the entire difference:',
      code: {
        language: 'sql',
        content:
          "-- Managed: no LOCATION\nCREATE TABLE sales.orders (id BIGINT, amount DOUBLE);\n\n-- External: you point at storage you own\nCREATE TABLE sales.orders_ext (id BIGINT, amount DOUBLE)\nLOCATION 's3://my-bucket/tables/orders';\n\n-- Modify either the same way\nALTER TABLE sales.orders ADD COLUMN currency STRING;\n\n-- Delete: same command, different consequences\nDROP TABLE sales.orders;      -- files deleted\nDROP TABLE sales.orders_ext;  -- files remain in your bucket",
      },
      explanation:
        '`DESCRIBE EXTENDED sales.orders` shows `Type: MANAGED` or `EXTERNAL` plus the storage location — check before destructive operations.',
    },
    {
      id: 'concept-convert',
      type: 'concept',
      title: 'Converting between the two',
      body: 'Two routes:\n\n• **`ALTER TABLE ... SET MANAGED`** converts an external table to managed in place (Unity Catalog takes over the files) — the modern, direct path.\n• **Recreate**: `CREATE TABLE new_managed AS SELECT * FROM old_external` (CTAS) copies data into a new table of the other kind — works in both directions, at the cost of a copy.\n\nWhy convert to managed? Platform automation — predictive optimization and friends — works best on managed tables.',
      takeaways: [
        'External → managed: ALTER TABLE ... SET MANAGED.',
        'CTAS recreates in either direction (copies data).',
        'Managed tables get the most platform automation.',
      ],
    },
    {
      id: 'mistake-external-safer',
      type: 'mistake',
      title: '“External is safer, so use it everywhere”',
      myth: '“Since DROP can’t delete external data, external tables are the safe default.”',
      reality:
        'That “safety” is *unmanagement*: you now own file cleanup (orphaned data accumulates forever), and you opt out of platform automation like predictive optimization. Databricks’ guidance is the opposite default: **managed unless** an external system genuinely needs to read the files at a path you control. Deletion safety comes from permissions, not table type.',
    },
    {
      id: 'mcq-drop',
      type: 'mcq',
      question:
        'A table is dropped. Days later the data files are found intact in the company’s own S3 bucket, though the table no longer appears in the catalog. What explains this?',
      options: [
        { id: 'a', text: 'It was a managed table and VACUUM had not run yet.' },
        { id: 'b', text: 'It was an external table — DROP removed only the metadata; the files at the customer-owned LOCATION are untouched.' },
        { id: 'c', text: 'Unity Catalog always retains data files for 90 days after a DROP.' },
        { id: 'd', text: 'The DROP command failed silently.' },
      ],
      correct: ['b'],
      optionFeedback: {
        a: 'Managed-table cleanup isn’t a VACUUM you wait on — and the files are in the *company’s* bucket, the external tell-tale.',
        b: 'External tables leave your files alone on DROP — that is their defining behavior.',
        c: 'No such universal retention rule exists for table files.',
        d: 'The table is gone from the catalog, so the DROP clearly succeeded.',
      },
      explanation:
        'Files surviving a DROP in customer-owned storage = external table. The catalog entry was the only thing Databricks owned.',
      examObjective:
        'Differentiate between managed and external tables in Unity Catalog and perform basic operations (create, modify, delete, and convert between them).',
    },
    {
      id: 'flash-managed',
      type: 'flashcard',
      front: 'What single clause in CREATE TABLE makes a table external — and what command converts it back to managed?',
      back: '`LOCATION \'<path>\'` makes it external · `ALTER TABLE ... SET MANAGED` converts it to managed.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You now control table lifecycles deliberately',
      points: [
        'Managed: platform owns files; DROP deletes them.',
        'External: you own files at LOCATION; DROP keeps them.',
        'DESCRIBE EXTENDED reveals which kind you’re holding.',
        'Convert: ALTER TABLE SET MANAGED, or CTAS to recreate.',
        'Default managed; choose external only for genuine cross-system sharing.',
      ],
      closing: 'Now that we know who owns the data — who gets to *touch* it? 🔑',
    },
  ],
}
