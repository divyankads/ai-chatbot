import { Github, Linkedin, Twitter, Mail } from 'lucide-react'
import { profile } from '../data/profile'
import photo from '../assets/photo.png'

export default function Hero() {
  return (
    <div className="hero">
      <div className="hero-content">

        {/* Photo */}
        <div className="hero-photo-wrap fade-in fade-in-1">
          <div className="hero-photo-ring" />
          <img src={photo} alt={profile.name} className="hero-photo" />
        </div>

        <div className="hero-greeting fade-in fade-in-2">
          <span>✨</span> Hi, I'm
        </div>

        <h1 className="hero-name fade-in fade-in-2">
          <span className="gradient-text">{profile.name}</span>
        </h1>

        <p className="hero-role fade-in fade-in-3">{profile.title}</p>

        {/* Her own words */}
        <p className="hero-tagline fade-in fade-in-3">
          A creator, and someone constantly evolving.<br />
          <em>{profile.tagline}</em>
        </p>

        <div className="hero-actions fade-in fade-in-4">
          <a href="#projects" className="btn-primary">🚀 View My Work</a>
          <a href="#about"    className="btn-ghost">✨ My Story</a>
        </div>

        <div className="hero-socials fade-in fade-in-4">
          {profile.social.github   && <a href={profile.social.github}   target="_blank" rel="noreferrer" className="social-icon" title="GitHub"><Github size={18}/></a>}
          {profile.social.linkedin && <a href={profile.social.linkedin} target="_blank" rel="noreferrer" className="social-icon" title="LinkedIn"><Linkedin size={18}/></a>}
          {profile.social.twitter  && <a href={profile.social.twitter}  target="_blank" rel="noreferrer" className="social-icon" title="Twitter"><Twitter size={18}/></a>}
          <a href={`mailto:${profile.email}`} className="social-icon" title="Email"><Mail size={18}/></a>
        </div>

        <div className="hero-stats fade-in fade-in-4">
          <div><div className="hero-stat-num">2+</div><div className="hero-stat-label">Years Building</div></div>
          <div><div className="hero-stat-num">{profile.projects.length}+</div><div className="hero-stat-label">Projects</div></div>
          <div><div className="hero-stat-num">{profile.skills.reduce((a,s)=>a+s.items.length,0)}+</div><div className="hero-stat-label">Technologies</div></div>
          <div><div className="hero-stat-num">∞</div><div className="hero-stat-label">Curiosity</div></div>
        </div>
      </div>
    </div>
  )
}
