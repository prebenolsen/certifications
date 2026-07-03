import type { Lesson } from '@/types/content'

/**
 * Lesson: job triggers — scheduled, file arrival, table update.
 * Maps to exam Section 4 (implement job schedules with an understanding of
 * trigger types; choose between time-based and data-driven triggers).
 */
export const triggersSchedulingLesson: Lesson = {
  id: 'triggers-scheduling',
  title: 'Triggers: when should the job run?',
  summary:
    'Cron schedules vs file-arrival vs table-update triggers — and the freshness-vs-waste tradeoff that decides between time-based and data-driven.',
  estimatedMinutes: 8,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'The job that runs on nothing',
      body: 'A partner delivers files “sometime during the night.” To be safe, your job runs hourly from midnight. Most runs find **nothing** and burn compute anyway; and on the night the files land at 06:59, the 06:00 run misses them and data is an hour stale.\n\nPolling on a clock for an event-shaped problem gives you the worst of both: waste *and* staleness.',
      atWork:
        'Look at your job run history: how many runs processed zero new records? Each is a hint the trigger type is wrong.',
    },
    {
      id: 'concept-scheduled',
      type: 'concept',
      title: 'Scheduled triggers: run on a clock',
      body: 'The classic: a **cron schedule** (“every day 03:00”, “every 15 minutes”). Right when the *deadline* is time-shaped — “finance needs this by 8am” — or when upstream data arrives on a known rhythm.\n\nRelated knob: **continuous** mode keeps a job always running for genuinely streaming workloads.',
      takeaways: [
        'Cron = predictable, deadline-driven runs.',
        'Best when the business requirement is a time (“ready by 8am”).',
      ],
    },
    {
      id: 'concept-datadriven',
      type: 'concept',
      title: 'Data-driven triggers: run when data shows up',
      body: 'Two triggers fire on **data events** instead of the clock:\n\n• **File arrival**: watches a storage location; new file(s) → run. No more empty polling runs.\n\n• **Table update**: watches Delta table(s); new commit → run. This chains pipelines *by data dependency*: “rebuild gold whenever silver changes,” regardless of who or what changed it.',
      takeaways: [
        'File arrival: triggered by files landing in storage.',
        'Table update: triggered by commits to Delta tables.',
        'Zero empty runs; latency = however soon data arrives.',
      ],
    },
    {
      id: 'diagram-triggers',
      type: 'diagram',
      title: 'Time-based vs data-driven',
      spec: {
        kind: 'compare',
        left: {
          label: 'Time-based (cron)',
          tone: 'brand',
          items: [
            'Fires on a schedule, data or not',
            'Predictable load & deadlines',
            'Risk: empty runs, or just-missed data',
          ],
        },
        right: {
          label: 'Data-driven (file / table)',
          tone: 'good',
          items: [
            'Fires when new data exists',
            'No wasted runs; fresh as the source',
            'Risk: unpredictable timing & compute spikes',
          ],
        },
      },
      caption:
        'Deadline-shaped requirement → clock. Event-shaped requirement → data trigger.',
    },
    {
      id: 'mistake-poll',
      type: 'mistake',
      title: 'Polling for events',
      myth: '“Files arrive irregularly, so we run every 10 minutes to check — that’s basically event-driven.”',
      reality:
        'That is polling: 144 runs a day, most doing nothing, each costing startup time and compute — and still up to 10 minutes stale. A **file arrival trigger** is the actual event-driven answer: zero empty runs, and processing starts when the data lands.',
    },
    {
      id: 'mcq-triggers',
      type: 'mcq',
      question:
        'Pick the right trigger: (1) a report that must be on the CFO’s desk at 07:00 daily, (2) partner CSVs landing in S3 at unpredictable times, (3) a gold table that must be rebuilt whenever its silver source table gets new data.',
      options: [
        { id: 'a', text: '1 → cron schedule · 2 → file arrival trigger · 3 → table update trigger' },
        { id: 'b', text: '1 → file arrival · 2 → cron every 5 minutes · 3 → continuous mode' },
        { id: 'c', text: '1 → table update · 2 → table update · 3 → cron schedule' },
        { id: 'd', text: 'All three → cron schedules with generous margins' },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'Deadline → clock; landing files → file arrival; upstream table commits → table update.',
        b: 'The CFO deadline is time-shaped, not event-shaped; 5-minute polling is the empty-runs anti-pattern.',
        c: 'Reversed: the deadline case is the one that belongs on a clock.',
        d: '“Generous margins” = stale data and wasted runs, formalized.',
      },
      explanation:
        'Read the requirement’s shape: a **time** in it → scheduled; an **event** in it (“when files land”, “when the table changes”) → the matching data-driven trigger.',
      examObjective:
        'Implement job schedules with an understanding of trigger types (scheduled, file arrival, and table update); choose between time-based and data-driven triggers.',
    },
    {
      id: 'flash-triggers',
      type: 'flashcard',
      front: 'Name the three Lakeflow Jobs trigger types and what fires each.',
      back: '**Scheduled** (cron time) · **File arrival** (new files in a storage path) · **Table update** (new commits to Delta tables).',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'Your jobs now start themselves — sensibly',
      points: [
        'Cron schedules serve time-shaped requirements (deadlines).',
        'File arrival triggers serve landing-zone ingestion.',
        'Table update triggers chain pipelines by data dependency.',
        'Polling on a clock for events wastes compute *and* freshness.',
      ],
      closing: 'Orchestration done. Next module: shipping these pipelines like software. 🚀',
    },
  ],
}
