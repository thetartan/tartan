'use strict';

var _ = require('lodash');

var flattenSimpleBlocks = require('./flatten-simple-blocks');
var mergeStripes = require('./merge-stripes');
var removeEmptyBlocks = require('./remove-empty-blocks');
var removeZeroWidthStripes = require('./remove-zero-width-stripes');

var defaultOptions = {
  // Also options for removeZeroWidthStripes
  simplifyBlocks: true,
  simplifyStripes: true
};

function optimize(sett, options) {
  // Empty blocks anyway should be removed
  sett = removeEmptyBlocks()(sett);

  if (options.simplifyBlocks) {
    // Try to unfold simple blocks; it may produce new stripes
    // instead of blocks, so do it first
    sett = flattenSimpleBlocks()(sett);
  }

  // Zero-width stripes also should be removed
  sett = removeZeroWidthStripes(options)(sett);

  if (options.simplifyStripes) {
    sett = mergeStripes()(sett);
  }

  return sett;
}

function factory(options) {
  options = _.extend({}, defaultOptions, options);
  return function(sett) {
    return optimize(sett, options);
  };
}

module.exports = factory;
