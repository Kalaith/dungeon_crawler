/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cream': {
          50: '#fcfcf9',
          100: '#fffffd',
        },
        'charcoal': {
          700: '#1f2121',
          800: '#262828',
        },
        'teal': {
          300: '#32b8c6',
          400: '#2da6b2', 
          500: '#21808d',
          600: '#1d7480',
          700: '#1a6873',
        },
        'slate': {
          500: '#626c71',
          900: '#13343b',
        },
        'gray': {
          200: '#f5f5f5',
          300: '#a7a9a9',
          400: '#777c7c',
        },
        'red': {
          400: '#ff5459',
          500: '#c0152f',
        },
        'orange': {
          400: '#e6815f',
          500: '#a84b2f',
        }
      },
      fontFamily: {
        'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        'mono': ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      }
    },
  },
  plugins: [],
};
