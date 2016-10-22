'use strict';

var _ = require('lodash');
var utils = require('../utils');
var errors = require('../errors');

var pattern = /^([a-z])([0-9]+)/i;

var defaultOptions = {
  allowZeroWidthStripes: false
};

function parser(str, offset, options) {
  // Hope nobody will try to add stripe with 1e9 lines...
  var matches = pattern.exec(str.substr(offset, 10));
  if (matches) {
    var count = parseInt(matches[2], 10) || 0;
    if (count <= 0) {
      if (!options.allowZeroWidthStripes) {
        throw new errors.ZeroWidthStripe(str, offset, matches[0].length);
      }
      count = 0;
    }
    return {
      type: utils.TokenType.stripe,
      name: matches[1].toUpperCase(),
      count: count,
      length: matches[0].length
    };
  }
}

function factory(options) {
  options = _.extend({}, defaultOptions, options);
  return function(str, offset) {
    return parser(str, offset, options);
  };
}

module.exports = factory;
