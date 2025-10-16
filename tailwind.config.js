/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './data/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#00B37E',
        accent: '#FFBE00',
        background: '#FAFAFA',
        text: '#222222'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        xl: '16px'
      },
      boxShadow: {
        soft: '0 10px 24px rgba(0, 0, 0, 0.08)'
      }
    }
  },
  plugins: [require('@tailwindcss/line-clamp')]
};
