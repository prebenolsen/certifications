import type { Lesson } from '@/types/content'

/**
 * Lesson: what Lakeflow actually is, and its four components.
 * Maps to exam Section 1 (core components of the Data Intelligence Platform).
 *
 * Written because the rest of the certification says "Lakeflow Jobs",
 * "Lakeflow Connect" and "Lakeflow pipelines" dozens of times without ever
 * saying what **Lakeflow** is. This lesson is the definition those mentions
 * point back to. See docs/GLOSSARY.md.
 */
export const lakeflowOverviewLesson: Lesson = {
  id: 'lakeflow-overview',
  title: 'Lakeflow: the word in front of everything',
  summary:
    'Lakeflow is not one tool — it is the family name for how you ingest, transform, and orchestrate data on Databricks. Meet all four members before you meet them individually.',
  estimatedMinutes: 9,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'The prefix nobody explained',
      body: 'You open the Databricks console and start reading. **Lakeflow Jobs.** **Lakeflow Connect.** **Lakeflow pipelines.** The docs use the word constantly and never stop to say what it means.\n\nSo you guess. And because you guessed, every one of those pages reads like a list of unrelated features instead of one product with four parts.',
      atWork:
        'Half of "I find the Databricks docs confusing" is really "nobody told me the shape of the product."',
    },
    {
      id: 'analogy-suite',
      type: 'analogy',
      title: 'A family name, not a tool',
      body: '**Lakeflow** works like *Office*. Nobody opens "Office" — you open Word, or Excel, or PowerPoint. *Office* is the family name that tells you those three belong together and are meant to be used together.\n\nLakeflow is the same. You never run "Lakeflow". You run one of its four members — and the family name is what tells you they are designed to hand work to each other.',
      mapping: [
        { from: 'Office (the suite)', to: 'Lakeflow (the family)' },
        { from: 'Word, Excel, PowerPoint', to: 'Connect, Pipelines, Designer, Jobs' },
        { from: 'They share files and formats', to: 'They share Unity Catalog and hand off to each other' },
      ],
    },
    {
      id: 'concept-lakeflow',
      type: 'concept',
      title: 'What Lakeflow is',
      body: "**Lakeflow is Databricks' unified data engineering solution — one product family covering ingestion, transformation, and orchestration.**\n\nGetting data in, shaping it, and running the whole thing on a schedule used to mean three separate tools bolted together. Lakeflow puts all three under one roof, on one governance layer.",
      takeaways: [
        'Lakeflow = **ingestion + transformation + orchestration**, as one family.',
        'It is an umbrella name. There is no single "Lakeflow" button.',
        'Everything it produces is governed by **Unity Catalog**.',
      ],
    },
    {
      id: 'diagram-family',
      type: 'diagram',
      title: 'The four members, and where each one sits',
      spec: {
        kind: 'flow',
        steps: [
          { label: 'Sources', sublabel: 'files, databases, SaaS apps, events', tone: 'neutral' },
          { label: 'Lakeflow Connect', sublabel: 'get the data in', tone: 'brand' },
          { label: 'Lakeflow Pipelines', sublabel: 'shape it into trustworthy tables', tone: 'brand' },
          { label: 'Governed tables', sublabel: 'in Unity Catalog', tone: 'good' },
        ],
        arrows: ['ingest', 'transform', 'publish'],
      },
      caption:
        '**Lakeflow Jobs** is not a step in this line — it is the scheduler *around* it, deciding when each part runs and what happens when something fails. **Lakeflow Designer** is a visual way to build the middle step without writing the code yourself.',
    },
    {
      id: 'concept-connect',
      type: 'concept',
      title: 'Lakeflow Connect — getting data in',
      body: 'The **ingestion** member. Built-in connectors that pull data from databases, enterprise SaaS applications, files, and streaming sources.\n\n**Managed connectors** are fully hosted: point one at Salesforce or SQL Server, give it credentials, and it ingests — including picking up changes incrementally. **Standard connectors** cover files and message buses, where you configure more yourself.',
      takeaways: ['Module 2 is all about this one.'],
    },
    {
      id: 'concept-pipelines',
      type: 'concept',
      title: 'Lakeflow Pipelines — shaping the data',
      body: 'The **transformation** member. Instead of writing the steps in order, you declare **what each table should contain** as a query. The engine works out the dependency graph, processes only what is new, retries failures, and enforces your data-quality rules.\n\nIt is built on **Apache Spark Declarative Pipelines** — which is why you will also see it written as *Lakeflow Spark Declarative Pipelines*.',
      takeaways: [
        'You describe the **destination**, not the procedure.',
        'The engine derives the order, the incremental reads, and the retries.',
      ],
    },
    {
      id: 'mistake-names',
      type: 'mistake',
      title: 'This one has had three names',
      myth: '"Delta Live Tables, Lakeflow Spark Declarative Pipelines and Lakeflow pipelines are different products — I need to learn all three."',
      reality:
        'They are the **same product**, renamed twice.\n\n**Delta Live Tables (DLT)** → **Lakeflow Spark Declarative Pipelines** → **Lakeflow pipelines**.\n\nOlder blog posts and courses say *DLT*. The exam guide says *Lakeflow Spark Declarative Pipelines*. The console today says *Lakeflow pipelines*. Recognise all three; the concept underneath never changed.',
    },
    {
      id: 'concept-jobs',
      type: 'concept',
      title: 'Lakeflow Jobs — running it all',
      body: 'The **orchestration** member. A **job** is a graph of **tasks** — run a notebook, run a SQL query, refresh a dashboard, trigger a pipeline — with dependencies saying what must finish before what.\n\nIt handles the schedule, the retries, the alerts, and the run history. Formerly called **Databricks Workflows**.',
      takeaways: ['Module 4 is all about this one.'],
    },
    {
      id: 'concept-designer',
      type: 'concept',
      title: 'Lakeflow Designer — building it visually',
      body: 'The **visual** member: a drag-and-drop surface (you can also describe changes in plain language) for building data preparation flows.\n\nIt is not a separate engine and not a toy. What it produces is a real Lakeflow pipeline, governed by Unity Catalog like any other — it just spares you writing the code by hand.',
    },
    {
      id: 'mistake-jobs-vs-pipelines',
      type: 'mistake',
      title: 'The confusion that costs exam marks',
      myth: '"Lakeflow Jobs and Lakeflow Pipelines both run my data pipelines, so they are basically the same thing."',
      reality:
        'They answer **different questions**.\n\n• **Lakeflow Pipelines** answers *what should these tables contain?*\n• **Lakeflow Jobs** answers *when does this run, in what order, and what happens if it fails?*\n\nThey compose rather than compete: a job can contain a **pipeline task** that triggers a pipeline. You will see exam questions that hinge on exactly this split.',
    },
    {
      id: 'check-umbrella',
      type: 'truefalse',
      statement: 'Lakeflow is a single service you configure and run.',
      answer: false,
      explanation:
        'It is an **umbrella name** for four services — Connect, Pipelines, Designer, and Jobs. You always work with one of the members; "Lakeflow" tells you they belong to the same family.',
    },
    {
      id: 'mcq-which-member',
      type: 'mcq',
      question:
        'A team ingests Salesforce data hourly with a managed connector, refines it into silver and gold tables with data-quality rules, and needs the whole thing to run at 6am, retry twice on failure, and alert on-call if it still fails. Which Lakeflow components are doing which part?',
      options: [
        {
          id: 'a',
          text: 'Lakeflow Connect ingests · Lakeflow Pipelines refines · Lakeflow Jobs schedules, retries, and alerts.',
        },
        {
          id: 'b',
          text: 'Lakeflow Jobs ingests and refines · Lakeflow Connect schedules and alerts.',
        },
        {
          id: 'c',
          text: 'Lakeflow Pipelines does all three — ingestion, refinement, and scheduling.',
        },
        {
          id: 'd',
          text: 'Lakeflow Designer ingests and refines · Lakeflow Pipelines schedules and alerts.',
        },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'Each requirement lands on the member built for it: get it in, shape it, run it.',
        b: 'Backwards. Connect ingests; Jobs orchestrates.',
        c: 'Pipelines shapes tables, but it does not own the schedule, the retry policy, or the alerting — that is Jobs.',
        d: 'Designer is a visual way to *author* a pipeline, not a scheduler.',
      },
      explanation:
        'Map the verbs: **get the data in** → Connect. **Shape it** → Pipelines. **Decide when it runs and what happens on failure** → Jobs.',
      examObjective:
        'Understand the core components of the Databricks Data Intelligence Platform, such as its architecture, Delta Lake, and Unity Catalog.',
    },
    {
      id: 'flash-four',
      type: 'flashcard',
      front: 'Name the four members of Lakeflow and the job each one does.',
      back: '**Connect** — ingestion.\n**Pipelines** — transformation.\n**Designer** — visual authoring.\n**Jobs** — orchestration.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You now know what the word means',
      points: [
        'Lakeflow is a **family name**: ingestion, transformation, orchestration.',
        '**Connect** gets data in — managed and standard connectors.',
        '**Pipelines** declares what tables should contain; formerly *Delta Live Tables*.',
        '**Designer** builds pipelines visually; the output is a real pipeline.',
        '**Jobs** decides when things run, in what order, and what happens on failure.',
        'Pipelines answers *what*; Jobs answers *when*. They compose.',
      ],
      closing:
        'Every "Lakeflow ___" you meet from here is one of these four. Next: the machines that actually do the work. 💸',
    },
  ],
}
