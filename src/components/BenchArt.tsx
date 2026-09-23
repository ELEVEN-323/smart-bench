/** 座椅线稿（单色、细线、克制）——占位用，渲染图到位后替换为真实图片 */
export default function BenchArt() {
  return (
    <svg
      viewBox="0 0 200 140"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="bench-art"
    >
      {/* 靠背 */}
      <path d="M55 72h90" />
      {/* 靠背竖撑 */}
      <path d="M72 72v30" />
      <path d="M128 72v30" />
      {/* 座面 */}
      <path d="M55 102h90" />
      {/* 椅腿 */}
      <path d="M72 102v22" />
      <path d="M128 102v22" />
      {/* 地面 */}
      <path d="M40 128h120" opacity="0.35" />
      {/* 心形线稿 */}
      <g transform="translate(158, 26) scale(0.9)">
        <path
          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
          opacity="0.55"
        />
      </g>
    </svg>
  )
}
