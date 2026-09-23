export default function Logo({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="logoGradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f0a05f" />
          <stop offset="1" stopColor="#e8894a" />
        </linearGradient>
      </defs>
      {/* 圆角底 */}
      <rect width="24" height="24" rx="7" fill="url(#logoGradient)" />
      {/* 靠背 */}
      <rect x="6" y="8.4" width="12" height="2.2" rx="1.1" fill="#fff" opacity="0.9" />
      {/* 座面 */}
      <rect x="6" y="12.6" width="12" height="2.4" rx="1.2" fill="#fff" />
      {/* 椅腿 */}
      <rect x="7.2" y="15" width="2" height="3.4" rx="1" fill="#fff" opacity="0.92" />
      <rect x="14.8" y="15" width="2" height="3.4" rx="1" fill="#fff" opacity="0.92" />
    </svg>
  )
}
