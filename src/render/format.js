'use strict';

var _ = require('lodash');
var utils = require('../utils');

var defaultOptions = {
  formatter: {
    color: function(token) {
      return token.name + token.color + ';';
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
  _.each(tokens, function(token) {
    if (utils.isStripe(token) || utils.isPivot(token)) {
      if (colors[token.name]) {
        result[token.name] = colors[token.name];
      }
    }
  });
  return result;
}

function colorsAsTokens(colors, options) {
  return _.chain(utils.normalizeColorMap(colors))
    .map(function(value, name) {
      return utils.newTokenColor(name, value);
    })
    .sortBy('name')
    .value();
}

function renderTokens(tokens, options) {
  return trim(_.chain(tokens)
    .map(function(token) {
      var formatter = options.formatter[token.token];
      if (!_.isFunction(formatter)) {
        formatter = options.defaultFormatter;
      }
      return formatter(token);
    })
    .filter()
    .join(' ')
    .replace(/\s\]/ig, ']')
    .value());
}

function render(warp, weft, colors, options) {
  if (options.outputOnlyUsedColors) {
    colors = _.extend({},
      getOnlyUsedColors(warp, colors),
      getOnlyUsedColors(weft, colors)
    );
  }
  colors = renderTokens(colorsAsTokens(colors), options);

  warp = renderTokens(warp, options);
  weft = renderTokens(weft, options);

  if (weft == warp) {
    weft = '';
  }

  return trim(colors + '\n' + warp + '\n' + weft);
}

function renderEmpty() {
  return '';
}

function factory(sett, options, process) {
  if (!_.isObject(sett)) {
    return renderEmpty;
  }
  if (_.isFunction(process)) {
    sett = process(sett);
  }
  var colors = _.extend({}, sett.colors);

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

  var result = null;
  return function() {
    // We can cache result as we assume that sett will not change
    // (since sett is argument for factory, not renderer)
    if (result === null) {
      result = render(sett.warp, sett.weft, colors, options);
    }
    return result;
  };
}

module.exports = factory;
