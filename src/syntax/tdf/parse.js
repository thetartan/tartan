'use strict';

var parse = require('../../parse');
var process = require('../../process');
var utils = require('../../utils');

function factory(options, preprocess, postprocess) {
  return parse([
    parse.color({
      allowLongNames: true,
      valueAssignment: 'none',
      colorPrefix: 'require',
      allowShortFormat: false,
      comment: 'none',
      semicolonAtTheEnd: 'none'
    }),
    parse.stripe({
      allowLongNames: true
    }),
    parse.squareBrackets(),
    parse.parenthesis()
  ], options, process([
    preprocess,
    // Square brackets are used only to mark a start of threadcount.
    // They can be safely removed.
    process.removeTokens([utils.TokenType.squareBracket]),
    process.parenthesisToSquareBrackets(),
    process.optimize(),
    postprocess
  ], {
    runUntilUnmodified: false
  }));
}

module.exports = factory;
