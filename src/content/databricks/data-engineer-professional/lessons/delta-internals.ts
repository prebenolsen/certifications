import type { Lesson } from '@/types/content'

/**
 * Lesson: Delta Lake internals — metastore vs data operations, ACID, clones.
 * Maps to exam Section 10 (data modelling with Delta) and Section 6.
 * Covers sample questions 1 (RENAME / metastore + ACID) and 8 (clone vs view).
 */
export const deltaInternalsLesson: Lesson = {
  id: 'delta-internals',
  title: 'What the transaction log actually does',
  summary:
    'Metastore operations vs data operations, the ACID guarantees of RENAME/DROP, and shallow vs deep clones — plus when a plain view beats a clone.',
  estimatedMinutes: 11,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'A one-character typo',
      body: 'You created a table with a typo — `prod.sales_by_stor` — and now you run `ALTER TABLE prod.sales_by_stor RENAME TO prod.sales_by_store`.\n\nA teammate panics: "Won\'t that rewrite a terabyte of files?" Knowing *exactly* what a rename touches — and what it leaves alone — is the difference between a fearless one-liner and a maintenance window.',
      atWork:
        'Half of the Delta questions on this exam are really asking: is this a **metastore** operation or a **data** operation?',
    },
    {
      id: 'concept-two-layers',
      type: 'concept',
      title: 'Two layers: the catalog and the files',
      body: 'Every Delta table lives in two places at once. The **metastore** (Unity Catalog) holds the *name* → *location* mapping. The **storage location** holds the Parquet data files and the `_delta_log` transaction log.\n\nSome operations touch only the catalog. Some rewrite the log and files. Confusing the two is the classic exam trap.',
      takeaways: [
        'Catalog = the `catalog.schema.table` name and where it points.',
        'Location = the data files + `_delta_log`.',
        'Ask of any command: *which layer does it change?*',
      ],
    },
    {
      id: 'concept-rename',
      type: 'concept',
      title: 'RENAME is a metastore operation',
      body: 'Renaming a table updates the **metastore reference** — the name now points at the same location as before. No data files move, no new transaction log is created, and the change is *not* written into the Delta log (the log records data changes, not catalog metadata).\n\nThe files under `/mnt/prod/sales_by_store` are untouched; only the pointer that finds them changed.',
      takeaways: [
        'RENAME rewrites the catalog entry, not the data.',
        'It is instant regardless of table size.',
        'The Delta log is unchanged — rename is not a data commit.',
      ],
    },
    {
      id: 'mcq-rename',
      type: 'mcq',
      question:
        'A Delta table was created with `CREATE TABLE prod.sales_by_stor USING DELTA LOCATION "/mnt/prod/sales_by_store"`. To fix the typo you run `ALTER TABLE prod.sales_by_stor RENAME TO prod.sales_by_store`. What happens?',
      options: [
        {
          id: 'a',
          text: 'All related files and metadata are dropped and recreated in a single ACID transaction.',
        },
        { id: 'b', text: 'The table name change is recorded in the Delta transaction log.' },
        { id: 'c', text: 'A new Delta transaction log is created for the renamed table.' },
        { id: 'd', text: 'The table reference in the metastore is updated.' },
      ],
      correct: ['d'],
      optionFeedback: {
        a: 'Nothing is dropped or rewritten — a rename never touches the data files.',
        b: 'The Delta log records data changes; a catalog rename is not written to it.',
        c: 'The existing log stays exactly where it is at the unchanged LOCATION.',
        d: 'Correct — rename only updates the metastore pointer; files and log are untouched.',
      },
      explanation:
        'RENAME is a **metastore** operation. The name-to-location mapping is updated; the data files and `_delta_log` at the LOCATION are unchanged.',
      examObjective:
        "Understand Delta Lake's catalog–metastore operations and ACID compliance behavior.",
    },
    {
      id: 'concept-acid',
      type: 'concept',
      title: 'ACID means readers never see a half-write',
      body: 'When you *do* change data — INSERT, UPDATE, MERGE, DELETE — Delta commits **atomically**. A write either fully succeeds (a new version appears in the log) or leaves no trace. Concurrent readers keep seeing the last committed version until the new one commits.\n\nThat is why you can rewrite a table while dashboards query it: they read version N while your job builds version N+1.',
      takeaways: [
        'Each successful write = one new, complete table version.',
        'Readers are isolated: they never see a partial write.',
        'Failed writes leave the previous version intact.',
      ],
    },
    {
      id: 'concept-drop',
      type: 'concept',
      title: 'DROP: managed deletes data, external does not',
      body: 'DROP is where the managed-vs-external distinction bites. Dropping a **managed** table removes the catalog entry *and* deletes the underlying files. Dropping an **external** table (one created with `LOCATION`) removes only the catalog entry — the files survive.\n\nThe `sales_by_store` table above is external, so a `DROP` would leave every Parquet file in place.',
      takeaways: [
        'Managed DROP → catalog entry + files gone.',
        'External DROP → catalog entry gone, files remain.',
        'This is the flip side of "which layer does it touch?"',
      ],
    },
    {
      id: 'diagram-clone',
      type: 'diagram',
      title: 'Shallow vs deep clone',
      spec: {
        kind: 'compare',
        left: {
          label: 'SHALLOW CLONE',
          sublabel: 'copies metadata only',
          tone: 'accent',
          items: [
            'Points at the source’s data files',
            'Instant, near-zero storage',
            'Great for a throwaway test copy',
            'Breaks if the source VACUUMs its files',
          ],
        },
        right: {
          label: 'DEEP CLONE',
          sublabel: 'copies metadata + data',
          tone: 'brand',
          items: [
            'Copies all data files to the target',
            'Independent, fully self-contained',
            'Incremental on re-run (syncs new commits)',
            'Costs storage + copy time',
          ],
        },
      },
      caption:
        'Both create a new table from a snapshot. Shallow shares files; deep owns them.',
    },
    {
      id: 'mistake-clone',
      type: 'mistake',
      title: 'A clone is not the simplest way to share a subset',
      myth: '“To give another team a renamed, trimmed copy of my table, I should DEEP CLONE it and keep the clone in sync.”',
      reality:
        'A clone copies the *whole* table and then needs a job to re-sync. If you only need to expose **approved columns under different names**, a **view** does it with zero data movement and always reflects the latest data. Reach for a clone when you need a physically independent table, not a filtered projection.',
    },
    {
      id: 'mcq-clone-vs-view',
      type: 'mcq',
      question:
        'Marketing wants to share an aggregate table with sales, but the field names differ and several marketing-only fields are not approved for sales. Which solution addresses this while emphasizing simplicity?',
      options: [
        {
          id: 'a',
          text: 'Create a view on the marketing table selecting only the approved fields, aliasing names to the sales conventions.',
        },
        {
          id: 'b',
          text: 'Create a new table with the required schema and use DEEP CLONE to sync committed changes between them.',
        },
        {
          id: 'c',
          text: 'Use a CTAS statement to derive a table from the marketing table and a production job to propagate changes.',
        },
        {
          id: 'd',
          text: 'Add a parallel table write to the production pipeline that maintains a separate sales table.',
        },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'Correct — a view projects the approved columns, renames them with aliases, always reflects live data, and copies nothing.',
        b: 'DEEP CLONE duplicates the entire dataset and still needs re-runs to stay current — the opposite of simple.',
        c: 'CTAS + a propagation job is a whole new pipeline to build and maintain.',
        d: 'A parallel write adds fragile duplication to a production pipeline.',
      },
      explanation:
        'When the requirement is "expose a renamed subset of columns," a **view** is the simplest tool: no data movement, no sync job, always fresh.',
      examObjective:
        'Apply Delta Lake clone to learn how shallow and deep clones interact with source/target tables.',
    },
    {
      id: 'flash-rename',
      type: 'flashcard',
      front: 'Does `ALTER TABLE … RENAME TO …` rewrite data files or create a new transaction log?',
      back: 'Neither. It updates only the **metastore** name→location pointer. Files and `_delta_log` are untouched.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You can now reason about any Delta command',
      points: [
        'Every table = a catalog entry + files/`_delta_log`; ask which layer a command changes.',
        'RENAME touches only the metastore pointer — instant, no data commit.',
        'ACID: each data write is one complete new version; readers are isolated.',
        'DROP deletes files for managed tables but not external ones.',
        'Shallow clone shares files; deep clone copies them; a view beats both for a renamed subset.',
      ],
      closing: 'Next: which column (if any) should you partition on? 🧱',
    },
  ],
}
