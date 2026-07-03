import { Link, useParams } from 'react-router-dom'
import { getCertification, moduleStatus } from '@/content/registry'
import { useCertStats, useModuleStats } from '@/hooks/useStats'
import { ProgressBar } from '@/components/layout/ProgressBar'
import { StatusBadge } from '@/components/layout/StatusBadge'
import { NotFound } from './NotFound'
import type { Certification, Module } from '@/types/content'

export function CertificationPage() {
  const { certId = '' } = useParams()
  const cert = getCertification(certId)
  if (!cert) return <NotFound />
  return <CertificationView cert={cert} />
}

function CertificationView({ cert }: { cert: Certification }) {
  const stats = useCertStats(cert)
  return (
    <div className="space-y-8">
      <nav className="text-sm">
        <Link to="/" className="text-accent hover:underline">
          ← All certifications
        </Link>
      </nav>

      <header>
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
          {cert.provider}
        </p>
        <h1 className="mt-1 text-2xl font-extrabold text-ink sm:text-3xl">
          {cert.title}
        </h1>
        <p className="mt-3 max-w-2xl text-base text-ink-soft">{cert.summary}</p>
        <a
          href={cert.officialUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-block text-sm font-medium text-accent hover:underline"
        >
          Official exam guide ↗
        </a>
        <div className="mt-5 max-w-md">
          <div className="mb-1.5 flex justify-between text-xs text-ink-faint">
            <span>Overall progress</span>
            <span>
              {stats.completedLessons}/{stats.totalPlayable} lessons complete
            </span>
          </div>
          <ProgressBar value={stats.progress} tone="good" />
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        {cert.modules.map((module) => (
          <ModuleCard key={module.id} certId={cert.id} module={module} />
        ))}
      </section>
    </div>
  )
}

function ModuleCard({ certId, module }: { certId: string; module: Module }) {
  const stats = useModuleStats(certId, module)
  const hasContent = stats.totalPlayable > 0

  return (
    <Link
      to={`/cert/${certId}/module/${module.id}`}
      className="flex flex-col rounded-2xl border border-slate-200 bg-surface p-5 shadow-sm transition hover:border-brand hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-3xl" aria-hidden>
          {module.icon}
        </span>
        <StatusBadge status={moduleStatus(module)} />
      </div>
      <h3 className="mt-3 text-base font-bold text-ink">
        <span className="text-ink-faint">Module {module.order}.</span>{' '}
        {module.title}
      </h3>
      <p className="mt-1.5 flex-1 text-sm text-ink-soft">{module.summary}</p>
      <div className="mt-4">
        <div className="mb-1 flex justify-between text-[11px] text-ink-faint">
          <span>{module.examSections.join(' · ')}</span>
          {hasContent && (
            <span>
              {stats.completedLessons}/{stats.totalPlayable}
            </span>
          )}
        </div>
        {hasContent ? (
          <ProgressBar value={stats.progress} />
        ) : (
          <p className="text-[11px] italic text-ink-faint">Content coming soon</p>
        )}
      </div>
    </Link>
  )
}
