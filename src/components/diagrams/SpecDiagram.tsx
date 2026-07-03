import type { DiagramNode, DiagramSpec, DiagramTone } from '@/types/content'
import { RichText } from '@/components/ui/RichText'

/**
 * Renders the generic, data-driven diagram shapes (`DiagramSpec`) that content
 * can declare inline — no bespoke SVG component or registry edit required.
 * Built with HTML + Tailwind so diagrams reflow on small screens for free.
 */

const TONE: Record<DiagramTone, { box: string; label: string }> = {
  brand: { box: 'border-brand/40 bg-brand-soft', label: 'text-brand-strong' },
  accent: { box: 'border-accent/40 bg-accent-soft', label: 'text-accent' },
  good: { box: 'border-good/40 bg-good-soft', label: 'text-good' },
  warn: { box: 'border-warn/40 bg-warn-soft', label: 'text-warn' },
  bad: { box: 'border-bad/40 bg-bad-soft', label: 'text-bad' },
  neutral: { box: 'border-slate-300 bg-surface', label: 'text-ink' },
}

function toneOf(node: DiagramNode) {
  return TONE[node.tone ?? 'neutral']
}

function NodeBox({ node, className = '' }: { node: DiagramNode; className?: string }) {
  const t = toneOf(node)
  return (
    <div className={`rounded-xl border-2 px-4 py-3 text-center ${t.box} ${className}`}>
      <p className={`text-sm font-bold ${t.label}`}>
        <RichText value={node.label} />
      </p>
      {node.sublabel && (
        <p className="mt-0.5 text-xs text-ink-soft">
          <RichText value={node.sublabel} />
        </p>
      )}
    </div>
  )
}

function FlowDiagram({ spec }: { spec: Extract<DiagramSpec, { kind: 'flow' }> }) {
  return (
    <div className="flex flex-col items-stretch gap-1 sm:flex-row sm:items-center sm:justify-center sm:gap-2">
      {spec.steps.map((step, i) => (
        <div key={i} className="contents">
          {i > 0 && (
            <div className="flex flex-col items-center px-1 py-0.5 sm:flex-row" aria-hidden>
              <span className="text-lg text-ink-faint sm:hidden">↓</span>
              <span className="hidden text-lg text-ink-faint sm:block">→</span>
              {spec.arrows?.[i - 1] && (
                <span className="text-[11px] font-medium text-ink-faint sm:ml-1">
                  {spec.arrows[i - 1]}
                </span>
              )}
            </div>
          )}
          <NodeBox node={step} className="sm:flex-1" />
        </div>
      ))}
    </div>
  )
}

function ComparePanel({ panel }: { panel: DiagramNode & { items: string[] } }) {
  const t = toneOf(panel)
  return (
    <div className={`flex-1 rounded-2xl border-2 p-4 ${t.box}`}>
      <p className={`text-sm font-bold ${t.label}`}>
        <RichText value={panel.label} />
      </p>
      {panel.sublabel && (
        <p className="mt-0.5 text-xs text-ink-soft">
          <RichText value={panel.sublabel} />
        </p>
      )}
      <ul className="mt-3 space-y-1.5">
        {panel.items.map((item, i) => (
          <li key={i} className="flex gap-2 text-sm text-ink">
            <span aria-hidden className="text-ink-faint">
              •
            </span>
            <RichText value={item} />
          </li>
        ))}
      </ul>
    </div>
  )
}

function CompareDiagram({ spec }: { spec: Extract<DiagramSpec, { kind: 'compare' }> }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <ComparePanel panel={spec.left} />
      <ComparePanel panel={spec.right} />
    </div>
  )
}

function LayersDiagram({ spec }: { spec: Extract<DiagramSpec, { kind: 'layers' }> }) {
  // Outermost layer first; each subsequent layer nests inside the previous.
  const [outer, ...rest] = spec.layers
  if (!outer) return null
  const t = toneOf(outer)
  return (
    <div className={`rounded-2xl border-2 p-4 ${t.box}`}>
      <p className={`text-sm font-bold ${t.label}`}>
        <RichText value={outer.label} />
      </p>
      {outer.sublabel && (
        <p className="mt-0.5 text-xs text-ink-soft">
          <RichText value={outer.sublabel} />
        </p>
      )}
      {rest.length > 0 && (
        <div className="mt-3">
          <LayersDiagram spec={{ kind: 'layers', layers: rest }} />
        </div>
      )}
    </div>
  )
}

export function SpecDiagram({ spec }: { spec: DiagramSpec }) {
  switch (spec.kind) {
    case 'flow':
      return <FlowDiagram spec={spec} />
    case 'compare':
      return <CompareDiagram spec={spec} />
    case 'layers':
      return <LayersDiagram spec={spec} />
  }
}
