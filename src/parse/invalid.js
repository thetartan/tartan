'use strict';

var _ = require('lodash');
var errors = require('../errors');

var defaultOptions = {
  failOnInvalidTokens: true
};

module.exports = function(options) {
  options = _.extend({}, defaultOptions, options);
  return function(str, offset) {
    if (options.failOnInvalidTokens) {
      throw new errors.InvalidToken(str, offset);
    }
    return {
      token: 'invalid',
      value: str.charAt(offset),
      length: 1
    };
  };
};
