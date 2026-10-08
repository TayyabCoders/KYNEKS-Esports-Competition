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
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
      fontFamily: {
        heading: ['var(--font-space-grotesk)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-space-grotesk)', 'sans-serif'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translate3d(0,0,0)' },
          '50%': { transform: 'translate3d(0,-14px,0)' },
        },
        sway: {
          '0%, 100%': { transform: 'rotateY(-5deg) rotateX(1deg)' },
          '50%': { transform: 'rotateY(5deg) rotateX(-1deg)' },
        },
        rise: {
          from: { opacity: '0', transform: 'translate3d(0,28px,0)' },
          to: { opacity: '1', transform: 'translate3d(0,0,0)' },
        },
        marquee: {
          from: { transform: 'translate3d(0,0,0)' },
          to: { transform: 'translate3d(-50%,0,0)' },
        },
        'marquee-reverse': {
          from: { transform: 'translate3d(-50%,0,0)' },
          to: { transform: 'translate3d(0,0,0)' },
        },
        'spin-slow': {
          to: { transform: 'rotate(360deg)' },
        },
        'ping-soft': {
          '0%': { transform: 'scale(1)', opacity: '0.7' },
          '80%, 100%': { transform: 'scale(2.6)', opacity: '0' },
        },
        sweep: {
          from: { transform: 'translate3d(-130%,0,0) skewX(-20deg)' },
          to: { transform: 'translate3d(260%,0,0) skewX(-20deg)' },
        },
        shine: {
          from: { backgroundPosition: '100% 0' },
          to: { backgroundPosition: '0% 0' },
        },
        tick: {
          from: { opacity: '0', transform: 'translate3d(0,-35%,0)' },
          to: { opacity: '1', transform: 'translate3d(0,0,0)' },
        },
        drift: {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '50%': { transform: 'translate3d(4vw,3vh,0) scale(1.08)' },
        },
        'grid-flow': {
          from: { transform: 'translate3d(0,0,0)' },
          to: { transform: 'translate3d(0,64px,0)' },
        },
        'cue': {
          '0%, 100%': { transform: 'translate3d(0,0,0)', opacity: '1' },
          '60%': { transform: 'translate3d(0,8px,0)', opacity: '0.2' },
        },
        burst: {
          from: { opacity: '1', transform: 'translate3d(0,0,0) scale(1)' },
          to: { opacity: '0', transform: 'translate3d(var(--tx),var(--ty),0) scale(0.4)' },
        },
        'bar-fill': {
          from: { transform: 'scaleX(0)' },
          to: { transform: 'scaleX(1)' },
        },
        'step-in': {
          from: { opacity: '0', transform: 'translate3d(var(--dir, 24px),0,0)' },
          to: { opacity: '1', transform: 'translate3d(0,0,0)' },
        },
        'intro-logo': {
          '0%': { opacity: '0', transform: 'scale(0.82)', filter: 'blur(8px)' },
          '40%, 80%': { opacity: '1', transform: 'scale(1)', filter: 'blur(0)' },
          '100%': { opacity: '0', transform: 'scale(1.08)', filter: 'blur(4px)' },
        },
        'intro-out': {
          '0%, 1%': { clipPath: 'inset(0 0 0 0)', visibility: 'visible' },
          '100%': { clipPath: 'inset(0 0 100% 0)', visibility: 'hidden' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        sway: 'sway 9s ease-in-out infinite',
        rise: 'rise 0.9s cubic-bezier(0.22,1,0.36,1) both',
        marquee: 'marquee 38s linear infinite',
        'marquee-reverse': 'marquee-reverse 46s linear infinite',
        'spin-slow': 'spin-slow 48s linear infinite',
        'ping-soft': 'ping-soft 2s cubic-bezier(0,0,0.2,1) infinite',
        sweep: 'sweep 1.1s ease-out both',
        shine: 'shine 1.6s ease-out both',
        tick: 'tick 0.35s ease-out both',
        drift: 'drift 22s ease-in-out infinite',
        'grid-flow': 'grid-flow 2.4s linear infinite',
        cue: 'cue 1.8s ease-in-out infinite',
        burst: 'burst 1.1s cubic-bezier(0.16,1,0.3,1) both',
        'bar-fill': 'bar-fill 1.2s cubic-bezier(0.65,0,0.35,1) both',
        'step-in': 'step-in 0.35s cubic-bezier(0.22,1,0.36,1) both',
        'intro-logo': 'intro-logo 1.6s cubic-bezier(0.22,1,0.36,1) both',
        'intro-out': 'intro-out 0.75s cubic-bezier(0.76,0,0.24,1) 1.55s forwards',
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
