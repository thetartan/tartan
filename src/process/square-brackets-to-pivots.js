'use strict';

var _ = require('lodash');
var processingUtils = require('./utils');
var utils = require('../utils');
var errors = require('../errors');

var defaultOptions = {
  unfoldNestedBlocks: true
};

function processTokens(tokens, options) {
  var isModified = false;
  var result = [];
  var token;
  var i;

  for (i = 0; i < tokens.length; i++) {
    token = tokens[i];
    if (utils.isOpeningSquareBracket(token)) {
      isModified = true;
      i++;
      token = tokens[i];
      if (utils.isStripe(token)) {
        result.push(utils.stripeToPivot(token));
        continue;
      }
    }
    if (utils.isClosingSquareBracket(token)) {
      isModified = true;
      token = result.pop();
      if (utils.isStripe(token)) {
        token = utils.stripeToPivot(token);
      }
      result.push(token);
      continue;
    }
    result.push(token);
  }

  return processingUtils.makeProcessorResult(result, isModified);
}

function factory(options) {
  options = _.extend({}, defaultOptions, options);
  return processingUtils.createSimpleProcessor(function(tokens, sett) {
    return processTokens(tokens, options);
  });
}

module.exports = factory;
