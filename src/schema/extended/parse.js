'use strict';

var _ = require('lodash');
var index = require('./index');
var defaults = require('../../defaults');
var parse = require('../../parse');
var filter = require('../../filter');
var syntax = require('../../syntax');
var transform = require('../../transform');
var utils = require('../../utils');

/*
  options = {
    warpAndWeftSeparator: index.warpAndWeftSeparator,
    errorHandler: <default>,
    processTokens: <default>,
    transformSyntaxTree: <default>
  }
*/

function factory(options) {
  options = _.extend({}, options);

  if (!_.isString(options.warpAndWeftSeparator)) {
    options.warpAndWeftSeparator = '';
  }
  if (options.warpAndWeftSeparator == '') {
    options.warpAndWeftSeparator = index.warpAndWeftSeparator;
  }

  return parse([
    parse.pivot(),
    parse.stripe(),
    parse.literal('['),
    parse.literal(']'),
    parse.literal(options.warpAndWeftSeparator),
    parse.color({
      allowLongNames: true,
      colorPrefix: /[=]?[#]/,
      colorSuffix: null,
      colorFormat: 'both',
      allowComment: true,
      commentSuffix: /;/,
      requireCommentSuffix: false,
      commentFormat: /^\s*(.*)\s*;\s*$/
    })
  ], {
    errorHandler: options.errorHandler,
    processTokens: filter([
      options.processTokens,
      filter.removeTokens(defaults.insignificantTokens)
    ]),
    buildSyntaxTree: syntax.extended({
      errorHandler: options.errorHandler,
      processTokens: filter.classify({
        isWarpAndWeftSeparator: function(token) {
          return utils.token.isLiteral(token) &&
            (token.value == options.warpAndWeftSeparator);
        }
      }),
      transformSyntaxTree: options.transformSyntaxTree
    })
  });
}

module.exports = factory;
