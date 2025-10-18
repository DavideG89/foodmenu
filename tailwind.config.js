/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './data/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#6A8042', // Herb
        accent: '#ED7A13', // Radiate
        background: '#FFFADD', // Pearl
        text: '#1E3006', // Moss
        herb: '#6A8042',
        gleam: '#FFE787',
        pearl: '#FFFADD',
        radiate: '#ED7A13',
        moss: '#1E3006'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        xl: '16px'
      },
      boxShadow: {
        soft: '0 10px 24px rgba(0, 0, 0, 0.08)'
      },
      keyframes: {
        'overlay-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'overlay-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' }
        },
        'sheet-in': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        'sheet-out': {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(100%)', opacity: '0' }
        },
        'modal-in': {
          '0%': { transform: 'translate(-50%, 10%) scale(0.96)', opacity: '0' },
          '100%': { transform: 'translate(-50%, 0) scale(1)', opacity: '1' }
        },
        'modal-out': {
          '0%': { transform: 'translate(-50%, 0) scale(1)', opacity: '1' },
          '100%': { transform: 'translate(-50%, 8%) scale(0.95)', opacity: '0' }
        }
      },
      animation: {
        'overlay-in': 'overlay-in 200ms ease-out forwards',
        'overlay-out': 'overlay-out 200ms ease-in forwards',
        'sheet-in': 'sheet-in 320ms cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'sheet-out': 'sheet-out 280ms cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'modal-in': 'modal-in 300ms cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'modal-out': 'modal-out 260ms cubic-bezier(0.4, 0, 0.2, 1) forwards'
      }
    }
  },
  plugins: [require('@tailwindcss/line-clamp')]
};
