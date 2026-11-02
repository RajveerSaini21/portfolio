import { useState, useEffect, useRef } from 'react'
import { activeSection } from '../lib/store'
import { useActiveSection } from '../lib/hooks'
import { NAV } from '../data/stations'
import { profile } from '../data/profile'

/**
 * Dynamic HUD overlay — sector tracker, system status, and scroll hint.
 * Shows the current sector as the user scrolls through the universe.
 */
export default function HUD() {
  const active = useActiveSection()
  const [time, setTime] = useState('')
  const [showTransmission, setShowTransmission] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const tickRef = useRef(null)

  // Live clock
  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
      )
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  // Elapsed time since page load
  useEffect(() => {
    const start = Date.now()
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - start) / 1000))
    }, 1000)
    return () => clearInterval(id)
  }, [])

  // Blink effect for "currently building" dot
  const [dotOn, setDotOn] = useState(true)
  useEffect(() => {
    const id = setInterval(() => setDotOn((v) => !v), 1200)
    return () => clearInterval(id)
  }, [])

  const currentStation = NAV[active] || NAV[0]
  const sectorNum = String(active + 1).padStart(2, '0')
  const sectorLabel = currentStation.label.toUpperCase()

  const formatTime = (s) => {
    const h = String(Math.floor(s / 3600)).padStart(2, '0')
    const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0')
    const sec = String(s % 60).padStart(2, '0')
    return `${h}:${m}:${sec}`
  }

  return (
    <>
      {/* Top-left: System status */}
      <div className="fixed top-16 left-4 z-20 pointer-events-none hidden md:block">
        <div className="font-mono text-[10px] text-slate-600 tracking-widest space-y-1">
          <div className="flex items-center gap-2">
            <span className={`inline-block h-1.5 w-1.5 rounded-full ${dotOn ? 'bg-emerald-400' : 'bg-emerald-400/30'}`} />
            <span>SYSTEM ONLINE</span>
          </div>
          <div className="text-slate-700">{time}</div>
          <div className="text-slate-700">UPTIME {formatTime(elapsed)}</div>
        </div>
      </div>

      {/* Top-right: Current sector */}
      <div className="fixed top-16 right-4 z-20 pointer-events-none hidden md:block">
        <div className="font-mono text-[10px] text-slate-600 tracking-widest text-right space-y-1">
          <div>SECTOR {sectorNum}</div>
          <div className="text-sky-400/80 font-semibold">{sectorLabel}</div>
          <div className="mt-2 flex items-center justify-end gap-1.5">
            {NAV.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-500 ${
                  i === active
                    ? 'w-4 bg-sky-400'
                    : i < active
                      ? 'w-1.5 bg-sky-400/40'
                      : 'w-1.5 bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom-left: Currently building */}
      <div className="fixed bottom-6 left-4 z-20 pointer-events-none hidden md:block">
        <div className="font-mono text-[10px] tracking-widest">
          <div className="flex items-center gap-2 text-emerald-400/70 mb-1">
            <span className={`inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 ${dotOn ? 'opacity-100' : 'opacity-30'}`} />
            <span>TRANSMISSION</span>
          </div>
          <div className="text-slate-500">Currently building</div>
          <div className="text-slate-400 mt-0.5">AI-powered applications &amp; real-time systems</div>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="text-slate-600">STATUS: ACTIVE</span>
            <div className="flex gap-px">
              {Array.from({ length: 16 }, (_, i) => (
                <div
                  key={i}
                  className={`h-2 w-1 ${
                    i < 13 ? 'bg-sky-400/60' : 'bg-slate-700/60'
                  }`}
                />
              ))}
            </div>
            <span className="text-slate-600">82%</span>
          </div>
        </div>
      </div>

      {/* Bottom-right: Scroll hint (fades as you scroll) */}
      <div
        className={`fixed bottom-6 right-4 z-20 pointer-events-none transition-opacity duration-1000 hidden md:block ${
          active === 0 ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="font-mono text-[10px] text-slate-600 tracking-widest text-right">
          <div>SCROLL TO NAVIGATE</div>
          <div className="mt-1 animate-bounce">
            <svg className="w-4 h-4 text-sky-400/50 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>

      {/* Center-bottom: Mission name watermark */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none hidden md:block">
        <div className="font-mono text-[9px] text-slate-700/50 tracking-[0.3em] uppercase">
          {profile.name.split(' ').map(c => c[0]).join('')}
        </div>
      </div>
    </>
  )
}
