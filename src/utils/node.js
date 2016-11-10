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

module.exports.newStripe = newStripe;
module.exports.newBlock = newBlock;
module.exports.newRootBlock = newRootBlock;
