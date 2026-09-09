import type { Certification } from '@/types/content'
import { whatIsDatabricksAnalystLesson } from './lessons/what-is-databricks-analyst'
import { unityCatalogExplainedLesson } from './lessons/unity-catalog-explained'
import { unityNamespaceLesson } from './lessons/unity-namespace'
import { platformComponentsLesson } from './lessons/platform-components'
import { catalogExplorerLineageLesson } from './lessons/catalog-explorer-lineage'
import { discoverCertifiedLesson } from './lessons/discover-certified'
import { dataCleaningSqlLesson } from './lessons/data-cleaning-sql'
import { ingestionMethodsLesson } from './lessons/ingestion-methods'
import { autoLoaderLesson } from './lessons/auto-loader'
import { sqlWarehousesLesson } from './lessons/sql-warehouses'
import { filteringSortingLesson } from './lessons/filtering-sorting'
import { aggregationsGroupByLesson } from './lessons/aggregations-groupby'
import { joinsAndSetsLesson } from './lessons/joins-and-sets'
import { creatingTablesLesson } from './lessons/creating-tables'
import { viewsMvStreamingLesson } from './lessons/views-mv-streaming'
import { timeTravelLesson } from './lessons/time-travel'
import { photonLesson } from './lessons/photon'
import { queryInsightsHistoryLesson } from './lessons/query-insights-history'
import { liquidClusteringLesson } from './lessons/liquid-clustering'
import { aibiDashboardsLesson } from './lessons/aibi-dashboards'
import { visualizationChoiceLesson } from './lessons/visualization-choice'
import { parametersLesson } from './lessons/parameters'
import { sharingSchedulingLesson } from './lessons/sharing-scheduling'
import { alertsLesson } from './lessons/alerts'
import { genieIntroLesson } from './lessons/genie-intro'
import { genieBuildOptimizeLesson } from './lessons/genie-build-optimize'
import { schemasStarSnowflakeLesson } from './lessons/schemas-star-snowflake'
import { medallionLesson } from './lessons/medallion'
import { unityPermissionsLesson } from './lessons/unity-permissions'
import { piiOwnershipLesson } from './lessons/pii-ownership'

/**
 * Databricks Certified Data Analyst Associate.
 *
 * Nine modules mirroring the nine official exam sections, ordered for learning
 * flow: get oriented → find data → bring data in → query it → make it fast →
 * show it → let stakeholders ask → model it → secure it.
 *
 * Module 1 opens with two lessons the exam never lists as topics of their own —
 * what the product *is*, and what Unity Catalog *is* — because every later
 * lesson assumes both. Unity Catalog is named in five of the nine sections.
 *
 * Research (verified product names and mechanics):
 * src_material/databricks/databricks-certified-data-analyst-associate/research/
 */
export const dataAnalystAssociate: Certification = {
  id: 'databricks-data-analyst-associate',
  title: 'Databricks Certified Data Analyst Associate',
  provider: 'Databricks',
  summary:
    'Manage, query, analyze, and visualize data on the Databricks Data Intelligence Platform using Unity Catalog, Databricks SQL, AI/BI dashboards, and Genie.',
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
        'What Databricks is, the governance layer everything runs through, how every table is addressed, the named components, and the window you browse them in.',
      examSections: ['Section 1', 'Section 9'],
      icon: '🏛️',
      lessons: [
        whatIsDatabricksAnalystLesson,
        unityCatalogExplainedLesson,
        unityNamespaceLesson,
        platformComponentsLesson,
        catalogExplorerLineageLesson,
      ],
    },
    {
      id: 'managing-data',
      order: 2,
      title: 'Managing & Cleaning Data',
      summary:
        'Find datasets you can trust, tag and trace them, and clean messy values in SQL without harming the source.',
      examSections: ['Section 2'],
      icon: '🧹',
      lessons: [discoverCertifiedLesson, dataCleaningSqlLesson],
    },
    {
      id: 'importing-data',
      order: 3,
      title: 'Importing Data',
      summary:
        'UI upload, cloud storage, Delta Sharing, API intake, Auto Loader and the Marketplace — including the two routes that copy nothing.',
      examSections: ['Section 3'],
      icon: '📥',
      lessons: [ingestionMethodsLesson, autoLoaderLesson],
    },
    {
      id: 'querying-sql',
      order: 4,
      title: 'Querying with Databricks SQL',
      summary:
        'The heart of the exam: warehouses, filtering, aggregation, joins, creating tables, the four view-like objects, and time travel.',
      examSections: ['Section 4'],
      icon: '🔎',
      lessons: [
        sqlWarehousesLesson,
        filteringSortingLesson,
        aggregationsGroupByLesson,
        joinsAndSetsLesson,
        creatingTablesLesson,
        viewsMvStreamingLesson,
        timeTravelLesson,
      ],
    },
    {
      id: 'analyzing-queries',
      order: 5,
      title: 'Analyzing & Optimizing Queries',
      summary:
        'Photon, query history and the query profile, caching, and Liquid Clustering — diagnosing slowness instead of buying compute.',
      examSections: ['Section 5'],
      icon: '⚡',
      lessons: [photonLesson, queryInsightsHistoryLesson, liquidClusteringLesson],
    },
    {
      id: 'dashboards-viz',
      order: 6,
      title: 'Dashboards & Visualizations',
      summary:
        'Build AI/BI dashboards, choose charts that communicate, parameterise them, share them safely, and alert on the numbers that matter.',
      examSections: ['Section 6'],
      icon: '📊',
      lessons: [
        aibiDashboardsLesson,
        visualizationChoiceLesson,
        parametersLesson,
        sharingSchedulingLesson,
        alertsLesson,
      ],
    },
    {
      id: 'genie',
      order: 7,
      title: 'AI/BI Genie Spaces',
      summary:
        'Let stakeholders ask questions in plain language — and curate the space so the answers can be trusted.',
      examSections: ['Section 7'],
      icon: '🤖',
      lessons: [genieIntroLesson, genieBuildOptimizeLesson],
    },
    {
      id: 'data-modeling',
      order: 8,
      title: 'Data Modeling',
      summary:
        'Star, snowflake and data vault schemas, and where each belongs in the medallion layers.',
      examSections: ['Section 8'],
      icon: '🧱',
      lessons: [schemasStarSnowflakeLesson, medallionLesson],
    },
    {
      id: 'securing-data',
      order: 9,
      title: 'Securing Data',
      summary:
        'Grants and object permissions, ownership, and protecting personal data in place instead of copying it.',
      examSections: ['Section 9'],
      icon: '🔒',
      lessons: [unityPermissionsLesson, piiOwnershipLesson],
    },
  ],
}
