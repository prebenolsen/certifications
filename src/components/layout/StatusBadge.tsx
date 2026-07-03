import type { ContentStatus } from '@/types/content'

const META: Record<ContentStatus, { label: string; className: string }> = {
  complete: { label: 'Ready', className: 'bg-good-soft text-good' },
  'in-progress': { label: 'In progress', className: 'bg-warn-soft text-warn' },
  planned: { label: 'Coming soon', className: 'bg-slate-100 text-ink-faint' },
}

export function StatusBadge({ status }: { status: ContentStatus }) {
  const m = META[status]
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${m.className}`}
    >
      {m.label}
    </span>
  )
}
