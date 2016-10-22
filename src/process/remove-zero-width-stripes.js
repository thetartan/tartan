'use strict';

var _ = require('lodash');
var processingUtils = require('./utils');
var utils = require('../utils');

function processTokens(tokens) {
  var wasModified = false;
  tokens = _.filter(tokens, function(token) {
    if (utils.isStripe(token) && (token.count <= 0)) {
      wasModified = true;
      return false;
    }
    return true;
  });

  return processingUtils.makeProcessorResult(tokens, wasModified);
}

function factory(options) {
  return processingUtils.createSimpleProcessor(function(tokens, sett) {
    return processTokens(tokens);
  });
}

module.exports = factory;
