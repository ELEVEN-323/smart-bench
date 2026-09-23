/** 座椅插画（占位用，设计组渲染图到位后替换为真实图片） */
export default function BenchArt() {
  return (
    <svg viewBox="0 0 240 160" fill="none" aria-hidden="true" className="bench-art">
      {/* 太阳 */}
      <circle cx="196" cy="34" r="20" fill="#f6c68a" opacity="0.55" />
      {/* 云朵 */}
      <ellipse cx="48" cy="38" rx="22" ry="9" fill="#ffffff" opacity="0.75" />
      <ellipse cx="64" cy="31" rx="15" ry="8" fill="#ffffff" opacity="0.75" />
      {/* 爱心 */}
      <g transform="translate(106, 30) scale(1.8)">
        <path
          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
          fill="#d95750"
        />
      </g>
      {/* 地面 */}
      <line x1="16" y1="132" x2="224" y2="132" stroke="#e6d2b8" strokeWidth="3" strokeLinecap="round" />
      {/* 靠背 */}
      <rect x="66" y="72" width="108" height="12" rx="6" fill="#e8894a" />
      {/* 靠背竖条 */}
      <rect x="80" y="84" width="7" height="26" rx="3" fill="#f0a05f" />
      <rect x="153" y="84" width="7" height="26" rx="3" fill="#f0a05f" />
      {/* 座面 */}
      <rect x="66" y="104" width="108" height="13" rx="6.5" fill="#cf6f2f" />
      {/* 椅腿 */}
      <rect x="80" y="117" width="9" height="15" rx="4" fill="#b5622a" />
      <rect x="151" y="117" width="9" height="15" rx="4" fill="#b5622a" />
    </svg>
  )
}
