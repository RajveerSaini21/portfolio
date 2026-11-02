import { useMemo, useRef, useState, useCallback } from 'react'
import { useFrame, useThree, useLoader } from '@react-three/fiber'
import { Float, Sparkles, Html, Line } from '@react-three/drei'
import {
  AdditiveBlending,
  BufferAttribute,
  CanvasTexture,
  Color,
  DoubleSide,
  RingGeometry,
  Vector3,
  CatmullRomCurve3,
} from 'three'
import { useScene, BUDGET } from './ctx'

/* ================================================================== */
/*  Shared utilities                                                    */
/* ================================================================== */

function createCanvas(w, h) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  return { canvas: c, ctx: c.getContext('2d') }
}

/* ================================================================== */
/*  Starfield — multi-layer depth                                       */
/* ================================================================== */

function Starfield() {
  const { reduced, tier } = useScene()
  const count = BUDGET[tier].stars
  const group = useRef()
  const group2 = useRef()

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const palette = [new Color('#7dd3fc'), new Color('#c4b5fd'), new Color('#ffffff')]
    for (let i = 0; i < count; i++) {
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

  // Layer 2: nearby stars that drift
  const [nearPositions] = useMemo(() => {
    const pos = new Float32Array(800 * 3)
    for (let i = 0; i < 800; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 8 + Math.random() * 25
      pos[i * 3] = Math.cos(angle) * radius
      pos[i * 3 + 1] = Math.sin(angle) * radius * 0.5
      pos[i * 3 + 2] = 15 - Math.random() * 160
    }
    return [pos]
  }, [])

  useFrame((_, delta) => {
    if (reduced) return
    if (group.current) group.current.rotation.z += delta * 0.008
    if (group2.current) group2.current.rotation.z -= delta * 0.003
  })

  return (
    <>
      {/* Layer 1: distant static stars */}
      <group ref={group}>
        <points frustumCulled={false}>
          <bufferGeometry>
            <primitive attach="attributes-position" object={new BufferAttribute(positions, 3)} />
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
      {/* Layer 2: nearby stars moving opposite */}
      <group ref={group2}>
        <points frustumCulled={false}>
          <bufferGeometry>
            <primitive attach="attributes-position" object={new BufferAttribute(nearPositions, 3)} />
          </bufferGeometry>
          <pointsMaterial
            size={0.08}
            sizeAttenuation
            color="#ffffff"
            transparent
            opacity={0.5}
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </points>
      </group>
    </>
  )
}

/* ================================================================== */
/*  Nebula clouds — depth layer                                         */
/* ================================================================== */

function NebulaClouds() {
  const { reduced } = useScene()

  const clouds = useMemo(() => [
    { pos: [15, 8, -10], color: '#3b1f8e', scale: 12, opacity: 0.03 },
    { pos: [-18, -6, -35], color: '#1e3a5f', scale: 15, opacity: 0.025 },
    { pos: [10, 10, -65], color: '#5b2d8e', scale: 10, opacity: 0.03 },
    { pos: [-14, 4, -90], color: '#1a3366', scale: 14, opacity: 0.02 },
    { pos: [8, -8, -120], color: '#4a2080', scale: 11, opacity: 0.025 },
  ], [])

  return (
    <>
      {clouds.map((c, i) => (
        <mesh key={i} position={c.pos}>
          <sphereGeometry args={[c.scale, 16, 16]} />
          <meshBasicMaterial
            color={c.color}
            transparent
            opacity={c.opacity}
            side={DoubleSide}
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </mesh>
      ))}
    </>
  )
}

/* ================================================================== */
/*  Shooting stars                                                      */
/* ================================================================== */

function ShootingStars() {
  const { reduced } = useScene()
  const starsRef = useRef([])

  const stars = useMemo(() => {
    return Array.from({ length: 5 }, () => ({
      active: false,
      progress: 0,
      speed: 0,
      startPos: new Vector3(),
      endPos: new Vector3(),
    }))
  }, [])

  useFrame((_, delta) => {
    if (reduced) return

    stars.forEach((star) => {
      if (!star.active && Math.random() < 0.002) {
        star.active = true
        star.progress = 0
        star.speed = 0.8 + Math.random() * 0.6
        const angle = Math.random() * Math.PI * 2
        const r = 15 + Math.random() * 20
        const z = 10 - Math.random() * 140
        star.startPos.set(
          Math.cos(angle) * r,
          Math.sin(angle) * r * 0.6 + 5,
          z,
        )
        star.endPos.set(
          star.startPos.x + (Math.random() - 0.5) * 30,
          star.startPos.y - 8 - Math.random() * 10,
          star.startPos.z - 15 - Math.random() * 10,
        )
      }

      if (star.active) {
        star.progress += delta * star.speed
        if (star.progress >= 1) {
          star.active = false
        }
      }
    })
  })

  return (
    <>
      {stars.map((star, i) => {
        if (!star.active || star.progress < 0.01) return null
        const head = new Vector3().lerpVectors(star.startPos, star.endPos, star.progress)
        const tailProgress = Math.max(0, star.progress - 0.15)
        const tail = new Vector3().lerpVectors(star.startPos, star.endPos, tailProgress)
        const opacity = star.progress < 0.5
          ? star.progress * 2
          : 2 - star.progress * 2
        return (
          <Line
            key={i}
            points={[tail, head]}
            color="#ffffff"
            lineWidth={2}
            transparent
            opacity={opacity * 0.8}
          />
        )
      })}
    </>
  )
}

/* ================================================================== */
/*  Procedural canvas textures                                         */
/* ================================================================== */

function mercuryTexture() {
  const { canvas, ctx } = createCanvas(512, 256)
  ctx.fillStyle = '#8a7e6d'
  ctx.fillRect(0, 0, 512, 256)
  for (let i = 0; i < 200; i++) {
    const x = Math.random() * 512
    const y = Math.random() * 256
    const r = 1 + Math.random() * 8
    const shade = 50 + Math.random() * 60
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fillStyle = `rgb(${shade + 50},${shade + 40},${shade + 30})`
    ctx.fill()
    ctx.beginPath()
    ctx.arc(x, y, r + 1, 0, Math.PI * 2)
    ctx.strokeStyle = `rgba(0,0,0,${0.1 + Math.random() * 0.2})`
    ctx.lineWidth = 0.5
    ctx.stroke()
  }
  for (let i = 0; i < 15; i++) {
    const x = Math.random() * 512
    const y = Math.random() * 256
    const r = 15 + Math.random() * 30
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r)
    grad.addColorStop(0, 'rgba(60,50,40,0.3)')
    grad.addColorStop(1, 'rgba(60,50,40,0)')
    ctx.fillStyle = grad
    ctx.fillRect(x - r, y - r, r * 2, r * 2)
  }
  return new CanvasTexture(canvas)
}

