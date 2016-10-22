'use strict';

var defaults = require('../defaults');
var processing = require('./index');

var optimize = processing([
  processing.removeTokens(defaults.insignificantTokens),
  processing.removeEmptySquareBrackets(),
  processing.mergeStripes(),
  processing.matchSquareBrackets()
], {
  runUntilUnmodified: true
});

module.exports = function() {
  return optimize;
};
