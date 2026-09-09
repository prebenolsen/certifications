import { Link, useNavigate, useParams } from 'react-router-dom'
import { useProgress } from '@/context/ProgressContext'
import { buildCertificationQuizPool, buildQuizPool } from '@/lib/quiz'
import { NotFound } from './NotFound'

export function QuizResultsPage() {
  const { certId = '', moduleId = '', attemptId = '' } = useParams()
  const navigate = useNavigate()
  const { getModuleQuiz, getStruggleQuestions } = useProgress()
  const reviewMode = !moduleId
  const storageModuleId = reviewMode ? '__struggles__' : moduleId

  const quiz = getModuleQuiz(certId, storageModuleId)
  const attempt = quiz?.attempts.find((item) => item.id === attemptId) ?? quiz?.draft

  if (!attempt) return <NotFound />

  const pool = reviewMode
    ? buildCertificationQuizPool(certId)
    : buildQuizPool(certId, moduleId)
  const total = attempt.questionIds.length
  const correct = Object.values(attempt.responses).filter((response) => response.correct).length

  return (
    <div className="space-y-6">
      <nav className="text-sm">
        <Link to={`/cert/${certId}/module/${moduleId}`} className="text-accent hover:underline">
          ← Back to module
        </Link>
      </nav>

      <div className="rounded-2xl border border-slate-200 bg-surface p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
          Quiz results
        </p>
        <h1 className="mt-2 text-2xl font-extrabold text-ink">{correct} / {total} correct</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Mode: {attempt.mode} · Score: {attempt.score ? (attempt.score * 100).toFixed(0) : '0'}%
        </p>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={() => navigate(reviewMode ? `/cert/${certId}/quiz/struggles` : `/cert/${certId}/module/${moduleId}/quiz`)}
            className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white"
          >
            Retake quiz
          </button>
          <button
            type="button"
            onClick={() => navigate(reviewMode ? `/cert/${certId}/quiz/struggles` : `/cert/${certId}/module/${moduleId}`)}
            className="rounded-xl border border-slate-300 bg-surface px-4 py-2 text-sm font-semibold text-ink"
          >
            Back to module
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-surface p-6 shadow-sm">
        <h2 className="text-lg font-bold text-ink">
          {reviewMode ? 'Still to review' : 'Missed questions'}
        </h2>
        <div className="mt-4 space-y-3">
          {(reviewMode ? getStruggleQuestions(certId) : Object.values(quiz?.missed ?? {})).length === 0 ? (
            <p className="text-sm text-ink-soft">
              {reviewMode ? 'You cleared all of these questions.' : 'No missed questions recorded for this module yet.'}
            </p>
          ) : (
            (reviewMode ? getStruggleQuestions(certId) : Object.values(quiz?.missed ?? {})).map((miss) => {
              const question = pool.find((item) => item.id === miss.questionId)
              return (
                <div key={miss.questionId} className="rounded-xl border border-slate-200 p-3">
                  <p className="text-sm font-semibold text-ink">
                    {question?.card.type === 'mcq' ? question.card.question : question?.card.statement ?? miss.stem}
                  </p>
                  <p className="mt-1 text-xs text-ink-faint">
                    Miss count: {'missCount' in miss ? miss.missCount : miss.failedCount} · Last missed: {new Date('lastMissedAt' in miss ? miss.lastMissedAt : miss.lastFailedAt ?? miss.lastAnsweredAt).toLocaleDateString()}
                  </p>
                  <div className="mt-2 space-y-1 text-xs text-ink-soft">
                    <p>Correct answer: {miss.correctIds.join(', ')}</p>
                    <p>Your choice: {miss.chosen.join(', ') || 'none'}</p>
                    {miss.reviewRefs[0]?.moduleId && (
                      <Link
                        to={`/cert/${certId}/module/${miss.reviewRefs[0].moduleId}/lesson/${miss.reviewRefs[0].lessonId}`}
                        className="inline-block pt-1 font-semibold text-accent hover:underline"
                      >
                        Review the teaching card →
                      </Link>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
