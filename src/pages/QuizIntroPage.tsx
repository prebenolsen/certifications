import { Link, useNavigate, useParams } from 'react-router-dom'
import { getModule } from '@/content/registry'
import { buildQuizPool, QUIZ_MIN, QUIZ_TARGET } from '@/lib/quiz'
import { NotFound } from './NotFound'

export function QuizIntroPage() {
  const { certId = '', moduleId = '' } = useParams()
  const navigate = useNavigate()
  const found = getModule(certId, moduleId)

  if (!found) return <NotFound />

  const pool = buildQuizPool(certId, moduleId)
  const count = Math.min(pool.length, QUIZ_TARGET)

  if (pool.length < QUIZ_MIN) {
    return (
      <div className="space-y-6">
        <nav className="text-sm">
          <Link to={`/cert/${certId}/module/${moduleId}`} className="text-accent hover:underline">
            ← Back to module
          </Link>
        </nav>

        <div className="rounded-2xl border border-slate-200 bg-surface p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
            Module quiz unavailable
          </p>
          <h1 className="mt-2 text-2xl font-extrabold text-ink">
            Not enough quiz material yet
          </h1>
          <p className="mt-3 max-w-xl text-sm text-ink-soft">
            This module has {pool.length} interactive question(s), and the quiz requires at least{' '}
            {QUIZ_MIN} before it is worth starting.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <nav className="text-sm">
        <Link to={`/cert/${certId}/module/${moduleId}`} className="text-accent hover:underline">
          ← Back to module
        </Link>
      </nav>

      <div className="rounded-2xl border border-slate-200 bg-surface p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
          Module quiz
        </p>
        <h1 className="mt-2 text-2xl font-extrabold text-ink">{found.module.title}</h1>
        <p className="mt-2 max-w-xl text-sm text-ink-soft">
          This module has {pool.length} questions ready to use in a timed review. You can take the
          quiz in either practice mode or exam mode.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => navigate(`/cert/${certId}/module/${moduleId}/quiz/attempt?mode=practice`)}
            className="rounded-2xl bg-brand px-5 py-4 text-left text-sm font-semibold text-white transition hover:bg-brand-strong"
          >
            Start practice mode
            <span className="mt-1 block text-xs text-white/80">Feedback as you go</span>
          </button>

          <button
            type="button"
            onClick={() => navigate(`/cert/${certId}/module/${moduleId}/quiz/attempt?mode=exam`)}
            className="rounded-2xl border border-slate-300 bg-surface px-5 py-4 text-left text-sm font-semibold text-ink transition hover:border-slate-400"
          >
            Start exam mode
            <span className="mt-1 block text-xs text-ink-faint">No feedback until you submit</span>
          </button>
        </div>

        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-ink-soft">
          Approximate attempt size: {count} questions
        </div>
      </div>
    </div>
  )
}
