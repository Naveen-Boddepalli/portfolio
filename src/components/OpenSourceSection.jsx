import { PORTFOLIO_DATA } from '../data/portfolio'

export default function OpenSourceSection() {
  const { openSource } = PORTFOLIO_DATA

  return (
    <section className="oss-section" id="opensource" aria-label="Open source contributions section">
      <div className="oss-content">

        <h2 className="section-heading">
          Open Source
        </h2>

        <p className="section-body">
          Patches I've shipped through GSSoC—security fixes, real-time
          sync, offline support, CLI tooling.
        </p>

        <div className="oss-list" role="list" aria-label="Open source contributions">
          {openSource.map((item) => (
            <div key={item.repo} className="oss-item" role="listitem">
              <div className="oss-repo">{item.repo}</div>
              <p className="oss-impact">{item.desc}</p>
              <div className="oss-stack" aria-label="Technologies">
                {item.stack.map((s) => (
                  <span key={s} className="oss-badge">{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
