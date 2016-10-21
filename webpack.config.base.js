'use strict';

var webpack = require('webpack');

module.exports = {
  entry: './src/index.js',
  devtool: 'source-map',
  module: {
    loaders: [
      { test: /\.js$/, loaders: [ 'babel-loader' ], exclude: /node_modules/ },
      { test: /\.html$/, loader: 'raw' }
    ]
  },
  output: { library: 'tartan', libraryTarget: 'umd' },
  plugins:  [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ]
};
