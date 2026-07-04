import type { Certification } from '@/types/content'
// Module 1 — Advanced Development in Python & SQL
import { pythonProjectStructureLesson } from './lessons/python-project-structure'
import { libraryDependenciesLesson } from './lessons/library-dependencies'
import { pythonSqlUdfsLesson } from './lessons/python-sql-udfs'
import { testingEtlLesson } from './lessons/testing-etl'
// Module 2 — Declarative Pipelines & Streaming
import { declarativePipelinesLesson } from './lessons/declarative-pipelines'
import { streamingTablesVsMvsLesson } from './lessons/streaming-tables-vs-mvs'
import { applyChangesCdcLesson } from './lessons/apply-changes-cdc'
import { structuredStreamingTuningLesson } from './lessons/structured-streaming-tuning'
import { pipelineConfigsLesson } from './lessons/pipeline-configs'
// Module 3 — Ingestion & Acquisition
import { ingestionFormatsLesson } from './lessons/ingestion-formats'
import { appendOnlyDeltaLesson } from './lessons/append-only-delta'
// Module 4 — Transformation, Cleansing & Quality
import { advancedTransformationsLesson } from './lessons/advanced-transformations'
import { dataQuarantineLesson } from './lessons/data-quarantine'
// Module 5 — Data Modelling with Delta
import { deltaInternalsLesson } from './lessons/delta-internals'
import { dimensionalModelingLesson } from './lessons/dimensional-modeling'
import { liquidClusteringLesson } from './lessons/liquid-clustering'
// Module 6 — Cost & Performance Optimization
import { managedTablesOverheadLesson } from './lessons/managed-tables-overhead'
import { dataSkippingPruningLesson } from './lessons/data-skipping-pruning'
import { changeDataFeedLesson } from './lessons/change-data-feed'
import { queryProfilingLesson } from './lessons/query-profiling'
// Module 7 — Sharing, Federation & Governance
import { deltaSharingLesson } from './lessons/delta-sharing'
import { lakehouseFederationLesson } from './lessons/lakehouse-federation'
import { governanceDiscoverabilityLesson } from './lessons/governance-discoverability'
// Module 8 — Security & Compliance
import { workspaceAclsSecretsLesson } from './lessons/workspace-acls-secrets'
import { rowFiltersColumnMasksLesson } from './lessons/row-filters-column-masks'
import { piiAnonymizationLesson } from './lessons/pii-anonymization'
import { dataPurgingRetentionLesson } from './lessons/data-purging-retention'
// Module 9 — Monitoring, Debugging & CI/CD
import { observabilityLesson } from './lessons/observability'
import { alertingLesson } from './lessons/alerting'
import { jobsDebuggingLesson } from './lessons/jobs-debugging'
import { cicdAssetBundlesLesson } from './lessons/cicd-asset-bundles'

/**
 * Databricks Certified Data Engineer Professional.
 *
 * Nine modules organized as a learning arc — advanced Python/SQL development →
 * declarative pipelines & streaming → ingestion → transformation → data
 * modelling → optimization → sharing & governance → security → monitoring,
 * debugging & CI/CD — each mapped back to the official exam sections (1–10).
 *
 * The exam has 10 outline sections; Section 1 (development) is large enough to
 * span two learning modules, and Sections 4/8, 5/9 pair naturally.
 *
 * All 31 lessons are fully authored, and every official sample question is
 * woven into a lesson as an MCQ.
 */
