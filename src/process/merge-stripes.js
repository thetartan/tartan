'use strict';

var _ = require('lodash');
var processingUtils = require('./utils');

function processTokens(tokens) {
  var result = [];
  var isModified = false;
  var i;
  var current;
  var merged;

  for (i = 0; i < tokens.length; i++) {
    current = tokens[i];
    if (current.token == 'stripe') {
      if (merged) {
        if (merged.name == current.name) {
          merged.count += current.count;
          isModified = true;
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

  return processingUtils.makeProcessorResult(result, isModified);
}

function factory() {
  return processingUtils.createSimpleProcessor(function(tokens, sett) {
    return processTokens(tokens);
  });
}

module.exports = factory;
