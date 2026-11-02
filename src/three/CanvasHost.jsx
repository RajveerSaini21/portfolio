import { Component, Suspense, lazy } from 'react'
import { Canvas } from '@react-three/fiber'
import { SceneCtx } from './ctx'
import { useReducedMotion, useQuality } from '../lib/hooks'

const Scene = lazy(() => import('./Scene'))

/**
 * If WebGL is unavailable or the scene throws, the canvas is dropped and the
 * page falls back to its background. All real content lives in the HTML
 * overlay, so the portfolio stays fully readable either way.
 */
class GlBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(error) {
    console.error('3D scene disabled:', error)
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

export default function CanvasHost() {
  const reduced = useReducedMotion()
  const tier = useQuality()

  return (
    <div
      className="fixed inset-0 z-0"
      // Decorative: every fact it depicts is also in the DOM overlay.
      aria-hidden="true"
    >
      <GlBoundary>
        <Canvas
          // Cap DPR: retina phones would otherwise render 3x the pixels for no
          // visible gain on a scene this soft.
          dpr={tier === 'low' ? [1, 1.4] : [1, 1.9]}
          gl={{
            antialias: tier !== 'low',
            powerPreference: 'high-performance',
            alpha: false,
          }}
          camera={{ position: [0, 0, 14], fov: 58, near: 0.1, far: 320 }}
          // Pointer events belong to the HTML above; never swallow a click.
          style={{ pointerEvents: 'none' }}
          frameloop="always"
        >
          <color attach="background" args={['#05070f']} />
          <SceneCtx.Provider value={{ reduced, tier }}>
            <Suspense fallback={null}>
              <Scene />
            </Suspense>
          </SceneCtx.Provider>
        </Canvas>
      </GlBoundary>
    </div>
  )
}
