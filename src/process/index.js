'use strict';

var _ = require('lodash');

function factory(processors) {
  processors = _.filter(processors, _.isFunction);

  return function(tokens) {
    _.each(processors, function(processor) {
      tokens = processor(tokens);
    });
  };
}

module.exports = factory;

module.exports.optimize = require('./optimize');
module.exports.unfold = require('./unfold');
module.exports.removeTokens = require('./remove-tokens');
module.exports.pivotsToSquareBraces = require('./pivots-to-square-braces');
