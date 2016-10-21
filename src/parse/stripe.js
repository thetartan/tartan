'use strict';

var errors = require('../errors');

var pattern = /^([a-z])([0-9]+)/i;

function parser(str, offset) {
  // Hope nobody will try to add stripe with 1e9 lines...
  var matches = pattern.exec(str.substr(offset, 10));
  if (matches) {
    var count = parseInt(matches[2], 10) || 0;
    if (count <= 0) {
      throw new errors.ZeroWidthStripe(str, offset, matches[0].length);
    }
    return {
      token: 'stripe',
      name: matches[1].toUpperCase(),
      count: count,
      length: matches[0].length
    };
  }
}

module.exports = function() {
  return parser;
};
