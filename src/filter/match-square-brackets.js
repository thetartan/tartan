'use strict';

var utils = require('../utils');

function processTokens(tokens) {
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
    while (balance < 0) {
      result.push(utils.newTokenOpeningSquareBracket());
      balance++;
    }
    [].push.apply(result, tokens);
    while (balance > 0) {
      result.push(utils.newTokenClosingSquareBracket());
      balance--;
    }
  } else {
    result = tokens;
  }

  return result;
}

function factory() {
  return processTokens;
}

module.exports = factory;
