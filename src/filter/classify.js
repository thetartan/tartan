'use strict';

var _ = require('lodash');
var utils = require('../utils');
var defaults = require('../defaults');

var defaultOptions = {
  isColor: function(token, index, tokens) {
    return utils.token.isColor(token);
  },
  isStripe: function(token, index, tokens) {
    return utils.token.isStripe(token);
  },
  isPivot: function(token, index, tokens) {
    return utils.token.isPivot(token);
  },
  isWarpAndWeftSeparator: function(token, index, tokens) {
    return utils.token.isLiteral(token) &&
      (token.value == defaults.warpAndWeftSeparator);
  },
  isBlockStart: function(token, index, tokens) {
    return utils.token.isOpeningSquareBracket(token);
  },
  isBlockEnd: function(token, index, tokens) {
    return utils.token.isClosingSquareBracket(token);
  }
};

function isNone(token, index, tokens) {
  return false;
}

function process(tokens, options) {
  return _.map(tokens, function(token, index) {
    var result = _.clone(token);
    _.each(options, function(check, property) {
      result[property] = check(token, index, tokens);
    });
    return result;
  });
}

function factory(options) {
  options = _.extend({}, defaultOptions, options);
  _.each(defaultOptions, function(value, key) {
    if (!_.isFunction(options[key])) {
      options[key] = isNone;
    }
  });
  return function(tokens) {
    return process(tokens, options);
  };
}

module.exports = factory;
