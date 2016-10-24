'use strict';

var _ = require('lodash');
var defaults = require('../defaults');
var processing = require('./index');

var defaultOptions = {
  // Extract colors
  extractColors: true,
  // Force converting of pivots and parenthesis to square brackets
  forceSquareBrackets: true
};

function factory(options) {
  options = _.extend({}, defaultOptions, options);

  var processors = [];

  processors.push(processing.removeTokens(defaults.insignificantTokens));
  if (options.extractColors) {
    // To make square braces optimizations, we need to ensure
    // that there are no tokens that makes threadcount, and all
    // tokens that can are making reflections (like `pivot`) are
    // replaced with square braces
    processors.push(processing.extractColors({
      keepColorTokens: false
    }));
  }
  if (options.forceSquareBrackets) {
    processors.push(processing.pivotsToSquareBrackets());
    processors.push(processing.parenthesisToSquareBrackets());
  }

  processors.push(processing.matchSquareBrackets());
  processors.push(processing.removeEmptySquareBrackets());
  processors.push(processing.mergeStripes());

  return processing(processors, {
    runUntilUnmodified: true
  });
}

module.exports = factory;