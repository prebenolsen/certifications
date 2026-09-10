import { Link } from 'react-router-dom'
import {
  availableCertifications,
  certContentCounts,
  certificationStatus,
  upcomingCertifications,
} from '@/content/registry'
import { useCertStats } from '@/hooks/useStats'
import { ProgressBar } from '@/components/layout/ProgressBar'
import { StatusBadge } from '@/components/layout/StatusBadge'
import type { Certification } from '@/types/content'

export function HomePage() {
  return (
    <div className="space-y-10">
      <section className="animate-fade-in-up">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-brand">
          Learn by understanding
        </p>
        <h1 className="max-w-2xl text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
          Certifications you actually understand — not just memorize.
        </h1>
        <p className="mt-4 max-w-2xl text-base text-ink-soft">
          Bite-sized cards, one idea at a time. Intuition first, then the
          terminology, then the details. Every concept ties back to a real exam
          objective and a real day-at-work situation.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-ink">Available certifications</h2>
        {availableCertifications.map((cert) => (
          <CertificationCard key={cert.id} cert={cert} />
        ))}
      </section>

      {upcomingCertifications.length > 0 && (
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-ink">Coming soon</h2>
            <p className="mt-1 max-w-2xl text-sm text-ink-soft">
              Still being written. What is finished is already playable — the
              rest arrives a module at a time.
            </p>
          </div>
          {upcomingCertifications.map((cert) => (
            <CertificationCard key={cert.id} cert={cert} upcoming />
          ))}
        </section>
      )}
    </div>
  )
}

function CertificationCard({
  cert,
  upcoming = false,
}: {
  cert: Certification
  upcoming?: boolean
}) {
  const stats = useCertStats(cert)
  const content = certContentCounts(cert)
  const lessons = cert.modules.flatMap((m) => m.lessons)
  return (
    <Link
      to={`/cert/${cert.id}`}
      className={`block rounded-3xl border p-6 shadow-sm transition hover:border-brand hover:shadow-md ${
        upcoming
          ? 'border-dashed border-slate-300 bg-surface-sunken'
          : 'border-slate-200 bg-surface'
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
              {cert.provider}
            </p>
            {upcoming && <StatusBadge status={certificationStatus(cert)} />}
          </div>
          <h3 className="mt-1 text-xl font-bold text-ink">{cert.title}</h3>
          <p className="mt-2 max-w-xl text-sm text-ink-soft">{cert.summary}</p>
        </div>
        <div className="flex flex-none gap-4 text-center">
          {cert.examFacts ? (
            <>
              <Fact label="Questions" value={cert.examFacts.questions} />
              <Fact label="Minutes" value={cert.examFacts.minutes} />
            </>
          ) : (
            <>
              <Fact label="Lessons" value={lessons.length} />
              <Fact
                label="Minutes"
                value={lessons.reduce((n, l) => n + l.estimatedMinutes, 0)}
              />
            </>
          )}
          <Fact label="Modules" value={cert.modules.length} />
        </div>
      </div>
      {/*
        A half-written track reports *our* progress, not the learner's — "2 of 30
        complete" on a cert that only has 3 lessons written would read as their
        failure rather than our backlog.
      */}
      <div className="mt-5">
        <div className="mb-1.5 flex items-center justify-between text-xs text-ink-faint">
          <span>{upcoming ? 'Lessons written' : 'Your progress'}</span>
          <span>
            {upcoming
              ? `${content.authored}/${content.total} lessons`
              : `${stats.completedLessons}/${stats.totalPlayable} lessons`}
          </span>
        </div>
        <ProgressBar
          value={upcoming ? content.authored / content.total : stats.progress}
          tone={upcoming ? 'brand' : 'good'}
        />
        {upcoming && stats.completedLessons > 0 && (
          <p className="mt-1.5 text-xs text-ink-faint">
            You have completed {stats.completedLessons} of the{' '}
            {stats.totalPlayable} available so far.
          </p>
        )}
      </div>
    </Link>
  )
}

function Fact({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="text-2xl font-extrabold text-ink">{value}</div>
      <div className="text-[11px] uppercase tracking-wide text-ink-faint">
        {label}
      </div>
    </div>
  )
}
