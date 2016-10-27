'use strict';

var _ = require('lodash');
var utils = require('../utils');
var errors = require('../errors');
var pivotsToSquareBrackets = require('../filter/pivots-to-square-brackets');
var matchSquareBrackets = require('../filter/match-square-brackets');

var defaultOptions = {
  // Also options for `pivotsToSquareBrackets`
  // Also options for `optimizeSyntaxTree`
  failOnUnsupportedTokens: true,
  // function to filter parsed tokens: (tokens) => { return modifiedTokens; }
  filterTokens: null,
  // Should return `true` if token is a separator between
  // warp and weft sequence
  isWarpAndWeftSeparator: function(token) { return false; },
  failOnMultipleWarpAndWeftSeparators: true,
  // function to transform newly built AST: (sett) => { return modifiedSett; }
  transformSett: null
};

function splitWarpAndWeft(tokens, options) {
  var result = {warp: [], weft: []};
  var current = result.warp;
  var isWeftStarted = false;
  _.each(tokens, function(token) {
    if (options.isWarpAndWeftSeparator(token)) {
      if (isWeftStarted) {
        if (options.failOnMultipleWarpAndWeftSeparators) {
          throw new errors.InvalidToken(token);
        }
      } else {
        current = result.weft;
        isWeftStarted = true;
      }
    } else {
      current.push(token);
    }
  });

  if (result.warp.length == 0) {
    result.warp = result.weft;
  }
  if (result.weft.length == 0) {
    result.weft = result.warp;
  }

  return result;
}

function buildTree(tokens, colors, options) {
  var result = [];
  var stack = [result];
  var currentBlock;
  var temp;

  _.each(tokens, function(token) {
    switch (token.type) {
      case utils.TokenType.color:
        colors[token.name] = token.color;
        break;
      case utils.TokenType.stripe:
        currentBlock = _.last(stack);
        currentBlock.push(token);
        break;
      case utils.TokenType.literal:
        switch (token.value) {
          case '[':
            currentBlock = _.last(stack);
            temp = [];
            currentBlock.push(temp);
            stack.push(temp);
            break;
          case ']':
            stack.pop();
            break;
          default:
            if (options.failOnUnsupportedTokens) {
              throw new errors.UnsupportedToken(token);
            }
            break;
        }
        break;
      default:
        if (options.failOnUnsupportedTokens) {
          throw new errors.UnsupportedToken(token);
        }
        break;
    }
  });

  return result;
}

function buildSyntaxTree(tokens, options) {
  // Some pre-validation and filtering
  if (!_.isArray(tokens)) {
    return tokens;
  }
  if (_.isFunction(options.filterTokens)) {
    tokens = options.filterTokens(tokens);
    if (!_.isArray(tokens)) {
      return tokens;
    }
  }

  tokens = splitWarpAndWeft(tokens, options);
  var warpIsSameAsWeft = tokens.warp === tokens.weft;

  var result = {};
  result.colors = {};

  // Internal filters
  tokens.warp = pivotsToSquareBrackets(options)(tokens.warp);
  tokens.warp = matchSquareBrackets()(tokens.warp);
  result.warp = buildTree(tokens.warp, result.colors, options);
  if (warpIsSameAsWeft) {
    result.weft = result.warp;
  } else {
    tokens.weft = pivotsToSquareBrackets(options)(tokens.weft);
    tokens.weft = matchSquareBrackets()(tokens.weft);
    result.weft = buildTree(tokens.weft, result.colors, options);
  }

  if (_.isFunction(options.transformSett)) {
    result = options.transformSett(result);
  }

  return result;
}

function factory(options) {
  options = _.extend({}, defaultOptions, options);
  if (!_.isFunction(options.isWarpAndWeftSeparator)) {
    options.isWarpAndWeftSeparator = defaultOptions.isWarpAndWeftSeparator;
  }
  return function(tokens) {
    return buildSyntaxTree(tokens, options);
  };
}

module.exports = factory;
