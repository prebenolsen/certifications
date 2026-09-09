import type { Lesson } from '@/types/content'

/**
 * Lesson: the named components of the Data Intelligence Platform.
 * Maps to exam Section 1 (core components: Mosaic AI, DeltaLive tables,
 * Lakeflow Jobs, Data Intelligence Engine, Delta Lake, Unity Catalog,
 * Databricks SQL) and Section 1 (role and features of Databricks Marketplace).
 * Research: src_material/.../research/platform-and-naming.md
 */
export const platformComponentsLesson: Lesson = {
  id: 'platform-components',
  title: 'The pieces of the platform',
  summary:
    'Delta Lake, Databricks SQL, Lakeflow, Mosaic AI, the Data Intelligence Engine and the Marketplace — what each one is for, and which ones an analyst actually touches.',
  estimatedMinutes: 10,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'The console is full of names',
      body: 'Your first week you meet Delta Lake, Databricks SQL, Lakeflow Jobs, Mosaic AI, the Marketplace — and a colleague who still calls something "DLT".\n\nThe exam asks you to name these components and say what each does. The good news: most of them are things you already understand, wearing a product name.',
      atWork:
        'Knowing which component owns a problem is how you ask the right person for help.',
    },
    {
      id: 'concept-delta-lake',
      type: 'concept',
      title: 'Delta Lake — the table format',
      body: '**Delta Lake** is the format every Databricks table uses: ordinary **Parquet** data files plus a **transaction log** kept alongside them.\n\nThat log is what turns a folder of files into a real table. It gives you **ACID transactions** (your query never sees a half-finished write), and a numbered **version** for every change — which is what makes time travel possible later in this course.',
      takeaways: [
        'Delta Lake = Parquet files + a transaction log.',
        'The log provides ACID transactions and table versions.',
        'It is an open format, not a proprietary database.',
      ],
    },
    {
      id: 'concept-databricks-sql',
      type: 'concept',
      title: 'Databricks SQL — your workbench',
      body: '**Databricks SQL** is the analyst-facing half of the platform: the **SQL editor**, the **SQL warehouses** that run your queries, dashboards, alerts, and **query history**.\n\nIf your day is writing SQL and publishing dashboards, Databricks SQL is where you spend it. Most of this certification lives here.',
      takeaways: [
        'SQL editor + SQL warehouses + dashboards + alerts + query history.',
        'The surface an analyst works in all day.',
      ],
    },
    {
      id: 'concept-lakeflow',
      type: 'concept',
      title: 'Lakeflow — how data gets in and stays fresh',
      body: '**Lakeflow** is the family name for data engineering on Databricks: getting data in, transforming it, and running the whole thing on a schedule.\n\nTwo members matter to an analyst. **Lakeflow Jobs** is the scheduler — it runs the pipelines that refresh the tables behind your dashboard, and it is where you look when this morning’s numbers are missing. **Lakeflow Pipelines** is the transformation tool that produces those tables.',
      takeaways: [
        'Lakeflow = ingestion + transformation + orchestration, as one family.',
        '**Lakeflow Jobs** schedules work; **Lakeflow Pipelines** defines the tables.',
        'When a table is stale, a Lakeflow Job is usually the thing that did not run.',
      ],
    },
    {
      id: 'mistake-dlt',
      type: 'mistake',
      title: 'This one has had three names',
      myth: '"Delta Live Tables, Lakeflow Spark Declarative Pipelines, and Lakeflow Pipelines are three different products I need to learn."',
      reality:
        'They are the **same product**, renamed twice: **Delta Live Tables (DLT)** → **Lakeflow Spark Declarative Pipelines** → **Lakeflow Pipelines**.\n\nThe exam guide still writes "DeltaLive tables"; the console today says Lakeflow. Recognise all three names — the thing underneath never changed.',
    },
    {
      id: 'concept-mosaic-dbie',
      type: 'concept',
      title: 'Mosaic AI and the Data Intelligence Engine',
      body: '**Mosaic AI** is the AI side of the platform: building, serving, and monitoring models and AI applications on the same governed data. An analyst rarely builds there, but it explains why data scientists are querying your tables.\n\nThe **Data Intelligence Engine** is the layer that *learns your organisation’s data* — the semantics behind your table and column names — so the platform can answer natural-language questions and suggest better queries. It is what makes Genie and the Assistant more than generic chatbots.',
      takeaways: [
        'Mosaic AI = building and serving models on governed data.',
        'The Data Intelligence Engine = the platform understanding *your* data’s meaning.',
        'It is the reason Genie can answer questions about your specific tables.',
      ],
    },
    {
      id: 'diagram-stack',
      type: 'diagram',
      title: 'Which piece sits where',
      spec: {
        kind: 'layers',
        layers: [
          {
            label: 'Delta Lake',
            sublabel: 'the table format on your cloud storage',
            tone: 'neutral',
          },
          {
            label: 'Unity Catalog',
            sublabel: 'names, permissions, lineage, audit',
            tone: 'brand',
          },
          {
            label: 'Lakeflow',
            sublabel: 'ingest · transform · schedule',
            tone: 'accent',
          },
          {
            label: 'Databricks SQL · Mosaic AI',
            sublabel: 'where analysts and AI teams work',
            tone: 'good',
          },
        ],
      },
      caption:
        'Storage format at the bottom, governance over everything, pipelines filling the tables, and the two working surfaces on top.',
    },
    {
      id: 'concept-marketplace',
      type: 'concept',
      title: 'Databricks Marketplace — data you did not have to build',
      body: 'The **Marketplace** is an open exchange where providers publish **data products**: datasets, notebooks, AI models, and more. You browse listings from inside your workspace and request access.\n\nIt runs on the **open sharing protocol**, so nothing is copied — an accepted listing appears as a catalog in your Unity Catalog and you query it live. Many public listings offer **instant access**: agree to the terms and it is there, with no pipeline to build and no provider approval to wait for.',
      takeaways: [
        'An exchange for datasets, notebooks, and models — browsed in your workspace.',
        'Delivered by sharing, not copying: it arrives as a catalog you query live.',
        'Public listings can grant **instant access**; others need provider approval.',
      ],
    },
    {
      id: 'tf-marketplace',
      type: 'truefalse',
      statement:
        'Getting a dataset from Databricks Marketplace means running an ingestion pipeline to copy the provider’s data into your storage.',
      answer: false,
      explanation:
        'Nothing is copied. The listing is delivered through the open sharing protocol and shows up as a **catalog** in your metastore — you query the provider’s live data, governed by Unity Catalog like anything else.',
    },
    {
      id: 'mcq-components',
      type: 'mcq',
      question:
        'Match each need to the component that serves it: (1) the format giving tables ACID transactions and versions, (2) the scheduler that refreshes the tables behind a dashboard, (3) the place an analyst writes queries and builds dashboards.',
      options: [
        {
          id: 'a',
          text: '1 → Delta Lake · 2 → Lakeflow Jobs · 3 → Databricks SQL',
        },
        {
          id: 'b',
          text: '1 → Unity Catalog · 2 → Mosaic AI · 3 → Delta Lake',
        },
        {
          id: 'c',
          text: '1 → Databricks SQL · 2 → Delta Lake · 3 → Lakeflow Jobs',
        },
        {
          id: 'd',
          text: '1 → Mosaic AI · 2 → Databricks SQL · 3 → Unity Catalog',
        },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'The table format, the orchestrator, and the analyst’s workbench — each doing its own job.',
        b: 'Unity Catalog governs rather than storing; Mosaic AI serves models rather than scheduling jobs.',
        c: 'Reversed: Delta Lake is the format, not the scheduler, and Databricks SQL is the workbench, not the format.',
        d: 'Unity Catalog is governance, not a query surface.',
      },
      explanation:
        '**Delta Lake** = the table format (ACID, versions). **Lakeflow Jobs** = orchestration that keeps tables fresh. **Databricks SQL** = the analyst surface. **Unity Catalog** governs all of it, and **Mosaic AI** covers the AI workloads.',
      examObjective:
        'Describe the core components of the Databricks Intelligence Platform, including Mosaic AI, DeltaLive tables, Lakeflow Jobs, Data Intelligence Engine, Delta Lake, Unity Catalog, and Databricks SQL.',
    },
    {
      id: 'flash-marketplace',
      type: 'flashcard',
      front: 'What does Databricks Marketplace deliver, and how does the data arrive?',
      back: 'Data products — datasets, notebooks, models — delivered by **sharing, not copying**: the listing appears as a **catalog** in Unity Catalog that you query live.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You can now name the parts',
      points: [
        '**Delta Lake** — Parquet + transaction log: ACID transactions and versions.',
        '**Unity Catalog** — one governance layer over every workspace.',
        '**Databricks SQL** — editor, warehouses, dashboards, alerts, query history.',
        '**Lakeflow** — ingest, transform, schedule; *Jobs* runs it, *Pipelines* defines it (formerly DLT).',
        '**Mosaic AI** — models on governed data; the **Data Intelligence Engine** learns what your data means.',
        '**Marketplace** — data products shared into your catalog, not copied.',
      ],
      closing:
        'Names learned. Next: the window you actually browse all of this through. 🔭',
    },
  ],
}
