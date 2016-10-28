'use strict';

var _ = require('lodash');
var utils = require('../utils');

var defaultOptions = {
  // function to transform newly built AST: (sett) => { return modifiedSett; }
  transformSett: null,
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
  prepareNestedBlock: function(nestedBlock) {
    var result = [];
    result.push(utils.newTokenOpeningSquareBracket());
    result = result.concat(nestedBlock);
    result.push(utils.newTokenClosingSquareBracket());
    return result;
  },
  prepareRootBlock: function(block) {
    return block;
  },
  joinComponents: function(formattedSett, originalSett) {
    return utils.trim([
      formattedSett.colors,
      formattedSett.warp,
      formattedSett.weft
    ].join('\n'));
  },
  defaultColors: {},
  outputOnlyUsedColors: false
};

function getOnlyUsedColors(tokens, colors, result) {
  if (!_.isObject(result)) {
    result = {};
  }
  _.each(tokens, function(token) {
    if (_.isArray(token)) {
      result = getOnlyUsedColors(token, colors, result);
    }
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

function flattenTokens(tokens, options, isNested) {
  var result = [];
  var current;

  if (!isNested) {
    tokens = options.prepareRootBlock(tokens);
  }

  for (var i = 0; i < tokens.length; i++) {
    current = tokens[i];
    if (_.isArray(current)) {
      // Flatten nested block
      current = options.prepareNestedBlock(current);
      current = flattenTokens(current, options, true);
      [].push.apply(result, current);
    } else {
      result.push(current);
    }
  }

  return result;
}

function render(sett, options) {
  var warpIsSameAsWeft = sett.warp === sett.weft;

  var warp = flattenTokens(sett.warp, options);
  var weft = warp;
  if (!warpIsSameAsWeft) {
    weft = flattenTokens(sett.weft, options);
  }

  var colors = _.extend({}, options.defaultColors, sett.colors);
  if (options.outputOnlyUsedColors) {
    colors = _.extend({},
      getOnlyUsedColors(sett.warp, colors),
      getOnlyUsedColors(sett.weft, colors)
    );
  }
  colors = colorsAsTokens(colors, options);

  colors = renderTokens(colors, options);
  warp = renderTokens(warp, options);
  weft = renderTokens(weft, options);

  if (weft == warp) {
    weft = '';
  }

  return utils.trim(options.joinComponents({
    colors: colors,
    warp: warp,
    weft: weft
  }, sett));
}

function factory(options) {
  options = _.merge({}, defaultOptions, options);
  if (!_.isFunction(options.defaultFormatter)) {
    options.defaultFormatter = defaultOptions.defaultFormatter;
  }
  if (!_.isFunction(options.joinComponents)) {
    options.joinComponents = defaultOptions.joinComponents;
  }
  if (!_.isFunction(options.prepareNestedBlock)) {
    options.prepareNestedBlock = defaultOptions.prepareNestedBlock;
  }
  if (!_.isFunction(options.prepareRootBlock)) {
    options.prepareRootBlock = defaultOptions.prepareRootBlock;
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
    if (_.isFunction(options.transformSett)) {
      sett = options.transformSett(sett);
    }

    return render(sett, options);
  };
}

module.exports = factory;
