import type { Lesson } from '@/types/content'

/**
 * Lesson: choosing a visualization, and building one outside a dashboard.
 * Maps to exam Section 6 (identify the effective visualization type to
 * communicate insights clearly; create visualizations in notebooks and the
 * SQL editor).
 */
export const visualizationChoiceLesson: Lesson = {
  id: 'visualization-choice',
  title: 'Choosing a chart that communicates',
  summary:
    'Match the chart to the question — comparison, trend, composition, relationship, single number — and build one straight from the SQL editor or a notebook.',
  estimatedMinutes: 9,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'The pie chart with fourteen slices',
      body: 'Revenue by country, as a pie: fourteen slices, nine of them slivers, a legend nobody can map back to the wedges. The data is right and the chart tells you nothing.\n\nAs a horizontal bar chart, sorted, the same data answers "who is biggest, and by how much?" in one glance. Chart choice is not decoration — it decides whether the insight survives the trip to the reader.',
      atWork:
        'If a stakeholder has to ask "so what am I looking at?", the chart type is usually the reason.',
    },
    {
      id: 'concept-question-first',
      type: 'concept',
      title: 'Start from the question, not the chart menu',
      body: 'Every chart type answers one shape of question well:\n\n• **Comparison** between categories → **bar** (horizontal when labels are long, sorted by value).\n• **Change over time** → **line** (time on the x-axis, always).\n• **Composition** — parts of a whole → **stacked bar**, or a **pie only for two or three slices**.\n• **Relationship** between two measures → **scatter**.\n• **One important number** → a **counter**, not a chart at all.\n• **Precise values people will read off** → a **table**.',
      takeaways: [
        'Comparison → bar. Trend → line. Relationship → scatter.',
        'One headline number → counter. Exact values → table.',
        'Pie charts only survive two or three categories.',
      ],
    },
    {
      id: 'diagram-choose',
      type: 'diagram',
      title: 'Question → chart',
      spec: {
        kind: 'flow',
        steps: [
          {
            label: 'Which is biggest?',
            sublabel: 'sorted bar chart',
            tone: 'brand',
          },
          {
            label: 'Is it going up?',
            sublabel: 'line chart over time',
            tone: 'accent',
          },
          {
            label: 'What is the number?',
            sublabel: 'counter — one big figure',
            tone: 'good',
          },
        ],
      },
      caption:
        'Say the question out loud first. The chart type is usually implied by the sentence.',
    },
    {
      id: 'concept-clarity',
      type: 'concept',
      title: 'What makes a chart readable',
      body: 'A few habits do most of the work:\n\n• **Sort bars by value**, not alphabetically — the ranking is the message.\n• **Limit the categories**: top 10 plus "other" beats 40 unreadable bars.\n• **Label the axes and units** — "revenue (€k)" removes a question.\n• **Start a bar chart’s axis at zero.** Truncating it exaggerates differences and misleads.\n• **One idea per chart.** Two y-axes on the same chart nearly always means two charts.',
      takeaways: [
        'Sort by value; cap the number of categories.',
        'Bar axes start at zero — otherwise the chart lies.',
        'Two axes usually means you are drawing two charts at once.',
      ],
    },
    {
      id: 'concept-where-built',
      type: 'concept',
      title: 'You do not need a dashboard to make a chart',
      body: 'Run a query in the **SQL editor** and you can add a visualization to the result straight away — pick the type, choose the columns for each axis, and it sits alongside the table of rows. Perfect for checking a distribution while exploring.\n\n**Notebooks** work the same way: any cell returning a result offers chart options next to the table, and a notebook cell also gives you the data profile with summary statistics and histograms.\n\nWhen the chart is worth keeping, it graduates: build the dataset in a dashboard and put the widget on a page.',
      takeaways: [
        'Charts can be created directly on SQL editor and notebook results.',
        'Notebook results also offer the data profile — statistics and distributions.',
        'Exploratory chart in the editor; durable chart on a dashboard.',
      ],
    },
    {
      id: 'mistake-pie',
      type: 'mistake',
      title: 'The pie chart reflex',
      myth: '"It is a breakdown of a total, so it should be a pie chart."',
      reality:
        'People compare **lengths** far more accurately than **angles**. Beyond three slices, a pie makes the reader work — and near-equal slices become genuinely indistinguishable.\n\nA sorted horizontal bar chart shows the same composition and also answers "which is bigger, and by how much?". Keep pies for two or three categories, or skip them.',
    },
    {
      id: 'mcq-viztype',
      type: 'mcq',
      question:
        'An analyst must show how monthly revenue has developed over the past three years so the audience can see the trend and its seasonality. Which visualization communicates this most clearly?',
      options: [
        {
          id: 'a',
          text: 'A line chart with month on the x-axis and revenue on the y-axis.',
        },
        {
          id: 'b',
          text: 'A pie chart of revenue per month.',
        },
        {
          id: 'c',
          text: 'A counter showing total revenue for the period.',
        },
        {
          id: 'd',
          text: 'A table of 36 rows of monthly revenue figures.',
        },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'A line over a continuous time axis is the standard way to show a trend and repeating seasonal shape.',
        b: 'A pie shows composition at a moment; 36 slices of "when" communicates nothing.',
        c: 'A counter gives one number and hides the entire development you were asked to show.',
        d: 'A table holds the values but leaves the audience to find the trend themselves.',
      },
      explanation:
        'Trend over time → **line chart**. Match the chart to the question: comparison → bar, trend → line, composition → stacked bar, single value → counter.',
      examObjective:
        'Identify the effective visualization type to communicate insights clearly.',
    },
    {
      id: 'tf-editor-chart',
      type: 'truefalse',
      statement:
        'Creating a visualization requires building a dashboard first.',
      answer: false,
      explanation:
        'You can add a visualization directly to a query result in the **SQL editor**, and to a cell result in a **notebook**. A dashboard is where a chart goes to be shared and kept, not where it has to be born.',
    },
    {
      id: 'flash-chart-types',
      type: 'flashcard',
      front: 'Comparison, trend, relationship, one headline number — which chart for each?',
      back: 'Comparison → **bar** (sorted) · trend → **line** · relationship → **scatter** · one number → **counter**.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You can now pick the right chart',
      points: [
        'Choose from the question: comparison, trend, composition, relationship, single value.',
        'Sort bars by value, cap the categories, label the units.',
        'Bar axes start at zero; one idea per chart.',
        'Pies only work for two or three slices.',
        'Charts can be built directly in the SQL editor or a notebook.',
      ],
      closing:
        'Next: letting viewers change what a chart shows, without touching the SQL. 🎛️',
    },
  ],
}
