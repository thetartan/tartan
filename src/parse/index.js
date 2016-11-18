'use strict';

var _ = require('lodash');
var tokenize = require('./tokenize');

var defaultOptions = {
  errorHandler: null,
  processTokens: null,
  buildSyntaxTree: null,
  foreseeLimit: 1
};

function factory(parsers, options) {
  options = _.extend({}, defaultOptions, options);

  return function(source) {
    var context = tokenize(source, parsers, options);
    var result = context.parse();
    if (_.isFunction(options.processTokens)) {
      result = options.processTokens(result);
    }
    if (_.isFunction(options.buildSyntaxTree)) {
      result = options.buildSyntaxTree(result);
    }
    return result;
  };
}

module.exports = factory;

module.exports.color = require('./token/color');
module.exports.stripe = require('./token/stripe');
module.exports.pivot = require('./token/pivot');
module.exports.repeat = require('./token/repeat');
module.exports.literal = require('./token/literal');
