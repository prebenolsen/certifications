import type { Certification } from '@/types/content'
import { dataEngineeringIntroLesson } from './lessons/data-engineering-intro'
import { whatIsDatabricksIntroLesson } from './lessons/what-is-databricks-intro'
import { lakehouseIntroLesson } from './lessons/lakehouse-intro'
import { deltaLakeIntroLesson } from './lessons/delta-lake-intro'
import { unityCatalogIntroLesson } from './lessons/unity-catalog-intro'
import { computeIntroLesson } from './lessons/compute-intro'
import { lakeflowIntroLesson } from './lessons/lakeflow-intro'
import { medallionIntroLesson } from './lessons/medallion-intro'
import { analyticsAiIntroLesson } from './lessons/analytics-ai-intro'
import { endToEndIntroLesson } from './lessons/end-to-end-intro'

/**
 * Introduction to Data Engineering with Databricks — a course, not a
 * certification. There is no exam to sit, so `examFacts` is deliberately
 * omitted.
 *
 * Audience: someone who has never met any of these components. Every other
 * track on this platform assumes a working data engineer; this one assumes
 * only general technical literacy and answers the question the other tracks
 * skip — *what are all these things, and how do they fit together?*
 *
 * Scope discipline: high-level and abstract on purpose. Each lesson explains
 * what a component **is** and why it exists, then stops. Depth lives in the
 * certification tracks, and duplicating it here would turn a short
 * orientation into a fifth cert.
 *
 * Reading order carries the teaching: the job before the vendor, the problem
 * before the product, storage and governance before pipelines, and a capstone
 * that assembles all of it. No lesson names a component that a later lesson
 * is responsible for introducing.
 */
export const introDataEngineering: Certification = {
  id: 'databricks-intro-data-engineering',
  title: 'Introduction to Data Engineering with Databricks',
  provider: 'Databricks',
  summary:
    'A short, high-level tour for anyone new to all of it: what data engineering is, what Databricks is, and what each major component — Delta Lake, Unity Catalog, compute, Lakeflow, Databricks SQL — actually does. No exam, no depth, no prerequisites.',
  officialUrl: 'https://docs.databricks.com/aws/en/introduction/',
  modules: [
    {
      id: 'orientation',
      order: 1,
      title: 'The job and the platform',
      summary:
        'What data engineers are actually paid to do, what Databricks is, and the one idea the whole platform is built on.',
      examSections: ['Orientation'],
      icon: '🧭',
      lessons: [
        dataEngineeringIntroLesson,
        whatIsDatabricksIntroLesson,
        lakehouseIntroLesson,
      ],
    },
    {
      id: 'foundations',
      order: 2,
      title: 'The two layers everything rests on',
      summary:
        'Delta Lake makes files behave like a trustworthy database. Unity Catalog decides what things are called and who may see them.',
      examSections: ['Foundations'],
      icon: '🧱',
      lessons: [deltaLakeIntroLesson, unityCatalogIntroLesson],
    },
    {
      id: 'pipelines',
      order: 3,
      title: 'Building a pipeline',
      summary:
        'Where the work runs and what it costs, the Lakeflow family that moves and shapes the data, and the layered convention that turns raw data into something anyone can trust.',
      examSections: ['Pipelines'],
      icon: '🔄',
      lessons: [computeIntroLesson, lakeflowIntroLesson, medallionIntroLesson],
    },
    {
      id: 'payoff',
      order: 4,
      title: 'What the data is for',
      summary:
        'The surfaces people actually use — SQL, dashboards, plain-language questions, AI — and one worked example running through every component in the course.',
      examSections: ['Analytics & AI'],
      icon: '📊',
      lessons: [analyticsAiIntroLesson, endToEndIntroLesson],
    },
  ],
}
