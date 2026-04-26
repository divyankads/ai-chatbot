import { profile } from '../data/profile'

export default function Education() {
  return (
    <div className="section">
      <span className="section-tag">Academic Background</span>
      <h2 className="section-title">Education</h2>
      <p className="section-subtitle">The institutions that gave me structure — and the curiosity that did the rest.</p>

      <div className="edu-grid">
        {profile.education.map(edu => (
          <div key={edu.institution} className="glass edu-card">
            <div className="edu-institution">{edu.institution}</div>
            <div className="edu-degree">{edu.degree}</div>
            <div className="edu-meta">{edu.duration}</div>
            <div className="edu-grade">{edu.grade}</div>
            {edu.highlights.length > 0 && (
              <div className="edu-chips">
                {edu.highlights.map(h => <span key={h} className="edu-chip">{h}</span>)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
