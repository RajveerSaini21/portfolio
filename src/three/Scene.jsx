import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { AdaptiveDpr, Preload } from '@react-three/drei'
import CameraRig from './CameraRig'
import Planets from './Planets'
import Spaceship from './Spaceship'
import { STATIONS } from '../data/stations'

/**
 * Widens the field of view on portrait screens.
 *
 * A phone's narrow aspect ratio crops the horizontal view, which would push the
 * wider stations (skills rings, project cluster) outside the frame. Trading FOV
 * for aspect keeps the same composition on every device.
 */
function ResponsiveFov() {
  const { camera, size } = useThree()
  useEffect(() => {
    const aspect = size.width / size.height
    camera.fov = aspect < 0.75 ? 78 : aspect < 1 ? 68 : 58
    camera.updateProjectionMatrix()
  }, [camera, size])
  return null
}

export default function Scene() {
  return (
    <>
      <ResponsiveFov />
      <CameraRig />

      {/* Fog hides where the corridor ends and fades distant stars into the
          background, which is what gives the flight a sense of depth. */}
      <fogExp2 attach="fog" args={['#05070f', 0.005]} />
      <ambientLight intensity={0.35} />
      <hemisphereLight args={['#38bdf8', '#0b1020', 0.3]} />
      {/* Directional "sun" light for realistic planet shading — positioned
          off to the side so the lit hemisphere faces the camera path. */}
      <directionalLight
        position={[20, 10, 20]}
        intensity={2.5}
        color="#fff5e0"
      />

      <Planets />
      <Spaceship />

      {/* Compile shaders up front so the first scroll doesn't stutter. */}
      <Preload all />
      {/* Drop resolution instead of frame rate when the GPU struggles. */}
      <AdaptiveDpr pixelated />
    </>
  )
}

export { STATIONS }
