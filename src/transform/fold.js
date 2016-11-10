'use strict';

var _ = require('lodash');

var defaultOptions = {
};

function processTokens(root, options) {
  if (root.reflect || (root.items.length % 2 != 0)) {
    return root;
  }
  // Smallest reflective sett contains 3 stripes in threadcount or
  // 4 stripes when unfolded, i.e. R/10 K2 Y/2 => R10 K2 Y2 K2;
  // R/10 K/2 => R10 K2
  if (root.items.length < 4) {
    return root;
  }

  var result = [];
  var i = 1;
  var j = root.items.length - 1;
  var left;
  var right;

  result.push(root.items[0]);
  while (true) {
    left = root.items[i];
    right = root.items[j];
    if (left.isStripe && right.isStripe) {
      var isSameColor = left.name == right.name;
      var isSameCount = left.count == right.count;
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

  if (result) {
    root = _.clone(root);
    root.items = result;
    root.reflect = true;
  }
  return root;
}

function transform(sett, options) {
  var result = _.clone(sett);

  var warpIsSameAsWeft = sett.warp === sett.weft;
  if (_.isObject(sett.warp)) {
    result.warp = processTokens(sett.warp, options);
  }
  if (_.isObject(sett.weft)) {
    if (warpIsSameAsWeft) {
      result.weft = result.warp;
    } else {
      result.weft = processTokens(sett.weft, options);
    }
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
