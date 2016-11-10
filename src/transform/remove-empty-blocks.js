'use strict';

var _ = require('lodash');

function removeEmptyBlocks(block) {
  block = _.clone(block);
  block.items = _.chain(block.items)
    .map(function(item) {
      // Recursive processing of nested blocks
      if (item.isBlock) {
        item = removeEmptyBlocks(item);
        return item.items.length > 0 ? item : null;
      }
      // Keep everything else
      return item;
    })
    .filter()
    .value();

  return block;
}

function transform(sett) {
  var result = _.clone(sett);
  var warpIsSameAsWeft = sett.warp == sett.weft;

  if (_.isObject(sett.warp)) {
    result.warp = removeEmptyBlocks(sett.warp);
  }
  if (_.isObject(sett.weft)) {
    if (warpIsSameAsWeft) {
      result.weft = result.warp;
    } else {
      result.weft = removeEmptyBlocks(sett.weft);
    }
  }

  return result;
}

function factory() {
  return transform;
}

module.exports = factory;
