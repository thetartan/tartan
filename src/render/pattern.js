'use strict';

var _ = require('lodash');
var errors = require('../errors');
var defaults = require('../defaults');
var utils = require('../utils');

var defaultOptions = {
  skipUnsupportedTokens: false,
  skipInvalidColors: false,
  defaultColors: defaults.colors
};

function isSupportedToken(token) {
  return utils.isStripe(token) || utils.isPivot(token);
}

function getThreadCount(token, options) {
  // Check if we support this type of token
  if (!isSupportedToken(token)) {
    if (!options.skipUnsupportedTokens) {
      throw new errors.UnsupportedToken(token);
    } else {
      return 0;
    }
  }
  return token.count;
}

function getColor(token, colors, options) {
  // Try to find color
  var color = colors[token.name];
  if (_.isUndefined(color)) {
    if (!options.skipInvalidColors) {
      throw new errors.ColorNotFound(token, colors);
    } else {
      return null;
    }
  }
  if (!utils.isValidColor(color)) {
    if (!options.skipInvalidColors) {
      throw new errors.InvalidColorFormat(token, colors);
    } else {
      return null;
    }
  }
  return color;
}

function render(tokens, colors, options) {
  return _.chain(tokens)
    .map(function(token) {
      var count = getThreadCount(token, options);
      if (count <= 0) {
        return null;
      }

      var color = getColor(token, colors, options);
      if (!color) {
        return null;
      }

      return [color, count];
    })
    .filter()
    .value();
}

function factory(options, process) {
  options = _.extend({}, defaultOptions, options);

  return function(sett) {
    if (!_.isObject(sett)) {
      return {};
    }
    if (_.isFunction(process)) {
      sett = process(sett);
    }

    var colors = _.extend({}, options.defaultColors, sett.colors);

    var result = _.clone(sett);
    if (sett.warp) {
      result.warp = render(sett.warp, colors, options);
    }
    if (sett.weft) {
      if (sett.weft !== sett.warp) {
        result.weft = render(sett.weft, colors, options);
      } else {
        result.weft = result.warp;
      }
    }

    return result;
  };
}

module.exports = factory;
