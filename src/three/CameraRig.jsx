import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { CatmullRomCurve3, Vector3, MathUtils } from 'three'
import { STATIONS } from '../data/stations'
import { view } from '../lib/store'
import { useScene } from './ctx'

/**
 * Drives the camera along one continuous path as the user scrolls.
 *
 * Two splines are built from STATIONS: one for the camera position and one for
 * the look-at target. Sampling both at the same scroll `t` keeps the camera
 * aimed at the right subject while it moves, which is what makes the whole
 * page read as a single flight rather than seven separate scenes.
 */
export default function CameraRig() {
  const camera = useThree((s) => s.camera)
  const { reduced } = useScene()

  const [path, aim] = useMemo(
    () => [
      new CatmullRomCurve3(STATIONS.map((s) => new Vector3(...s.camera))),
      new CatmullRomCurve3(STATIONS.map((s) => new Vector3(...s.target))),
    ],
    [],
  )

  // Scratch vectors, reused every frame so the loop allocates nothing.
  const pos = useRef(new Vector3(...STATIONS[0].camera))
  const look = useRef(new Vector3(...STATIONS[0].target))
  const tmpPos = useRef(new Vector3())
  const tmpLook = useRef(new Vector3())

  useFrame((_, delta) => {
    const t = MathUtils.clamp(view.progress, 0, 1)
    path.getPoint(t, tmpPos.current)
    aim.getPoint(t, tmpLook.current)

    if (reduced) {
      // No parallax, no easing: land exactly on the path.
      pos.current.copy(tmpPos.current)
      look.current.copy(tmpLook.current)
    } else {
      // Mouse parallax, scaled small so it reads as a subtle head-turn.
      tmpPos.current.x += view.pointerX * 1.1
      tmpPos.current.y += -view.pointerY * 0.7

      // Frame-rate independent damping: same feel at 60 and 144 Hz.
      const a = 1 - Math.exp(-6 * delta)
      pos.current.lerp(tmpPos.current, a)
      look.current.lerp(tmpLook.current, a)
    }

    camera.position.copy(pos.current)
    camera.lookAt(look.current)
  })

  return null
}
