'use strict';

var _ = require('lodash');

function factory(processors) {
  processors = _.filter(processors, _.isFunction);

  return function(sett) {
    if (_.isObject(sett)) {
      _.each(processors, function(processor) {
        sett = processor(sett);
      });
    }
    return sett;
  };
}

module.exports = factory;

module.exports.flatten = require('./flatten');
module.exports.flattenSimpleBlocks = require('./flatten-simple-blocks');
module.exports.fold = require('./fold');
module.exports.mergeStripes = require('./merge-stripes');
module.exports.removeEmptyBlocks = require('./remove-empty-blocks');
module.exports.removeZeroWidthStripes = require('./remove-zero-width-stripes');
module.exports.optimize = require('./optimize');
