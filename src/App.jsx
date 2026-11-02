import { useEffect } from 'react'
import Nav from './ui/Nav'
import Hero from './ui/Hero'
import About from './ui/About'
import Skills from './ui/Skills'
import Experience from './ui/Experience'
import Projects from './ui/Projects'
import Achievements from './ui/Achievements'
import Contact from './ui/Contact'
import HUD from './ui/HUD'
import CanvasHost from './three/CanvasHost'
import { view, activeSection } from './lib/store'
import { STATIONS } from './data/stations'

function App() {
  useEffect(() => {
    const updateScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      view.progress = docHeight > 0 ? window.scrollY / docHeight : 0

      // Determine which section is most visible
      let maxVisible = 0
      let maxIndex = 0
      STATIONS.forEach((station, i) => {
        const el = document.getElementById(station.id)
        if (!el) return
        const rect = el.getBoundingClientRect()
        const visible = Math.max(
          0,
          Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0)
        )
        if (visible > maxVisible) {
          maxVisible = visible
          maxIndex = i
        }
      })
      activeSection.index = maxIndex
    }

    const updatePointer = (e) => {
      view.pointerX = (e.clientX / window.innerWidth) * 2 - 1
      view.pointerY = -(e.clientY / window.innerHeight) * 2 + 1
    }

    updateScroll()
    window.addEventListener('scroll', updateScroll, { passive: true })
    window.addEventListener('pointermove', updatePointer, { passive: true })

    return () => {
      window.removeEventListener('scroll', updateScroll)
      window.removeEventListener('pointermove', updatePointer)
    }
  }, [])

  return (
    <>
      <CanvasHost />
      <HUD />
      <div className="relative z-10">
        <Nav />
        <main>
          <Hero />
          <About />
          <Skills />
          <Experience />
          <Projects />
          <Achievements />
          <Contact />
        </main>
      </div>
    </>
  )
}

export default App
