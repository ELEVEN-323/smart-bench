import { useState, useRef, useEffect } from 'react'
import { Send, Volume2, Square } from 'lucide-react'
import { askLLM } from '../services/llm'
import { speak, stopSpeaking, isTtsSupported } from '../services/tts'
import './assistant.css'

interface Msg {
  role: 'user' | 'assistant'
  content: string
}

const QUICK_QUESTIONS = ['今天天气怎么样？', '附近的医院在哪？', '最近的公交站', '现在几点了？']

const TIPS = ['大字体 · 高对比，看清每一个字', '慢语速播报，语速约 0.9 倍', '支持方言识别与二次确认']

const EXAMPLES = ['今天天气怎么样？', '最近的医院在哪？', '帮我放一段戏曲', '提醒我下午三点吃药']

export default function Assistant() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: 'assistant',
      content: '您好呀！我是您的贴心小助手。有什么可以帮您的吗？您可以问我天气、附近的医院、公交站，或者直接和我聊聊天。',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)

  /* 只把消息区滚到底，不要把整页一起拽下去 */
  useEffect(() => {
    const el = boxRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
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
      <div className="page-head">
        <span className="page-kicker">AI 交互</span>
        <h2>语音助手</h2>
        <p className="page-sub">
          大模型问答 + 语音播报（当前 {import.meta.env.VITE_USE_MOCK !== 'false' ? 'Mock 模式' : '真实 API 模式'}）
        </p>
      </div>

      <div className="assistant-layout">
        <section className="chat-stage">
          <header className="chat-head">
            <span className="chat-label">对话</span>
            {isTtsSupported() ? (
              <div className="chat-tts">
                <button className="tts-btn" onClick={handleSpeak} disabled={speaking || !lastAnswer}>
                  <Volume2 size={17} />
                  播报上一条
                </button>
                <button className="tts-btn" onClick={handleStop} disabled={!speaking}>
                  <Square size={15} />
                  停止
                </button>
              </div>
            ) : (
              <span className="tts-hint">当前浏览器不支持语音合成，请用 Chrome / Edge</span>
            )}
          </header>

          <div className="chat-box" ref={boxRef}>
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
          </div>

          <div className="chat-foot">
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
                <Send size={18} />
                发送
              </button>
            </form>
          </div>
        </section>

        <aside className="assistant-side">
          <section className="panel">
            <h3 className="panel-title">长辈模式</h3>
            <ul className="assistant-tips">
              {TIPS.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </section>
          <section className="panel">
            <h3 className="panel-title">可以这样问</h3>
            <ul className="assistant-examples">
              {EXAMPLES.map((e) => (
                <li key={e}>
                  <button type="button" className="example-btn" onClick={() => send(e)} disabled={loading}>
                    {e}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  )
}
