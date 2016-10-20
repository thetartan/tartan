'use strict';

var _ = require('lodash');
var errors = require('../errors');
var normalizeColorMap = require('../utils/normalize-color-map');
var isValidColor = require('../utils/is-valid-color');

var defaultOptions = {
  skipUnsupportedTokens: false,
  skipInvalidColors: false
};

function render(tokens, colors, options) {
  var acceptedTokens = ['stripe', 'pivot'];
  return _.chain(tokens)
    .map(function(token) {
      // Check if we support this type of token
      if (acceptedTokens.indexOf(token.token) == -1) {
        if (!options.skipUnsupportedTokens) {
          throw new errors.UnsupportedToken(token);
        } else {
          return;
        }
      }
      if (token.count <= 0) {
        return;
      }
      // Try to find color
      var color = colors[token.name];
      if (_.isUndefined(color)) {
        if (!options.skipInvalidColors) {
          throw new errors.ColorNotFound(token, colors);
        } else {
          return;
        }
      }
      if (!isValidColor(color)) {
        if (!options.skipInvalidColors) {
          throw new errors.InvalidColorFormat(token, colors);
        } else {
          return;
        }
      }
      return [color, token.count];
    })
    .filter()
    .value();
}

function factory(defaultColors, processors, options) {
  processors = _.filter(processors, _.isFunction);
  defaultColors = normalizeColorMap(defaultColors);
  options = _.extend({}, defaultOptions, options);
  return function(sett) {
    var tokens = _.isObject(sett) ? sett.tokens : [];
    var colors = _.isObject(sett) ? sett.colors : {};
    _.each(processors, function(processor) {
      tokens = processor(tokens);
    });
    return render(tokens, _.extend({}, defaultColors, colors), options);
  }
}

module.exports = factory;
