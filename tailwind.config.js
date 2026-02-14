/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Fraunces', 'serif'],
        'body': ['DM Sans', 'sans-serif'],
      },
      colors: {
        'cream': '#FDF8F3',
        'cream-dark': '#F5EDE4',
        'navy': '#1a2744',
        'navy-light': '#2d3a52',
        'amber': '#E8A54B',
        'amber-light': '#F5C77E',
        'teal': '#3D8B8B',
        'teal-light': '#5BB5B5',
        'coral': '#E07A5F',
        'sage': '#81B29A',
      }
    }
  },
  plugins: [],
}
