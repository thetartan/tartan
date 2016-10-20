'use strict';

var pattern1 = /^([a-z])#([0-9a-f]{6})/im;
var pattern2 = /^([a-z])#([0-9a-f]{3})/im;

function parser(str, offset) {
  var matches;

  // Color definition can have at most 8 characters
  str = str.substr(offset, 8);

  matches = pattern1.exec(str);
  if (matches) {
    return {
      token: 'color',
      name: matches[1].toUpperCase(),
      color: '#' + matches[2].toLowerCase(),
      offset: offset,
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
      offset: offset,
      length: matches[0].length
    }
  }
}

module.exports = function() {
  return parser;
};
