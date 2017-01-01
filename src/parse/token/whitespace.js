'use strict';

var pattern = /^\s+/i;
var utils = require('../../utils');

function parse(context, offset) {
  var source = context.source;
  var chunkSize = 10;
  var result = '';
  while (true) {
    var chunk = source.substr(offset + result.length, chunkSize);
    var matches = pattern.exec(chunk);
    if (!matches) {
      break;
    }
    result += matches[0];
    if (matches[0].length < chunkSize) {
      // Don't wait for next turn
      break;
    }
  }

  if (result != '') {
    return {
      type: utils.token.whitespace,
      value: result,
      length: result.length
    };
  }
}

function factory() {
  return parse;
}

module.exports = factory;
