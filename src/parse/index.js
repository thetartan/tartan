'use strict';

var _ = require('lodash');
var lexer = require('./tokenize');

var defaultOptions = {
  // function to filter parsed tokens: (tokens) => { return modifiedTokens; }
  filterTokens: null,
  // Function to build AST: (tokens) => { return newAST; }
  buildSyntaxTree: null
};

function factory(parsers, options) {
  var tokenize = lexer(parsers, options);
  options = _.extend({}, defaultOptions, options);
  return function(source) {
    if (!_.isString(source)) {
      return null;
    }
    var result = tokenize(source);

    if (_.isFunction(options.filterTokens)) {
      result = options.filterTokens(result);
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
module.exports.literal = require('./token/literal');
