/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'parchment': {
          100: '#f4e4bc', // Lightest
          200: '#e6d2a0',
          300: '#d4b483', // Base parchment
          400: '#c19a6b',
          500: '#a37f55',
        },
        'stone': {
          100: '#9ca3af',
          200: '#6b7280',
          300: '#4b5563',
          400: '#374151',
          500: '#1f2937', // Base stone
          600: '#111827',
          700: '#0f1115', // Deep stone
        },
        'dungeon': {
          800: '#1a1a1a',
          900: '#0a0a0a', // Void
        },
        'gold': {
          400: '#facc15',
          500: '#eab308', // Base gold
          600: '#ca8a04',
        },
        'blood': {
          500: '#ef4444', // Brighter red for text
          600: '#dc2626',
        },
        'mana': {
          500: '#60a5fa', // Brighter blue for text
          600: '#3b82f6',
        }
      },
      fontFamily: {
        'sans': ['"Press Start 2P"', 'Inter', 'sans-serif'], // Fallback to Inter
        'mono': ['"VT323"', 'monospace'],
      }
    },
  },
  plugins: [],
};
