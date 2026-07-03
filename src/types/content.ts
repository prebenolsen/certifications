/**
 * Content model for the learning platform.
 *
 * The guiding principle: **content is data, not code.** Everything a learner
 * sees is described by these typed objects. The UI layer (card renderers)
 * knows how to *display* each card type, but never contains lesson content.
 *
 * Hierarchy:
 *   Certification → Module → Lesson → Card[]
 *
 * A `Card` is a discriminated union keyed on `type`. To add a new kind of
 * teaching card you (1) add a variant here and (2) register a renderer in
 * `components/cards/registry.tsx`. Nothing else in the app needs to change.
 */

/* ------------------------------------------------------------------ */
/* Rich inline text                                                    */
/* ------------------------------------------------------------------ */

/**
 * Most card text is a plain string, but we allow a lightweight markup subset
 * (bold **text**, inline `code`, and line breaks) rendered by <RichText />.
 * Keeping it as a string keeps content authoring frictionless.
 */
export type RichText = string

/* ------------------------------------------------------------------ */
/* Diagrams                                                            */
/* ------------------------------------------------------------------ */

/**
 * Diagrams come in two flavours:
 *
 * 1. **Data-driven** (preferred): the card carries a `DiagramSpec` describing
 *    the picture — boxes, arrows, panels — and generic primitives render it.
 *    No new component, no registry edit. Use this for ~90% of diagrams.
 * 2. **Custom**: a bespoke React/SVG component registered by id, for the rare
 *    diagram the primitives can't express. Content references it by
 *    `diagramId` so lesson data stays serialisable and free of JSX.
 */
export type DiagramId = string

/** Semantic colour applied to a diagram node. Maps to the design tokens. */
export type DiagramTone = 'brand' | 'accent' | 'good' | 'warn' | 'bad' | 'neutral'

export interface DiagramNode {
  label: string
  /** Smaller line under the label, e.g. an example value. */
  sublabel?: string
  tone?: DiagramTone
}

/**
 * The three generic diagram shapes, chosen because they cover most teaching
 * pictures: a pipeline (flow), a contrast (compare), and containment (layers).
 */
export type DiagramSpec =
  /** Left-to-right pipeline: node → node → node (stacks vertically on mobile). */
  | {
      kind: 'flow'
      steps: DiagramNode[]
      /** Optional labels shown on the arrows between steps (length = steps-1). */
      arrows?: (string | null)[]
    }
  /** Two panels side by side — for "X vs Y" contrasts. */
  | {
      kind: 'compare'
      left: DiagramNode & { items: string[] }
      right: DiagramNode & { items: string[] }
    }
  /** Nested containment, outermost first — for hierarchies like catalog ⊃ schema ⊃ table. */
  | {
      kind: 'layers'
      layers: DiagramNode[]
    }

/* ------------------------------------------------------------------ */
/* Cards                                                               */
/* ------------------------------------------------------------------ */

export type CardType =
  | 'concept'
  | 'analogy'
  | 'diagram'
  | 'example'
  | 'scenario'
  | 'mistake'
  | 'flashcard'
  | 'truefalse'
  | 'mcq'
  | 'summary'
  | 'recap'

interface CardBase {
  /** Stable id, unique within a lesson. Used for progress + deep links. */
  id: string
  type: CardType
  /** Optional short eyebrow label shown above the title (e.g. "Analogy"). */
  eyebrow?: string
}

/** A single idea explained. Intuition first, terminology second. */
export interface ConceptCard extends CardBase {
  type: 'concept'
  title: string
  body: RichText
  /** Optional key-point takeaways rendered as a highlighted list. */
  takeaways?: RichText[]
}

/** Explains a concept by comparison to something familiar. */
export interface AnalogyCard extends CardBase {
  type: 'analogy'
  title: string
  /** The familiar thing, e.g. "A library". */
  body: RichText
  /** Optional explicit "maps to" pairs: [familiar, technical]. */
  mapping?: Array<{ from: string; to: string }>
}