function venusTexture() {
  const { canvas, ctx } = createCanvas(512, 256)
  const grad = ctx.createLinearGradient(0, 0, 512, 256)
  grad.addColorStop(0, '#e8cda0')
  grad.addColorStop(0.5, '#f0dbb8')
  grad.addColorStop(1, '#d4b88a')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 512, 256)
  for (let i = 0; i < 40; i++) {
    const y = Math.random() * 256
    const h = 3 + Math.random() * 12
    ctx.fillStyle = `rgba(255,245,220,${0.1 + Math.random() * 0.2})`
    ctx.fillRect(0, y, 512, h)
  }
  for (let i = 0; i < 30; i++) {
    const x = Math.random() * 512
    const y = Math.random() * 256
    const r = 10 + Math.random() * 25
    const grad2 = ctx.createRadialGradient(x, y, 0, x, y, r)
    grad2.addColorStop(0, 'rgba(255,230,180,0.25)')
    grad2.addColorStop(1, 'rgba(255,230,180,0)')
    ctx.fillStyle = grad2
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }
  return new CanvasTexture(canvas)
}

function earthTexture() {
  const { canvas, ctx } = createCanvas(1024, 512)
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, 512)
  oceanGrad.addColorStop(0, '#1a3a5c')
  oceanGrad.addColorStop(0.15, '#1e5580')
  oceanGrad.addColorStop(0.5, '#2266aa')
  oceanGrad.addColorStop(0.85, '#1e5580')
  oceanGrad.addColorStop(1, '#1a3a5c')
  ctx.fillStyle = oceanGrad
  ctx.fillRect(0, 0, 1024, 512)
  ctx.fillStyle = 'rgba(220,235,245,0.6)'
  ctx.fillRect(0, 0, 1024, 30)
  ctx.fillRect(0, 482, 1024, 30)
  const continents = [
    { x: 520, y: 120, w: 60, h: 120, color: '#3a7a3a' },
    { x: 530, y: 80, w: 40, h: 50, color: '#4a8a4a' },
    { x: 220, y: 60, w: 50, h: 80, color: '#3a7a3a' },
    { x: 230, y: 160, w: 40, h: 100, color: '#2a6a2a' },
    { x: 210, y: 270, w: 45, h: 90, color: '#4a8a4a' },
    { x: 620, y: 70, w: 120, h: 80, color: '#4a8a4a' },
    { x: 700, y: 150, w: 60, h: 60, color: '#3a7a3a' },
    { x: 780, y: 250, w: 45, h: 35, color: '#8a6a3a' },
  ]
  continents.forEach((c) => {
    ctx.fillStyle = c.color
    ctx.beginPath()
    const points = []
    const steps = 20
    for (let i = 0; i <= steps; i++) {
      const angle = (i / steps) * Math.PI * 2
      const rx = (c.w / 2) * (0.7 + Math.random() * 0.3)
      const ry = (c.h / 2) * (0.7 + Math.random() * 0.3)
      points.push([c.x + Math.cos(angle) * rx, c.y + Math.sin(angle) * ry])
    }
    ctx.moveTo(points[0][0], points[0][1])
    for (let i = 1; i < points.length; i++) {
      const xc = (points[i][0] + points[i - 1][0]) / 2
      const yc = (points[i][1] + points[i - 1][1]) / 2
      ctx.quadraticCurveTo(points[i - 1][0], points[i - 1][1], xc, yc)
    }
    ctx.closePath()
    ctx.fill()
    ctx.fillStyle = 'rgba(160,130,80,0.3)'
    ctx.fill()
  })
  for (let i = 0; i < 25; i++) {
    const x = Math.random() * 1024
    const y = Math.random() * 512
    ctx.fillStyle = `rgba(255,255,255,${0.05 + Math.random() * 0.1})`
    ctx.beginPath()
    ctx.ellipse(x, y, 20 + Math.random() * 40, 3 + Math.random() * 6, Math.random() * Math.PI, 0, Math.PI * 2)
    ctx.fill()
  }
  return new CanvasTexture(canvas)
}

