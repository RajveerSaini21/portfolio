import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3, CatmullRomCurve3 } from 'three'
import { view } from '../lib/store'
import { useScene } from './ctx'
import { STATIONS } from '../data/stations'

/**
 * Minimal futuristic spacecraft silhouette.
 * Follows behind and slightly below the camera, banking gently
 * as the camera turns through the corridor.
 */
export default function Spaceship() {
  const { reduced } = useScene()
  const groupRef = useRef()
  const engineRef = useRef()
  const trailRef = useRef()

  const cameraPath = useMemo(
    () => new CatmullRomCurve3(STATIONS.map((s) => new Vector3(...s.camera))),
    [],
  )

  const trailPoints = useMemo(() => {
    const pts = []
    for (let i = 0; i <= 60; i++) {
      pts.push(new Vector3(0, 0, i * 0.3))
    }
    return pts
  }, [])

  useFrame((state, delta) => {
    if (reduced || !groupRef.current) return

    const t = view.progress
    const pos = new Vector3()
    cameraPath.getPoint(t, pos)

    // Ship follows behind the camera
    const lookT = Math.min(1, t + 0.008)
    const lookPos = new Vector3()
    cameraPath.getPoint(lookT, lookPos)

    const dir = new Vector3().subVectors(lookPos, pos).normalize()

    // Position: slightly below and behind camera
    const shipPos = pos.clone()
      .addScaledVector(dir, -3.5)
    shipPos.y -= 1.8

    // Bank angle based on horizontal camera movement
    const bankAngle = -view.pointerX * 0.15

    groupRef.current.position.copy(shipPos)
    groupRef.current.lookAt(lookPos.x, lookPos.y - 1, lookPos.z)
    groupRef.current.rotation.z += bankAngle

    // Engine glow pulse
    if (engineRef.current) {
      const pulse = 1 + Math.sin(state.clock.getElapsedTime() * 4) * 0.2
      engineRef.current.intensity = 15 * pulse
    }
  })

  return (
    <group ref={groupRef}>
      {/* Main hull — elongated diamond shape */}
      <mesh>
        <coneGeometry args={[0.15, 1.2, 4]} />
        <meshPhysicalMaterial
          color="#c0c8d8"
          metalness={0.8}
          roughness={0.15}
          clearcoat={0.9}
          clearcoatRoughness={0.05}
        />
      </mesh>

      {/* Nose cone — pointed forward */}
      <mesh position={[0, 0, -0.7]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.08, 0.5, 4]} />
        <meshPhysicalMaterial
          color="#e0e4ec"
          metalness={0.85}
          roughness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.05}
        />
      </mesh>

      {/* Left wing */}
      <mesh position={[-0.25, 0, 0.1]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.4, 0.03, 0.5]} />
        <meshPhysicalMaterial
          color="#8090a8"
          metalness={0.7}
          roughness={0.2}
          clearcoat={0.6}
        />
      </mesh>

      {/* Right wing */}
      <mesh position={[0.25, 0, 0.1]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.4, 0.03, 0.5]} />
        <meshPhysicalMaterial
          color="#8090a8"
          metalness={0.7}
          roughness={0.2}
          clearcoat={0.6}
        />
      </mesh>

      {/* Cockpit — small dome */}
      <mesh position={[0, 0.08, -0.2]}>
        <sphereGeometry args={[0.08, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial
          color="#4488cc"
          metalness={0.3}
          roughness={0.05}
          clearcoat={1}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Engine glow */}
      <mesh position={[0, 0, 0.65]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial
          color="#3b82f6"
          toneMapped={false}
        />
      </mesh>

      {/* Engine point light */}
      <pointLight
        ref={engineRef}
        position={[0, 0, 0.7]}
        intensity={15}
        color="#3b82f6"
        distance={8}
        decay={2}
      />

      {/* Navigation light — red left */}
      <mesh position={[-0.28, 0, 0.1]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial color="#ff3333" toneMapped={false} />
      </mesh>

      {/* Navigation light — green right */}
      <mesh position={[0.28, 0, 0.1]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial color="#33ff33" toneMapped={false} />
      </mesh>
    </group>
  )
}
