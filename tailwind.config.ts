import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary background
        background: {
          DEFAULT: '#0B0B0E',
        },
        // Dark surfaces
        surface: {
          100: '#101014',
          200: '#141419',
          300: '#18181E',
          400: '#1D1D24',
        },
        // Primary text
        text: {
          primary: '#FFFFFF',
          secondary: '#F4F4F6',
          muted: '#A1A1AA',
          disabled: '#71717A',
        },
        // Primary accent - Neon Lime
        lime: {
          DEFAULT: '#C0FE00',
          hover: '#BFFF00',
        },
        // Secondary accent - Electric Purple
        purple: {
          DEFAULT: '#782FFF',
          hover: '#8B3FFF',
        },
        // Border colors
        border: {
          DEFAULT: 'rgba(255,255,255,0.08)',
          hover: 'rgba(192,254,0,0.35)',
          purple: 'rgba(120,47,255,0.35)',
        },
        // Status colors
        status: {
          success: '#C0FE00',
          warning: '#FFA500',
          danger: '#EF4444',
        },
      },
      spacing: {
        '4': '4px',
        '8': '8px',
        '12': '12px',
        '16': '16px',
        '20': '20px',
        '24': '24px',
        '32': '32px',
        '40': '40px',
        '48': '48px',
        '64': '64px',
        '80': '80px',
        '96': '96px',
        '120': '120px',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
      fontFamily: {
        heading: ['var(--font-space-grotesk)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
      },
      fontSize: {
        'display': ['clamp(2.5rem, 5vw, 4rem)', { lineHeight: '1.1', fontWeight: '700' }],
        'h1': ['clamp(2rem, 4vw, 3rem)', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['clamp(1.5rem, 3vw, 2.25rem)', { lineHeight: '1.3', fontWeight: '600' }],
        'h3': ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }],
        'h4': ['1.25rem', { lineHeight: '1.5', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],
        'caption': ['0.75rem', { lineHeight: '1.4' }],
        'label': ['0.875rem', { lineHeight: '1.4', fontWeight: '500' }],
      },
      boxShadow: {
        'glow-lime': '0 0 20px rgba(192,254,0,0.3)',
        'glow-purple': '0 0 20px rgba(120,47,255,0.3)',
        'card': '0 4px 24px rgba(0,0,0,0.4)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.5)',
      },
      transitionDuration: {
        'fast': '150ms',
        'normal': '300ms',
        'slow': '500ms',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #7000FF, #C0FE00)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
export default config;
