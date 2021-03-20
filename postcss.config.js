module.exports = {
  plugins: [
    require(`tailwindcss`)(`./tailwind.config.js`),
//    require(`@tailwindcss/jit`)(`./tailwind.config.js`),
//    require(`postcss-preset-env`)({ stage: 1 }),
    require(`autoprefixer`),
    ...(process.env.NODE_ENV === "production"
      ? [
          require(`cssnano`)({
            preset: "default",
          }),
        ]
      : []),
  ],
};
