'use strict';

var _ = require('lodash');
var defaults = require('../../defaults');
var parse = require('../../parse');
var filter = require('../../filter');
var syntax = require('../../syntax');
var utils = require('../../utils');

/*
 options = {
   errorHandler: <default>,
   processTokens: <default>,
   transformSyntaxTree: <default>
 }
 */

function factory(options) {
  options = _.extend({}, options);

  return parse([
    parse.stripe(),
    parse.literal('('),
    parse.literal(')'),
    parse.literal('['),
    parse.literal(']'),
    parse.color({
      allowLongNames: true,
      colorPrefix: /[#]/,
      colorSuffix: null,
      colorFormat: 'long',
      allowComment: false
    })
  ], {
    errorHandler: options.errorHandler,
    processTokens: filter([
      options.processTokens,
      filter.removeTokens(defaults.insignificantTokens)
    ]),
    buildSyntaxTree: syntax.weddslist({
      errorHandler: options.errorHandler,
      processTokens: filter.classify({
        // Disable some token classes
        isWarpAndWeftSeparator: null,
        isPivot: null,
        isBlockStart: null,
        isBlockEnd: null,

        // Add new token classes
        isWarpStart: function(token) {
          return utils.token.isLiteral(token) && (token.value == '[');
        },
        isWeftStart: function(token) {
          return utils.token.isLiteral(token) && (token.value == ']');
        },
        isBlockBodyStart: function(token) {
          return utils.token.isLiteral(token) && (token.value == '(');
        },
        isBlockBodyEnd: function(token) {
          return utils.token.isLiteral(token) && (token.value == ')');
        }
      }),
      transformSyntaxTree: options.transformSyntaxTree
    })
  });
}

module.exports = factory;
