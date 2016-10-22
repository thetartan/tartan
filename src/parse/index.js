'use strict';

var _ = require('lodash');
var utils = require('../utils');
var defaults = require('../defaults');
var whitespace = require('./whitespace');
var invalid = require('./invalid');

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

function factory(parsers, options, process) {
  parsers = _.filter(parsers, _.isFunction);
  parsers.splice(0, 0, whitespace()); // Prepend this parser to skip spaces
  parsers.push(invalid(options)); // This parser will handle invalid tokens

  return function(str) {
    var tokens = [];
    var offset = 0;
    var result = {
      weave: defaults.weave.serge,
      colors: []
    };

    while (offset < str.length) {
      offset = executeParsers(str, parsers, offset, tokens);
    }

    result.warp = tokens;

    if (_.isFunction(process)) {
      result = process(result);
    }

    return result;
  };
}

module.exports = factory;

module.exports.color = require('./color');
module.exports.stripe = require('./stripe');
module.exports.pivot = require('./pivot');
module.exports.squareBrackets = require('./square-brackets');
