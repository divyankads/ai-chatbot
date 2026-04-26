import { Github, Linkedin, Twitter, Mail } from 'lucide-react'
import { profile } from '../data/profile'

export default function Contact() {
  return (
    <div className="section">
      <span className="section-tag">Say Hello</span>
      <h2 className="section-title">Get In <span className="gradient-text">Touch</span></h2>
      <p className="section-subtitle">Have a project, a question, or just want to connect? My inbox is always open.</p>

      <div className="contact-box">
        <p style={{ color: 'var(--text-sub)', maxWidth: 480, margin: '0 auto' }}>
          Whether you're building something cool, need a creative perspective on a problem, or just want to say hi —
          I'd love to hear from you. ✨
        </p>
        <div className="contact-email">
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
        </div>

        <div className="contact-socials">
          {profile.social.github && (
            <a href={profile.social.github} target="_blank" rel="noreferrer" className="contact-social-btn">
              <Github size={16}/> GitHub
            </a>
          )}
          {profile.social.linkedin && (
            <a href={profile.social.linkedin} target="_blank" rel="noreferrer" className="contact-social-btn">
              <Linkedin size={16}/> LinkedIn
            </a>
          )}
          {profile.social.twitter && (
            <a href={profile.social.twitter} target="_blank" rel="noreferrer" className="contact-social-btn">
              <Twitter size={16}/> Twitter
            </a>
          )}
          <a href={`mailto:${profile.email}`} className="contact-social-btn">
            <Mail size={16}/> Email Me
          </a>
        </div>
      </div>
    </div>
  )
}
