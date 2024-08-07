/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      sebang: 'sebang',
      pretendard: 'pretendard',
      dove: 'dove',
    },
    extend: {
      colors: {
        'p-red': '#F3B6B6',
        'p-green': '#6FF61C',
        'p-yellow': '#FFEA31',
        ramen: '#E0E19A',
        bg: '#333333',
      },
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
};
