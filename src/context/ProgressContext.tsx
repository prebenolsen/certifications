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
import type { QuizMode, ReviewRef } from '@/lib/quiz'
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

export interface QuizResponse {
  chosen: string[]
  correct: boolean
  at: string
}

export interface QuizAttempt {
  id: string
  mode: QuizMode
  seed: number
  questionIds: string[]
  responses: Record<string, QuizResponse>
  startedAt: string
  finishedAt?: string
  score?: number
}

export interface MissedRecord {
  questionId: string
  reviewRefs: ReviewRef[]
  stem: string
  correctIds: string[]
  chosen: string[]
  missCount: number
  lastMissedAt: string
  clearedAt?: string
}

export interface ModuleQuizProgress {
  attempts: QuizAttempt[]
  draft?: QuizAttempt
  missed: Record<string, MissedRecord>
  bestScore: number | null
}

interface ProgressState {
  /** `${certId}/${lessonId}` → progress */
  lessons: Record<string, LessonProgress>
  /** `${certId}/${moduleId}` → quiz progress */
  quizzes: Record<string, ModuleQuizProgress>
}

interface ProgressContextValue {
  getLesson: (certId: string, lessonId: string) => LessonProgress | undefined
  getModuleQuiz: (certId: string, moduleId: string) => ModuleQuizProgress | undefined
  markCardViewed: (certId: string, lessonId: string, cardId: string) => void
  recordAnswer: (
    certId: string,
    lessonId: string,
    cardId: string,
    correct: boolean,
  ) => void
  markCompleted: (certId: string, lessonId: string) => void
  startQuizAttempt: (
    certId: string,
    moduleId: string,
    input: { mode: QuizMode; seed: number; questionIds: string[] },
  ) => string
  recordQuizResponse: (
    certId: string,
    moduleId: string,
    attemptId: string,
    questionId: string,
    response: QuizResponse,
    provenance: Pick<MissedRecord, 'reviewRefs' | 'stem' | 'correctIds'>,
  ) => void
  finishQuizAttempt: (certId: string, moduleId: string, attemptId: string) => void
  discardQuizAttempt: (certId: string, moduleId: string, attemptId: string) => void
  clearMissed: (certId: string, moduleId: string, questionId: string) => void
  resetModuleQuiz: (certId: string, moduleId: string) => void
  resetLesson: (certId: string, lessonId: string) => void
  resetAll: () => void
}

const STORAGE_KEY = 'certifications.progress.v2'
const LEGACY_STORAGE_KEY = 'certifications.progress.v1'
const GUEST = '__guest__'

const progressKey = (certId: string, lessonId: string) => `${certId}/${lessonId}`
const quizKey = (certId: string, moduleId: string) => `${certId}/${moduleId}`

function splitKey(key: string): [certId: string, lessonId: string] {
  const i = key.indexOf('/')
  return [key.slice(0, i), key.slice(i + 1)]
}

const emptyLesson = (): LessonProgress => ({
  viewedCards: [],
  answers: {},
  completed: false,
})

function normalize(parsed: unknown): ProgressState {
  const p = (parsed ?? {}) as Partial<ProgressState>
  return {
    lessons: p.lessons ?? {},
    quizzes: p.quizzes ?? {},
  }
}

function migrateV1(v1: Partial<ProgressState>): ProgressState {
  const lessons: ProgressState['lessons'] = {}
  const entries = (v1.lessons ?? {}) as Record<string, LessonProgress>
  for (const [lessonId, progress] of Object.entries(entries)) {
    const cert = certifications.find((c) =>
      c.modules.some((m) => m.lessons.some((l) => l.id === lessonId)),
    )
    if (cert) lessons[progressKey(cert.id, lessonId)] = progress
  }
  return { lessons, quizzes: {} }
}

