import { getCertification, getModule } from '@/content/registry'
import {
  isInteractive,
  type Card,
  type McqCard,
  type Module,
  type TrueFalseCard,
} from '@/types/content'
import { newSeed, rngFromSeed, shuffled } from './random'

export type QuizMode = 'exam' | 'practice' | 'review'

export interface ReviewRef {
  lessonId: string
  cardId: string
  moduleId?: string
}

export type QuizQuestionCard = McqCard | TrueFalseCard

export interface QuizQuestion {
  id: string
  origin: 'generated' | 'authored'
  card: QuizQuestionCard
  reviewRefs: ReviewRef[]
}

export const QUIZ_MIN = 3
export const QUIZ_TARGET = 12
export const VERDICT_MIN = 5

export { newSeed }

function cardReviewRefs(
  lessonId: string,
  card: Card,
  moduleId?: string,
): ReviewRef[] {
  const withReviewRefs = card as Card & { reviewRefs?: ReviewRef[] }
  const maybeRefs =
    'reviewRefs' in card && Array.isArray(withReviewRefs.reviewRefs)
      ? withReviewRefs.reviewRefs
      : []

  if (maybeRefs.length > 0) {
    return maybeRefs.map((ref) => ({
      ...ref,
      moduleId: ref.moduleId ?? moduleId,
    }))
  }

  return [{ lessonId, cardId: card.id, moduleId }]
}

export function buildQuizPool(certId: string, moduleId: string): QuizQuestion[] {
  const found = getModule(certId, moduleId)
  if (!found) return []

  return found.module.lessons.flatMap((lesson) => {
    if (lesson.status === 'planned') return []

    return lesson.cards.flatMap((card) => {
      if (!isInteractive(card)) return []

      return [{
        id: `g:${lesson.id}:${card.id}`,
        origin: 'generated',
        card: card as QuizQuestionCard,
        reviewRefs: cardReviewRefs(lesson.id, card, found.module.id),
      }]
    })
  })
}

export function buildCertificationQuizPool(certId: string): QuizQuestion[] {
  const cert = getCertification(certId)
  return cert?.modules.flatMap((module) => buildQuizPool(certId, module.id)) ?? []
}

export function quizPoolSize(module: Module): number {
  return module.lessons.flatMap((lesson) =>
    lesson.status === 'planned'
      ? []
      : lesson.cards.filter((card) => isInteractive(card)),
  ).length
}

export function resolveQuestion(
  certId: string,
  moduleId: string,
  questionId: string,
): QuizQuestion | undefined {
  return buildQuizPool(certId, moduleId).find((question) => question.id === questionId)
}

export function planQuestionIds(
  pool: QuizQuestion[],
  count: number,
  seed: number,
): string[] {
  const target = Math.min(Math.max(count, 0), pool.length)
  if (target === 0 || pool.length === 0) return []

  const rng = rngFromSeed(seed)
  return shuffled(pool.map((question) => question.id), rng).slice(0, target)
}