function marsTexture() {
  const { canvas, ctx } = createCanvas(512, 256)
  const grad = ctx.createLinearGradient(0, 0, 0, 256)
  grad.addColorStop(0, '#c4603a')
  grad.addColorStop(0.2, '#c85a30')
  grad.addColorStop(0.5, '#b84820')
  grad.addColorStop(0.8, '#c85a30')
  grad.addColorStop(1, '#c4603a')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 512, 256)
  ctx.fillStyle = 'rgba(230,220,210,0.5)'
  ctx.fillRect(0, 0, 512, 15)
  ctx.fillRect(0, 241, 512, 15)
  for (let i = 0; i < 12; i++) {
    const x = Math.random() * 512
    const y = 40 + Math.random() * 176
    const r = 15 + Math.random() * 35
    const grad2 = ctx.createRadialGradient(x, y, 0, x, y, r)
    grad2.addColorStop(0, 'rgba(100,45,20,0.35)')
    grad2.addColorStop(1, 'rgba(100,45,20,0)')
    ctx.fillStyle = grad2
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }
  for (let i = 0; i < 300; i++) {
    const x = Math.random() * 512
    const y = Math.random() * 256
    const s = 1 + Math.random() * 3
    ctx.fillStyle = `rgba(${150 + Math.random() * 60},${60 + Math.random() * 40},${20 + Math.random() * 20},0.15)`
    ctx.fillRect(x, y, s, s)
  }
  return new CanvasTexture(canvas)
}

