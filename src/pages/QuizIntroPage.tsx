import { Link, useNavigate, useParams } from 'react-router-dom'
import { getCertification, getModule } from '@/content/registry'
import { useProgress } from '@/context/ProgressContext'
import { quizAttemptSize, quizPoolSize, QUIZ_MIN, STRUGGLES_KEY } from '@/lib/quiz'
import { NotFound } from './NotFound'

/**
 * A certification with no exam is still worth testing yourself on — it just
 * should not call it "exam mode".
 */
function examModeLabel(hasExam: boolean) {
  return hasExam ? 'exam mode' : 'test mode'
}

function StrugglesIntro({ certId }: { certId: string }) {
  const navigate = useNavigate()
  const { getStruggleQuestions } = useProgress()
  const cert = getCertification(certId)
  if (!cert) return <NotFound />

  const struggles = getStruggleQuestions(certId)

  return (
    <div className="space-y-6">
      <nav className="text-sm">
        <Link to={`/cert/${certId}`} className="text-accent hover:underline">
          ← Back to certification
        </Link>
      </nav>
      <div className="rounded-2xl border border-slate-200 bg-surface p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
          Targeted review
        </p>
        <h1 className="mt-2 text-2xl font-extrabold text-ink">
          Learn what you struggle with
        </h1>
        <p className="mt-2 max-w-xl text-sm text-ink-soft">
          {struggles.length === 0
            ? 'Nothing to review yet. Take a module quiz and anything you miss collects here.'
            : `${struggles.length} question${struggles.length === 1 ? '' : 's'} you have missed. A review draws the ones you have got wrong most often. Answer one correctly and it leaves the list.`}
        </p>
        {struggles.length > 0 && (
          <button
            type="button"
            onClick={() => navigate(`/cert/${certId}/quiz/struggles/attempt?mode=review`)}
            className="mt-6 rounded-2xl bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-strong"
          >
            Start targeted review
          </button>
        )}
      </div>
    </div>
  )
}

export function QuizIntroPage() {
  const { certId = '', moduleId = '' } = useParams()
  const navigate = useNavigate()

  // The struggles route has no `:moduleId`, so it lands here too.
  if (!moduleId || moduleId === STRUGGLES_KEY) return <StrugglesIntro certId={certId} />

  const found = getModule(certId, moduleId)
  if (!found) return <NotFound />

  const poolSize = quizPoolSize(found.module)
  const count = quizAttemptSize(poolSize)
  const hasExam = found.cert.examFacts !== undefined

  if (poolSize < QUIZ_MIN) {
    return (
      <div className="space-y-6">
        <nav className="text-sm">
          <Link
            to={`/cert/${certId}/module/${moduleId}`}
            className="text-accent hover:underline"
          >
            ← Back to module
          </Link>
        </nav>

        <div className="rounded-2xl border border-slate-200 bg-surface p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
            No quiz yet
          </p>
          <h1 className="mt-2 text-2xl font-extrabold text-ink">{found.module.title}</h1>
          <p className="mt-3 max-w-xl text-sm text-ink-soft">
            This module's quiz is built from its lessons, and there are only{' '}
            {poolSize} question{poolSize === 1 ? '' : 's'} to draw on so far. It
            opens at {QUIZ_MIN}.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <nav className="text-sm">
        <Link
          to={`/cert/${certId}/module/${moduleId}`}
          className="text-accent hover:underline"
        >
          ← Back to module
        </Link>
      </nav>

      <div className="rounded-2xl border border-slate-200 bg-surface p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
          Module quiz
        </p>
        <h1 className="mt-2 text-2xl font-extrabold text-ink">{found.module.title}</h1>
        <p className="mt-2 max-w-xl text-sm text-ink-soft">
          {count} question{count === 1 ? '' : 's'}, drawn from this module's{' '}
          {found.module.lessons.filter((lesson) => lesson.status !== 'planned').length}{' '}
          written lessons and shuffled. Optional — nothing is locked behind it.
          {poolSize < QUIZ_MIN + 2 && ' Only a few questions so far.'}
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() =>
              navigate(`/cert/${certId}/module/${moduleId}/quiz/attempt?mode=practice`)
            }
            className="rounded-2xl bg-brand px-5 py-4 text-left text-sm font-semibold text-white transition hover:bg-brand-strong"
          >
            Start practice mode
            <span className="mt-1 block text-xs font-medium text-white/80">
              Feedback after every question
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              navigate(`/cert/${certId}/module/${moduleId}/quiz/attempt?mode=exam`)
            }
            className="rounded-2xl border border-slate-300 bg-surface px-5 py-4 text-left text-sm font-semibold text-ink transition hover:border-slate-400"
          >
            Start {examModeLabel(hasExam)}
            <span className="mt-1 block text-xs font-medium text-ink-faint">
              No feedback until the end; answers stay changeable
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
