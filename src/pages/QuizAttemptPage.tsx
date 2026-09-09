import { useMemo, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { RichText } from '@/components/ui/RichText'
import { useProgress } from '@/context/ProgressContext'
import {
  buildQuizPool,
  newSeed,
  planQuestionIds,
  QUIZ_MIN,
  QUIZ_TARGET,
  type QuizQuestionCard,
} from '@/lib/quiz'
import { NotFound } from './NotFound'

function questionStem(card: QuizQuestionCard): string {
  return card.type === 'mcq' ? card.question : card.statement
}

function questionCorrect(card: QuizQuestionCard, chosen: string[]): boolean {
  if (card.type === 'mcq') {
    const correct = new Set(card.correct)
    return chosen.length === card.correct.length && chosen.every((id) => correct.has(id))
  }

  return chosen.length === 1 && chosen[0] === String(card.answer)
}

function McqQuizQuestion({
  card,
  value,
  onSubmit,
}: {
  card: Extract<QuizQuestionCard, { type: 'mcq' }>
  value: string[]
  onSubmit: (chosen: string[]) => void
}) {
  const [selected, setSelected] = useState<string[]>(value)
  const [submitted, setSubmitted] = useState(false)
  const correctSet = new Set(card.correct)

  function submit() {
    if (selected.length === 0) return
    setSubmitted(true)
    onSubmit(selected)
  }

  return (
    <div className="mx-auto w-full max-w-3xl rounded-3xl border border-slate-200 bg-surface p-6 shadow-lg">
      <p className="text-xl font-semibold text-ink"><RichText value={card.question} /></p>
      <div className="mt-5 space-y-3">
        {card.options.map((option) => {
          const chosen = selected.includes(option.id)
          const isRight = correctSet.has(option.id)
          let tone = chosen ? 'border-accent bg-accent-soft' : 'border-slate-200 bg-surface hover:border-slate-300'
          if (submitted) {
            if (isRight) tone = 'border-good bg-good-soft'
            else if (chosen) tone = 'border-bad bg-bad-soft'
            else tone = 'border-slate-200 bg-surface opacity-60'
          }

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => {
                if (submitted) return
                if (card.correct.length > 1) {
                  setSelected((prev) =>
                    prev.includes(option.id)
                      ? prev.filter((id) => id !== option.id)
                      : [...prev, option.id],
                  )
                  return
                }
                setSelected([option.id])
              }}
              className={`flex w-full items-start gap-3 rounded-2xl border-2 px-4 py-3 text-left text-sm transition ${tone}`}
            >
              <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full border border-slate-300 text-xs font-bold text-ink">
                {option.id.toUpperCase()}
              </span>
              <span className="flex-1 text-ink"><RichText value={option.text} /></span>
            </button>
          )
        })}
      </div>

      {!submitted ? (
        <button
          type="button"
          onClick={submit}
          disabled={selected.length === 0}
          className="mt-6 w-full rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-white disabled:opacity-40"
        >
          Check answer
        </button>
      ) : (
        <div className="mt-6 rounded-2xl bg-good-soft p-4 text-sm text-ink">
          <p className="font-bold">{questionCorrect(card, selected) ? 'Correct ✓' : 'Not quite ✗'}</p>
          <p className="mt-2"><RichText value={card.explanation} /></p>
        </div>
      )}
    </div>
  )
}