function jupiterTexture() {
  const { canvas, ctx } = createCanvas(1024, 512)
  const bands = [
    '#c4a06a', '#d4b88a', '#a07840', '#d4b88a',
    '#8a6430', '#c4a06a', '#e8d0a8', '#b89050',
    '#7a5428', '#c4a06a', '#d4b88a', '#a07840',
    '#c4a06a', '#e8d0a8', '#8a6430', '#d4b88a',
  ]
  const bandH = 512 / bands.length
  bands.forEach((color, i) => {
    ctx.fillStyle = color
    ctx.fillRect(0, i * bandH, 1024, bandH + 1)
  })
  for (let i = 0; i < 80; i++) {
    const x = Math.random() * 1024
    const y = Math.random() * 512
    const w = 15 + Math.random() * 60
    const h = 2 + Math.random() * 8
    ctx.fillStyle = `rgba(${180 + Math.random() * 60},${140 + Math.random() * 50},${80 + Math.random() * 40},${0.15 + Math.random() * 0.15})`
    ctx.fillRect(x, y, w, h)
  }
  const spotX = 600 + Math.random() * 100
  const spotY = 280 + Math.random() * 40
  const spotGrad = ctx.createRadialGradient(spotX, spotY, 0, spotX, spotY, 25)
  spotGrad.addColorStop(0, 'rgba(180,60,30,0.7)')
  spotGrad.addColorStop(0.6, 'rgba(160,70,40,0.4)')
  spotGrad.addColorStop(1, 'rgba(140,80,50,0)')
  ctx.fillStyle = spotGrad
  ctx.beginPath()
  ctx.ellipse(spotX, spotY, 28, 16, 0.1, 0, Math.PI * 2)
  ctx.fill()
  return new CanvasTexture(canvas)
}

function saturnTexture() {
  const { canvas, ctx } = createCanvas(1024, 512)
  const grad = ctx.createLinearGradient(0, 0, 0, 512)
  grad.addColorStop(0, '#d4c090')
  grad.addColorStop(0.3, '#e0d0a8')
  grad.addColorStop(0.5, '#c8b480')
  grad.addColorStop(0.7, '#d8c898')
  grad.addColorStop(1, '#d4c090')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 1024, 512)
  for (let i = 0; i < 20; i++) {
    const y = Math.random() * 512
    const h = 2 + Math.random() * 8
    ctx.fillStyle = `rgba(${200 + Math.random() * 30},${180 + Math.random() * 30},${130 + Math.random() * 30},0.2)`
    ctx.fillRect(0, y, 1024, h)
  }
  return new CanvasTexture(canvas)
}

function uranusTexture() {
  const { canvas, ctx } = createCanvas(512, 256)
  ctx.fillStyle = '#7ec8d8'
  ctx.fillRect(0, 0, 512, 256)
  for (let i = 0; i < 10; i++) {
    const y = Math.random() * 256
    ctx.fillStyle = `rgba(180,230,240,${0.05 + Math.random() * 0.1})`
    ctx.fillRect(0, y, 512, 2 + Math.random() * 5)
  }
  return new CanvasTexture(canvas)
}

function neptuneTexture() {
  const { canvas, ctx } = createCanvas(512, 256)
  const grad = ctx.createLinearGradient(0, 0, 0, 256)
  grad.addColorStop(0, '#2a4494')
  grad.addColorStop(0.5, '#3355aa')
  grad.addColorStop(1, '#2a4494')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 512, 256)
  for (let i = 0; i < 10; i++) {
    const y = Math.random() * 256
    ctx.fillStyle = `rgba(80,130,220,${0.1 + Math.random() * 0.1})`
    ctx.fillRect(0, y, 512, 2 + Math.random() * 4)
  }
  const grad2 = ctx.createRadialGradient(350, 130, 0, 350, 130, 18)
  grad2.addColorStop(0, 'rgba(30,50,120,0.5)')
  grad2.addColorStop(1, 'rgba(30,50,120,0)')
  ctx.fillStyle = grad2
  ctx.beginPath()
  ctx.arc(350, 130, 18, 0, Math.PI * 2)
  ctx.fill()
  return new CanvasTexture(canvas)
}

/* ================================================================== */
/*  Sun — glowing orb with corona                                     */
/* ================================================================== */

