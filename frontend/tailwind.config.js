/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        soil:   { DEFAULT: '#3D2B1F', light: '#6B4C3B' },
        cream:  '#FDF6E3',
        leaf:   { DEFAULT: '#3D7A3F', hover: '#5A9E5C', pale: '#E8F5E9' },
        gold:   { DEFAULT: '#C8963A', light: '#F0C060', pale: '#FFF3DC' },
        sky:    { DEFAULT: '#4A90C4', light: '#D6EAF8' },
        danger: { DEFAULT: '#C0392B', pale: '#FADBD8' },
      },
      fontFamily: {
        baloo: ['"Baloo 2"', 'sans-serif'],
      },
      borderRadius: {
        xs:  '4px',
        md:  '12px',
        lg:  '20px',
        xl:  '28px',
      },
      boxShadow: {
        card:  '0 2px 12px rgba(61,43,31,0.08)',
        lift:  '0 8px 24px rgba(61,43,31,0.14)',
        glow:  '0 0 0 4px rgba(61,122,63,0.18)',
      },
      animation: {
        'pulse-ring': 'pulseRing 2s ease-out infinite',
        'leaf-spin':  'leafSpin 1.2s linear infinite',
        'wave':       'wave 1.4s ease-in-out infinite',
        'drift':      'drift 6s ease-in-out infinite alternate',
      },
      keyframes: {
        pulseRing: {
          '0%':   { transform: 'scale(1)', opacity: '0.7' },
          '100%': { transform: 'scale(1.7)', opacity: '0' },
        },
        leafSpin: {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        wave: {
          '0%, 100%': { transform: 'scaleY(1)' },
          '50%':      { transform: 'scaleY(1.8)' },
        },
        drift: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(8px)' },
        },
      },
    },
  },
  plugins: [],
};
