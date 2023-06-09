const path = require('path');
const pathToInlineSvg = path.resolve(__dirname, '../src/icons');

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    // nomodule
    {
      name: `@storybook/preset-scss`,
      options: {
        rule: {
          test: /(?<!\.module).s[ca]ss$/,
        },
      },
    },
    // module
    {
      name: `@storybook/preset-scss`,
      options: {
        rule: {
          test: /\.module\.s[ca]ss$/,
        },
        cssLoaderOptions: {
          modules: {
            localIdentName: '[name]__[local]--[hash:base64:5]',
          },
        },
      },
    },
  ],
  framework: '@storybook/react',
  core: {
    builder: 'webpack5',
  },
  webpackFinal: async (config) => {
    const rules = config.module.rules;
    const fileLoaderRule = rules.find((rule) => rule.test && rule.test.test('.svg'));
    fileLoaderRule.exclude = pathToInlineSvg;

    rules.push(
      {
        test: /\.ya?ml$/,
        use: 'yaml-loader',
      },
      {
        test: /\.svg$/,
        include: pathToInlineSvg,
        use: ['@svgr/webpack'],
      }
    );
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/components': path.resolve(__dirname, '../src/components'),
      '@/data': path.resolve(__dirname, '../data'),
      '@/pages': path.resolve(__dirname, '../src/pages'),
      '@/helpers': path.resolve(__dirname, '../src/helpers'),
      '@/styles': path.resolve(__dirname, '../src/styles'),
      '@/icons': path.resolve(__dirname, '../src/icons'),
      '@/context': path.resolve(__dirname, '../src/context'),
      '/logos': path.resolve(__dirname, '../public/logos'),
      '/images': path.resolve(__dirname, '../public/images'),
    };
    return config;
  },
};
