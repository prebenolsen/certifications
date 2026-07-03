import type {
  AnalogyCard,
  ConceptCard,
  DiagramCard,
  ExampleCard,
  MistakeCard,
  RecapCard,
  ScenarioCard,
  SummaryCard,
} from '@/types/content'
import { RichText } from '@/components/ui/RichText'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { CardFrame } from './CardFrame'
import { getDiagram } from '@/components/diagrams/registry'
import { SpecDiagram } from '@/components/diagrams/SpecDiagram'
import type { CardRendererProps } from './types'

export function ConceptRenderer({ card }: CardRendererProps<ConceptCard>) {
  return (
    <CardFrame card={card}>
      <h2 className="mb-3 text-2xl font-bold text-ink">{card.title}</h2>
      <p className="text-base">
        <RichText value={card.body} />
      </p>
      {card.takeaways && card.takeaways.length > 0 && (
        <ul className="mt-5 space-y-2 rounded-2xl bg-accent-soft/60 p-4">
          {card.takeaways.map((t, i) => (
            <li key={i} className="flex gap-2 text-sm text-ink">
              <span aria-hidden className="text-accent">
                ●
              </span>
              <RichText value={t} />
            </li>
          ))}
        </ul>
      )}
    </CardFrame>
  )
}

export function AnalogyRenderer({ card }: CardRendererProps<AnalogyCard>) {
  return (
    <CardFrame card={card}>
      <h2 className="mb-3 text-2xl font-bold text-ink">{card.title}</h2>
      <p className="text-base">
        <RichText value={card.body} />
      </p>
      {card.mapping && card.mapping.length > 0 && (
        <div className="mt-5 space-y-2">
          {card.mapping.map((m, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-surface-sunken px-4 py-2 text-sm"
            >
              <span className="font-medium text-brand-strong">{m.from}</span>
              <span aria-hidden className="text-ink-faint">
                →
              </span>
              <span className="text-ink">{m.to}</span>
            </div>
          ))}
        </div>
      )}
    </CardFrame>
  )
}

export function DiagramRenderer({ card }: CardRendererProps<DiagramCard>) {
  const Diagram = card.diagramId ? getDiagram(card.diagramId) : undefined
  return (
    <CardFrame card={card}>
      <h2 className="mb-4 text-2xl font-bold text-ink">{card.title}</h2>
      <div className="rounded-2xl border border-slate-200 bg-surface-sunken p-4">
        {card.spec ? (
          <SpecDiagram spec={card.spec} />
        ) : Diagram ? (
          <Diagram />
        ) : (
          <p className="text-sm text-bad">
            Missing diagram: {card.diagramId ?? '(no spec or diagramId)'}
          </p>
        )}
      </div>
      {card.caption && (
        <p className="mt-3 text-sm text-ink-faint">
          <RichText value={card.caption} />
        </p>
      )}
    </CardFrame>
  )
}

export function ExampleRenderer({ card }: CardRendererProps<ExampleCard>) {
  return (
    <CardFrame card={card}>
      <h2 className="mb-3 text-2xl font-bold text-ink">{card.title}</h2>
      {card.intro && (
        <p className="mb-4 text-base">
          <RichText value={card.intro} />
        </p>
      )}
      {card.code && (
        <CodeBlock language={card.code.language} content={card.code.content} />
      )}
      {card.explanation && (
        <p className="mt-4 text-base">
          <RichText value={card.explanation} />
        </p>
      )}
    </CardFrame>
  )
}

export function ScenarioRenderer({ card }: CardRendererProps<ScenarioCard>) {
  return (
    <CardFrame card={card}>
      <h2 className="mb-3 text-2xl font-bold text-ink">{card.title}</h2>
      <p className="text-base">
        <RichText value={card.body} />
      </p>
      {card.atWork && (
        <div className="mt-5 rounded-2xl border-l-4 border-warn bg-warn-soft/50 p-4 text-sm text-ink">
          <span className="font-semibold text-warn">At work: </span>
          <RichText value={card.atWork} />
        </div>
      )}
    </CardFrame>
  )
}

export function MistakeRenderer({ card }: CardRendererProps<MistakeCard>) {
  return (
    <CardFrame card={card}>
      <h2 className="mb-4 text-2xl font-bold text-ink">{card.title}</h2>
      <div className="space-y-3">
        <div className="rounded-2xl border border-bad/30 bg-bad-soft/50 p-4">
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-bad">
            The myth
          </p>
          <p className="text-sm text-ink">
            <RichText value={card.myth} />
          </p>
        </div>
        <div className="rounded-2xl border border-good/30 bg-good-soft/50 p-4">
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-good">
            The reality
          </p>
          <p className="text-sm text-ink">
            <RichText value={card.reality} />
          </p>
        </div>
      </div>
    </CardFrame>
  )
}

export function SummaryRenderer({ card }: CardRendererProps<SummaryCard>) {
  return (
    <CardFrame card={card}>
      <h2 className="mb-4 text-2xl font-bold text-ink">{card.title}</h2>
      <ul className="space-y-2">
        {card.points.map((p, i) => (
          <li key={i} className="flex gap-3 text-base text-ink">
            <span aria-hidden className="text-ink-faint">
              {i + 1}.
            </span>
            <RichText value={p} />
          </li>
        ))}
      </ul>
    </CardFrame>
  )
}

export function RecapRenderer({ card }: CardRendererProps<RecapCard>) {
  return (
    <CardFrame card={card}>
      <h2 className="mb-4 text-2xl font-bold text-ink">{card.title}</h2>
      <ul className="space-y-2">
        {card.points.map((p, i) => (
          <li key={i} className="flex gap-2 text-base text-ink">
            <span aria-hidden className="text-good">
              ✓
            </span>
            <RichText value={p} />
          </li>
        ))}
      </ul>
      {card.closing && (
        <p className="mt-5 rounded-2xl bg-good-soft/60 p-4 text-center text-base font-medium text-ink">
          <RichText value={card.closing} />
        </p>
      )}
    </CardFrame>
  )
}
