import type { Lesson } from '@/types/content'

/**
 * Lesson: alerting on data quality and job health.
 * Maps to exam Section 5 (SQL Alerts to monitor data quality; Jobs UI and Jobs
 * API to set up notifications for job status and performance issues).
 */
export const alertingLesson: Lesson = {
  id: 'alerting',
  title: 'Being told before users complain',
  summary:
    'SQL Alerts watch a metric and notify when it crosses a threshold; job notifications fire on failure, success, or a run running too long.',
  estimatedMinutes: 8,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'The dashboard was wrong all weekend',
      body: 'A source stopped sending data Friday night. The pipeline "succeeded" (it processed zero rows), so no failure fired. Monday, an executive noticed the dashboard flatlined — before your team did.\n\nMonitoring shows you what happened *if you look*. **Alerting** comes to you. Both a broken job *and* silently bad data need to reach a human automatically.',
      atWork:
        'The exam splits this in two: SQL Alerts for data quality, job notifications for run health.',
    },
    {
      id: 'concept-sql-alerts',
      type: 'concept',
      title: 'SQL Alerts watch a metric',
      body: 'A **SQL Alert** runs a query on a schedule and **notifies when the result meets a condition** — e.g. row count = 0, null rate > 5%, or freshness lag beyond an hour. It’s how you catch *data-quality* problems that don’t crash the pipeline.\n\nThe query defines "what does bad look like?"; the alert delivers it to email/Slack/webhook when it’s true.',
      takeaways: [
        'SQL Alert = scheduled query + threshold + notification.',
        'Catches silent data-quality issues (no rows, high nulls, stale).',
        'A green pipeline can still trip a SQL Alert.',
      ],
    },
    {
      id: 'example-alert',
      type: 'example',
      title: 'A freshness alert',
      intro: 'The alert query returns a number the condition tests:',
      code: {
        language: 'sql',
        content:
          "SELECT timestampdiff(\n  MINUTE, MAX(ingest_ts), current_timestamp()\n) AS minutes_stale\nFROM bronze.events;\n-- Alert condition: minutes_stale > 60  →  notify #data-oncall",
      },
      explanation:
        'The query yields `minutes_stale`; the alert triggers when it exceeds 60. This fires even though the ingestion job reported success — data-quality monitoring the job status can’t provide.',
    },
    {
      id: 'concept-job-notifications',
      type: 'concept',
      title: 'Job notifications watch run health',
      body: 'On a Lakeflow **Job** you configure **notifications** for lifecycle events: **on failure**, **on success**, and — importantly — when a run **exceeds a duration threshold** (a performance/SLA warning). Set these in the Jobs UI or via the **Jobs API** for automation, and route them to email, Slack, PagerDuty, or a webhook.\n\nDuration alerts catch the "still running, not yet failed" degradation that plain failure alerts miss.',
      takeaways: [
        'Notify on failure, success, and long-running (duration) events.',
        'Configure in the Jobs UI or via the Jobs API.',
        'Duration alerts flag SLA/performance drift before a failure.',
      ],
    },
    {
      id: 'tf-success',
      type: 'truefalse',
      statement:
        'Because a pipeline reports success, job status notifications alone are enough to guarantee the data it produced is correct.',
      answer: false,
      explanation:
        'A job can succeed while producing empty or bad data. Job notifications cover *run health*; **SQL Alerts** on the data itself catch quality problems a successful run can hide.',
    },
    {
      id: 'mcq-alerting',
      type: 'mcq',
      question:
        'A pipeline occasionally "succeeds" while writing zero rows because an upstream feed dropped. You want to be paged when the output is empty or stale. What should you set up?',
      options: [
        {
          id: 'a',
          text: 'A SQL Alert on a freshness/row-count query that notifies when the metric crosses a threshold.',
        },
        {
          id: 'b',
          text: 'A job on-failure notification, since that covers all problems.',
        },
        { id: 'c', text: 'Nothing — check the dashboard manually each morning.' },
        { id: 'd', text: 'A job on-success notification to confirm each run finished.' },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'Correct — a SQL Alert evaluates the data itself (row count/freshness) and fires even when the run succeeded.',
        b: 'On-failure won’t fire — the run succeeded; the *data* is the problem.',
        c: 'Manual checks are exactly what let the weekend outage go unnoticed.',
        d: 'On-success confirms the run ran, not that the data is non-empty or fresh.',
      },
      explanation:
        'Silent data-quality failures on a "successful" run are the domain of **SQL Alerts**; job notifications monitor run health, not data content.',
      examObjective:
        'Use SQL Alerts to monitor data quality, and the Jobs UI/API to set up notifications for job status and performance issues.',
    },
    {
      id: 'flash-two-alerts',
      type: 'flashcard',
      front: 'Which alert type catches "job succeeded but data is empty/stale," and which catches "run failed or ran too long"?',
      back: '**SQL Alerts** catch data-quality issues; **job notifications** catch run failure/success and long-running (duration) issues.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You can now alert on both data and jobs',
      points: [
        'SQL Alerts: scheduled query + threshold → notify on data-quality issues.',
        'They fire even when a pipeline reports success.',
        'Job notifications: on failure, success, and exceeded-duration.',
        'Configure job alerts in the Jobs UI or via the Jobs API.',
        'Use both — run health and data quality are different failures.',
      ],
      closing: 'Next: shipping all of this safely with Asset Bundles and Git. 🚀',
    },
  ],
}
