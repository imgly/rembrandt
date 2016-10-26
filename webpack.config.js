var webpack = require('webpack')
var path = require('path')
var DefinePlugin = require('webpack/lib/DefinePlugin')

module.exports = [{
  entry: './index.js',
  output: {
    library: 'Rembrandt',
    libraryTarget: 'umd',
    path: path.join(__dirname, 'build'),
    filename: 'browser.js'
  },
  node: {
    fs: 'empty',
    path: 'empty',
    console: false,
    global: true,
    process: false,
    Buffer: false,
    __filename: 'mock',
    __dirname: 'mock',
    setImmediate: false
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
    libraryTarget: 'umd',
    path: path.join(__dirname, 'build'),
    filename: 'browser.min.js'
  },
  node: {
    fs: 'empty',
    path: 'empty',
    console: false,
    global: true,
    process: false,
    Buffer: false,
    __filename: 'mock',
    __dirname: 'mock',
    setImmediate: false
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
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false }
    })
  ]
}, {
  entry: './index.js',
  output: {
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, 'build'),
    filename: 'node.js'
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
