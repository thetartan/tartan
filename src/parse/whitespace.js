'use strict';

var utils = require('../utils');

var pattern = /^\s+/i;

function parser(str, offset) {
  // Try to capture at most 10 characters. If there are more
  // whitespaces - we'll capture them on a next turn
  var matches = pattern.exec(str.substr(offset, 10));
  if (matches) {
    return {
      type: utils.TokenType.whitespace,
      value: matches[0],
      length: matches[0].length
    };
  }
}

function factory() {
  return parser;
}

module.exports = factory;
