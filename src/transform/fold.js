'use strict';

var _ = require('lodash');
var utils = require('../utils');

var defaultOptions = {
};

function foldRootBlock(root, options, results) {
  if (root.reflect || (root.items.length % 2 != 0)) {
    return;
  }
  // Smallest reflective sett contains 3 stripes in threadcount or
  // 4 stripes when unfolded, i.e. R/10 K2 Y/2 => R10 K2 Y2 K2;
  // R/10 K/2 => R10 K2
  if (root.items.length < 4) {
    return;
  }

  var items = [];
  var i = 1;
  var j = root.items.length - 1;
  var left;
  var right;

  items.push(root.items[0]);
  while (true) {
    left = root.items[i];
    right = root.items[j];
    if (utils.node.isSameNode(left, right)) {
      items.push(left);
      if (i == j) {
        break;
      }
      i++;
      j--;
      continue;
    }
    return;
  }

  if (items) {
    var result = _.clone(root);
    root.items = items;
    root.reflect = true;
    results.push({
      node: result,
      hash: utils.node.calculateNodeHash(result),
      weight: utils.node.calculateNodeWeight(result)
    });
  }
}

function processTokens(root, options) {
  var variants = [{
    node: root,
    hash: utils.node.calculateNodeHash(root),
    weight: utils.node.calculateNodeWeight(root)
  }];
  foldRootBlock(root, options, variants);
  return _.chain(variants)
    .uniqBy(function(item) {
      return item.hash;
    })
    .sortBy(function(item) {
      return item.weight;
    })
    .value();
}

function transform(sett, options) {
  var result = _.clone(sett);

  var warpIsSameAsWeft = sett.warp === sett.weft;
  if (_.isObject(sett.warp)) {
    result.warpVariants = processTokens(sett.warp, options);
  }
  if (_.isObject(sett.weft)) {
    if (warpIsSameAsWeft) {
      result.weftVariants = result.warpVariants;
    } else {
      result.weftVariants = processTokens(sett.weft, options);
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