function Sun() {
  const { reduced } = useScene()
  const ref = useRef()
  const coronaRef = useRef()

  useFrame((state, delta) => {
    if (reduced) return
    const t = state.clock.getElapsedTime()
    if (ref.current) ref.current.rotation.y += delta * 0.05
    if (coronaRef.current) {
      coronaRef.current.rotation.z -= delta * 0.02
      const pulse = 1 + Math.sin(t * 0.8) * 0.06
      coronaRef.current.scale.setScalar(pulse)
    }
  })

  const sunTex = useMemo(() => {
    const { canvas, ctx } = createCanvas(512, 256)
    const grad = ctx.createRadialGradient(256, 128, 10, 256, 128, 256)
    grad.addColorStop(0, '#fff8e0')
    grad.addColorStop(0.3, '#ffe44d')
    grad.addColorStop(0.6, '#ffaa00')
    grad.addColorStop(0.85, '#ff6600')
    grad.addColorStop(1, '#cc3300')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 512, 256)
    for (let i = 0; i < 60; i++) {
      const x = Math.random() * 512
      const y = Math.random() * 256
      const r = 5 + Math.random() * 20
      const g = ctx.createRadialGradient(x, y, 0, x, y, r)
      g.addColorStop(0, `rgba(255,255,200,${0.1 + Math.random() * 0.15})`)
      g.addColorStop(1, 'rgba(255,255,200,0)')
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    }
    return new CanvasTexture(canvas)
  }, [])

  return (
    <group position={[0, 0, 25]}>
      {/* Core sphere */}
      <mesh ref={ref}>
        <sphereGeometry args={[5.0, 64, 64]} />
        <meshStandardMaterial
          map={sunTex}
          emissive="#ffaa00"
          emissiveIntensity={3}
          toneMapped={false}
        />
      </mesh>

      {/* Inner glow */}
      <mesh ref={coronaRef}>
        <sphereGeometry args={[6.0, 32, 32]} />
        <meshBasicMaterial
          color="#ffcc44"
          transparent
          opacity={0.12}
          side={DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Outer corona */}
      <mesh>
        <sphereGeometry args={[8.0, 32, 32]} />
        <meshBasicMaterial
          color="#ff8800"
          transparent
          opacity={0.04}
          side={DoubleSide}
          depthWrite={false}
        />
      </mesh>

      <Sparkles count={30} scale={[12, 12, 12]} size={4} speed={0.3} color="#ffe066" opacity={0.7} />
      <pointLight intensity={300} color="#ffcc66" distance={200} decay={1.5} />
      <pointLight intensity={80} color="#ffffff" distance={80} decay={2} />
    </group>
  )
}

/* ================================================================== */
/*  Saturn ring — proper flat disc with Cassini Division               */
/* ================================================================== */

function SaturnRing({ radius }) {
  const ringGeo = useMemo(() => {
    const inner = radius * 1.4
    const outer = radius * 2.5
    const geo = new RingGeometry(inner, outer, 128)
    const pos = geo.attributes.position
    const uv = geo.attributes.uv
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      const dist = Math.sqrt(x * x + y * y)
      const t = (dist - inner) / (outer - inner)
      uv.setXY(i, t, 0.5)
    }
    return geo
  }, [radius])

  const ringTex = useMemo(() => {
    const { canvas, ctx } = createCanvas(512, 32)
    const grad = ctx.createLinearGradient(0, 0, 512, 0)
    grad.addColorStop(0.0, 'rgba(210,195,165,0.0)')
    grad.addColorStop(0.04, 'rgba(210,195,165,0.6)')
    grad.addColorStop(0.12, 'rgba(220,205,170,0.85)')
    grad.addColorStop(0.22, 'rgba(200,185,155,0.3)')
    grad.addColorStop(0.28, 'rgba(210,195,165,0.75)')
    grad.addColorStop(0.45, 'rgba(230,215,180,0.95)')
    grad.addColorStop(0.55, 'rgba(220,205,170,0.7)')
    grad.addColorStop(0.65, 'rgba(190,175,145,0.25)')
    grad.addColorStop(0.72, 'rgba(200,185,155,0.6)')
    grad.addColorStop(0.88, 'rgba(180,165,135,0.35)')
    grad.addColorStop(1.0, 'rgba(180,165,135,0.0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 512, 32)
    return new CanvasTexture(canvas)
  }, [])

  return (
    <mesh rotation={[Math.PI / 2.15, 0, 0]} geometry={ringGeo}>
      <meshStandardMaterial
        map={ringTex}
        transparent
        side={DoubleSide}
        opacity={0.9}
        roughness={0.4}
        metalness={0.15}
      />
    </mesh>
  )
}

/* ================================================================== */
/*  Uranus ring — thin tilted ring                                     */
/* ================================================================== */

function UranusRing({ radius }) {
  const ringGeo = useMemo(() => {
    const inner = radius * 1.3
    const outer = radius * 1.6
    return new RingGeometry(inner, outer, 96)
  }, [radius])

  return (
    <mesh rotation={[0.3, 0, 0]} geometry={ringGeo}>
      <meshStandardMaterial
        color="#7ec8d8"
        transparent
        opacity={0.25}
        side={DoubleSide}
        roughness={0.7}
        metalness={0.1}
      />
    </mesh>
  )
}

