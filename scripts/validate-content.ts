/**
 * Content validator — catches authoring mistakes the type system can't.
 *
 * Run with `npm run validate` (also part of `npm run check`). Errors fail the
 * run; warnings are printed but don't. Rules encode both structural integrity
 * (unique ids, valid MCQ answers, registered diagrams) and the teaching
 * philosophy (no walls of text, lessons end with a recap, checks exist).
 */
import { certifications } from '../src/content/registry'
import { diagramRegistry } from '../src/components/diagrams/registry'
import { isInteractive, type Card, type Lesson } from '../src/types/content'

const errors: string[] = []
const warnings: string[] = []

const error = (where: string, msg: string) => errors.push(`${where}: ${msg}`)
const warn = (where: string, msg: string) => warnings.push(`${where}: ${msg}`)

/** "No walls of text": flag any single text field longer than this. */
const MAX_TEXT_LENGTH = 700

function checkDuplicates(where: string, kind: string, ids: string[]) {
  const seen = new Set<string>()
  for (const id of ids) {
    if (seen.has(id)) error(where, `duplicate ${kind} id "${id}"`)
    seen.add(id)
  }
}

function textFieldsOf(card: Card): Array<[string, string]> {
  const fields: Array<[string, string]> = []
  const push = (name: string, value: string | undefined) => {
    if (value) fields.push([name, value])
  }
  switch (card.type) {
    case 'concept':
      push('body', card.body)
      card.takeaways?.forEach((t, i) => push(`takeaways[${i}]`, t))
      break
    case 'analogy':
      push('body', card.body)
      break
    case 'diagram':
      push('caption', card.caption)
      break
    case 'example':
      push('intro', card.intro)
      push('explanation', card.explanation)
      break
    case 'scenario':
      push('body', card.body)
      push('atWork', card.atWork)
      break
    case 'mistake':
      push('myth', card.myth)
      push('reality', card.reality)
      break
    case 'flashcard':
      push('front', card.front)
      push('back', card.back)
      break
    case 'truefalse':
      push('statement', card.statement)
      push('explanation', card.explanation)
      break
    case 'mcq':
      push('question', card.question)
      push('explanation', card.explanation)
      break
    case 'summary':
    case 'recap':
      card.points.forEach((p, i) => push(`points[${i}]`, p))
      break
  }
  return fields
}

function validateCard(where: string, card: Card) {
  for (const [field, value] of textFieldsOf(card)) {
    if (value.length > MAX_TEXT_LENGTH) {
      warn(
        where,
        `${field} is ${value.length} chars (max ${MAX_TEXT_LENGTH}) — split this into more cards`,
      )
    }
  }

  if (card.type === 'diagram') {
    if (!card.spec && !card.diagramId) {
      error(where, 'diagram card needs either `spec` or `diagramId`')
    }
    if (card.spec && card.diagramId) {
      warn(where, 'diagram card has both `spec` and `diagramId`; `spec` wins')
    }
    if (card.diagramId && !(card.diagramId in diagramRegistry)) {
      error(where, `diagramId "${card.diagramId}" is not registered`)
    }
    if (card.spec?.kind === 'flow') {
      const { steps, arrows } = card.spec
      if (steps.length < 2) error(where, 'flow diagram needs at least 2 steps')
      if (arrows && arrows.length !== steps.length - 1) {
        error(
          where,
          `flow diagram has ${steps.length} steps but ${arrows.length} arrow labels (need ${steps.length - 1})`,
        )
      }
    }
  }

  if (card.type === 'mcq') {
    const optionIds = card.options.map((o) => o.id)
    checkDuplicates(where, 'option', optionIds)
    if (card.options.length < 2) error(where, 'mcq needs at least 2 options')
    if (card.correct.length === 0) error(where, 'mcq has no correct answer')
    for (const id of card.correct) {
      if (!optionIds.includes(id)) {
        error(where, `mcq correct answer "${id}" is not an option`)
      }
    }
    for (const id of Object.keys(card.optionFeedback ?? {})) {
      if (!optionIds.includes(id)) {
        error(where, `mcq optionFeedback key "${id}" is not an option`)
      }
    }
  }
}

function validateLesson(where: string, lesson: Lesson) {
  if (lesson.status === 'planned') {
    if (lesson.cards.length > 0) {
      warn(where, 'planned lesson has cards — should its status be updated?')
    }
    return
  }

  if (lesson.cards.length === 0) {
    error(where, `${lesson.status} lesson has no cards`)
    return
  }

  checkDuplicates(where, 'card', lesson.cards.map((c) => c.id))
  if (lesson.estimatedMinutes < 1 || lesson.estimatedMinutes > 60) {
    warn(where, `estimatedMinutes ${lesson.estimatedMinutes} looks off`)
  }

  if (lesson.status === 'complete') {
    if (!lesson.cards.some(isInteractive)) {
      warn(where, 'complete lesson has no interactive check (mcq/truefalse)')
    }
    if (lesson.cards[lesson.cards.length - 1].type !== 'recap') {
      warn(where, 'complete lesson does not end with a recap card')
    }
    if (lesson.cards.length < 6) {
      warn(where, `complete lesson has only ${lesson.cards.length} cards`)
    }
  }

  for (const card of lesson.cards) {
    validateCard(`${where} → card "${card.id}" (${card.type})`, card)
  }
}

checkDuplicates('root', 'certification', certifications.map((c) => c.id))

for (const cert of certifications) {
  checkDuplicates(cert.id, 'module', cert.modules.map((m) => m.id))
  const orders = cert.modules.map((m) => m.order)
  checkDuplicates(cert.id, 'module order', orders.map(String))

  checkDuplicates(
    cert.id,
    'lesson',
    cert.modules.flatMap((m) => m.lessons.map((l) => l.id)),
  )

  for (const module of cert.modules) {
    for (const lesson of module.lessons) {
      validateLesson(`${cert.id} → ${module.id} → ${lesson.id}`, lesson)
    }
  }
}

const lessonCount = certifications.flatMap((c) =>
  c.modules.flatMap((m) => m.lessons),
)
const complete = lessonCount.filter((l) => l.status === 'complete').length
const cards = lessonCount.reduce((n, l) => n + l.cards.length, 0)

console.log(
  `Checked ${certifications.length} certification(s), ${lessonCount.length} lessons (${complete} complete), ${cards} cards.`,
)

if (warnings.length) {
  console.log(`\n⚠ ${warnings.length} warning(s):`)
  for (const w of warnings) console.log(`  - ${w}`)
}
if (errors.length) {
  console.error(`\n✗ ${errors.length} error(s):`)
  for (const e of errors) console.error(`  - ${e}`)
  process.exit(1)
}
console.log('\n✓ Content is valid.')
