'use strict';

var _ = require('lodash');
var utils = require('../utils');
var mergeStripes = require('./merge-stripes');

var defaultOptions = {
  removeZeroWidthStripes: true,
  removeEmptyBlocks: true,
  mergeStripes: true,
  unfoldSingleColorBlocks: true
};

function removeZeroWidthStripes(tokens) {
  var result = [];
  var token;
  for (var i = 0; i < tokens.length; i++) {
    token = tokens[i];
    // Recursive processing of nested blocks
    if (_.isArray(token)) {
      result.push(removeZeroWidthStripes(token));
    } else
    // Check stripes
    if (utils.isStripe(token)) {
      if (token.count > 0) {
        result.push(token);
      }
    } else {
      // Keep everything else
      result.push(token);
    }
  }
  return result;
}

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
// [R20 R10 R5] => R20 R10 R5 R10 R20 => R65
function unfoldSingleColorBlocks(tokens, isNested) {
  if (tokens.length == 0) {
    return tokens;
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
      token = unfoldSingleColorBlocks(token, true);
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

  var count = 0;
  // For nested blocks, add each color twice (except of the last one)
  // as they will be duplicated after reflecting
  var multiplier = isNested ? 2 : 1;
  // Add each color twice, except of last one
  for (i = 0; i < result.length - 1; i++) {
    count += multiplier * result[i].count;
  }
  count += _.last(result).count;

  result = utils.newTokenStripe(firstToken.name, count);
  return isNested ? result : [result];
}

function processTokens(tokens, options) {
  // First of all, remove zero-width stripes. After that we
  // may create empty blocks
  if (options.removeZeroWidthStripes) {
    tokens = removeZeroWidthStripes(tokens);
  }
  // Then remove empty blocks
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

  var warpIsSameAsWeft = sett.warp === sett.weft;
  if (_.isArray(sett.warp)) {
    result.warp = processTokens(sett.warp, options);
  }
  if (_.isArray(sett.weft)) {
    if (warpIsSameAsWeft) {
      result.weft = result.warp;
    } else {
      result.weft = processTokens(sett.weft, options);
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
