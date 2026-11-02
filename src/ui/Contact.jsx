import { useState } from 'react'
import { profile } from '../data/profile'
import { Eyebrow, Reveal, Section, Title } from './primitives'

export default function Contact() {
  const c = profile.contact
  const [sent, setSent] = useState(false)
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name || !message) return
    setSent(true)
  }

  return (
    <Section id="contact" label="Contact">
      <Reveal>
        <Eyebrow>Contact</Eyebrow>
        <Title>Send a Transmission</Title>
        <p className="mb-8 max-w-2xl text-base text-slate-400">
          Reach out through the void. I'm actively looking for new-grad and internship opportunities for 2027.
        </p>
      </Reveal>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        {/* Transmission form */}
        <Reveal delay={0.1}>
          <div className="panel p-7 sm:p-8">
            <div className="font-mono text-[10px] tracking-[0.3em] text-slate-500 uppercase mb-6">
              📡 Transmission Console
            </div>

            {!sent ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="font-mono text-xs text-slate-500 tracking-widest uppercase block mb-2">
                    FROM
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name..."
                    className="w-full bg-slate-900/60 border border-slate-700/60 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-sky-400/60 focus:outline-none focus:ring-1 focus:ring-sky-400/30 transition-colors font-mono"
                  />
                </div>

                <div>
                  <label className="font-mono text-xs text-slate-500 tracking-widest uppercase block mb-2">
                    DESTINATION
                  </label>
                  <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-700/60 rounded-lg px-4 py-3">
                    <span className="text-sky-400">📡</span>
                    <a
                      href={`mailto:${c.email}?subject=Transmission from ${name}&body=${encodeURIComponent(message)}`}
                      className="text-sm text-sky-400 hover:text-sky-300 transition-colors font-mono"
                    >
                      {c.email}
                    </a>
                  </div>
                </div>

                <div>
                  <label className="font-mono text-xs text-slate-500 tracking-widest uppercase block mb-2">
                    TRANSMISSION
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Let's build something..."
                    rows={4}
                    className="w-full bg-slate-900/60 border border-slate-700/60 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-sky-400/60 focus:outline-none focus:ring-1 focus:ring-sky-400/30 transition-colors font-mono resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full font-display rounded-lg bg-gradient-to-r from-sky-500 to-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition-all hover:shadow-xl hover:shadow-sky-500/40 hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  SEND TRANSMISSION
                  <span className="text-lg">→</span>
                </button>
              </form>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">✅</div>
                <div className="font-display text-xl font-bold text-emerald-400 mb-2">
                  TRANSMISSION SENT
                </div>
                <div className="font-mono text-sm text-slate-400">
                  Awaiting response from Earth...
                </div>
                <button
                  onClick={() => { setSent(false); setName(''); setMessage('') }}
                  className="mt-6 font-mono text-xs text-sky-400 hover:text-sky-300 transition-colors"
                >
                  Send another transmission
                </button>
              </div>
            )}
          </div>
        </Reveal>

        {/* Contact info */}
        <Reveal delay={0.2}>
          <div className="space-y-4">
            {/* Quick contact links */}
            <div className="panel p-5">
              <h3 className="font-mono text-[10px] tracking-widest text-slate-500 uppercase mb-3">
                Direct Channels
              </h3>
              <div className="space-y-2">
                <a
                  href={`mailto:${c.email}`}
                  className="flex items-center gap-3 text-sm text-slate-300 hover:text-sky-400 transition-colors p-2 rounded-lg hover:bg-slate-800/50"
                >
                  <span className="text-lg">📧</span>
                  <span className="font-mono">{c.email}</span>
                </a>
                <a
                  href={`tel:${c.phone}`}
                  className="flex items-center gap-3 text-sm text-slate-300 hover:text-sky-400 transition-colors p-2 rounded-lg hover:bg-slate-800/50"
                >
                  <span className="text-lg">📱</span>
                  <span className="font-mono">{c.phone}</span>
                </a>
              </div>
            </div>

            {/* Social links */}
            <div className="panel p-5">
              <h3 className="font-mono text-[10px] tracking-widest text-slate-500 uppercase mb-3">
                Networks
              </h3>
              <div className="flex gap-3">
                <a
                  href={c.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center rounded-lg border border-slate-700 px-4 py-3 text-sm font-medium text-slate-300 transition-all hover:border-sky-400 hover:text-sky-300 hover:bg-sky-400/10"
                >
                  <div className="text-lg mb-1">💻</div>
                  <div className="font-mono text-xs">GitHub</div>
                </a>
                <a
                  href={c.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center rounded-lg border border-slate-700 px-4 py-3 text-sm font-medium text-slate-300 transition-all hover:border-sky-400 hover:text-sky-300 hover:bg-sky-400/10"
                >
                  <div className="text-lg mb-1">💼</div>
                  <div className="font-mono text-xs">LinkedIn</div>
                </a>
              </div>
            </div>

            {/* Status card */}
            <div className="panel p-5">
              <div className="flex items-center gap-2 text-emerald-400 mb-2">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-xs tracking-widest">AVAILABLE FOR HIRE</span>
              </div>
              <p className="text-sm text-slate-400">
                Open to new-grad and internship roles starting 2027.
              </p>
            </div>
          </div>
        </Reveal>
      </div>

      <p className="mt-12 text-center text-xs text-slate-600 font-mono">
        © {new Date().getFullYear()} {profile.name} · Built with React, Three.js & Vite
      </p>
    </Section>
  )
}
