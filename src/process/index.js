'use strict';

var _ = require('lodash');

var defaultOptions = {
  runUntilUnmodified: true,
  maxIterations: 2000
};

function runProcessors(sett, processors) {
  var isModified = false;
  _.each(processors, function(processor) {
    var temp = processor(sett);
    if (_.isObject(temp) && (temp !== sett)) {
      // If processor returned modified sett - replace current
      // value with it. But do not stop iterating through processors -
      // let next receive modified value as well.
      sett = temp;
      isModified = true;
    }
  });

  return isModified ? sett : false;
}

function process(sett, processors, options) {
  var iterationCount = 0;

  // Initial value is `true` because we need to enter a loop.
  var isModified = true;

  while (isModified) {
    isModified = false;
    // Try to execute processors
    var temp = runProcessors(sett, processors);
    if (temp) {
      isModified = true;
      sett = temp;
    }
    // Break if we don't need to run until all processors stops
    // to modify sett
    if (!options.runUntilUnmodified) {
      break;
    }
    // If there is iteration limit - respect it
    if (options.maxIterations > 0) {
      iterationCount++;
      if (iterationCount >= options.maxIterations) {
        break;
      }
    }
  }

  return sett;
}

function factory(processors, options) {
  processors = _.filter(processors, _.isFunction);
  options = _.extend({}, defaultOptions, options);

  return function(sett) {
    if (!_.isObject(sett)) {
      return sett;
    }
    return process(sett, processors, options);
  };
}

module.exports = factory;

module.exports.extractColors = require('./extract-colors');
module.exports.matchSquareBrackets = require('./match-square-brackets');
module.exports.mergeStripes = require('./merge-stripes');
module.exports.optimize = require('./optimize');
module.exports.pivotsToSquareBrackets = require('./pivots-to-square-brackets');
module.exports.removeEmptySquareBrackets =
  require('./remove-empty-square-brackets');
module.exports.removeTokens = require('./remove-tokens');
module.exports.removeZeroWidthStripes = require('./remove-zero-width-stripes');
module.exports.unfold = require('./unfold');
