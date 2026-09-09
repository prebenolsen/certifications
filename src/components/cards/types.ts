import type { Card } from '@/types/content'

/**
 * How much an interactive renderer gives away after the learner answers.
 *
 * - `immediate` — answer, lock, reveal. The in-lesson behaviour, and the default.
 * - `deferred`  — accept and show the selection, never say whether it is right.
 *                 Nothing locks, so the learner can change their mind. This is
 *                 exam mode, where **selection is the answer**: there is no
 *                 submit step, because a submit with no feedback would only
 *                 lock the learner out.
 * - `revealed`  — force the answered state and lock it, for a results or review
 *                 screen replaying an answer the learner already gave.
 *
 * One tri-state rather than two booleans, because the three are mutually
 * exclusive and a boolean pair admits nonsense.
 */
export type FeedbackMode = 'immediate' | 'deferred' | 'revealed'

/**
 * Every card renderer receives the card plus optional interaction callbacks.
 * Non-interactive cards simply ignore everything but `card`.
 */
export interface CardRendererProps<C extends Card = Card> {
  card: C
  /**
   * Called once when the learner answers an interactive card (mcq/truefalse).
   * `correct` reports whether their answer was right, for progress + scoring;
   * `chosen` reports the option ids picked, for quiz results and review.
   *
   * Not called in `deferred` mode — there is no submit step to fire it. A
   * caller in that mode reads answers through `onValueChange` and scores them
   * itself (see `questionCorrect` in `src/lib/quiz.ts`).
   */
  onAnswered?: (correct: boolean, chosen?: string[]) => void
  /** Defaults to `immediate` in each renderer. See `FeedbackMode`. */
  feedback?: FeedbackMode
  /**
   * Controlled selection, for a caller that owns the answer buffer — the quiz
   * player and the results screen. Passing this (even as `[]`) makes the
   * renderer controlled, so **the caller must persist `onValueChange` or clicks
   * will appear to do nothing**. A controlled renderer with no `onValueChange`
   * is read-only, which is what a results screen wants.
   *
   * Option ids for `mcq`; the strings `'true'` / `'false'` for `truefalse`, and
   * `[]` for "no answer given" — the same encoding the quiz stores. Ignored by
   * every non-interactive renderer.
   *
   * Not to be confused with `McqCard.optionFeedback`, which is authored content.
   */
  value?: string[]
  onValueChange?: (chosen: string[]) => void
}
