/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: ['./src/**/*.js', './src/**/*.jsx'],
    theme: {
      extend: {
        backgroundColor: {
          'blush' : '#e75a7c',
          'ivory': '#f2f5ea',
          'gunmetal': '#2c363f',
          'timberwolf': '#D6DBD2',
        }, 
        textColor: {
          'gunmetal': '#2c363f',
          'ivory': '#f2f5ea',
          'blush' : '#e75a7c',
        },
        borderColor: {
          'blush' : '#e75a7c',
        },
        screens: {
          'sm': '450px',
        },
      },
    },
    plugins: [],
}
