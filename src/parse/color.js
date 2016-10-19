'use strict';

var pattern1 = /^\s*([a-z]+)#([0-9a-f]{6})/im;
var pattern2 = /^\s*([a-z]+)#([0-9a-f]{3})/im;

function parser(str) {
  var matches;

  matches = pattern1.exec(str);
  if (matches) {
    return {
      token: 'color',
      name: matches[1].toUpperCase(),
      color: '#' + matches[2].toLowerCase(),
      offset: matches.index,
      length: matches[0].length
    }
  }

  matches = pattern2.exec(str);
  if (matches) {
    return {
      token: 'color',
      name: matches[1].toUpperCase(),
      // Duplicate each char
      color: '#' + matches[2].toLowerCase().replace(/./g, '$&$&'),
      offset: matches.index,
      length: matches[0].length
    }
  }
}

module.exports = function() {
  return parser;
};
