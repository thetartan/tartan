'use strict';

var _ = require('lodash');
var process = require('./index');
var processingUtils = require('./utils');
var utils = require('../utils');

function reflect(tokens) {
  var result = _.clone(tokens);
  tokens = tokens.slice(0, tokens.length - 1);
  [].push.apply(result, tokens.reverse());
  return result;
}

function unfold(tokens) {
  var i;
  var token;
  var from = -1;

  for (i = 0; i < tokens.length; i++) {
    token = tokens[i];
    if (utils.isOpeningSquareBracket(token)) {
      from = i;
    }
    if (utils.isClosingSquareBracket(token)) {
      if (from >= 0) {
        return tokens.slice(0, from).concat(
          reflect(tokens.slice(from + 1, i)),
          tokens.slice(i + 1, tokens.length));
      }
    }
  }

  return false;
}

function processTokens(tokens) {
  var wasModified = false;
  while (true) {
    var temp = unfold(tokens);
    if (_.isArray(temp)) {
      tokens = temp;
      wasModified = true;
    } else {
      break;
    }
  }

  return processingUtils.makeProcessorResult(tokens, wasModified);
}

function factory(options) {
  return processingUtils.createSimpleProcessor(function(tokens, sett) {
    return processTokens(tokens);
  }, process([
    // Preprocessors
    process.pivotsToSquareBrackets(options)
  ]));
}

module.exports = factory;
