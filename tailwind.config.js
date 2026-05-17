/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        cream: '#f8fcfb',
        olive: '#1f3b2f',
        forest: '#173326',
        wheat: '#d8b770',
        gold: '#c9a357',
        mist: '#e9f2ef'
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(17, 45, 35, 0.18)'
      },
      backdropBlur: {
        xs: '2px'
      }
    }
  },
  plugins: []
};
