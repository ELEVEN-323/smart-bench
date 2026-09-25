/**
 * 灯杆光晕背景（纯 CSS，零依赖）
 *
 * 视觉隐喻：智慧灯杆的暖光（3000–3500K）+ 光伏蓝黑的科技底。
 * 参考来源：React Bits 的 Aurora / Magic UI 的 Animated Beam 思路，
 * 改写为纯 CSS 关键帧，不引入任何动画库。
 *
 * 纯装饰，aria-hidden；prefers-reduced-motion 下自动静止（见 home.css）。
 */
export default function LampAurora() {
  return (
    <div className="lamp-aurora" aria-hidden="true">
      <span className="beam beam-1" />
      <span className="beam beam-2" />
      <span className="beam beam-3" />
      <span className="halo" />
      <span className="grid" />
    </div>
  )
}
