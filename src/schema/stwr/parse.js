'use strict';

var _ = require('lodash');
var defaults = require('../../defaults');
var parse = require('../../parse');
var filter = require('../../filter');
var syntax = require('../../syntax');
var transform = require('../../transform');
var utils = require('../../utils');

// Options for: tartan.parse() + `transformSett` for `buildSyntaxTree`
function factory(options) {
  options = _.extend({}, options);
  options.buildSyntaxTree = syntax.default({
    filterTokens: filter.removeTokens(defaults.insignificantTokens),
    isWarpAndWeftSeparator: function(token) {
      return utils.isLiteral(token) && (token.value == '.');
    },
    transformSett: transform([
      options.transformSett,
      transform.checkClassicSyntax()
    ])
  });

  return parse([
    parse.stripe(_.extend({}, options, {
      allowLongNames: true
    })),
    parse.color({
      allowLongNames: true,
      valueAssignment: 'require',
      colorPrefix: 'allow',
      colorFormat: 'long',
      comment: 'allow',
      whitespaceBeforeComment: 'allow',
      semicolonAtTheEnd: 'require'
    }),
    parse.literal('.'),
    parse.pivot(_.extend({}, options, {
      allowLongNames: true
    }))
  ], options);
}

module.exports = factory;
