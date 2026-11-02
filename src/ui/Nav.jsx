import { NAV } from '../data/stations'
import { profile } from '../data/profile'
import { useActiveSection } from '../lib/hooks'

export default function Nav() {
  const active = useActiveSection()

  return (
    <header className="fixed inset-x-0 top-0 z-30">
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6"
      >
        <a
          href="#hero"
          className="font-display shrink-0 text-sm font-bold tracking-tight text-white sm:text-base"
        >
          RS<span className="text-sky-400">.</span>
        </a>

        {/* Overflow-scroll instead of a hamburger: fewer states, no JS, and the
            links stay reachable by keyboard on every width. */}
        <ul className="panel mx-auto flex max-w-full items-center gap-0.5 overflow-x-auto px-1.5 py-1.5 text-xs [scrollbar-width:none] sm:gap-1 sm:text-sm [&::-webkit-scrollbar]:hidden">
          {NAV.map((item, i) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={active === i ? 'true' : undefined}
                className={`block rounded-lg px-2.5 py-1 whitespace-nowrap transition-colors sm:px-3 ${
                  active === i
                    ? 'bg-sky-400/15 text-sky-300'
                    : 'text-slate-400 hover:text-slate-100'
                }`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href={profile.contact.resume}
          download
          className="hidden shrink-0 rounded-lg border border-sky-400/40 px-3 py-1.5 text-xs font-medium text-sky-300 transition-colors hover:bg-sky-400/10 sm:block"
        >
          Résumé
        </a>
      </nav>
    </header>
  )
}
