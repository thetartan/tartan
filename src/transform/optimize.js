'use strict';

var _ = require('lodash');
var utils = require('../utils');
var mergeStripes = require('./merge-stripes');

var defaultOptions = {
  removeZeroWidthStripes: true,
  removeEmptyBlocks: true,
  mergeStripes: true
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
