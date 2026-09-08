/**
 * Glossary report — "is every term we use actually introduced?"
 *
 * Run with `npm run glossary`. Writes `docs/GLOSSARY.md`.
 *
 * The rule this enforces: **a term must be defined the first time a learner
 * meets it.** Not the second time, not in a different certification, not in a
 * lesson they may not have reached yet.
 *
 * So the script walks each certification in *reading order* — modules by
 * `order`, lessons as listed, cards as authored — finds where each glossary
 * term first appears, and compares that against the lesson(s) marked
 * `introducedIn`. Because each certification has to stand alone, the check runs
 * per certification: a term taught in the Analyst cert is still undefined for
 * an Engineer learner.
 *
 * Statuses:
 *   ok       introduced at or before first use
 *   late     used before the lesson that introduces it
 *   missing  used, but nothing in this certification introduces it
 *   unused   defined in the glossary but never used (a dead entry, or a term
 *            we know we owe the learner and have not written yet)
 */
import { writeFileSync } from 'node:fs'
import { certifications } from '../src/content/registry'
import { glossary } from '../src/content/glossary'
import type { Card, Certification, GlossaryTerm } from '../src/types/content'

/* ------------------------------------------------------------------ */
/* Text extraction — every learner-visible string on a card            */
/* ------------------------------------------------------------------ */

function cardText(card: Card): string {
  const parts: string[] = [card.title ?? '', card.eyebrow ?? '']
  const push = (...vals: Array<string | undefined>) => parts.push(...vals.filter(Boolean) as string[])

  switch (card.type) {
    case 'concept':
      push(card.body, ...(card.takeaways ?? []))
      break
    case 'analogy':
      push(card.body, ...(card.mapping ?? []).flatMap((m) => [m.from, m.to]))
      break
    case 'diagram':
      push(card.caption)
      if (card.spec) push(JSON.stringify(card.spec))
      break
    case 'example':
      push(card.intro, card.explanation)
      break
    case 'scenario':
      push(card.body, card.atWork)
      break
    case 'mistake':
      push(card.myth, card.reality)
      break
    case 'flashcard':
      push(card.front, card.back)
      break
    case 'truefalse':
      push(card.statement, card.explanation)
      break
    case 'mcq':
      // `examObjective` is deliberately excluded: it quotes the official exam
      // outline verbatim, so a term appearing there early is not something we
      // can fix by rewording. Flagging it would produce noise we can never
      // clear. (The in-app glossary still underlines terms there — a learner
      // who meets "Delta Lake" in an objective can still click it.)
      push(
        card.question,
        card.explanation,
        ...card.options.map((o) => o.text),
        ...Object.values(card.optionFeedback ?? {}),
      )
      break
    case 'summary':
    case 'recap':
      push(...card.points, 'closing' in card ? card.closing : undefined)
      break
  }
  return parts.join('\n')
}

/* ------------------------------------------------------------------ */
/* Matching                                                            */
/* ------------------------------------------------------------------ */

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** One regex per term, covering its canonical form and every alias. */
const termMatchers = new Map<string, RegExp>(
  glossary.map((t) => [
    t.id,
    new RegExp(
      `(?<![\\w-])(?:${[t.term, ...(t.aliases ?? [])].map(escapeRe).join('|')})(?![\\w-])`,
      'i',
    ),
  ]),
)

/* ------------------------------------------------------------------ */
/* Reading order                                                       */
/* ------------------------------------------------------------------ */

interface Position {
  index: number
  moduleTitle: string
  lessonId: string
  lessonTitle: string
}

/** Every authored lesson of a certification, in the order a learner meets it. */
function readingOrder(cert: Certification): Array<Position & { text: string }> {
  const out: Array<Position & { text: string }> = []
  const modules = [...cert.modules].sort((a, b) => a.order - b.order)
  for (const module of modules) {
    for (const lesson of module.lessons) {
      if (lesson.status !== 'complete') continue
      out.push({
        index: out.length,
        moduleTitle: `M${module.order}`,
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        text: lesson.cards.map(cardText).join('\n'),
      })
    }
  }
  return out
}

type Status = 'ok' | 'assumed' | 'late' | 'missing'

interface Finding {
  cert: Certification
  term: GlossaryTerm
  status: Status
  firstUse: Position
  introducedAt?: Position
}

const findings: Finding[] = []
const usedAnywhere = new Set<string>()

/** Lesson ids a certification may treat as already taught (see `assumes`). */
function inheritedLessonIds(cert: Certification): Set<string> {
  const ids = new Set<string>()
  for (const parentId of cert.assumes ?? []) {
    const parent = certifications.find((c) => c.id === parentId)
    if (!parent) continue
    for (const l of readingOrder(parent)) ids.add(l.lessonId)
  }
  return ids
}

