'use strict';

var _ = require('lodash');
var utils = require('../../utils');

var defaultOptions = {
  // NNN * <something> variant
  allowAsPrefix: true,
  // <something> * NNN variant
  allowAsSuffix: true
};

var patternPrefix = /^([0-9]+)\s*[*]/i;
var patternSuffix = /^[*]\s*([0-9]+)/i;

function parser(context, offset, options) {
  var source = context.source;

  var matches = null;
  var isPrefix = false;
  var isSuffix = false;

  if (options.allowAsPrefix) {
    matches = patternPrefix.exec(source.substr(offset, 20));
    isPrefix = !!matches;
  }

  if (options.allowAsSuffix && !matches) {
    matches = patternSuffix.exec(source.substr(offset, 20));
    isSuffix = !!matches;
  }

  if (matches) {
    var count = parseInt(matches[1], 10) || 0;
    if (count <= 0) {
      count = 1;
    }
    var result = {
      type: utils.token.repeat,
      count: count >= 1 ? count : 1,
      isPrefix: isPrefix,
      isSuffix: isSuffix,
      length: matches[0].length
    };

    if (count < 1) {
      context.errorHandler(
        new Error(utils.error.message.invalidMultiplier),
        {token: _.extend({}, result, {count: count})},
        utils.error.severity.warning
      );
    }

    return result;
  }
}

function factory(options) {
  options = _.extend({}, defaultOptions, options);
  return function(str, offset) {
    return parser(str, offset, options);
  };
}

module.exports = factory;
