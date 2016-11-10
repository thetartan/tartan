'use strict';

var _ = require('lodash');

// Do not merge last stripe in reflected blocks as it is central pivot.
// Do not merge first stripe in blocks if it is reflected and repeated.
// Example: [R20 R10 R5 Y2 K10 K5]
// Wrong: [R35 Y2 K15] => R35 Y2 K15 Y2
// Right: [R20 R15 Y2 K10 K5]
//        => R20 R15 Y2 K10 K5 K10 Y2 R15
//        => R35 Y2 K25 Y2 R15
function processTokens(block) {
  // Root is always repetitive
  var first = block.reflect && (block.isRoot || (block.repeat > 1)) ?
    _.first(block.items) : null;
  var last = block.reflect ? _.last(block.items) : null;

  block = _.clone(block);
  block.items = _.reduce(block.items, function(accumulator, item) {
    // Process nested blocks
    if (item.isBlock) {
      accumulator.push(processTokens(item));
      return accumulator;
    }
    if (item.isStripe) {
      // Check last item
      if (item === last) {
        accumulator.push(item);
        return accumulator;
      }
      var prev = _.last(accumulator);
      // Check first item
      if (prev && prev.isStripe && (prev !== first)) {
        if (prev.name == item.name) {
          prev = _.clone(accumulator.pop());
          prev.count += item.count;
          accumulator.push(prev);
          return accumulator;
        }
      }
    }
    accumulator.push(item);
    return accumulator;
  }, []);

  return block;
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

function factory() {
  return transform;
}

module.exports = factory;
