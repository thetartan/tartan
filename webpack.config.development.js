'use strict';

var _ = require('lodash');
var webpack = require('webpack');
var baseConfig = require('./webpack.config.base');

var developmentConfig = {
  output: {
    filename: 'tartan.js',
    path: './dist'
  }
};

var config = _.merge({}, baseConfig, developmentConfig);

module.exports = config;
