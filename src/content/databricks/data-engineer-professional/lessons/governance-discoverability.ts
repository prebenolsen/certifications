import type { Lesson } from '@/types/content'

/**
 * Lesson: Unity Catalog metadata/discoverability and permission inheritance.
 * Maps to exam Section 8 (add descriptions/metadata for discoverability;
 * demonstrate understanding of the UC permission inheritance model).
 */
export const governanceDiscoverabilityLesson: Lesson = {
  id: 'governance-discoverability',
  title: 'Making data discoverable & governed',
  summary:
    'Comments, tags, and metadata that make enterprise data findable, and the Unity Catalog permission inheritance model down the securable hierarchy.',
  estimatedMinutes: 9,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'A thousand tables, no map',
      body: 'A new analyst needs "the certified revenue table." The catalog has 1,200 tables with names like `tbl_fin_v3_final`. No descriptions, no owners, no tags. They give up and rebuild the metric from scratch — wrong.\n\nMetadata is what turns a pile of tables into a *discoverable* data estate. And governance is what keeps that estate secure without a permission rule per table.',
      atWork:
        'Discoverability and inheritance are the two governance ideas the Professional exam tests directly.',
    },
    {
      id: 'concept-metadata',
      type: 'concept',
      title: 'Describe your data so people can find it',
      body: 'Unity Catalog lets you attach **comments** (human descriptions) and **tags** (key-value labels) to catalogs, schemas, tables, and columns. `COMMENT ON`, `ALTER TABLE … SET TAGS`, and AI-generated descriptions in Catalog Explorer make data self-documenting.\n\nGood metadata powers search, lineage, and classification (e.g. tag a column `pii=email`), so the right people find the right, trustworthy data.',
      takeaways: [
        'Comments = human-readable descriptions on any securable.',
        'Tags = key-value labels for search and classification.',
        'Metadata drives discoverability, search, and PII classification.',
      ],
    },
    {
      id: 'example-metadata',
      type: 'example',
      title: 'Documenting a table',
      intro: 'A few statements make a table findable and classified:',
      code: {
        language: 'sql',
        content:
          "COMMENT ON TABLE sales.gold.revenue IS\n  'Certified daily revenue by store. Source of truth for finance dashboards.';\n\nALTER TABLE sales.gold.revenue SET TAGS ('certified' = 'true', 'domain' = 'finance');\n\nALTER TABLE sales.silver.customers\n  ALTER COLUMN email SET TAGS ('pii' = 'email');",
      },
      explanation:
        'The comment explains *what the table is and whether to trust it*; tags let anyone search for `certified=true` finance data, and the column tag flags PII for masking policies.',
    },
    {
      id: 'analogy-org',
      type: 'analogy',
      title: 'Inheritance is an org chart',
      body: 'Permissions in Unity Catalog flow downhill like authority in an org chart. Grant a privilege at the catalog level and it applies to every schema and table beneath it — just as authority given to a director applies across their whole department, without naming each employee.',
      mapping: [
        { from: 'Director’s authority', to: 'Privilege granted on a catalog' },
        { from: 'Applies to the whole department', to: 'Inherited by all schemas & tables' },
        { from: 'A specific manager', to: 'A schema you can grant on directly too' },
      ],
    },
    {
      id: 'concept-inheritance',
      type: 'concept',
      title: 'The permission inheritance model',
      body: 'Securables nest: **metastore → catalog → schema → table/view/volume**. A privilege granted at a higher level is **inherited** by everything below it. `GRANT SELECT ON SCHEMA sales.gold` lets the grantee read *every* current and future table in that schema — no need to grant table by table.\n\nTo use an object you also need `USE CATALOG` and `USE SCHEMA` on its parents — traversal privileges down the tree.',
      takeaways: [
        'Hierarchy: metastore ⊃ catalog ⊃ schema ⊃ table.',
        'A higher-level grant is inherited by all children.',
        'Reaching an object also needs USE CATALOG / USE SCHEMA on parents.',
      ],
    },
    {
      id: 'diagram-hierarchy',
      type: 'diagram',
      title: 'Grants flow down the tree',
      spec: {
        kind: 'layers',
        layers: [
          { label: 'Catalog — GRANT SELECT here…', tone: 'brand' },
          { label: 'Schema — …is inherited here…', tone: 'accent' },
          { label: 'Table / View — …and here, automatically', tone: 'good' },
        ],
      },
      caption:
        'One grant at the catalog or schema level covers all current and future objects beneath it.',
    },
    {
      id: 'mcq-inheritance',
      type: 'mcq',
      question:
        'You run `GRANT SELECT ON SCHEMA sales.gold TO `analysts``. Which statement is true?',
      options: [
        {
          id: 'a',
          text: 'analysts can read all current and future tables in sales.gold (given USE on the catalog and schema).',
        },
        {
          id: 'b',
          text: 'analysts can read only the tables that existed at the moment of the grant.',
        },
        { id: 'c', text: 'You must additionally GRANT SELECT on every table individually.' },
        { id: 'd', text: 'The grant has no effect until each table owner re-approves it.' },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'Correct — a schema-level SELECT is inherited by all present and future tables in the schema.',
        b: 'Inheritance applies to future objects too, not just those existing at grant time.',
        c: 'Inheritance is exactly what removes the need for per-table grants.',
        d: 'No re-approval is needed; the inherited grant is effective immediately.',
      },
      explanation:
        'Privileges granted on a schema are inherited by every current and future child object — the core of the UC inheritance model. Parents still need USE CATALOG/USE SCHEMA to be traversable.',
      examObjective:
        'Demonstrate understanding of the Unity Catalog permission inheritance model.',
    },
    {
      id: 'flash-inheritance',
      type: 'flashcard',
      front: 'If you GRANT SELECT on a schema, do future tables added to it inherit the grant?',
      back: 'Yes — inheritance covers all current *and future* child objects; no per-table grant needed.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You can now govern for discovery and access',
      points: [
        'Comments and tags make data discoverable, searchable, and classifiable.',
        'Tag PII columns to drive masking and compliance.',
        'Securables nest: metastore ⊃ catalog ⊃ schema ⊃ table.',
        'Higher-level grants are inherited by all current and future children.',
        'Object access also requires USE CATALOG / USE SCHEMA on the parents.',
      ],
      closing: 'Next: sharing this governed data beyond your workspace — Delta Sharing. 🔗',
    },
  ],
}
