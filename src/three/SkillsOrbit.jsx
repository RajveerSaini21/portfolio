import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { profile } from '../data/profile'
import { useScene } from './ctx'

/**
 * Station 3 (z ~ -40): one ring per skill group, one sphere per skill.
 *
 * Sphere colors match the chips in the HTML panel, so the 3D and the text are
 * visibly the same data. Enhanced with pulsing effects and improved dynamics.
 */
export default function SkillsOrbit() {
  const { reduced } = useScene()
  const spin = useRef()
  const centerCore = useRef()

  const rings = useMemo(
    () =>
      profile.skillGroups.map((group, gi) => ({
        color: group.color,
        radius: 3.5 + gi * 1.6,
        // Alternate direction so neighbouring rings counter-rotate.
        dir: gi % 2 === 0 ? 1 : -1,
        tilt: (gi - 2) * 0.22,
        speed: 0.18 - gi * 0.02,
        nodes: group.items.map((_, ii) => {
          const angle = (ii / group.items.length) * Math.PI * 2
          return [angle, 0.18 + (ii % 3) * 0.04]
        }),
      })),
    [],
  )

  useFrame((state, delta) => {
    if (reduced || !spin.current) return
    const time = state.clock.getElapsedTime()

    spin.current.rotation.y += delta * 0.12

    // Center core pulsing
    if (centerCore.current) {
      const pulse = 1 + Math.sin(time * 1.2) * 0.08
      centerCore.current.scale.setScalar(pulse)
    }

    // Rings breathe slightly out of phase for a living, non-mechanical feel.
    spin.current.children.forEach((ring, i) => {
      if (ring.isGroup) {
        ring.rotation.z += delta * rings[i].speed * rings[i].dir
      }
    })
  })

  return (
    <group position={[0, 0, -40]} ref={spin}>
      {rings.map((ring, gi) => (
        <group key={gi} rotation={[Math.PI / 2 + ring.tilt, 0, 0]}>
          {/* Enhanced ring with glow */}
          <mesh>
            <torusGeometry args={[ring.radius, 0.012, 8, 160]} />
            <meshStandardMaterial
              color={ring.color}
              emissive={ring.color}
              emissiveIntensity={0.6}
              transparent
              opacity={0.4}
            />
          </mesh>

          {/* Skill nodes with enhanced materials */}
          {ring.nodes.map(([angle, size], ii) => (
            <mesh
              key={ii}
              position={[
                Math.cos(angle) * ring.radius,
                Math.sin(angle) * ring.radius,
                0,
              ]}
            >
              <sphereGeometry args={[size, 20, 20]} />
              <meshStandardMaterial
                color={ring.color}
                emissive={ring.color}
                emissiveIntensity={2.0}
                roughness={0.25}
                metalness={0.5}
              />
              <pointLight
                intensity={4}
                color={ring.color}
                distance={3}
                decay={2}
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* Enhanced center core */}
      <mesh ref={centerCore}>
        <sphereGeometry args={[1.2, 40, 40]} />
        <meshStandardMaterial
          color="#1e293b"
          emissive="#3b82f6"
          emissiveIntensity={0.8}
          roughness={0.15}
          metalness={0.95}
        />
      </mesh>

      <pointLight intensity={40} color="#ffffff" distance={35} decay={2} />
    </group>
  )
}
