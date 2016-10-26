'use strict';

var _ = require('lodash');

function factory(processors) {
  processors = _.filter(processors, _.isFunction);

  return function(sett) {
    if (_.isObject(sett)) {
      for (var i = 0; i < processors.length; i++) {
        sett = processors(sett);
      }
    }
    return sett;
  };
}

module.exports = factory;

module.exports.flatten = require('./flatten');
module.exports.mergeStripes = require('./merge-stripes');
module.exports.optimize = require('./optimize');
