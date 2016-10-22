'use strict';

var utils = require('../utils');

var pattern = /^([a-z]{1,100})=?(#[0-9a-f]{3}([0-9a-f]{3})?);/i;

function parser(str, offset) {
  var matches;

  // Color definition can have at most 107 characters
  str = str.substr(offset, 110);

  matches = pattern.exec(str);
  if (matches) {
    return {
      type: utils.TokenType.color,
      name: matches[1].toUpperCase(),
      color: utils.normalizeColor(matches[2]),
      length: matches[0].length
    };
  }
}

function factory() {
  return parser;
}

module.exports = factory;
