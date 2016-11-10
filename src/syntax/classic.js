'use strict';

var _ = require('lodash');
var utils = require('../utils');

var defaultOptions = {
  // Error handler
  errorHandler: function(error, data, severity) {
    // Do nothing
  },
  // function to filter parsed tokens: (tokens) => { return modifiedTokens; }
  processTokens: null,
  // function to transform newly built AST: (ast) => { return modifiedAst; }
  transformSyntaxTree: null
};

/*
 <sett> ::= <sequence> [ '//' <sequence> ]
 <sequence> ::= <reflected> | <repetitive>
 <reflected> ::= <pivot> [{ <color> | <stripe> }] <pivot>
 <repetitive> ::= { <color> | <stripe> }
*/

function buildTree(tokens, options) {
  var items = [];
  var isReflected = false;
  var first = null;
  var last = null;

  if (tokens.length >= 2) {
    first = _.first(tokens);
    last = _.last(tokens);
    if (first.isPivot && last.isPivot) {
      isReflected = true;
    }
  }

  _.each(tokens, function(token) {
    if (token.isStripe) {
      items.push(utils.node.newStripe(token));
      return;
    }
    if (token.isPivot) {
      if (isReflected) {
        if ((token === first) || (token === last)) {
          items.push(utils.node.newStripe(token));
          return;
        }
      }
      options.errorHandler(
        new Error(utils.error.message.orphanedPivot),
        {token: token},
        utils.error.severity.warning
      );
      items.push(utils.node.newStripe(token));
      return;
    }
    options.errorHandler(
      new Error(utils.error.message.unexpectedToken),
      {token: token},
      utils.error.severity.error
    );
  });

  return utils.node.newRootBlock(items, isReflected);
}

function buildSyntaxTree(tokens, options) {
  // Some pre-validation and filtering
  if (!_.isArray(tokens)) {
    return tokens;
  }
  if (_.isFunction(options.processTokens)) {
    tokens = options.processTokens(tokens);
    if (!_.isArray(tokens)) {
      return tokens;
    }
  }

  // Extract colors; split warp and weft
  var colorTokens = [];
  var warpTokens = [];
  var weftTokens = [];
  var current = warpTokens;
  _.each(tokens, function(token) {
    if (token.isColor) {
      colorTokens.push(token);
      return;
    }
    if (token.isWarpAndWeftSeparator) {
      if (current === weftTokens) {
        options.errorHandler(
          new Error(utils.error.message.multipleWarpAnWeftSeparator),
          {token: token},
          utils.error.severity.warning
        );
      }
      current = weftTokens;
    } else {
      current.push(token);
    }
  });
  if (warpTokens.length == 0) {
    warpTokens = weftTokens;
    weftTokens = [];
  }
  if (weftTokens.length == 0) {
    weftTokens = warpTokens;
  }

  var result = {};
  result.colors = utils.color.buildColorMap(colorTokens);
  result.warp = buildTree(warpTokens, options);
  if (weftTokens === warpTokens) {
    result.weft = result.warp;
  } else {
    result.weft = buildTree(weftTokens, options);
  }

  if (_.isFunction(options.transformSyntaxTree)) {
    result = options.transformSyntaxTree(result);
  }

  return result;
}

function factory(options) {
  options = _.extend({}, defaultOptions, options);
  if (!_.isFunction(options.errorHandler)) {
    options.errorHandler = defaultOptions.errorHandler;
  }
  return function(tokens) {
    return buildSyntaxTree(tokens, options);
  };
}

module.exports = factory;
