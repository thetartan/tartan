'use strict';

var _ = require('lodash');
var processingUtils = require('./utils');
var utils = require('../utils');
var errors = require('../errors');

var defaultOptions = {
  allowNestedBlocks: false // Not implemented
};

function processSimple(tokens, options) {
  var leftTokens = [];
  var rightTokens = [];

  var leftToken;
  var rightToken;
  var left = 0;
  var right = tokens.length - 1;
  if (tokens.length % 2 == 1) {
    while (true) {
      leftToken = tokens[left];
      rightToken = tokens[right];

      if (left == right) {
        leftTokens.push(leftToken);
        break;
      }

      if (!utils.isStripe(leftToken)) {
        leftTokens.push(leftToken);
        left++;
        continue;
      }
      if (!utils.isStripe(rightToken)) {
        rightTokens.push(rightToken);
        right--;
        continue;
      }
      var isSameColor = leftToken.name == rightToken.name;
      var isSameCount = leftToken.count == rightToken.count;
      if (!isSameColor || !isSameCount) {
        // If there are no symmetry - do not continue
        return false;
      }

      leftTokens.push(leftToken);
      left++; right--;
    }
  } else {
    return false;
  }

  var i;
  for (i = 0; i < leftTokens.length; i++) {
    if (utils.isStripe(leftTokens[i])) {
      leftTokens.splice(i, 0, utils.newTokenOpeningSquareBracket());
      break;
    }
  }
  for (i = leftTokens.length - 1; i >= 0; i--) {
    if (utils.isStripe(leftTokens[i])) {
      leftTokens.splice(i + 1, 0, utils.newTokenClosingSquareBracket());
      break;
    }
  }

  return leftTokens.concat(rightTokens);
}

function processTokens(tokens, options) {
  if (!options.allowNestedBlocks) {
    return processSimple(tokens, options);
  }
  throw errors.NotImplemented();
}

function factory(options) {
  options = _.extend({}, defaultOptions, options);
  return processingUtils.createSimpleProcessor(function(tokens, sett) {
    return processTokens(tokens, options);
  });
}

module.exports = factory;
