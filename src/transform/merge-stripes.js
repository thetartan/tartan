'use strict';

var _ = require('lodash');
var utils = require('../utils');

// Do not merge first and last stripe in the only nested block in a root
// as they are pivots! For other nested blocks, first pivot can be merged.
// Example: [R20 R10 R5 Y2 K10 K5]
// Wrong: [R35 Y2 K15] => R35 Y2 K15 Y2
// Right: [R20 R15 Y2 K10 K5]
//        => R20 R15 Y2 K10 K5 K10 Y2 R15
//        => R35 Y2 K25 Y2 R15
function processTokens(tokens, isNested, doNotMergeFirstPivot) {
  var result = [];

  // Special case
  if (!isNested && (tokens.length == 1) && (_.isArray(tokens[0]))) {
    result.push(processTokens(tokens[0], true, true));
    return result;
  }

  var token;
  var prev;
  var correctionStart = doNotMergeFirstPivot ? 1 : 0;
  var correctionEnd = isNested ? 1 : 0;

  for (var i = correctionStart; i < tokens.length - correctionEnd; i++) {
    token = tokens[i];
    if (_.isArray(token)) {
      result.push(processTokens(token, true));
      continue;
    }
    if (utils.isStripe(token)) {
      prev = _.last(result);
      // If current stripe is the same as previous - merge them
      if (utils.isStripe(prev) && (prev.name == token.name)) {
        prev = _.clone(result.pop());
        prev.count += token.count;
        result.push(prev);
        continue;
      }
    }
    result.push(token);
  }

  // For nested blocks, keep first (depending on doNotMergeFirstPivot)
  // and last stripe
  if (isNested) {
    token = _.first(tokens);
    if (token && doNotMergeFirstPivot) {
      result.splice(0, 0, token);
    }
    token = _.last(tokens);
    if (token && (tokens.length > 1)) {
      result.push(token);
    }
  }

  return result;
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

  return result;
}

function factory() {
  return transform;
}

module.exports = factory;