export const dataEngineerProfessional: Certification = {
  id: 'databricks-data-engineer-professional',
  title: 'Databricks Certified Data Engineer Professional',
  provider: 'Databricks',
  summary:
    'Design, optimize, and operate production-grade data engineering on the Databricks Data Intelligence Platform: modular Python for Asset Bundles, Lakeflow Spark Declarative Pipelines and Structured Streaming, CDC with APPLY CHANGES, Delta modelling and optimization (Liquid Clustering, deletion vectors, CDF), Delta Sharing and Lakehouse Federation, fine-grained security and PII compliance, and observability, debugging and CI/CD.',
  officialUrl:
    'https://www.databricks.com/learn/certification/data-engineer-professional',
  examFacts: {
    questions: 59,
    minutes: 120,
    passingNote:
      'Multiple-choice, online or test-center proctored. No test aides. USD 200.',
    validityYears: 2,
  },
  modules: [
    {
      id: 'development',
      order: 1,
      title: 'Advanced Development in Python & SQL',
      summary:
        'Structure a Python project for Asset Bundles, manage third-party dependencies, write Pandas/Python UDFs, and test pipelines with assertDataFrameEqual.',
      examSections: ['Section 1'],
      icon: '🐍',
      lessons: [
        pythonProjectStructureLesson,
        libraryDependenciesLesson,
        pythonSqlUdfsLesson,
        testingEtlLesson,
      ],
    },
    {
      id: 'pipelines-streaming',
      order: 2,
      title: 'Declarative Pipelines & Streaming',
      summary:
        'Build production Lakeflow Spark Declarative Pipelines, choose streaming tables vs materialized views, apply CDC, and tune Structured Streaming.',
      examSections: ['Section 1'],
      icon: '🌊',
      lessons: [
        declarativePipelinesLesson,
        streamingTablesVsMvsLesson,
        applyChangesCdcLesson,
        structuredStreamingTuningLesson,
        pipelineConfigsLesson,
      ],
    },
    {
      id: 'ingestion',
      order: 3,
      title: 'Ingestion & Acquisition',
      summary:
        'Ingest many formats from message buses and cloud storage, and build append-only pipelines that serve batch and streaming from one Delta table.',
      examSections: ['Section 2'],
      icon: '📥',
      lessons: [ingestionFormatsLesson, appendOnlyDeltaLesson],
    },
    {
      id: 'transformation',
      order: 4,
      title: 'Transformation, Cleansing & Quality',
      summary:
        'Advanced Spark SQL and PySpark — window functions, joins, aggregations — and quarantining bad data with expectations.',
      examSections: ['Section 3'],
      icon: '🔄',
      lessons: [advancedTransformationsLesson, dataQuarantineLesson],
    },
    {
      id: 'modelling',
      order: 5,
      title: 'Data Modelling with Delta',
      summary:
        'Delta Lake internals and ACID, clones, choosing partition keys, dimensional models, and Liquid Clustering over partitioning/ZORDER.',
      examSections: ['Section 10'],
      icon: '🏗️',
      lessons: [
        deltaInternalsLesson,
        dimensionalModelingLesson,
        liquidClusteringLesson,
      ],
    },
    {
      id: 'optimization',
      order: 6,
      title: 'Cost & Performance Optimization',
      summary:
        'Managed-table overhead, data skipping and file pruning, deletion vectors, Change Data Feed, and reading the query profile for bottlenecks.',
      examSections: ['Section 6'],
      icon: '⚡',
      lessons: [
        managedTablesOverheadLesson,
        dataSkippingPruningLesson,
        changeDataFeedLesson,
        queryProfilingLesson,
      ],
    },
    {
      id: 'sharing-governance',
      order: 7,
      title: 'Sharing, Federation & Governance',
      summary:
        'Delta Sharing (D2D and open protocol), Lakehouse Federation, and Unity Catalog metadata, discoverability, and permission inheritance.',
      examSections: ['Section 4', 'Section 8'],
      icon: '🔗',
      lessons: [
        deltaSharingLesson,
        lakehouseFederationLesson,
        governanceDiscoverabilityLesson,
      ],
    },
    {
      id: 'security-compliance',
      order: 8,
      title: 'Security & Compliance',
      summary:
        'Workspace ACLs and secrets, row filters and column masks, PII anonymization techniques, and compliant data purging.',
      examSections: ['Section 7'],
      icon: '🔐',
      lessons: [
        workspaceAclsSecretsLesson,
        rowFiltersColumnMasksLesson,
        piiAnonymizationLesson,
        dataPurgingRetentionLesson,
      ],
    },
    {
      id: 'ops-cicd',
      order: 9,
      title: 'Monitoring, Debugging & CI/CD',
      summary:
        'System tables and event logs for observability, SQL and job alerts, debugging failed runs with repairs, and deploying with Asset Bundles and Git.',
      examSections: ['Section 5', 'Section 9'],
      icon: '🔍',
      lessons: [
        observabilityLesson,
        alertingLesson,
        jobsDebuggingLesson,
        cicdAssetBundlesLesson,
      ],
    },
  ],
}
