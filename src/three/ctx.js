import { createContext, useContext } from 'react'

/**
 * Scene-wide render settings, resolved once at the Canvas boundary.
 * `reduced` mirrors prefers-reduced-motion; `tier` is the device capability
 * guess that scales particle counts.
 */
export const SceneCtx = createContext({ reduced: false, tier: 'high' })
export const useScene = () => useContext(SceneCtx)

/** Particle budgets per quality tier. */
export const BUDGET = {
  low: { stars: 1400, sparkles: 12 },
  medium: { stars: 3200, sparkles: 22 },
  high: { stars: 5200, sparkles: 32 },
}
