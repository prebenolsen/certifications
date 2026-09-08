import { glossary, glossaryById } from '@/content/glossary'
import type { GlossaryTerm } from '@/types/content'

/**
 * Matching glossary terms inside card text.
 *
 * One combined regex, built once. Surface forms are sorted **longest first**
 * so "Lakeflow Jobs" wins over "Lakeflow" and "materialized views" over
 * "materialized view" — otherwise the shorter term would claim the prefix and
 * leave a dangling word.
 *
 * Boundaries use `(?<![\w-])` / `(?![\w-])` rather than `\b` so that a term is
 * not matched inside a longer hyphenated identifier (`auto-loader-checkpoint`).
 */

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** Every surface form → the term it belongs to. */
const surfaceForms: Array<{ form: string; term: GlossaryTerm }> = glossary
  .flatMap((term) => [term.term, ...(term.aliases ?? [])].map((form) => ({ form, term })))
  .sort((a, b) => b.form.length - a.form.length)

const matcher =
  surfaceForms.length > 0
    ? new RegExp(
        `(?<![\\w-])(${surfaceForms.map((s) => escapeRe(s.form)).join('|')})(?![\\w-])`,
        'gi',
      )
    : null

/** Lowercased surface form → term, for resolving a match back to its entry. */
const byForm = new Map(surfaceForms.map((s) => [s.form.toLowerCase(), s.term]))

export function lookupSurfaceForm(form: string): GlossaryTerm | undefined {
  return byForm.get(form.toLowerCase())
}

export function lookupTerm(id: string): GlossaryTerm | undefined {
  return glossaryById.get(id)
}

export interface TextSegment {
  text: string
  /** Present when this segment is a recognised glossary term. */
  term?: GlossaryTerm
}

/**
 * Split a string into plain and term segments.
 *
 * `skip` lets a caller suppress terms it has already marked — we underline only
 * the **first** occurrence of a term per card, so a paragraph that says
 * "Lakeflow Jobs" four times gets one marker, not four. Matched ids are added
 * to the set as a side effect.
 */
export function splitByTerms(text: string, skip?: Set<string>): TextSegment[] {
  if (!matcher || !text) return [{ text }]
  matcher.lastIndex = 0

  const segments: TextSegment[] = []
  let cursor = 0
  let match: RegExpExecArray | null

  while ((match = matcher.exec(text)) !== null) {
    const term = lookupSurfaceForm(match[0])
    if (!term || skip?.has(term.id)) continue

    if (match.index > cursor) segments.push({ text: text.slice(cursor, match.index) })
    segments.push({ text: match[0], term })
    skip?.add(term.id)
    cursor = match.index + match[0].length
  }

  if (cursor < text.length) segments.push({ text: text.slice(cursor) })
  return segments.length > 0 ? segments : [{ text }]
}

/** True if any glossary term appears in the text. Used by the report script. */
export function containsTerm(text: string, termId: string): boolean {
  const term = glossaryById.get(termId)
  if (!term) return false
  const forms = [term.term, ...(term.aliases ?? [])]
  return forms.some((form) =>
    new RegExp(`(?<![\\w-])${escapeRe(form)}(?![\\w-])`, 'i').test(text),
  )
}
