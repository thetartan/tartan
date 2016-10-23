'use strict';

var _ = require('lodash');
var utils = require('../utils');

var defaultOptions = {
  formatters: {
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
  defaultColors: {},
  outputOnlyUsedColors: false
};

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
  return utils.trim(_.chain(tokens)
    .map(function(token) {
      var formatter = options.formatters[token.type];
      if (!_.isFunction(formatter)) {
        formatter = options.defaultFormatter;
      }
      return formatter(token);
    })
    .filter()
    .join(' ')
    .replace(/\[\s/ig, '[')
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

  return utils.trim(colors + '\n' + warp + '\n' + weft);
}

function factory(options, process) {
  options = _.merge({}, defaultOptions, options);
  if (!_.isFunction(options.defaultFormatter)) {
    options.defaultFormatter = defaultOptions.defaultFormatter;
  }
  if (!_.isObject(options.formatters)) {
    options.formatters = {};
  }
  options.formatters = _.chain(options.formatters)
    .map(function(value, key) {
      return _.isFunction(value) ? [key, value] : null;
    })
    .filter()
    .fromPairs()
    .value();

  return function(sett) {
    if (!_.isObject(sett)) {
      return '';
    }
    if (_.isFunction(process)) {
      sett = process(sett);
    }

    var colors = _.extend({}, options.defaultColors, sett.colors);

    return render(sett.warp, sett.weft, colors, options);
  };
}

module.exports = factory;
