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

        primary: '#f7a51f',
        bg: '#333333',
        'bg-secondary': '#3F3E3E',
      },
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
};
