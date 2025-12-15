import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Wood-themed color palette
        primary: '#D4A574', // Warm golden wood
        secondary: '#8B4513', // Saddle brown
        accent: '#F4E4C1', // Light beige/cream
        dark: '#2C1810', // Dark wood/espresso
        'wood-light': '#DEB887', // Burlywood
        'wood-medium': '#A0826D', // Medium wood
        'wood-dark': '#654321', // Dark brown
        'gold': '#DAA520', // Goldenrod
        'cream': '#FFF8DC', // Cornsilk
      },
    },
  },
  plugins: [],
}
export default config
