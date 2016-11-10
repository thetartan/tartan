'use strict';

var _ = require('lodash');
var utils = require('../../utils');

var defaultOptions = {
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

function parser(context, offset, pattern, options) {
  var source = context.source;

  // Hope nobody will try to add stripe with 1e19 lines...
  var matches = pattern.exec(source.substr(offset, 20));
  if (matches) {
    var count = parseInt(matches[2], 10) || 0;
    if (count < 0) {
      count = 0;
    }
    var result = {
      type: utils.token.stripe,
      name: matches[1].toUpperCase(),
      count: count,
      length: matches[0].length
    };

    if (result.count == 0) {
      context.errorHandler(
        new Error(utils.error.message.zeroWidthStripe),
        {token: result},
        utils.error.severity.warning
      );
    }

    return result;
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
