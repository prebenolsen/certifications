import type { Lesson } from '@/types/content'

/**
 * Lesson: control flow in Lakeflow Jobs — retries, conditions, loops.
 * Maps to exam Section 4 (implement control flows: retries and conditional
 * tasks such as branching and looping).
 */
export const controlFlowLesson: Lesson = {
  id: 'control-flow',
  title: 'Control flow: retries, branches & loops',
  summary:
    'Making pipelines resilient and smart: automatic retries for flaky steps, if/else branching on results, and for-each loops over parameters.',
  estimatedMinutes: 9,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'The 2am page that shouldn’t exist',
      body: 'The nightly job failed at 2:07am. Cause: the vendor API returned one timeout. By the time you are awake and clicking “rerun”, it works fine — it always does.\n\nA single **retry policy** on that task would have handled it in thirty seconds, without waking anyone. Control flow is how jobs handle the real world on their own.',
      atWork:
        'Count how many of your team’s failure alerts end with “reran it, worked fine.” Each one is a missing retry policy.',
    },
    {
      id: 'concept-retries',
      type: 'concept',
      title: 'Retries: absorbing transient failure',
      body: 'Each task can declare **max retries** and a **wait between retries**. Fail → wait → try again, until success or the retry budget is spent. Only then does the task count as failed and block its downstream.\n\nRetries suit **transient** errors (timeouts, throttling, cloud hiccups). They do *not* fix deterministic bugs — a null-pointer error will fail identically five times. That is also why tasks should be **idempotent**: a retry after a partial write must not double-load data.',
      takeaways: [
        'Per-task setting: max retries + wait interval.',
        'For transient faults, not logic bugs.',
        'Retried tasks must be idempotent (safe to re-run).',
      ],
    },
    {
      id: 'concept-branching',
      type: 'concept',
      title: 'Branching: if/else inside the DAG',
      body: 'Two mechanisms steer execution:\n\n• An **If/else condition task** evaluates an expression (often a task value or parameter) and routes the run down the *true* or *false* branch — e.g. “row count > 0 → continue; else → skip to notify.”\n\n• **Run-if dependencies** let a task fire on conditions other than “all upstreams succeeded” — like *all done regardless of status*, or *at least one failed*. That is how you build cleanup and alerting steps that run **because** something broke.',
      takeaways: [
        'If/else task = data-driven branching.',
        'Run-if = react to upstream success/failure patterns.',
        'A failure-triggered notify task beats checking dashboards manually.',
      ],
    },
    {
      id: 'concept-loops',
      type: 'concept',
      title: 'Loops: for-each over parameters',
      body: 'A **For each** task runs a nested task once **per input value** — a list of regions, dates, or source systems — with a configurable number of iterations running in parallel.\n\nBefore this existed, teams cloned tasks per region (drift guaranteed) or looped *inside* a notebook (one giant opaque task). For-each keeps one definition, many parameterized runs, each visible and retryable individually.',
      takeaways: [
        'One task definition × N parameter values.',
        'Iterations can run in parallel (with a concurrency limit).',
        'Each iteration is individually observable and retryable.',
      ],
    },
    {
      id: 'diagram-controlflow',
      type: 'diagram',
      title: 'A resilient pipeline shape',
      spec: {
        kind: 'flow',
        steps: [
          { label: 'Ingest', sublabel: 'retries: 3, wait 5 min', tone: 'brand' },
          { label: 'If new data?', sublabel: 'condition task', tone: 'warn' },
          { label: 'For each region', sublabel: 'EU · US · APAC in parallel', tone: 'accent' },
          { label: 'Notify', sublabel: 'run-if: any failure', tone: 'bad' },
        ],
      },
      caption:
        'Retry the flaky edge, branch on the data, loop over the parameters, alert on failure.',
    },
    {
      id: 'mistake-retry-everything',
      type: 'mistake',
      title: 'Retries as a cure-all',
      myth: '“Set every task to 10 retries — the job will basically never fail.”',
      reality:
        'Deterministic bugs fail 10 times identically — you have added hours of delay before anyone is told. Worse, retrying **non-idempotent** tasks can double-write data. Size retries to the failure mode: flaky external calls get retries; pure transformations mostly should fail fast and page someone.',
    },
    {
      id: 'mcq-controlflow',
      type: 'mcq',
      question:
        'A pipeline must process 12 country datasets with identical logic, continue only if validation passes, and always send a summary message at the end — success or failure. Which combination implements this?',
      options: [
        { id: 'a', text: 'Twelve copies of the processing task; a validation notebook that throws to stop the job; a notify task depending on everything succeeding.' },
        { id: 'b', text: 'A for-each task over the 12 countries; an if/else condition task on the validation result; a notify task with a run-if dependency that fires regardless of upstream status.' },
        { id: 'c', text: 'One notebook with a Python for-loop, if-statement, and try/finally around everything.' },
        { id: 'd', text: 'Three separate jobs triggered manually in order.' },
      ],
      correct: ['b'],
      optionFeedback: {
        a: 'Cloned tasks drift, and a success-only dependency means no message exactly when you need one — on failure.',
        b: 'For-each for the fan-out, if/else for the gate, run-if (all done) for the always-notify.',
        c: 'Works, but is one opaque task: no per-country visibility, retries, or parallelism from the orchestrator.',
        d: 'Manual triggering is the 6am human scheduler again.',
      },
      explanation:
        'Each requirement maps to a control-flow primitive: repeat → **for each**, gate → **if/else**, always-run → **run-if** dependency.',
      examObjective:
        'Implement control flows (retries and conditional tasks such as branching and looping) using Lakeflow Jobs for pipeline orchestration.',
    },
    {
      id: 'tf-idempotent',
      type: 'truefalse',
      statement:
        'If a task appends data and then fails halfway, an automatic retry could write some rows twice — unless the task is designed to be idempotent.',
      answer: true,
      explanation:
        'Retries re-run the whole task. Idempotent design (e.g. COPY INTO, overwrite-by-partition, MERGE on keys) makes re-runs safe — which is why retries and idempotency are taught together.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'Your pipelines can now handle the real world',
      points: [
        'Retries absorb transient failures; keep retried tasks idempotent.',
        'If/else condition tasks branch on data; run-if reacts to failures.',
        'For-each fans one definition out over many parameter values.',
        'Failure-triggered notification tasks replace dashboard-watching.',
      ],
      closing: 'The job can run itself — but *when* should it run? Triggers next. ⏰',
    },
  ],
}
