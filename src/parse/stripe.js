'use strict';

var pattern = /^\s*([a-z]+)([0-9]+)/im;

function parser(str) {
  var matches = pattern.exec(str);
  if (matches) {
    var count = parseInt(matches[2], 10) || 0;
    if (count <= 0) {
      throw new Error('Zero-width stripe at "' + str + '"');
    }
    return {
      token: 'stripe',
      name: matches[1].toUpperCase(),
      count: count,
      offset: matches.index,
      length: matches[0].length
    }
  }
}

module.exports = function() {
  return parser;
};
