import { useState, useEffect } from 'react'
import { profile } from '../data/profile'
import { Reveal, Section } from './primitives'

export default function Hero() {
  const c = profile.contact
  const [transmissionActive, setTransmissionActive] = useState(true)

  useEffect(() => {
    const id = setInterval(() => setTransmissionActive((v) => !v), 1400)
    return () => clearInterval(id)
  }, [])

  return (
    <Section id="hero" label="Introduction">
      <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr] items-center">
        {/* Left: Main intro */}
        <div>
          <Reveal>
            <p className="font-display mb-5 flex items-center gap-2.5 text-xs font-semibold tracking-[0.24em] text-blue-400 uppercase">
              <span
                className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse"
                aria-hidden="true"
              />
              Open to 2027 new-grad &amp; internship roles
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="font-display text-6xl leading-[1.05] font-bold tracking-tight text-white sm:text-8xl glow-text">
              {profile.name}
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="text-gradient font-display mt-4 text-2xl font-semibold sm:text-4xl">
              {profile.role}
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300 sm:text-xl">
              {profile.tagline}
            </p>
            <p className="mt-3 text-base text-slate-400">{profile.status}</p>
          </Reveal>

          <Reveal delay={0.32}>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#projects"
                className="group font-display rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105"
              >
                View my work
                <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">→</span>
              </a>
              <a
                href={c.resume}
                download
                className="font-display rounded-xl border-2 border-slate-600 px-6 py-3 text-base font-semibold text-slate-200 transition-all hover:border-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
              >
                Download résumé
              </a>
              <a
                href={c.github}
                target="_blank"
                rel="noopener noreferrer"
                className="font-display rounded-xl border border-slate-700 px-6 py-3 text-base font-semibold text-slate-300 transition-all hover:border-slate-400 hover:text-white hover:bg-slate-800/50"
              >
                GitHub
              </a>
              <a
                href={c.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="font-display rounded-xl border border-slate-700 px-6 py-3 text-base font-semibold text-slate-300 transition-all hover:border-slate-400 hover:text-white hover:bg-slate-800/50"
              >
                LinkedIn
              </a>
            </div>
          </Reveal>
        </div>

        {/* Right: Mission Profile Card */}
        <Reveal delay={0.2}>
          <div className="panel p-6 sm:p-8">
            <div className="font-mono text-[10px] tracking-[0.3em] text-slate-500 uppercase mb-4">
              Mission Profile
            </div>

            <div className="space-y-3 font-mono text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">NAME</span>
                <span className="text-white font-semibold">{profile.name.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">ROLE</span>
                <span className="text-sky-400">FULL STACK DEV</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">FOCUS</span>
                <span className="text-purple-400">AI / ML / WEB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">STATUS</span>
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <span className={`inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 ${transmissionActive ? 'opacity-100' : 'opacity-30'}`} />
                  OPEN TO WORK
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">LOCATION</span>
                <span className="text-slate-300">INDIA</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-700/60">
              <div className="flex items-center gap-2 text-emerald-400/70">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-[10px] tracking-widest">TRANSMISSION ACTIVE</span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
