'use strict';

var _ = require('lodash');
var errors = require('../errors');

var defaultOptions = {
  skipOrphanedPivots: false
};

function checkOrphanedPivotError(options, token) {
  if (!options.skipOrphanedPivots && token) {
    throw new errors.OrphanedPivot(token);
  }
}

function squareBrace(token) {
  return {
    token: token
  };
}

function pivotToStripe(token) {
  token = _.clone(token);
  token.token = 'stripe';
  return token;
}

function convertPivotsToSquareBraces(tokens, options) {
  var result = [];
  var i;
  var token;
  var open = null;

  for (i = 0; i < tokens.length; i++) {
    token = tokens[i];
    if (token.token == 'pivot') {
      if (!open) {
        result.push(squareBrace('['));
        result.push(pivotToStripe(token));
        open = token;
      } else {
        result.push(pivotToStripe(token));
        result.push(squareBrace(']'));
        open = null;
      }
      // Go to next iteration - we already added tokens that we needed
      continue;
    }
    if ((token.token == '[') || (token.token == ']')) {
      checkOrphanedPivotError(options, open);
      open = null;
    }
    result.push(token);
  }

  if (open) {
    checkOrphanedPivotError(options, open);
  }

  return result;
}

module.exports = function(options) {
  options = _.extend({}, defaultOptions, options);
  return function(tokens) {
    return convertPivotsToSquareBraces(tokens, options)
  };
};
