import { PORTFOLIO_DATA } from '../data/portfolio'

export default function SkillsSection() {
  const { skills } = PORTFOLIO_DATA

  return (
    <section className="skills-section" id="skills" aria-label="Skills section">
      <div className="skills-content">

        <h2 className="section-heading">
          Stack
        </h2>

        <div className="skills-categories" role="list">
          {skills.map((cat) => (
            <div key={cat.category} role="listitem">
              <p
                className="skill-category-label"
                style={{ color: cat.color }}
              >
                {cat.category}
              </p>
              <div className="skill-chips">
                {cat.items.map((skill) => (
                  <span
                    key={skill}
                    className="skill-chip"
                    style={{ borderColor: `${cat.color}28` }}
                    title={skill}
                  >
                    <span
                      className="dot"
                      style={{ background: cat.color }}
                      aria-hidden="true"
                    />
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
