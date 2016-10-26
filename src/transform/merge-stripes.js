'use strict';

var _ = require('lodash');
var utils = require('../utils');

function processTokens(tokens) {
  var result = [];
  var token;
  var prev;

  for (var i = 0; i < tokens.length; i++) {
    token = tokens[i];
    // Do not process first token
    if ((i > 0) && utils.isStripe(token)) {
      prev = _.last(result);
      // If current stripe is the same as previous - merge them
      if (utils.isStripe(prev) && (prev.name == token.name)) {
        prev.count += token.count;
        continue;
      }
    }
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
