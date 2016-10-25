'use strict';

// Syntax by Scottish Tartans Authority

var utils = require('../../utils');
var parse = require('../../parse');
var process = require('../../process');

function factory(options, processors) {
  return parse([
    parse.color({
      allowLongNames: true,
      valueAssignment: 'require',
      colorPrefix: 'none',
      allowShortFormat: false,
      comment: 'allow',
      semicolonBeforeComment: 'allow',
      semicolonAtTheEnd: 'require'
    }),
    parse.stripe({
      allowLongNames: true
    }),
    parse.pivot({
      allowLongNames: true
    }),
    parse.literal({
      string: '.' // Delimiter between warp and weft
    })
  ], options, process([
    process.splitWarpAndWeft(function(token) {
      return utils.isLiteral(token) && (token.value == '.');
    }),
    process.optimize({
      forceSquareBrackets: false
    })
  ].concat(_.isArray(processors) ? processors : [])));
}

module.exports = factory;
