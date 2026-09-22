/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#08080a',         // Ultra-deep matte black
          surface: '#0f0f13',    // Matte dark obsidian
          card: '#141418',       // Matte dark charcoal
          'card-hover': '#1a1a22',
          border: 'rgba(255, 255, 255, 0.08)',
          'border-active': 'rgba(239, 68, 68, 0.4)',
          red: '#ef4444',        // Core Crimson Red
          'red-neon': '#ff1e42', // Vivid Laser Red
          'red-dark': '#991b1b', // Deep Blood Red
          rose: '#f43f5e',
          amber: '#f59e0b',
          emerald: '#10b981',
        }
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      boxShadow: {
        'glow-red': '0 0 30px -5px rgba(239, 68, 68, 0.45), 0 0 15px rgba(255, 30, 66, 0.25)',
        'glow-red-lg': '0 0 50px -10px rgba(239, 68, 68, 0.55)',
        'inner-glow': 'inset 0 0 20px rgba(239, 68, 68, 0.08)',
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
        'float-slow': 'floatSlow 7s ease-in-out infinite',
        'radar-sweep': 'radarSweep 3s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}
