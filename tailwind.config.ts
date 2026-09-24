import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        twin: {
          bg: '#080A0D',
          sidebar: '#0D1014',
          card: '#11151A',
          'card-surface': '#151A21',
          'card-hover': '#1A2029',
          border: 'rgba(255, 255, 255, 0.08)',
          'border-strong': '#262D37',
          text: '#F4F4F5',
          secondary: '#8B9199',
          muted: '#626870',
          accent: {
            DEFAULT: '#F28C18',
            hover: '#E07D10',
            subtle: 'rgba(242, 140, 24, 0.12)',
            border: '#F28C18',
          },
          status: {
            green: '#10B981',
            yellow: '#F59E0B',
            red: '#EF4444',
            blue: '#38BDF8',
          },
        },
      },
      borderRadius: {
        pill: '9999px',
        card: '16px',
        'card-sm': '12px',
      },
      boxShadow: {
        card: '0 8px 24px rgba(0, 0, 0, 0.55)',
      },
    },
  },
  plugins: [],
};

export default config;
