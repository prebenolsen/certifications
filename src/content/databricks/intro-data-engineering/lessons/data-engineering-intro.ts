import type { Lesson } from '@/types/content'

/**
 * Lesson 1 of the introductory course: what the job is.
 *
 * Deliberately vendor-free — no product is named here, because a learner who
 * does not yet know what a pipeline is for cannot place a product inside one.
 * The platform arrives in the next lesson.
 */
export const dataEngineeringIntroLesson: Lesson = {
  id: 'data-engineering-intro',
  title: 'What data engineering is',
  summary:
    'The job in one sentence: get data from where it is produced to where it is useful, reliably and repeatedly — plus the words for the pieces of that.',
  estimatedMinutes: 6,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Start here',
      title: 'The question nobody can answer',
      body: 'A company sells things online. Orders sit in the shop\'s database. Returns sit in a spreadsheet the warehouse team keeps by hand. Advertising spend sits in three separate ad accounts.\n\nSomeone asks: **which products lose us money once returns are counted?**\n\nEvery number needed already exists. But no two systems agree on what a "product" is, none of them can be joined to the others, and one of them is a spreadsheet. The question is unanswerable — not because the analysis is hard, but because the data was never brought together.',
      atWork:
        'The analysis is an afternoon of work. Making the analysis *possible* is months of work. That gap is the job.',
    },
    {
      id: 'concept-job',
      type: 'concept',
      title: 'The job, in one sentence',
      body: '**Data engineering is getting data from where it is produced to where it is useful — reliably, repeatedly, and at sizes that do not fit on one machine.**\n\nEvery word after the dash is load-bearing.\n\n**Reliably** — it must not quietly produce wrong numbers. Silence is not success.\n**Repeatedly** — it runs again tonight without anyone remembering to start it.\n**At size** — the approach that works on a spreadsheet does not work on a billion rows.',
      takeaways: [
        'Data engineers build the plumbing; analysts and data scientists use what comes out of it.',
        'A pipeline that works once is a script. A pipeline that works every night is the deliverable.',
      ],
    },
    {
      id: 'concept-verbs',
      type: 'concept',
      title: 'Three verbs: ingest, transform, serve',
      body: 'Almost every data platform is these same three stages wearing different names.\n\n**Ingest** — copy data out of the systems that produce it (databases, applications, files, sensors) into one place you control.\n\n**Transform** — clean it, fix the types, remove duplicates, and reshape it so that "customer" means one thing everywhere.\n\n**Serve** — hand the result to whoever needs it: a dashboard, a report, a machine-learning model, another system.',
      takeaways: [
        'A **data pipeline** is one path through those three stages, running on a schedule.',
        'Most of the difficulty sits in *transform*, because that is where real-world messiness has to be decided on.',
      ],
    },
    {
      id: 'analogy-kitchen',
      type: 'analogy',
      title: 'A restaurant kitchen',
      body: 'Deliveries arrive at the back door in whatever crates the suppliers happen to use. Nothing goes straight to a customer: it is unpacked, washed, chopped and portioned first. Only then is a dish plated and carried out.\n\nA kitchen that skipped the prep station would be faster — right up until it served something raw.',
      mapping: [
        { from: 'Crates at the back door', to: 'Ingestion — data exactly as the source systems send it' },
        { from: 'The prep station', to: 'Transformation — cleaning and standardising' },
        { from: 'The plated dish', to: 'Serving — the dashboard or model the business consumes' },
        { from: 'Prep happens every morning, not once', to: 'A pipeline runs on a schedule, forever' },
      ],
    },
    {
      id: 'concept-batch-stream',
      type: 'concept',
      title: 'Batch or streaming',
      body: 'Data moves in one of two rhythms, and the choice shapes everything downstream.\n\n**Batch** — collect data for a while, then process the whole chunk at once. "Every night at 2am, load yesterday\'s orders." Simple, cheap, and by far the most common.\n\n**Streaming** — process each record shortly after it appears, continuously. "Flag a suspicious payment within two seconds." More expensive and harder to reason about, so it is used where the delay genuinely costs something.',
      takeaways: [
        'Batch is the default. Streaming is a requirement you have to justify.',
        'The question is never "which is better" but **"how stale is too stale?"**',
      ],
    },
    {
      id: 'diagram-shape',
      type: 'diagram',
      title: 'The shape of every pipeline',
      spec: {
        kind: 'flow',
        steps: [
          { label: 'Source systems', sublabel: 'apps, databases, files, sensors', tone: 'neutral' },
          { label: 'Ingest', sublabel: 'copy it in, unchanged', tone: 'accent' },
          { label: 'Store', sublabel: 'one place you control', tone: 'brand' },
          { label: 'Transform', sublabel: 'clean, join, reshape', tone: 'brand' },
          { label: 'Serve', sublabel: 'dashboards, reports, models', tone: 'good' },
        ],
        arrows: ['on a schedule', 'as it arrived', 'the real work', 'business-ready'],
      },
      caption:
        'Note that **storing comes before transforming**. Keeping the raw copy is what lets you fix a mistake in the transform logic later without asking the source system to resend everything.',
    },
    {
      id: 'mistake-just-moving',
      type: 'mistake',
      title: 'The assumption that makes the job look trivial',
      myth: '"Data engineering is writing some SQL to move files from A to B. Automate that and you are done."',
      reality:
        'Moving the data is the easy part, and it is not what the job is measured on. The work is everything around it: what happens when the file arrives twice, or arrives empty, or arrives with a new column nobody mentioned. Who is allowed to see the result. Which dashboards break if a column is renamed. How you prove yesterday\'s number was right.\n\nA pipeline is judged on how it behaves when things go wrong, because over a year, things go wrong.',
    },
    {
      id: 'check-finished',
      type: 'truefalse',
      statement:
        'A script that correctly loaded yesterday\'s file is a finished data pipeline.',
      answer: false,
      explanation:
        'It is a promising start. A pipeline has to survive the file arriving late, twice, malformed, or not at all — and it has to say so when that happens instead of failing quietly. **Repeatability and reliability are the deliverable**, not the one successful run.',
    },
    {
      id: 'flash-verbs',
      type: 'flashcard',
      front: 'What are the three stages every data pipeline is made of?',
      back: '**Ingest** (copy it in) → **Transform** (clean and reshape it) → **Serve** (hand it to dashboards, reports and models).',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'The job, in five lines',
      points: [
        'Data engineering moves data from where it is **produced** to where it is **useful**.',
        'Reliably, repeatedly, and at sizes past one machine — those constraints are the whole difficulty.',
        'Three stages: **ingest → transform → serve**.',
        '**Batch** processes a chunk on a schedule; **streaming** processes records as they arrive. Batch is the default.',
        'Store the raw copy before transforming it, so mistakes stay fixable.',
      ],
      closing:
        'That is the job. Next: the platform this course is about, and the problem it was built to solve. 🧭',
    },
  ],
}
