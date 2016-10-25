'use strict';

var _ = require('lodash');
var utils = require('../utils');
var processingUtils = require('./utils');

var defaultOptions = {
  keepColorTokens: false
};

function tryAddColor(token, colors) {
  var result = null;
  if (utils.isColor(token)) {
    result = false;
    if (token.color != colors[token.name]) {
      result = true;
      colors[token.name] = token.color;
    }
  }
  return result;
}

function process(tokens, sett, options) {
  var isModified = false;
  var colors = _.extend({}, sett.colors);

  // Special handling: `palette` may contain a list of colors
  if (_.isArray(sett.palette)) {
    _.each(sett.palette, function(token) {
      var result = tryAddColor(token, colors);
      if (result !== null) {
        isModified = true;
      }
    });
    // Clear the palette as it will not be needed in future (for this sett)
    sett.palette = undefined;
  }

  var result = _.filter(tokens, function(token) {
    var result = tryAddColor(token, colors);
    if (result !== null) { // It was a color!
      if (options.keepColorTokens) {
        // Modified only if color was added to map
        isModified = result === true;
      } else {
        // Modified anyway since we'll remove tokens
        isModified = true;
      }
      return options.keepColorTokens;
    }
    return true;
  });

  if (isModified) {
    sett.colors = utils.normalizeColorMap(colors);
  }

  return processingUtils.makeProcessorResult(result, isModified);
}

function factory(options) {
  options = _.extend({}, defaultOptions, options);
  // Little hack: this function is not intended for such purposes,
  // but if there is at least one `color` token - we will return new
  // array (even with the same tokens) so it will be detected as modified.
  // Also we can modify sett since it is copied in createSimpleProcessor()
  return processingUtils.createSimpleProcessor(function(tokens, sett) {
    return process(tokens, sett, options);
  });
}

module.exports = factory;
