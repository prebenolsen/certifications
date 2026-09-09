import type { Lesson } from '@/types/content'

/**
 * Lesson: what Databricks is, before anything else.
 * Maps to exam Section 1 (core components of the Data Intelligence Platform).
 *
 * The orientation lesson. Every certification should open with one: nothing
 * here is on the exam by itself, but a learner who does not know what the
 * product *is* reads every later lesson as a list of features. Starts from
 * genuinely zero — including the word "Databricks" itself.
 */
export const whatIsDatabricksLesson: Lesson = {
  id: 'what-is-databricks',
  title: 'What Databricks actually is',
  summary:
    'Before the exam topics: what the product is, how it relates to Spark, and the vendor-specific vocabulary the rest of the certification assumes — including the one word that is genuinely new.',
  estimatedMinutes: 8,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Start here',
      title: 'The tour that skips the introduction',
      body: 'Most Databricks material starts at full speed: catalogs, Lakeflow, Delta, DBUs. It assumes you already know what the product **is**.\n\nYou know data engineering. What you may not know is **this vendor**, so that is all this lesson covers. None of it is an exam question by itself; all of it is assumed by every exam question.',
      atWork:
        'The fastest way to feel lost in a familiar field is a vendor word nobody defined.',
    },
    {
      id: 'concept-databricks',
      type: 'concept',
      title: 'Databricks, in one sentence',
      body: '**Databricks is a cloud platform for storing and processing very large amounts of data — and for building analytics and AI on top of it.**\n\nThere is nothing to install. It runs in a browser, on top of a cloud provider you already use (AWS, Azure, or Google Cloud), and rents machines by the second for work that will not fit on one.',
      takeaways: [
        'A **cloud platform**, not software you install.',
        'It runs on top of AWS, Azure, or GCP — your data stays in your cloud account.',
        'Its job: **big data** processing, analytics, and AI in one place.',
      ],
    },
    {
      id: 'analogy-power',
      type: 'analogy',
      title: 'Metered, not owned',
      body: 'Compute here is metered like electricity: you describe the work, the platform starts machines, runs it, and **switches them off**. There is no idle fleet you have already paid for — which is why "just leave it running" is a cost decision, not a convenience. That commercial model shapes most of the design choices in this certification.',
      mapping: [
        { from: 'Owning a generator', to: 'A cluster you provisioned and pay for whether or not it is busy' },
        { from: 'Metered supply from the grid', to: 'Compute started on demand and auto-terminated' },
        { from: 'Kilowatt-hours on the bill', to: '**DBUs** — the unit Databricks meters you in' },
      ],
    },
    {
      id: 'concept-spark',
      type: 'concept',
      title: 'Its relationship with Apache Spark',
      body: 'You have met **Apache Spark**. What matters here is how tightly the platform is bound to it: Databricks was **founded by Spark’s creators**, and Spark is the engine underneath essentially everything you build in this certification.\n\nSo Databricks is not an alternative to Spark, and not a wrapper you could swap out. It is the managed platform *around* Spark — the compute, the storage governance, the orchestration, and the tuning that you would otherwise assemble yourself.',
      takeaways: [
        'Databricks is **managed Spark plus a platform**, not a replacement for it.',
        'Your PySpark and SQL skills transfer directly.',
        'When you tune a job here, you are tuning Spark.',
      ],
    },
    {
      id: 'concept-vocabulary',
      type: 'concept',
      title: 'The local names for things you already know',
      body: 'Cluster and notebook mean what they usually mean. This is the translation, plus the details that are genuinely Databricks-specific:\n\n• **Workspace** — the environment you log into. What matters: companies run **several** (dev, test, prod), and each one used to govern itself.\n• **Notebook** — as expected. It does nothing until a cluster is **attached**.\n• **Cluster** — as expected, but in two flavours: **all-purpose** (created by a person, shared by a team, lingers until stopped) and **job** (created for a scheduled run, deleted at the end, billed cheaper).',
      takeaways: [
        'The all-purpose/job split is a **billing** distinction as much as a technical one.',
      ],
    },
    {
      id: 'concept-dbu',
      type: 'concept',
      title: 'DBU — the one genuinely new word',
      body: 'A **DBU** (*Databricks Unit*) is the unit compute is metered in — roughly "how much processing did that consume". Not a machine-hour: a bigger or more capable cluster burns DBUs faster.\n\nCluster sizing, job clusters over all-purpose, auto-termination, **Photon** (the vectorized C++ query engine that runs the same SQL faster), Auto Loader versus `COPY INTO` — the exam presents these as technical choices and grades them as **cost** choices.',
      takeaways: [
        'DBUs, not hours. Capability affects the burn rate.',
        'An entire exam section exists because compute decisions are cost decisions.',
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
            label: 'Your cloud account (AWS / Azure / GCP)',
            sublabel: 'the storage and the machines are yours',
            tone: 'neutral',
          },
          {
            label: 'Data in cloud storage',
            sublabel: 'files, in open formats',
            tone: 'accent',
          },
          {
            label: 'Databricks platform',
            sublabel: 'Spark compute · governance · pipelines · AI',
            tone: 'brand',
          },
          {
            label: 'What you build',
            sublabel: 'notebooks, pipelines, dashboards, models',
            tone: 'good',
          },
        ],
      },
      caption:
        'Note the outermost layer: **your data never leaves your own cloud account.** Databricks provides the interface and the brains; the storage and the machines are billed to, and controlled by, you.',
    },
    {
      id: 'mistake-database',
      type: 'mistake',
      title: 'The most common first assumption',
      myth: '"Databricks is a database. I load my data *into* Databricks."',
      reality:
        'You do not load data into Databricks. Your data sits in **your own cloud storage**, in open file formats, and Databricks reads it where it lies.\n\nThe consequences: no vendor lock-in on the data, no migration to get started, and other tools can read the same files. "Databricks the database" is the wrong mental model; **"Databricks the engine and the rulebook over your storage"** is the right one.',
    },
    {
      id: 'concept-dip',
      type: 'concept',
      title: 'Why they call it a "Data Intelligence Platform"',
      body: 'You will see the phrase **Data Intelligence Platform** constantly, including in exam Section 1. It is Databricks’ name for the whole thing, and it is making a claim: that data engineering, analytics, and AI should live on **one** platform over **one** copy of the data.\n\nThe alternative — a warehouse for the analysts, a lake for the data scientists, pipelines copying between them — is what the next lesson is about.',
      takeaways: [
        '"Data Intelligence Platform" = the product as a whole.',
        'The claim: engineering + BI + AI, one platform, one copy of the data.',
      ],
    },
    {
      id: 'check-storage',
      type: 'truefalse',
      statement:
        'To use Databricks you must first upload your data into Databricks’ own storage system.',
      answer: false,
      explanation:
        'Your data stays in **your** cloud storage, in open formats. Databricks reads it in place. This is why adopting it does not require a migration — and why leaving does not require an export.',
    },
    {
      id: 'mcq-role',
      type: 'mcq',
      question:
        'A new engineer asks why the company uses Databricks rather than just running Python on a large virtual machine. Which answer best describes what Databricks provides?',
      options: [
        {
          id: 'a',
          text: 'It is a faster version of Python that runs the same single-machine code more quickly.',
        },
        {
          id: 'b',
          text: 'It is a managed platform that runs Apache Spark to split work across many machines on demand, with governance and tooling over data that stays in your own cloud storage.',
        },
        {
          id: 'c',
          text: 'It is a proprietary database you migrate your data into so it can be queried with SQL.',
        },
        {
          id: 'd',
          text: 'It is a dashboarding tool that connects to an existing data warehouse.',
        },
      ],
      correct: ['b'],
      optionFeedback: {
        a: 'Spark is not faster Python — it is a different execution model that spreads one job over many machines.',
        b: 'Managed Spark compute, on demand, governed, over open data in your own storage.',
        c: 'The opposite of how it works: data stays in your cloud storage in open formats.',
        d: 'It has dashboards, but that is a feature, not the point of the platform.',
      },
      explanation:
        'The single VM runs out of road when data outgrows one machine. Databricks provides **distributed compute you rent by the second**, plus the governance and tooling around it — over data you still own.',
      examObjective:
        'Understand the core components of the Databricks Data Intelligence Platform, such as its architecture, Delta Lake, and Unity Catalog.',
    },
    {
      id: 'flash-dbu',
      type: 'flashcard',
      front: 'What is a **DBU**, and why should a data engineer care?',
      back: 'A **Databricks Unit** — the unit compute is billed in. Every cluster decision (size, type, how long it stays up) is a cost decision measured in DBUs.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You now have the vocabulary',
      points: [
        'Databricks = a **cloud platform** for big-data processing, analytics, and AI.',
        'It is **managed Apache Spark plus a platform** — your Spark skills transfer directly.',
        '**All-purpose** vs **job** clusters is a billing distinction; **DBUs** are the meter.',
        'Your data stays in **your** cloud storage, in open formats — nothing is loaded "into" Databricks.',
        '**Data Intelligence Platform** is the name for the whole thing.',
      ],
      closing:
        'That is the ground floor. Next: the idea the whole platform is built on — the lakehouse. 🏠',
    },
  ],
}
