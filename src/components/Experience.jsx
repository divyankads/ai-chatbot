import { profile } from '../data/profile'

export default function Experience() {
  return (
    <div className="section">
      <span className="section-tag">My Journey</span>
      <h2 className="section-title">Experience</h2>
      <p className="section-subtitle">From crafting words to crafting code — every step shaped who I am.</p>

      <div className="timeline">
        {[...profile.experience].reverse().map(exp => (
          <div key={exp.company + exp.role} className="timeline-item">
            <div className="tl-card glass">
              <span className={`tl-badge${exp.current ? ' current' : ''}`}>
                {exp.current ? '🟢 Present' : '✅ Completed'}
              </span>
              <div className="tl-role">{exp.role}</div>
              <div className="tl-company">{exp.company}</div>
              <div className="tl-meta">{exp.duration} · {exp.location}</div>
              <p className="tl-desc">{exp.description}</p>
              <div className="tl-tech">
                {exp.tech.map(t => <span key={t} className="tl-tech-tag">{t}</span>)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
