import type { Lesson } from '@/types/content'

/**
 * Lesson: Lakeflow Connect, custom clients, and choosing an ingestion method.
 * Maps to exam Section 2 (configure Lakeflow Connect; JDBC/ODBC and REST
 * clients; prioritize between ingestion methods; semi-structured data).
 */
export const lakeflowConnectLesson: Lesson = {
  id: 'lakeflow-connect',
  title: 'Lakeflow Connect & choosing your ingestion method',
  summary:
    'Connectors for databases and SaaS apps, hand-rolled JDBC/REST pulls, ingesting nested JSON — and a decision guide for picking between all of them.',
  estimatedMinutes: 10,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'The data is not in files',
      body: 'The CRM data lives in **Salesforce**. Orders sit in **SQL Server**. A niche logistics vendor only offers a **REST API**. None of it arrives as files in cloud storage, so COPY INTO and Auto Loader can’t reach it.\n\nGetting *enterprise* data onto the platform is a different problem than loading files — and it has its own tools.',
      atWork:
        'In most companies the highest-value data (CRM, ERP, finance) lives behind connectors and APIs, not in file drops.',
    },
    {
      id: 'concept-lakeflow-connect',
      type: 'concept',
      title: 'Lakeflow Connect: managed and standard connectors',
      body: 'Lakeflow Connect is Databricks’ built-in ingestion service. **Managed connectors** are fully hosted: point one at Salesforce, Workday, SQL Server or similar, give it credentials, and it ingests — including **incremental change capture** — into Unity Catalog tables with no pipeline code.\n\n**Standard connectors** cover files and message buses (cloud storage, Kafka, etc.), where you configure a bit more yourself.',
      takeaways: [
        'Managed connectors: SaaS apps & databases, fully hosted, no pipeline code.',
        'Standard connectors: file and streaming sources you configure.',
        'Everything lands governed by Unity Catalog from the first byte.',
      ],
    },
    {
      id: 'concept-jdbc-rest',
      type: 'concept',
      title: 'No connector? Code the pull yourself',
      body: 'For sources without a connector, notebooks can reach out directly:\n\n• **JDBC/ODBC** — Spark reads a database table over a driver connection.\n• **REST clients** — Python `requests` (or similar) calls an API, and you write the response to cloud storage or straight into a Delta table.\n\nThese hand-rolled pulls are typically **orchestrated and scheduled with Lakeflow Jobs**, which supplies the retries, alerts, and run history that raw scripts lack.',
      takeaways: [
        'JDBC/ODBC for databases; REST for APIs.',
        'Custom pulls live in notebooks, scheduled by Lakeflow Jobs.',
        'Prefer a connector when one exists — less code to own.',
      ],
    },
    {
      id: 'diagram-sources',
      type: 'diagram',
      title: 'Every road leads to Unity Catalog',
      spec: {
        kind: 'flow',
        steps: [
          { label: 'Enterprise sources', sublabel: 'SaaS · databases · APIs · files', tone: 'neutral' },
          { label: 'Ingestion layer', sublabel: 'Lakeflow Connect · Auto Loader · COPY INTO · notebooks', tone: 'brand' },
          { label: 'Governed Delta tables', sublabel: 'catalog.schema.table', tone: 'good' },
        ],
        arrows: [null, 'one governance model'],
      },
      caption:
        'The method varies by source; the destination contract does not: Delta tables governed by Unity Catalog.',
    },
    {
      id: 'concept-choosing',
      type: 'concept',
      title: 'The decision guide',
      body: 'Choose by asking four questions:\n\n**Where is the data?** SaaS/database → Lakeflow Connect. Files in storage → Auto Loader or COPY INTO. API only → REST in a notebook.\n\n**How much / how often?** Millions of files or continuous → Auto Loader. Thousands on a schedule → COPY INTO.\n\n**What shape?** Nested JSON and semi-structured data are first-class in all of these.\n\n**Governance needs?** All routes should land in Unity Catalog — if a partner tool bypasses it, that is a mark against the tool.',
      takeaways: [
        'Source location first, then volume/frequency, then shape, then governance.',
        'Partner connectors fill gaps the native options don’t cover.',
      ],
    },
    {
      id: 'concept-semistructured',
      type: 'concept',
      title: 'Semi-structured data is welcome',
      body: 'JSON with nested objects and arrays does not need flattening before ingest. Delta tables store **structs, arrays, and maps** natively, and connectors ingest them as-is.\n\nThe usual pattern: land the nested data raw in **bronze**, then flatten what analytics needs (dot paths like `payload.user.id`, `explode()` for arrays) on the way to silver — you will do exactly that in the transformation module.',
      takeaways: [
        'Ingest nested JSON as-is into bronze.',
        'Flatten later, deliberately, on the way to silver.',
      ],
    },
    {
      id: 'mistake-csv-everything',
      type: 'mistake',
      title: 'The CSV-export reflex',
      myth: '“Easiest way to get Salesforce data in: schedule a CSV export to S3 and Auto-Load it.”',
      reality:
        'That builds a second, fragile pipeline (export job, file naming, partial exports, no change capture) to avoid using the tool built for the job. A **managed connector** handles auth, incremental sync, and schema drift for you — export-to-file is the fallback, not the default.',
    },
    {
      id: 'mcq-choose',
      type: 'mcq',
      question:
        'Match the tool to the job: (1) nightly sync of a SQL Server CRM database, (2) continuous ingestion of millions of small JSON events landing in S3, (3) weekly pull from a small vendor REST API with no connector available.',
      options: [
        { id: 'a', text: '1 → Auto Loader · 2 → Lakeflow Connect managed connector · 3 → COPY INTO' },
        { id: 'b', text: '1 → Lakeflow Connect managed connector · 2 → Auto Loader · 3 → REST client in a notebook, scheduled with Lakeflow Jobs' },
        { id: 'c', text: '1 → COPY INTO · 2 → REST client in a notebook · 3 → Auto Loader' },
        { id: 'd', text: 'All three → Auto Loader, since it handles any source' },
      ],
      correct: ['b'],
      optionFeedback: {
        a: 'Auto Loader reads files, not databases; COPY INTO can’t call an API.',
        b: 'Database → managed connector; files at scale → Auto Loader; API without a connector → notebook code on a schedule.',
        c: 'Each tool is pointed at the wrong source shape here.',
        d: 'Auto Loader only ingests files from storage — it cannot query databases or call APIs.',
      },
      explanation:
        'The source’s location and shape picks the tool: connectors for systems, Auto Loader for files at scale, custom code (orchestrated by Jobs) for the long tail.',
      examObjective:
        'Prioritize between Auto Loader, Lakeflow Connect (standard and managed connectors), partner connectors, and other ingestion methods based on technical requirements.',
    },
    {
      id: 'tf-governance',
      type: 'truefalse',
      statement:
        'Data ingested through Lakeflow Connect managed connectors lands in Unity Catalog–governed tables.',
      answer: true,
      explanation:
        'That is a core selling point: governance from the first byte — permissions, lineage, and auditing apply to connector-ingested data like any other table.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You can now ingest from anywhere',
      points: [
        'Lakeflow Connect: managed connectors for SaaS/databases, standard connectors for files/streams.',
        'JDBC/REST notebook pulls cover the long tail — scheduled by Lakeflow Jobs.',
        'Choose by source location → volume/frequency → data shape → governance.',
        'Nested JSON lands raw in bronze; flattening is silver’s job.',
      ],
      closing: 'Ingestion complete. Time to turn raw bronze into something trustworthy. 🔄',
    },
  ],
}
