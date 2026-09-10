import type {
  Certification,
  ContentStatus,
  Lesson,
  Module,
} from '@/types/content'
import { dataAnalystAssociate } from './databricks/data-analyst-associate'
import { dataEngineerAssociate } from './databricks/data-engineer-associate'
import { dataEngineerProfessional } from './databricks/data-engineer-professional'
import { generativeAiEngineerAssociate } from './databricks/generative-ai-engineer-associate'
import { introDataEngineering } from './databricks/intro-data-engineering'
import { githubCopilot } from './github/copilot'

/** All certifications known to the app. Add new ones here. */
export const certifications: Certification[] = [
  introDataEngineering,
  dataAnalystAssociate,
  dataEngineerAssociate,
  dataEngineerProfessional,
  generativeAiEngineerAssociate,
  githubCopilot,
]

/**
 * A certification's status, derived from its lessons the same way a module's
 * is. Nothing declares "this cert is finished" by hand, so the label can never
 * drift from the content: authoring the last lesson is what moves a track out
 * of "Coming soon".
 */
export function certificationStatus(cert: Certification): ContentStatus {
  const lessons = cert.modules.flatMap((m) => m.lessons)
  if (lessons.length === 0) return 'planned'
  if (lessons.every((l) => l.status === 'complete')) return 'complete'
  if (lessons.every((l) => l.status === 'planned')) return 'planned'
  return 'in-progress'
}

/**
 * How much of a certification is written. Distinct from a learner's progress:
 * this is *our* progress, and it is what the "Coming soon" shelf reports.
 */
export function certContentCounts(cert: Certification): {
  authored: number
  total: number
} {
  const lessons = cert.modules.flatMap((m) => m.lessons)
  return {
    authored: lessons.filter((l) => l.status !== 'planned').length,
    total: lessons.length,
  }
}

/**
 * Fully authored tracks — what the home page actually offers. Kept apart from
 * the half-written ones so a learner picking a certification is choosing
 * between things that will not run out halfway through.
 */
export const availableCertifications: Certification[] = certifications.filter(
  (c) => certificationStatus(c) === 'complete',
)

/** Still being written. Browsable, but shelved separately under "Coming soon". */
export const upcomingCertifications: Certification[] = certifications.filter(
  (c) => certificationStatus(c) !== 'complete',
)

export function getCertification(id: string): Certification | undefined {
  return certifications.find((c) => c.id === id)
}

export function getModule(
  certId: string,
  moduleId: string,
): { cert: Certification; module: Module } | undefined {
  const cert = getCertification(certId)
  const module = cert?.modules.find((m) => m.id === moduleId)
  if (!cert || !module) return undefined
  return { cert, module }
}

export function getLesson(
  certId: string,
  moduleId: string,
  lessonId: string,
):
  | { cert: Certification; module: Module; lesson: Lesson }
  | undefined {
  const found = getModule(certId, moduleId)
  const lesson = found?.module.lessons.find((l) => l.id === lessonId)
  if (!found || !lesson) return undefined
  return { ...found, lesson }
}

/** Count of authored (playable) lessons in a module. */
export function playableLessonCount(module: Module): number {
  return module.lessons.filter((l) => l.status !== 'planned').length
}

/**
 * A module's status is derived from its lessons so it can never drift from
 * reality: complete when every lesson is, planned when none are authored,
 * in-progress otherwise.
 */
export function moduleStatus(module: Module): ContentStatus {
  if (module.lessons.length === 0) return 'planned'
  if (module.lessons.every((l) => l.status === 'complete')) return 'complete'
  if (module.lessons.every((l) => l.status === 'planned')) return 'planned'
  return 'in-progress'
}

/**
 * The next playable lesson after the given one, looking past the end of the
 * current module into later modules. Used for "Next lesson" at the end of the
 * player.
 */
export function getNextLesson(
  certId: string,
  moduleId: string,
  lessonId: string,
): { module: Module; lesson: Lesson } | undefined {
  const cert = getCertification(certId)
  if (!cert) return undefined
  const flat = cert.modules.flatMap((module) =>
    module.lessons.map((lesson) => ({ module, lesson })),
  )
  const idx = flat.findIndex(
    (e) => e.module.id === moduleId && e.lesson.id === lessonId,
  )
  if (idx === -1) return undefined
  return flat
    .slice(idx + 1)
    .find((e) => e.lesson.status !== 'planned' && e.lesson.cards.length > 0)
}
