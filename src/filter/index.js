'use strict';

var _ = require('lodash');

function factory(processors) {
  processors = _.filter(processors, _.isFunction);

  return function(tokens) {
    if (_.isArray(tokens)) {
      for (var i = 0; i < processors.length; i++) {
        tokens = processors[i](tokens);
      }
    }
    return tokens;
  };
}

module.exports = factory;

module.exports.classify = require('./classify');
module.exports.removeTokens = require('./remove-tokens');
