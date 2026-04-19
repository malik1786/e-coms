export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'ui-sans-serif', 'system-ui']
      },
      boxShadow: {
        glow: '0 25px 70px rgba(15, 23, 42, 0.12)'
      }
    }
  },
  plugins: []
};
