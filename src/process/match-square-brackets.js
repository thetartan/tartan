'use strict';

var processingUtils = require('./utils');
var utils = require('../utils');

function processTokens(tokens) {
  var isModified = false;
  var result = [];
  var balance = 0;
  var i;
  var current;

  for (i = 0; i < tokens.length; i++) {
    current = tokens[i];
    if (utils.isOpeningSquareBracket(current)) {
      balance++;
    }
    if (utils.isClosingSquareBracket(current)) {
      balance--;
    }
  }

  if (balance != 0) {
    isModified = true;

    while (balance < 0) {
      result.push(utils.newTokenOpeningSquareBracket());
      balance++;
    }
    [].push.apply(result, tokens);
    while (balance > 0) {
      result.push(utils.newTokenClosingSquareBracket());
      balance--;
    }
  }

  return processingUtils.makeProcessorResult(result, isModified);
}

function factory() {
  return processingUtils.createSimpleProcessor(function(tokens, sett) {
    return processTokens(tokens);
  });
}

module.exports = factory;
