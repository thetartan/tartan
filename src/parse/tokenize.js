'use strict';

var _ = require('lodash');
var utils = require('../utils');
var whitespace = require('./token/whitespace');
var invalid = require('./token/invalid');

function canBeMerged(token) {
  return utils.isInvalid(token) || utils.isWhitespace(token);
}

function appendToken(tokens, token) {
  if (canBeMerged(token)) {
    var last = _.last(tokens);
    if (last && canBeMerged(last)) {
      if (last.type == token.type) {
        last.value += token.value;
        last.length += token.length;
        return;
      }
    }
  }
  tokens.push(token);
}

function executeParsers(source, parsers, offset, result) {
  _.each(parsers, function(parser) {
    var token = parser(source, offset);
    if (_.isObject(token)) {
      token.offset = token.offset || offset;
      token.source = source;
      appendToken(result, token);
      offset = token.offset + token.length;
      return false;
    }
  });

  return offset;
}

function factory(parsers, options) {
  parsers = _.filter(parsers, _.isFunction);
  parsers.splice(0, 0, whitespace()); // Prepend this parser to skip spaces
  parsers.push(invalid(options)); // This parser will handle invalid tokens

  return function(source) {
    var tokens = [];
    var offset = 0;

    while (offset < source.length) {
      offset = executeParsers(source, parsers, offset, tokens);
    }

    return tokens;
  };
}

module.exports = factory;
