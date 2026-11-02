import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, BufferAttribute, Color } from 'three'
import { useScene } from './ctx'
import { BUDGET } from './ctx'

/**
 * Star haze filling the corridor the camera flies down.
 *
 * One draw call. Positions and per-vertex colors are generated once and never
 * touched again; the only per-frame work is a slow group rotation.
 */
export default function Starfield() {
  const { reduced, tier } = useScene()
  const count = BUDGET[tier].stars
  const group = useRef()

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const palette = [new Color('#7dd3fc'), new Color('#c4b5fd'), new Color('#ffffff')]

    for (let i = 0; i < count; i++) {
      // Hollow cylinder around the flight path: keeps stars out of the camera's
      // way while still filling the periphery.
      const angle = Math.random() * Math.PI * 2
      const radius = 14 + Math.random() * 46
      pos[i * 3] = Math.cos(angle) * radius
      pos[i * 3 + 1] = Math.sin(angle) * radius * 0.6
      pos[i * 3 + 2] = 20 - Math.random() * 170

      const c = palette[(Math.random() * palette.length) | 0]
      const shade = 0.45 + Math.random() * 0.55
      col[i * 3] = c.r * shade
      col[i * 3 + 1] = c.g * shade
      col[i * 3 + 2] = c.b * shade
    }
    return [pos, col]
  }, [count])

  useFrame((_, delta) => {
    if (reduced || !group.current) return
    group.current.rotation.z += delta * 0.008
  })

  return (
    <group ref={group}>
      <points frustumCulled={false}>
        <bufferGeometry>
          <primitive
            attach="attributes-position"
            object={new BufferAttribute(positions, 3)}
          />
          <primitive attach="attributes-color" object={new BufferAttribute(colors, 3)} />
        </bufferGeometry>
        <pointsMaterial
          size={0.14}
          sizeAttenuation
          vertexColors
          transparent
          opacity={0.9}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </points>
    </group>
  )
}
