/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Supabase project URL. Absent ⇒ app runs guest-only (localStorage). */
  readonly VITE_SUPABASE_URL?: string
  /** Supabase anon/public key. Safe to expose in a client bundle. */
  readonly VITE_SUPABASE_ANON_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
