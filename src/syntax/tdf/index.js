'use strict';

// Tartan definition format

var parse = require('../../parse');
var process = require('../../process');
var utils = require('../../utils');

function factory(options, processors) {
  // TODO: Allow to use more options from `options`
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
    // Square brackets are used only to mark a start of threadcount.
    // It can be safely removed.
    process.removeTokens([utils.TokenType.squareBracket]),
    process.extractColors(),
    process.optimize()
  ].concat(_.isArray(processors) ? processors : [])));
}

module.exports = factory;
