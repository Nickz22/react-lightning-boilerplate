module.exports = {
  env: {
    development: {
      plugins: [
        ['styled-components', { ssr: false, minify: false, transpileTemplateLiterals: false }],
      ],
    },
    production: {
      plugins: [['styled-components', { ssr: false, displayName: false, fileName: false }]],
    },
  },

  presets: [
    [
      '@babel/env',
      {
        targets: {
          esmodules: true,
        },
      },
    ],
    '@babel/react',
    '@babel/typescript',
  ],

  plugins: ['@babel/proposal-class-properties', '@babel/proposal-object-rest-spread'],
}
