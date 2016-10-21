'use strict';

var _ = require('lodash');
var whitespace = require('./whitespace');
var invalid = require('./invalid');

function splitColorsAndTokens(tokens) {
  var colors = {};

  tokens = _.chain(tokens)
    .map(function(token) {
      if (token.token == 'color') {
        colors[token.name] = token.color;
        return null;
      }
      return token;
    })
    .filter()
    .value();

  return {
    colors: colors,
    tokens: tokens
  };
}

function appendToken(tokens, token) {
  var canBeMerged = ['whitespace', 'invalid'];
  if (canBeMerged.indexOf(token.token) >= 0) {
    var last = _.last(tokens);
    if (last && (canBeMerged.indexOf(last.token) >= 0)) {
      if (last.token == token.token) {
        last.value += token.value;
        last.length += token.length;
        return;
      }
    }
  }
  tokens.push(token);
}

function executeParsers(str, parsers, offset, result) {
  _.each(parsers, function(parser) {
    var token = parser(str, offset);
    if (_.isObject(token)) {
      token.offset = token.offset || offset;
      token.source = str;
      appendToken(result, token);
      offset = token.offset + token.length;
      return false;
    }
  });

  return offset;
}

function factory(parsers, processors, options) {
  parsers = _.filter(parsers, _.isFunction);
  parsers.splice(0, 0, whitespace()); // Prepend this parser to skip spaces
  parsers.push(invalid(options)); // This parser will handle invalid tokens

  processors = _.filter(processors, _.isFunction);

  return function(str) {
    var result = [];
    var offset = 0;

    while (offset < str.length) {
      offset = executeParsers(str, parsers, offset, result);
    }

    result = splitColorsAndTokens(result);

    _.each(processors, function(processor) {
      result.tokens = processor(result.tokens);
    });

    return result;
  };
}

module.exports = factory;

module.exports.color = require('./color');
module.exports.stripe = require('./stripe');
module.exports.pivot = require('./pivot');
module.exports.squareBraces = require('./square-braces');
