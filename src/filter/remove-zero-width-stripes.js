'use strict';

var _ = require('lodash');
var utils = require('../utils');

function processTokens(tokens) {
  return _.filter(tokens, function(token) {
    // Do not remove zero-length pivots as it will break pattern
    var isZeroWidthStripe = utils.isStripe(token) && (token.count <= 0);
    return !isZeroWidthStripe;
  });
}

function factory() {
  return processTokens;
}

module.exports = factory;
