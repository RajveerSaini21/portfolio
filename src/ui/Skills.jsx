import { profile } from '../data/profile'
import { Eyebrow, Reveal, Section, Title } from './primitives'

/**
 * Technology constellation — skills displayed as interconnected nodes
 * with lines between related technologies, fitting the space theme.
 */
function ConstellationNode({ name, color, x, y, size = 'normal' }) {
  const isLarge = size === 'large'
  return (
    <div
      className="absolute flex flex-col items-center gap-1 transition-all duration-300 hover:scale-110"
      style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
    >
      {/* Glow dot */}
      <div
        className="rounded-full transition-all duration-300"
        style={{
          width: isLarge ? '10px' : '7px',
          height: isLarge ? '10px' : '7px',
          backgroundColor: color,
          boxShadow: `0 0 ${isLarge ? '16px' : '10px'} ${color}80`,
        }}
      />
      <span
        className="font-display font-semibold text-center whitespace-nowrap"
        style={{
          fontSize: isLarge ? '13px' : '11px',
          color: isLarge ? '#e2e8f0' : '#94a3b8',
        }}
      >
        {name}
      </span>
    </div>
  )
}

/** SVG lines connecting constellation nodes */
function ConstellationLines({ connections, width, height }) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
    >
      {connections.map((conn, i) => (
        <line
          key={i}
          x1={conn[0]}
          y1={conn[1]}
          x2={conn[2]}
          y2={conn[3]}
          stroke={conn[4] || '#334155'}
          strokeWidth="1"
          strokeOpacity="0.4"
        />
      ))}
    </svg>
  )
}

export default function Skills() {
  // Language nodes
  const langNodes = [
    { name: 'Java', x: 35, y: 18, color: '#38bdf8', size: 'large' },
    { name: 'Python', x: 60, y: 12, color: '#38bdf8', size: 'large' },
    { name: 'JavaScript', x: 75, y: 25, color: '#38bdf8', size: 'large' },
    { name: 'SQL', x: 20, y: 28, color: '#38bdf8' },
    { name: 'HTML', x: 50, y: 22, color: '#38bdf8' },
    { name: 'CSS', x: 45, y: 30, color: '#38bdf8' },
  ]

  // Framework nodes
  const fwNodes = [
    { name: 'React.js', x: 25, y: 45, color: '#a78bfa', size: 'large' },
    { name: 'Node.js', x: 55, y: 42, color: '#a78bfa', size: 'large' },
    { name: 'Express.js', x: 40, y: 50, color: '#a78bfa' },
    { name: 'MongoDB', x: 70, y: 48, color: '#a78bfa' },
    { name: 'REST API', x: 60, y: 55, color: '#a78bfa' },
  ]

  // ML nodes
  const mlNodes = [
    { name: 'TensorFlow', x: 15, y: 68, color: '#34d399', size: 'large' },
    { name: 'Scikit-learn', x: 40, y: 65, color: '#34d399', size: 'large' },
    { name: 'Pandas', x: 60, y: 70, color: '#34d399' },
    { name: 'NumPy', x: 78, y: 66, color: '#34d399' },
    { name: 'Keras', x: 28, y: 75, color: '#34d399' },
    { name: 'Matplotlib', x: 55, y: 78, color: '#34d399' },
  ]

  // Tool nodes
  const toolNodes = [
    { name: 'Git', x: 30, y: 88, color: '#fbbf24', size: 'large' },
    { name: 'GitHub', x: 50, y: 85, color: '#fbbf24' },
    { name: 'VS Code', x: 65, y: 90, color: '#fbbf24' },
    { name: 'Linux', x: 42, y: 95, color: '#fbbf24' },
  ]

  // Constellation lines (x1%, y1%, x2%, y2%, color)
  const connections = [
    // Language connections
    [35, 18, 60, 12, '#38bdf860'],
    [60, 12, 75, 25, '#38bdf860'],
    [35, 18, 20, 28, '#38bdf840'],
    [50, 22, 45, 30, '#38bdf840'],
    [45, 30, 60, 12, '#38bdf830'],
    // Framework connections
    [25, 45, 40, 50, '#a78bfa60'],
    [40, 50, 55, 42, '#a78bfa60'],
    [55, 42, 70, 48, '#a78bfa40'],
    [60, 55, 55, 42, '#a78bfa30'],
    // ML connections
    [15, 68, 40, 65, '#34d39960'],
    [40, 65, 60, 70, '#34d39960'],
    [60, 70, 78, 66, '#34d39940'],
    [28, 75, 15, 68, '#34d39930'],
    // Tool connections
    [30, 88, 50, 85, '#fbbf2460'],
    [50, 85, 65, 90, '#fbbf2440'],
    [42, 95, 30, 88, '#fbbf2430'],
    // Cross-group connections
    [75, 25, 55, 42, '#ffffff15'],
    [55, 42, 40, 65, '#ffffff15'],
    [40, 65, 50, 85, '#ffffff15'],
  ]

  return (
    <Section id="skills" label="Skills">
      <Reveal>
        <Eyebrow>Toolkit</Eyebrow>
        <Title>Technology Constellation</Title>
        <p className="mb-8 max-w-2xl text-base text-slate-400">
          My tech stack mapped as an interconnected constellation — each node a tool I've used to build real projects.
        </p>
      </Reveal>

      {/* Legend */}
      <Reveal delay={0.1}>
        <div className="flex flex-wrap gap-4 mb-6">
          {profile.skillGroups.map((g) => (
            <div key={g.name} className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: g.color, boxShadow: `0 0 8px ${g.color}60` }} />
              <span className="font-mono text-xs text-slate-400">{g.name}</span>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Constellation visualization */}
      <Reveal delay={0.15}>
        <div className="panel p-6 sm:p-8 relative" style={{ minHeight: '500px' }}>
          <ConstellationLines connections={connections} width={100} height={100} />

          {/* Language nodes */}
          {langNodes.map((n) => (
            <ConstellationNode key={n.name} {...n} />
          ))}

          {/* Framework nodes */}
          {fwNodes.map((n) => (
            <ConstellationNode key={n.name} {...n} />
          ))}

          {/* ML nodes */}
          {mlNodes.map((n) => (
            <ConstellationNode key={n.name} {...n} />
          ))}

          {/* Tool nodes */}
          {toolNodes.map((n) => (
            <ConstellationNode key={n.name} {...n} />
          ))}
        </div>
      </Reveal>

      {/* Compact detail cards below */}
      <Reveal delay={0.2}>
        <div className="grid gap-4 mt-6 sm:grid-cols-2 lg:grid-cols-3">
          {profile.skillGroups.map((group, i) => (
            <div key={group.name} className="panel p-4 group hover:scale-[1.01] transition-transform">
              <h3 className="font-display mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: group.color, boxShadow: `0 0 8px ${group.color}60` }}
                />
                {group.name}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-md px-2 py-1 text-xs text-slate-400 border border-slate-700/50 bg-slate-900/40"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  )
}
