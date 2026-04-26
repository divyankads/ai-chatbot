import { profile } from '../data/profile'

export default function Skills() {
  return (
    <div className="section">
      <span className="section-tag">What I Know</span>
      <h2 className="section-title">Skills & <span className="gradient-text">Technologies</span></h2>
      <p className="section-subtitle">A curated mix of creative and technical tools I use to build.</p>

      <div className="skills-grid">
        {profile.skills.map(skill => (
          <div key={skill.category} className="glass skill-card">
            <div className="skill-card-header">
              <span className="skill-icon">{skill.icon}</span>
              <span className="skill-category">{skill.category}</span>
            </div>
            <div className="skill-tags">
              {skill.items.map(item => (
                <span key={item} className="skill-tag">{item}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
