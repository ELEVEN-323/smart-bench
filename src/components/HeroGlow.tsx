/**
 * 首页主视觉背景：暖光渐变（灯杆之光，克制，纯 CSS）
 *
 * 参考：Stripe「把渐变当光用」+ Aceternity「Background Beams」的思路，
 * 用品牌暖光 #F5C97B 与陶土橙 #B95A35 做两团慢漂移的柔光，避免炫技。
 * 纯装饰，aria-hidden；prefers-reduced-motion 下静止（见 home.css）。
 */
export default function HeroGlow() {
  return (
    <div className="hero-glow" aria-hidden="true">
      <span className="glow glow-warm" />
      <span className="glow glow-accent" />
    </div>
  )
}
