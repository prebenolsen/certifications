import type { ComponentType } from 'react'
import type { Card, CardType } from '@/types/content'
import type { CardRendererProps } from './types'
import {
  AnalogyRenderer,
  ConceptRenderer,
  DiagramRenderer,
  ExampleRenderer,
  MistakeRenderer,
  RecapRenderer,
  ScenarioRenderer,
  SummaryRenderer,
} from './StaticCards'
import { FlashcardRenderer } from './FlashcardRenderer'
import { TrueFalseRenderer } from './TrueFalseRenderer'
import { McqRenderer } from './McqRenderer'

/**
 * Single source of truth mapping each card `type` to its renderer.
 * This is the extension point: to support a new card type, add its variant to
 * `types/content.ts`, write a renderer, and register it here.
 */
const cardRegistry: Record<CardType, ComponentType<CardRendererProps<never>>> = {
  concept: ConceptRenderer,
  analogy: AnalogyRenderer,
  diagram: DiagramRenderer,
  example: ExampleRenderer,
  scenario: ScenarioRenderer,
  mistake: MistakeRenderer,
  flashcard: FlashcardRenderer,
  truefalse: TrueFalseRenderer,
  mcq: McqRenderer,
  summary: SummaryRenderer,
  recap: RecapRenderer,
}

/**
 * Renders any card by delegating to the registered renderer for its type.
 * The `never` cast bridges the per-variant renderer props to the general Card;
 * safety is guaranteed by the discriminated union + registry key alignment.
 */
export function CardView(props: CardRendererProps<Card>) {
  const Renderer = cardRegistry[props.card.type]
  return <Renderer {...(props as CardRendererProps<never>)} />
}
