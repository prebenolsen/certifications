import type {
  Certification,
  ContentStatus,
  Lesson,
  Module,
} from '@/types/content'
import { dataAnalystAssociate } from './databricks/data-analyst-associate'
import { dataEngineerAssociate } from './databricks/data-engineer-associate'

/** All certifications known to the app. Add new ones here. */
export const certifications: Certification[] = [
  dataAnalystAssociate,
  dataEngineerAssociate,
]

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
