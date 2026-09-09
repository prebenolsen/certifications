import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { CardView } from '@/components/cards/registry'
import { getLesson } from '@/content/registry'
import { useProgress } from '@/context/ProgressContext'
import {
  buildCertificationQuizPool,
  buildQuizPool,
  STRUGGLES_KEY,
  VERDICT_MIN,
} from '@/lib/quiz'
import { NotFound } from './NotFound'

/** Where a missed question is taught. Degrades rather than linking nowhere. */
function TeachingLink({
  certId,
  reviewRef,
}: {
  certId: string
  reviewRef: { lessonId: string; cardId: string; moduleId?: string }
}) {
  const found = reviewRef.moduleId
    ? getLesson(certId, reviewRef.moduleId, reviewRef.lessonId)
    : undefined
  if (!found || !reviewRef.moduleId) {
    return (
      <p className="text-xs text-ink-faint">
        The lesson this came from has changed.
      </p>
    )
  }

  return (
    <Link
      to={`/cert/${certId}/module/${reviewRef.moduleId}/lesson/${reviewRef.lessonId}`}
      className="text-sm font-semibold text-accent hover:underline"
    >
      Read this in “{found.lesson.title}” →
    </Link>
  )
}

export function QuizResultsPage() {
  const { certId = '', moduleId = '', attemptId = '' } = useParams()
  const navigate = useNavigate()
  const { getModuleQuiz } = useProgress()
  const [showAll, setShowAll] = useState(false)

  const reviewMode = !moduleId
  const storageModuleId = reviewMode ? STRUGGLES_KEY : moduleId
  const introPath = reviewMode
    ? `/cert/${certId}/quiz/struggles`
    : `/cert/${certId}/module/${moduleId}/quiz`
  const backPath = reviewMode ? `/cert/${certId}` : `/cert/${certId}/module/${moduleId}`
  const backLabel = reviewMode ? 'Back to certification' : 'Back to module'

  const quiz = getModuleQuiz(certId, storageModuleId)
  const attempt = quiz?.attempts.find((item) => item.id === attemptId)

  if (!attempt) return <NotFound />

  const pool = reviewMode
    ? buildCertificationQuizPool(certId)
    : buildQuizPool(certId, moduleId)

  const total = attempt.questionIds.length
  const correct = attempt.questionIds.filter(
    (id) => attempt.responses[id]?.correct,
  ).length
  const percent = total > 0 ? Math.round((correct / total) * 100) : 0
  const verdictMeaningful = total >= VERDICT_MIN

  const missedIds = attempt.questionIds.filter((id) => !attempt.responses[id]?.correct)
  const shownIds = showAll ? attempt.questionIds : missedIds

  return (
    <div className="space-y-6">
      <nav className="text-sm">
        <Link to={backPath} className="text-accent hover:underline">
          ← {backLabel}
        </Link>
      </nav>

      <div className="rounded-2xl border border-slate-200 bg-surface p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
          {reviewMode ? 'Targeted review' : 'Quiz results'}
        </p>
        <div role="status" aria-live="polite">
          <h1 className="mt-2 text-2xl font-extrabold text-ink">
            {correct} / {total} correct
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            {verdictMeaningful ? (
              <>
                {percent}% ·{' '}
                {percent >= 80
                  ? 'That is exam-ready for this material.'
                  : 'Worth another pass before you rely on this.'}
              </>
            ) : (
              <>
                {percent}% · Too few questions to gauge readiness — treat this as
                practice.
              </>
            )}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => navigate(introPath)}
            className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-strong"
          >
            {reviewMode ? 'Review again' : 'Retake quiz'}
          </button>
          <button
            type="button"
            onClick={() => navigate(backPath)}
            className="rounded-xl border border-slate-300 bg-surface px-4 py-2 text-sm font-semibold text-ink transition hover:border-slate-400"
          >
            {backLabel}
          </button>
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="text-lg font-bold text-ink">
            {missedIds.length === 0
              ? '🎯 Nothing missed'
              : `${missedIds.length} to review`}
          </h2>
          {missedIds.length !== total && (
            <button
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              className="text-sm font-semibold text-accent hover:underline"
            >
              {showAll ? 'Show only what you missed' : `Show all ${total} questions`}
            </button>
          )}
        </div>

        {shownIds.length === 0 ? (
          <p className="rounded-2xl border border-slate-200 bg-surface p-6 text-sm text-ink-soft shadow-sm">
            Every question in this attempt was correct.
          </p>
        ) : (
          shownIds.map((questionId) => {
            const question = pool.find((item) => item.id === questionId)
            const response = attempt.responses[questionId]
            const position = attempt.questionIds.indexOf(questionId) + 1

            // The question no longer exists in the content. Fall back to the
            // snapshot taken when it was asked, rather than dropping the row.
            if (!question) {
              const snapshot = attempt.provenance?.[questionId]
              return (
                <div
                  key={questionId}
                  className="rounded-2xl border border-slate-200 bg-surface p-4 text-sm text-ink-soft shadow-sm"
                >
                  <p className="font-semibold text-ink">
                    {snapshot?.stem ?? 'This question is no longer in the content.'}
                  </p>
                  <p className="mt-1 text-xs text-ink-faint">
                    From older content — no lesson to link to.
                  </p>
                </div>
              )
            }

            return (
              <div key={questionId} className="flex flex-col items-center gap-2">
                <CardView
                  card={{
                    ...question.card,
                    eyebrow: `Question ${position} of ${total}`,
                  }}
                  feedback="revealed"
                  value={response?.chosen ?? []}
                />
                {question.reviewRefs[0] && (
                  <TeachingLink certId={certId} reviewRef={question.reviewRefs[0]} />
                )}
              </div>
            )
          })
        )}
      </section>
    </div>
  )
}
