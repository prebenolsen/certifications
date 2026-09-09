import { useMemo, useRef, useState } from 'react'
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { CardView } from '@/components/cards/registry'
import type { FeedbackMode } from '@/components/cards/types'
import { useProgress } from '@/context/ProgressContext'
import {
  buildCertificationQuizPool,
  buildQuizPool,
  correctIdsOf,
  newSeed,
  planQuestionIds,
  questionCorrect,
  questionStem,
  QUIZ_MIN,
  QUIZ_TARGET,
  type QuizMode,
  STRUGGLES_KEY,
  type QuizQuestion,
} from '@/lib/quiz'

export function QuizAttemptPage() {
  const { certId = '', moduleId = '' } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const modeParam = searchParams.get('mode')
  const mode: QuizMode =
    modeParam === 'exam' ? 'exam' : modeParam === 'review' ? 'review' : 'practice'
  const reviewMode = mode === 'review'
  // The targeted review is not a module, but it keeps attempt history the same
  // way one does, under a key no real module can collide with.
  const storageModuleId = reviewMode ? STRUGGLES_KEY : moduleId
  const introPath = reviewMode
    ? `/cert/${certId}/quiz/struggles`
    : `/cert/${certId}/module/${moduleId}/quiz`

  const {
    getStruggleQuestions,
    startQuizAttempt,
    recordQuizResponse,
    finishQuizAttempt,
    discardQuizAttempt,
  } = useProgress()

  const struggles = getStruggleQuestions(certId)
  const pool = useMemo(
    () => (reviewMode ? buildCertificationQuizPool(certId) : buildQuizPool(certId, moduleId)),
    [certId, moduleId, reviewMode],
  )

  // Only plan the attempt once — a reshuffle on re-render would change the
  // questions under the learner mid-attempt.
  const [plan] = useState(() => {
    const seed = newSeed()

    if (!reviewMode) {
      return {
        seed,
        activePoolSize: pool.length,
        questionIds: planQuestionIds(pool, QUIZ_TARGET, seed),
      }
    }

    // A review draws the questions you have missed *most*, not a random slice of
    // everything you have missed — `struggles` arrives sorted by failure count,
    // so take from the front, then shuffle only what was taken so the order is
    // still unpredictable.
    const byId = new Map(pool.map((question) => [question.id, question]))
    const hardest = struggles
      .map((record) => byId.get(record.questionId))
      .filter((question): question is QuizQuestion => question !== undefined)

    return {
      seed,
      activePoolSize: hardest.length,
      questionIds: planQuestionIds(hardest.slice(0, QUIZ_TARGET), QUIZ_TARGET, seed),
    }
  })

  const [index, setIndex] = useState(0)
  /** Live selection buffer — what the controlled renderer displays. */
  const [selections, setSelections] = useState<Record<string, string[]>>({})
  /** Committed answers — what drives navigation and scoring. */
  const [answers, setAnswers] = useState<Record<string, string[]>>({})
  const attemptRef = useRef<string | null>(null)

  // A real module with too thin a pool is not a 404 — the intro page says so
  // properly. Same for a review with nothing left to review.
  if (plan.activePoolSize < (reviewMode ? 1 : QUIZ_MIN) || plan.questionIds.length === 0) {
    return <Navigate replace to={introPath} />
  }

  const { questionIds } = plan
  const currentId = questionIds[index]
  const currentQuestion = pool.find((question) => question.id === currentId)
  if (!currentQuestion) return <Navigate replace to={introPath} />

  const answered = currentId in answers
  const allAnswered = questionIds.every((id) => id in answers)
  const answeredCount = questionIds.filter((id) => id in answers).length

  /**
   * Records an answer. Practice reveals it immediately; exam accepts it
   * silently. Safe to call again for the same question — the stored response is
   * overwritten, so changing your mind before submitting is free.
   */
  function commit(question: QuizQuestion, chosen: string[]) {
    setSelections((prev) => ({ ...prev, [question.id]: chosen }))
    setAnswers((prev) => ({ ...prev, [question.id]: chosen }))
    commitResponse(question, chosen)
  }

  /**
   * Clearing your last selection in exam mode is not an answer. Without this,
   * deselecting banked an empty response that scored wrong while still counting
   * toward "all answered", and the question kept its answered chrome — so Skip
   * and "I don't know" disappeared and the learner could reach the results
   * screen with a question they meant to come back to.
   */
  function clearAnswer(question: QuizQuestion) {
    setSelections((prev) => ({ ...prev, [question.id]: [] }))
    setAnswers((prev) => {
      const next = { ...prev }
      delete next[question.id]
      return next
    })
    // The draft keeps an empty response, which is harmless: the question now
    // reads as unanswered, so finishing requires answering it again first.
    commitResponse(question, [])
  }

  /** Writes the response into the draft attempt, creating it on first use. */
  function commitResponse(question: QuizQuestion, chosen: string[]) {
    // Started on the first answer, not on mount, so opening a quiz and
    // bouncing straight back persists nothing.
    if (!attemptRef.current) {
      attemptRef.current = startQuizAttempt(certId, storageModuleId, {
        mode,
        seed: plan.seed,
        questionIds,
      })
    }

    recordQuizResponse(
      certId,
      storageModuleId,
      attemptRef.current,
      question.id,
      {
        chosen,
        correct: questionCorrect(question.card, chosen),
        at: new Date().toISOString(),
      },
      {
        reviewRefs: question.reviewRefs,
        stem: questionStem(question.card),
        correctIds: correctIdsOf(question.card),
      },
    )
  }

  /** The next unanswered question after this one, wrapping round. Or -1. */
  function nextUnanswered(): number {
    const ahead = questionIds.findIndex((id, i) => i > index && !(id in answers))
    if (ahead >= 0) return ahead
    return questionIds.findIndex((id) => !(id in answers))
  }

  function handleContinue() {
    const next = nextUnanswered()
    if (next >= 0 && next !== index) {
      setIndex(next)
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

  /**
   * An abandoned attempt is never scored and nothing resumes it, so leaving the
   * draft behind would just accumulate dead state in storage.
   */
  function handleExit() {
    if (attemptRef.current) discardQuizAttempt(certId, storageModuleId, attemptRef.current)
    navigate(introPath)
  }

  const skipTarget = nextUnanswered()
  const canSkip = skipTarget >= 0 && skipTarget !== index

  /**
   * Practice replays a checked question in full when you scroll back to it;
   * exam never reveals anything, and never locks, so an answer stays changeable
   * right up until the last question is submitted.
   */
  const cardFeedback: FeedbackMode =
    mode === 'exam' ? 'deferred' : answered ? 'revealed' : 'immediate'

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleExit}
          className="rounded-xl border border-slate-300 bg-surface px-3 py-2 text-sm font-medium text-ink-soft transition hover:border-slate-400"
        >
          Exit quiz
        </button>
        <div className="flex items-center gap-3">
          {index > 0 && (
            <button
              type="button"
              onClick={() => setIndex((prev) => prev - 1)}
              className="rounded-xl border border-slate-300 bg-surface px-3 py-2 text-sm font-medium text-ink-soft transition hover:border-slate-400"
            >
              ← Back
            </button>
          )}
          <span className="text-sm font-medium text-ink-faint">
            {answeredCount} of {questionIds.length} answered
          </span>
        </div>
      </div>

      <div
        className="h-2 w-full overflow-hidden rounded-full bg-slate-200"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={questionIds.length}
        aria-valuenow={answeredCount}
        aria-label={`${answeredCount} of ${questionIds.length} answered`}
      >
        <div
          className="h-full rounded-full bg-brand transition-all duration-300"
          style={{ width: `${(answeredCount / questionIds.length) * 100}%` }}
        />
      </div>

      <div className="flex justify-center">
        <CardView
          // Load-bearing: without it, one question's submitted state reconciles
          // onto the next and reveals its answer straight away.
          key={currentQuestion.id}
          card={{
            ...currentQuestion.card,
            eyebrow: `Question ${index + 1} of ${questionIds.length}`,
          }}
          feedback={cardFeedback}
          value={selections[currentQuestion.id] ?? []}
          onValueChange={(chosen) => {
            if (mode !== 'exam') {
              setSelections((prev) => ({ ...prev, [currentQuestion.id]: chosen }))
            } else if (chosen.length === 0) {
              clearAnswer(currentQuestion)
            } else {
              // Exam mode has no submit step: selection is the answer.
              commit(currentQuestion, chosen)
            }
          }}
          onAnswered={(_correct, chosen) => commit(currentQuestion, chosen ?? [])}
        />
      </div>

      <div className="mx-auto w-full max-w-card space-y-3">
        {mode === 'exam' && answered && (
          <p className="text-center text-xs font-medium text-ink-faint">
            Answer saved — feedback comes at the end.
          </p>
        )}

        {!answered ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setIndex(skipTarget)}
              disabled={!canSkip}
              className="rounded-2xl border border-slate-300 bg-surface px-4 py-3 text-sm font-semibold text-ink-soft transition enabled:hover:border-slate-400 disabled:opacity-40"
            >
              Skip for later
            </button>
            <button
              type="button"
              onClick={() => commit(currentQuestion, [])}
              className="rounded-2xl border border-bad/40 bg-bad-soft px-4 py-3 text-sm font-semibold text-bad transition hover:border-bad"
            >
              I don't know
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleContinue}
            className="w-full rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:bg-ink-soft"
          >
            {allAnswered ? 'See results' : 'Continue'}
          </button>
        )}
      </div>
    </div>
  )
}
