import type { ReactNode } from 'react'

interface IconProps {
  size?: number
  color?: string
  strokeWidth?: number
}

function Base({ children, size = 24, color = 'currentColor', strokeWidth = 2 }: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

/** 语音 / 麦克风 */
export function MicIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </Base>
  )
}

/** 紧急呼叫 / 警示 */
export function AlertIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </Base>
  )
}

/** 位置检索 / 地图定位 */
export function MapPinIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </Base>
  )
}

/** 视频通话 */
export function VideoIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
      <rect x="2" y="6" width="14" height="12" rx="2" />
    </Base>
  )
}

/** 完成 / 对勾 */
export function CheckIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M20 6 9 17l-5-5" />
    </Base>
  )
}

/** 座椅 / 扶手椅 */
export function ArmchairIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M6 10V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3" />
      <path d="M4 12v-1a2 2 0 0 1 2-2h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H6a2 2 0 0 1-2-2Z" />
      <path d="M20 12v-1a2 2 0 0 0-2-2h-2a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h2a2 2 0 0 0 2-2Z" />
      <path d="M6 15v4M18 15v4" />
    </Base>
  )
}

/** 照明 / 路灯 */
export function LightIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M9 18h6" />
      <path d="M10 21h4" />
      <path d="M12 3a6 6 0 0 0-4 10.5c.8.7 1 1.5 1 2.5h6c0-1 .2-1.8 1-2.5A6 6 0 0 0 12 3Z" />
    </Base>
  )
}

/** 健康 / 心率 */
export function HeartPulseIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z" />
      <path d="M3.2 12h4l1.4-2.5L11 14l1.4-2.5H20.8" />
    </Base>
  )
}

/** 充电 / 便民 */
export function PlugIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M9 2v6" />
      <path d="M15 2v6" />
      <path d="M6 8h12v4a6 6 0 0 1-12 0V8Z" />
      <path d="M12 18v4" />
    </Base>
  )
}
