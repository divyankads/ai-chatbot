import { Github, ExternalLink } from 'lucide-react'
import { profile } from '../data/profile'

export default function Projects() {
  return (
    <div className="section">
      <span className="section-tag">What I've Built</span>
      <h2 className="section-title">Projects</h2>
      <p className="section-subtitle">A selection of things I've built, shipped, or am currently obsessing over.</p>

      <div className="projects-grid">
        {profile.projects.map(project => (
          <div key={project.name} className="glass project-card">
            <div className="project-header">
              <span className="project-title">{project.name}</span>
              {project.featured && <span className="project-featured">⭐ Featured</span>}
            </div>
            <p className="project-desc">{project.description}</p>
            <div className="tech-tags">
              {project.tech.map(t => <span key={t} className="tech-tag">{t}</span>)}
            </div>
            <div className="project-links">
              {project.github && (
                <a href={project.github} target="_blank" rel="noreferrer" className="project-link">
                  <Github size={13}/> Code
                </a>
              )}
              {project.live && project.live !== '#' && (
                <a href={project.live} target="_blank" rel="noreferrer" className="project-link">
                  <ExternalLink size={13}/> Live
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
