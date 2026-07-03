import type { ComponentType } from 'react'
import type { DiagramId } from '@/types/content'
import { NamespaceDiagram } from './NamespaceDiagram'
import { GroupByDiagram } from './GroupByDiagram'
import { ManagedVsExternalDiagram } from './ManagedVsExternalDiagram'

/**
 * Maps a `diagramId` referenced in content to the component that draws it.
 * Add new diagrams here; content only ever references the string id.
 */
export const diagramRegistry: Record<DiagramId, ComponentType> = {
  'unity-namespace': NamespaceDiagram,
  'group-by-flow': GroupByDiagram,
  'managed-vs-external': ManagedVsExternalDiagram,
}

export function getDiagram(id: DiagramId): ComponentType | undefined {
  return diagramRegistry[id]
}
