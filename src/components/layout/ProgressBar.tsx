/** A thin reusable progress bar. `value` is 0..1. */
export function ProgressBar({
  value,
  className = '',
  tone = 'brand',
}: {
  value: number
  className?: string
  tone?: 'brand' | 'good' | 'accent'
}) {
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100)
  const bar =
    tone === 'good' ? 'bg-good' : tone === 'accent' ? 'bg-accent' : 'bg-brand'
  return (
    <div
      className={`h-2 w-full overflow-hidden rounded-full bg-slate-200 ${className}`}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`h-full rounded-full ${bar} transition-all duration-500`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
