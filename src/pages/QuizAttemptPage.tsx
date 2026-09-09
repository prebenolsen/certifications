import { useMemo, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { RichText } from '@/components/ui/RichText'
import { useProgress } from '@/context/ProgressContext'
import {
  buildQuizPool,
  buildCertificationQuizPool,
  newSeed,
  planQuestionIds,
  QUIZ_MIN,
  QUIZ_TARGET,
  type QuizMode,
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
  onContinue,
  onSkip,
  onDontKnow,
  isLast,
  showFeedback,
}: {
  card: Extract<QuizQuestionCard, { type: 'mcq' }>
  value: string[]
  onSubmit: (chosen: string[]) => void
  onContinue: () => void
  onSkip: () => void
  onDontKnow: () => void
  isLast: boolean
  showFeedback: boolean
}) {
  const [selected, setSelected] = useState<string[]>(value)
  const [submitted, setSubmitted] = useState(false)
  const correctSet = new Set(card.correct)

  function submit() {
    if (selected.length === 0) return
    setSubmitted(true)
    onSubmit(selected)
  }

  function dontKnow() {
    setSelected([])
    setSubmitted(true)
    onDontKnow()
  }

  return (
    <div className="mx-auto w-full max-w-3xl rounded-3xl border border-slate-200 bg-surface p-6 shadow-lg">
      <p className="text-xl font-semibold text-ink"><RichText value={card.question} /></p>
      <div className="mt-5 space-y-3">
        {card.options.map((option) => {
          const chosen = selected.includes(option.id)
          const isRight = correctSet.has(option.id)
          let tone = chosen ? 'border-accent bg-accent-soft' : 'border-slate-200 bg-surface hover:border-slate-300'
          if (submitted && showFeedback) {
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
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <button
            type="button"
            onClick={submit}
            disabled={selected.length === 0}
            className="rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-white disabled:opacity-40 sm:col-span-2"
          >
            Check answer
          </button>
          <button
            type="button"
            onClick={onSkip}
            className="rounded-2xl border border-slate-300 bg-surface px-4 py-3 text-sm font-semibold text-ink-soft"
          >
            Skip for later
          </button>
          <button
            type="button"
            onClick={dontKnow}
            className="rounded-2xl border border-bad/40 bg-bad-soft px-4 py-3 text-sm font-semibold text-bad sm:col-span-3"
          >
            I don't know
          </button>
        </div>
      ) : (
        <div
          className={`mt-6 rounded-2xl p-4 text-sm text-ink ${
            showFeedback && questionCorrect(card, selected) ? 'bg-good-soft' : 'bg-surface'
          }`}
        >
          <p className="font-bold">{showFeedback ? (questionCorrect(card, selected) ? 'Correct ✓' : 'Not quite ✗') : 'Answer recorded'}</p>
          {showFeedback && <p className="mt-2"><RichText value={card.explanation} /></p>}
          <button
            type="button"
            onClick={onContinue}
            className="mt-4 w-full rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:bg-ink-soft"
          >
            {isLast ? 'See results' : 'Continue'}
          </button>
        </div>
      )}
    </div>
  )
}

function TrueFalseQuizQuestion({
  card,
  value,
  onSubmit,
  onContinue,
  onSkip,
  onDontKnow,
  isLast,
  showFeedback,
}: {
  card: Extract<QuizQuestionCard, { type: 'truefalse' }>
  value: string[]
  onSubmit: (chosen: string[]) => void
  onSkip: () => void
  onDontKnow: () => void
  onContinue: () => void
  isLast: boolean
  showFeedback: boolean
}) {
  const [selected, setSelected] = useState<string[]>(value)
  const [submitted, setSubmitted] = useState(false)

  function submit(next: string[]) {
    setSubmitted(true)
    onSubmit(next)
  }

  function dontKnow() {
    setSelected([])
    setSubmitted(true)
    onDontKnow()
  }

  return (
    <div className="mx-auto w-full max-w-3xl rounded-3xl border border-slate-200 bg-surface p-6 shadow-lg">
      <p className="text-xl font-semibold text-ink"><RichText value={card.statement} /></p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {[true, false].map((value) => {
          const chosen = selected.includes(String(value))
          const isRight = value === card.answer
          let tone = chosen ? 'border-accent bg-accent-soft' : 'border-slate-200 bg-surface hover:border-accent'
          if (submitted && showFeedback) {
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

      {!submitted && (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={onSkip}
            className="rounded-2xl border border-slate-300 bg-surface px-4 py-3 text-sm font-semibold text-ink-soft"
          >
            Skip for later
          </button>
          <button
            type="button"
            onClick={dontKnow}
            className="rounded-2xl border border-bad/40 bg-bad-soft px-4 py-3 text-sm font-semibold text-bad"
          >
            I don't know
          </button>
        </div>
      )}

      {submitted && (
        <div
          className={`mt-6 rounded-2xl p-4 text-sm text-ink ${
            showFeedback && questionCorrect(card, selected) ? 'bg-good-soft' : 'bg-surface'
          }`}
        >
          <p className="font-bold">{showFeedback ? (questionCorrect(card, selected) ? 'Correct ✓' : 'Not quite ✗') : 'Answer recorded'}</p>
          {showFeedback && <p className="mt-2"><RichText value={card.explanation} /></p>}
          <button
            type="button"
            onClick={onContinue}
            className="mt-4 w-full rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:bg-ink-soft"
          >
            {isLast ? 'See results' : 'Continue'}
          </button>
        </div>
      )}
    </div>
  )
}

export function QuizAttemptPage() {
  const { certId = '', moduleId = '' } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const mode: QuizMode = searchParams.get('mode') === 'exam'
    ? 'exam'
    : searchParams.get('mode') === 'review'
      ? 'review'
      : 'practice'
  const reviewMode = mode === 'review'
  const storageModuleId = reviewMode ? '__struggles__' : moduleId
  const { getStruggleQuestions, startQuizAttempt, recordQuizResponse, finishQuizAttempt } = useProgress()
  const pool = useMemo(
    () => reviewMode ? buildCertificationQuizPool(certId) : buildQuizPool(certId, moduleId),
    [certId, moduleId, reviewMode],
  )
  const struggles = getStruggleQuestions(certId)
  const struggleIds = new Set(struggles.map((record) => record.questionId))
  const reviewPool = reviewMode ? pool.filter((question) => struggleIds.has(question.id)) : pool
  const activePool = reviewMode ? reviewPool : pool
  const [seed] = useState(() => newSeed())
  const [questionIds] = useState(() =>
    planQuestionIds(activePool, Math.min(activePool.length, QUIZ_TARGET), seed),
  )
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string[]>>({})
  const attemptRef = useRef<string | null>(null)

  if (activePool.length < (reviewMode ? 1 : QUIZ_MIN) || questionIds.length === 0) return <NotFound />

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
      attemptRef.current = startQuizAttempt(certId, storageModuleId, {
        mode,
        seed,
        questionIds,
      })
    }

    recordQuizResponse(
      certId,
      storageModuleId,
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
  }

  const handleContinue = () => {
    const nextIndex = questionIds.findIndex(
      (questionId, questionIndex) =>
        questionIndex > index && !(questionId in answers),
    )
    const wrappedIndex =
      nextIndex >= 0
        ? nextIndex
        : questionIds.findIndex((questionId) => !(questionId in answers))

    if (wrappedIndex >= 0) {
      setIndex(wrappedIndex)
      return
    }

    const attemptId = attemptRef.current
    if (!attemptId) return
    finishQuizAttempt(certId, storageModuleId, attemptId)
    navigate(
      reviewMode
        ? `/cert/${certId}/quiz/struggles/results/${attemptId}`
        : `/cert/${certId}/module/${moduleId}/quiz/results/${attemptId}`,
    )
  }

  const handleSkip = () => {
    const nextIndex = questionIds.findIndex(
      (questionId, questionIndex) =>
        questionIndex > index && !(questionId in answers),
    )
    const wrappedIndex =
      nextIndex >= 0
        ? nextIndex
        : questionIds.findIndex((questionId) => !(questionId in answers))
    if (wrappedIndex >= 0 && wrappedIndex !== index) setIndex(wrappedIndex)
  }

  const handleDontKnow = () => handleAnswer([])

  return (
    <div className="min-h-screen bg-surface-sunken px-4 py-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate(reviewMode ? `/cert/${certId}/quiz/struggles` : `/cert/${certId}/module/${moduleId}`)}
            className="rounded-xl border border-slate-300 bg-surface px-3 py-2 text-sm font-medium text-ink-soft"
          >
            Exit quiz
          </button>
          <div className="flex items-center gap-3 text-sm font-medium text-ink-faint">
            {index > 0 && (
              <button
                type="button"
                onClick={() => setIndex((prev) => prev - 1)}
                className="rounded-xl border border-slate-300 bg-surface px-3 py-2 text-ink-soft"
              >
                ← Back
              </button>
            )}
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
            key={currentQuestion.id}
            card={currentQuestion.card}
            value={answers[currentQuestion.id] ?? []}
            onSubmit={handleAnswer}
            onContinue={handleContinue}
            onSkip={handleSkip}
            onDontKnow={handleDontKnow}
            isLast={questionIds.every((questionId) => questionId in answers)}
            showFeedback={mode !== 'exam'}
          />
        ) : (
          <TrueFalseQuizQuestion
            key={currentQuestion.id}
            card={currentQuestion.card}
            value={answers[currentQuestion.id] ?? []}
            onSubmit={handleAnswer}
            onContinue={handleContinue}
            onSkip={handleSkip}
            onDontKnow={handleDontKnow}
            isLast={questionIds.every((questionId) => questionId in answers)}
            showFeedback={mode !== 'exam'}
          />
        )}
      </div>
    </div>
  )
}
