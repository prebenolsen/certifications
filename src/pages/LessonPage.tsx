import { useNavigate, useParams } from 'react-router-dom'
import { getLesson, getNextLesson } from '@/content/registry'
import { useModuleStats } from '@/hooks/useStats'
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
  // Called unconditionally (before the early return below) to respect the
  // rules of hooks; an empty lessons list is a harmless fallback when the
  // lesson itself doesn't resolve.
  const moduleStats = useModuleStats(certId, found?.module ?? { lessons: [] })

  if (!found || found.lesson.cards.length === 0) return <NotFound />

  const nextEntry = getNextLesson(certId, moduleId, lessonId)
  const next = nextEntry
    ? {
        title: nextEntry.lesson.title,
        // Whether continuing crosses into a different module — used to
        // decide between "Next lesson" and "Finish module" at the end.
        sameModule: nextEntry.module.id === moduleId,
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
      moduleTitle={found.module.title}
      moduleStats={{ completed: moduleStats.completedLessons, total: moduleStats.totalPlayable }}
      onExit={() => navigate(`/cert/${certId}/module/${moduleId}`)}
      next={next}
    />
  )
}
