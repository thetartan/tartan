'use strict';

var _ = require('lodash');
var utils = require('../utils');
var errors = require('../errors');

var defaultOptions = {
  // function to filter parsed tokens: (tokens) => { return modifiedTokens; }
  filterTokens: null,
  // Fail on invalid tokens; tokens outside warp and weft; multiple warp
  // and weft delimiters, etc.
  failOnMalformedSequence: true,
  // function to transform newly built AST: (sett) => { return modifiedSett; }
  transformSett: null
};

function splitWarpAndWeft(tokens, options) {
  var colors = [];
  var warp = null;
  var weft = null;
  var currentBlock = 'colors';
  var i;
  var token;

  for (i = 0; i < tokens.length; i++) {
    token = tokens[i];
    switch (currentBlock) {
      case 'colors': {
        if (utils.isColor(token)) {
          colors.push(token);
          continue;
        }
        if (utils.isLiteral(token)) {
          switch (token.value) {
            case '[':
              if (!warp) {
                warp = [];
                currentBlock = 'warp';
                continue;
              }
              break;
            case ']':
              if (!weft) {
                weft = [];
                currentBlock = 'weft';
                continue;
              }
              break;
          }
        }
        break;
      }
      case 'warp': {
        if (utils.isStripe(token)) {
          warp.push(token);
          continue;
        }
        if (utils.isLiteral(token)) {
          switch (token.value) {
            case '(':
              warp.push(token);
              continue;
            case ')':
              warp.push(token);
              continue;
            case ']':
              if (!weft) {
                weft = [];
                currentBlock = 'weft';
                continue;
              }
              break;
          }
        }
        break;
      }
      case 'weft': {
        if (utils.isStripe(token)) {
          weft.push(token);
          continue;
        }
        if (utils.isLiteral(token)) {
          switch (token.value) {
            case '(':
              weft.push(token);
              continue;
            case ')':
              weft.push(token);
              continue;
            case '[':
              if (!warp) {
                warp = [];
                currentBlock = 'warp';
                continue;
              }
              break;
          }
        }
        break;
      }
      default:
        break;
    }
    // If we are here - we were unable to process token, so trigger error
    if (options.failOnMalformedSequence) {
      throw new errors.InvalidToken(token);
    }
  }

  var result = {
    colors: colors,
    warp: warp || [],
    weft: weft || []
  };

  if (result.warp.length == 0) {
    result.warp = result.weft;
  }
  if (result.weft.length == 0) {
    result.weft = result.warp;
  }

  return result;
}

function buildColorMap(tokens) {
  var result = {};
  _.each(tokens, function(token) {
    result[token.name] = token.color;
  });
  return result;
}

function checkParenthesisSyntax(tokens, options) {
  if (tokens.length == 0) {
    return true;
  }

  var openingCount = 0;
  var closingCount = 0;

  _.each(tokens, function(token) {
    if (utils.isOpeningParenthesis(token)) {
      if ((openingCount == 1) && options.failOnMalformedSequence) {
        throw new errors.InvalidToken(token);
      }
      openingCount++;
    }
    if (utils.isClosingParenthesis(token)) {
      if ((closingCount == 1) && options.failOnMalformedSequence) {
        throw new errors.InvalidToken(token);
      }
      closingCount++;
    }
  });

  if ((openingCount > 1) || (closingCount > 1)) {
    return false;
  }

  if (
    utils.isOpeningParenthesis(_.first(tokens)) &&
    utils.isClosingParenthesis(_.last(tokens))
  ) {
    return true;
  }

  if (tokens.length >= 4) {
    if (
      utils.isOpeningParenthesis(tokens[1]) &&
      utils.isClosingParenthesis(tokens[tokens.length - 2])
    ) {
      return true;
    }
  }

  if (options.failOnMalformedSequence) {
    var token = _.findLast(tokens, utils.isLiteral);
    if (!token) {
      // Hm. We have no parenthesis at all
      return true;
    }

    throw new errors.InvalidToken(token);
  }
  return false;
}

function buildTree(tokens, options) {
  var result = _.clone(tokens);

  if (!checkParenthesisSyntax(result, options)) {
    result = _.filter(result, function(token) {
      return !utils.isLiteral(token);
    });
  }

  if (result.length >= 2) {
    var isReflective = utils.isOpeningParenthesis(result[1]);
    result = _.filter(result, function(token) {
      return !utils.isLiteral(token);
    });
    if (isReflective && (result.length > 0)) {
      result = [result];
    }
  }

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
  result.colors = buildColorMap(tokens.colors);

  result.warp = buildTree(tokens.warp, options);
  if (warpIsSameAsWeft) {
    result.weft = result.warp;
  } else {
    result.weft = buildTree(tokens.weft, options);
  }

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
