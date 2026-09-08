import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import type { GlossaryTerm } from '@/types/content'
import { lookupTerm } from '@/lib/glossary'
import { SeenTermsContext } from '@/lib/glossaryScope'
import { RichText } from '@/components/ui/RichText'

/* ------------------------------------------------------------------ */
/* Scope: underline the first occurrence of a term per card            */
/* ------------------------------------------------------------------ */

/**
 * Gives its subtree a fresh set of already-marked term ids, so each card
 * underlines a given term once. See `lib/glossaryScope.ts` for why the context
 * itself lives elsewhere.
 */
export function GlossaryScope({ children }: { children: ReactNode }) {
  return (
    <SeenTermsContext.Provider value={new Set<string>()}>
      {children}
    </SeenTermsContext.Provider>
  )
}

/* ------------------------------------------------------------------ */
/* The marker itself                                                   */
/* ------------------------------------------------------------------ */

/**
 * A glossary term rendered inline: the word itself, marked with a dotted
 * underline, that opens its definition on click.
 *
 * The styling is deliberately quiet — this is an *offer*, not a call to
 * action. A learner reading straight through should barely register it; a
 * learner who has lost the thread should find it immediately.
 */
export function GlossaryMark({ term, children }: { term: GlossaryTerm; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLSpanElement>(null)
  const popoverRef = useRef<HTMLSpanElement>(null)
  const popoverId = useId()

  // Close on an outside click.
  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  // Move focus into the popover so Escape and arrow keys are captured here
  // rather than reaching the card player's global navigation handler.
  useEffect(() => {
    if (open) popoverRef.current?.focus()
  }, [open])

  return (
    <span className="relative inline" ref={wrapperRef}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={open ? popoverId : undefined}
        title={`What is ${term.term}?`}
        onClick={() => setOpen((v) => !v)}
        className={`inline cursor-help border-b border-dotted border-ink-faint/60 text-left transition-colors hover:border-solid hover:border-accent hover:text-accent ${
          open ? 'border-solid border-accent text-accent' : ''
        }`}
      >
        {children}
      </button>

      {open && (
        <span
          id={popoverId}
          ref={popoverRef}
          role="dialog"
          aria-label={`Definition: ${term.term}`}
          tabIndex={-1}
          onKeyDown={(e) => {
            // The lesson player listens on window for Escape / arrows. While a
            // definition is open those keys belong to the popover.
            if (e.key === 'Escape') {
              setOpen(false)
              e.stopPropagation()
            } else if (e.key.startsWith('Arrow')) {
              e.stopPropagation()
            }
          }}
          className="animate-pop-in absolute left-0 top-full z-50 mt-2 block w-[min(22rem,80vw)] rounded-2xl border border-slate-200 bg-surface p-4 text-left shadow-lg outline-none"
        >
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
            Glossary
          </span>
          <span className="mb-2 block text-base font-semibold text-ink">{term.term}</span>
          <span className="block text-sm leading-relaxed text-ink-soft">
            <RichText value={term.definition} plain />
          </span>
          {term.note && (
            <span className="mt-2 block border-t border-slate-100 pt-2 text-sm leading-relaxed text-ink-faint">
              <RichText value={term.note} plain />
            </span>
          )}
          {term.seeAlso && term.seeAlso.length > 0 && (
            <span className="mt-2 block text-xs text-ink-faint">
              See also:{' '}
              {term.seeAlso
                .map((id) => lookupTerm(id)?.term)
                .filter(Boolean)
                .join(' · ')}
            </span>
          )}
        </span>
      )}
    </span>
  )
}
