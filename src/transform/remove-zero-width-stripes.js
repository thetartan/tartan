'use strict';

var _ = require('lodash');

// TODO: Last zero-width stripe in block can be removed...
// ... with modifying previous stripe:
// [R10 K4 W0] => R10 K4 W0 K4 R10 => R10 K8 R10
// [R10 K8]              =>           R10 K8 R10

var defaultOptions = {
  keepZeroWidthPivots: true
};

// Do not remove last stripe in reflected blocks as it is central pivot.
// Do not remove first stripe in blocks if it is reflected and repeated.
// Example: [R0 B10 Y2 K5]
// Wrong: [B10 Y2 K5] => B10 Y2 K5 Y2
// Right: [R0 B10 Y2 K5]
//        => R0 B10 Y2 K5 Y2 B10
//        => B10 Y2 K5 Y2 B10
function removeZeroWidthStripes(block, options) {
  // Root is always repetitive
  var first = block.reflect && (block.isRoot || (block.repeat > 1)) ?
    _.first(block.items) : null;
  var last = block.reflect ? _.last(block.items) : null;

  block = _.clone(block);
  block.items = _.chain(block.items)
    .map(function(item) {
      // Recursive processing of nested blocks
      if (item.isBlock) {
        item = removeZeroWidthStripes(item, options);
        return item.items.length > 0 ? item : null;
      } else
      // Check stripes
      if (item.isStripe) {
        if (item.count > 0) {
          return item;
        }
        if (options.keepZeroWidthPivots) {
          // Keep first and last stripes as they are pivots
          if ((item === first) || (item === last)) {
            return item;
          }
        }
      } else {
        // Keep everything else
        return item;
      }
      return null;
    })
    .filter()
    .value();

  return block;
}

function transform(sett, options) {
  var result = _.clone(sett);
  var warpIsSameAsWeft = sett.warp == sett.weft;

  if (_.isObject(sett.warp)) {
    result.warp = removeZeroWidthStripes(sett.warp, options);
  }
  if (_.isObject(sett.weft)) {
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
  };
}

module.exports = factory;
