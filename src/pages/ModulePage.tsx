import { Link, useParams } from 'react-router-dom'
import { getModule } from '@/content/registry'
import { useLessonStats } from '@/hooks/useStats'
import { ProgressBar } from '@/components/layout/ProgressBar'
import { StatusBadge } from '@/components/layout/StatusBadge'
import { NotFound } from './NotFound'
import type { Lesson } from '@/types/content'

export function ModulePage() {
  const { certId = '', moduleId = '' } = useParams()
  const found = getModule(certId, moduleId)
  if (!found) return <NotFound />
  const { module } = found

  return (
    <div className="space-y-8">
      <nav className="text-sm">
        <Link to={`/cert/${certId}`} className="text-accent hover:underline">
          ← Back to modules
        </Link>
      </nav>

      <header className="flex items-start gap-4">
        <span className="text-4xl" aria-hidden>
          {module.icon}
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
            Module {module.order} · {module.examSections.join(' · ')}
          </p>
          <h1 className="mt-1 text-2xl font-extrabold text-ink">{module.title}</h1>
          <p className="mt-2 max-w-2xl text-base text-ink-soft">
            {module.summary}
          </p>
        </div>
      </header>

      <ol className="space-y-3">
        {module.lessons.map((lesson, i) => (
          <LessonRow
            key={lesson.id}
            index={i + 1}
            certId={certId}
            moduleId={moduleId}
            lesson={lesson}
          />
        ))}
      </ol>
    </div>
  )
}

function LessonRow({
  index,
  certId,
  moduleId,
  lesson,
}: {
  index: number
  certId: string
  moduleId: string
  lesson: Lesson
}) {
  const stats = useLessonStats(certId, lesson)
  const playable = lesson.status !== 'planned'

  const inner = (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-surface p-4 shadow-sm">
      <span
        className={`flex h-9 w-9 flex-none items-center justify-center rounded-full text-sm font-bold ${
          stats.completed
            ? 'bg-good text-white'
            : playable
              ? 'bg-brand-soft text-brand-strong'
              : 'bg-slate-100 text-ink-faint'
        }`}
      >
        {stats.completed ? '✓' : index}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-base font-semibold text-ink">{lesson.title}</h3>
          <StatusBadge status={lesson.status} />
        </div>
        <p className="mt-0.5 text-sm text-ink-soft">{lesson.summary}</p>
        {playable && (
          <div className="mt-2 flex items-center gap-3">
            <ProgressBar
              value={stats.progress}
              tone={stats.completed ? 'good' : 'brand'}
              className="max-w-xs"
            />
            <span className="flex-none text-[11px] text-ink-faint">
              ~{lesson.estimatedMinutes} min
            </span>
          </div>
        )}
      </div>
      {playable && (
        <span className="flex-none text-sm font-semibold text-brand">
          {stats.progress > 0 && !stats.completed ? 'Resume →' : 'Start →'}
        </span>
      )}
    </div>
  )

  if (!playable) return <li className="opacity-70">{inner}</li>

  return (
    <li>
      <Link
        to={`/cert/${certId}/module/${moduleId}/lesson/${lesson.id}`}
        className="block transition hover:-translate-y-0.5"
      >
        {inner}
      </Link>
    </li>
  )
}
