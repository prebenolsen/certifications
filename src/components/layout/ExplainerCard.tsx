import { RichText } from '@/components/ui/RichText'
import type { Explainer } from '@/types/content'

/**
 * A visual explainer, linked out to.
 *
 * Deliberately *not* styled like a certification or module card: those are
 * places you make progress, this is a side door to a diagram. It reads as a
 * quiet aside — accent-tinted, flat, no progress bar — and says plainly that
 * it opens in a new tab, so nobody clicks it expecting a lesson player.
 */
export function ExplainerCard({ explainer }: { explainer: Explainer }) {
  return (
    <a
      href={explainer.url}
      target="_blank"
      rel="noreferrer"
      className="block rounded-2xl border border-accent-soft bg-accent-soft/40 p-5 transition hover:border-accent hover:bg-accent-soft/70"
    >
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
          Interactive
        </span>
        <h3 className="text-lg font-bold text-ink">
          {explainer.title} <span className="text-accent">↗</span>
        </h3>
        <span className="text-xs text-ink-faint">
          ~{explainer.minutes} min · opens in a new tab
        </span>
      </div>

      <RichText
        value={explainer.summary}
        className="mt-2 max-w-2xl text-sm text-ink-soft"
      />

      {explainer.modes && (
        <dl className="mt-4 grid gap-3 sm:grid-cols-3">
          {explainer.modes.map((mode) => (
            <div key={mode.label}>
              <dt className="text-xs font-bold text-ink">{mode.label}</dt>
              <dd className="mt-0.5 text-xs leading-snug text-ink-soft">
                {mode.note}
              </dd>
            </div>
          ))}
        </dl>
      )}

      <div className="mt-4 border-t border-accent-soft pt-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
          Answers
        </p>
        <ul className="mt-1.5 space-y-1">
          {explainer.answers.map((q) => (
            <li key={q} className="text-xs text-ink-soft">
              <span className="text-accent">·</span> {q}
            </li>
          ))}
        </ul>
      </div>
    </a>
  )
}
