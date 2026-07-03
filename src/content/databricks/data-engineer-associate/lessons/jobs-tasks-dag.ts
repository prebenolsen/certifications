import type { Lesson } from '@/types/content'

/**
 * Lesson: Lakeflow Jobs fundamentals — jobs, tasks, and the DAG.
 * Maps to exam Section 4 (configure common tasks — notebook, SQL query,
 * dashboard, pipeline — and their dependencies using the DAG-based task graph).
 */
export const jobsTasksDagLesson: Lesson = {
  id: 'jobs-tasks-dag',
  title: 'Jobs, tasks & the DAG',
  summary:
    'How Lakeflow Jobs turns a pile of notebooks and queries into an orchestrated pipeline with dependencies, parallelism, and a picture you can read.',
  estimatedMinutes: 9,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'The 6am human scheduler',
      body: 'Every morning someone on your team runs the ingest notebook, waits, runs two transform notebooks, waits, refreshes the dashboard, and posts “pipeline done ✅” in Slack. When she is on vacation, the pipeline is too.\n\n**Lakeflow Jobs** is the platform’s orchestrator: it runs the steps, respects their order, retries failures, and keeps the history — no human scheduler required.',
      atWork:
        'If a pipeline’s “orchestrator” is a person and a checklist, that is the first thing to automate.',
    },
    {
      id: 'analogy-recipe',
      type: 'analogy',
      title: 'A job is a recipe with dependencies',
      body: 'Cooking a dinner: the sauce and the pasta can cook **in parallel**, but plating must wait for **both**. A recipe is not a straight list — it is a graph of steps with “ready when” conditions.\n\nA Lakeflow **job** is exactly that graph. Each **task** is a step; each **dependency** says what must finish first. The platform figures out what can run in parallel.',
      mapping: [
        { from: 'Recipe', to: 'Job' },
        { from: 'One step (boil pasta)', to: 'Task' },
        { from: '“Plate when sauce AND pasta are done”', to: 'Task dependency (fan-in)' },
      ],
    },
    {
      id: 'concept-tasks',
      type: 'concept',
      title: 'Tasks: the building blocks',
      body: 'A job is a set of **tasks**, each with a type matching what it runs:\n\n• **Notebook task** — run a notebook (Python/SQL/Scala).\n• **SQL task** — run a saved query or SQL file on a SQL warehouse.\n• **Dashboard task** — refresh a dashboard when upstream data is ready.\n• **Pipeline task** — trigger a Lakeflow declarative pipeline.\n\nPlus utility types (conditions, loops — next lesson). Each task can use its own compute.',
      takeaways: [
        'Task type = what it executes: notebook, SQL, dashboard, pipeline…',
        'One job freely mixes task types.',
      ],
    },
    {
      id: 'concept-dag',
      type: 'concept',
      title: 'The DAG: dependencies drawn as a graph',
      body: 'Task dependencies form a **DAG** — a directed acyclic graph. “Directed” = arrows point downstream; “acyclic” = no loops (a task cannot depend on itself, even indirectly).\n\nThe DAG is not just documentation. The scheduler **derives execution** from it: independent branches run in parallel, each task starts the moment its upstreams succeed, and a failure blocks only what depends on it.',
      takeaways: [
        'Dependencies, not order-in-a-list, define execution.',
        'Independent branches parallelize automatically.',
        'A failed task blocks only its downstream tasks.',
      ],
    },
    {
      id: 'diagram-dag',
      type: 'diagram',
      title: 'A typical nightly job',
      spec: {
        kind: 'flow',
        steps: [
          { label: 'Ingest', sublabel: 'notebook task', tone: 'brand' },
          { label: 'Transform orders ∥ customers', sublabel: 'two tasks in parallel', tone: 'accent' },
          { label: 'Build gold', sublabel: 'waits for both', tone: 'good' },
          { label: 'Refresh dashboard', sublabel: 'dashboard task', tone: 'neutral' },
        ],
        arrows: [null, 'fan-out / fan-in', null],
      },
      caption:
        'Fan-out: one upstream feeds several parallel tasks. Fan-in: a task waits for several upstreams.',
    },
    {
      id: 'mistake-onenotebook',
      type: 'mistake',
      title: 'The mega-notebook',
      myth: '“Simplest setup: put ingest, transform, and reporting in one big notebook and schedule that.”',
      reality:
        'One notebook = one task = **no DAG**. You lose parallelism (everything serial), granular retries (a failure at minute 55 reruns everything), and observability (one green/red light for five logical steps). Split logical steps into tasks and let the DAG do its job.',
    },
    {
      id: 'mcq-dag',
      type: 'mcq',
      question:
        'A job has tasks: A (ingest), B and C (transforms, both depending on A), and D (report, depending on B and C). B fails. What happens?',
      options: [
        { id: 'a', text: 'C is cancelled immediately since a task in the job failed.' },
        { id: 'b', text: 'C runs to completion (it only depends on A); D does not run because B failed.' },
        { id: 'c', text: 'D runs with only C’s output.' },
        { id: 'd', text: 'The whole job restarts from A.' },
      ],
      correct: ['b'],
      optionFeedback: {
        a: 'A failure blocks only *downstream* tasks — C does not depend on B.',
        b: 'The DAG localizes failure: independent branches finish; dependents are skipped.',
        c: 'D declared a dependency on B — the scheduler will not run it with missing upstreams.',
        d: 'Nothing restarts automatically; a repair run can rerun just B and D later.',
      },
      explanation:
        'Execution follows the arrows: each task needs *its* upstreams to succeed — nothing more, nothing less.',
      examObjective:
        'Configure common tasks (notebook, SQL query, dashboard, and pipeline tasks) and their dependencies using Lakeflow Jobs and its DAG-based task graph.',
    },
    {
      id: 'flash-dag',
      type: 'flashcard',
      front: 'What does each letter of DAG mean — and what does “acyclic” buy you?',
      back: '**D**irected (arrows point downstream) **A**cyclic (no loops) **G**raph. No cycles = every run is guaranteed to finish: there is always a valid order to execute tasks.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You now think in DAGs',
      points: [
        'Job = tasks + dependencies; the DAG drives execution.',
        'Task types: notebook, SQL, dashboard, pipeline, and control tasks.',
        'Independent branches run in parallel; failures block only downstream.',
        'Split logical steps into separate tasks — never one mega-notebook.',
      ],
      closing: 'Real pipelines fail sometimes. Next: retries, branches, and loops. 🔁',
    },
  ],
}
