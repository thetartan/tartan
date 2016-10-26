'use strict';

var _ = require('lodash');
var utils = require('../../utils');
var errors = require('../../errors');

var defaultOptions = {
  allowZeroWidthStripes: false,
  // Name can have more than one character
  allowLongNames: true
};

function buildRegExp(options) {
  var result = ['^'];

  // Name part
  var part = '[a-z]';
  if (options.allowLongNames) {
    part += '{1,100}';
  }
  result.push('(' + part + ')');

  // Count part
  result.push('([0-9]+)');

  return new RegExp(result.join(''), 'i');
}

function parser(str, offset, pattern, options) {
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
  var pattern = buildRegExp(options);
  return function(str, offset) {
    return parser(str, offset, pattern, options);
  };
}

module.exports = factory;
