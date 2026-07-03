import { useProgress } from '@/context/ProgressContext'
import type { Certification, Lesson, Module } from '@/types/content'
import { isInteractive } from '@/types/content'

export interface LessonStats {
  status: Lesson['status']
  completed: boolean
  /** Fraction 0..1 of cards viewed. */
  progress: number
  /** Quiz accuracy 0..1, or null if no interactive cards answered. */
  accuracy: number | null
}

export interface ModuleStats {
  totalPlayable: number
  completedLessons: number
  /** Fraction 0..1 of playable lessons completed. */
  progress: number
}

/** Computes learner-facing stats for a lesson from stored progress. */
export function useLessonStats(certId: string, lesson: Lesson): LessonStats {
  const { getLesson } = useProgress()
  const p = getLesson(certId, lesson.id)

  const interactiveIds = lesson.cards.filter(isInteractive).map((c) => c.id)
  const viewed = p?.viewedCards.length ?? 0
  const progress = lesson.cards.length ? viewed / lesson.cards.length : 0

  let accuracy: number | null = null
  if (p && interactiveIds.length) {
    const answered = interactiveIds.filter((id) => id in p.answers)
    if (answered.length) {
      const correct = answered.filter((id) => p.answers[id]).length
      accuracy = correct / answered.length
    }
  }

  return {
    status: lesson.status,
    completed: p?.completed ?? false,
    progress,
    accuracy,
  }
}

/** Aggregates lesson completion into module-level stats. */
export function useModuleStats(certId: string, module: Module): ModuleStats {
  const { getLesson } = useProgress()
  const playable = module.lessons.filter((l) => l.status !== 'planned')
  const completed = playable.filter(
    (l) => getLesson(certId, l.id)?.completed,
  ).length
  return {
    totalPlayable: playable.length,
    completedLessons: completed,
    progress: playable.length ? completed / playable.length : 0,
  }
}

/** Certification-wide completion across all playable lessons. */
export function useCertStats(cert: Certification) {
  const { getLesson } = useProgress()
  const playable = cert.modules.flatMap((m) =>
    m.lessons.filter((l) => l.status !== 'planned'),
  )
  const completed = playable.filter(
    (l) => getLesson(cert.id, l.id)?.completed,
  ).length
  return {
    totalPlayable: playable.length,
    completedLessons: completed,
    progress: playable.length ? completed / playable.length : 0,
  }
}
