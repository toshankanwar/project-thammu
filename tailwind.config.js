/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './app/**/*.{js,ts,jsx,tsx}',
      './pages/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
      extend: {
        colors: {
          'dark-bg': '#181818',
          'light-bg': '#fafafa',
        },
      },
    },
    plugins: [],
  };
  