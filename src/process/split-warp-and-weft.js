'use strict';

var _ = require('lodash');

function process(sett, predicate) {
  var hasWarp = _.isArray(sett.warp);
  var hasWeft = _.isArray(sett.weft);
  var warpIsSameAsWeft = sett.warp === sett.weft;
  if (!hasWarp && !hasWeft) {
    // There is nothing to process
    return false;
  }
  if (hasWarp && hasWeft && !warpIsSameAsWeft) {
    // Sett already has warp and weft
    return false;
  }

  var isModified = false;
  var tokens = hasWarp ? sett.warp : sett.weft;
  var warp = [];
  var weft = [];
  var current = warp;
  _.each(tokens, function(token) {
    if (predicate(token)) {
      current = weft;
      isModified = true;
    } else {
      current.push(token);
    }
  });

  if (isModified) {
    var result = _.clone(sett);
    if (warp.length == 0) {
      warp = weft;
      weft = [];
    }
    result.warp = warp.length > 0 ? warp : undefined;
    result.weft = weft.length > 0 ? weft : undefined;
    return result;
  } else {
    return false;
  }
}

function factory(predicate) {
  if (!_.isFunction(predicate)) {
    return _.identity;
  }
  return function(sett) {
    return process(sett, predicate);
  };
}

module.exports = factory;
