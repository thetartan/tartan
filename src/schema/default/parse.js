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
    parse.stripe(_.extend({}, options, {
      allowLongNames: true
    })),
    // Colors in short format: whitespace before comment is required
    parse.color(_.extend({}, options, {
      allowLongNames: true,
      valueAssignment: 'allow',
      colorPrefix: 'require',
      colorFormat: 'short',
      comment: 'allow',
      whitespaceBeforeComment: 'require',
      semicolonAtTheEnd: 'require'
    })),
    // Long color format
    parse.color(_.extend({}, options, {
      allowLongNames: true,
      valueAssignment: 'allow',
      colorPrefix: 'require',
      colorFormat: 'long',
      comment: 'allow',
      whitespaceBeforeComment: 'allow',
      semicolonAtTheEnd: 'require'
    })),
    parse.literal('['),
    parse.literal(']'),
    parse.literal('//'),
    parse.pivot(_.extend({}, options, {
      allowLongNames: true
    }))
  ], options);
}

module.exports = factory;
