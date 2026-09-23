/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0E3A43',
          hover: '#155965',
        },
        accent: {
          DEFAULT: '#A84B2A',
          light: '#F3D8CC',
        },
        brand: {
          bg: '#F7F7F2',
          surface: '#FFFFFF',
          text: '#17252A',
          muted: '#637278',
          border: '#DCE5E3',
          success: '#2F6B4F',
          footerText: '#D5E0E1',
          footerLink: '#E6EFEE',
        },
      },
      gridTemplateColumns:{
        'auto': 'repeat(auto-fit, minmax(200px, 1fr))'
      },
      spacing: {
        'section-height': '500px',
      },
      fontSize: {
        'default': ['15px', '21px'],
        'course-deatails-heading-small': ['26px', '36px'],
        'course-deatails-heading-large': ['36px', '44px'],
        'home-heading-small': ['28px', '34px'],
        'home-heading-large': ['48px', '56px'],
      },
      maxWidth: {
        'course-card': '424px',
      },
      boxShadow: {
        'custom-card': '0px 4px 20px rgba(14, 58, 67, 0.08)',
        'subtle': '0 2px 10px rgba(14, 58, 67, 0.05)',
        'subtle-hover': '0 12px 28px rgba(14, 58, 67, 0.12)',
      },
    },
  },
  plugins: [],
}