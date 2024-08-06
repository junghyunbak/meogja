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
        primary: '#f7a51f',
        bg: '#333333',
        'bg-secondary': '#3F3E3E',
      },
    },
  },
  plugins: [],
};
