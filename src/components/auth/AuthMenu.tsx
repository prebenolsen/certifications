import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'

/**
 * Header auth control. Renders nothing when Supabase isn't configured, so the
 * app stays a pure guest-mode experience. Otherwise offers a passwordless
 * magic-link sign-in, or the current user + sign-out.
 */
export function AuthMenu() {
  const { configured, user, loading, signOut } = useAuth()
  const [open, setOpen] = useState(false)

  if (!configured) return null
  if (loading) {
    return <span className="text-xs text-ink-faint">…</span>
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <span
          className="hidden max-w-[12rem] truncate text-xs font-medium text-ink-soft sm:inline"
          title={user.email ?? undefined}
        >
          {user.email}
        </span>
        <button
          type="button"
          onClick={() => void signOut()}
          className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-ink-soft transition hover:bg-slate-100"
        >
          Sign out
        </button>
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <span className="hidden text-xs font-medium text-ink-faint sm:inline">
          Guest
        </span>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-lg bg-ink px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-ink-soft"
        >
          Sign in
        </button>
      </div>
      {open && <SignInDialog onClose={() => setOpen(false)} />}
    </>
  )
}

type Status =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'sent' }
  | { kind: 'error'; message: string }

function SignInDialog({ onClose }: { onClose: () => void }) {
  const { signInWithEmail } = useAuth()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>({ kind: 'idle' })

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || status.kind === 'sending') return
    setStatus({ kind: 'sending' })
    const { error } = await signInWithEmail(email.trim())
    setStatus(error ? { kind: 'error', message: error } : { kind: 'sent' })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Sign in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-surface p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink">Sign in</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm text-ink-faint hover:bg-slate-100"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <p className="mb-4 text-sm text-ink-faint">
          Sync your progress across devices. We'll email you a magic link — no
          password. Staying a guest keeps progress in this browser only.
        </p>

        {status.kind === 'sent' ? (
          <div className="rounded-xl border border-good bg-good-soft px-4 py-3 text-sm text-good">
            Check your inbox for the sign-in link.
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-ink outline-none focus:border-accent"
            />
            {status.kind === 'error' && (
              <p className="text-xs font-medium text-bad">{status.message}</p>
            )}
            <button
              type="submit"
              disabled={status.kind === 'sending' || !email}
              className="w-full rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white transition enabled:hover:bg-ink-soft disabled:opacity-40"
            >
              {status.kind === 'sending' ? 'Sending…' : 'Send magic link'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
