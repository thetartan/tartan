'use strict';

function parser(str, offset) {
  // Try to capture at most 10 characters. If there are more
  // whitespaces - we'll capture them on next turn
  var matches = /^\s+/i.exec(str.substr(offset, 10));
  if (matches) {
    return {
      token: 'whitespace',
      value: matches[0],
      length: matches[0].length
    };
  }
}

module.exports = function() {
  return parser;
};
