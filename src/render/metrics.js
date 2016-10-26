'use strict';

var _ = require('lodash');
var defaults = require('../defaults');
var rendering = require('./index');

var defaultOptions = {
  // Also options for `pattern` renderer
  weave: defaults.weave.serge
};

function prepareWeave(weave, defaultWeave) {
  return _.isArray(weave) && weave.length == 2 ? weave : defaultWeave;
}

function getPatternMetrics(pattern, weave) {
  pattern = _.filter(pattern, function(item) {
    return _.isArray(item) && (item.length >= 2) && (item[1] > 0);
  });

  var lengthOfPattern = 0;
  var lengthOfCycle = 0;
  if (pattern.length > 0) {
    lengthOfPattern = _.reduce(pattern, function(result, item) {
      return result + item[1];
    }, 0);

    var weaveLength = _.sum(weave);
    lengthOfCycle = lengthOfPattern;
    while (lengthOfCycle % weaveLength != 0) {
      lengthOfCycle += lengthOfPattern;
    }
  }

  return {
    length: lengthOfPattern,
    fullCycle: lengthOfCycle
  };
}

function factory(options) {
  return function(sett) {
    var result = null;
    if (_.isObject(sett)) {
      result = {};
      var warpIsSameAsWeft = sett.weft === sett.warp;
      sett = rendering.pattern(options)(sett);

      options = _.extend({}, defaultOptions, options);
      result.weave = prepareWeave(options.weave, defaults.weave.serge);

      if (sett.warp) {
        result.warp = getPatternMetrics(sett.warp, result.weave);
      }
      if (sett.weft) {
        if (warpIsSameAsWeft) {
          result.weft = result.warp;
        } else {
          result.weft = getPatternMetrics(sett.weft, result.weave);
        }
      }
    }
    return result;
  };
}

module.exports = factory;
