'use strict';

var processingUtils = require('./utils');
var utils = require('../utils');

function processTokens(tokens) {
  var result = [];
  var isModified = false;
  var i;
  var current;
  var next;

  for (i = 0; i < tokens.length; i++) {
    current = tokens[i];
    if (utils.isOpeningSquareBracket(current)) {
      next = tokens[i + 1];
      if (utils.isClosingSquareBracket(next)) {
        i += 2;
        isModified = true;
        continue;
      }
    }
    result.push(current);
  }

  return processingUtils.makeProcessorResult(result, isModified);
}

function factory() {
  return processingUtils.createSimpleProcessor(function(tokens, sett) {
    return processTokens(tokens);
  });
}

module.exports = factory;
