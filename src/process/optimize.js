'use strict';

var _ = require('lodash');

function makeProcessorResult(result, modifiedFlag) {
  // If we did something - return modified tokens, otherwise return false
  return modifiedFlag ? result : false;
}

function removeZeroWidthStripes(tokens) {
  var flag = false;
  tokens = _.filter(tokens, function(token) {
    if ((token.token == 'stripe') && (token.count <= 0)) {
      flag = true;
      return false;
    }
    return true;
  });

  return makeProcessorResult(tokens, flag);
}

function mergeColors(tokens) {
  var result = [];
  var flag = false;
  var i;
  var current;
  var merged;

  for (i = 0; i < tokens.length; i++) {
    current = tokens[i];
    if (current.token == 'stripe') {
      if (merged) {
        if (merged.name == current.name) {
          merged.count += current.count;
          flag = true;
        } else {
          result.push(merged);
          merged = _.clone(current);
        }
      } else {
        merged = _.clone(current);
      }
    } else {
      if (merged) {
        result.push(merged);
        merged = null;
      }
      result.push(current);
    }
  }

  if (merged) {
    result.push(merged);
  }

  return makeProcessorResult(result, flag);
}

function removeEmptySquareBraces(tokens) {
  var result = [];
  var flag = false;
  var i;
  var current;
  var next;

  for (i = 0; i < tokens.length; i++) {
    current = tokens[i];
    if (current.token == '[') {
      next = tokens[i + 1];
      if (next && (next.token == ']')) {
        i += 2;
        flag = true;
        continue;
      }
    }
    result.push(current);
  }

  return makeProcessorResult(result, flag);
}

function matchSquareBraces(tokens) {
  var result = [];
  var balance = 0;
  var i;
  var current;

  for (i = 0; i < tokens.length; i++) {
    current = tokens[i];
    if (current.token == '[') {
      balance++;
    }
    if (current.token == ']') {
      balance--;
    }
  }

  if (balance == 0) {
    return false;
  }

  while (balance < 0) {
    result.push({
      token: '['
    });
    balance++;
  }
  [].push.apply(result, tokens);
  while (balance > 0) {
    result.push({
      token: ']'
    });
    balance--;
  }

  return result;
}

var processors = [
  removeEmptySquareBraces,
  mergeColors,
  matchSquareBraces
];

function optimize(tokens) {
  var flag = true;
  var temp;

  tokens = _.filter(tokens, _.isObject);

  // Run `removeZeroWidthStripes` only once
  temp = removeZeroWidthStripes(tokens);
  if (temp) {
    tokens = temp;
  }

  while (flag) {
    flag = false;
    _.each(processors, function(processor) {
      temp = processor(tokens);
      // If processor returned array and it is not source array -
      // decide that is contains modified data. Once all processors
      // did not perform any actions - break `while` loop
      if (_.isArray(temp) && (temp !== tokens)) {
        tokens = temp;
        flag = true;
      }
    });
  }

  return tokens;
}

module.exports = function() {
  return optimize;
};
