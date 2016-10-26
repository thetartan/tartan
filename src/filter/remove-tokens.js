'use strict';

var _ = require('lodash');
var defaults = require('../defaults');

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

function factory(typesOrPredicate) {
  var predicate = createPredicate(typesOrPredicate);
  return function(tokens) {
    return _.filter(tokens, function(token) {
      return !predicate(token);
    });
  };
}

module.exports = factory;
