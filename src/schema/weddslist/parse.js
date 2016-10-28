'use strict';

var _ = require('lodash');
var defaults = require('../../defaults');
var parse = require('../../parse');
var filter = require('../../filter');
var syntax = require('../../syntax');
var transform = require('../../transform');

// Options for: tartan.parse() + `transformSett` for `buildSyntaxTree`
function factory(options) {
  options = _.extend({}, options);
  options.buildSyntaxTree = syntax.weddslist({
    filterTokens: filter.removeTokens(defaults.insignificantTokens),
    transformSett: transform([
      options.transformSett,
      transform.checkClassicSyntax()
    ])
  });

  return parse([
    parse.stripe(_.extend({}, options, {
      allowLongNames: true
    })),
    parse.color(_.extend({}, options, {
      allowLongNames: true,
      valueAssignment: 'none',
      colorPrefix: 'require',
      allowShortFormat: false,
      comment: 'none',
      semicolonAtTheEnd: 'allow'
    })),
    parse.literal('['),
    parse.literal(']'),
    parse.literal('('),
    parse.literal(')')
  ], options);
}

module.exports = factory;
