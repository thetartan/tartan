'use strict';

var _ = require('lodash');
var utils = require('../utils');

function simplify(block) {
  var color = null;
  var isSingleColor = true;
  _.each(block.items, function(item) {
    if (item.isStripe) {
      // Do not take in account zero-width stripes
      if (item.count == 0) {
        return;
      }
      if (color === null) {
        // Initialize with current color
        color = item.name;
        return;
      }
      // Everything is ok
      if (item.name == color) {
        return;
      }
    }
    // Break
    isSingleColor = false;
    return false;
  });

  if (isSingleColor && (color !== null)) {
    block = utils.sett.reflectAndRepeat(block);
    block.items = [
      utils.node.newStripe(
        utils.token.newStripe(
          color,
          _.sumBy(block.items, function(item) {
            return item.count;
          })
        )
      )
    ];
  }

  return block;
}

function flatten(block) {
  block = _.clone(block);

  // Try to simplify nested items
  block.items = _.chain(block.items)
    // Unfold nested blocks if they are not reflective and
    // should be repeated only once
    .reduce(function(accumulator, item) {
      if (item.isBlock && !item.isRoot && !item.reflect && (item.repeat <= 1)) {
        [].push.apply(accumulator, item.items);
      } else {
        accumulator.push(item);
      }
      return accumulator;
    }, [])
    // Unfold and merge single-color blocks
    .map(function(item) {
      if (item.isBlock) {
        if (item.items.length == 0) {
          return null;
        }

        item = flatten(item);
        if (item.items.length == 0) {
          return null;
        }
        if (item.items.length == 1) {
          return _.first(item.items);
        }
      }
      return item;
    })
    .filter()
    .value();

  // Try to simplify block itself
  return simplify(block);
}

function transform(sett) {
  var result = _.clone(sett);
  var warpIsSameAsWeft = sett.warp == sett.weft;

  if (_.isObject(sett.warp)) {
    result.warp = flatten(sett.warp);
  }
  if (_.isObject(sett.weft)) {
    if (warpIsSameAsWeft) {
      result.weft = result.warp;
    } else {
      result.weft = flatten(sett.weft);
    }
  }

  return result;
}

function factory() {
  return transform;
}

module.exports = factory;
