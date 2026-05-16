/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        alimentaire: {
          cream: '#f8fcfb',
          ivory: '#FAFAF8',
          olive: '#365314',
          forest: '#14532d',
          wheat: '#E7C98B',
          slate: '#0f172a',
          neonOlive: '#84cc16',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
