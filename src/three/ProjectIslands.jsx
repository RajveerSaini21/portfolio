import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Sparkles } from '@react-three/drei'
import { profile } from '../data/profile'
import { useScene } from './ctx'

// Each project gets its own silhouette and slot along the corridor, so they
// stay distinguishable as the camera passes through the cluster.
const LAYOUT = [
  { position: [-5.6, -0.3, -82], scale: 1 },
  { position: [0.4, 0.9, -89], scale: 1.08 },
  { position: [5.8, -0.5, -84], scale: 0.92 },
]

function Shape({ kind }) {
  if (kind === 'knot') return <torusKnotGeometry args={[0.95, 0.3, 128, 20]} />
  if (kind === 'octa') return <octahedronGeometry args={[1.35, 0]} />
  return <icosahedronGeometry args={[1.25, 0]} />
}

function Island({ project, layout }) {
  const { reduced, tier } = useScene()
  const core = useRef()

  useFrame((_, delta) => {
    if (reduced || !core.current) return
    core.current.rotation.y += delta * 0.3
    core.current.rotation.x += delta * 0.1
  })

  return (
    <group position={layout.position} scale={layout.scale}>
      <Float speed={reduced ? 0 : 1.1} rotationIntensity={0.3} floatIntensity={0.9}>
        <mesh ref={core}>
          <Shape kind={project.shape} />
          <meshStandardMaterial
            color={project.accent}
            emissive={project.accent}
            emissiveIntensity={0.55}
            roughness={0.24}
            metalness={0.8}
          />
        </mesh>
      </Float>

      {/* Platform ring, so each shape reads as anchored rather than adrift. */}
      <mesh position={[0, -1.7, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.9, 0.02, 8, 96]} />
        <meshBasicMaterial color={project.accent} transparent opacity={0.55} />
      </mesh>
      <mesh position={[0, -1.7, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.9, 48]} />
        <meshBasicMaterial color={project.accent} transparent opacity={0.06} />
      </mesh>

      <Sparkles
        count={Math.round(BUDGET_SPARKLES[tier] * 0.6)}
        scale={[4, 4, 4]}
        size={1.8}
        speed={reduced ? 0 : 0.25}
        color={project.accent}
        opacity={0.6}
      />
      <pointLight intensity={12} color={project.accent} distance={12} />
    </group>
  )
}

// Local copy of the sparkle budget keeps this file independent of ctx internals.
const BUDGET_SPARKLES = { low: 10, medium: 18, high: 26 }

/** Station 5 (z ~ -82 to -89): one floating island per project. */
export default function ProjectIslands() {
  return (
    <group>
      {profile.projects.slice(0, LAYOUT.length).map((project, i) => (
        <Island key={project.name} project={project} layout={LAYOUT[i]} />
      ))}
    </group>
  )
}
