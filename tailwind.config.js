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
        'inter-medium': ['Inter_500Medium'],
        'inter-semi-bold': ['Inter_600SemiBold'],
        'inter-bold': ['Inter_700Bold'],
        'inter-extra-bold': ['Inter_800ExtraBold'],
        'inter-black': ['Inter_900Black'],
      },
      colors: {
        primary: '#0066FF',
        secondary: '#FFFFFF',
        tertiary: '#94A3B8',
        'surface-0': '#09090B',
        'surface-1': '#121317',
        'surface-2': '#25272C',
        'surface-3': '#2D2E32',
        outline: '#38393D',
      },
    },
  },
  plugins: [],
}
