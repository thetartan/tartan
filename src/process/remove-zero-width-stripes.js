'use strict';

var _ = require('lodash');
var processingUtils = require('./utils');
var utils = require('../utils');

function processTokens(tokens) {
  var isModified = false;
  tokens = _.filter(tokens, function(token) {
    // Do not remove zero-length pivots as it will break pattern
    if (utils.isStripe(token) && (token.count <= 0)) {
      isModified = true;
      return false;
    }
    return true;
  });

  return processingUtils.makeProcessorResult(tokens, isModified);
}

function factory(options) {
  return processingUtils.createSimpleProcessor(function(tokens, sett) {
    return processTokens(tokens);
  });
}

module.exports = factory;
