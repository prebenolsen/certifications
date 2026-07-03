import type { Certification } from '@/types/content'
import { planned } from '@/content/authoring'
import { unityNamespaceLesson } from './lessons/unity-namespace'
import { aggregationsGroupByLesson } from './lessons/aggregations-groupby'

/**
 * Databricks Certified Data Analyst Associate.
 *
 * Modules are organised for *learning flow*, then mapped back to the official
 * exam sections via `examSections`. Two lessons are fully built out; the rest
 * are scaffolded as `planned` and tracked in CONTENT.md.
 */

export const dataAnalystAssociate: Certification = {
  id: 'databricks-data-analyst-associate',
  title: 'Databricks Certified Data Analyst Associate',
  provider: 'Databricks',
  summary:
    'Manage, query, analyze, and visualize data on the Databricks Data Intelligence Platform using Unity Catalog, Databricks SQL, dashboards, and AI/BI Genie.',
  officialUrl:
    'https://www.databricks.com/learn/certification/data-analyst-associate',
  examFacts: {
    questions: 45,
    minutes: 90,
    passingNote: 'Multiple-choice, online or test-center proctored.',
    validityYears: 2,
  },
  modules: [
    {
      id: 'platform-unity-catalog',
      order: 1,
      title: 'The Platform & Unity Catalog',
      summary:
        'Get oriented: the core pieces of the Databricks platform and how Unity Catalog organizes every piece of data you will touch.',
      examSections: ['Section 1', 'Section 9'],
      icon: '🏛️',
      lessons: [
        unityNamespaceLesson,
        planned(
          'platform-components',
          'The pieces of the platform',
          'Delta Lake, Unity Catalog, Databricks SQL, Lakeflow, Mosaic AI, DLT — what each one is for, in plain language.',
        ),
        planned(
          'catalog-explorer-lineage',
          'Catalog Explorer, views & lineage',
          'Browse data assets, understand views vs tables and certified tables, and trace lineage.',
        ),
      ],
    },
    {
      id: 'managing-data',
      order: 2,
      title: 'Managing & Cleaning Data',
      summary:
        'Discover certified datasets, tag and trace assets, and clean messy data with SQL.',
      examSections: ['Section 2'],
      icon: '🧹',
      lessons: [
        planned(
          'discover-certified',
          'Discovering & governing certified data',
          'Find trustworthy datasets in Unity Catalog and understand what "certified" means.',
        ),
        planned(
          'data-cleaning-sql',
          'Cleaning data in SQL',
          'Remove invalid rows and handle missing values — the practical cleanup toolkit.',
        ),
      ],
    },
    {
      id: 'importing-data',
      order: 3,
      title: 'Importing Data',
      summary:
        'Every way data gets into Databricks: UI upload, S3, Delta Sharing, APIs, Auto Loader, and the Marketplace.',
      examSections: ['Section 3'],
      icon: '📥',
      lessons: [
        planned(
          'ingestion-methods',
          'The ingestion menu',
          'When to reach for each approach: UI, S3, Delta Sharing, API, Auto Loader, Marketplace.',
        ),
        planned(
          'auto-loader',
          'Auto Loader, explained simply',
          'How Auto Loader incrementally picks up new files as they land.',
        ),
      ],
    },
    {
      id: 'querying-sql',
      order: 4,
      title: 'Querying with Databricks SQL',
      summary:
        'The heart of the exam: joins, aggregations, views, time travel, and SQL Warehouses.',
      examSections: ['Section 4'],
      icon: '🔎',
      lessons: [
        aggregationsGroupByLesson,
        planned(
          'joins-and-sets',
          'Joins & set operations',
          'Inner, left, right, full — plus UNION vs UNION ALL, with pictures.',
        ),
        planned(
          'views-mv-streaming',
          'Views, materialized views & streaming tables',
          'Dynamic vs materialized views, and when a streaming table is the right call.',
        ),
        planned(
          'time-travel',
          "Delta Lake time travel",
          'Query yesterday’s version of a table — and why VACUUM can take it away.',
        ),
        planned(
          'sql-warehouses',
          'SQL Warehouses & the Assistant',
          'What a SQL Warehouse actually does, and using the Databricks Assistant to write and debug queries.',
        ),
      ],
    },
    {
      id: 'analyzing-queries',
      order: 5,
      title: 'Analyzing & Optimizing Queries',
      summary:
        'Make queries fast and trustworthy: Photon, query insights, caching, history, and Liquid Clustering.',
      examSections: ['Section 5'],
      icon: '⚡',
      lessons: [
        planned(
          'photon',
          'Photon: the speed engine',
          'What Photon is, its benefits, and the workloads it accelerates.',
        ),
        planned(
          'query-insights-history',
          'Finding & fixing slow queries',
          'Query History, Query Profiler and Insights to spot bottlenecks; caching to cut latency.',
        ),
        planned(
          'liquid-clustering',
          'Liquid Clustering',
          'Speed up filters on big tables by clustering on the columns you filter.',
        ),
      ],
    },
    {
      id: 'dashboards-viz',
      order: 6,
      title: 'Dashboards & Visualizations',
      summary:
        'Turn queries into AI/BI dashboards: widgets, parameters, permissions, refresh schedules, and alerts.',
      examSections: ['Section 6'],
      icon: '📊',
      lessons: [
        planned(
          'aibi-dashboards',
          'Building AI/BI dashboards',
          'Multi-page layouts, multiple datasets, and widgets that communicate.',
        ),
        planned(
          'parameters',
          'Parameters & filters',
          'Define, configure and test query and dashboard parameters.',
        ),
        planned(
          'alerts-refresh',
          'Alerts & scheduled refresh',
          'Notify on thresholds and keep dashboards fresh automatically.',
        ),
      ],
    },
    {
      id: 'genie',
      order: 7,
      title: 'AI/BI Genie Spaces',
      summary:
        'Let stakeholders ask questions in natural language — and curate Genie so its answers are trustworthy.',
      examSections: ['Section 7'],
      icon: '🤖',
      lessons: [
        planned(
          'genie-intro',
          'What is a Genie space?',
          'Purpose, key features, and the components that make Genie work.',
        ),
        planned(
          'genie-build-optimize',
          'Building & optimizing Genie',
          'Sample questions, instructions, trusted assets, and tuning from feedback.',
        ),
      ],
    },
    {
      id: 'data-modeling',
      order: 8,
      title: 'Data Modeling',
      summary:
        'Star, snowflake and data vault schemas — and how they map onto the Medallion architecture.',
      examSections: ['Section 8'],
      icon: '🧱',
      lessons: [
        planned(
          'schemas-star-snowflake',
          'Star, snowflake & data vault',
          'Classic analytical modeling patterns and when each fits.',
        ),
        planned(
          'medallion',
          'The Medallion architecture',
          'Bronze, silver, gold — and how modeling aligns to each layer.',
        ),
      ],
    },
    {
      id: 'securing-data',
      order: 9,
      title: 'Securing Data',
      summary:
        'Keep data safe: Unity Catalog permissions, the 3-level namespace for governance, ownership and PII best practices.',
      examSections: ['Section 9'],
      icon: '🔒',
      lessons: [
        planned(
          'unity-permissions',
          'Roles, grants & sharing',
          'Secure workspace objects with Unity Catalog roles and sharing settings.',
        ),
        planned(
          'pii-ownership',
          'Ownership & PII protection',
          'Best practices for table ownership and protecting sensitive data.',
        ),
      ],
    },
  ],
}
