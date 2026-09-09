import type { Lesson } from '@/types/content'

/**
 * Lesson 2: the product itself, from zero.
 *
 * Introduces **Databricks**, **Apache Spark** and **Data Intelligence
 * Platform**. Nothing else — the components each get their own lesson.
 */
export const whatIsDatabricksIntroLesson: Lesson = {
  id: 'what-is-databricks-intro',
  title: 'What Databricks is',
  summary:
    'A cloud platform for processing very large amounts of data, built around Apache Spark, that reads data sitting in your own cloud storage.',
  estimatedMinutes: 6,
  status: 'complete',
  cards: [
    {
      id: 'concept-databricks',
      type: 'concept',
      title: 'Databricks, in one sentence',
      body: '**Databricks is a cloud platform for storing and processing very large amounts of data — and for building analytics and AI on top of it.**\n\nThere is nothing to install. You open it in a browser. It runs inside a cloud account you already have (Amazon AWS, Microsoft Azure, or Google Cloud) and rents machines by the second for work that is too big for one computer.',
      takeaways: [
        'A **cloud platform**, not software you install or a server you buy.',
        'It runs on top of AWS, Azure or Google Cloud.',
        'Its purpose: large-scale data processing, analytics and AI in one place.',
      ],
    },
    {
      id: 'concept-spark',
      type: 'concept',
      title: 'The engine underneath: Apache Spark',
      body: 'One computer eventually runs out of memory, disk or patience. The fix is to use many computers at once — which is hard, because someone has to split the work up, hand out the pieces, and cope with a machine that dies halfway through.\n\n**Apache Spark** is the open-source engine that does exactly that. You write one query or one script; Spark breaks it into pieces, runs them in parallel across a group of machines, and combines the results. Databricks was founded by the people who created Spark, and Spark is what runs underneath almost everything on the platform.',
      takeaways: [
        'You write **Python** or **SQL**. Spark decides how to spread the work out.',
        'Databricks is *managed Spark plus a platform*, not a replacement for it.',
      ],
    },
    {
      id: 'analogy-truck',
      type: 'analogy',
      title: 'Unloading a truck',
      body: 'One person unloading a shipping container takes all day. Twenty people take twenty minutes — but only if someone decides who carries what, and notices when a box is dropped so it gets carried anyway.\n\nThat coordination is the hard part, and it is the part you do not have to write.',
      mapping: [
        { from: 'The container', to: 'A dataset far too large for one machine' },
        { from: 'Twenty people', to: 'The machines Databricks starts for you' },
        { from: 'The person assigning boxes', to: 'Apache Spark, splitting and scheduling the work' },
        { from: 'A dropped box, carried by someone else', to: 'A failed machine, its share retried elsewhere' },
      ],
    },
    {
      id: 'concept-storage',
      type: 'concept',
      title: 'Your data does not move in',
      body: 'This is the part that surprises people most. You do not load your data *into* Databricks.\n\nYour files stay in **your own cloud storage** — the same account and the same bucket your organisation already pays for — in open file formats that any tool can read. Databricks reads them where they lie and writes results back to the same place.\n\nSo adopting it does not require a migration, and leaving it does not require an export. The data was never hostage.',
      takeaways: [
        'Databricks provides the **engine and the rules**; your cloud account holds the data.',
        'Open formats mean other tools can read the same files.',
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
            label: 'Your cloud account (AWS / Azure / Google Cloud)',
            sublabel: 'the storage and the machines are billed to you',
            tone: 'neutral',
          },
          {
            label: 'Your data, in cloud storage',
            sublabel: 'files, in open formats',
            tone: 'accent',
          },
          {
            label: 'The Databricks platform',
            sublabel: 'Spark compute · governance · pipelines · AI',
            tone: 'brand',
          },
          {
            label: 'What you build',
            sublabel: 'pipelines, queries, dashboards, models',
            tone: 'good',
          },
        ],
      },
      caption:
        'Read it outside-in: everything happens **inside your own cloud account**. Databricks is the layer that makes the storage usable, not a separate place your data is sent to.',
    },
    {
      id: 'mistake-database',
      type: 'mistake',
      title: 'The most common first assumption',
      myth: '"Databricks is a database. Step one must be importing my data into it."',
      reality:
        'There is no import step, because there is nothing to import into. Databricks is an engine and a rulebook layered over storage you already own.\n\nThe practical difference: you can point it at twenty years of files and query them this afternoon, and a different tool can read those same files tomorrow. "Databricks the database" leads to wrong expectations about cost, lock-in and how work gets started.',
    },
    {
      id: 'concept-dip',
      type: 'concept',
      title: 'Why it is called a "Data Intelligence Platform"',
      body: 'You will meet the phrase **Data Intelligence Platform** constantly — it is the vendor\'s name for the product as a whole.\n\nThe name is making a claim. Historically, data engineering, business reporting and machine learning each had their own system, with copies of the data shuffling between them. The claim is that all three belong on **one platform**, over **one copy** of the data.\n\nWhether that claim holds is the subject of the next lesson.',
      takeaways: [
        '"Data Intelligence Platform" = the whole product, not one feature of it.',
        'The pitch: engineering, analytics and AI together, over a single copy of the data.',
      ],
    },
    {
      id: 'check-upload',
      type: 'truefalse',
      statement:
        'Before you can use Databricks, you have to upload your data into storage that Databricks owns.',
      answer: false,
      explanation:
        'Your data stays in **your** cloud storage in open formats, and Databricks reads it in place. That is why getting started does not require a migration project.',
    },
    {
      id: 'mcq-role',
      type: 'mcq',
      question:
        'A colleague asks why the company pays for Databricks instead of running the same Python script on one very large virtual machine. Which answer is right?',
      options: [
        {
          id: 'a',
          text: 'Databricks is a faster version of Python, so the same single-machine script finishes sooner.',
        },
        {
          id: 'b',
          text: 'Databricks runs Apache Spark, which splits one job across many machines started on demand, and adds governance and tooling over data that stays in your own cloud storage.',
        },
        {
          id: 'c',
          text: 'Databricks is a database you migrate your data into so that it can be queried with SQL.',
        },
        {
          id: 'd',
          text: 'Databricks is a dashboard tool that connects to a data warehouse someone else maintains.',
        },
      ],
      correct: ['b'],
      optionFeedback: {
        a: 'Spark is not a faster Python. It is a different way of executing work — spread across machines rather than run on one.',
        b: 'Distributed compute rented by the second, plus the governance and tooling around it, over data you still own.',
        c: 'The opposite of how it works — there is no migration into Databricks.',
        d: 'It does include dashboards, but that is one surface on top of the platform, not what it is.',
      },
      explanation:
        'One big machine works until the data outgrows it, and it is idle (and billed) the rest of the time. Databricks provides **many machines on demand** plus everything needed to run them safely against shared data.',
    },
    {
      id: 'flash-spark',
      type: 'flashcard',
      front: 'What does **Apache Spark** do, in one line?',
      back: 'It splits one big job into pieces, runs them in parallel across many machines, and combines the results — including recovering when a machine fails.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'The ground floor',
      points: [
        '**Databricks** is a cloud platform for large-scale data processing, analytics and AI, used through a browser.',
        'It is built on **Apache Spark**, which spreads one job across many machines.',
        'It runs inside **your** cloud account, and your data stays in **your** storage in open formats.',
        'Nothing is loaded "into" Databricks — the platform reads files where they already are.',
        '**Data Intelligence Platform** is the name for the product as a whole.',
      ],
      closing:
        'Next: the idea the whole platform is built around, and the two systems it was meant to replace. 🏠',
    },
  ],
}
