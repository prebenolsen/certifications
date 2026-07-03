import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Card, Lesson } from '@/types/content'
import { CardView } from '@/components/cards/registry'
import { useProgress } from '@/context/ProgressContext'

/**
 * The vertical, one-card-at-a-time player — our "learning flow".
 *
 * Cards are stacked in a scroll-snap container so exactly one is centered at a
 * time. We track the active card with an IntersectionObserver (to mark it
 * viewed and drive the progress bar) and offer keyboard + button navigation.
 */
export function CardPlayer({
  certId,
  lesson,
  onExit,
  next,
}: {
  certId: string
  lesson: Lesson
  onExit: () => void
  /** The lesson to continue with after this one, if any. */
  next?: { title: string; onGo: () => void }
}) {
  const { markCardViewed, recordAnswer, markCompleted } = useProgress()
  const scrollerRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const [activeIndex, setActiveIndex] = useState(0)

  const total = lesson.cards.length

  // Mark the first card viewed on mount.
  useEffect(() => {
    if (lesson.cards[0]) markCardViewed(certId, lesson.id, lesson.cards[0].id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [certId, lesson.id])

  // Track which card is centered: the one whose midpoint is nearest the
  // scroller's midpoint. Scroll-driven rather than an IntersectionObserver
  // visibility threshold, because cards taller than the viewport can never
  // reach a ratio like 60% visible — they'd never register as viewed.
  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return

    const update = () => {
      const rect = scroller.getBoundingClientRect()
      const mid = rect.top + rect.height / 2
      let best = 0
      let bestDist = Infinity
      cardRefs.current.forEach((el, i) => {
        if (!el) return
        const r = el.getBoundingClientRect()
        const dist = Math.abs(r.top + r.height / 2 - mid)
        if (dist < bestDist) {
          bestDist = dist
          best = i
        }
      })
      setActiveIndex(best)
      const card = lesson.cards[best]
      if (card) markCardViewed(certId, lesson.id, card.id)
      if (best === total - 1) markCompleted(certId, lesson.id)
    }

    // Trailing throttle (setTimeout rather than rAF: rAF is paused in
    // hidden/background tabs, which would freeze progress tracking there).
    let timer: number | undefined
    const onScroll = () => {
      if (timer !== undefined) return
      timer = window.setTimeout(() => {
        timer = undefined
        update()
      }, 100)
    }

    update()
    scroller.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      scroller.removeEventListener('scroll', onScroll)
      if (timer !== undefined) window.clearTimeout(timer)
    }
  }, [certId, lesson, total, markCardViewed, markCompleted])

  const scrollToIndex = useCallback((idx: number) => {
    const el = cardRefs.current[idx]
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [])

  const goNext = useCallback(
    () => scrollToIndex(Math.min(activeIndex + 1, total - 1)),
    [activeIndex, total, scrollToIndex],
  )
  const goPrev = useCallback(
    () => scrollToIndex(Math.max(activeIndex - 1, 0)),
    [activeIndex, scrollToIndex],
  )

  // Keyboard navigation.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault()
        goNext()
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault()
        goPrev()
      } else if (e.key === 'Escape') {
        onExit()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goNext, goPrev, onExit])

  const handleAnswered = useMemo(
    () => (card: Card) => (correct: boolean) =>
      recordAnswer(certId, lesson.id, card.id, correct),
    [certId, lesson.id, recordAnswer],
  )

  const progressPct = total > 0 ? ((activeIndex + 1) / total) * 100 : 0
  const isLast = activeIndex === total - 1

  return (
    <div className="fixed inset-0 z-30 flex flex-col bg-surface-sunken">
      {/* Top bar: progress + exit */}
      <header className="flex items-center gap-4 border-b border-slate-200 bg-surface/80 px-4 py-3 backdrop-blur">
        <button
          type="button"
          onClick={onExit}
          className="flex-none rounded-lg px-2 py-1 text-sm font-medium text-ink-soft hover:bg-slate-100"
          aria-label="Exit lesson"
        >
          ✕ Exit
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ink">{lesson.title}</p>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-brand transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
        <span className="flex-none text-sm tabular-nums text-ink-faint">
          {activeIndex + 1} / {total}
        </span>
      </header>

      {/* Card scroller */}
      <div
        ref={scrollerRef}
        className="card-scroller flex-1 overflow-y-auto"
        tabIndex={0}
      >
        {lesson.cards.map((card, i) => (
          <div
            key={card.id}
            data-index={i}
            ref={(el) => {
              cardRefs.current[i] = el
            }}
            className="card-snap flex min-h-full items-center justify-center px-4 py-8"
          >
            <CardView card={card} onAnswered={handleAnswered(card)} />
          </div>
        ))}
      </div>

      {/* Bottom nav */}
      <footer className="flex items-center justify-between gap-3 border-t border-slate-200 bg-surface/80 px-4 py-3 backdrop-blur">
        <button
          type="button"
          onClick={goPrev}
          disabled={activeIndex === 0}
          className="rounded-xl px-4 py-2 text-sm font-medium text-ink-soft transition enabled:hover:bg-slate-100 disabled:opacity-40"
        >
          ↑ Previous
        </button>
        <span className="hidden text-xs text-ink-faint sm:block">
          Use <span className="kbd">↑</span> <span className="kbd">↓</span> to navigate
        </span>
        {isLast ? (
          next ? (
            <button
              type="button"
              onClick={next.onGo}
              title={next.title}
              className="rounded-xl bg-good px-5 py-2 text-sm font-semibold text-white transition hover:brightness-95"
            >
              Next lesson →
            </button>
          ) : (
            <button
              type="button"
              onClick={onExit}
              className="rounded-xl bg-good px-5 py-2 text-sm font-semibold text-white transition hover:brightness-95"
            >
              Finish ✓
            </button>
          )
        ) : (
          <button
            type="button"
            onClick={goNext}
            className="rounded-xl bg-brand px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-strong"
          >
            Next ↓
          </button>
        )}
      </footer>
    </div>
  )
}
