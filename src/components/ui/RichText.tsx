import { Fragment, type ReactNode } from 'react'
import type { RichText as RichTextType } from '@/types/content'

/**
 * Renders our lightweight inline markup:
 *   **bold**   → <strong>
 *   *italic*   → <em>
 *   `code`     → <code>
 *   \n         → line break
 *
 * This keeps content authoring simple (plain strings) while allowing a little
 * emphasis. It intentionally supports only a tiny, safe subset — no raw HTML.
 */
function renderInline(text: string): ReactNode[] {
  // Split on **bold**, *italic* and `code` while keeping the delimiters.
  // The **bold** alternative is listed first so it wins over *italic*.
  const tokens = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g)
  return tokens.map((tok, i) => {
    if (tok.startsWith('**') && tok.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-ink">
          {tok.slice(2, -2)}
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
    return <Fragment key={i}>{tok}</Fragment>
  })
}

export function RichText({
  value,
  className,
}: {
  value: RichTextType
  className?: string
}) {
  const lines = value.split('\n')
  return (
    <span className={className}>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {renderInline(line)}
          {i < lines.length - 1 && <br />}
        </Fragment>
      ))}
    </span>
  )
}
