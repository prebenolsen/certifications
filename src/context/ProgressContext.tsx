import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { certifications } from '@/content/registry'

/**
 * Learner progress, persisted to localStorage. Intentionally simple for v1 —
 * no backend. Progress is keyed by `certId/lessonId` so lesson ids only need
 * to be unique *within* a certification (two certs can both have an
 * `auto-loader` lesson without clobbering each other).
 */

export interface LessonProgress {
  /** ids of cards the learner has viewed/passed through. */
  viewedCards: string[]
  /** Answers to interactive cards: cardId → wasCorrect. */
  answers: Record<string, boolean>
  /** True once the learner reaches the final card. */
  completed: boolean
}

interface ProgressState {
  /** `${certId}/${lessonId}` → progress */
  lessons: Record<string, LessonProgress>
}

interface ProgressContextValue {
  getLesson: (certId: string, lessonId: string) => LessonProgress | undefined
  markCardViewed: (certId: string, lessonId: string, cardId: string) => void
  recordAnswer: (
    certId: string,
    lessonId: string,
    cardId: string,
    correct: boolean,
  ) => void
  markCompleted: (certId: string, lessonId: string) => void
  resetLesson: (certId: string, lessonId: string) => void
  resetAll: () => void
}

const STORAGE_KEY = 'certifications.progress.v2'
const LEGACY_STORAGE_KEY = 'certifications.progress.v1'

const progressKey = (certId: string, lessonId: string) => `${certId}/${lessonId}`

const emptyLesson = (): LessonProgress => ({
  viewedCards: [],
  answers: {},
  completed: false,
})

/**
 * v1 keyed progress by bare lessonId. Migrate by finding which certification
 * each lesson id belongs to. Ambiguous/unknown ids are dropped (safe: v1
 * shipped with a single certification).
 */
function migrateV1(v1: ProgressState): ProgressState {
  const lessons: ProgressState['lessons'] = {}
  for (const [lessonId, progress] of Object.entries(v1.lessons)) {
    const cert = certifications.find((c) =>
      c.modules.some((m) => m.lessons.some((l) => l.id === lessonId)),
    )
    if (cert) lessons[progressKey(cert.id, lessonId)] = progress
  }
  return { lessons }
}

function loadState(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as ProgressState
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY)
    if (legacy) {
      const migrated = migrateV1(JSON.parse(legacy) as ProgressState)
      localStorage.removeItem(LEGACY_STORAGE_KEY)
      return migrated
    }
  } catch {
    // Corrupt or unavailable storage — start fresh rather than crashing.
  }
  return { lessons: {} }
}

const ProgressContext = createContext<ProgressContextValue | null>(null)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(loadState)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // Ignore write failures (e.g. private mode quota).
    }
  }, [state])

  const getLesson = useCallback(
    (certId: string, lessonId: string) =>
      state.lessons[progressKey(certId, lessonId)],
    [state],
  )

  const markCardViewed = useCallback(
    (certId: string, lessonId: string, cardId: string) => {
      const key = progressKey(certId, lessonId)
      setState((prev) => {
        const lesson = prev.lessons[key] ?? emptyLesson()
        if (lesson.viewedCards.includes(cardId)) return prev
        return {
          lessons: {
            ...prev.lessons,
            [key]: {
              ...lesson,
              viewedCards: [...lesson.viewedCards, cardId],
            },
          },
        }
      })
    },
    [],
  )

  const recordAnswer = useCallback(
    (certId: string, lessonId: string, cardId: string, correct: boolean) => {
      const key = progressKey(certId, lessonId)
      setState((prev) => {
        const lesson = prev.lessons[key] ?? emptyLesson()
        if (cardId in lesson.answers) return prev // first answer is final
        return {
          lessons: {
            ...prev.lessons,
            [key]: {
              ...lesson,
              answers: { ...lesson.answers, [cardId]: correct },
            },
          },
        }
      })
    },
    [],
  )

  const markCompleted = useCallback((certId: string, lessonId: string) => {
    const key = progressKey(certId, lessonId)
    setState((prev) => {
      const lesson = prev.lessons[key] ?? emptyLesson()
      if (lesson.completed) return prev
      return {
        lessons: {
          ...prev.lessons,
          [key]: { ...lesson, completed: true },
        },
      }
    })
  }, [])

  const resetLesson = useCallback((certId: string, lessonId: string) => {
    const key = progressKey(certId, lessonId)
    setState((prev) => {
      const next = { ...prev.lessons }
      delete next[key]
      return { lessons: next }
    })
  }, [])

  const resetAll = useCallback(() => setState({ lessons: {} }), [])

  const value = useMemo(
    () => ({
      getLesson,
      markCardViewed,
      recordAnswer,
      markCompleted,
      resetLesson,
      resetAll,
    }),
    [getLesson, markCardViewed, recordAnswer, markCompleted, resetLesson, resetAll],
  )

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

// The provider and its hook are intentionally co-located; this file exports a
// non-component (the hook) alongside the component, which is fine here.
// eslint-disable-next-line react-refresh/only-export-components
export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within a ProgressProvider')
  return ctx
}
