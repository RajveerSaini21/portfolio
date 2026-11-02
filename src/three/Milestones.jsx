import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Sparkles } from '@react-three/drei'
import { profile } from '../data/profile'
import { useScene } from './ctx'

/** Station 4 (z ~ -60): a lit pillar per internship, tallest = most recent. */
export function ExperiencePillars() {
  const { reduced } = useScene()
  const group = useRef()

  useFrame((_, delta) => {
    if (reduced || !group.current) return
    group.current.rotation.y += delta * 0.07
  })

  return (
    <group position={[0, -1, -60]} ref={group}>
      {profile.experience.map((job, i) => {
        const height = 4.6 - i * 1.1
        const x = i === 0 ? -2.4 : 2.4
        return (
          <group key={job.company} position={[x, 0, 0]}>
            <mesh position={[0, height / 2, 0]}>
              <cylinderGeometry args={[0.5, 0.5, height, 6, 1, true]} />
              <meshStandardMaterial
                color={job.accent}
                emissive={job.accent}
                emissiveIntensity={0.4}
                roughness={0.3}
                metalness={0.7}
                transparent
                opacity={0.5}
                side={2}
              />
            </mesh>
            <mesh position={[0, height + 0.35, 0]}>
              <sphereGeometry args={[0.34, 24, 24]} />
              <meshStandardMaterial
                color={job.accent}
                emissive={job.accent}
                emissiveIntensity={1.8}
              />
            </mesh>
            <pointLight
              position={[0, height + 0.35, 0]}
              intensity={14}
              color={job.accent}
              distance={16}
            />
          </group>
        )
      })}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.4, 3.55, 96]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.35} />
      </mesh>
    </group>
  )
}

/** Station 6 (z ~ -106): a crystal per award. */
export function AchievementCrystals() {
  const { reduced, tier } = useScene()
  const group = useRef()

  useFrame((_, delta) => {
    if (reduced || !group.current) return
    group.current.rotation.y -= delta * 0.12
  })

  return (
    <group position={[0, 0, -106]} ref={group}>
      {profile.achievements.map((_, i) => {
        const angle = (i / profile.achievements.length) * Math.PI * 2
        const r = 3.2
        return (
          <Float
            key={i}
            speed={reduced ? 0 : 1.5}
            rotationIntensity={0.8}
            floatIntensity={1.2}
          >
            <mesh
              position={[Math.cos(angle) * r, Math.sin(angle * 1.5) * 0.9, Math.sin(angle) * r]}
            >
              <icosahedronGeometry args={[0.62, 0]} />
              <meshStandardMaterial
                color="#fbbf24"
                emissive="#fbbf24"
                emissiveIntensity={0.7}
                roughness={0.15}
                metalness={0.85}
                flatShading
              />
            </mesh>
          </Float>
        )
      })}
      <Sparkles
        count={tier === 'low' ? 12 : 24}
        scale={[8, 5, 8]}
        size={2}
        speed={reduced ? 0 : 0.3}
        color="#fde68a"
        opacity={0.7}
      />
      <pointLight intensity={22} color="#fbbf24" distance={22} />
    </group>
  )
}

/** Station 7 (z ~ -124): the portal the flight ends on. */
export function ContactPortal() {
  const { reduced, tier } = useScene()
  const outer = useRef()
  const inner = useRef()

  useFrame((_, delta) => {
    if (reduced) return
    if (outer.current) outer.current.rotation.z += delta * 0.18
    if (inner.current) inner.current.rotation.z -= delta * 0.3
  })

  return (
    <group position={[0, 0, -124]}>
      <mesh ref={outer}>
        <torusGeometry args={[3.4, 0.045, 12, 160]} />
        <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.6} />
      </mesh>
      <mesh ref={inner}>
        <torusGeometry args={[2.6, 0.025, 10, 140]} />
        <meshStandardMaterial color="#a78bfa" emissive="#a78bfa" emissiveIntensity={1.4} />
      </mesh>
      <mesh>
        <circleGeometry args={[2.55, 64]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.07} />
      </mesh>
      <Sparkles
        count={tier === 'low' ? 14 : 30}
        scale={[7, 7, 3]}
        size={2.2}
        speed={reduced ? 0 : 0.4}
        color="#bae6fd"
        opacity={0.8}
      />
      <pointLight intensity={26} color="#38bdf8" distance={26} />
    </group>
  )
}
