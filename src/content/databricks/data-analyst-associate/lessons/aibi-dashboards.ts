import type { Lesson } from '@/types/content'

/**
 * Lesson: building AI/BI dashboards.
 * Maps to exam Section 6 (build dashboards using AI/BI Dashboards, including
 * multi-tab/page layouts, multiple data sources/datasets, and widgets).
 * Research: src_material/.../research/platform-and-naming.md
 */
export const aibiDashboardsLesson: Lesson = {
  id: 'aibi-dashboards',
  title: 'Building an AI/BI dashboard',
  summary:
    'The two tabs every dashboard has, why datasets are defined once and reused, and how pages and widgets turn a pile of charts into something people can read.',
  estimatedMinutes: 10,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'Eleven charts, eleven copies of the same query',
      body: 'The sales dashboard has eleven charts. Each was built by pasting the same base query and editing the end of it. When the revenue definition changed, someone had to find and fix eleven queries — and missed two.\n\nAI/BI dashboards separate the **data** from the **presentation** precisely so this cannot happen.',
      atWork:
        'A dashboard that is hard to change is usually one where the query logic was copied instead of shared.',
    },
    {
      id: 'concept-two-tabs',
      type: 'concept',
      title: 'Data tab and Canvas tab',
      body: 'Every dashboard has two halves.\n\nThe **Data tab** holds **datasets** — each defined from a table, a view, or a custom SQL query. This is where the logic lives.\n\nThe **Canvas tab** holds what people see: charts, counters, tables, text, and images arranged on a page. Each widget points at a dataset.\n\nOne dataset can feed many widgets, so a definition changes in one place and every chart follows.',
      takeaways: [
        'Data tab = datasets (table, view, or SQL). Canvas tab = widgets.',
        'Many widgets can share one dataset — define the logic once.',
        'A dashboard can hold multiple datasets from different sources.',
      ],
    },
    {
      id: 'diagram-structure',
      type: 'diagram',
      title: 'How a dashboard is put together',
      spec: {
        kind: 'flow',
        steps: [
          {
            label: 'Datasets',
            sublabel: 'tables, views, or SQL — the Data tab',
            tone: 'brand',
          },
          {
            label: 'Widgets',
            sublabel: 'charts, counters, tables, text, images',
            tone: 'accent',
          },
          {
            label: 'Pages',
            sublabel: 'grouped into tabs for different audiences',
            tone: 'good',
          },
        ],
        arrows: ['each widget reads a dataset', 'arranged on the canvas'],
      },
      caption:
        'Logic at the left, presentation at the right. Changing a dataset updates every widget built on it.',
    },
    {
      id: 'concept-widgets',
      type: 'concept',
      title: 'Widgets are not only charts',
      body: 'A widget is anything you place on the canvas: a **visualization** (bar, line, pie, counter, table, map…), a **text** block written in Markdown, or an **image**.\n\nThe non-chart widgets do more work than people expect. A short text block explaining what a metric means and when it refreshes prevents most of the questions a dashboard generates — and a heading per section is the difference between a wall of charts and something readable.',
      takeaways: [
        'Widgets: visualizations, text (Markdown), and images.',
        'Text widgets carry definitions, caveats, and refresh times.',
        'A counter for the headline number beats burying it in a chart.',
      ],
    },
    {
      id: 'concept-pages',
      type: 'concept',
      title: 'Pages: one dashboard, several audiences',
      body: 'Dashboards support **multiple pages** (tabs). Rather than one endless canvas — or three near-identical dashboards that drift apart — you put an executive summary on the first page and the detail behind it on the others.\n\nThe pages share the dashboard’s datasets, so the summary and the detail cannot disagree with each other. That shared definition is the real reason to prefer pages over separate dashboards.',
      takeaways: [
        'Pages act as tabs within one dashboard.',
        'All pages share the same datasets — no drift between summary and detail.',
        'Summary first, detail behind it.',
      ],
    },
    {
      id: 'concept-filters',
      type: 'concept',
      title: 'Filters, and clicking to explore',
      body: 'Filters can apply at three scopes: **global** (the whole dashboard), **page-level**, or a single **widget**. A global date filter is the usual backbone — one control, every chart moves together.\n\nDashboards also support **cross-filtering**: clicking a bar in one chart filters the others to that selection. It turns a static report into something a stakeholder can interrogate without writing SQL or asking you.',
      takeaways: [
        'Filter scopes: global, page-level, widget-level.',
        'Cross-filtering: click a chart element to filter the rest.',
        'One global date filter usually beats a control on every chart.',
      ],
    },
    {
      id: 'concept-draft-published',
      type: 'concept',
      title: 'Draft and published are different things',
      body: 'A dashboard you are editing is a **draft**. **Publishing** creates the version other people see — so you can rework a page all afternoon without anyone watching it change mid-meeting.\n\nIt also matters for permissions: what viewers get is the published version, and how it runs (whose credentials it uses) is decided at publish time.',
      takeaways: [
        'Editing affects the draft; viewers see the published version.',
        'Publish deliberately, when the change is finished.',
      ],
    },
    {
      id: 'mistake-copy-query',
      type: 'mistake',
      title: 'A query per chart',
      myth: '"Each chart needs its own query, so I paste the SQL and tweak it for each one."',
      reality:
        'Eleven copies of a query means eleven places to fix a definition, and a guarantee that two of them will disagree within a month.\n\nDefine the dataset **once** in the Data tab and point every widget that needs it at that dataset. Where a chart needs a different slice, use a filter or a parameter rather than a new copy of the SQL.',
    },
    {
      id: 'mcq-dashboard',
      type: 'mcq',
      question:
        'A team wants one dashboard with an executive summary page and a detail page, several charts built on the same revenue logic, and a single date control affecting everything. How should it be built?',
      options: [
        {
          id: 'a',
          text: 'One dashboard with two pages, a shared dataset in the Data tab feeding the charts, and a global date filter.',
        },
        {
          id: 'b',
          text: 'Two separate dashboards, each with its own copy of the revenue query and its own date filter.',
        },
        {
          id: 'c',
          text: 'One page with every chart, each chart carrying its own copy of the query and its own date control.',
        },
        {
          id: 'd',
          text: 'One dashboard per chart, linked together with text widgets.',
        },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'Shared datasets keep the two pages consistent, and a global filter drives every widget from one control.',
        b: 'Two dashboards means two copies of the logic — they will drift.',
        c: 'A control per chart forces viewers to change several filters to ask one question.',
        d: 'Splitting one report across many dashboards makes it unnavigable and impossible to keep aligned.',
      },
      explanation:
        'Datasets are defined once and reused; **pages** organise the audience; a **global filter** drives everything at once. That is the structure the dashboard product is built around.',
      examObjective:
        'Build dashboards using AI/BI Dashboards, including multi-tabs/page layouts, multiple data sources/datasets, and widgets (visualizations, text, images).',
    },
    {
      id: 'tf-datasets',
      type: 'truefalse',
      statement:
        'A single dashboard can contain several datasets drawn from different tables and queries.',
      answer: true,
      explanation:
        'The Data tab holds as many datasets as the dashboard needs — a table here, a custom query there — and any widget can point at any of them. That is how one dashboard combines several sources without joining them into one table first.',
    },
    {
      id: 'flash-tabs',
      type: 'flashcard',
      front: 'What lives in a dashboard’s Data tab, and what lives in its Canvas tab?',
      back: '**Data tab:** datasets defined from tables, views, or SQL queries. **Canvas tab:** the widgets — visualizations, text, and images — arranged on pages.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You can now build a dashboard properly',
      points: [
        'Data tab holds datasets; Canvas tab holds widgets. Define logic once.',
        'Widgets include text and images, not just charts.',
        'Pages act as tabs and share the dashboard’s datasets.',
        'Filters apply globally, per page, or per widget; cross-filtering lets viewers explore.',
        'Viewers see the **published** version, not your draft.',
      ],
      closing: 'Next: choosing a chart that actually communicates something. 📈',
    },
  ],
}
