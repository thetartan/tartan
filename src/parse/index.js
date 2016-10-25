'use strict';

var _ = require('lodash');
var utils = require('../utils');
var defaults = require('../defaults');
var stringSource = require('../source/string');
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

function parse(str, parsers) {
  var tokens = [];
  var offset = 0;

  while (offset < str.length) {
    offset = executeParsers(str, parsers, offset, tokens);
  }

  return tokens;
}

function factory(parsers, options, process) {
  parsers = _.filter(parsers, _.isFunction);
  parsers.splice(0, 0, whitespace()); // Prepend this parser to skip spaces
  parsers.push(invalid(options)); // This parser will handle invalid tokens

  return function(source) {
    if (!_.isFunction(source)) {
      source = stringSource(source);
    }
    source = source();
    if (!_.isObject(source)) {
      return {
        colors: {},
        warp: []
      };
    }

    var result = {};

    _.each(source, function(value, key) {
      result[key] = parse(value, parsers);
    });
    result.colors = _.isObject(result.colors) ? result.colors : {};
    result.warp = _.isArray(result.warp) ? result.warp : [];

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
module.exports.parenthesis = require('./parenthesis');
module.exports.literal = require('./literal');
