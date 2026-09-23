import { useState, useRef, useEffect } from 'react'
import { askLLM } from '../services/llm'
import { speak, stopSpeaking, isTtsSupported } from '../services/tts'
import './assistant.css'

interface Msg {
  role: 'user' | 'assistant'
  content: string
}

const QUICK_QUESTIONS = ['今天天气怎么样？', '附近的医院在哪？', '最近的公交站', '现在几点了？']

export default function Assistant() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: 'assistant',
      content: '您好呀！我是您的贴心小助手 😊 有什么可以帮您的吗？您可以问我天气、附近的医院、公交站，或者直接和我聊聊天。',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = async (text: string) => {
    const q = text.trim()
    if (!q || loading) return
    setInput('')
    setMessages((m) => [...m, { role: 'user', content: q }])
    setLoading(true)
    const answer = await askLLM(q)
    setMessages((m) => [...m, { role: 'assistant', content: answer }])
    setLoading(false)
  }

  const lastAnswer = [...messages].reverse().find((m) => m.role === 'assistant')?.content

  const handleSpeak = () => {
    if (!lastAnswer || speaking) return
    const ok = speak(lastAnswer, () => setSpeaking(false))
    if (ok) setSpeaking(true)
  }

  const handleStop = () => {
    stopSpeaking()
    setSpeaking(false)
  }

  return (
    <div className="assistant">
      <div className="assistant-head">
        <h2>🎤 语音助手</h2>
        <p className="assistant-sub">
          大模型问答 + 语音播报（当前 {import.meta.env.VITE_USE_MOCK === 'true' ? 'Mock 模式' : '真实 API 模式'}）
        </p>
      </div>

      <div className="chat-box">
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>
            <div className="msg-bubble">{m.content}</div>
          </div>
        ))}
        {loading && (
          <div className="msg assistant">
            <div className="msg-bubble typing">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="quick-row">
        {QUICK_QUESTIONS.map((q) => (
          <button key={q} className="quick-btn" onClick={() => send(q)} disabled={loading}>
            {q}
          </button>
        ))}
      </div>

      <form
        className="input-row"
        onSubmit={(e) => {
          e.preventDefault()
          send(input)
        }}
      >
        <input
          className="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="请输入您的问题，例如：附近的医院在哪？"
          disabled={loading}
        />
        <button className="send-btn" type="submit" disabled={loading || !input.trim()}>
          发送
        </button>
      </form>

      <div className="action-row">
        {isTtsSupported() ? (
          <>
            <button className="action-btn speak" onClick={handleSpeak} disabled={speaking || !lastAnswer}>
              🔊 播报上一条
            </button>
            <button className="action-btn stop" onClick={handleStop} disabled={!speaking}>
              ⏹ 停止播报
            </button>
          </>
        ) : (
          <p className="tts-hint">当前浏览器不支持语音合成，请使用 Chrome / Edge。</p>
        )}
      </div>
    </div>
  )
}
