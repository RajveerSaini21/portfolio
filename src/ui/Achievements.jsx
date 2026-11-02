import { profile } from '../data/profile'
import { Eyebrow, Reveal, Section, Title } from './primitives'

export default function Achievements() {
  return (
    <Section id="achievements" label="Achievements">
      <Reveal>
        <Eyebrow>Recognition</Eyebrow>
        <Title>Achievements & Certifications</Title>
      </Reveal>

      <div className="grid gap-4 sm:grid-cols-2">
        {profile.achievements.map((achievement, i) => (
          <Reveal key={achievement.title} delay={i * 0.07}>
            <div className="panel p-5">
              <h3 className="font-display text-base font-semibold text-white">
                {achievement.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {achievement.detail}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
