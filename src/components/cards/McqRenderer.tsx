import { useState } from 'react'
import type { McqCard } from '@/types/content'
import { RichText } from '@/components/ui/RichText'
import { CardFrame } from './CardFrame'
import { AnswerFeedback } from './AnswerFeedback'
import type { CardRendererProps } from './types'

/**
 * Multiple-choice question supporting single- and multi-select.
 * Multi-select is inferred from `correct.length > 1`.
 */
export function McqRenderer({ card, onAnswered }: CardRendererProps<McqCard>) {
  const multi = card.correct.length > 1
  const [selected, setSelected] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)

  const correctSet = new Set(card.correct)
  const isCorrect =
    selected.length === card.correct.length &&
    selected.every((id) => correctSet.has(id))

  function toggle(id: string) {
    if (submitted) return
    setSelected((prev) => {
      if (multi) {
        return prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      }
      return [id]
    })
  }

  function submit() {
    if (submitted || selected.length === 0) return
    setSubmitted(true)
    onAnswered?.(isCorrect)
  }

  return (
    <CardFrame card={card}>
      <p className="mb-2 text-xl font-semibold text-ink">
        <RichText value={card.question} />
      </p>
      {multi && (
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-faint">
          Select all that apply
        </p>
      )}
      <div className="space-y-2">
        {card.options.map((opt) => {
          const chosen = selected.includes(opt.id)
          const isRight = correctSet.has(opt.id)
          let tone = chosen
            ? 'border-accent bg-accent-soft'
            : 'border-slate-200 bg-surface hover:border-slate-300'
          if (submitted) {
            if (isRight) tone = 'border-good bg-good-soft'
            else if (chosen) tone = 'border-bad bg-bad-soft'
            else tone = 'border-slate-200 bg-surface opacity-60'
          }
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => toggle(opt.id)}
              disabled={submitted}
              className={`flex w-full items-start gap-3 rounded-2xl border-2 px-4 py-3 text-left text-sm transition ${tone}`}
            >
              <span
                className={`mt-0.5 flex h-5 w-5 flex-none items-center justify-center border text-xs font-bold ${
                  multi ? 'rounded-md' : 'rounded-full'
                } ${
                  chosen ? 'border-accent bg-accent text-white' : 'border-slate-300 text-transparent'
                }`}
                aria-hidden
              >
                {opt.id.toUpperCase()}
              </span>
              <span className="text-ink">
                <RichText value={opt.text} />
                {submitted && card.optionFeedback?.[opt.id] && (
                  <span className="mt-1 block text-xs text-ink-faint">
                    <RichText value={card.optionFeedback[opt.id]} />
                  </span>
                )}
              </span>
            </button>
          )
        })}
      </div>

      {!submitted ? (
        <button
          type="button"
          onClick={submit}
          disabled={selected.length === 0}
          className="mt-5 w-full rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-white transition enabled:hover:bg-ink-soft disabled:opacity-40"
        >
          Check answer
        </button>
      ) : (
        <AnswerFeedback correct={isCorrect} explanation={card.explanation}>
          {card.examObjective && (
            <p className="mt-3 border-t border-black/10 pt-2 text-xs text-ink-faint">
              <span className="font-semibold">Exam objective:</span>{' '}
              {card.examObjective}
            </p>
          )}
        </AnswerFeedback>
      )}
    </CardFrame>
  )
}
