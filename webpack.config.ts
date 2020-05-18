const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = (env) => {
  return {
    // webpack v4+ will minify your code by default in production mode. (uses Terser Plugin by default)
    mode: env.NODE_ENV,

    // an entry point indicates which module webpack should use to begin building out its internal dependency graph.
    entry: './src/index.tsx',

    plugins: [
      // in general it's good practice to clean the /build folder before each build, so that only used files will be generated. Let's take care of that.
      new CleanWebpackPlugin(),
    ],

    output: {
      path: path.resolve(__dirname, 'force-app/main/default/staticresources/ReactComponent'),
    },

    resolve: {
      // add '.ts' and '.tsx' as resolvable extensions.
      extensions: ['.ts', '.tsx', '.js', '.json'],
    },

    module: {
      // each additional loader/plugin has a boot up time. Try to use as few tools as possible.
      rules: [
        {
          test: /\.(ts|js)x?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(jpg|png)$/,
          use: {
            loader: 'url-loader',
          },
        },
      ],
    },
  }
}

// staying up-to-date with Node.js can also help with performance. On top of this, keeping your package manager (e.g. npm or yarn) up-to-date can also help. Newer versions create more efficient module trees and increase resolving speed.
