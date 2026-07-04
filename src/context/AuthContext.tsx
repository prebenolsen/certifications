import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

/**
 * Optional authentication. Sign-in is a passwordless email magic link. When
 * Supabase isn't configured (`configured === false`) the whole app runs in
 * guest mode and the UI simply never offers sign-in.
 *
 * "Guest" is the absence of a user: progress then lives in localStorage
 * (see ProgressContext). Signing in switches progress to the cloud.
 */

interface AuthContextValue {
  /** Whether Supabase is wired up at all. */
  configured: boolean
  /** The signed-in user, or null for guests. */
  user: User | null
  /** True until the initial session check resolves. */
  loading: boolean
  /** Send a magic link. Resolves with an error message on failure. */
  signInWithEmail: (email: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

/** Where the magic link returns to — the app root under the correct base path. */
function redirectTo(): string {
  return `${window.location.origin}${import.meta.env.BASE_URL}`
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  const signInWithEmail = useCallback(async (email: string) => {
    if (!supabase) return { error: 'Sign-in is not available.' }
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo() },
    })
    return { error: error?.message ?? null }
  }, [])

  const signOut = useCallback(async () => {
    await supabase?.auth.signOut()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      configured: isSupabaseConfigured,
      user,
      loading,
      signInWithEmail,
      signOut,
    }),
    [user, loading, signInWithEmail, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
