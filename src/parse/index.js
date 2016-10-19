'use strict';

var _ = require('lodash');
var normalizeColorMap = require('../utils/normalize-color-map');

function invalid(str) {
  throw new Error('Invalid token near "' + str + '"');
}

function spaces(str) {
  if (/^\s+$/ig.test(str)) {
    return {
      offset: 0,
      length: str.length
    }
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
  }
}

function factory(parsers, processors, defaultColors) {
  parsers = _.filter(parsers, _.isFunction);
  parsers.push(spaces);
  parsers.push(invalid);

  processors = _.filter(processors, _.isFunction);

  defaultColors = normalizeColorMap(defaultColors);

  return function(str) {
    var result = [];
    while (str != '') {
      _.each(parsers, function(parser) {
        var token = parser(str);
        if (_.isObject(token)) {
          result.push(token);
          str = str.substr(token.offset + token.length, str.length);
          return false;
        }
      });
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
