import { useState } from 'react'
import type { FlashcardCard } from '@/types/content'
import { RichText } from '@/components/ui/RichText'
import { CardFrame } from './CardFrame'
import type { CardRendererProps } from './types'

/** Click-to-flip flashcard. Prompt on the front, answer revealed on the back. */
export function FlashcardRenderer({ card }: CardRendererProps<FlashcardCard>) {
  const [flipped, setFlipped] = useState(false)
  return (
    <CardFrame card={card}>
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        className="group w-full text-left"
        aria-pressed={flipped}
      >
        <div className="flex min-h-[9rem] flex-col justify-center rounded-2xl border border-slate-200 bg-surface-sunken p-6 transition group-hover:border-accent">
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
        <p className="mt-3 text-center text-sm font-medium text-accent">
          {flipped ? 'Tap to see the question again' : 'Tap to reveal the answer'}
        </p>
      </button>
    </CardFrame>
  )
}
