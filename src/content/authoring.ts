import type { Lesson } from '@/types/content'

/**
 * Shared helpers for content authors. Keep this file free of UI imports so
 * content stays a pure data layer.
 */

/**
 * A placeholder for a lesson that is scoped but not yet written. It shows up
 * on the module page as "Coming soon" and is excluded from progress math.
 */
export function planned(
  id: string,
  title: string,
  summary: string,
  estimatedMinutes = 8,
): Lesson {
  return {
    id,
    title,
    summary,
    estimatedMinutes,
    status: 'planned',
    cards: [],
  }
}
