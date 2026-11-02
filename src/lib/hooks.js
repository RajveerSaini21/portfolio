import { useEffect, useState } from 'react'
import { view, activeSection } from './store'

/**
 * Feeds document scroll and pointer position into the module store.
 *
 * Deliberately does not call setState, so scrolling never re-renders React.
 * The 3D scene samples `view` inside its animation loop instead.
 */
export function useViewTracking(sectionCount) {
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      view.progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      activeSection.index = Math.min(
        sectionCount - 1,
        Math.round(view.progress * (sectionCount - 1)),
      )
    }

    const onPointerMove = (e) => {
      view.pointerX = (e.clientX / window.innerWidth) * 2 - 1
      view.pointerY = (e.clientY / window.innerHeight) * 2 - 1
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.removeEventListener('pointermove', onPointerMove)
    }
  }, [sectionCount])
}

/** Tracks which section is in view, for nav highlighting. Throttled to rAF. */
export function useActiveSection() {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    let raf = 0
    const tick = () => {
      setIndex((prev) => (prev === activeSection.index ? prev : activeSection.index))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])
  return index
}

/** Respects the OS "reduce motion" setting, and reacts if it changes live. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}

/**
 * Cheap device capability guess, used to scale particle counts and DPR.
 * Phones and low-core machines get a lighter scene so the frame rate holds.
 */
export function useQuality() {
  const [tier] = useState(() => {
    if (typeof window === 'undefined') return 'high'
    const cores = navigator.hardwareConcurrency || 4
    const narrow = window.innerWidth < 768
    if (narrow || cores <= 4) return 'low'
    if (cores <= 8) return 'medium'
    return 'high'
  })
  return tier
}
