import type { Lesson } from '@/types/content'

/**
 * Lesson: parameters in queries and dashboards.
 * Maps to exam Section 6 (work with parameters in SQL queries and dashboards,
 * including defining, configuring, and testing parameters).
 * Covers sample question 8 (a date widget feeds the query's WHERE clause).
 */
export const parametersLesson: Lesson = {
  id: 'parameters',
  title: 'Parameters: one query, many answers',
  summary:
    'Define a parameter in SQL, wire it to a dashboard widget, and understand what actually happens when a viewer changes the date — plus how to test one before you publish.',
  estimatedMinutes: 9,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'Five dashboards for five regions',
      body: 'Someone asks for the same sales dashboard "but for the Nordics". So a copy is made, the `WHERE` clause edited, and now there are two dashboards to maintain. Then a third. Then someone wants last quarter instead of this one.\n\nA **parameter** collapses all of them into one dashboard that the viewer points wherever they need.',
      atWork:
        'Every dashboard duplicated "with a different filter" is a parameter that was never added.',
    },
    {
      id: 'concept-what',
      type: 'concept',
      title: 'A parameter is a placeholder in the SQL',
      body: 'A parameter is a named placeholder inside a query that gets a value at run time. In the SQL editor you write it as `:region` or `:start_date`, and the editor offers a control to supply a value while you develop.\n\nThe key idea for the exam: the value **lands in the query itself** — usually in the `WHERE` clause. It is not a post-processing filter applied to results that have already been fetched.',
      takeaways: [
        'Written as a named marker (`:start_date`) inside the query.',
        'The value is substituted into the query before it runs.',
        'Most often used in `WHERE`, but it can appear anywhere a value can.',
      ],
    },
    {
      id: 'example-parameter',
      type: 'example',
      title: 'A parameterised query',
      intro: 'Two markers, supplied by whoever runs it:',
      code: {
        language: 'sql',
        content:
          "SELECT\n  order_date,\n  region,\n  sum(amount) AS revenue\nFROM main.sales.orders\nWHERE order_date >= :start_date\n  AND order_date <  :end_date\n  AND region      =  :region\nGROUP BY order_date, region\nORDER BY order_date;",
      },
      explanation:
        'One query serves every region and every period. Note the filters are still plain comparisons on the columns — parameters do not stop Delta skipping files, so a parameterised query stays fast.',
    },
    {
      id: 'concept-widgets',
      type: 'concept',
      title: 'On a dashboard, a parameter becomes a widget',
      body: 'Publish that query as a dashboard dataset and each parameter can be exposed as a control: a **date range picker**, a **dropdown** of values, a text box, or a number input.\n\nWhen a viewer changes it, the dashboard **re-runs the underlying query with the new value in its `WHERE` clause** and returns fresh rows. That is what makes a parameter different from a display-only label — and different from a filter widget, which narrows rows the query already returned.',
      takeaways: [
        'Parameter widget types: date/date range, dropdown, text, number.',
        'Changing it re-runs the query with the new value.',
        'Parameter = changes the query; filter = narrows the returned rows.',
      ],
    },
    {
      id: 'mcq-date-widget',
      type: 'mcq',
      question:
        'A dashboard shows a bar chart linked to a Date widget parameter. What is the role of that Date widget?',
      options: [
        {
          id: 'a',
          text: 'It defines the start and end of the x-axis range shown on the bar chart.',
        },
        {
          id: 'b',
          text: 'It acts as a global filter so that every visualization on the dashboard uses the same date range.',
        },
        {
          id: 'c',
          text: 'Its start and end dates are used in the WHERE clause of the query that populates the bar chart.',
        },
        {
          id: 'd',
          text: 'It is a static text display of the current date range and does not affect the visualizations.',
        },
      ],
      correct: ['c'],
      optionFeedback: {
        a: 'Axis ranges are a formatting setting of the chart; the parameter changes which data is fetched at all.',
        b: 'A parameter feeds the query it is bound to. Applying one control to every visualization is what a *global filter* does — a different mechanism.',
        c: 'The chosen dates are substituted into the query’s WHERE clause, so the chart is populated by a re-run query.',
        d: 'It is an input control, not a label — changing it changes the data.',
      },
      explanation:
        'A parameter is part of the **query**. Its value goes into the `WHERE` clause and the query re-runs; it does not merely restyle a chart or filter rows already returned.',
      examObjective:
        'Work with parameters in SQL queries and dashboards, including defining, configuring, and testing parameters.',
    },
    {
      id: 'concept-defaults-testing',
      type: 'concept',
      title: 'Defaults, and testing before you publish',
      body: 'Give every parameter a **sensible default** — "last 30 days", the largest region — so the dashboard is useful the moment it opens rather than empty until someone chooses something.\n\nThen test it deliberately before publishing: run it with the default, with a value that should return **no rows**, and with the widest range you expect. Empty results are where parameterised dashboards most often embarrass people, because a chart with no data looks identical to a chart that is broken.',
      takeaways: [
        'Set a default so the first view is never blank.',
        'Test the empty case and the widest case, not just the happy path.',
        'Check the values are the ones the query actually needs (dates as dates).',
      ],
    },
    {
      id: 'mistake-copy-dashboard',
      type: 'mistake',
      title: 'Copying the dashboard instead of parameterising it',
      myth: '"Sales want their own version with their own region filter, so I will duplicate the dashboard."',
      reality:
        'Each copy is another place a definition can drift, another dashboard to fix when the source table changes, and another thing to grant permissions on.\n\nOne dashboard with a region **parameter** answers every request, and every viewer sees the same, single definition of revenue.',
    },
    {
      id: 'tf-parameter-rerun',
      type: 'truefalse',
      statement:
        'Changing a dashboard parameter filters the rows already returned, without re-running the query.',
      answer: false,
      explanation:
        'A parameter is substituted into the query and the query **re-runs**. That is why it can widen a range and return rows that were never fetched before — something a post-hoc filter could not do.',
    },
    {
      id: 'flash-param-vs-filter',
      type: 'flashcard',
      front: 'Parameter or filter — what is the difference?',
      back: 'A **parameter** puts a value into the query (usually the `WHERE` clause) and re-runs it. A **filter** narrows the rows the query already returned.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You can now build one dashboard instead of five',
      points: [
        'Parameters are named placeholders (`:start_date`) substituted into the query.',
        'On a dashboard they become controls: date pickers, dropdowns, text, numbers.',
        'Changing one re-runs the query with the new value in its `WHERE` clause.',
        'Always set a default; test the empty and widest cases before publishing.',
        'Parameter changes the query; filter narrows returned rows.',
      ],
      closing:
        'Next: getting the dashboard to the people who need it — and keeping it current. 🔗',
    },
  ],
}
