'use strict';

var _ = require('lodash');
var defaults = require('../defaults');
var processingUtils = require('./utils');

function createPredicate(typesOrPredicate) {
  // Predicate should return `true` if token should be removed from list
  if (_.isFunction(typesOrPredicate)) {
    return typesOrPredicate;
  }
  if (!_.isArray(typesOrPredicate)) {
    typesOrPredicate = defaults.insignificantTokens;
  }
  return function(token) {
    return _.isObject(token) ? typesOrPredicate.indexOf(token.type) >= 0 : true;
  };
}

function processTokens(tokens, predicate) {
  if (!_.isArray(tokens)) {
    return false;
  }
  var isModified = false;
  var result = _.filter(tokens, function(token) {
    if (predicate(token)) {
      isModified = true;
      return false;
    }
    return true;
  });

  return processingUtils.makeProcessorResult(result, isModified);
}

function factory(typesOrPredicate) {
  var predicate = createPredicate(typesOrPredicate);
  return processingUtils.createSimpleProcessor(function(tokens, sett) {
    return processTokens(tokens, predicate);
  });
}

module.exports = factory;
