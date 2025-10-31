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
      colors: {
        primary: {
          DEFAULT: 'rgb(var(--color-primary, 0 153 85))',
          hover: 'rgb(var(--color-primary-hover, 0 122 68))',
          light: 'rgb(var(--color-primary-light, 230 245 238))',
          lighter: 'rgb(var(--color-primary-lighter, 240 250 245))',
          dark: 'rgb(var(--color-primary-dark, 0 122 68))',
        },
        navy: {
          900: '#16254d',
          800: '#192850',
        },
        surface: {
          0: '#fbfbfc',
          100: '#e9eaeb',
          indigo: {
            50: '#e8ebf9',
            100: '#d4d9f8',
            150: '#c3cbf7',
          },
        },
        muted: {
          gray: '#d5d7db',
        },
        warning: {
          DEFAULT: '#ecb424',
          gold: '#ecb424',
        },
        error: {
          DEFAULT: '#e4545f',
          coral: '#e4545f',
        },
        success: {
          DEFAULT: '#41a170',
          green: '#41a170',
        },
        border: {
          DEFAULT: '#dee2e6',
          light: '#e1e5e9',
        },
        text: {
          DEFAULT: '#212529',
          muted: '#6c757d',
        },
        danger: {
          DEFAULT: '#dc3545',
          light: '#fecaca',
          lighter: '#fef2f2',
          dark: '#b91c1c',
          border: '#fecaca',
        },
        hover: {
          DEFAULT: '#f8f9fa',
          gray: '#e9ecef',
        },
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '10px',
        md: '10px',
        lg: '16px',
        '2xl': '20px',
      },
      boxShadow: {
        sm: '0 1px 2px rgb(0 0 0 / 0.05)',
        DEFAULT: '0 4px 10px rgb(16 24 40 / 0.08)',
        md: '0 4px 10px rgb(16 24 40 / 0.08)',
        lg: '0 8px 16px rgb(16 24 40 / 0.12)',
        'page': '0 6px 20px rgba(0, 0, 0, 0.15)',
        'primary-sm': '0 1px 3px rgba(var(--color-primary, 0 153 85), 0.1)',
        'primary-md': '0 4px 12px rgba(var(--color-primary, 0 153 85), 0.25)',
        'primary-lg': '0 4px 16px rgba(var(--color-primary, 0 153 85), 0.2)',
        'danger-sm': '0 1px 3px rgba(220, 38, 38, 0.15)',
        'danger-md': '0 4px 12px rgba(220, 38, 38, 0.35)',
      },
      transitionDuration: {
        DEFAULT: '200ms',
      },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      spacing: {
        '0.8cm': '0.8cm',
      },
      width: {
        'page': '1200px',
        'a4': '21cm',
        'a4-landscape': '29.7cm',
      },
      height: {
        'a4': '29.7cm',
        'a4-landscape': '21cm',
      },
      maxWidth: {
        'page': '1200px',
        'a4': '21cm',
      },
      minHeight: {
        'a4': '29.7cm',
      },
      keyframes: {
        'pulse-success': {
          '0%, 100%': { backgroundColor: '#41a170' },
          '50%': { opacity: '0.8' },
        },
        'pulse-danger': {
          '0%, 100%': { backgroundColor: '#e4545f' },
          '50%': { opacity: '0.8' },
        },
        'pulse-warning': {
          '0%, 100%': { backgroundColor: '#ecb424' },
          '50%': { opacity: '0.8' },
        },
        'pulse-drop': {
          '0%, 100%': { opacity: '1', transform: 'scaleY(1)' },
          '50%': { opacity: '0.7', transform: 'scaleY(1.2)' },
        },
        'slide-down': {
          '0%': { opacity: '0', transform: 'translateY(-8px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        'pulse-success': 'pulse-success 2s ease-in-out',
        'pulse-danger': 'pulse-danger 1s ease-in-out infinite',
        'pulse-warning': 'pulse-warning 1s ease-in-out infinite',
        'pulse-drop': 'pulse-drop 1.5s ease-in-out infinite',
        'slide-down': 'slide-down 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
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
