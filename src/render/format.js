'use strict';

var _ = require('lodash');
var utils = require('../utils');

var defaultOptions = {
  formatter: {
    color: function(token) {
      return token.name + token.color;
    },
    stripe: function(token) {
      return token.name + token.count;
    },
    pivot: function(token) {
      return token.name + '/' + token.count;
    }
  },
  defaultFormatter: function(token) {
    return token.value;
  },
  outputOnlyUsedColors: false
};

function trim(str) {
  return str.replace(/^\s+/i, '').replace(/\s+$/i, '');
}

function getOnlyUsedColors(tokens, colors) {
  var result = {};
  var supportedTokens = ['stripe', 'pivot'];
  _.each(tokens, function(token) {
    if (_.isObject(token) && (supportedTokens.indexOf(token.token) >= 0)) {
      if (colors[token.name]) {
        result[token.name] = colors[token.name];
      }
    }
  });
  return result;
}

function colorsAsTokens(colors, options) {
  return _.chain(utils.normalizeColorMap(colors))
    .map(function(value, key) {
      return {
        token: 'color',
        name: key,
        color: value,
        offset: 0,
        length: 8,
        source: key + value
      };
    })
    .sortBy('name')
    .value();
}

function renderTokens(tokens, options) {
  return _.chain(tokens)
    .map(function(token) {
      var formatter = options.formatter[token.token];
      if (!_.isFunction(formatter)) {
        formatter = options.defaultFormatter;
      }
      return formatter(token);
    })
    .filter()
    .join(' ')
    .value();
}

function render(tokens, colors, options) {
  if (options.outputOnlyUsedColors) {
    colors = getOnlyUsedColors(tokens, colors);
  }
  colors = renderTokens(colorsAsTokens(colors), options);

  tokens = renderTokens(tokens, options);
  tokens = tokens.replace(/\[\s/ig, '[').replace(/\s\]/ig, ']');

  return trim(colors + '\n' + tokens);
}

function factory(options) {
  options = _.merge({}, defaultOptions, options);
  if (!_.isFunction(options.defaultFormatter)) {
    options.defaultFormatter = defaultOptions.defaultFormatter;
  }
  if (!_.isObject(options.formatter)) {
    options.formatter = {};
  }
  options.formatter = _.chain(options.formatter)
    .map(function(value, key) {
      return _.isFunction(value) ? [key, value] : null;
    })
    .filter()
    .fromPairs()
    .value();

  return function(sett) {
    var tokens = _.isObject(sett) ? sett.tokens : [];
    var colors = _.isObject(sett) ? sett.colors : {};
    return render(tokens, _.extend({}, colors), options);
  };
}

module.exports = factory;