/**
 * A visual. Either a data-driven `spec` (preferred — no code needed) or a
 * registered custom component via `diagramId`. Exactly one should be set.
 */
export interface DiagramCard extends CardBase {
  type: 'diagram'
  title: string
  diagramId?: DiagramId
  spec?: DiagramSpec
  caption?: RichText
}

/** A worked example, usually including a code block. */
export interface ExampleCard extends CardBase {
  type: 'example'
  title: string
  intro?: RichText
  code?: { language: string; content: string }
  /** Explanation shown after the code. */
  explanation?: RichText
}

/** A real-world situation that frames when/why a concept applies. */
export interface ScenarioCard extends CardBase {
  type: 'scenario'
  title: string
  body: RichText
  /** Optional "at work" framing tied to the learner's day job. */
  atWork?: RichText
}

/** A common misconception, stated then corrected. */
export interface MistakeCard extends CardBase {
  type: 'mistake'
  title: string
  /** The wrong belief. */
  myth: RichText
  /** The correction. */
  reality: RichText
}

/** Click-to-reveal flash card: prompt on the front, answer on the back. */
export interface FlashcardCard extends CardBase {
  type: 'flashcard'
  front: RichText
  back: RichText
}

/** True/false interactive check with an explanation. */
export interface TrueFalseCard extends CardBase {
  type: 'truefalse'
  statement: RichText
  answer: boolean
  explanation: RichText
}

/** Multiple-choice question. Supports single- or multi-select. */
export interface McqCard extends CardBase {
  type: 'mcq'
  question: RichText
  options: Array<{ id: string; text: RichText }>
  /** ids of the correct option(s). More than one ⇒ multi-select. */
  correct: string[]
  /** Shown after answering, regardless of correctness. */
  explanation: RichText
  /** Optional per-option feedback keyed by option id. */
  optionFeedback?: Record<string, RichText>
  /** Ties this question back to an official exam objective. */
  examObjective?: string
}

/** Short list of the key ideas from the lesson so far. */
export interface SummaryCard extends CardBase {
  type: 'summary'
  title: string
  points: RichText[]
}

/** End-of-lesson recap with a motivating closing line. */
export interface RecapCard extends CardBase {
  type: 'recap'
  title: string
  points: RichText[]
  closing?: RichText
}

export type Card =
  | ConceptCard
  | AnalogyCard
  | DiagramCard
  | ExampleCard
  | ScenarioCard
  | MistakeCard
  | FlashcardCard
  | TrueFalseCard
  | McqCard
  | SummaryCard
  | RecapCard

/** Card types the learner can interactively answer (used for scoring). */
export const INTERACTIVE_CARD_TYPES: CardType[] = ['mcq', 'truefalse']

export function isInteractive(card: Card): boolean {
  return INTERACTIVE_CARD_TYPES.includes(card.type)
}

/* ------------------------------------------------------------------ */
/* Lessons, modules, certifications                                    */
/* ------------------------------------------------------------------ */

export type ContentStatus = 'complete' | 'in-progress' | 'planned'

export interface Lesson {
  id: string
  title: string
  /** One-line description shown on the module overview. */
  summary: string
  /** Rough minutes to complete — sets learner expectations. */
  estimatedMinutes: number
  status: ContentStatus
  cards: Card[]
}

export interface Module {
  id: string
  /** Ordinal shown to the learner (e.g. "Module 3"). */
  order: number
  title: string
  summary: string
  /** Which official exam section(s) this module maps to. */
  examSections: string[]
  /** Emoji or short glyph used as the module's visual anchor. */
  icon: string
  lessons: Lesson[]
}

export interface Certification {
  id: string
  title: string
  provider: string
  summary: string
  /** Link to the official certification page. */
  officialUrl: string
  examFacts: {
    questions: number
    minutes: number
    passingNote?: string
    validityYears: number
  }
  modules: Module[]
}
