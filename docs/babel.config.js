module.exports = {
  presets: [
    '@vue/app',
    [
      'module:@babel/plugin-transform-modules-umd', {
      globals: {
        'es6-promise': 'Promise',
      },
    },
    ],
    [
      '@babel/preset-env',
      {
        modules: 'umd',
      },
    ],
  ],
};
