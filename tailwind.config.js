/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './screens/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './features/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter_400Regular'],
        'inter-bold': ['Inter_700Bold'],
        'inter-extra-bold': ['Inter_800ExtraBold'],
        'inter-black': ['Inter_900Black'],
      },
      colors: {
        primary: '#0033FF',
        secondary: '#000000',
        tertiary: '#777777',
        surface: '#F3F4F6',
        'surface-2': '#FFFFFF',
      },
    },
  },
  plugins: [],
}
