import { Fragment, type ReactNode } from 'react'
import type { RichText as RichTextType } from '@/types/content'
import { splitByTerms } from '@/lib/glossary'
import { GlossaryMark } from '@/components/ui/GlossaryMark'
import { useSeenTerms } from '@/lib/glossaryScope'

/**
 * Renders our lightweight inline markup:
 *   **bold**   → <strong>
 *   *italic*   → <em>
 *   `code`     → <code>
 *   \n         → line break
 *
 * This keeps content authoring simple (plain strings) while allowing a little
 * emphasis. It intentionally supports only a tiny, safe subset — no raw HTML.
 *
 * It is also where the **glossary** is applied. Every piece of learner-facing
 * text in the app flows through here, so marking terms in one place lights them
 * up everywhere — card bodies, takeaways, MCQ options, diagram labels — with no
 * change to the ~27 call sites and, crucially, no markup in the content data.
 *
 * Terms are marked inside plain and **bold** text (authors usually bold a term
 * on first use) but never inside `code`, where a match would be a coincidence.
 */

/** Wrap any glossary terms found in `text`; returns plain text when there are none. */
function withGlossary(text: string, seen: Set<string> | undefined, keyPrefix: string): ReactNode {
  if (!seen) return text
  const segments = splitByTerms(text, seen)
  if (segments.length === 1 && !segments[0].term) return text
  return segments.map((seg, i) =>
    seg.term ? (
      <GlossaryMark key={`${keyPrefix}-${i}`} term={seg.term}>
        {seg.text}
      </GlossaryMark>
    ) : (
      <Fragment key={`${keyPrefix}-${i}`}>{seg.text}</Fragment>
    ),
  )
}

function renderInline(text: string, seen: Set<string> | undefined): ReactNode[] {
  // Split on **bold**, *italic* and `code` while keeping the delimiters.
  // The **bold** alternative is listed first so it wins over *italic*.
  const tokens = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g)
  return tokens.map((tok, i) => {
    if (tok.startsWith('**') && tok.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-ink">
          {withGlossary(tok.slice(2, -2), seen, `b${i}`)}
        </strong>
      )
    }
    if (tok.startsWith('*') && tok.endsWith('*') && tok.length > 2) {
      return (
        <em key={i} className="italic">
          {tok.slice(1, -1)}
        </em>
      )
    }
    if (tok.startsWith('`') && tok.endsWith('`')) {
      return (
        <code
          key={i}
          className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.85em] text-brand-strong"
        >
          {tok.slice(1, -1)}
        </code>
      )
    }
    return <Fragment key={i}>{withGlossary(tok, seen, `t${i}`)}</Fragment>
  })
}

export function RichText({
  value,
  className,
  plain = false,
}: {
  value: RichTextType
  className?: string
  /**
   * Render markup but skip glossary marking. Used inside the glossary popover
   * itself, where a definition naturally mentions its sibling terms and nesting
   * one definition inside another would help nobody.
   */
  plain?: boolean
}) {
  const scopeSeen = useSeenTerms()
  const seen = plain ? undefined : scopeSeen
  const lines = value.split('\n')
  return (
    <span className={className}>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {renderInline(line, seen)}
          {i < lines.length - 1 && <br />}
        </Fragment>
      ))}
    </span>
  )
}
