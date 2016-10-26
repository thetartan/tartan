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
  // function to transform newly built AST: (sett) => { return modifiedSett; }
  transformSett: null
};

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

  // Internal filters
  tokens = pivotsToSquareBrackets(options)(tokens);
  tokens = matchSquareBrackets()(tokens);

  var result = {};
  result.colors = {};
  result.warp = result.weft = [];

  var stack = [result.warp];
  var currentBlock;
  var temp;

  _.each(tokens, function(token) {
    switch (token.type) {
      case utils.TokenType.color:
        result.colors[token.name] = token.color;
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

  if (_.isFunction(options.transformSett)) {
    result = options.transformSett(result);
  }

  return result;
}

function factory(options) {
  options = _.extend({}, defaultOptions, options);
  return function(tokens) {
    return buildSyntaxTree(tokens, options);
  };
}

module.exports = factory;
