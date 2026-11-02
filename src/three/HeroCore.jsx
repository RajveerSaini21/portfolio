import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Sparkles } from '@react-three/drei'
import { useScene, BUDGET } from './ctx'

/**
 * Station 1 (z ~ 0): the object behind the name.
 * A distorting core inside a wireframe shell, wrapped in slow gyroscope rings.
 * Enhanced with more dynamic animations and improved lighting.
 */
export default function HeroCore() {
  const { reduced, tier } = useScene()
  const rings = useRef()
  const shell = useRef()
  const glow = useRef()

  useFrame((state, delta) => {
    if (reduced) return
    const time = state.clock.getElapsedTime()

    if (rings.current) {
      rings.current.rotation.x += delta * 0.18
      rings.current.rotation.y += delta * 0.25
    }
    if (shell.current) {
      shell.current.rotation.y -= delta * 0.08
      shell.current.rotation.x += delta * 0.03
    }
    if (glow.current) {
      glow.current.rotation.z += delta * 0.15
      glow.current.scale.setScalar(1 + Math.sin(time * 0.5) * 0.08)
    }
  })

  return (
    <group position={[0, 0, 0]}>
      <Float speed={reduced ? 0 : 1.5} rotationIntensity={0.4} floatIntensity={0.9}>
        {/* Core sphere with distortion */}
        <mesh castShadow>
          <icosahedronGeometry args={[2.0, 16]} />
          <MeshDistortMaterial
            color="#1e40af"
            emissive="#3b82f6"
            emissiveIntensity={0.6}
            roughness={0.2}
            metalness={0.8}
            distort={reduced ? 0 : 0.42}
            speed={2.0}
          />
        </mesh>

        {/* Wireframe shell */}
        <mesh ref={shell}>
          <icosahedronGeometry args={[2.7, 2]} />
          <meshBasicMaterial color="#60a5fa" wireframe transparent opacity={0.28} />
        </mesh>

        {/* Outer glow ring */}
        <mesh ref={glow} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[3.2, 0.02, 8, 64]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.6} />
        </mesh>
      </Float>

      {/* Gyroscope rings */}
      <group ref={rings}>
        {[
          { r: 4.0, rot: [Math.PI / 2.1, 0, 0], color: '#3b82f6', opacity: 0.55 },
          { r: 4.9, rot: [Math.PI / 3, Math.PI / 4, 0], color: '#8b5cf6', opacity: 0.5 },
          { r: 5.8, rot: [Math.PI / 1.7, -Math.PI / 5, 0], color: '#ec4899', opacity: 0.45 },
        ].map((ring, i) => (
          <mesh key={i} rotation={ring.rot}>
            <torusGeometry args={[ring.r, 0.018, 10, 180]} />
            <meshStandardMaterial
              color={ring.color}
              emissive={ring.color}
              emissiveIntensity={0.4}
              transparent
              opacity={ring.opacity}
            />
          </mesh>
        ))}
      </group>

      <Sparkles
        count={BUDGET[tier].sparkles * 1.3}
        scale={[13, 9, 9]}
        size={3.0}
        speed={reduced ? 0 : 0.4}
        color="#bfdbfe"
        opacity={0.8}
      />

      {/* Enhanced lighting */}
      <pointLight position={[4, 3, 5]} intensity={35} color="#3b82f6" distance={28} decay={2} />
      <pointLight position={[-5, -3, 4]} intensity={25} color="#8b5cf6" distance={28} decay={2} />
      <pointLight position={[0, 5, -2]} intensity={20} color="#ec4899" distance={24} decay={2} />
    </group>
  )
}
