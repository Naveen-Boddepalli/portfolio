import { useState, useEffect, useRef, Suspense } from 'react'
import Scene from './components/Scene'
import HeroSection from './components/HeroSection'
import AboutSection from './components/AboutSection'
import ProjectsSection from './components/ProjectsSection'
import OpenSourceSection from './components/OpenSourceSection'
import SkillsSection from './components/SkillsSection'
import ContactSection from './components/ContactSection'
import { PRISM_PHASES } from './data/portfolio'

// ─── Loading Screen ───────────────────────────────────────────
function LoadingScreen({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2200)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div className="loading-screen" role="status" aria-live="polite">
      <div className="loading-laser" aria-hidden="true" />
      <p className="loading-text">Loading...</p>
      <div className="loading-bar" aria-hidden="true">
        <div className="loading-bar-fill" />
      </div>
    </div>
  )
}

// ─── Nav ──────────────────────────────────────────────────────
function Nav() {
  return (
    <header>
      <nav className="nav" aria-label="Primary navigation">
        <a href="#hero" className="nav-logo" aria-label="Home">
          NB<span>.</span>
        </a>
        <ul className="nav-links">
          {[
            ['About', '#about'],
            ['Projects', '#projects'],
            ['Open Source', '#opensource'],
            ['Skills', '#skills'],
            ['Contact', '#contact'],
          ].map(([label, href]) => (
            <li key={label}>
              <a href={href}>{label}</a>
            </li>
          ))}
        </ul>
        <a
          href="https://github.com/Naveen-Boddepalli"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-cta"
          aria-label="GitHub profile"
        >
          GitHub ↗
        </a>
      </nav>
    </header>
  )
}

// ─── Phase dots ───────────────────────────────────────────────
function PhaseIndicator({ currentPhase, onDotClick }) {
  return (
    <nav className="phase-indicator" aria-label="Section navigation">
      {PRISM_PHASES.map((phase, i) => (
        <button
          key={phase.name}
          className={`phase-dot${currentPhase === i ? ' active' : ''}`}
          onClick={() => onDotClick(i)}
          aria-label={phase.name}
          aria-current={currentPhase === i ? 'true' : undefined}
          title={phase.name}
        />
      ))}
    </nav>
  )
}

// ─── Scroll hint ──────────────────────────────────────────────
function ScrollHint() {
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const h = () => { if (window.scrollY > 60) setVisible(false) }
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])
  if (!visible) return null
  return (
    <div className="scroll-hint" aria-hidden="true">
      <span className="scroll-hint-text">Scroll</span>
      <div className="scroll-hint-line" />
    </div>
  )
}

// ─── Section → phase map ──────────────────────────────────────
const SECTION_PHASE = {
  hero: 0,
  about: 1,
  projects: 2,
  opensource: 3,
  skills: 4,
  contact: 5,
}

// ─── App ──────────────────────────────────────────────────────
export default function App() {
  const [loadingDone, setLoadingDone] = useState(false)
  const [currentPhase, setCurrentPhase] = useState(0)

  // use a ref for mouseY so it never triggers React re-renders.
  // The useFrame callback in SpectralBeams reads this ref directly.
  const mouseYRef = useRef(0)

  // Phase ref for the 3D scene to prevent Canvas re-renders
  const phaseRef = useRef(0)

  // Mouse tracking — writes to REF only, no state update
  useEffect(() => {
    const onMove = (e) => {
      // Map screen Y [0, innerHeight] → 3D y [-2.8, 2.8]
      const h = window.innerHeight || 1;
      const y = (0.5 - e.clientY / h) * 5.6;
      // Safeguard against NaN which would crash WebGL shaders
      mouseYRef.current = Number.isFinite(y) ? y : 0;
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // IntersectionObserver for scroll-based phase detection
  useEffect(() => {
    if (!loadingDone) return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const phase = SECTION_PHASE[entry.target.id]
            if (phase !== undefined) {
              setCurrentPhase(phase)
              phaseRef.current = phase // Update ref for 3D scene
            }
          }
        })
      },
      { threshold: 0.4 }
    )
    document.querySelectorAll('section[id]').forEach((s) => obs.observe(s))
    return () => obs.disconnect()
  }, [loadingDone])

  const handleDotClick = (idx) => {
    const id = Object.keys(SECTION_PHASE).find((k) => SECTION_PHASE[k] === idx)
    if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {!loadingDone && (
        <LoadingScreen onDone={() => setLoadingDone(true)} />
      )}

      {loadingDone && (
        <>
          {/* Fixed WebGL canvas - pointer-events: none stops R3F from raycasting on mousemove */}
          <div className="canvas-wrapper" style={{ pointerEvents: 'none' }} aria-hidden="true">
            <Scene phaseRef={phaseRef} mouseYRef={mouseYRef} />
          </div>

          <Nav />

          <PhaseIndicator currentPhase={currentPhase} onDotClick={handleDotClick} />

          <ScrollHint />

          <main className="scroll-container" aria-label="Portfolio sections">
            <HeroSection />
            <AboutSection />
            <ProjectsSection />
            <OpenSourceSection />
            <SkillsSection />
            <ContactSection />

            <footer className="footer" role="contentinfo">
              <p className="footer-text">
                Built by Naveen Boddepalli ·{' '}
                <span style={{
                  background: 'linear-gradient(90deg,#FF453A,#FF9F0A,#FFD60A,#32D74B,#64D2FF,#0A84FF,#BF5AF2)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>2026</span>
              </p>
            </footer>
          </main>
        </>
      )}
    </>
  )
}
