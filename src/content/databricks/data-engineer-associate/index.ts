import type { Certification } from '@/types/content'
import { lakehouseFoundationsLesson } from './lessons/lakehouse-foundations'
import { computeChoicesLesson } from './lessons/compute-choices'
import { ingestionPatternsLesson } from './lessons/ingestion-patterns'
import { copyIntoLesson } from './lessons/copy-into'
import { autoLoaderLesson } from './lessons/auto-loader'
import { lakeflowConnectLesson } from './lessons/lakeflow-connect'
import { bronzeToSilverLesson } from './lessons/bronze-to-silver'
import { joinsUnionsLesson } from './lessons/joins-unions'
import { reshapingDataLesson } from './lessons/reshaping-data'
import { dedupAggregationLesson } from './lessons/dedup-aggregation'
import { goldLayerLesson } from './lessons/gold-layer'
import { jobsTasksDagLesson } from './lessons/jobs-tasks-dag'
import { controlFlowLesson } from './lessons/control-flow'
import { triggersSchedulingLesson } from './lessons/triggers-scheduling'
import { gitFoldersLesson } from './lessons/git-folders'
import { assetBundlesLesson } from './lessons/asset-bundles'
import { sparkUiBottlenecksLesson } from './lessons/spark-ui-bottlenecks'
import { sparkTuningBasicsLesson } from './lessons/spark-tuning-basics'
import { monitoringJobsLesson } from './lessons/monitoring-jobs'
import { liquidClusteringLesson } from './lessons/liquid-clustering'
import { clusterTroubleshootingLesson } from './lessons/cluster-troubleshooting'
import { managedExternalTablesLesson } from './lessons/managed-external-tables'
import { accessControlLesson } from './lessons/access-control'
import { fineGrainedSecurityLesson } from './lessons/fine-grained-security'

/**
 * Databricks Certified Data Engineer Associate.
 *
 * Seven modules mirroring the seven official exam sections (already a natural
 * learning arc: platform → ingest → transform → orchestrate → ship → tune →
 * secure). Spark tuning belongs to exam Section 3 but is taught alongside the
 * Spark UI material in module 6, where it lands better.
 */
export const dataEngineerAssociate: Certification = {
  id: 'databricks-data-engineer-associate',
  title: 'Databricks Certified Data Engineer Associate',
  provider: 'Databricks',
  summary:
    'Build production data pipelines on the Databricks Data Intelligence Platform: ingestion with Auto Loader and Lakeflow Connect, PySpark transformations, Lakeflow Jobs orchestration, CI/CD with Asset Bundles, performance tuning, and Unity Catalog governance.',
  officialUrl:
    'https://www.databricks.com/learn/certification/data-engineer-associate',
  examFacts: {
    questions: 45,
    minutes: 90,
    passingNote: 'Multiple-choice, online or test-center proctored. USD 200.',
    validityYears: 2,
  },
  modules: [
    {
      id: 'platform',
      order: 1,
      title: 'The Data Intelligence Platform',
      summary:
        'Why the lakehouse exists, how Delta Lake and Unity Catalog make it trustworthy, and choosing compute without overpaying.',
      examSections: ['Section 1'],
      icon: '🧠',
      lessons: [lakehouseFoundationsLesson, computeChoicesLesson],
    },
    {
      id: 'ingestion',
      order: 2,
      title: 'Ingesting Data',
      summary:
        'Batch, streaming, and incremental patterns — with COPY INTO, Auto Loader, Lakeflow Connect, and custom JDBC/REST pulls.',
      examSections: ['Section 2'],
      icon: '📥',
      lessons: [
        ingestionPatternsLesson,
        copyIntoLesson,
        autoLoaderLesson,
        lakeflowConnectLesson,
      ],
    },
    {
      id: 'transformation',
      order: 3,
      title: 'Transforming with PySpark',
      summary:
        'Bronze to silver to gold: cleaning, joins, reshaping, deduplication, aggregation, and the objects that serve BI.',
      examSections: ['Section 3'],
      icon: '🔄',
      lessons: [
        bronzeToSilverLesson,
        joinsUnionsLesson,
        reshapingDataLesson,
        dedupAggregationLesson,
        goldLayerLesson,
      ],
    },
    {
      id: 'orchestration',
      order: 4,
      title: 'Orchestrating with Lakeflow Jobs',
      summary:
        'Jobs, tasks and the DAG; retries, branching and loops; and triggers that start work at the right moment.',
      examSections: ['Section 4'],
      icon: '🗓️',
      lessons: [jobsTasksDagLesson, controlFlowLesson, triggersSchedulingLesson],
    },
    {
      id: 'cicd',
      order: 5,
      title: 'CI/CD & Asset Bundles',
      summary:
        'Git folders for versioned notebooks, and Asset Bundles to package and promote whole pipelines across dev, test, and prod.',
      examSections: ['Section 5'],
      icon: '🚀',
      lessons: [gitFoldersLesson, assetBundlesLesson],
    },
    {
      id: 'optimization',
      order: 6,
      title: 'Optimization & Troubleshooting',
      summary:
        'Reading the Spark UI, the four tuning knobs, monitoring job health, Liquid Clustering, and cluster triage.',
      examSections: ['Section 3', 'Section 6'],
      icon: '🔬',
      lessons: [
        sparkUiBottlenecksLesson,
        sparkTuningBasicsLesson,
        monitoringJobsLesson,
        liquidClusteringLesson,
        clusterTroubleshootingLesson,
      ],
    },
    {
      id: 'governance',
      order: 7,
      title: 'Governance & Security',
      summary:
        'Managed vs external tables, the privilege hierarchy with GRANT/REVOKE/DENY, and fine-grained control with row filters, masks, and ABAC.',
      examSections: ['Section 7'],
      icon: '🔐',
      lessons: [
        managedExternalTablesLesson,
        accessControlLesson,
        fineGrainedSecurityLesson,
      ],
    },
  ],
}
