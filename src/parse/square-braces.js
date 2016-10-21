'use strict';

function parser(str, offset) {
  var char = str.charAt(offset);
  if ((char == '[') || (char == ']')) {
    return {
      token: 'square-brace',
      value: char,
      length: 1
    };
  }
}

module.exports = function() {
  return parser;
};
