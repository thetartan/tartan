'use strict';

function parser(str, offset) {
  var char = str.charAt(offset);
  if ((char == '[') || (char == ']')) {
    return {
      token: char,
      offset: offset,
      length: 1
    }
  }
}

module.exports = function() {
  return parser;
};
