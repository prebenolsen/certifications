import { useState } from 'react'
import type { FlashcardCard } from '@/types/content'
import { RichText } from '@/components/ui/RichText'
import { CardFrame } from './CardFrame'
import type { CardRendererProps } from './types'

/**
 * Click-to-flip flashcard. Prompt on the front, answer revealed on the back.
 *
 * After revealing the answer the learner self-grades their recall — "I knew
 * this" / "I didn't know this" — which is recorded through the same
 * `onAnswered` progress channel as mcq/truefalse. Unlike a quiz, this is a
 * self-report of recall, not an objectively-scored answer, so flashcards are
 * intentionally excluded from `INTERACTIVE_CARD_TYPES` (quiz accuracy) and
 * tracked separately for competence. The first self-grade is final.
 */
export function FlashcardRenderer({ card, onAnswered }: CardRendererProps<FlashcardCard>) {
  const [flipped, setFlipped] = useState(false)
  const [knewIt, setKnewIt] = useState<boolean | null>(null)
  const graded = knewIt !== null

  function grade(value: boolean) {
    if (graded) return // first self-grade is final, mirroring mcq/truefalse
    setKnewIt(value)
    onAnswered?.(value)
  }

  return (
    <CardFrame card={card}>
      <button
        type="button"
        onClick={() => setFlipped(true)}
        disabled={flipped}
        className="group w-full text-left"
        aria-pressed={flipped}
      >
        <div className="flex min-h-[9rem] flex-col justify-center rounded-2xl border border-slate-200 bg-surface-sunken p-6 transition group-enabled:group-hover:border-accent">
          {!flipped ? (
            <p className="text-xl font-semibold text-ink">
              <RichText value={card.front} />
            </p>
          ) : (
            <p className="animate-pop-in text-lg text-ink">
              <RichText value={card.back} />
            </p>
          )}
        </div>
        {!flipped && (
          <p className="mt-3 text-center text-sm font-medium text-accent">
            Tap to reveal the answer
          </p>
        )}
      </button>

      {flipped && !graded && (
        <div className="mt-4 animate-pop-in">
          <p className="mb-2 text-center text-xs font-medium uppercase tracking-wide text-ink-faint">
            Did you know this?
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => grade(false)}
              className="flex-1 rounded-2xl border-2 border-warn bg-warn-soft px-4 py-3 text-sm font-semibold text-warn transition hover:brightness-95"
            >
              I didn't know this
            </button>
            <button
              type="button"
              onClick={() => grade(true)}
              className="flex-1 rounded-2xl border-2 border-good bg-good-soft px-4 py-3 text-sm font-semibold text-good transition hover:brightness-95"
            >
              I knew this
            </button>
          </div>
        </div>
      )}

      {graded && (
        <p
          className={`mt-4 rounded-2xl border-2 px-4 py-3 text-center text-sm font-semibold ${
            knewIt
              ? 'border-good bg-good-soft text-good'
              : 'border-warn bg-warn-soft text-warn'
          }`}
        >
          {knewIt ? 'Marked as known ✓' : 'Marked to review ✓'}
        </p>
      )}
    </CardFrame>
  )
}
