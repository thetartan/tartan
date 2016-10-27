'use strict';

var _ = require('lodash');
var defaults = require('../../defaults');
var parse = require('../../parse');
var filter = require('../../filter');
var syntax = require('../../syntax');
var utils = require('../../utils');

// Options for: tartan.parse() + `transformSett` for `buildSyntaxTree`
function factory(options) {
  options = _.extend({}, options);
  options.buildSyntaxTree = syntax.default({
    filterTokens: filter.removeTokens(defaults.insignificantTokens),
    isWarpAndWeftSeparator: function(token) {
      return utils.isLiteral(token) && (token.value == '//');
    },
    transformSett: options.transformSett
  });

  return parse([
    parse.stripe(),
    parse.color(),
    parse.literal('['),
    parse.literal(']'),
    parse.literal('//'),
    parse.pivot()
  ], options);
}

module.exports = factory;
