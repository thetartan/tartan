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

module.exports.matchSquareBrackets = require('./match-square-brackets');
module.exports.pivotsToSquareBrackets = require('./pivots-to-square-brackets');
module.exports.removeTokens = require('./remove-tokens');
module.exports.removeZeroWidthStripes = require('./remove-zero-width-stripes');
