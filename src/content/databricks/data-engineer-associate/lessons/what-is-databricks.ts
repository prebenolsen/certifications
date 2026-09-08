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
    'Before the exam topics: what the product is, what problem it was built for, and the handful of words — workspace, cluster, notebook, DBU — that every later lesson assumes you already know.',
  estimatedMinutes: 8,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Start here',
      title: 'The tour that skips the introduction',
      body: 'Most Databricks material starts at full speed: clusters, catalogs, Lakeflow, Delta. It assumes you already know what the product **is**.\n\nSo this lesson does the boring, useful thing first. None of it is an exam question on its own. All of it is assumed by every exam question.',
      atWork:
        'The fastest way to look lost in a new platform is to nod along to a word you never had defined. Get the vocabulary now and the next 24 lessons cost you less.',
    },
    {
      id: 'concept-databricks',
      type: 'concept',
      title: 'Databricks, in one sentence',
      body: '**Databricks is a cloud platform for storing and processing very large amounts of data — and for building analytics and AI on top of it.**\n\nYou do not install it. You open it in a browser, it runs on top of a cloud provider you already use (AWS, Azure, or Google Cloud), and it rents you computers by the second to do work that would not fit on one machine.',
      takeaways: [
        'A **cloud platform**, not software you install.',
        'It runs on top of AWS, Azure, or GCP — your data stays in your cloud account.',
        'Its job: **big data** processing, analytics, and AI in one place.',
      ],
    },
    {
      id: 'analogy-power',
      type: 'analogy',
      title: 'Renting the power station',
      body: 'Processing a few gigabytes is a laptop job. Processing a few *petabytes* needs hundreds of machines working together — and buying hundreds of machines to use them for twenty minutes a night is absurd.\n\nDatabricks is the utility company for that: you describe the work, it starts the machines, does it, and **switches them off**. You pay for the twenty minutes, not the hardware.',
      mapping: [
        { from: 'Buying a generator', to: 'Buying and running your own server cluster' },
        { from: 'Plugging into the grid', to: 'Starting compute on Databricks when you need it' },
        { from: 'Paying per kilowatt-hour', to: 'Paying per DBU — per second of compute used' },
      ],
    },
    {
      id: 'concept-spark',
      type: 'concept',
      title: 'Apache Spark: the engine underneath',
      body: '**Apache Spark** is the open-source engine that actually does the processing. Its trick is **splitting one big job across many machines**: your query is broken into pieces, the pieces run in parallel, and the results are combined.\n\nDatabricks was founded by Spark’s creators. You will write Spark code — in Python (**PySpark**) or SQL — throughout this certification, and Databricks runs it for you.',
      takeaways: [
        'Spark = the distributed processing engine.',
        'You write **PySpark** (Python) or **SQL**; Spark splits the work up.',
        'Databricks is the managed platform around Spark, not a replacement for it.',
      ],
    },
    {
      id: 'concept-vocabulary',
      type: 'concept',
      title: 'Four words the rest of the course assumes',
      body: '• **Workspace** — the environment you log into: your notebooks, jobs, dashboards, and settings. A company usually has several (dev, test, prod).\n• **Notebook** — a document of runnable code cells mixed with text. Where most work gets written.\n• **Cluster** — the group of machines that runs your code. Starting one is what turns a notebook from text into results.\n• **DBU** (*Databricks Unit*) — the unit you are billed in, roughly "how much compute did that consume." Bigger or longer-running clusters burn more.',
      takeaways: [
        'Workspace = where you work. Cluster = what does the work.',
        'A notebook without a running cluster attached does nothing.',
        'Cost tracks **DBUs**, so cluster choices are cost choices.',
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
        'You do not load data into Databricks. Your data sits in **your own cloud storage**, in open file formats, and Databricks reads it where it lies.\n\nThis matters more than it sounds. It means no vendor lock-in on the data, no giant migration to get started, and other tools can read the same files. "Databricks the database" is the wrong mental model; **"Databricks the engine and the rulebook over your storage"** is the right one.',
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
        '**Apache Spark** is the engine; you write PySpark or SQL.',
        '**Workspace** = where you work · **cluster** = what runs the code · **DBU** = how it is billed.',
        'Your data stays in **your** cloud storage, in open formats — nothing is loaded "into" Databricks.',
        '**Data Intelligence Platform** is the name for the whole thing.',
      ],
      closing:
        'That is the ground floor. Next: the idea the whole platform is built on — the lakehouse. 🏠',
    },
  ],
}
