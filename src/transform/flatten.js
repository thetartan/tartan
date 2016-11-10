'use strict';

var _ = require('lodash');
var utils = require('../utils');

function flatten(block) {
  var result = [];

  // Flatten nested blocks
  _.each(block.items, function(item) {
    if (item.isBlock) {
      // Flatten nested block
      item = flatten(item);
      [].push.apply(result, item.items);
    } else {
      result.push(item);
    }
  });

  // Reflect and repeat
  block = _.clone(block);
  block.items = result;
  return utils.sett.reflectAndRepeat(block);
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
