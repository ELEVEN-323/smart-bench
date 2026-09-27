/**
 * 产品立面示意（纯 SVG，无外部依赖）
 *
 * 小型灯杆为中轴 + 双侧差异化长椅：左侧普通、右侧适老（更高靠背、明黄高对比边、SOS 键）。
 * 取色来自《外观建模指导》第六节材质配色：暖橡木 #C08A5E / 浅灰金属 #C9CDD2 /
 * 深灰 #2B2F33 / SOS 红 #D64541 / 明黄 #FFD23F / 光伏蓝黑 #1E2A38 / 暖光 #F5C97B。
 * 设计组渲染图到位后可整体替换。
 */
export default function ProductArt() {
  return (
    <svg
      className="product-art"
      viewBox="0 0 420 620"
      fill="none"
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
    >
      {/* 地面投影 */}
      <ellipse cx="210" cy="552" rx="170" ry="13" fill="#1f1b16" opacity="0.07" />

      {/* 椅腿 */}
      <g fill="#AEB4BA">
        <rect x="88" y="486" width="11" height="64" rx="3" />
        <rect x="152" y="486" width="11" height="64" rx="3" />
        <rect x="258" y="486" width="11" height="64" rx="3" />
        <rect x="322" y="486" width="11" height="64" rx="3" />
      </g>

      {/* 靠背：左侧普通（低）、右侧适老（更高） */}
      <rect x="76" y="398" width="96" height="76" rx="8" fill="#C08A5E" />
      <rect x="248" y="374" width="96" height="100" rx="8" fill="#C08A5E" />

      {/* 座面 */}
      <rect x="64" y="466" width="292" height="22" rx="7" fill="#C08A5E" />
      <rect x="64" y="466" width="292" height="6" rx="3" fill="#D2A278" opacity="0.75" />

      {/* 扶手 */}
      <rect x="58" y="428" width="17" height="46" rx="5" fill="#A87448" />
      <rect x="345" y="416" width="17" height="58" rx="5" fill="#A87448" />

      {/* 适老侧高对比明黄边（仅右侧） */}
      <rect x="248" y="372" width="96" height="5" rx="2" fill="#FFD23F" />
      <rect x="248" y="463" width="96" height="5" rx="2" fill="#FFD23F" />
      <rect x="345" y="414" width="17" height="5" rx="2" fill="#FFD23F" />

      {/* 低位照明（暖光，座面下方） */}
      <ellipse cx="300" cy="492" rx="58" ry="10" fill="#F5C97B" opacity="0.45" />

      {/* SOS 键（适老侧扶手前端） */}
      <circle cx="353" cy="428" r="8" fill="#D64541" />
      <circle cx="353" cy="428" r="3.2" fill="#fff" opacity="0.9" />

      {/* 立杆 */}
      <rect x="197" y="72" width="26" height="438" rx="6" fill="#C9CDD2" />
      <rect x="201" y="72" width="5" height="438" fill="#E2E6EA" opacity="0.8" />
      <rect x="218" y="104" width="3" height="372" rx="1.5" fill="#F5C97B" opacity="0.55" />
      <rect x="186" y="496" width="48" height="62" rx="9" fill="#AEB4BA" />

      {/* 灯头 + 太阳能板 */}
      <rect x="144" y="28" width="132" height="12" rx="3" fill="#1E2A38" transform="rotate(-8 210 34)" />
      <rect x="140" y="52" width="140" height="16" rx="8" fill="#2B2F33" />
      <ellipse cx="210" cy="88" rx="106" ry="30" fill="#F5C97B" opacity="0.18" />
      <ellipse cx="210" cy="84" rx="68" ry="18" fill="#F5C97B" opacity="0.24" />

      {/* 摄像头 */}
      <rect x="202" y="168" width="16" height="11" rx="3" fill="#3A4147" />

      {/* 32" 触控屏 */}
      <rect x="178" y="194" width="64" height="138" rx="9" fill="#2B2F33" />
      <rect x="184" y="200" width="52" height="126" rx="5" fill="#46515C" />
      <rect x="192" y="214" width="36" height="7" rx="3" fill="#93A7BC" opacity="0.75" />
      <rect x="192" y="228" width="24" height="7" rx="3" fill="#93A7BC" opacity="0.5" />
      <rect x="192" y="296" width="36" height="7" rx="3" fill="#F5C97B" opacity="0.75" />

      {/* 扬声器格栅 */}
      <rect x="194" y="344" width="32" height="6" rx="3" fill="#3A4147" opacity="0.7" />

      {/* AED 舱 */}
      <rect x="182" y="366" width="56" height="44" rx="8" fill="#D64541" />
      <rect x="206" y="378" width="8" height="20" rx="2" fill="#fff" />
      <rect x="200" y="384" width="20" height="8" rx="2" fill="#fff" />
    </svg>
  )
}
