'use strict';

var _ = require('lodash');

function newStripe(token) {
  return {
    isStripe: true,
    name: token.name,
    count: token.count
  };
}

function newBlock(items, reflect, repeat) {
  repeat = parseInt(repeat, 10) || 0;
  return {
    isBlock: true,
    items: _.filter(items, _.isObject),
    reflect: !!reflect,
    repeat: repeat >= 1 ? repeat : 1
  };
}

function newRootBlock(items, reflect, repeat) {
  var result = newBlock(items, reflect, repeat);
  result.isRoot = true;
  return result;
}

function parseRepeat(value) {
  var result = parseInt(value, 10) || 0;
  return result > 1 ? result : 1;
}

function calculateNodeHash(node) {
  if (!_.isObject(node)) {
    return '';
  }
  if (node.isStripe && (node.count > 0)) {
    return node.name + node.count * parseRepeat(node.repeat);
  }
  if (node.isBlock) {
    if (_.isArray(node.items) && (node.items.length > 0)) {
      return '[' + (node.isRoot ? 'R' : 'B') +
        '*' + parseRepeat(node.repeat) +
        '/' + (node.reflect ? 'RF' : 'RP') + ':' +
        _.chain(node.items)
          .map(calculateNodeHash)
          .join('')
          .value()
        + ']';
    }
  }
  return '';
}

function calculateNodeWeight(node, returnRawWeight) {
  var stripeCount = 0;
  var blockCount = 0;

  if (_.isObject(node)) {
    if (node.isStripe) {
      stripeCount++;
    }

    if (node.isBlock && _.isArray(node.items) && (node.items.length > 0)) {
      if (!node.isRoot) {
        blockCount++;
      }
      var multiplier = node.reflect ? 2 : 1;
      _.each(node.items, function(item) {
        if (_.isObject(item)) {
          if (item.isBlock) {
            var nested = calculateNodeWeight(item, true);
            blockCount += nested.blocks * multiplier;
          }
          if (item.isStripe && node.isRoot && !node.reflect) {
            // Calculate only stripes in root if it is not reflected
            stripeCount++;
          }
        }
      });
    }
  }

  if (returnRawWeight) {
    return {blocks: blockCount, stripes: stripeCount};
  }

  if ((blockCount == 0) && (stripeCount == 0)) {
    return node.isRoot ? 0 : Number.MAX_VALUE;
  }

  return Math.sqrt(blockCount * blockCount + stripeCount * stripeCount);
}

function isSameNode(left, right) {
  if (!_.isObject(left) || (!_.isObject(right))) {
    return false;
  }
  if (left.isStripe && right.isStripe) {
    return (left.name == right.name) && (
      left.count * parseRepeat(left.repeat) ==
      right.count * parseRepeat(right.repeat)
    );
  }
  if (left.isBlock && right.isBlock) {
    // Both should be root or not
    if (left.isRoot != right.isRoot) {
      return false;
    }
    // Both should be reflected or not
    if (left.reflect != right.reflect) {
      return false;
    }
    // Both should be repeated equal times
    if (parseRepeat(left.repeat) != parseRepeat(right.repeat)) {
      return false;
    }
    // Both should have same count of items
    if (!_.isArray(left.items) || !_.isArray(right.items)) {
      return false;
    }
    if (left.items.length != right.items.length) {
      return false;
    }

    // Complex case: compare all items
    var result = true;
    _.each(left.items, function(leftItem, index) {
      var rightItem = right.items[index];
      if (!isSameNode(leftItem, rightItem)) {
        result = false;
        return false; // Break
      }
    });
    return result;
  }
  return false;
}

module.exports.newStripe = newStripe;
module.exports.newBlock = newBlock;
module.exports.newRootBlock = newRootBlock;
module.exports.isSameNode = isSameNode;
module.exports.calculateNodeHash = calculateNodeHash;
module.exports.calculateNodeWeight = calculateNodeWeight;