/* ================================================================== */
/*  Orbital axis ring — shows each planet's orbit path                 */
/* ================================================================== */

function OrbitalAxis({ radius, color, tilt = 0 }) {
  const points = useMemo(() => {
    const pts = []
    const segments = 128
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2
      pts.push(new Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius))
    }
    return pts
  }, [radius])

  const curve = useMemo(() => new CatmullRomCurve3(points, true), [points])
  const linePoints = useMemo(() => curve.getPoints(128), [curve])

  return (
    <group rotation={[tilt, 0, 0]}>
      <line>
        <bufferGeometry>
          <primitive
            attach="attributes-position"
            object={
              new BufferAttribute(
                new Float32Array(linePoints.flatMap((p) => [p.x, p.y, p.z])),
                3,
              )
            }
          />
        </bufferGeometry>
        <lineBasicMaterial color={color} transparent opacity={0.15} depthWrite={false} />
      </line>
    </group>
  )
}

/* ================================================================== */
/*  Moon — single orbiting moon                                        */
/* ================================================================== */

function Moon({ distance, size, speed, color, tilt = 0.2 }) {
  const ref = useRef()
  const { reduced } = useScene()

  useFrame((_, delta) => {
    if (reduced || !ref.current) return
    ref.current.rotation.y += delta * speed
  })

  return (
    <group ref={ref} rotation={[tilt, 0, 0]}>
      <mesh position={[distance, 0, 0]}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.15}
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>
    </group>
  )
}

/* ================================================================== */
/*  Planet definitions — with section labels                            */
/* ================================================================== */

