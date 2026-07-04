import type { Lesson } from '@/types/content'

/**
 * Lesson: observability with system tables, event logs, and profiling UIs.
 * Maps to exam Section 5 (system tables; Query Profiler & Spark UI; REST API/CLI;
 * declarative-pipeline event logs) and Section 9 (diagnostics).
 */
export const observabilityLesson: Lesson = {
  id: 'observability',
  title: 'Seeing what your platform is doing',
  summary:
    'System tables for cost/usage/audit, event logs for pipelines, and the Query Profiler/Spark UI for a single run — the four lenses on platform observability.',
  estimatedMinutes: 10,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'Who spent $9,000 last month?',
      body: 'Finance asks which team drove last month’s compute bill. Security asks who queried the customer table. Ops asks why a pipeline’s latency doubled. Three questions, three different observability tools — and none of them is "go click around the UI."\n\nKnowing which lens answers which question is the skill.',
      atWork:
        'Production data engineering lives or dies on observability. The exam names the specific tools for each job.',
    },
    {
      id: 'concept-system-tables',
      type: 'concept',
      title: 'System tables: query your platform',
      body: '**System tables** are Databricks-managed tables (in the `system` catalog) that record platform activity as *data you can SQL*: **billing/usage** (DBUs and cost by workspace/SKU), **audit** logs (who did what), **compute** utilization, query history, and more.\n\nBecause they’re tables, you answer cost, audit, and utilization questions with ordinary queries — and build dashboards and alerts on them.',
      takeaways: [
        'System tables expose usage, cost, audit, and compute as SQL.',
        'Answer "who/what/how much" with queries, not clicking.',
        'Foundation for cost dashboards and audit reports.',
      ],
    },
    {
      id: 'example-billing',
      type: 'example',
      title: 'Cost by SKU, last 30 days',
      intro: 'A billing question is just a GROUP BY:',
      code: {
        language: 'sql',
        content:
          "SELECT sku_name, SUM(usage_quantity) AS dbus\nFROM system.billing.usage\nWHERE usage_date >= current_date() - INTERVAL 30 DAYS\nGROUP BY sku_name\nORDER BY dbus DESC;",
      },
      explanation:
        'The `system.billing.usage` table turns "what drove the bill?" into a query. Join it to `system.access.audit` to attribute cost to users or jobs.',
    },
    {
      id: 'concept-event-logs',
      type: 'concept',
      title: 'Event logs: a pipeline’s black box',
      body: 'Every declarative pipeline writes an **event log** — a structured record of each update: which datasets ran, rows processed, **expectation pass/fail rates**, and errors. Query it to monitor data quality trends and diagnose a failed or slow pipeline run.\n\nIt’s the pipeline’s equivalent of system tables: history as queryable data.',
      takeaways: [
        'Declarative pipelines emit a queryable event log per update.',
        'It records dataset metrics, expectation results, and errors.',
        'Use it to track data-quality trends and debug runs.',
      ],
    },
    {
      id: 'concept-profilers',
      type: 'concept',
      title: 'Query Profiler & Spark UI: one run, deep',
      body: 'System tables and event logs give you the *fleet* view. To dissect a **single** execution, use the **Query Profiler** (Databricks SQL: per-stage bytes, joins, shuffle for one query) and the **Spark UI** (jobs/stages/tasks, skew, spill for a cluster job).\n\nRule of thumb: system tables/event logs to *spot* a problem across many runs; Query Profiler/Spark UI to *diagnose* one run.',
      takeaways: [
        'Query Profiler: one SQL query, per-stage metrics.',
        'Spark UI: one cluster job’s stages/tasks, skew, spill.',
        'Fleet view finds it; profilers explain it.',
      ],
    },
    {
      id: 'concept-api-cli',
      type: 'concept',
      title: 'REST API & CLI: observability in automation',
      body: 'The **Databricks REST API** and **CLI** expose run status, job/pipeline history, and metrics programmatically — so you can wire monitoring into external tooling (a status page, a PagerDuty check, a nightly report). Anything the UI shows about a run, the API can return for a script.',
      takeaways: [
        'REST API/CLI return job & pipeline run status/metrics.',
        'Integrate monitoring into external systems and scripts.',
        'The programmatic counterpart to the UIs.',
      ],
    },
    {
      id: 'mcq-observability',
      type: 'mcq',
      question:
        'You need a monthly report attributing compute cost to each team and listing who accessed a sensitive table. Which tool is the right source?',
      options: [
        { id: 'a', text: 'System tables — query system.billing.usage for cost and system.access.audit for access.' },
        { id: 'b', text: 'The Spark UI for the relevant cluster jobs.' },
        { id: 'c', text: 'The Query Profiler for each dashboard query.' },
        { id: 'd', text: 'The declarative-pipeline event log.' },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'Correct — billing/usage and audit system tables are the queryable source for cost attribution and access reporting.',
        b: 'The Spark UI dissects one job’s execution, not cross-fleet cost/audit.',
        c: 'The Query Profiler analyzes a single query’s plan, not billing or access history.',
        d: 'Event logs cover pipeline runs, not platform-wide cost and audit.',
      },
      explanation:
        'Cost attribution and access auditing across the platform are **system tables** questions (`system.billing.usage`, `system.access.audit`); the profilers/UIs and event logs are for single runs/pipelines.',
      examObjective:
        'Use system tables for observability over resource utilization, cost, auditing, and workload monitoring.',
    },
    {
      id: 'flash-lenses',
      type: 'flashcard',
      front: 'Which observability tool answers platform-wide cost and audit questions?',
      back: '**System tables** (e.g. `system.billing.usage`, `system.access.audit`) — queryable as SQL. Profilers/Spark UI and event logs are for single runs/pipelines.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You can now observe the platform',
      points: [
        'System tables expose cost, usage, audit, and compute as SQL.',
        'Declarative-pipeline event logs record metrics, quality, and errors per run.',
        'Query Profiler and Spark UI dissect a single query or job.',
        'REST API/CLI put run status and metrics into your automation.',
        'Fleet view (system tables/event logs) to spot; profilers to diagnose.',
      ],
      closing: 'Next: getting told the moment something goes wrong — alerting. 🔔',
    },
  ],
}