function TrueFalseQuizQuestion({
  card,
  value,
  onSubmit,
}: {
  card: Extract<QuizQuestionCard, { type: 'truefalse' }>
  value: string[]
  onSubmit: (chosen: string[]) => void
}) {
  const [selected, setSelected] = useState<string[]>(value)
  const [submitted, setSubmitted] = useState(false)

  function submit(next: string[]) {
    setSubmitted(true)
    onSubmit(next)
  }

  return (
    <div className="mx-auto w-full max-w-3xl rounded-3xl border border-slate-200 bg-surface p-6 shadow-lg">
      <p className="text-xl font-semibold text-ink"><RichText value={card.statement} /></p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {[true, false].map((value) => {
          const chosen = selected.includes(String(value))
          const isRight = value === card.answer
          let tone = chosen ? 'border-accent bg-accent-soft' : 'border-slate-200 bg-surface hover:border-accent'
          if (submitted) {
            if (isRight) tone = 'border-good bg-good-soft'
            else if (chosen) tone = 'border-bad bg-bad-soft'
            else tone = 'border-slate-200 bg-surface opacity-60'
          }

          return (
            <button
              key={String(value)}
              type="button"
              onClick={() => {
                if (submitted) return
                const next = [String(value)]
                setSelected(next)
                submit(next)
              }}
              className={`rounded-2xl border-2 px-4 py-4 text-base font-semibold transition ${tone}`}
            >
              {value ? 'True' : 'False'}
            </button>
          )
        })}
      </div>

      {submitted && (
        <div className="mt-6 rounded-2xl bg-good-soft p-4 text-sm text-ink">
          <p className="font-bold">{questionCorrect(card, selected) ? 'Correct ✓' : 'Not quite ✗'}</p>
          <p className="mt-2"><RichText value={card.explanation} /></p>
        </div>
      )}
    </div>
  )
}

export function QuizAttemptPage() {
  const { certId = '', moduleId = '' } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const mode = searchParams.get('mode') === 'exam' ? 'exam' : 'practice'
  const pool = useMemo(() => buildQuizPool(certId, moduleId), [certId, moduleId])
  const [seed] = useState(() => newSeed())
  const [questionIds] = useState(() =>
    planQuestionIds(pool, Math.min(pool.length, QUIZ_TARGET), seed),
  )
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string[]>>({})
  const attemptRef = useRef<string | null>(null)
  const { startQuizAttempt, recordQuizResponse, finishQuizAttempt } = useProgress()

  if (pool.length < QUIZ_MIN || questionIds.length === 0) return <NotFound />

  const currentId = questionIds[index]
  const currentQuestion = pool.find((question) => question.id === currentId)
  if (!currentQuestion) return <NotFound />

  const handleAnswer = (chosen: string[]) => {
    const response = {
      chosen,
      correct: questionCorrect(currentQuestion.card, chosen),
      at: new Date().toISOString(),
    }

    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: chosen }))

    if (!attemptRef.current) {
      attemptRef.current = startQuizAttempt(certId, moduleId, {
        mode,
        seed,
        questionIds,
      })
    }

    recordQuizResponse(
      certId,
      moduleId,
      attemptRef.current,
      currentQuestion.id,
      response,
      {
        reviewRefs: currentQuestion.reviewRefs,
        stem: questionStem(currentQuestion.card),
        correctIds:
          currentQuestion.card.type === 'mcq'
            ? currentQuestion.card.correct
            : [String(currentQuestion.card.answer)],
      },
    )

    const isLast = index >= questionIds.length - 1
    if (isLast) {
      const attemptId = attemptRef.current
      if (attemptId) {
        finishQuizAttempt(certId, moduleId, attemptId)
        navigate(`/cert/${certId}/module/${moduleId}/quiz/results/${attemptId}`)
      }
      return
    }

    setIndex((prev) => prev + 1)
  }

  return (
    <div className="min-h-screen bg-surface-sunken px-4 py-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate(`/cert/${certId}/module/${moduleId}`)}
            className="rounded-xl border border-slate-300 bg-surface px-3 py-2 text-sm font-medium text-ink-soft"
          >
            Exit quiz
          </button>
          <div className="text-sm font-medium text-ink-faint">
            {index + 1} / {questionIds.length}
          </div>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-brand transition-all duration-300"
            style={{ width: `${((index + 1) / questionIds.length) * 100}%` }}
          />
        </div>

        {currentQuestion.card.type === 'mcq' ? (
          <McqQuizQuestion
            card={currentQuestion.card}
            value={answers[currentQuestion.id] ?? []}
            onSubmit={handleAnswer}
          />
        ) : (
          <TrueFalseQuizQuestion
            card={currentQuestion.card}
            value={answers[currentQuestion.id] ?? []}
            onSubmit={handleAnswer}
          />
        )}
      </div>
    </div>
  )
}
