import type { Lesson } from '@/types/content'

/**
 * Lesson: SQL alerts.
 * Maps to exam Section 6 (configure an alert with a desired threshold and
 * destination). Covers sample question 5.
 */
export const alertsLesson: Lesson = {
  id: 'alerts',
  title: 'Alerts: being told, not watching',
  summary:
    'A query, a threshold, a destination, and a schedule — the four parts of an alert, and why a dashboard nobody is looking at is not monitoring.',
  estimatedMinutes: 8,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'The dashboard nobody was looking at',
      body: 'Sensor temperatures are on a dashboard that refreshes every 15 minutes. On Saturday afternoon a reading climbs past the safe threshold and stays there. The dashboard shows it perfectly — to an empty office.\n\nA dashboard answers a question when someone asks it. An **alert** comes to you when nobody is asking.',
      atWork:
        'If the plan for noticing a problem is "someone will see it on the dashboard", there is no plan.',
    },
    {
      id: 'concept-anatomy',
      type: 'concept',
      title: 'The four parts of an alert',
      body: 'A **SQL alert** is assembled from four things:\n\n• A **query** that returns the value to watch — an average, a row count, minutes since the last load.\n• A **condition**: which column, which comparison, which **threshold** (`> 80`).\n• A **destination**: email, Slack, a webhook, or another configured channel.\n• A **schedule**: how often the query runs and the condition is evaluated.\n\nWhen the condition is true, the alert triggers and notifies the destination.',
      takeaways: [
        'Query → condition/threshold → destination → schedule.',
        'The query defines what "bad" looks like as a number.',
        'The schedule decides how quickly you can possibly hear about it.',
      ],
    },
    {
      id: 'example-alert',
      type: 'example',
      title: 'A threshold alert query',
      intro:
        'The query returns one number the condition can test — here, the average of the last 15 minutes:',
      code: {
        language: 'sql',
        content:
          "SELECT avg(temperature_c) AS avg_temp_15m\nFROM main.iot.sensor_readings\nWHERE reading_ts >= current_timestamp() - INTERVAL 15 MINUTES;\n\n-- Alert condition: avg_temp_15m > 90\n-- Destination:     #plant-oncall (Slack) + email\n-- Schedule:        every 5 minutes",
      },
      explanation:
        'Keep the alert query small and specific: one row, one column, a number the condition can compare. A query returning thousands of rows makes the threshold ambiguous and the alert expensive to run every few minutes.',
    },
    {
      id: 'concept-schedule-noise',
      type: 'concept',
      title: 'Frequency, and not crying wolf',
      body: 'The schedule sets your worst-case detection delay: a five-minute schedule means you learn about a breach within five minutes, and it costs a small query every five minutes all week.\n\nThe harder problem is noise. A threshold set too tight fires constantly, people mute the channel, and the alert becomes worse than nothing because it now provides false comfort. Set the threshold where a human genuinely needs to act, and alert on a smoothed value — a 15-minute average rather than a single spiky reading.',
      takeaways: [
        'The schedule bounds how fast you can possibly react.',
        'An alert that fires constantly gets muted — and then you have nothing.',
        'Alert on an aggregate over a window, not on one raw reading.',
      ],
    },
    {
      id: 'concept-vs-dashboard',
      type: 'concept',
      title: 'Alerts versus dashboards',
      body: 'They answer different questions. A **dashboard** answers *how are things?* when a person asks. An **alert** answers *has something crossed a line?* whether or not anyone is asking.\n\nThey are not alternatives, and they usually share the same SQL: the query behind the chart is often exactly the query the alert should watch. Build the dashboard for exploration; add the alert for the two or three numbers that must never drift unnoticed.',
      takeaways: [
        'Dashboard = pull, when someone looks. Alert = push, when a threshold breaks.',
        'They often share the same underlying query.',
        'Alert on the few numbers that genuinely require action.',
      ],
    },
    {
      id: 'mcq-alert',
      type: 'mcq',
      question:
        'Sensor readings are processed continuously. The team must be notified immediately if the average temperature over the last 15 minutes exceeds a critical threshold. What should the analyst do?',
      options: [
        {
          id: 'a',
          text: 'Create a SQL alert on a query calculating the 15-minute average temperature, triggering above the threshold and notifying email and Slack.',
        },
        {
          id: 'b',
          text: 'Create a dashboard with a temperature chart and refresh it manually every 15 minutes.',
        },
        {
          id: 'c',
          text: 'Run a job periodically and have someone review the output logs for threshold breaches.',
        },
        {
          id: 'd',
          text: 'Configure the cluster to scale up automatically when temperature metrics are high.',
        },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'Query, threshold, destination, schedule — the alert evaluates the data and notifies without anyone watching.',
        b: 'A manually refreshed dashboard depends on a person being present, which is exactly what fails at the weekend.',
        c: 'Reviewing logs by hand is slower still and gives no notification.',
        d: 'Cluster scaling responds to compute load; it has nothing to do with the temperature values in the data.',
      },
      explanation:
        '"Notify me when a value crosses a threshold" is the definition of a **SQL alert**: a scheduled query, a condition, and a destination.',
      examObjective: 'Configure an alert with a desired threshold and destination.',
    },
    {
      id: 'tf-alert-vs-job',
      type: 'truefalse',
      statement:
        'A job that finishes successfully proves the data it produced is within acceptable limits.',
      answer: false,
      explanation:
        'A job can succeed while writing zero rows or wildly wrong values — success means the code ran, not that the data is sane. Job status covers the *run*; a **SQL alert** watches the *data*.',
    },
    {
      id: 'flash-alert-parts',
      type: 'flashcard',
      front: 'What four things do you configure on a SQL alert?',
      back: 'The **query** returning the value, the **condition/threshold**, the **destination** (email, Slack, webhook), and the **schedule** on which it is evaluated.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You can now be told instead of watching',
      points: [
        'An alert = query + threshold condition + destination + schedule.',
        'Write the query to return a single, comparable number.',
        'The schedule bounds detection time; the threshold controls the noise.',
        'Alert on smoothed values so one spike does not page anyone.',
        'Dashboards answer when asked; alerts speak when nobody is asking.',
      ],
      closing:
        'Next module: letting stakeholders ask their own questions, in plain language. 🤖',
    },
  ],
}