function loadLocal(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return normalize(JSON.parse(raw))
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY)
    if (legacy) {
      const migrated = migrateV1(JSON.parse(legacy) as Partial<ProgressState>)
      localStorage.removeItem(LEGACY_STORAGE_KEY)
      return migrated
    }
  } catch {
    // Corrupt or unavailable storage — start fresh rather than crashing.
  }
  return { lessons: {}, quizzes: {} }
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

  const syncedRef = useRef<Record<string, LessonProgress>>({})
  const hydratedForRef = useRef<string>(GUEST)

  useEffect(() => {
    let cancelled = false

    if (!uid || !supabase) {
      hydratedForRef.current = GUEST
      syncedRef.current = {}
      setState(loadLocal())
      return
    }

    hydratedForRef.current = ''
    ;(async () => {
      const { lessons: cloud, error } = await fetchCloud(uid)
      if (cancelled) return
      let merged = cloud
      const toPush: string[] = []
      if (!error && Object.keys(cloud).length === 0) {
        const local = loadLocal().lessons
        merged = { ...local }
        toPush.push(...Object.keys(local))
      }
      setState({ lessons: merged, quizzes: {} })
      syncedRef.current = { ...merged }
      hydratedForRef.current = uid
      for (const key of toPush) upsertCloud(uid, key, merged[key])
    })()

    return () => {
      cancelled = true
    }
  }, [uid])

  useEffect(() => {
    if (!uid || !supabase) {
      saveLocal(state)
      return
    }
    if (hydratedForRef.current !== uid) return

    const prev = syncedRef.current
    for (const [key, lp] of Object.entries(state.lessons)) {
      if (prev[key] !== lp) upsertCloud(uid, key, lp)
    }
    for (const key of Object.keys(prev)) {
      if (!(key in state.lessons)) deleteCloud(uid, key)
    }
    syncedRef.current = { ...state.lessons }
    saveLocal(state)
  }, [state, uid])

  const getLesson = useCallback(
    (certId: string, lessonId: string) =>
      state.lessons[progressKey(certId, lessonId)],
    [state],
  )

  const getModuleQuiz = useCallback(
    (certId: string, moduleId: string) => state.quizzes[quizKey(certId, moduleId)],
    [state],
  )

  const markCardViewed = useCallback(
    (certId: string, lessonId: string, cardId: string) => {
      const key = progressKey(certId, lessonId)
      setState((prev) => {
        const lesson = prev.lessons[key] ?? emptyLesson()
        if (lesson.viewedCards.includes(cardId)) return prev
        return {
          ...prev,
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
        if (cardId in lesson.answers) return prev
        return {
          ...prev,
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
        ...prev,
        lessons: {
          ...prev.lessons,
          [key]: { ...lesson, completed: true },
        },
      }
    })
  }, [])

  const startQuizAttempt = useCallback(
    (certId: string, moduleId: string, input: { mode: QuizMode; seed: number; questionIds: string[] }) => {
      const key = quizKey(certId, moduleId)
      const id = `${Date.now().toString(36)}-${Math.random().toString(16).slice(2, 8)}`
      setState((prev) => {
        const current = prev.quizzes[key] ?? { attempts: [], missed: {}, bestScore: null }
        return {
          ...prev,
          quizzes: {
            ...prev.quizzes,
            [key]: {
              ...current,
              draft: {
                id,
                mode: input.mode,
                seed: input.seed,
                questionIds: input.questionIds,
                responses: {},
                startedAt: new Date().toISOString(),
              },
            },
          },
        }
      })
      return id
    },
    [],
  )

  const recordQuizResponse = useCallback(
    (
      certId: string,
      moduleId: string,
      attemptId: string,
      questionId: string,
      response: QuizResponse,
      provenance: Pick<MissedRecord, 'reviewRefs' | 'stem' | 'correctIds'>,
    ) => {
      const key = quizKey(certId, moduleId)
      setState((prev) => {
        const current = prev.quizzes[key] ?? { attempts: [], missed: {}, bestScore: null }
        const draft = current.draft
        if (!draft || draft.id !== attemptId) return prev

        const nextDraft = {
          ...draft,
          responses: { ...draft.responses, [questionId]: response },
        }

        const nextMissed = { ...current.missed }
        const existing = nextMissed[questionId]
        const now = new Date().toISOString()

        if (!response.correct) {
          nextMissed[questionId] = {
            questionId,
            reviewRefs: provenance.reviewRefs,
            stem: provenance.stem,
            correctIds: provenance.correctIds,
            chosen: response.chosen,
            missCount: (existing?.missCount ?? 0) + 1,
            lastMissedAt: now,
            clearedAt: existing?.clearedAt,
          }
        } else if (existing) {
          nextMissed[questionId] = {
            ...existing,
            chosen: response.chosen,
            clearedAt: existing.clearedAt ?? now,
          }
        }

        return {
          ...prev,
          quizzes: {
            ...prev.quizzes,
            [key]: { ...current, draft: nextDraft, missed: nextMissed },
          },
        }
      })
    },
    [],
  )

  const finishQuizAttempt = useCallback((certId: string, moduleId: string, attemptId: string) => {
    const key = quizKey(certId, moduleId)
    setState((prev) => {
      const current = prev.quizzes[key] ?? { attempts: [], missed: {}, bestScore: null }
      const draft = current.draft
      if (!draft || draft.id !== attemptId) return prev

      const finishedScore =
        draft.questionIds.length > 0
          ? Object.values(draft.responses).filter((response) => response.correct).length /
            draft.questionIds.length
          : 0

      const finishedAttempt: QuizAttempt = {
        ...draft,
        finishedAt: new Date().toISOString(),
        score: finishedScore,
      }

      const attempts = [...current.attempts, finishedAttempt].slice(-10)
      const bestScore =
        current.bestScore === null
          ? finishedScore
          : Math.max(current.bestScore, finishedScore)

      return {
        ...prev,
        quizzes: {
          ...prev.quizzes,
          [key]: {
            ...current,
            attempts,
            draft: undefined,
            bestScore,
          },
        },
      }
    })
  }, [])

  const discardQuizAttempt = useCallback((certId: string, moduleId: string, attemptId: string) => {
    const key = quizKey(certId, moduleId)
    setState((prev) => {
      const current = prev.quizzes[key]
      if (!current || !current.draft || current.draft.id !== attemptId) return prev
      return {
        ...prev,
        quizzes: {
          ...prev.quizzes,
          [key]: { ...current, draft: undefined },
        },
      }
    })
  }, [])

  const clearMissed = useCallback((certId: string, moduleId: string, questionId: string) => {
    const key = quizKey(certId, moduleId)
    setState((prev) => {
      const current = prev.quizzes[key]
      if (!current) return prev
      const nextMissed = { ...current.missed }
      delete nextMissed[questionId]
      return {
        ...prev,
        quizzes: {
          ...prev.quizzes,
          [key]: { ...current, missed: nextMissed },
        },
      }
    })
  }, [])

  const resetModuleQuiz = useCallback((certId: string, moduleId: string) => {
    const key = quizKey(certId, moduleId)
    setState((prev) => {
      const next = { ...prev.quizzes }
      delete next[key]
      return {
        ...prev,
        quizzes: next,
      }
    })
  }, [])

  const resetLesson = useCallback((certId: string, lessonId: string) => {
    const key = progressKey(certId, lessonId)
    setState((prev) => {
      const next = { ...prev.lessons }
      delete next[key]
      return { ...prev, lessons: next }
    })
  }, [])

  const resetAll = useCallback(
    () => setState({ lessons: {}, quizzes: {} }),
    [],
  )

  const value = useMemo(
    () => ({
      getLesson,
      getModuleQuiz,
      markCardViewed,
      recordAnswer,
      markCompleted,
      startQuizAttempt,
      recordQuizResponse,
      finishQuizAttempt,
      discardQuizAttempt,
      clearMissed,
      resetModuleQuiz,
      resetLesson,
      resetAll,
    }),
    [
      getLesson,
      getModuleQuiz,
      markCardViewed,
      recordAnswer,
      markCompleted,
      startQuizAttempt,
      recordQuizResponse,
      finishQuizAttempt,
      discardQuizAttempt,
      clearMissed,
      resetModuleQuiz,
      resetLesson,
      resetAll,
    ],
  )

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within a ProgressProvider')
  return ctx
}
