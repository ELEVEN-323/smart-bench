// 语音播报服务：基于浏览器 Web Speech API，零依赖

export function isTtsSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

/**
 * 朗读文字（中文，语速放慢，适老化）。
 * @returns 是否成功触发播报
 */
export function speak(text: string, onEnd?: () => void): boolean {
  if (!isTtsSupported()) return false

  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'zh-CN'
  utterance.rate = 0.9 // 适老化：稍慢
  utterance.pitch = 1
  utterance.volume = 1
  if (onEnd) utterance.onend = onEnd
  window.speechSynthesis.speak(utterance)
  return true
}

export function stopSpeaking(): void {
  if (isTtsSupported()) {
    window.speechSynthesis.cancel()
  }
}
