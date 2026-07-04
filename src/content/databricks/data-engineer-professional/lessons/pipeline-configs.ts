import type { Lesson } from '@/types/content'

/**
 * Lesson: pipeline/job configuration and control flow.
 * Maps to exam Section 1 (control-flow operators; choose configs for
 * environments and dependencies, high memory for notebook tasks, and
 * auto-optimization to disallow retries).
 */
export const pipelineConfigsLesson: Lesson = {
  id: 'pipeline-configs',
  title: 'Configs, environments & control flow',
  summary:
    'Branch and loop with if/else and for-each tasks, pin per-environment dependencies, size high-memory tasks, and disable retries where a rerun would double-write.',
  estimatedMinutes: 9,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'The retry that double-charged',
      body: 'A task that posts payments failed on a transient error, auto-retried, and posted every payment twice. Elsewhere, a memory-hungry notebook keeps OOM-ing on a default cluster. Both are *configuration* problems, not code bugs.\n\nGetting environments, memory, retries, and control flow right is what makes a pipeline production-ready.',
      atWork:
        'The exam tests whether you pick configs deliberately — especially disabling retries for non-idempotent work.',
    },
    {
      id: 'concept-control-flow',
      type: 'concept',
      title: 'Control flow: if/else and for-each',
      body: 'Jobs express logic between tasks with **control-flow operators**. An **If/else** task branches on a condition (a job parameter, an upstream value) — run the backfill path or the incremental path. A **For-each** task fans a single task out over a list of inputs, running an iteration per element (optionally in parallel).\n\nThis keeps branching and looping in the orchestration layer instead of hand-rolled inside a notebook.',
      takeaways: [
        'If/else task = branch the DAG on a condition.',
        'For-each task = run one task per element of a list.',
        'Control flow lives in the job, not buried in notebook code.',
      ],
    },
    {
      id: 'concept-environments',
      type: 'concept',
      title: 'Per-environment dependencies',
      body: 'A task’s **environment** pins the libraries and versions it runs with. Declaring dependencies per environment (rather than mutating a shared cluster) makes runs reproducible and lets dev/staging/prod carry the same versions.\n\nOn serverless, this is an explicit environment spec; on classic compute, it’s the task’s cluster libraries — either way, pin versions so a run today matches a run last month.',
      takeaways: [
        'Pin libraries/versions in the task’s environment.',
        'Reproducible across dev/staging/prod.',
        'Avoid mutating shared clusters at runtime.',
      ],
    },
    {
      id: 'concept-high-memory',
      type: 'concept',
      title: 'High-memory tasks need the right compute',
      body: 'A task that builds a large in-memory structure, collects results, or does wide shuffles can exceed a general-purpose worker’s RAM and OOM. The fix is a **memory-optimized** instance type (more GB per core) for that task, or a cluster policy that guarantees it.\n\nMatch the compute to the task: don’t starve a memory-heavy notebook on a default node, and don’t overpay memory-optimized prices for a light task.',
      takeaways: [
        'Memory-heavy work → memory-optimized instances.',
        'OOM is often a compute-sizing problem, not a code bug.',
        'Size compute per task to balance reliability and cost.',
      ],
    },
    {
      id: 'concept-disallow-retries',
      type: 'concept',
      title: 'Disable retries for non-idempotent tasks',
      body: 'Automatic retries are great for *idempotent* work (rerunning produces the same result). But a **non-idempotent** task — one that appends rows, sends emails, or posts payments — will **duplicate its side effects** on retry.\n\nFor those, set the task’s max retries to **0** so a failure surfaces for investigation instead of silently double-writing. Make the work idempotent *or* disallow retries — never leave a non-idempotent task with automatic retries on.',
      takeaways: [
        'Retries safely repeat only idempotent work.',
        'Non-idempotent task + retry = duplicated side effects.',
        'Set retries to 0 for non-idempotent tasks.',
      ],
    },
    {
      id: 'tf-retries',
      type: 'truefalse',
      statement:
        'Enabling automatic retries is always safe because a retry just repeats the same work harmlessly.',
      answer: false,
      explanation:
        'Retries are only safe for idempotent tasks. A non-idempotent task (appends, payments, emails) duplicates its side effects on retry — disable retries or make it idempotent.',
    },
    {
      id: 'mcq-config',
      type: 'mcq',
      question:
        'A task appends transaction rows to a table and is not idempotent. It occasionally fails on transient cluster errors. How should it be configured?',
      options: [
        {
          id: 'a',
          text: 'Set max retries to 0 so a failure is surfaced instead of appending the rows twice.',
        },
        {
          id: 'b',
          text: 'Set max retries to 5 so transient errors self-heal.',
        },
        { id: 'c', text: 'Enable unlimited retries with a short backoff.' },
        { id: 'd', text: 'Move the append into a for-each loop to spread the writes out.' },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'Correct — a non-idempotent append must not auto-retry, or it double-writes; surface the failure and investigate (or make it idempotent).',
        b: 'Five retries means up to five duplicate appends.',
        c: 'Unlimited retries maximizes duplication risk.',
        d: 'A for-each loop doesn’t address idempotency and could multiply the writes.',
      },
      explanation:
        'Non-idempotent side effects and automatic retries don’t mix. Disable retries (max retries 0) unless the task is made idempotent.',
      examObjective:
        'Choose the appropriate configs for environments and dependencies, high memory for notebook tasks, and auto-optimization to disallow retries.',
    },
    {
      id: 'flash-idempotent',
      type: 'flashcard',
      front: 'When is it safe to leave automatic retries enabled on a task?',
      back: 'Only when the task is **idempotent** — rerunning it produces the same result with no duplicated side effects.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You can now configure a pipeline for production',
      points: [
        'If/else and for-each tasks keep branching/looping in the orchestration layer.',
        'Pin per-environment dependencies for reproducible runs.',
        'Give memory-heavy tasks memory-optimized compute to avoid OOM.',
        'Disable retries (max retries 0) for non-idempotent tasks.',
        'Retries are safe only for idempotent work.',
      ],
      closing: 'Next module: pulling every data format into the lakehouse. 📥',
    },
  ],
}
