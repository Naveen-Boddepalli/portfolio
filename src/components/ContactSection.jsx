import { PORTFOLIO_DATA } from '../data/portfolio'

export default function ContactSection() {
  const { github, linkedin, email, leetcode, twitter } = PORTFOLIO_DATA

  const links = [
    {
      label: 'GitHub',
      href: github,
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.1.82-.26.82-.57v-2c-3.34.72-4.04-1.61-4.04-1.61-.54-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.23 1.84 1.23 1.07 1.83 2.8 1.3 3.49 1 .1-.78.41-1.3.75-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.13 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.68.82.57C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
        </svg>
      ),
    },
    {
      label: 'LinkedIn',
      href: linkedin,
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zm1.78 13.02H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45C23.21 24 24 23.23 24 22.27V1.73C24 .77 23.21 0 22.22 0z"/>
        </svg>
      ),
    },
    {
      label: 'LeetCode',
      href: leetcode,
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M16.102 17.93l-2.697 2.607c-.466.467-1.111.662-1.823.662s-1.357-.195-1.824-.662l-4.332-4.363c-.467-.467-.702-1.15-.702-1.863s.235-1.357.702-1.824l4.319-4.38c.467-.467 1.125-.645 1.837-.645s1.357.195 1.823.662l2.697 2.606c.514.515 1.365.497 1.9-.038.535-.536.553-1.387.038-1.9l-2.609-2.609c-.875-.874-2.11-1.374-3.299-1.374H9.18c-1.189 0-2.436.5-3.312 1.374L1.557 12.17c-.875.875-1.375 2.11-1.375 3.3 0 1.19.5 2.424 1.375 3.3l4.311 4.313c.875.875 2.123 1.312 3.312 1.312h.433c1.189 0 2.424-.437 3.3-1.312l2.609-2.608c.515-.515.498-1.366-.037-1.9-.535-.535-1.387-.552-1.883-.037zm3.158-14.543c-1.09-1.09-2.56-1.562-3.748-1.562-1.189 0-2.657.472-3.748 1.562l-1.25 1.25c-.514.514-.497 1.365.038 1.9.536.535 1.387.552 1.9.037l1.25-1.25c.514-.514 1.09-.75 1.81-.75.72 0 1.297.236 1.81.75l1.25 1.25c.515.515 1.366.497 1.9-.038.535-.535.553-1.386.038-1.9l-1.25-1.249z"/>
        </svg>
      ),
    },
    {
      label: 'X (Twitter)',
      href: twitter,
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
    },
  ]

  return (
    <section className="contact-section" id="contact" aria-label="Contact section">
      <div className="contact-content">

        <h2 className="contact-heading">
          Say hi<span className="spectrum">.</span>
        </h2>

        <p className="contact-sub">
          Looking for internships and interesting side projects.
          If you've got something worth building, reach out.
        </p>

        <div className="contact-links" role="list" aria-label="Social links">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link"
              role="listitem"
              aria-label={`Visit ${l.label}`}
            >
              {l.icon}
              {l.label}
            </a>
          ))}
        </div>

        <a
          href={`mailto:${email}`}
          className="email-big"
          aria-label={`Email ${email}`}
        >
          {email}
        </a>

      </div>
    </section>
  )
}
