'use strict';

var _ = require('lodash');

var pivotsToSquareBraces = require('./pivots-to-square-braces');

function mirror(tokens) {
  var result = _.clone(tokens);
  tokens = tokens.slice(0, tokens.length - 1);
  [].push.apply(result, tokens.reverse());
  return result;
}

function tryUnfold(tokens) {
  var i;
  var token;
  var from = -1;

  for (i = 0; i < tokens.length; i++) {
    token = tokens[i];
    if (token.token == '[') {
      from = i;
    }
    if (token.token == ']') {
      if (from >= 0) {
        return tokens.slice(0, from).concat(
          mirror(tokens.slice(from + 1, i)),
          tokens.slice(i + 1, tokens.length));
      }
    }
  }

  return false;
}

function unfold(tokens) {
  var temp;

  while (true) {
    temp = tryUnfold(tokens);
    if (_.isArray(temp)) {
      tokens = temp;
    } else {
      break;
    }
  }

  return tokens;
}

module.exports = function(options) {
  var convertPivotsToSquareBraces = pivotsToSquareBraces(options);

  return function(tokens) {
    return unfold(convertPivotsToSquareBraces(tokens));
  };
};
