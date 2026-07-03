import { Link } from 'react-router-dom'
import { certifications } from '@/content/registry'
import { useCertStats } from '@/hooks/useStats'
import { ProgressBar } from '@/components/layout/ProgressBar'
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
        {certifications.map((cert) => (
          <CertificationCard key={cert.id} cert={cert} />
        ))}
      </section>
    </div>
  )
}

function CertificationCard({ cert }: { cert: Certification }) {
  const stats = useCertStats(cert)
  const moduleCount = cert.modules.length
  return (
    <Link
      to={`/cert/${cert.id}`}
      className="block rounded-3xl border border-slate-200 bg-surface p-6 shadow-sm transition hover:border-brand hover:shadow-md"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
            {cert.provider}
          </p>
          <h3 className="mt-1 text-xl font-bold text-ink">{cert.title}</h3>
          <p className="mt-2 max-w-xl text-sm text-ink-soft">{cert.summary}</p>
        </div>
        <div className="flex flex-none gap-4 text-center">
          <Fact label="Questions" value={cert.examFacts.questions} />
          <Fact label="Minutes" value={cert.examFacts.minutes} />
          <Fact label="Modules" value={moduleCount} />
        </div>
      </div>
      <div className="mt-5">
        <div className="mb-1.5 flex items-center justify-between text-xs text-ink-faint">
          <span>Your progress</span>
          <span>
            {stats.completedLessons}/{stats.totalPlayable} lessons
          </span>
        </div>
        <ProgressBar value={stats.progress} tone="good" />
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
