import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: '#1E3A5F',
        'navy-light': '#2E5299',
        cream: '#FAFAF7',
        'body-text': '#1A1A2E',
        'muted-text': '#6B7280',
        border: '#E5E7EB',
        stripe: '#EEF4FA',
        green: '#1A7340',
        amber: '#D4700A',
        red: '#C0392B',
        'pro-gold': '#B8860B',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
