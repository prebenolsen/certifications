import type { Lesson } from '@/types/content'

/**
 * Lesson 7: Lakeflow, the umbrella and its four components.
 *
 * Introduces **Lakeflow**, **Lakeflow Connect**, **Lakeflow Pipelines**,
 * **Lakeflow Designer**, **Lakeflow Jobs** and glosses **Auto Loader**.
 *
 * This is the densest lesson in the course, and deliberately so: "Lakeflow
 * something" is most of what data engineering on this platform looks like, and
 * a learner who never had the umbrella explained reads four unrelated product
 * names instead of one family.
 */
export const lakeflowIntroLesson: Lesson = {
  id: 'lakeflow-intro',
  title: 'Lakeflow: get it in, shape it, schedule it',
  summary:
    'One umbrella over four components — Connect, Pipelines, Designer and Jobs — and which job each of them does.',
  estimatedMinutes: 7,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'The 2am pipeline',
      body: 'Something is supposed to run at 2am: pull yesterday\'s orders, clean them, refresh three tables the dashboards read.\n\nAt 09:00 the dashboard looks plausible. Did the run finish? Did step four fail quietly and leave stale data behind? Did a retry load the same file twice? Nobody can say without opening logs.\n\nWriting the transformation was the easy half. Knowing that it ran, in the right order, exactly once, is the half that needs actual machinery.',
      atWork:
        '"It probably worked" is the state most hand-rolled pipelines live in permanently.',
    },
    {
      id: 'concept-umbrella',
      type: 'concept',
      title: 'Lakeflow is an umbrella, not a tool',
      body: '**Lakeflow** is the name for Databricks\' data engineering product family — everything to do with getting data in, shaping it, and running that on a schedule. It is not one thing you open.\n\nFour components sit under the name:\n\n**Lakeflow Connect** — get the data in.\n**Lakeflow Pipelines** — shape it.\n**Lakeflow Jobs** — schedule and orchestrate it.\n**Lakeflow Designer** — build the above visually instead of in code.\n\nWhenever you meet "Lakeflow *something*" in documentation, it is one of those four. That single sentence saves a lot of confusion.',
      takeaways: [
        'One family, four components, three jobs: ingest, transform, orchestrate.',
        'The names moved around: **Lakeflow Jobs** was called *Workflows*, and **Lakeflow Pipelines** was called *Delta Live Tables*.',
      ],
    },
    {
      id: 'diagram-family',
      type: 'diagram',
      title: 'The three jobs, in order',
      spec: {
        kind: 'flow',
        steps: [
          {
            label: 'Lakeflow Connect',
            sublabel: 'databases, apps, files → your tables',
            tone: 'accent',
          },
          {
            label: 'Lakeflow Pipelines',
            sublabel: 'clean, join, aggregate, check quality',
            tone: 'brand',
          },
          {
            label: 'Lakeflow Jobs',
            sublabel: 'run it on a schedule, in order, with retries',
            tone: 'good',
          },
        ],
        arrows: ['raw data lands', 'business-ready tables'],
      },
      caption:
        '**Lakeflow Designer** is not a fourth stage — it is a drag-and-drop way to build the middle one, for people who would rather not write the code.',
    },
    {
      id: 'concept-connect',
      type: 'concept',
      title: 'Lakeflow Connect — getting data in',
      body: '**Lakeflow Connect** is the ingestion component: ready-made connectors that pull data from where it is produced into your tables. Point one at Salesforce, SQL Server or Workday, say where it should land, and it keeps pulling — including picking up only what changed since last time.\n\nFor files rather than applications there is **Auto Loader**, which watches a cloud storage folder, notices new files as they arrive, and loads only those. It keeps track of what it has already seen, so re-running it never loads the same file twice.',
      takeaways: [
        'Connectors instead of custom extract scripts nobody maintains.',
        '**Auto Loader** = incremental file ingestion that cannot double-load.',
      ],
    },
    {
      id: 'concept-pipelines',
      type: 'concept',
      title: 'Lakeflow Pipelines — shaping it',
      body: '**Lakeflow Pipelines** is the transformation component, and it works differently from a script. You do not write the steps in order. You **declare what each table should contain**, as a query.\n\nFrom those declarations the engine works out the rest: which table depends on which, therefore what order to run in, how to process only the new data rather than everything, what to retry when a step fails, and whether the rows meet the data-quality rules you attached.\n\nThe practical effect is that the dependency graph is derived from your queries instead of maintained by hand — so it cannot fall out of date.',
      takeaways: [
        'You describe the destination; the engine derives the order and the incremental logic.',
        'Data-quality rules live in the pipeline, so failures are visible per run.',
      ],
    },
    {
      id: 'analogy-restaurant',
      type: 'analogy',
      title: 'Order the dish, do not write the recipe',
      body: 'Two ways to get dinner. Write out every step — heat the pan, then add oil, then the onions — and own every mistake in the ordering. Or state what you want on the plate and let a kitchen that has done it a thousand times sequence the work.\n\nThat is the difference between a script and a declarative pipeline. Same dinner; one of them keeps working when the menu changes.',
      mapping: [
        { from: 'Writing out every step in order', to: 'A hand-written script: you own the sequencing' },
        { from: 'Naming the dish you want', to: 'Declaring what each table should contain' },
        { from: 'The kitchen deciding the order', to: 'The engine deriving the dependency graph' },
        { from: 'A burnt pan, started again', to: 'A failed step, retried without redoing the rest' },
      ],
    },
    {
      id: 'concept-jobs',
      type: 'concept',
      title: 'Lakeflow Jobs — making it happen on time',
      body: '**Lakeflow Jobs** is the orchestration component: the thing that actually runs your work when it should.\n\nA job is a set of **tasks** with dependencies between them — task C waits for A and B. A task can be a notebook, a query, a pipeline or a dashboard refresh. Jobs run on a schedule or on a trigger, such as files appearing in storage.\n\nAnd it answers the 2am question: every run is recorded with what succeeded, what failed, how long it took and what it cost, with retries and alerts configured up front rather than reconstructed from logs.',
      takeaways: [
        'Tasks plus dependencies, so order and parallelism are declared, not implied.',
        'Run history and alerting come with it — that is most of the value.',
      ],
    },
    {
      id: 'concept-designer',
      type: 'concept',
      title: 'Lakeflow Designer — the visual door in',
      body: '**Lakeflow Designer** is a drag-and-drop surface — you can also describe what you want in plain language — for building data preparation flows without writing code.\n\nThe important part is what comes out of it: a real pipeline, governed by Unity Catalog like any other, not a private tool that has to be rebuilt properly later. It is a different front door to the same engine.',
      takeaways: [
        'Built for analysts and domain experts rather than engineers.',
        'The output is production pipeline code, not a separate parallel system.',
      ],
    },
    {
      id: 'mistake-one-product',
      type: 'mistake',
      title: 'Reading the name correctly',
      myth: '"Lakeflow is a product. I should be able to open Lakeflow and use it."',
      reality:
        'There is no single Lakeflow screen. It is a family name, the way "Office" is: you open a document or a spreadsheet, not "Office".\n\nWhy this matters when reading documentation: *Lakeflow Connect*, *Lakeflow Pipelines*, *Lakeflow Jobs* and *Lakeflow Designer* do four genuinely different things. Treating the prefix as one product makes every page you read about them contradict the last.',
    },
    {
      id: 'mcq-match',
      type: 'mcq',
      question:
        'JSON files land in cloud storage every hour. They need cleaning into two reporting tables, and the whole thing must run hourly with a retry and an alert if it fails. Which components do which part?',
      options: [
        {
          id: 'a',
          text: 'Lakeflow Connect ingests the files, Lakeflow Pipelines defines the two tables, Lakeflow Jobs runs it hourly with retries and alerting.',
        },
        {
          id: 'b',
          text: 'Lakeflow Jobs ingests the files, Lakeflow Connect defines the tables, Lakeflow Designer schedules the run.',
        },
        {
          id: 'c',
          text: 'Lakeflow Pipelines does all three — ingestion, transformation and scheduling are one product.',
        },
        {
          id: 'd',
          text: 'Lakeflow Designer ingests and transforms; nothing is needed for scheduling because pipelines run continuously.',
        },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'Ingest, transform, orchestrate — one component each, which is the whole point of the family.',
        b: 'Reversed: Connect ingests, Jobs orchestrates. Designer is an authoring surface, not a scheduler.',
        c: 'Pipelines transforms. Its runs are still triggered by Jobs.',
        d: 'Designer is a way to author a pipeline, and pipelines do not schedule themselves.',
      },
      explanation:
        'Mapping a requirement onto the right component is the practical skill here: **Connect** gets it in, **Pipelines** shapes it, **Jobs** runs it on time and tells you what happened.',
    },
    {
      id: 'flash-four',
      type: 'flashcard',
      front: 'Name the four components of **Lakeflow** and what each does.',
      back: '**Connect** — ingestion. **Pipelines** — transformation. **Jobs** — orchestration and scheduling. **Designer** — visual authoring that produces a real pipeline.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'One family, four jobs',
      points: [
        '**Lakeflow** is an umbrella name for the data engineering family, not a single tool.',
        '**Lakeflow Connect** ingests from applications and databases; **Auto Loader** ingests files incrementally.',
        '**Lakeflow Pipelines** is declarative: state what each table should contain, and the engine derives the order and the incremental runs.',
        '**Lakeflow Jobs** schedules the work, respects dependencies, retries, alerts, and keeps run history.',
        '**Lakeflow Designer** builds pipelines visually, and the output is a real pipeline.',
      ],
      closing:
        'You can move data now. Next: the convention that decides which tables anyone should trust. 🥇',
    },
  ],
}
