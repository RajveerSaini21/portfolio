import { profile } from '../data/profile'
import { Eyebrow, Reveal, Section, Title } from './primitives'

export default function Experience() {
  return (
    <Section id="experience" label="Experience">
      <Reveal>
        <Eyebrow>Where I've worked</Eyebrow>
        <Title>Professional Experience</Title>
        <p className="mb-10 max-w-2xl text-base text-slate-400">
          Internships and roles building data pipelines, ML models, and full-stack applications.
        </p>
      </Reveal>

      <ol className="space-y-6">
        {profile.experience.map((job, i) => (
          <Reveal key={job.company} delay={i * 0.12}>
            <li className="panel group p-7 sm:p-9 hover:scale-[1.01] transition-all">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 mb-3">
                <h3 className="font-display text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all">
                  <span
                    className="mr-3 inline-block h-3 w-3 rounded-full align-middle shadow-lg transition-all group-hover:scale-125 group-hover:shadow-xl"
                    style={{
                      backgroundColor: job.accent,
                      boxShadow: `0 0 12px ${job.accent}80`
                    }}
                    aria-hidden="true"
                  />
                  {job.company}
                </h3>
                <p className="font-mono text-xs text-slate-500 bg-slate-800/50 px-3 py-1.5 rounded-full">
                  {job.period}
                </p>
              </div>
              <p className="mb-5 text-base font-semibold" style={{ color: job.accent }}>
                {job.title}
                <span className="ml-2 text-sm text-slate-400 font-normal">· {job.mode}</span>
              </p>
              <ul className="space-y-3">
                {job.points.map((point, pi) => (
                  <li
                    key={pi}
                    className="flex gap-3.5 text-base leading-relaxed text-slate-300 hover:text-slate-200 transition-colors"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-2 font-bold transition-all"
                      style={{ color: job.accent }}
                    >
                      ▸
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <div
                className="mt-6 h-1 w-0 bg-gradient-to-r rounded-full transition-all duration-500 group-hover:w-full"
                style={{
                  backgroundImage: `linear-gradient(to right, ${job.accent}, transparent)`
                }}
                aria-hidden="true"
              />
            </li>
          </Reveal>
        ))}
      </ol>
    </Section>
  )
}
