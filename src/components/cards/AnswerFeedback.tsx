import type { ReactNode } from 'react'
import type { RichText as RichTextType } from '@/types/content'
import { RichText } from '@/components/ui/RichText'

/**
 * The "Correct ✓ / Not quite ✗" panel shown after answering an interactive
 * card. Shared by every quiz-style renderer so feedback looks and behaves
 * the same everywhere.
 */
export function AnswerFeedback({
  correct,
  explanation,
  children,
}: {
  correct: boolean
  explanation: RichTextType
  /** Extra footer content, e.g. the exam-objective note. */
  children?: ReactNode
}) {
  return (
    <div
      role="status"
      className={`animate-pop-in mt-5 rounded-2xl p-4 text-sm text-ink ${
        correct ? 'bg-good-soft' : 'bg-bad-soft'
      }`}
    >
      <p className="mb-1 font-bold">{correct ? 'Correct ✓' : 'Not quite ✗'}</p>
      <RichText value={explanation} />
      {children}
    </div>
  )
}
