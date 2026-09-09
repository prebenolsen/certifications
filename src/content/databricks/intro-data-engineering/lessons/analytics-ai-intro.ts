import type { Lesson } from '@/types/content'

/**
 * Lesson 9: the consumption surfaces — why the pipeline exists at all.
 *
 * Introduces **Databricks SQL**, **AI/BI dashboard**, **Genie space**,
 * **MLflow** and **Mosaic AI Model Serving**, each at one paragraph of depth.
 */
export const analyticsAiIntroLesson: Lesson = {
  id: 'analytics-ai-intro',
  title: 'Who uses the data, and how',
  summary:
    'Databricks SQL for queries, AI/BI dashboards for reporting, Genie for plain-language questions, and Mosaic AI for models — the reason the pipeline exists.',
  estimatedMinutes: 6,
  status: 'complete',
  cards: [
    {
      id: 'concept-dbsql',
      type: 'concept',
      title: 'Databricks SQL: the analyst\'s half of the platform',
      body: 'Nobody builds a pipeline for its own sake. **Databricks SQL** is where most of the people who consume the result actually work: a SQL editor, the history of every query that has run, alerts, and dashboards — all running on the SQL warehouses from lesson 6.\n\nFor an analyst it looks and behaves like a familiar SQL tool. The difference is what it is querying: the same governed tables the pipelines write, with no export and no separate copy.',
      takeaways: [
        'Same tables, same permissions, no extract step.',
        'Query history is kept, so "which query is slowing the warehouse down?" is answerable.',
      ],
    },
    {
      id: 'concept-dashboards',
      type: 'concept',
      title: 'AI/BI dashboards',
      body: 'An **AI/BI dashboard** is the reporting surface, and it has two halves. A **Data** tab holds the datasets behind it — tables, views, or SQL you write. A **Canvas** tab holds what people see: charts, counters, text and filters, arranged on pages.\n\nViewers open a **published** version, refreshed on a schedule, so opening it at 9am does not start a large query. Dashboards can also be subscribed to by email.',
      takeaways: [
        'Data tab = what it queries. Canvas tab = what it looks like.',
        'Published and scheduled, so readers see consistent, already-computed numbers.',
      ],
    },
    {
      id: 'concept-genie',
      type: 'concept',
      title: 'Genie: asking in plain language',
      body: 'A **Genie space** lets someone ask a question in ordinary language — "how many orders shipped late last month, by region?" — over a curated set of tables that a data team has chosen and described. It generates the SQL, shows it, and returns the answer as data.\n\nThe curation is what makes it work: a Genie space is pointed at specific trusted tables with instructions and example queries, not at everything in the catalog.\n\nAnd it runs the query **as the person asking**, with their own permissions. It cannot become a side door to data they were never allowed to see.',
      takeaways: [
        'Aimed at people who need an answer but do not write SQL.',
        'Curated tables in, permissions of the asker enforced.',
      ],
    },
    {
      id: 'concept-ai',
      type: 'concept',
      title: 'Models on the same data',
      body: 'The machine-learning side reads those same governed tables — which was the original promise of the lakehouse: no exporting a CSV to a data scientist\'s laptop.\n\nTwo names worth knowing at this level. **MLflow** is the record-keeper: it tracks experiments, versions the models, and packages one up with its dependencies so it can be deployed. **Mosaic AI Model Serving** then puts a model behind a web endpoint, handling scaling and versioning, so an application can simply call it.\n\nThe pattern to notice: training data, model and predictions all stay inside the same governed platform, so permissions and lineage still apply to them.',
      takeaways: [
        '**MLflow** tracks and packages models; **Mosaic AI Model Serving** runs them behind an endpoint.',
        'Models are governed objects in Unity Catalog, like tables.',
      ],
    },
    {
      id: 'diagram-stack',
      type: 'diagram',
      title: 'Four surfaces, one copy of the data',
      spec: {
        kind: 'layers',
        layers: [
          {
            label: 'Your cloud storage',
            sublabel: 'the files themselves',
            tone: 'neutral',
          },
          {
            label: 'Delta tables, governed by Unity Catalog',
            sublabel: 'one copy · one set of names · one set of permissions',
            tone: 'accent',
          },
          {
            label: 'Compute',
            sublabel: 'SQL warehouses · clusters',
            tone: 'brand',
          },
          {
            label: 'SQL editor · AI/BI dashboards · Genie · models',
            sublabel: 'what people actually open',
            tone: 'good',
          },
        ],
      },
      caption:
        'Every surface on the top row reads the layer beneath it. That is what "one copy of the data" means in practice — and why a permission granted once applies to a dashboard, a plain-language question and a model alike.',
    },
    {
      id: 'mistake-export',
      type: 'mistake',
      title: 'The habit worth unlearning',
      myth: '"Analytics happens on the platform, but for machine learning the data scientists get an export to work with in their own tools."',
      reality:
        'That export is the failure the whole architecture exists to prevent. The moment it leaves, it is a copy nobody governs: permissions no longer apply, nobody knows it exists, and its numbers begin drifting from the source that day.\n\nModels train on the same governed tables the dashboards read. Same copy, same permissions, same lineage — which also means an audit can answer what a model was trained on.',
    },
    {
      id: 'check-genie-permissions',
      type: 'truefalse',
      statement:
        'Because a Genie space answers questions automatically, it can return data the person asking has no permission to query.',
      answer: false,
      explanation:
        'The generated query runs with the **asking user\'s** own permissions. If they could not query the table themselves, they cannot get at it by asking in plain language either.',
    },
    {
      id: 'flash-dashboard-tabs',
      type: 'flashcard',
      front: 'What are the two tabs of an **AI/BI dashboard**, and what does each hold?',
      back: 'The **Data** tab holds the datasets — tables, views or SQL. The **Canvas** tab holds the visuals: charts, counters, text and filters.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'What the pipeline was for',
      points: [
        '**Databricks SQL** is the analyst surface: editor, query history, alerts, dashboards, on SQL warehouses.',
        'An **AI/BI dashboard** pairs a **Data** tab of datasets with a **Canvas** tab of visuals, published on a refresh schedule.',
        'A **Genie space** answers plain-language questions over curated tables, using the asker\'s own permissions.',
        '**MLflow** tracks and packages models; **Mosaic AI Model Serving** puts one behind an endpoint.',
        'All four read the same governed copy of the data — no exports.',
      ],
      closing:
        'One lesson left: every piece of this course, working together on a single real request. 🧩',
    },
  ],
}
