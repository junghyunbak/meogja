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
        'p-yg': '#D6FF52',
        'p-pink': '#FF54F8',
        coffee: '#693939',
        rice: '#CDB8B8',
        ramen: '#E0E19A',
        bg: '#333333',
      },
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
};
