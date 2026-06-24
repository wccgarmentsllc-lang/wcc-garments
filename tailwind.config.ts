import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'wcc-light': {
          bg: '#FAFAFA',
          surface: '#FFFFFF',
          border: '#E5E5E5',
          text: '#0A0A0A',
          muted: '#666666',
          subtle: '#F0F0F0',
        },
        'wcc-dark': {
          bg: '#0A0A0A',
          surface: '#111111',
          card: '#1A1A1A',
          border: '#2A2A2A',
          text: '#FAFAFA',
          muted: '#888888',
          subtle: '#1E1E1E',
        },
        gold: {
          DEFAULT: '#3B82F6', // Electric Blue Standard
          light: '#60A5FA',   // Electric Blue Light
          dark: '#2563EB',    // Electric Blue Dark
          muted: 'rgba(59, 130, 246, 0.12)',
        },
        bronze: '#8B7355',
        ivory: '#FAFAF5',
        charcoal: '#2C2C2C',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
        bebas: ['"Bebas Neue"', 'sans-serif'],
        'barlow-cond': ['"Barlow Condensed"', 'sans-serif'],
        'barlow-body': ['Barlow', 'sans-serif'],
      },
      fontSize: {
        'display-xl': [
          'clamp(72px, 12vw, 160px)',
          { lineHeight: '0.9', letterSpacing: '-0.02em' },
        ],
        'display-lg': [
          'clamp(48px, 8vw, 120px)',
          { lineHeight: '0.95', letterSpacing: '-0.02em' },
        ],
        'display-md': [
          'clamp(36px, 5vw, 72px)',
          { lineHeight: '1', letterSpacing: '-0.01em' },
        ],
        'display-sm': [
          'clamp(24px, 3vw, 48px)',
          { lineHeight: '1.1' },
        ],
      },
      spacing: {
        section: '8rem',
        'section-sm': '4rem',
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.76, 0, 0.24, 1)',
        'bounce-premium': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      animation: {
        marquee: 'marquee 25s linear infinite',
        'marquee-reverse': 'marquee-reverse 25s linear infinite',
        grain: 'grain 8s steps(10) infinite',
        float: 'float 6s ease-in-out infinite',
        'spin-slow': 'spinSlow 20s linear infinite',
        'float-decor': 'floatDecor 8s ease-in-out infinite',
        'fade-up': 'fadeUp 1s ease both',
        'fade-down': 'fadeDown 0.8s ease both',
        'glow-pulse': 'glowPulse 6s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        grain: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-2%, -3%)' },
          '20%': { transform: 'translate(3%, 2%)' },
          '30%': { transform: 'translate(-1%, 4%)' },
          '40%': { transform: 'translate(4%, -1%)' },
          '50%': { transform: 'translate(-3%, 3%)' },
          '60%': { transform: 'translate(2%, -4%)' },
          '70%': { transform: 'translate(-4%, 2%)' },
          '80%': { transform: 'translate(3%, -2%)' },
          '90%': { transform: 'translate(-2%, 4%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        spinSlow: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        floatDecor: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '50%': { transform: 'translateY(-12px) translateX(4px)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(28px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeDown: {
          from: { opacity: '0', transform: 'translateY(-20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.12)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
