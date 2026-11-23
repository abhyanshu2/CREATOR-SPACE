const v = (n) => `rgb(var(${n}) / <alpha-value>)`
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: v('--c-primary'),
        secondary: v('--c-secondary'),
        bg: v('--c-bg'),
        surface: v('--c-surface'),
        ink: v('--c-ink'),
        muted: v('--c-muted'),
      },
      fontFamily: {
        display: ['Fredoka', 'ui-rounded', 'system-ui', 'sans-serif'],
        body: ['Nunito', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        floaty: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        twinkle: { '0%,100%': { opacity: 0.3 }, '50%': { opacity: 1 } },
      },
      animation: { floaty: 'floaty 5s ease-in-out infinite', twinkle: 'twinkle 3s ease-in-out infinite' },
    },
  },
  plugins: [],
}
