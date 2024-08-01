/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      sebang: 'sebang',
      pretendard: 'pretendard',
    },
    extend: {
      colors: {
        primary: '#6ADD76',
        bg: '#333333',
        'bg-secondary': '#3F3E3E',
      },
    },
  },
  plugins: [],
};
