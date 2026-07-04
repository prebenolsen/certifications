import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { certifications } from '@/content/registry'
import { useAuth } from '@/context/AuthContext'
import { supabase, TABLES } from '@/lib/supabase'

/**
 * Learner progress with two interchangeable backends:
 *
 * - **Guest** (no signed-in user): localStorage, per-browser. This is the
 *   default and needs no backend.
 * - **Signed in**: rows in Supabase (`certifications_lesson_progress`), scoped
 *   to the user, so progress follows them across devices.
 *
 * The public API is backend-agnostic — components (CardPlayer, useStats) don't
 * know or care which is active. Progress is keyed by `certId/lessonId` so lesson
 * ids only need to be unique *within* a certification.
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
/** Sentinel for "hydrated as guest" so the cloud writer can tell it apart. */
const GUEST = '__guest__'

const progressKey = (certId: string, lessonId: string) => `${certId}/${lessonId}`

function splitKey(key: string): [certId: string, lessonId: string] {
  const i = key.indexOf('/')
  return [key.slice(0, i), key.slice(i + 1)]
}

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

function loadLocal(): ProgressState {
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

function saveLocal(state: ProgressState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Ignore write failures (e.g. private mode quota).
  }
}

/* ------------------------------------------------------------------ */
/* Supabase backend                                                    */
/* ------------------------------------------------------------------ */

interface ProgressRow {
  cert_id: string
  lesson_id: string
  viewed_cards: string[] | null
  answers: Record<string, boolean> | null
  completed: boolean | null
}

async function fetchCloud(
  userId: string,
): Promise<{ lessons: Record<string, LessonProgress>; error: boolean }> {
  if (!supabase) return { lessons: {}, error: true }
  const { data, error } = await supabase
    .from(TABLES.lessonProgress)
    .select('cert_id,lesson_id,viewed_cards,answers,completed')
    .eq('user_id', userId)
  if (error || !data) return { lessons: {}, error: true }
  const lessons: Record<string, LessonProgress> = {}
  for (const row of data as ProgressRow[]) {
    lessons[progressKey(row.cert_id, row.lesson_id)] = {
      viewedCards: row.viewed_cards ?? [],
      answers: row.answers ?? {},
      completed: row.completed ?? false,
    }
  }
  return { lessons, error: false }
}

function upsertCloud(userId: string, key: string, lp: LessonProgress) {
  if (!supabase) return
  const [cert_id, lesson_id] = splitKey(key)
  void supabase.from(TABLES.lessonProgress).upsert(
    {
      user_id: userId,
      cert_id,
      lesson_id,
      viewed_cards: lp.viewedCards,
      answers: lp.answers,
      completed: lp.completed,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,cert_id,lesson_id' },
  )
}

function deleteCloud(userId: string, key: string) {
  if (!supabase) return
  const [cert_id, lesson_id] = splitKey(key)
  void supabase
    .from(TABLES.lessonProgress)
    .delete()
    .eq('user_id', userId)
    .eq('cert_id', cert_id)
    .eq('lesson_id', lesson_id)
}

/* ------------------------------------------------------------------ */

const ProgressContext = createContext<ProgressContextValue | null>(null)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const uid = user?.id ?? null

  const [state, setState] = useState<ProgressState>(loadLocal)

  // The last state we've reconciled with the cloud, so the writer can upsert
  // only what changed. Also gates writes until hydration for a user completes.
  const syncedRef = useRef<Record<string, LessonProgress>>({})
  const hydratedForRef = useRef<string>(GUEST)

  // (Re)hydrate whenever the signed-in user changes.
  useEffect(() => {
    let cancelled = false

    if (!uid || !supabase) {
      // Guest: source of truth is localStorage.
      hydratedForRef.current = GUEST
      syncedRef.current = {}
      setState(loadLocal())
      return
    }

    // Signed in: mark "not ready" so the writer holds off, then load the cloud.
    hydratedForRef.current = ''
    ;(async () => {
      const { lessons: cloud, error } = await fetchCloud(uid)
      if (cancelled) return
      // First-time sign-in on a fresh account: carry this browser's guest
      // progress up into the cloud so nothing is lost.
      let merged = cloud
      const toPush: string[] = []
      if (!error && Object.keys(cloud).length === 0) {
        const local = loadLocal().lessons
        merged = { ...local }
        toPush.push(...Object.keys(local))
      }
      setState({ lessons: merged })
      syncedRef.current = { ...merged }
      hydratedForRef.current = uid
      for (const key of toPush) upsertCloud(uid, key, merged[key])
    })()

    return () => {
      cancelled = true
    }
  }, [uid])

  // Persist on every change to the active backend.
  useEffect(() => {
    if (!uid || !supabase) {
      saveLocal(state)
      return
    }
    // Don't write back the guest snapshot while the cloud is still hydrating.
    if (hydratedForRef.current !== uid) return

    const prev = syncedRef.current
    for (const [key, lp] of Object.entries(state.lessons)) {
      if (prev[key] !== lp) upsertCloud(uid, key, lp)
    }
    for (const key of Object.keys(prev)) {
      if (!(key in state.lessons)) deleteCloud(uid, key)
    }
    syncedRef.current = { ...state.lessons }
  }, [state, uid])

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
