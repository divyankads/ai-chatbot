import { useState, useRef, useEffect } from 'react'
import { Send, X, Sparkles, Briefcase } from 'lucide-react'
import { sendMessage } from '../services/gemini'
import { profile } from '../data/profile'

const SUGGESTIONS = [
  '👋 Tell me about Divyanka',
  '✍️ Content writing story?',
  '💻 What are her skills?',
  '🚀 Show me her projects',
  '🎓 Her education?',
  '📧 How to contact her?',
]

function formatTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const makeWelcome = (mode) => ({
  id: 'welcome',
  role: 'bot',
  mode,
  content: mode === 'emotional'
    ? `Hey there 💜 I'm Divyanka's AI — and I'm so glad you're here. Ask me anything about her journey, her story, her dreams. This is a safe, warm space. ✨`
    : `Hi! 👋 I'm Divyanka's AI assistant, powered by Google Gemini. Ask me anything about her skills, projects, experience, or how to get in touch.`,
  time: formatTime(),
})

export default function ChatBot({ isOpen, onClose }) {
  const [mode, setMode]       = useState('professional')
  const [messages, setMessages] = useState([makeWelcome('professional')])
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const messagesEndRef = useRef(null)
  const inputRef       = useRef(null)

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 350)
  }, [isOpen])

  // When mode changes, reset with new welcome message
  const switchMode = (newMode) => {
    if (newMode === mode) return
    setMode(newMode)
    setMessages([makeWelcome(newMode)])
    setError('')
  }

  const handleSend = async (text) => {
    const userText = (text || input).trim()
    if (!userText || loading) return

    setInput('')
    setError('')

    const userMsg = { id: Date.now(), role: 'user', content: userText, time: formatTime() }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      const history = messages
        .filter(m => m.id !== 'welcome')
        .map(m => ({ role: m.role === 'bot' ? 'assistant' : 'user', content: m.content }))

      const reply = await sendMessage(
        userText,
        [...history, { role: 'user', content: userText }],
        mode
      )
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'bot', content: reply, time: formatTime() }])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  return (
    <aside className={`chatbot-sidebar${isOpen ? '' : ' closed'}`} aria-label="AI Chatbot">

      {/* Header */}
      <div className="chat-header">
        <div className="chat-avatar">🤖</div>
        <div className="chat-header-info">
          <div className="chat-header-name">Ask About Divyanka</div>
          <div className="chat-header-status">
            <span className="status-dot" />
            Powered by Google Gemini
          </div>
        </div>
        <button className="chat-close-btn" onClick={onClose} aria-label="Close chat"><X size={15}/></button>
      </div>

      {/* Mode Toggle */}
      <div className="chat-mode-toggle" role="group" aria-label="Response mode">
        <button
          id="mode-emotional"
          className={`mode-btn${mode === 'emotional' ? ' active' : ''}`}
          onClick={() => switchMode('emotional')}
        >
          🎭 Emotional
        </button>
        <button
          id="mode-professional"
          className={`mode-btn${mode === 'professional' ? ' active' : ''}`}
          onClick={() => switchMode('professional')}
        >
          💼 Professional
        </button>
      </div>

      {/* Suggestion chips */}
      <div className="chat-suggestions">
        {SUGGESTIONS.map(s => (
          <button
            key={s}
            className="suggestion-chip"
            onClick={() => handleSend(s.replace(/^[^\s]+\s/, ''))}
            disabled={loading}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="chat-messages" role="log" aria-live="polite">
        {messages.map(msg => (
          <div key={msg.id} className={`msg ${msg.role}`}>
            <div className="msg-avatar">{msg.role === 'bot' ? '🤖' : '🙋'}</div>
            <div>
              <div className="msg-bubble">{msg.content}</div>
              <div className="msg-time">{msg.time}</div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="msg bot">
            <div className="msg-avatar">🤖</div>
            <div className="typing-indicator">
              <div className="typing-dot"/><div className="typing-dot"/><div className="typing-dot"/>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="chat-input-area">
        {error && <div className="chat-error">{error}</div>}
        <div className="chat-input-row">
          <textarea
            ref={inputRef}
            id="chat-input"
            className="chat-input"
            placeholder={`Ask anything about ${profile.name}...`}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={loading}
            aria-label="Chat message input"
          />
          <button
            id="chat-send-btn"
            className="chat-send-btn"
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            aria-label="Send message"
          >
            <Send size={16}/>
          </button>
        </div>
        <p style={{ fontSize:'.67rem', color:'var(--text-muted)', marginTop:'7px', textAlign:'center' }}>
          Gemini AI · Enter to send · Shift+Enter for new line
        </p>
      </div>
    </aside>
  )
}