for (const cert of certifications) {
  const lessons = readingOrder(cert)
  if (lessons.length === 0) continue
  const inherited = inheritedLessonIds(cert)

  for (const term of glossary) {
    const matcher = termMatchers.get(term.id)!
    const firstUse = lessons.find((l) => matcher.test(l.text))
    if (!firstUse) continue
    usedAnywhere.add(term.id)

    // The earliest lesson *in this certification* that properly introduces it.
    const introducedAt = lessons.find((l) => term.introducedIn?.includes(l.lessonId))

    const status: Status = introducedAt
      ? introducedAt.index <= firstUse.index
        ? 'ok'
        : 'late'
      : term.introducedIn?.some((l) => inherited.has(l))
        ? 'assumed'
        : 'missing'

    findings.push({ cert, term, status, firstUse, introducedAt })
  }
}

/* ------------------------------------------------------------------ */
/* Report                                                              */
/* ------------------------------------------------------------------ */

const ICON: Record<Status, string> = {
  ok: '✅',
  assumed: '🔗',
  late: '⚠️',
  missing: '❌',
}

const problems = findings.filter((f) => f.status === 'late' || f.status === 'missing')
const unused = glossary.filter((t) => !usedAnywhere.has(t.id))

const lines: string[] = []
lines.push('# Glossary')
lines.push('')
lines.push('> **Generated by `npm run glossary` — do not edit by hand.**')
lines.push('> The terms themselves live in [`src/content/glossary.ts`](../src/content/glossary.ts).')
lines.push('')
lines.push(
  'Every term the content expects a learner to know, and — per certification —',
)
lines.push(
  'whether it is *introduced* before it is *used*. A certification has to stand',
)
lines.push('on its own: a term taught in one is still undefined in another.')
lines.push('')
lines.push(`| | |`)
lines.push(`|---|---|`)
lines.push(`| Terms defined | ${glossary.length} |`)
lines.push(`| Term/certification pairs checked | ${findings.length} |`)
lines.push(`| ✅ introduced before use | ${findings.filter((f) => f.status === 'ok').length} |`)
lines.push(
  `| 🔗 introduced in a prerequisite certification | ${findings.filter((f) => f.status === 'assumed').length} |`,
)
lines.push(`| ⚠️ used before introduced | ${findings.filter((f) => f.status === 'late').length} |`)
lines.push(`| ❌ used but never introduced | ${findings.filter((f) => f.status === 'missing').length} |`)
lines.push('')

if (problems.length > 0) {
  lines.push('---')
  lines.push('')
  lines.push('## Needs attention')
  lines.push('')
  lines.push('| | Term | Certification | First met in | Introduced in |')
  lines.push('|---|---|---|---|---|')
  for (const f of problems) {
    lines.push(
      `| ${ICON[f.status]} | **${f.term.term}** | ${f.cert.title} | ${f.firstUse.moduleTitle} · \`${f.firstUse.lessonId}\` | ${
        f.introducedAt ? `${f.introducedAt.moduleTitle} · \`${f.introducedAt.lessonId}\`` : '— *nothing does*'
      } |`,
    )
  }
  lines.push('')
  lines.push(
    '⚠️ = the introducing lesson comes *later* than the first mention — either move the',
  )
  lines.push('definition earlier or add a one-line gloss at the first mention.')
  lines.push('')
  lines.push('❌ = the certification name-drops the term and never explains it. This is the')
  lines.push('failure mode the glossary exists to catch.')
  lines.push('')
  lines.push('🔗 = introduced in a certification this one lists in `assumes`, so a learner')
  lines.push('following the intended order has already met it.')
  lines.push('')
}

lines.push('---')
lines.push('')
lines.push('## All terms')
lines.push('')
lines.push('| Term | Also written as | Introduced in | Used by |')
lines.push('|---|---|---|---|')
for (const term of glossary) {
  const uses = findings.filter((f) => f.term.id === term.id)
  const usedBy =
    uses.length === 0
      ? '*not used yet*'
      : uses.map((f) => `${ICON[f.status]} ${f.cert.title.replace(/^Databricks Certified /, '')}`).join('<br>')
  lines.push(
    `| **${term.term}** | ${term.aliases?.map((a) => `\`${a}\``).join(', ') ?? '—'} | ${
      term.introducedIn?.map((l) => `\`${l}\``).join(', ') ?? '— *nothing*'
    } | ${usedBy} |`,
  )
}
lines.push('')

if (unused.length > 0) {
  lines.push('---')
  lines.push('')
  lines.push('## Defined but never used')
  lines.push('')
  lines.push(
    'Either a term we owe the learner and have not written the lesson for yet, or a',
  )
  lines.push('stale entry to delete.')
  lines.push('')
  for (const t of unused) lines.push(`- **${t.term}**`)
  lines.push('')
}

writeFileSync('docs/GLOSSARY.md', lines.join('\n'), 'utf8')

console.log(
  `Glossary: ${glossary.length} terms, ${findings.length} term/certification pairs.`,
)
if (problems.length > 0) {
  console.log(`\n${problems.length} term(s) used before they are introduced:`)
  for (const f of problems) {
    console.log(
      `  ${ICON[f.status]} ${f.term.term} — ${f.cert.id}: first met in "${f.firstUse.lessonTitle}", ${
        f.introducedAt ? `introduced in "${f.introducedAt.lessonTitle}"` : 'never introduced'
      }`,
    )
  }
}
console.log('\n→ docs/GLOSSARY.md')
