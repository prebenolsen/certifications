import { useState } from 'react'
import type { TrueFalseCard } from '@/types/content'
import { RichText } from '@/components/ui/RichText'
import { CardFrame } from './CardFrame'
import { AnswerFeedback } from './AnswerFeedback'
import type { CardRendererProps } from './types'

/**
 * True/false has no submit step — the click *is* the answer. So in `deferred`
 * mode nothing locks and nothing is revealed: the learner's pick shows as a
 * highlight and they change it by clicking the other button, which is exactly
 * what an exam looks like.
 */
export function TrueFalseRenderer({
  card,
  onAnswered,
  feedback = 'immediate',
  value,
  onValueChange,
}: CardRendererProps<TrueFalseCard>) {
  const [localChoice, setLocalChoice] = useState<boolean | null>(null)

  const controlled = value !== undefined
  // `[]` means "no answer given" and must not read as False.
  const choice = controlled
    ? value.length > 0
      ? value[0] === 'true'
      : null
    : localChoice
  const answered = choice !== null
  const revealed = feedback === 'revealed' || (feedback !== 'deferred' && answered)
  const locked = feedback === 'revealed' || (feedback === 'immediate' && answered)
  const correct = choice === card.answer

  function answer(value: boolean) {
    // The second guard stops deferred mode re-recording an identical answer.
    if (locked || choice === value) return
    if (controlled) onValueChange?.([String(value)])
    else setLocalChoice(value)
    if (feedback !== 'deferred') onAnswered?.(value === card.answer, [String(value)])
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
          if (revealed) {
            if (isRight) tone = 'border-good bg-good-soft text-good'
            else if (isChosen) tone = 'border-bad bg-bad-soft text-bad'
            else tone = 'border-slate-200 bg-surface opacity-60'
          } else if (isChosen) {
            // Deferred: show the pick, say nothing about it.
            tone = 'border-accent bg-accent-soft'
          }
          return (
            <button
              key={String(value)}
              type="button"
              onClick={() => answer(value)}
              disabled={locked}
              className={`flex-1 rounded-2xl border-2 px-4 py-4 text-base font-semibold transition ${tone}`}
            >
              {value ? 'True' : 'False'}
            </button>
          )
        })}
      </div>
      {revealed && (
        <AnswerFeedback correct={correct} explanation={card.explanation} />
      )}
    </CardFrame>
  )
}
