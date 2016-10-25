'use strict';

var _ = require('lodash');
var processingUtils = require('./utils');
var utils = require('../utils');

function processForward(tokens, result) {
  var isModified = false;
  var i;
  var token;

  token = _.first(tokens);
  if (utils.isClosingSquareBracket(token)) {
    isModified = true;
    result.push(utils.newTokenClosingParenthesis());
  } else {
    result.push(token);
  }

  for (i = 1; i < tokens.length; i++) {
    token = tokens[i];
    if (utils.isClosingSquareBracket(token)) {
      isModified = true;
      token = result.pop();
      result.push(utils.newTokenClosingParenthesis());
      result.push(token);
    } else {
      result.push(token);
    }
  }

  return isModified;
}

function processBackward(tokens, result) {
  var isModified = false;
  var i;
  var token;

  token = _.last(tokens);
  if (utils.isOpeningSquareBracket(token)) {
    isModified = true;
    result.push(utils.newTokenOpeningParenthesis());
  } else {
    result.push(token);
  }

  for (i = tokens.length - 2; i >= 0; i--) {
    token = tokens[i];
    if (utils.isOpeningSquareBracket(token)) {
      isModified = true;
      token = result.pop();
      result.push(utils.newTokenOpeningParenthesis());
      result.push(token);
    } else {
      result.push(token);
    }
  }

  // We have reversed token list; let's put them in right order
  result.reverse();

  return isModified;
}

function processTokens(tokens) {
  var isModified = false;
  var result;

  result = [];
  if (processForward(tokens, result)) {
    isModified = true;
  }

  tokens = result;
  result = [];
  if (processBackward(tokens, result)) {
    isModified = true;
  }

  return processingUtils.makeProcessorResult(result, isModified);
}

function factory() {
  return processingUtils.createSimpleProcessor(function(tokens, sett) {
    return processTokens(tokens);
  });
}

module.exports = factory;
