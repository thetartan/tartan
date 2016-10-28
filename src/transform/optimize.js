'use strict';

var _ = require('lodash');
var utils = require('../utils');
var removeZeroWidthStripes = require('./remove-zero-width-stripes');
var mergeStripes = require('./merge-stripes');

var defaultOptions = {
  removeZeroWidthStripes: true,
  removeEmptyBlocks: true,
  mergeStripes: true,
  unfoldSingleColorBlocks: true
};

function removeEmptyBlocks(tokens) {
  var result = [];
  var token;
  for (var i = 0; i < tokens.length; i++) {
    token = tokens[i];
    if (_.isArray(token)) {
      // Double-check length to avoid unnecessary recursion
      if (token.length > 0) {
        token = removeEmptyBlocks(token);
        if (token.length > 0) {
          result.push(token);
        }
      }
    } else {
      // Keep everything else
      result.push(token);
    }
  }
  return result;
}

// [R20] => R20
// [R20 R10 R5] => R20 R10 R5 R10 => R65
function unfoldSingleColorBlocks(tokens, isNested, doNotMergeFirstPivot) {
  if (tokens.length == 0) {
    return tokens;
  }

  // Special case
  if (!isNested) {
    doNotMergeFirstPivot = (tokens.length == 1) && (_.isArray(tokens[0]));
  }

  var result = _.clone(tokens); // We will edit it in-place
  var token;
  var firstToken = null;
  var i;

  // Process nested blocks first
  for (i = 0; i < result.length; i++) {
    token = result[i];
    // Process nested blocks
    if (_.isArray(token)) {
      token = unfoldSingleColorBlocks(token, true, doNotMergeFirstPivot);
      result[i] = token.length != 1 ? token : _.first(token);
    }
  }

  // Check input array
  for (i = 0; i < result.length; i++) {
    token = result[i];
    if (!utils.isStripe(token)) {
      return result;
    }
    if (firstToken) {
      if (token.name != firstToken.name) {
        return result;
      }
    } else {
      firstToken = token;
    }
  }

  // If we are here - we have all tokens with the same color

  // For nested blocks, add each color twice (except of the first and last one)
  // as they will be duplicated after reflecting
  var multiplier = isNested ? 2 : 1;
  var count = _.first(result).count;
  if (!doNotMergeFirstPivot) {
    count *= multiplier;
  }
  for (i = 1; i < result.length - 1; i++) {
    count += multiplier * result[i].count;
  }
  if (result.length > 1) {
    // Avoid adding first element twice if there is the only stripe
    count += _.last(result).count;
  }

  result = utils.newTokenStripe(firstToken.name, count);
  return isNested ? result : [result];
}

function processTokens(tokens, options) {
  // Remove empty blocks
  if (options.removeEmptyBlocks) {
    tokens = removeEmptyBlocks(tokens);
  }
  // Then simplify blocks that contains only single-color stripes
  if (options.unfoldSingleColorBlocks) {
    tokens = unfoldSingleColorBlocks(tokens);
  }
  return tokens;
}

function transform(sett, options) {
  var result = _.clone(sett);

  // First of all, remove zero-width stripes. It may create empty blocks
  if (options.removeZeroWidthStripes) {
    result = removeZeroWidthStripes(options)(result);
  }

  var warpIsSameAsWeft = result.warp === result.weft;
  if (_.isArray(result.warp)) {
    result.warp = processTokens(result.warp, options);
  }
  if (_.isArray(result.weft)) {
    if (warpIsSameAsWeft) {
      result.weft = result.warp;
    } else {
      result.weft = processTokens(result.weft, options);
    }
  }

  if (options.mergeStripes) {
    result = mergeStripes()(result);
  }

  return result;
}

function factory(options) {
  options = _.extend({}, defaultOptions, options);
  return function(sett) {
    return transform(sett, options);
  };
}

module.exports = factory;
