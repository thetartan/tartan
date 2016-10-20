'use strict';

var _ = require('lodash');
var errors = require('../errors');
var normalizeColorMap = require('../utils/normalize-color-map');

function invalid(str, offset) {
  throw new errors.InvalidToken(str, offset);
}

function spaces(str, offset) {
  // Try to capture at most 10 characters. If there are more
  // whitespaces - we'll capture them on next turn
  var matches = /^\s+/i.exec(str.substr(offset, 10));
  if (matches) {
    return {
      token: 'space',
      offset: offset,
      length: matches[0].length
    };
  }
}

function extractColors(tokens) {
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

function executeParsers(str, parsers, offset, result) {
  _.each(parsers, function(parser) {
    var token = parser(str, offset);
    if (_.isObject(token)) {
      if (token.token != 'space') {
        token.source = str;
        result.push(token);
      }
      offset = token.offset + token.length;
      return false;
    }
  });

  return offset;
}

function factory(parsers, processors, defaultColors) {
  parsers = _.filter(parsers, _.isFunction);
  parsers.splice(0, 0, spaces); // Prepend this parser to skip spaces
  parsers.push(invalid); // This parser will handle invalid tokens

  processors = _.filter(processors, _.isFunction);

  defaultColors = normalizeColorMap(defaultColors);

  return function(str) {
    var result = [];
    var offset = 0;

    while (offset < str.length) {
      offset = executeParsers(str, parsers, offset, result);
    }

    result = extractColors(result);

    result.colors = _.extend({}, defaultColors, result.colors);

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
