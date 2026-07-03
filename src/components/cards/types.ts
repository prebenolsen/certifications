import type { Card } from '@/types/content'

/**
 * Every card renderer receives the card plus optional interaction callbacks.
 * Non-interactive cards simply ignore `onAnswered`.
 */
export interface CardRendererProps<C extends Card = Card> {
  card: C
  /**
   * Called once when the learner answers an interactive card (mcq/truefalse).
   * `correct` reports whether their answer was right, for progress + scoring.
   */
  onAnswered?: (correct: boolean) => void
}
