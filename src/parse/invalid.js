'use strict';

var _ = require('lodash');
var utils = require('../utils');
var errors = require('../errors');

var defaultOptions = {
  allowInvalidTokens: false
};

function factory(options) {
  options = _.extend({}, defaultOptions, options);
  return function(str, offset) {
    if (!options.allowInvalidTokens) {
      throw new errors.InvalidToken(str, offset);
    }
    return {
      type: utils.TokenType.invalid,
      value: str.charAt(offset),
      length: 1
    };
  };
}

module.exports = factory;
