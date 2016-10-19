'use strict';

var pattern = /^\s*([\[\]])/im;

function parser(str) {
  var matches = pattern.exec(str);
  if (matches) {
    return {
      token: matches[1],
      offset: matches.index,
      length: matches[0].length
    }
  }
}

module.exports = function() {
  return parser;
};
