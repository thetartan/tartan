'use strict';

var utils = require('../../utils');
var parse = require('../../parse');
var process = require('../../process');

function factory(options, preprocess, postprocess) {
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
    preprocess,
    process.splitWarpAndWeft(function(token) {
      return utils.isLiteral(token) && (token.value == '.');
    }),
    process.optimize({
      forceSquareBrackets: false
    }),
    postprocess
  ]));
}

module.exports = factory;