const PLANETS = [
  {
    name: 'Mercury',
    section: 'Home',
    position: [12, 3, 4],
    radius: 1.4,
    texture: mercuryTexture,
    emissive: '#3a3228',
    emissiveIntensity: 0.1,
    roughness: 0.7,
    metalness: 0.5,
    clearcoat: 0.3,
    rotationSpeed: 0.002,
    orbitSpeed: 0.015,
    orbitRadius: 9.5,
    orbitTilt: 0.12,
    orbitColor: '#666666',
    atmosphere: null,
    ring: null,
    moons: [],
    labelColor: '#a09080',
  },
  {
    name: 'Venus',
    section: 'About',
    position: [-12, -2, -20],
    radius: 2.0,
    texture: venusTexture,
    emissive: '#8a6a3a',
    emissiveIntensity: 0.12,
    roughness: 0.35,
    metalness: 0.3,
    clearcoat: 0.5,
    rotationSpeed: -0.001,
    orbitSpeed: 0.01,
    orbitRadius: 9.5,
    orbitTilt: 0.05,
    orbitColor: '#886644',
    atmosphere: { color: '#f5e6b8', opacity: 0.06 },
    ring: null,
    moons: [],
    labelColor: '#e0c090',
  },
  {
    name: 'Earth',
    section: 'Skills',
    position: [11, 4, -42],
    radius: 2.2,
    texture: earthTexture,
    emissive: '#0a2a50',
    emissiveIntensity: 0.15,
    roughness: 0.25,
    metalness: 0.4,
    clearcoat: 0.6,
    rotationSpeed: 0.003,
    orbitSpeed: 0.008,
    orbitRadius: 8.5,
    orbitTilt: 0.0,
    orbitColor: '#3366aa',
    atmosphere: { color: '#4488cc', opacity: 0.07 },
    ring: null,
    moons: [
      { distance: 3.2, size: 0.22, speed: 0.04, color: '#c4c4c4', tilt: 0.15 },
    ],
    labelColor: '#6699cc',
  },
  {
    name: 'Mars',
    section: 'Experience',
    position: [-10, -4, -62],
    radius: 1.8,
    texture: marsTexture,
    emissive: '#5a2010',
    emissiveIntensity: 0.1,
    roughness: 0.6,
    metalness: 0.3,
    clearcoat: 0.4,
    rotationSpeed: 0.003,
    orbitSpeed: 0.012,
    orbitRadius: 7.5,
    orbitTilt: 0.09,
    orbitColor: '#aa4422',
    atmosphere: { color: '#c48060', opacity: 0.05 },
    ring: null,
    moons: [
      { distance: 2.8, size: 0.1, speed: 0.06, color: '#a0a0a0', tilt: 0.2 },
      { distance: 3.4, size: 0.07, speed: 0.035, color: '#908880', tilt: 0.15 },
    ],
    labelColor: '#cc6644',
  },
  {
    name: 'Jupiter',
    section: 'Projects',
    position: [12, 1, -82],
    radius: 4.8,
    texture: jupiterTexture,
    emissive: '#4a3018',
    emissiveIntensity: 0.1,
    roughness: 0.2,
    metalness: 0.35,
    clearcoat: 0.7,
    rotationSpeed: 0.006,
    orbitSpeed: 0.006,
    orbitRadius: 10,
    orbitTilt: 0.04,
    orbitColor: '#aa8844',
    atmosphere: { color: '#d4a870', opacity: 0.04 },
    ring: null,
    moons: [
      { distance: 6.2, size: 0.2, speed: 0.05, color: '#ddaa66', tilt: 0.1 },
      { distance: 7.0, size: 0.18, speed: 0.035, color: '#cc8844', tilt: 0.12 },
      { distance: 7.8, size: 0.25, speed: 0.025, color: '#eebb77', tilt: 0.08 },
      { distance: 8.6, size: 0.15, speed: 0.02, color: '#bbaa88', tilt: 0.15 },
    ],
    labelColor: '#ddaa66',
  },
  {
    name: 'Saturn',
    section: 'Achievements',
    position: [-11, 3, -100],
    radius: 4.2,
    texture: saturnTexture,
    emissive: '#5a4a28',
    emissiveIntensity: 0.08,
    roughness: 0.2,
    metalness: 0.35,
    clearcoat: 0.6,
    rotationSpeed: 0.004,
    orbitSpeed: 0.008,
    orbitRadius: 10,
    orbitTilt: 0.07,
    orbitColor: '#ccbb88',
    atmosphere: null,
    ring: 'saturn',
    moons: [
      { distance: 5.8, size: 0.22, speed: 0.04, color: '#ddcc88', tilt: 0.05 },
      { distance: 6.6, size: 0.15, speed: 0.025, color: '#ccbbaa', tilt: 0.08 },
      { distance: 7.4, size: 0.12, speed: 0.02, color: '#bbaa99', tilt: 0.1 },
    ],
    labelColor: '#ccbb88',
  },
  {
    name: 'Uranus',
    section: 'Contact',
    position: [10, -3, -112],
    radius: 3.2,
    texture: uranusTexture,
    emissive: '#1a4a58',
    emissiveIntensity: 0.1,
    roughness: 0.15,
    metalness: 0.45,
    clearcoat: 0.8,
    rotationSpeed: 0.001,
    orbitSpeed: 0.004,
    orbitRadius: 8,
    orbitTilt: 0.12,
    orbitColor: '#6699aa',
    atmosphere: { color: '#a0e0f0', opacity: 0.06 },
    ring: 'uranus',
    moons: [
      { distance: 4.6, size: 0.15, speed: 0.035, color: '#88bbee', tilt: 0.3 },
      { distance: 5.2, size: 0.1, speed: 0.025, color: '#77aadd', tilt: 0.25 },
      { distance: 5.8, size: 0.08, speed: 0.02, color: '#99ccee', tilt: 0.28 },
    ],
    labelColor: '#88ccee',
  },
  {
    name: 'Neptune',
    section: 'Education',
    position: [-9, 2, -125],
    radius: 3.0,
    texture: neptuneTexture,
    emissive: '#0a1a50',
    emissiveIntensity: 0.15,
    roughness: 0.12,
    metalness: 0.5,
    clearcoat: 0.8,
    rotationSpeed: 0.003,
    orbitSpeed: 0.005,
    orbitRadius: 7.5,
    orbitTilt: 0.05,
    orbitColor: '#3355aa',
    atmosphere: { color: '#5588dd', opacity: 0.07 },
    ring: null,
    moons: [
      { distance: 4.5, size: 0.15, speed: 0.03, color: '#6699cc', tilt: 0.15 },
      { distance: 5.0, size: 0.1, speed: 0.02, color: '#5588bb', tilt: 0.2 },
    ],
    labelColor: '#5588dd',
  },
]

/* ================================================================== */
/*  Planet label — appears on hover                                    */
/* ================================================================== */

