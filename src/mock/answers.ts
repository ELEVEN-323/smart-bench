// Mock 问答数据：未配置大模型 Key 时的兜底回答
export function mockAnswer(question: string): string {
  const q = question.trim()

  if (/天气|下雨|晴天|温度/.test(q)) {
    return '今天天气晴朗，气温 25 度，适合外出活动，记得多喝水、注意防晒。'
  }
  if (/医院|看病|挂号|诊所|医生/.test(q)) {
    return '最近的社区医院在 500 米外，步行约 8 分钟。需要我帮您导航过去吗？'
  }
  if (/公交|地铁|交通|车站|怎么去/.test(q)) {
    return '最近的公交站就在路口，步行约 3 分钟，有 12 路和 25 路经过。'
  }
  if (/电话|联系|家人|儿子|女儿|呼叫/.test(q)) {
    return '您点击屏幕上的红色 SOS 按钮，就能一键呼叫家人或紧急联系人。'
  }
  if (/时间|几点|日期|今天星期/.test(q)) {
    const now = new Date()
    return `现在是 ${now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}，${now.toLocaleDateString('zh-CN', { weekday: 'long' })}。`
  }
  if (/紧急|救命|急救|不舒服|摔倒|头晕/.test(q)) {
    return '请立即按下红色的 SOS 紧急按钮，我会马上帮您联系急救中心，请保持冷静！'
  }
  if (/充电|电量|手机没电/.test(q)) {
    return '座椅右侧提供扫码充电服务，扫码后即可为手机充电。'
  }
  if (/你好|您好|hello|hi|在吗/i.test(q)) {
    return '您好！我是您的智能助老助手，请问有什么可以帮您？'
  }
  if (/你是谁|介绍一下/.test(q)) {
    return '我是智能助老座椅的语音助手，可以帮您查天气、找医院、紧急求助等。'
  }

  return '我收到您的问题了。目前我还在学习阶段，您可以试试问我：天气、附近的医院、公交站、时间，或者紧急求助。'
}
