import type { Lesson } from '@/types/content'

/**
 * Lesson: what Databricks is, for someone who already knows SQL.
 * Maps to exam Section 1 (core components of the Data Intelligence Platform).
 *
 * The orientation lesson. Nothing here is an exam question by itself; all of it
 * is assumed by every exam question. Written for an analyst — SQL editor, SQL
 * warehouse, dashboards — not for an engineer.
 */
export const whatIsDatabricksAnalystLesson: Lesson = {
  id: 'what-is-databricks-analyst',
  title: 'What Databricks is, for an analyst',
  summary:
    'The product in one sentence, the vendor words you will meet in every later lesson, and where your SQL actually runs.',
  estimatedMinutes: 8,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Start here',
      title: 'You know SQL. You do not yet know this vendor',
      body: 'Most Databricks material opens at full speed — catalogs, warehouses, DBUs, metastores — and assumes you already know what the product **is**.\n\nYou can write a join and read an execution plan. What is new here is one company’s vocabulary for things you mostly already understand. That is all this lesson covers.',
      atWork:
        'The fastest way to feel lost in a familiar field is a vendor word nobody defined.',
    },
    {
      id: 'concept-databricks',
      type: 'concept',
      title: 'Databricks, in one sentence',
      body: '**Databricks is a cloud platform for storing and analyzing very large amounts of data — and for building analytics and AI on top of it.**\n\nThere is nothing to install. It opens in a browser, runs on top of a cloud provider your company already pays for (AWS, Azure, or Google Cloud), and rents machines by the second to answer your queries.',
      takeaways: [
        'A **cloud platform**, opened in a browser — not software you install.',
        'It runs on AWS, Azure, or GCP; your data stays in your company’s cloud account.',
        'Its job: store big data, query it, and build analytics and AI on it.',
        'Databricks calls the whole product the **Data Intelligence Platform**.',
      ],
    },
    {
      id: 'mistake-database',
      type: 'mistake',
      title: 'The most common first assumption',
      myth: '"Databricks is a database. My company loads data into Databricks."',
      reality:
        'Nothing is loaded *into* Databricks. The data sits in your company’s own cloud storage as files, in open formats, and Databricks reads it where it lies.\n\nThat is why the tables you query can also be read by other tools, and why nobody had to migrate a warehouse to get started. "Databricks the database" is the wrong mental model; **"Databricks the engine and the rulebook over your files"** is the right one.',
    },
    {
      id: 'concept-lakehouse',
      type: 'concept',
      title: 'Why it is called a lakehouse',
      body: 'Companies used to keep two systems: a **data warehouse** for structured reporting, and a **data lake** for cheap storage of everything else. Jobs copied data between them, the copies drifted, and two teams reported different numbers for the same month.\n\nA **lakehouse** is one system doing both: cheap open file storage, with the reliability and SQL performance of a warehouse layered on top. One copy of the data, serving your dashboard and the data scientist’s model.',
      takeaways: [
        'Warehouse discipline over data-lake storage — one copy, many uses.',
        'This is why an analyst and a data scientist here query the *same* table.',
      ],
    },
    {
      id: 'concept-vocabulary',
      type: 'concept',
      title: 'The local names for things you already know',
      body: '• **Workspace** — the environment you log into. Companies usually run several (dev, test, prod).\n• **SQL editor** — where you write and run SQL. Your home screen.\n• **Notebook** — a document of runnable cells (SQL, Python). Handy for exploring; not required for the exam’s SQL work.\n• **SQL warehouse** — the compute that actually executes your queries. Pick one before you can run anything.\n• **Unity Catalog** — the governance layer that names, secures and tracks every table on the platform. The next lesson is entirely about it.\n• **Delta Lake** — the format every table is stored in: files plus a log that gives them transactions and versions.',
      takeaways: [
        'You work in a **workspace**, write in the **SQL editor**, and run on a **SQL warehouse**.',
      ],
    },
    {
      id: 'concept-dbu',
      type: 'concept',
      title: 'DBU — the one genuinely new word',
      body: 'A **DBU** (*Databricks Unit*) is the unit compute is metered in — roughly "how much processing did that consume". It is not an hour of machine time: a larger or more capable warehouse burns DBUs faster.\n\nAnalysts meet DBUs in three places the exam cares about: leaving a warehouse running, choosing a warehouse size, and whether a query rereads a whole table or skips most of it.',
      takeaways: [
        'DBUs, not hours — capability affects the burn rate.',
        'Query and compute choices here are cost choices.',
      ],
    },
    {
      id: 'diagram-shape',
      type: 'diagram',
      title: 'The shape of the platform',
      spec: {
        kind: 'layers',
        layers: [
          {
            label: 'Your company’s cloud account',
            sublabel: 'AWS · Azure · GCP — the storage is yours',
            tone: 'neutral',
          },
          {
            label: 'Data files in cloud storage',
            sublabel: 'open formats, not a proprietary database',
            tone: 'accent',
          },
          {
            label: 'Databricks platform',
            sublabel: 'compute · governance · dashboards · AI',
            tone: 'brand',
          },
          {
            label: 'What you build',
            sublabel: 'queries, dashboards, alerts, reports',
            tone: 'good',
          },
        ],
      },
      caption:
        'Note the outermost layer: **the data never leaves your own cloud account.** Databricks supplies the engine and the rules; the files stay yours.',
    },
    {
      id: 'check-storage',
      type: 'truefalse',
      statement:
        'To analyze data in Databricks you must first upload it into Databricks’ own storage system.',
      answer: false,
      explanation:
        'The data stays in **your** cloud storage, in open file formats, and Databricks reads it in place. That is also why adopting it did not require a migration.',
    },
    {
      id: 'mcq-components',
      type: 'mcq',
      question:
        'A new analyst asks what the main pieces of the Databricks Data Intelligence Platform are. Which answer describes the platform correctly?',
      options: [
        {
          id: 'a',
          text: 'A cloud platform whose data sits in open formats in your own cloud storage, governed by Unity Catalog, queried through Databricks SQL, with Delta Lake as the table format and Mosaic AI for AI workloads.',
        },
        {
          id: 'b',
          text: 'A proprietary database engine that stores your tables in a closed format inside Databricks’ own data centres.',
        },
        {
          id: 'c',
          text: 'A dashboarding tool that connects to an existing data warehouse and adds charts.',
        },
        {
          id: 'd',
          text: 'A managed Python notebook service with no SQL or governance features of its own.',
        },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'Open storage in your cloud account, one governance layer, a SQL surface, and AI on the same data — the platform as Databricks describes it.',
        b: 'The opposite: storage is open-format and stays in your account.',
        c: 'It has dashboards, but they sit on top of the platform rather than defining it.',
        d: 'Notebooks are one surface among several; SQL and Unity Catalog governance are central.',
      },
      explanation:
        'The platform is open storage in **your** cloud account, plus the pieces you meet over the next lessons: **Delta Lake** (the table format), **Unity Catalog** (governance), **Databricks SQL** (querying), and **Mosaic AI** (AI).',
      examObjective:
        'Describe the core components of the Databricks Intelligence Platform, including Mosaic AI, DeltaLive tables, Lakeflow Jobs, Data Intelligence Engine, Delta Lake, Unity Catalog, and Databricks SQL.',
    },
    {
      id: 'flash-dbu',
      type: 'flashcard',
      front: 'What is a **DBU**?',
      back: 'A **Databricks Unit** — the unit compute is metered in. A bigger or more capable warehouse consumes DBUs faster, so sizing and idle time are cost decisions.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You now have the vocabulary',
      points: [
        'Databricks = a **cloud platform** for storing and analyzing big data.',
        'A **lakehouse**: warehouse discipline over cheap open storage, one copy of the data.',
        'You log into a **workspace**, write in the **SQL editor**, run on a **SQL warehouse**.',
        'Compute is metered in **DBUs**.',
        'Your data stays in your company’s cloud storage — nothing is loaded "into" Databricks.',
      ],
      closing:
        'That is the ground floor. Next: the layer that names, secures, and tracks every table you will touch — Unity Catalog. 🏛️',
    },
  ],
}
