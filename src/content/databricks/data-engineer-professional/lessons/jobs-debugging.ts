import type { Lesson } from '@/types/content'

/**
 * Lesson: multi-task jobs, partial failure, repairs, and cost-aware scheduling.
 * Maps to exam Section 9 (analyze and remediate failed runs with repairs and
 * parameter overrides) and Section 1 (choose configs for cost/SLA).
 * Covers sample questions 9 (task failure semantics) and 5 (job cluster cost).
 */
export const jobsDebuggingLesson: Lesson = {
  id: 'jobs-debugging',
  title: 'When a task fails at 3am',
  summary:
    'How multi-task job dependencies and partial failures behave, how to repair a run without rerunning everything, and how to schedule for SLA at the lowest cost.',
  estimatedMinutes: 11,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'One task failed — what happened to the rest?',
      body: 'A three-task job runs overnight: task A, then B and C in parallel after A. You wake to find A and B succeeded, C failed. Did B’s work roll back? Did C leave half-written data?\n\nJobs are not one big transaction. Knowing exactly what a partial failure leaves behind is what lets you fix it fast — and safely.',
      atWork:
        'The exam tests whether you understand that tasks are independent units with no cross-task rollback.',
    },
    {
      id: 'concept-dag',
      type: 'concept',
      title: 'A job is a DAG of independent tasks',
      body: 'A Lakeflow Job is a **directed acyclic graph** of tasks. Each task declares which tasks it depends on; the scheduler runs a task once *all* its upstreams succeed, and runs independent tasks in parallel.\n\nCrucially, each task is its **own unit of execution**. There is no transaction spanning tasks — one task committing data has nothing to do with another task’s success.',
      takeaways: [
        'Tasks run when their upstream dependencies succeed.',
        'Independent tasks run in parallel.',
        'No transaction spans tasks — each stands alone.',
      ],
    },
    {
      id: 'concept-partial-failure',
      type: 'concept',
      title: 'A failed task does not roll back the others',
      body: 'If task C fails, tasks A and B — which already completed — **stay completed**; nothing rolls them back. And C itself isn’t atomic: a notebook that failed on line 50 may have already run the writes on lines 1–49. **Some of C’s operations may have committed.**\n\nDownstream tasks that depend on C are skipped, but siblings and ancestors are untouched.',
      takeaways: [
        'Completed tasks are not undone by a later failure.',
        'A failed task may have partially committed its own work.',
        'Only the failed task’s *downstream* tasks are skipped.',
      ],
    },
    {
      id: 'mcq-partial',
      type: 'mcq',
      question:
        'A job has tasks A, B, and C. B and C each depend on A and run in parallel. In a scheduled run A and B succeed but C fails. What is the resulting state?',
      options: [
        {
          id: 'a',
          text: 'A and B’s logic completed successfully; some operations in C may have completed.',
        },
        {
          id: 'b',
          text: 'No changes are committed anywhere; because C failed, all commits roll back automatically.',
        },
        {
          id: 'c',
          text: 'A and B completed; any changes made in C are automatically rolled back due to the failure.',
        },
        {
          id: 'd',
          text: 'Because tasks form a dependency graph, nothing commits until all tasks succeed.',
        },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'Correct — completed tasks stay done, and a failed task can leave partial writes behind; there is no cross-task transaction.',
        b: 'There is no job-wide transaction to roll back; A and B’s work is already committed.',
        c: 'Databricks does not auto-roll-back a failed task’s partial writes.',
        d: 'Tasks commit independently as they finish, not all-or-nothing at the end.',
      },
      explanation:
        'Tasks are independent units. A failure skips downstream tasks but never rolls back completed siblings — and the failed task may have partially committed.',
      examObjective:
        'Create a multi-task job with multiple dependencies (and understand partial-failure behavior).',
    },
    {
      id: 'concept-repair',
      type: 'concept',
      title: 'Repair reruns only what failed',
      body: 'When you fix the cause of C’s failure, you don’t rerun the whole job. **Repair run** re-executes only the failed and skipped tasks, reusing the successful results of A and B. You can also supply **parameter overrides** on the repair — e.g. point C at a corrected input path or a specific date.\n\nThis is faster and cheaper than a full rerun, and avoids redoing A/B’s side effects.',
      takeaways: [
        'Repair reruns only failed + downstream-skipped tasks.',
        'Successful tasks are not re-executed.',
        'Parameter overrides let you tweak inputs on the repair.',
      ],
    },
    {
      id: 'tf-repair',
      type: 'truefalse',
      statement:
        'Repairing a failed run re-executes every task in the job from the beginning.',
      answer: false,
      explanation:
        'Repair reuses the already-successful tasks and re-runs only the failed and skipped ones — saving time and cost, and avoiding duplicated side effects.',
    },
    {
      id: 'concept-job-cluster',
      type: 'concept',
      title: 'Job clusters cost less than always-on clusters',
      body: 'A **job cluster** is created when the run starts and terminated when it ends — you pay only for the minutes the job runs. An **all-purpose (interactive) cluster** stays up between runs; scheduling a short hourly job on one means paying for idle time all hour.\n\nFor a scheduled pipeline with a clear SLA, a fresh job cluster per run is almost always the lowest-cost choice.',
      takeaways: [
        'Job cluster: spins up per run, terminates after — pay for run time only.',
        'Interactive cluster: stays warm — you pay for idle hours too.',
        'Scheduled + short runtime ⇒ job cluster wins on cost.',
      ],
    },
    {
      id: 'mcq-cost',
      type: 'mcq',
      question:
        'Dashboards must refresh hourly; the ETL pipeline takes 10 minutes per run. Which configuration meets the SLA at the lowest cost?',
      options: [
        { id: 'a', text: 'Schedule the pipeline hourly on a dedicated all-purpose interactive cluster.' },
        { id: 'b', text: 'Schedule the pipeline hourly on a new job cluster.' },
        { id: 'c', text: 'Run a Structured Streaming job with a 60-minute trigger interval.' },
        { id: 'd', text: 'Trigger the job every time new data lands in the input directory.' },
      ],
      correct: ['b'],
      optionFeedback: {
        a: 'An interactive cluster stays up all hour — you pay for ~50 idle minutes every hour.',
        b: 'Correct — a job cluster runs for the 10 minutes then terminates, meeting the hourly SLA at minimal cost.',
        c: 'A streaming job keeps compute alive and adds complexity for a plain hourly batch need.',
        d: 'File-arrival triggering may run far more often than hourly, raising cost beyond the requirement.',
      },
      explanation:
        'A short, scheduled pipeline is cheapest on an ephemeral **job cluster** — you pay only for the 10 minutes of runtime, not idle time.',
      examObjective:
        'Choose the appropriate configs for environments and dependencies, high memory for notebook tasks, and auto-optimization to disallow retries.',
    },
    {
      id: 'flash-repair',
      type: 'flashcard',
      front: 'What does a "repair run" re-execute, and what does it reuse?',
      back: 'It re-runs only the **failed and skipped** tasks and **reuses** the successful ones — optionally with parameter overrides.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You can now handle a failed run',
      points: [
        'A job is a DAG of independent tasks; no transaction spans them.',
        'A failed task doesn’t roll back siblings and may partially commit its own work.',
        'Repair reruns only failed/skipped tasks and reuses successes.',
        'Parameter overrides let you correct inputs on the repair.',
        'Ephemeral job clusters beat always-on clusters for scheduled runs.',
      ],
      closing: 'Next: securing those workspace objects with least-privilege ACLs and secrets. 🔐',
    },
  ],
}
