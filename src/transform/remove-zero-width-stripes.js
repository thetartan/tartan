'use strict';

var _ = require('lodash');
var utils = require('../utils');

var defaultOptions = {
  keepZeroWidthPivots: true
};

function removeZeroWidthStripes(tokens, options, isNested) {
  var result = [];
  var token;
  var first = _.first(tokens);
  var last = _.last(tokens);
  for (var i = 0; i < tokens.length; i++) {
    token = tokens[i];
    // Recursive processing of nested blocks
    if (_.isArray(token)) {
      result.push(removeZeroWidthStripes(token, options, true));
    } else
    // Check stripes
    if (utils.isStripe(token)) {
      if (token.count > 0) {
        result.push(token);
      } else {
        if (options.keepZeroWidthPivots) {
          // For nested blocks, keep first and last stripe as they are pivots
          if (isNested && ((token === first) || (token === last))) {
            result.push(token);
          }
        }
      }
    } else {
      // Keep everything else
      result.push(token);
    }
  }
  return result;
}

function transform(sett, options) {
  var result = _.clone(sett);
  var warpIsSameAsWeft = sett.warp == sett.weft;

  if (_.isArray(sett.warp)) {
    result.warp = removeZeroWidthStripes(sett.warp, options);
  }
  if (_.isArray(sett.weft)) {
    if (warpIsSameAsWeft) {
      result.weft = result.warp;
    } else {
      result.weft = removeZeroWidthStripes(sett.weft, options);
    }
  }

  return result;
}

function factory(options) {
  options = _.extend({}, defaultOptions, options);
  return function(sett) {
    return transform(sett, options);
  }
}

module.exports = factory;
