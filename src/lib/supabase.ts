import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * A single Supabase client for the app, or `null` when the project isn't
 * configured (no env vars). Everything downstream treats `null` as "guest-only
 * mode": the UI hides sign-in and progress stays in localStorage. This keeps
 * local dev and a credential-less deploy fully functional.
 */

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(url && anonKey)

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        // Magic-link redirects land back with tokens in the URL; let the client
        // consume and clear them automatically.
        detectSessionInUrl: true,
      },
    })
  : null

/** Table names are prefixed so this app can share a Supabase project safely. */
export const TABLES = {
  lessonProgress: 'certifications_lesson_progress',
  profiles: 'certifications_profiles',
} as const
