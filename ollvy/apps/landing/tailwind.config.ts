import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: '#1E3A5F',
        navyLight: '#2E5299',
        cream: '#FAFAF7',
        white: '#FFFFFF',
        bodyText: '#1A1A2E',
        mutedText: '#6B7280',
        border: '#E5E7EB',
        stripe: '#EEF4FA',
        green: '#1A7340',
        amber: '#D4700A',
        red: '#C0392B',
        proGold: '#B8860B',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
