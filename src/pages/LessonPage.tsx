import { useNavigate, useParams } from 'react-router-dom'
import { getLesson, getNextLesson } from '@/content/registry'
import { CardPlayer } from '@/components/player/CardPlayer'
import { NotFound } from './NotFound'

/**
 * Hosts the full-screen CardPlayer for one lesson. Rendered outside the normal
 * Layout so it can take over the viewport (the player has its own chrome).
 */
export function LessonPage() {
  const { certId = '', moduleId = '', lessonId = '' } = useParams()
  const navigate = useNavigate()
  const found = getLesson(certId, moduleId, lessonId)

  if (!found || found.lesson.cards.length === 0) return <NotFound />

  const nextEntry = getNextLesson(certId, moduleId, lessonId)
  const next = nextEntry
    ? {
        title: nextEntry.lesson.title,
        onGo: () =>
          navigate(
            `/cert/${certId}/module/${nextEntry.module.id}/lesson/${nextEntry.lesson.id}`,
          ),
      }
    : undefined

  return (
    <CardPlayer
      key={`${certId}/${lessonId}`}
      certId={certId}
      lesson={found.lesson}
      onExit={() => navigate(`/cert/${certId}/module/${moduleId}`)}
      next={next}
    />
  )
}
