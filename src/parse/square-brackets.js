'use strict';

var utils = require('../utils');

function parser(str, offset) {
  var char = str.charAt(offset);
  if ((char == '[') || (char == ']')) {
    return {
      type: utils.TokenType.squareBracket,
      value: char,
      length: 1
    };
  }
}

function factory() {
  return parser;
}

module.exports = factory;
