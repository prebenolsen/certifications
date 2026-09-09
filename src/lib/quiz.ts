import { getCertification, getModule } from '@/content/registry'
import {
  isInteractive,
  type Card,
  type McqCard,
  type Module,
  type ReviewRef,
  type TrueFalseCard,
} from '@/types/content'
import { newSeed, rngFromSeed, shuffled } from './random'

export type QuizMode = 'exam' | 'practice' | 'review'

export type { ReviewRef }

export type QuizQuestionCard = McqCard | TrueFalseCard

export interface QuizQuestion {
  /** Stable id: `g:<lessonId>:<cardId>` for a question generated from a lesson. */
  id: string
  origin: 'generated'
  card: QuizQuestionCard
  /** Where the teaching is. Never empty. */
  reviewRefs: ReviewRef[]
}

/**
 * The certification-wide targeted review keeps attempt history the same way a
 * module does, so it needs a key in the same map. Module ids are authored
 * kebab-case slugs, so the double underscores keep this out of their space.
 */
export const STRUGGLES_KEY = '__struggles__'

/** Smallest pool worth calling a quiz. Below this, the module has no quiz. */
export const QUIZ_MIN = 3
/** Questions per attempt when the pool is bigger than this. */
export const QUIZ_TARGET = 12
/** Below this, a pass/fail verdict is noise rather than signal. */
export const VERDICT_MIN = 5

export { newSeed }

/** The learner-visible question text, whichever card shape it is. */
export function questionStem(card: QuizQuestionCard): string {
  return card.type === 'mcq' ? card.question : card.statement
}

/** The stored ids of the right answer(s), in one shape for both card types. */
export function correctIdsOf(card: QuizQuestionCard): string[] {
  return card.type === 'mcq' ? card.correct : [String(card.answer)]
}

/**
 * The single scoring rule. `chosen` is option ids for mcq and `['true']` /
 * `['false']` for truefalse; `[]` ("I don't know") is never correct.
 */
export function questionCorrect(card: QuizQuestionCard, chosen: string[]): boolean {
  if (card.type === 'mcq') {
    const correct = new Set(card.correct)
    return chosen.length === card.correct.length && chosen.every((id) => correct.has(id))
  }

  return chosen.length === 1 && chosen[0] === String(card.answer)
}

/**
 * An in-lesson check normally teaches its own answer, so its position *is* the
 * reference. An authored `reviewRefs` overrides that, for a check that tests
 * something taught elsewhere.
 */
function cardReviewRefs(lessonId: string, card: Card, moduleId: string): ReviewRef[] {
  const authored = 'reviewRefs' in card ? card.reviewRefs : undefined

  if (authored && authored.length > 0) {
    return authored.map((ref) => ({ ...ref, moduleId: ref.moduleId ?? moduleId }))
  }

  return [{ lessonId, cardId: card.id, moduleId }]
}

/** Every question a module could ask, in content order. UI-free. */
export function buildQuizPool(certId: string, moduleId: string): QuizQuestion[] {
  const found = getModule(certId, moduleId)
  if (!found) return []

  return found.module.lessons.flatMap((lesson) => {
    if (lesson.status === 'planned') return []

    return lesson.cards.flatMap((card) => {
      if (!isInteractive(card)) return []

      return [{
        id: `g:${lesson.id}:${card.id}`,
        origin: 'generated' as const,
        card: card as QuizQuestionCard,
        reviewRefs: cardReviewRefs(lesson.id, card, found.module.id),
      }]
    })
  })
}

/** Every question in a certification — the pool the targeted review draws from. */
export function buildCertificationQuizPool(certId: string): QuizQuestion[] {
  const cert = getCertification(certId)
  return cert?.modules.flatMap((module) => buildQuizPool(certId, module.id)) ?? []
}

/**
 * Pool size without building the pool — for deciding whether to offer a quiz
 * at all. Memoised per module, since the module page asks on every render.
 */
const poolSizeCache = new WeakMap<Module, number>()

export function quizPoolSize(module: Module): number {
  const cached = poolSizeCache.get(module)
  if (cached !== undefined) return cached

  const size = module.lessons.reduce(
    (total, lesson) =>
      lesson.status === 'planned'
        ? total
        : total + lesson.cards.filter((card) => isInteractive(card)).length,
    0,
  )
  poolSizeCache.set(module, size)
  return size
}

/** How many questions an attempt on this module would ask. */
export function quizAttemptSize(poolSize: number): number {
  return Math.min(poolSize, QUIZ_TARGET)
}

/**
 * The ordered question ids for a new attempt. Shuffled once from a stored seed
 * so resume and the results screen can replay the exact order served — and so
 * learners cannot memorise positions.
 */
export function planQuestionIds(
  pool: QuizQuestion[],
  count: number,
  seed: number,
): string[] {
  const target = Math.min(Math.max(count, 0), pool.length)
  if (target === 0) return []

  const rng = rngFromSeed(seed)
  return shuffled(pool.map((question) => question.id), rng).slice(0, target)
}
