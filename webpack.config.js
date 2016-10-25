var path = require('path')
var DefinePlugin = require('webpack/lib/DefinePlugin')

module.exports = [{
  entry: './index.js',
  output: {
    library: 'Rembrandt',
    libraryTarget: 'umd',
    path: path.join(__dirname, 'build'),
    filename: 'browser/index.js'
  },
  node: {
    fs: 'empty',
    path: 'empty'
  },
  externals: ['canvas'],
  module: {
    preLoaders: [
      {
        // set up standard-loader as a preloader
        test: /\.jsx?$/,
        loader: 'standard',
        exclude: /(node_modules|bower_components)/
      }
    ],
    loaders: [
      {
        test: __dirname,
        loader: 'babel-loader!preprocess?+BROWSER'
      },
      {
        test: /\.json?$/,
        loader: 'json-loader'
      }
    ]
  },
  plugins: [
    new DefinePlugin({
      BROWSER: true
    })
  ]
}, {
  entry: './index.js',
  output: {
    library: 'Rembrandt',
    libraryTarget: 'commonjs',
    path: path.join(__dirname, 'build'),
    filename: 'node/index.js'
  },
  target: 'node',
  externals: ['canvas'],
  module: {
    preLoaders: [
      {
        // set up standard-loader as a preloader
        test: /\.jsx?$/,
        loader: 'standard',
        exclude: /(node_modules|bower_components)/
      }
    ],
    loaders: [
      {
        test: __dirname,
        loader: 'babel-loader!preprocess'
      },
      {
        test: /\.json?$/,
        loader: 'json-loader'
      }
    ]
  }
}]
