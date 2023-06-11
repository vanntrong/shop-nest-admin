const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    screens: {
      ...defaultTheme.screens,
    },
    fontFamily: {
      sans: ['"Be Vietnam Pro"', ...defaultTheme.fontFamily.sans],
      serif: [...defaultTheme.fontFamily.serif],
      mono: [...defaultTheme.fontFamily.mono],
    },
    // fontSize: {
    // 	sm: ["14px", "20px"],
    // 	base: ["16px", "24px"],
    // 	lg: ["20px", "16px"],
    // 	xl: ["24px", "32px"],
    // },
    extend: {
      colors: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        'btn-primary': 'var(--btn-primary)',
        'btn-secondary': 'var(--btn-secondary)',
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
};
