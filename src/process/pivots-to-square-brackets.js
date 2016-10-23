'use strict';

var _ = require('lodash');
var processingUtils = require('./utils');
var utils = require('../utils');
var errors = require('../errors');

var defaultOptions = {
  ignoreOrphanedPivots: false
};

function processTokens(tokens, options) {
  var isModified = false;
  var result = [];
  var i;
  var token;
  var openingToken = null;
  var open = null;

  for (i = 0; i < tokens.length; i++) {
    token = tokens[i];
    if (utils.isPivot(token)) {
      isModified = true;

      if (!open) {
        open = [utils.pivotToStripe(token)];
        openingToken = token;
      } else {
        open.push(utils.pivotToStripe(token));
        result.push(utils.newTokenOpeningSquareBracket());
        [].push.apply(result, open);
        result.push(utils.newTokenClosingSquareBracket());
        open = null;
        openingToken = null;
      }
      // Go to next iteration - we already added tokens that we needed
      continue;
    }

    if (utils.isSquareBracket(token)) {
      // Check if we have orphaned pivot
      if (open) {
        if (!options.ignoreOrphanedPivots) {
          throw new errors.OrphanedPivot(openingToken);
        } else {
          // Add buffer without brackets
          [].push.apply(result, open);
        }
      }
      open = null;
      openingToken = null;
    }

    // Collect tokens into buffer until we reach matching pivot
    // or square bracket
    if (open) {
      open.push(token);
    } else {
      result.push(token);
    }
  }

  // Check if we have orphaned pivot
  if (open && !options.skipOrphanedPivots) {
    if (!options.ignoreOrphanedPivots) {
      throw new errors.OrphanedPivot(openingToken);
    } else {
      // Add buffer without brackets
      [].push.apply(result, open);
    }
  }

  return processingUtils.makeProcessorResult(result, isModified);
}

function factory(options) {
  options = _.extend({}, defaultOptions, options);
  return processingUtils.createSimpleProcessor(function(tokens, sett) {
    return processTokens(tokens, options);
  });
}

module.exports = factory;
