import { profile } from '../data/profile'
import { Eyebrow, Reveal, Section, Title } from './primitives'

export default function About() {
  return (
    <Section id="about" label="About">
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] xl:gap-10">
        <Reveal className="panel p-7 sm:p-9">
          <Eyebrow>About</Eyebrow>
          <Title>Who I am</Title>
          <p className="text-lg leading-relaxed text-slate-300">{profile.summary}</p>

          <dl className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {profile.stats.map((s, i) => (
              <div key={s.label} className="relative group">
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-3xl font-bold text-white sm:text-4xl group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all">
                      {s.value}
                    </span>
                    {s.unit && <span className="text-base font-semibold text-blue-400">{s.unit}</span>}
                  </div>
                  <span className="mt-1 block text-xs text-slate-400 uppercase tracking-wide">{s.label}</span>
                </dd>
                <div
                  className="absolute -bottom-2 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"
                  aria-hidden="true"
                />
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={0.12} className="panel p-7 sm:p-9">
          <Eyebrow>Education</Eyebrow>
          <Title>Learning journey</Title>
          <ol className="space-y-6">
            {profile.education.map((e, i) => (
              <li key={e.school} className="relative border-l-2 border-blue-500/30 pl-5 pb-6 last:pb-0">
                <div className="absolute -left-[5px] top-0 h-2 w-2 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50" />
                <p className="font-display text-base font-semibold text-white">{e.school}</p>
                <p className="mt-1 text-sm text-slate-300">{e.credential}</p>
                <p className="mt-1.5 text-xs text-slate-500 font-mono">{e.period}</p>
                {e.detail && <p className="mt-2 text-xs text-blue-400 font-medium">{e.detail}</p>}
              </li>
            ))}
          </ol>
          <div className="mt-6 pt-5 border-t border-slate-700/60 flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-sm text-slate-400">
              Based in {profile.location}
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
