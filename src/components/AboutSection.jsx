export default function AboutSection() {
  return (
    <section className="about-section" id="about" aria-label="About section">
      <div className="about-content">

        <p className="section-label">About</p>

        <h2 className="section-heading">
          Who I am
        </h2>

        <p className="section-body">
          Third-year CS undergrad at VIT Vellore. I like building things
          that work—file-sharing systems with semantic search, resume
          parsers that actually save time, browser-native ML tools where
          your data stays on your machine.
        </p>

        <p className="section-body">
          Most of my open-source work comes through GSSoC. I've shipped
          security patches, real-time sync hooks, and offline fixes across
          multiple repos. Outside of code, I'm into competitive
          programming (300+ LC) and figuring out where EE meets CS.
        </p>

        <div className="highlight-card" aria-label="Current work">
          <p>
            Right now I'm building{' '}
            <strong>Tessera</strong> (market intelligence) and an{' '}
            <strong>in-browser AutoML studio</strong> for time-series
            forecasting—no server, no data upload, everything runs locally.
          </p>
        </div>

      </div>
    </section>
  )
}
