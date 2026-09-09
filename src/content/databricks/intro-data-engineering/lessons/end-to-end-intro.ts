import type { Lesson } from '@/types/content'

/**
 * Lesson 10: the capstone.
 *
 * Introduces nothing new. Its whole job is assembly: one realistic request,
 * traced through every component the course has explained, so the learner
 * leaves with a mental model rather than a vocabulary list.
 */
export const endToEndIntroLesson: Lesson = {
  id: 'end-to-end-intro',
  title: 'One pipeline, end to end',
  summary:
    'A single realistic example — files landing in storage, ending as a number on a dashboard — touching every component the course introduced.',
  estimatedMinutes: 7,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'The request',
      title: '"How many orders shipped yesterday, by region?"',
      body: 'Operations wants that number on a screen every morning, and wants to be able to ask follow-up questions without filing a ticket.\n\nThe shop\'s order system drops JSON files into cloud storage every hour. Nobody wants a person involved after today. Here is the whole path, with the name of the thing doing each step.',
      atWork:
        'Deliberately unglamorous. This shape — files in, one number out, hourly, unattended — is most of the job.',
    },
    {
      id: 'diagram-path',
      type: 'diagram',
      title: 'The whole path',
      spec: {
        kind: 'flow',
        steps: [
          { label: 'JSON files', sublabel: 'hourly, in cloud storage', tone: 'neutral' },
          { label: 'Auto Loader', sublabel: 'loads only the new files', tone: 'accent' },
          { label: 'Bronze table', sublabel: 'raw orders, as received', tone: 'warn' },
          { label: 'Silver table', sublabel: 'cleaned, deduplicated', tone: 'accent' },
          { label: 'Gold table', sublabel: 'shipments per region per day', tone: 'brand' },
          { label: 'Dashboard', sublabel: 'the number on the screen', tone: 'good' },
        ],
        arrows: ['ingest', 'unchanged', 'clean and conform', 'aggregate', 'publish'],
      },
      caption:
        'Five arrows. Every one of them is a component this course has already explained — and every box in the middle is a Delta table, named and permissioned by Unity Catalog.',
    },
    {
      id: 'concept-step-ingest',
      type: 'concept',
      title: 'Step 1 — get it in, without double-counting',
      body: '**Auto Loader** watches the storage folder and loads each new file exactly once into a **bronze** table, keeping track of what it has already seen. That last part is what makes an hourly schedule safe: a re-run after a failure does not re-count last hour\'s orders.\n\nThe bronze table holds the orders exactly as the shop sent them — including the two rows with a null region and the one order that appears in two files.\n\n*If the source were an application rather than files, this step would be a **Lakeflow Connect** connector instead.*',
      takeaways: [
        'Nothing is cleaned or rejected at this step, on purpose.',
        'Exactly-once loading is a property of the tool, not something you hand-roll.',
      ],
    },
    {
      id: 'concept-step-transform',
      type: 'concept',
      title: 'Step 2 — shape it',
      body: 'A **Lakeflow pipeline** declares the two tables that follow.\n\n**Silver**: orders with types corrected, duplicates removed by order id, and a data-quality rule attached — rows with no region are dropped and *counted*, so the pipeline reports "142 rows dropped this run" rather than silently losing them.\n\n**Gold**: one row per region per day, counting shipped orders.\n\nNothing here says which table to build first. The pipeline reads the queries, sees that gold depends on silver and silver on bronze, and derives the order itself — processing only the new data each run.',
      takeaways: [
        'You declared two destinations. The dependency order came for free.',
        'Dropped rows are reported per run, which is how you notice the source system changing.',
      ],
    },
    {
      id: 'concept-step-schedule',
      type: 'concept',
      title: 'Step 3 — run it, unattended',
      body: 'A **Lakeflow job** runs the pipeline hourly, retries once on failure, and emails the team if the retry also fails. It runs on a **job cluster** — created for the run, deleted at the end — so nothing is left billing overnight.\n\nEvery run is recorded: what it did, how long it took, whether the quality rule dropped more rows than usual. The 2am question from lesson 7 has an answer page.',
      takeaways: [
        'Retries and alerts are configured once, not remembered.',
        'Job clusters mean the compute exists only while the work does.',
      ],
    },
    {
      id: 'concept-step-serve',
      type: 'concept',
      title: 'Step 4 — put it in front of people',
      body: 'An **AI/BI dashboard** reads the gold table through a **SQL warehouse** and shows shipments by region, refreshed after each pipeline run. Operations opens it at 09:00 to an already-computed number.\n\nThe follow-up questions go to a **Genie space** pointed at the same gold and silver tables. "What about the week before?" gets answered without a ticket — and with the asker\'s own permissions, so nothing leaks in the process.',
      takeaways: [
        'The dashboard reads gold, never bronze.',
        'Ad-hoc questions get a curated surface instead of a new pipeline request.',
      ],
    },
    {
      id: 'concept-invisible',
      type: 'concept',
      title: 'What was true at every step',
      body: 'Three things ran underneath the whole path without appearing in it.\n\n**Every table was a Delta table.** So when the 04:00 run died halfway, no reader ever saw a partial table, and there was nothing to clean up before the retry.\n\n**Every table was governed by Unity Catalog.** One name each, permissions granted once, and lineage recorded automatically from bronze all the way to the dashboard.\n\n**Everything burned DBUs.** The pipeline, the job cluster, the warehouse behind the dashboard. Which is why the job cluster is deleted after each run and the warehouse stops when idle.',
      takeaways: [
        'Storage format, governance and billing are constants, not steps.',
      ],
    },
    {
      id: 'mcq-lineage',
      type: 'mcq',
      question:
        'Three months in, someone finds that the silver deduplication logic has been dropping legitimate orders. Which capability tells the engineer what is affected, and which one makes the fix possible?',
      options: [
        {
          id: 'a',
          text: 'Downstream lineage shows which gold tables and dashboards depend on silver; bronze still holds every original file, so silver and gold can be rebuilt.',
        },
        {
          id: 'b',
          text: 'The job run history shows what is affected; the source system is asked to resend three months of files.',
        },
        {
          id: 'c',
          text: 'Time travel on the dashboard shows what is affected; the pipeline is re-run against the current files only.',
        },
        {
          id: 'd',
          text: 'Nothing shows what is affected — silver would have to be rebuilt and consumers told to check their own reports.',
        },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'Lineage answers "what breaks", bronze answers "can we rebuild". Together they turn a crisis into an afternoon.',
        b: 'Run history shows whether runs succeeded, not who consumes the output — and most source systems cannot resend history.',
        c: 'Dashboards do not have time travel, and re-running against current files would not repair three months of data.',
        d: 'Lineage is recorded automatically, so the dependency list already exists.',
      },
      explanation:
        'This is the payoff of the two foundation lessons. **Lineage** makes the blast radius visible without asking around, and **bronze** makes reprocessing possible without the source system\'s cooperation.',
    },
    {
      id: 'check-source-resend',
      type: 'truefalse',
      statement:
        'Fixing a bug in the silver transformation logic requires the source system to resend the affected data.',
      answer: false,
      explanation:
        'Bronze holds every record as it originally arrived, so silver and gold can be rebuilt from data already in the lakehouse. That is precisely what the bronze layer is paid for.',
    },
    {
      id: 'flash-components',
      type: 'flashcard',
      front: 'In this pipeline, which component **shaped** the data, and which one **ran it on schedule**?',
      back: '**Lakeflow Pipelines** shaped it — declaring the silver and gold tables. **Lakeflow Jobs** ran it hourly, with a retry, an alert, and a recorded run history.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'The whole picture',
      points: [
        'Files land in cloud storage; **Auto Loader** or **Lakeflow Connect** loads them once into **bronze**.',
        'A **Lakeflow pipeline** declares **silver** (cleaned) and **gold** (aggregated); the engine derives the order.',
        'A **Lakeflow job** runs it on a schedule with retries, alerts and run history, on compute that is deleted afterwards.',
        'An **AI/BI dashboard** and a **Genie space** serve the result to people, at their own permission level.',
        'Underneath all of it: **Delta Lake** for safe writes, **Unity Catalog** for names, permissions and lineage, **DBUs** on the meter.',
      ],
      closing:
        'That is the platform, end to end. From here the certification tracks go deep on each piece — ingestion, transformation, orchestration, governance — and none of them will be a pile of unfamiliar names any more. 🎓',
    },
  ],
}
