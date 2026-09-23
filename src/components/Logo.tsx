export default function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="1.5" y="1.5" width="21" height="21" rx="6" stroke="#262019" strokeWidth="1.5" />
      <path d="M7 13.5h10" stroke="#262019" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 9.5h10" stroke="#262019" strokeWidth="1.5" strokeLinecap="round" opacity="0.55" />
      <path d="M9 13.5v4M15 13.5v4" stroke="#262019" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
