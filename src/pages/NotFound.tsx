import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <p className="text-5xl" aria-hidden>
        🧭
      </p>
      <h1 className="mt-4 text-2xl font-bold text-ink">Nothing here yet</h1>
      <p className="mt-2 text-ink-soft">
        This content hasn’t been built yet, or the link is wrong.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-strong"
      >
        Back to start
      </Link>
    </div>
  )
}
