import type { ReactNode } from 'react'
import type { Card, CardType } from '@/types/content'

/** Human labels + accent colour per card type, used for the eyebrow badge. */
const TYPE_META: Record<CardType, { label: string; className: string }> = {
  concept: { label: 'Concept', className: 'bg-accent-soft text-accent' },
  analogy: { label: 'Analogy', className: 'bg-brand-soft text-brand-strong' },
  diagram: { label: 'Diagram', className: 'bg-slate-100 text-ink-soft' },
  example: { label: 'Example', className: 'bg-slate-900 text-white' },
  scenario: { label: 'Scenario', className: 'bg-warn-soft text-warn' },
  mistake: { label: 'Common mistake', className: 'bg-bad-soft text-bad' },
  flashcard: { label: 'Flashcard', className: 'bg-accent-soft text-accent' },
  truefalse: { label: 'True or false?', className: 'bg-warn-soft text-warn' },
  mcq: { label: 'Check yourself', className: 'bg-good-soft text-good' },
  summary: { label: 'Summary', className: 'bg-slate-100 text-ink-soft' },
  recap: { label: 'Recap', className: 'bg-good-soft text-good' },
}

/**
 * Shared visual shell for every card: a rounded surface with a type badge.
 * Individual renderers supply only their content, so they stay focused.
 */
export function CardFrame({
  card,
  children,
}: {
  card: Card
  children: ReactNode
}) {
  const meta = TYPE_META[card.type]
  const eyebrow = card.eyebrow ?? meta.label
  return (
    <article className="animate-fade-in-up w-full max-w-card rounded-3xl border border-slate-200 bg-surface p-6 shadow-sm sm:p-8">
      <span
        className={`mb-4 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${meta.className}`}
      >
        {eyebrow}
      </span>
      <div className="prose-card text-ink-soft">{children}</div>
    </article>
  )
}
