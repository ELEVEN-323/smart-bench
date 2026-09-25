// 大模型服务封装层：真实 API + Mock 兜底
import { mockAnswer } from '../mock/answers'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

/**
 * 向大模型提问，返回回答。
 * 优先级：真实 API → 出错/未配置时 → Mock 兜底，保证演示永不失败。
 */
export async function askLLM(question: string): Promise<string> {
  // Mock 优先：默认即 Mock，只有显式设为 false 才走真实 API
  const useMock = import.meta.env.VITE_USE_MOCK !== 'false'
  const apiKey = import.meta.env.VITE_LLM_API_KEY
  const baseUrl = import.meta.env.VITE_LLM_BASE_URL || 'https://api.deepseek.com'

  // 兜底 1：开启 Mock 或未配置 Key
  if (useMock || !apiKey) {
    return mockAnswer(question)
  }

  try {
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: '你是智能助老座椅的语音助手，回答要简洁、亲切、通俗，适合老年人，用中文。',
          },
          { role: 'user', content: question },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const data = await res.json()
    const text = data?.choices?.[0]?.message?.content
    return typeof text === 'string' && text.trim() ? text : '抱歉，我没有听清，请再说一遍。'
  } catch (err) {
    // 兜底 2：请求出错，降级为 Mock
    console.error('大模型调用失败，已降级为 Mock：', err)
    return mockAnswer(question)
  }
}