function PlanetLabel({ name, section, radius, labelColor }) {
  return (
    <Html
      center
      distanceFactor={15}
      position={[0, radius + 1.2, 0]}
      style={{
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(12px)',
          border: `1px solid ${labelColor}40`,
          borderRadius: '12px',
          padding: '10px 18px',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          animation: 'fadeIn 0.3s ease-out',
        }}
      >
        <div
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '16px',
            fontWeight: 700,
            color: labelColor,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '11px',
            color: '#94a3b8',
            marginTop: '2px',
            letterSpacing: '0.15em',
          }}
        >
          {section}
        </div>
      </div>
    </Html>
  )
}

/* ================================================================== */
/*  Single planet component with interactivity                         */
/* ================================================================== */

function Planet({ data }) {
  const { reduced } = useScene()
  const planetRef = useRef()
  const groupRef = useRef()
  const glowRef = useRef()
  const [hovered, setHovered] = useState(false)

  const texture = useMemo(() => data.texture(), [])

  const onPointerOver = useCallback(() => {
    setHovered(true)
    document.body.style.cursor = 'pointer'
  }, [])

  const onPointerOut = useCallback(() => {
    setHovered(false)
    document.body.style.cursor = 'auto'
  }, [])

  useFrame((state, delta) => {
    if (reduced) return
    const speed = hovered ? 3 : 1
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * data.rotationSpeed * 40 * speed
    }
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * data.orbitSpeed
    }
    // Pulse glow on hover
    if (glowRef.current) {
      const target = hovered ? 1 : 0
      glowRef.current.material.opacity += (target - glowRef.current.material.opacity) * 0.1
    }
  })

  return (
    <group position={data.position}>
      {/* Orbital axis ring */}
      <OrbitalAxis
        radius={data.orbitRadius}
        color={data.orbitColor}
        tilt={data.orbitTilt}
      />

      <group ref={groupRef}>
        <Float speed={reduced ? 0 : 1} rotationIntensity={0.05} floatIntensity={0.3}>
          <mesh
            ref={planetRef}
            onPointerOver={onPointerOver}
            onPointerOut={onPointerOut}
            scale={hovered ? 1.08 : 1}
          >
            <sphereGeometry args={[data.radius, 64, 64]} />
            <meshPhysicalMaterial
              map={texture}
              emissive={new Color(data.emissive)}
              emissiveIntensity={data.emissiveIntensity}
              roughness={data.roughness}
              metalness={data.metalness}
              clearcoat={data.clearcoat}
              clearcoatRoughness={0.1}
              reflectivity={0.8}
              sheen={0.3}
              sheenColor={new Color(data.emissive)}
            />
          </mesh>

          {/* Hover glow ring */}
          <mesh ref={glowRef} scale={1.2}>
            <sphereGeometry args={[data.radius, 32, 32]} />
            <meshBasicMaterial
              color={data.labelColor}
              transparent
              opacity={0}
              side={DoubleSide}
              depthWrite={false}
              blending={AdditiveBlending}
            />
          </mesh>

          {/* Atmosphere */}
          {data.atmosphere && (
            <mesh scale={1.1}>
              <sphereGeometry args={[data.radius, 32, 32]} />
              <meshBasicMaterial
                color={data.atmosphere.color}
                transparent
                opacity={data.atmosphere.opacity}
                side={DoubleSide}
                depthWrite={false}
              />
            </mesh>
          )}

          {/* Rings */}
          {data.ring === 'saturn' && <SaturnRing radius={data.radius} />}
          {data.ring === 'uranus' && <UranusRing radius={data.radius} />}

          {/* Moons */}
          {data.moons.map((moon, i) => (
            <Moon key={i} {...moon} />
          ))}

          {/* Planet label on hover */}
          {hovered && (
            <PlanetLabel
              name={data.name}
              section={data.section}
              radius={data.radius}
              labelColor={data.labelColor}
            />
          )}
        </Float>

        {/* Self-illumination */}
        <pointLight
          intensity={data.radius * 2}
          color={data.emissive}
          distance={data.radius * 6}
          decay={2}
        />

        {/* Hover glow light */}
        {hovered && (
          <pointLight
            intensity={data.radius * 8}
            color={data.labelColor}
            distance={data.radius * 5}
            decay={2}
          />
        )}
      </group>
    </group>
  )
}

/* ================================================================== */
/*  Exported component                                                  */
/* ================================================================== */

export default function Planets() {
  return (
    <group>
      <Starfield />
      <NebulaClouds />
      <ShootingStars />
      <Sun />
      {PLANETS.map((p) => (
        <Planet key={p.name} data={p} />
      ))}
    </group>
  )
}
