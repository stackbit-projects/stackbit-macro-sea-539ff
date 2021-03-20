const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  purge: {
    mode: "layers",
    content: ["./**/*.html"],
    options: {
      whitelist: [],
    },
  },
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        'ms-yellow':'var(--ms-yellow)',
        'ms-blue':'var(--ms-blue)',
        'ms-green':'var(--ms-green)',
        'ms-bg':'var(--ms-bg)',
        'ms-brown':'var(--ms-brown)',
        'ms-orange':'var(--ms-orange)',
        'ms-primary': 'var(--ms-primary)',
          },
      fontFamily: {
        sans: ['ABC Marfa', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  variants: {
    scrollSnapType: ['responsive'],
    backgroundColor: ['odd'],
  },
  plugins: [require("@tailwindcss/typography"),require('tailwindcss-scroll-snap')],
};
