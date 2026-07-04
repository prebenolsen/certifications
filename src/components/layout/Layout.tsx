import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { AuthMenu } from '@/components/auth/AuthMenu'

/** App shell: sticky header with brand + tagline, and a centered content column. */
export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-surface/85 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-brand text-lg">
              📈
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-sm font-extrabold text-ink">
                Certifications
              </span>
              <span className="block truncate text-[11px] font-medium text-ink-faint">
                Understand, don’t memorize
              </span>
            </span>
          </Link>
          <div className="flex flex-none items-center gap-4">
            {/* Tagline is desktop-only; phones just get brand + auth. */}
            <span className="hidden text-xs font-medium text-ink-faint lg:inline">
              Intuition first · terminology second · details last
            </span>
            <AuthMenu />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
      <footer className="mx-auto max-w-5xl px-4 pb-10 pt-4 text-center text-xs text-ink-faint">
        Built to teach the <em>why</em>, not just the answer.
      </footer>
    </div>
  )
}
