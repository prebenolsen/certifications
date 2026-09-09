import { Link } from 'react-router-dom'
import { useProgress } from '@/context/ProgressContext'
import { quizAttemptSize, quizPoolSize, QUIZ_MIN } from '@/lib/quiz'
import type { Module } from '@/types/content'

/**
 * The module page's entry point into its quiz. Owns all of its own availability
 * logic, so `ModulePage` gains exactly one line — and a module with nothing to
 * ask renders nothing at all, rather than advertising a quiz that then tells the
 * learner it does not exist.
 */
export function ModuleQuizCard({ certId, module }: { certId: string; module: Module }) {
  const { getModuleQuiz, getStruggleQuestions } = useProgress()

  const poolSize = quizPoolSize(module)
  if (poolSize < QUIZ_MIN) return null

  const quiz = getModuleQuiz(certId, module.id)
  const missed = getStruggleQuestions(certId, module.id).length
  const count = quizAttemptSize(poolSize)
  const best = quiz?.bestScore ?? null
  const attempted = best !== null
  const weak = attempted && best < 0.8

  const tone = !attempted
    ? 'border-slate-200 bg-surface'
    : weak
      ? 'border-warn/40 bg-warn-soft'
      : 'border-good/40 bg-good-soft'

  return (
    <div className={`rounded-2xl border p-4 shadow-sm ${tone}`}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
            Module quiz
          </p>
          <h2 className="mt-1 text-lg font-bold text-ink">
            {attempted ? `Best ${Math.round(best * 100)}%` : 'Check what you retained'}
          </h2>
          <p className="mt-1 text-sm text-ink-soft">
            {count} question{count === 1 ? '' : 's'} · optional, and it never
            affects your progress.
          </p>
        </div>

        {/* After a weak attempt the next step is to go and learn, not to reroll. */}
        <div className="flex flex-wrap items-center gap-2">
          {weak && missed > 0 && (
            <Link
              to={`/cert/${certId}/quiz/struggles`}
              className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-strong"
            >
              Review {missed} missed →
            </Link>
          )}
          <Link
            to={`/cert/${certId}/module/${module.id}/quiz`}
            className={
              weak && missed > 0
                ? 'rounded-xl border border-slate-300 bg-surface px-4 py-2 text-sm font-semibold text-ink transition hover:border-slate-400'
                : 'rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-strong'
            }
          >
            {attempted ? 'Retake →' : 'Open quiz →'}
          </Link>
          {!weak && missed > 0 && (
            <Link
              to={`/cert/${certId}/quiz/struggles`}
              className="rounded-xl border border-slate-300 bg-surface px-4 py-2 text-sm font-semibold text-ink transition hover:border-slate-400"
            >
              Review {missed} missed
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
