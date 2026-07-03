import { useState } from 'react'
import type { TrueFalseCard } from '@/types/content'
import { RichText } from '@/components/ui/RichText'
import { CardFrame } from './CardFrame'
import { AnswerFeedback } from './AnswerFeedback'
import type { CardRendererProps } from './types'

export function TrueFalseRenderer({ card, onAnswered }: CardRendererProps<TrueFalseCard>) {
  const [choice, setChoice] = useState<boolean | null>(null)
  const answered = choice !== null
  const correct = choice === card.answer

  function answer(value: boolean) {
    if (answered) return
    setChoice(value)
    onAnswered?.(value === card.answer)
  }

  return (
    <CardFrame card={card}>
      <p className="mb-5 text-xl font-semibold text-ink">
        <RichText value={card.statement} />
      </p>
      <div className="flex gap-3">
        {[true, false].map((value) => {
          const isChosen = choice === value
          const isRight = value === card.answer
          let tone = 'border-slate-200 bg-surface hover:border-accent'
          if (answered) {
            if (isRight) tone = 'border-good bg-good-soft text-good'
            else if (isChosen) tone = 'border-bad bg-bad-soft text-bad'
            else tone = 'border-slate-200 bg-surface opacity-60'
          }
          return (
            <button
              key={String(value)}
              type="button"
              onClick={() => answer(value)}
              disabled={answered}
              className={`flex-1 rounded-2xl border-2 px-4 py-4 text-base font-semibold transition ${tone}`}
            >
              {value ? 'True' : 'False'}
            </button>
          )
        })}
      </div>
      {answered && (
        <AnswerFeedback correct={correct} explanation={card.explanation} />
      )}
    </CardFrame>
  )
}
