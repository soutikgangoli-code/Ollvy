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
        navy: {
          DEFAULT: '#1E3A5F',
          light: '#2A4A73',
          dark: '#152B47',
        },
        cream: '#FAFAF7',
        'body-text': '#1F2937',
        'muted-text': '#6B7280',
        border: '#E5E7EB',
      },
    },
  },
  plugins: [],
}
export default config
