/**
 * 产品外观示意（纯 SVG，无外部依赖）
 *
 * 依据设计模型实拍：长条玻璃顶棚 + 左侧木条长椅 + 中间服务柱
 * （太阳能板 / 顶灯 / 摄像头 / 青色状态灯带 / 触屏 / AED、灭火器、雨伞柜 / 插座）
 * + 右侧三张米色软包座椅（木质扶手 + 明黄高对比边）。
 *
 * 取色沿用《外观建模指导》第六节材质配色：暖橡木 #C08A5E / 浅灰金属 #C9CDD2 /
 * 深灰 #2B2F33 / SOS 红 #D64541 / 明黄 #FFD23F / 光伏蓝黑 #1E2A38 / 暖光 #F5C97B。
 */
const SOLAR_GRID_COLS = [442, 466, 490, 514]
const BENCH_SLATS = [276, 291, 306, 321]
const SEAT_SLATS = [340, 347, 354]
const CHAIR_X = [580, 704, 828]

export default function ProductArt() {
  return (
    <svg
      className="product-art"
      viewBox="0 0 960 440"
      fill="none"
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
    >
      {/* 地面投影 */}
      <ellipse cx="480" cy="414" rx="446" ry="10" fill="#1f1b16" opacity="0.06" />

      {/* 顶棚：玻璃 + 金属收边 */}
      <rect x="40" y="46" width="880" height="30" rx="5" fill="#BFD3DD" opacity="0.55" />
      <rect x="40" y="46" width="880" height="30" rx="5" stroke="#A6BAC5" strokeWidth="1.5" />
      <rect x="32" y="76" width="896" height="9" rx="4.5" fill="#C9CDD2" />

      {/* 太阳能板 */}
      <rect x="418" y="16" width="124" height="30" rx="3" fill="#1E2A38" />
      {SOLAR_GRID_COLS.map((x) => (
        <line key={x} x1={x} y1="16" x2={x} y2="46" stroke="#3C4C5E" strokeWidth="1" />
      ))}
      <line x1="418" y1="31" x2="542" y2="31" stroke="#3C4C5E" strokeWidth="1" />

      {/* 两侧支腿 */}
      <rect x="50" y="85" width="12" height="327" rx="4" fill="#C9CDD2" />
      <rect x="898" y="85" width="12" height="327" rx="4" fill="#C9CDD2" />

      {/* 左侧木条长椅 */}
      <rect x="86" y="358" width="324" height="54" rx="4" fill="#B9BFC5" />
      <rect x="78" y="334" width="340" height="26" rx="6" fill="#C08A5E" />
      {SEAT_SLATS.map((y) => (
        <rect key={y} x="84" y={y} width="328" height="3" rx="1.5" fill="#A87448" opacity="0.5" />
      ))}
      <rect x="82" y="268" width="332" height="68" rx="8" fill="#C08A5E" />
      {BENCH_SLATS.map((y) => (
        <rect key={y} x="90" y={y} width="316" height="6" rx="3" fill="#A87448" opacity="0.45" />
      ))}

      {/* 中间服务柱 */}
      <rect x="456" y="85" width="68" height="327" rx="4" fill="#C9CDD2" />
      <rect x="464" y="85" width="52" height="327" fill="#D9DEE2" />

      {/* 顶灯 + 光晕 */}
      <rect x="470" y="85" width="40" height="28" rx="11" fill="#F2EFE9" />
      <ellipse cx="490" cy="122" rx="52" ry="15" fill="#F5C97B" opacity="0.35" />

      {/* 摄像头 */}
      <rect x="482" y="130" width="16" height="20" rx="6" fill="#F2EFE9" />
      <circle cx="490" cy="142" r="5" fill="#2B2F33" />

      {/* 青色状态灯带 */}
      <rect x="486" y="158" width="8" height="146" rx="4" fill="#6FD8CE" opacity="0.9" />

      {/* 触控屏 */}
      <rect x="430" y="190" width="120" height="74" rx="8" fill="#2B2F33" />
      <rect x="436" y="196" width="108" height="62" rx="4" fill="#46515C" />
      <rect x="444" y="204" width="62" height="5" rx="2.5" fill="#93A7BC" opacity="0.8" />
      <rect x="444" y="216" width="44" height="5" rx="2.5" fill="#93A7BC" opacity="0.55" />
      <rect x="444" y="234" width="72" height="5" rx="2.5" fill="#F5C97B" opacity="0.8" />

      {/* 服务柜 */}
      <rect x="424" y="274" width="132" height="138" rx="6" fill="#C9CDD2" />
      <rect x="430" y="280" width="120" height="126" rx="4" fill="#DFE3E7" />

      {/* 插座面板（明黄描边） */}
      <rect x="434" y="286" width="112" height="14" rx="4" fill="#F2EFE9" />
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={440 + i * 27}
          y="289"
          width="19"
          height="8"
          rx="3"
          fill="#EBE5DB"
          stroke="#FFD23F"
          strokeWidth="1.2"
        />
      ))}

      {/* AED */}
      <rect x="436" y="310" width="50" height="46" rx="6" fill="#D64541" />
      <rect x="455" y="323" width="12" height="20" rx="2" fill="#fff" />
      <rect x="447" y="331" width="28" height="12" rx="2" fill="#fff" />

      {/* 灭火器 */}
      <rect x="492" y="308" width="18" height="48" rx="6" fill="#D64541" />
      <rect x="494" y="301" width="14" height="9" rx="3" fill="#C9CDD2" />

      {/* 雨伞 */}
      <path d="M518 352 L518 322 Q522 312 526 322 L526 352" stroke="#2B2F33" strokeWidth="2" fill="none" />
      <path d="M536 352 L536 322 Q540 312 544 322 L544 352" stroke="#2B2F33" strokeWidth="2" fill="none" />

      {/* 右侧三张软包座椅 */}
      {CHAIR_X.map((x) => (
        <g key={x}>
          <rect x={x + 10} y="356" width="8" height="56" rx="3" fill="#B9BFC5" />
          <rect x={x + 96} y="356" width="8" height="56" rx="3" fill="#B9BFC5" />
          <rect x={x + 4} y="330" width="108" height="30" rx="10" fill="#D8C6A6" />
          <rect x={x + 8} y="248" width="100" height="86" rx="14" fill="#D8C6A6" />
          <rect x={x + 8} y="248" width="100" height="6" rx="3" fill="#FFD23F" />
          <rect x={x - 2} y="302" width="120" height="16" rx="8" fill="#C08A5E" />
          <rect x={x - 2} y="302" width="120" height="5" rx="2.5" fill="#FFD23F" />
          <rect x={x + 22} y="308" width="34" height="9" rx="3" fill="#F2EFE9" />
        </g>
      ))}
    </svg>
  )
}
