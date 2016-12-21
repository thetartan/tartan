'use strict';

var _ = require('lodash');
var utils = require('../utils');

var defaultOptions = {
  calculateNodeWeight: utils.node.calculateNodeWeight
};

function tryFoldBlock(items) {
  // Smallest reflective sett contains 3 stripes in threadcount or
  // 5 stripes when unfolded, i.e. R/10 K2 Y/2 => R10 K2 Y2 K2 R10;
  // R/10 K/2 => R10 K2
  if ((items.length < 5) || (items.length % 2 != 1)) {
    return;
  }

  var left;
  var right;

  var result = [];
  var i = 0;
  var j = items.length - 1;
  while (true) {
    left = items[i];
    right = items[j];
    if (utils.node.isSameNode(left, right)) {
      result.push(left);
      if (i == j) {
        break;
      }
      i++;
      j--;
      continue;
    }
    return;
  }

  return result;
}

function foldRootBlock(root, options, results) {
  if (root.reflect || (root.items.length == 0)) {
    return;
  }

  var items = _.concat(root.items, root.items[0]);
  var resultItems = tryFoldBlock(items);
  if (_.isArray(resultItems)) {
    var result = _.clone(root);
    result.items = resultItems;
    result.reflect = true;
    results.push({
      node: result,
      hash: utils.node.calculateNodeHash(result),
      weight: options.calculateNodeWeight(result)
    });
  }
}

function processTokens(root, options, doNotLog) {
  var variants = [];
  foldRootBlock(root, options, variants);
  variants.push({
    node: root,
    hash: utils.node.calculateNodeHash(root),
    weight: options.calculateNodeWeight(root)
  });

  // There may be at most two variants: unfolded and folded;
  // folded is better.
  return variants;
}

function transform(sett, options) {
  var result = _.clone(sett);

  var warpIsSameAsWeft = sett.warp === sett.weft;
  if (_.isObject(sett.warp)) {
    result.warpVariants = processTokens(sett.warp, options, true);
  }
  if (_.isObject(sett.weft)) {
    if (warpIsSameAsWeft) {
      result.weftVariants = result.warpVariants;
    } else {
      result.weftVariants = processTokens(sett.weft, options, true);
    }
  }

  // Take the best variant, but keep other too
  result.warp = _.first(result.warpVariants).node;
  result.weft = _.first(result.weftVariants).node;

  return result;
}

function factory(options) {
  options = _.extend({}, defaultOptions, options);
  return function(sett) {
    return transform(sett, options);
  };
}

module.exports = factory;
