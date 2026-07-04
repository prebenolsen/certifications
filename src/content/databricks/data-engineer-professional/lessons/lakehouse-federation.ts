import type { Lesson } from '@/types/content'

/**
 * Lesson: Lakehouse Federation.
 * Maps to exam Section 4 (configure Lakehouse Federation with proper governance
 * across supported source systems).
 */
export const lakehouseFederationLesson: Lesson = {
  id: 'lakehouse-federation',
  title: 'Querying data you never ingested',
  summary:
    'Lakehouse Federation queries external systems (PostgreSQL, MySQL, Snowflake, Redshift, and more) in place, through Unity Catalog governance — no pipeline required.',
  estimatedMinutes: 9,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'You need one table from Postgres',
      body: 'A dashboard needs to join your lakehouse sales with a single reference table that lives in an operational **PostgreSQL** database. Building an ingestion pipeline for one small, slow-changing table is overkill — and now you own another copy to keep fresh.\n\nLakehouse Federation lets you query that Postgres table *in place*, as if it were a Unity Catalog table.',
      atWork:
        'Federation is the answer when you need external data occasionally and don’t want to own a pipeline and a copy.',
    },
    {
      id: 'concept-what',
      type: 'concept',
      title: 'What Lakehouse Federation is',
      body: 'Lakehouse Federation lets Databricks **query external databases and warehouses in place** — PostgreSQL, MySQL, SQL Server, Snowflake, Redshift, BigQuery, and others — without ingesting them. You register the source, and its tables appear in Unity Catalog as a **foreign catalog** you can query and join with native tables.\n\nThe data stays in the source system; Databricks pushes queries down to it.',
      takeaways: [
        'Query external systems in place — no ingestion.',
        'The source surfaces as a foreign catalog in Unity Catalog.',
        'Join federated tables with native lakehouse tables.',
      ],
    },
    {
      id: 'concept-connection-catalog',
      type: 'concept',
      title: 'Connection + foreign catalog',
      body: 'Setup is two objects. A **connection** holds the credentials and network details for the external system (created once, secured by Unity Catalog). A **foreign catalog** mirrors a database from that connection into UC, exposing its schemas and tables.\n\nOnce created, the foreign catalog behaves like any catalog: `SELECT … FROM pg_catalog.public.customers`.',
      takeaways: [
        'Connection = secured credentials to the external system.',
        'Foreign catalog = the external database mirrored into UC.',
        'Query it with normal three-part names.',
      ],
    },
    {
      id: 'concept-governance',
      type: 'concept',
      title: 'Governed like everything else',
      body: 'Federated tables are **governed by Unity Catalog**: the same GRANTs, row filters, column masks, lineage, and audit logs apply. So you can let analysts query a Snowflake table through Databricks while enforcing *your* access policies — even if the source system’s own permissions differ.\n\nGovernance is centralized; the data never leaves its home.',
      takeaways: [
        'UC permissions, masks, lineage, and audit apply to federated tables.',
        'Enforce your policies regardless of the source’s own model.',
        'Central governance without copying data.',
      ],
    },
    {
      id: 'mistake-federation-etl',
      type: 'mistake',
      title: 'Federation is not a replacement for ETL',
      myth: '“Federation queries the source, so I should federate everything instead of ingesting.”',
      reality:
        'Every federated query hits the *source* system and its performance limits. For large, hot, or heavily-joined data, federating hammers the operational database and is slow. Federation shines for **occasional, exploratory, or small reference** reads; ingest when you need scale, speed, or to offload the source.',
    },
    {
      id: 'tf-copy',
      type: 'truefalse',
      statement:
        'Configuring Lakehouse Federation copies the external tables into Delta on Databricks.',
      answer: false,
      explanation:
        'Federation queries the source **in place** — nothing is copied. The data stays in the external system; Databricks pushes the query down and applies UC governance.',
    },
    {
      id: 'mcq-federation',
      type: 'mcq',
      question:
        'You need to join lakehouse data with a small, slowly-changing reference table in an operational PostgreSQL database, with your Unity Catalog access policies enforced and without maintaining a copy. What fits best?',
      options: [
        {
          id: 'a',
          text: 'Lakehouse Federation: create a connection + foreign catalog and query the Postgres table in place under UC governance.',
        },
        {
          id: 'b',
          text: 'Build a nightly ingestion pipeline to copy the table into Delta.',
        },
        { id: 'c', text: 'Export the table to CSV and upload it to a Volume each day.' },
        { id: 'd', text: 'Use Delta Sharing to receive the Postgres table.' },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'Correct — a small reference table queried occasionally is the ideal federation case: no copy, no pipeline, UC governance applied.',
        b: 'A pipeline creates a copy to maintain for a table you can just query in place.',
        c: 'Daily CSV exports are stale, manual, and ungoverned.',
        d: 'Delta Sharing shares *Delta* data between share providers/recipients; it doesn’t connect to a PostgreSQL source.',
      },
      explanation:
        'A small, slow-changing external reference table queried through your own governance is the textbook Lakehouse Federation use case — no ingestion, no copy.',
      examObjective:
        'Configure Lakehouse Federation with proper governance across the supported source systems.',
    },
    {
      id: 'flash-two-objects',
      type: 'flashcard',
      front: 'What two Unity Catalog objects set up Lakehouse Federation to an external database?',
      back: 'A **connection** (secured credentials to the source) and a **foreign catalog** (the external database mirrored into UC).',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You can now query data in place',
      points: [
        'Federation queries external DBs/warehouses without ingesting them.',
        'Set up a connection + a foreign catalog; query with normal names.',
        'UC governance (grants, masks, lineage, audit) applies to federated tables.',
        'Best for occasional/small reference reads — not high-scale hot data.',
        'Nothing is copied; the source system serves the query.',
      ],
      closing: 'Next module: protecting the sensitive data itself — de-identifying PII. 🕵️',
    },
  ],
}
