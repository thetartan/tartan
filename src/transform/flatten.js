'use strict';

var _ = require('lodash');
var mergeStripes = require('./merge-stripes');

var defaultOptions = {
  mergeStripes: true
};

function flatten(tokens, isNested) {
  var result = [];
  var current;

  for (var i = 0; i < tokens.length; i++) {
    current = tokens[i];
    if (_.isArray(current)) {
      // Flatten nested block
      current = flatten(current, true);
      [].push.apply(result, current);
    } else {
      result.push(current);
    }
  }

  // If we are flattening nested block, we need to reflect it
  if (isNested) {
    var rest = result.slice(0, result.length - 1);
    rest.reverse();
    result = result.concat(rest);
  }

  return result;
}

function transform(sett, options) {
  var result = _.clone(sett);
  var warpIsSameAsWeft = sett.warp == sett.weft;

  if (_.isArray(sett.warp)) {
    result.warp = flatten(sett.warp);
  }
  if (_.isArray(sett.weft)) {
    if (warpIsSameAsWeft) {
      result.weft = result.warp;
    } else {
      result.weft = flatten(sett.weft);
    }
  }

  if (options.mergeStripes) {
    result = mergeStripes()(result);
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
