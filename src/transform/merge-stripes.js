'use strict';

var _ = require('lodash');
var utils = require('../utils');

// Do not merge last stripe in nested blocks as it is a pivot that will
// be in center after reflecting!
// Example: [R20 R10 K10 K5]
// Wrong: [R30 K15] => R30 K15 K15 R30 => R30 K30 R30
// Right: [R30 K10 K5] => R30 K10 K5 K10 R30 => R30 K25 R30
function processTokens(tokens, isNested) {
  var result = [];
  var token;
  var prev;
  var correction = isNested ? 1 : 0;

  for (var i = 0; i < tokens.length - correction; i++) {
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

  // For nested blocks, keep last stripe
  token = _.last(tokens);
  if (isNested && (tokens.length > 1) && token) {
    result.push(token);
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
