/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#f6f3ee',
        surface: '#fffdf9',
        ink: '#262019',
        'ink-2': '#6b635a',
        'ink-3': '#a2988c',
        line: '#e7e0d4',
        accent: '#b95a35',
        'accent-soft': '#f3e3d8',
        green: '#47624f',
        'green-soft': '#e6ede6',
        danger: '#d64541',
        warm: '#f5c97b',
        night: '#1E2A38',
      },
      fontFamily: {
        sans: ['Inter', 'PingFang SC', 'Microsoft YaHei', 'Segoe UI', 'system-ui', 'sans-serif'],
        display: ['LXGW WenKai', 'Noto Serif SC', 'Songti SC', 'SimSun', 'serif'],
        num: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '12px',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
