/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cinema: {
          bg: '#07080B',
          surface: '#111319',
          card: '#181B24',
          border: '#262A36',
          muted: '#8E95A5',
          accent: '#E50914',
          accentHover: '#FF1E27',
          gold: '#FFB703',
          teal: '#66FCF1',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
