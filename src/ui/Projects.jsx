import { profile } from '../data/profile'
import { Eyebrow, Reveal, Section, Title } from './primitives'

/**
 * Holographic project card with tech tree visualization.
 * Each project shows its tech stack as an interconnected node tree.
 */
function ProjectHoloCard({ proj, index }) {
  const accentColor = proj.accent || '#3b82f6'

  return (
    <Reveal delay={index * 0.12}>
      <article className="panel group flex h-full flex-col p-7 sm:p-8 cursor-pointer relative overflow-hidden">
        {/* Holographic shimmer effect */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, transparent 30%, ${accentColor}08 50%, transparent 70%)`,
          }}
        />

        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-0.5 opacity-60 group-hover:opacity-100 transition-opacity"
          style={{ background: `linear-gradient(to right, transparent, ${accentColor}, transparent)` }}
        />

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center font-display font-bold text-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${accentColor}30, ${accentColor}10)`,
                border: `1px solid ${accentColor}40`,
                color: accentColor,
                boxShadow: `0 0 20px ${accentColor}20`,
              }}
            >
              {proj.name[0]}
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r transition-all" style={{ backgroundImage: `linear-gradient(to right, ${accentColor}, ${accentColor}cc)`, backgroundClip: 'text' }}>
                {proj.name}
              </h3>
              <p className="font-mono text-xs text-slate-500 mt-0.5">{proj.period}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm leading-relaxed text-slate-300 mb-5">
          {proj.blurb}
        </p>

        {/* Tech tree visualization */}
        <div className="mb-5">
          <div className="font-mono text-[10px] text-slate-500 tracking-widest uppercase mb-2">
            Tech Stack
          </div>
          <div className="flex flex-wrap gap-2">
            {proj.stack.map((tech, ti) => (
              <span
                key={tech}
                className="rounded-lg px-3 py-1.5 text-xs font-medium border transition-all duration-200"
                style={{
                  borderColor: `${accentColor}30`,
                  backgroundColor: `${accentColor}10`,
                  color: accentColor,
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Key points as compact list */}
        <ul className="space-y-2 mb-5">
          {proj.points.map((point, pi) => (
            <li
              key={pi}
              className="flex gap-2.5 text-sm leading-relaxed text-slate-400"
            >
              <span
                aria-hidden="true"
                className="mt-1.5 font-bold text-xs"
                style={{ color: accentColor }}
              >
                ▸
              </span>
              <span className="line-clamp-2">{point}</span>
            </li>
          ))}
        </ul>

        {/* Action buttons */}
        <div className="mt-auto flex gap-3 pt-4 border-t border-slate-700/40">
          {proj.repo && (
            <a
              href={proj.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="font-display flex-1 text-center rounded-lg border px-4 py-2.5 text-sm font-medium transition-all hover:shadow-lg"
              style={{
                borderColor: `${accentColor}40`,
                color: accentColor,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${accentColor}15`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              <span className="inline-block mr-1.5">↗</span>
              View Code
            </a>
          )}
          {proj.demo && (
            <a
              href={proj.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="font-display flex-1 text-center rounded-lg border px-4 py-2.5 text-sm font-medium transition-all"
              style={{
                borderColor: `${accentColor}60`,
                background: `linear-gradient(135deg, ${accentColor}20, ${accentColor}10)`,
                color: accentColor,
              }}
            >
              Live Demo →
            </a>
          )}
        </div>
      </article>
    </Reveal>
  )
}

export default function Projects() {
  return (
    <Section id="projects" label="Projects">
      <Reveal>
        <Eyebrow>What I've built</Eyebrow>
        <Title>Project Universe</Title>
        <p className="mb-8 max-w-2xl text-base text-slate-400">
          Full-stack applications and ML systems — each project a world of its own.
        </p>
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-2 xl:gap-8">
        {profile.projects.map((proj, i) => (
          <ProjectHoloCard key={proj.name} proj={proj} index={i} />
        ))}
      </div>
    </Section>
  )
}
