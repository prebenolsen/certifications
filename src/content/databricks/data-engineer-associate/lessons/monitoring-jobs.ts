import type { Lesson } from '@/types/content'

/**
 * Lesson: monitoring Lakeflow Jobs — run history, statuses, DAG blockers.
 * Maps to exam Section 6 (identify trends using the run history view; monitor
 * pipeline health via job statuses, DAG task graphs, run times, failure rates).
 */
export const monitoringJobsLesson: Lesson = {
  id: 'monitoring-jobs',
  title: 'Monitoring jobs: catching problems before users do',
  summary:
    'Reading the run history for trends, the DAG view for upstream blockers, and turning “is tonight’s run OK?” into a two-minute check.',
  estimatedMinutes: 8,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'The job that failed slowly',
      body: 'Nothing ever *failed*. But over six weeks the nightly ETL crept from 40 minutes to 3 hours as data grew — until one morning it collided with the 8am dashboard refresh and the CFO saw yesterday’s numbers.\n\nGreen checkmarks are not health. **Trends** are health, and the run history view is where they live.',
      atWork:
        'The best data engineers look at run *durations* weekly, not just failure alerts.',
    },
    {
      id: 'concept-runhistory',
      type: 'concept',
      title: 'The run history view: your baseline',
      body: 'Every job keeps a **run history**: each run’s status, start time, and duration, visualized so you can compare **current execution times against the historical baseline**.\n\nWhat to look for:\n\n• **Creep** — durations growing run over run (data growth outpacing the design).\n• **Steps** — a sudden jump after a deploy (a regression shipped).\n• **Flapping** — intermittent failures that retries keep hiding (a flaky dependency on borrowed time).',
      takeaways: [
        'Compare against the baseline, not against “did it finish”.',
        'Creep, steps, and flapping are the three trend shapes to know.',
        'Rising durations are tomorrow’s SLA breach, visible today.',
      ],
    },
    {
      id: 'concept-dagview',
      type: 'concept',
      title: 'Diagnosing a run: statuses and the DAG',
      body: 'Inside one run, each task shows a status — **succeeded, failed, skipped/upstream-failed, running** — laid out on the task graph.\n\nThe reading skill: when several tasks are red, find the **furthest-upstream failure**. Everything downstream of it failed *because of it*, not on its own. Fix the blocker, then use **repair run** to re-execute only the failed/skipped tasks instead of the whole job.',
      takeaways: [
        'Trace red tasks upstream — fix causes, not casualties.',
        '“Upstream failed” ≠ broken task; it never got to run.',
        'Repair run re-executes only what failed — saves hours.',
      ],
    },
    {
      id: 'diagram-blocker',
      type: 'diagram',
      title: 'Reading a failed run',
      spec: {
        kind: 'flow',
        steps: [
          { label: 'Ingest ✗', sublabel: 'the actual failure', tone: 'bad' },
          { label: 'Transform —', sublabel: 'skipped: upstream failed', tone: 'warn' },
          { label: 'Gold —', sublabel: 'skipped: upstream failed', tone: 'warn' },
          { label: 'Dashboard —', sublabel: 'skipped', tone: 'neutral' },
        ],
      },
      caption:
        'Four “not-green” tasks, one real problem. Always debug the furthest-upstream red.',
    },
    {
      id: 'mistake-downstream',
      type: 'mistake',
      title: 'Debugging the casualty',
      myth: '“The gold-layer task is failing every night — something is wrong with the gold notebook.”',
      reality:
        'Check its *upstreams* first. A task whose input table is empty or late will fail with errors that look local (“table not found”, nulls everywhere) but whose cause is a silently misbehaving upstream task. The DAG view exists precisely to make “what ran before this?” a one-glance question.',
    },
    {
      id: 'mcq-monitoring',
      type: 'mcq',
      question:
        'A data engineer wants to know whether tonight’s pipeline run is abnormally slow, and if so, where the slowdown started appearing. Which approach answers both questions fastest?',
      options: [
        { id: 'a', text: 'Open the run history view, compare tonight’s duration against the historical baseline, and check which recent run started the trend.' },
        { id: 'b', text: 'SSH into the cluster and read Spark executor logs line by line.' },
        { id: 'c', text: 'Rerun the job and time it with a stopwatch.' },
        { id: 'd', text: 'Ask the team if anything feels slower lately.' },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'Baseline comparison is literally what the run history view renders — duration per run over time.',
        b: 'Logs explain *why* one run was slow; the history shows *whether and since when* — start there.',
        c: 'One more data point, no baseline, plus a redundant compute bill.',
        d: 'Vibes are not metrics.',
      },
      explanation:
        '“Abnormal” only means something relative to a baseline — and the run history view is the baseline, built in.',
      examObjective:
        'Identify trends in job performance using the run history view; monitor pipeline health by interpreting job statuses and DAG task graphs to spot upstream blockers.',
    },
    {
      id: 'flash-repair',
      type: 'flashcard',
      front: 'A 4-hour job failed at the second-to-last task. What re-executes only what’s needed?',
      back: 'A **repair run** — it reruns failed and skipped tasks only; the succeeded upstream work is kept.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You now monitor like an operator',
      points: [
        'Run history = durations vs baseline; watch for creep, steps, flapping.',
        'In a failed run, trace to the furthest-upstream red task.',
        '“Upstream failed” tasks are casualties, not causes.',
        'Repair runs resume from failure instead of restarting from zero.',
      ],
      closing: 'Pipelines observed. Next: making the data itself faster to query. 💧',
    },
  ],
}
