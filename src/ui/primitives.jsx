import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useReducedMotion } from '../lib/hooks'

/** Fade-and-rise on first scroll into view. A no-op under reduce-motion. */
export function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-12% 0px -12% 0px' })
  const reduced = useReducedMotion()

  if (reduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    )
  }
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 26 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

/**
 * Full-height scroll station.
 *
 * Height is what couples the DOM to the camera: each section is one viewport
 * tall, so scrolling past one section advances the camera one station.
 */
export function Section({ id, label, children, className = '' }) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={`relative flex min-h-svh w-full items-center px-4 py-24 sm:px-6 ${className}`}
    >
      <div className="mx-auto w-full max-w-6xl">
        <span className="sr-only" id={`${id}-heading`}>
          {label}
        </span>
        {children}
      </div>
    </section>
  )
}

/** Small caps section marker. */
export function Eyebrow({ children }) {
  return (
    <p className="font-display mb-3 text-xs font-semibold tracking-[0.22em] text-sky-400 uppercase">
      {children}
    </p>
  )
}

/** Visible section title. Pairs with Section's screen-reader label. */
export function Title({ children }) {
  return (
    <h2 className="font-display mb-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
      {children}
    </h2>
  )
}
