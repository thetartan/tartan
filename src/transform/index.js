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
module.exports.fold = require('./fold');
