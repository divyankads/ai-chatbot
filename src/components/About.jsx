import { profile } from '../data/profile'
import photo from '../assets/photo.png'

export default function About() {
  return (
    <div className="section">
      <span className="section-tag">Who I Am</span>
      <h2 className="section-title">
        About <span className="gradient-text">Me</span>
      </h2>

      <div className="about-grid">

        {/* Photo */}
        <div className="about-photo-wrap">
          <img
            src={photo}
            alt={profile.name}
            className="about-photo"
          />
          <div className="about-photo-deco" />
        </div>

        {/* Story */}
        <div>

          <blockquote className="about-quote">
            "A Computer Science student, a creator, and someone constantly evolving.
            Not perfect. Not finished. But always becoming."
          </blockquote>

          <p className="about-bio">{profile.bio}</p>

          <div className="about-tags">
            {profile.personalityTags.map(tag => (
              <span key={tag} className="about-tag">{tag}</span>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}