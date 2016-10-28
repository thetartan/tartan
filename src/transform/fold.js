'use strict';

var _ = require('lodash');
var utils = require('../utils');

function processTokens(tokens) {
  var result = [];
  var i = 1;
  var j = tokens.length - 1;
  var left;
  var right;

  result.push(tokens[0]);
  while (true) {
    left = tokens[i];
    right = tokens[j];
    if (utils.isStripe(left) && (utils.isStripe(right))) {
      var isSameColor = left.name == right.name;
      var isSameCount = left.count = right.count;
      if (isSameColor && isSameCount) {
        result.push(left);
        if (i == j) {
          break;
        }
        i++;
        j--;
        continue;
      }
    }
    result = null;
    break;
  }

  return result ? [result] : tokens;
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
