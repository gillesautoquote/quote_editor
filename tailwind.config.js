/** @type {import('tailwindcss').Config} */
export default {
  prefix: 'tw-',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        'print': {'raw': 'print'},
      },

    },
  },
  plugins: [
    function({ addUtilities }) {
      const printUtilities = {
        '.page-break-before': {
          'page-break-before': 'always',
          'break-before': 'page',
        },
        '.page-break-after': {
          'page-break-after': 'always',
          'break-after': 'page',
        },
        '.page-break-inside-avoid': {
          'page-break-inside': 'avoid',
          'break-inside': 'avoid',
        },
        '.no-widows': {
          'widows': '3',
        },
        '.no-orphans': {
          'orphans': '3',
        },
        '.no-break': {
          'page-break-inside': 'avoid',
          'break-inside': 'avoid',
        },
      };
      addUtilities(printUtilities);
    },
  ],
};
