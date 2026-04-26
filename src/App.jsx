import { useState } from 'react'
import Hero      from './components/Hero'
import About     from './components/About'
import Skills    from './components/Skills'
import Experience from './components/Experience'
import Projects  from './components/Projects'
import Education from './components/Education'
import Contact   from './components/Contact'
import ChatBot   from './components/ChatBot'

const NAV_LINKS = ['about','skills','experience','projects','education','contact']

export default function App() {
  const [chatOpen, setChatOpen] = useState(false)

  return (
    <>
      {/* Navbar */}
      <nav className="nav">
        <span className="nav-logo">Divyanka.dev</span>
        <ul className="nav-links">
          {NAV_LINKS.map(s => (
            <li key={s}>
              <a href={`#${s}`}>{s.charAt(0).toUpperCase() + s.slice(1)}</a>
            </li>
          ))}
        </ul>
        <button
          className="btn-primary"
          onClick={() => setChatOpen(true)}
          style={{ padding:'9px 20px', fontSize:'.82rem' }}
          id="nav-chat-btn"
        >
          🤖 Ask AI About Me
        </button>
      </nav>

      {/* Portfolio */}
      <main className={`portfolio-main${chatOpen ? ' chat-open' : ''}`}>
        <section id="home">    <Hero /></section>
        <section id="about">   <About /></section>
        <section id="skills">  <Skills /></section>
        <section id="experience"><Experience /></section>
        <section id="projects"><Projects /></section>
        <section id="education"><Education /></section>
        <section id="contact"> <Contact /></section>

        <footer className="footer">
          <span>© 2025 Divyanka Das · Built with React & Gemini AI</span>
          <span style={{ color:'var(--purple-light)' }}>Not perfect. Not finished. But always becoming. ✨</span>
        </footer>
      </main>

      {/* Chatbot sidebar */}
      <ChatBot isOpen={chatOpen} onClose={() => setChatOpen(false)} />

      {/* Floating bubble when closed */}
      {!chatOpen && (
        <button
          id="chat-float-btn"
          className="chat-toggle-btn"
          onClick={() => setChatOpen(true)}
          aria-label="Open AI chatbot"
          title="Chat with my AI assistant"
        >
          🤖
        </button>
      )}
    </>
  )
}
