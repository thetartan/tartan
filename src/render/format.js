'use strict';

var _ = require('lodash');

var defaultOptions = {
  // function to transform newly built AST: (sett) => { return modifiedSett; }
  transformSyntaxTree: null,
  format: {
    color: function(item) {
      var comment = item.comment != '' ? ' ' + item.comment : '';
      return item.name + item.value + comment + ';';
    },
    stripe: function(item) {
      return item.name + item.count;
    },
    block: function(block) {
      var result = _.chain(block.formattedItems).join(' ').trim().value();
      return result != '' ? '[' + result + ']' : '';
    }
  },
  join: function(components) {
    var parts = [];
    if (components.colors.length > 0) {
      parts.push(components.colors.join(' '));
    }
    if (components.warp != components.weft) {
      parts.push(components.warp + ' // ' + components.weft);
    } else {
      parts.push(components.warp);
    }
    return parts.join('\n');
  },
  defaultColors: {},
  includeUnusedColors: true,
  includeDefaultColors: true
};

function processColors(usedColors, settColors, options) {
  var defaultColors = _.extend({}, options.defaultColors);
  var keys = _.intersection(_.keys(settColors), _.keys(usedColors));
  if (options.includeUnusedColors) {
    keys = _.keys(settColors);
  }
  if (options.includeDefaultColors) {
    keys = _.union(_.keys(settColors), _.keys(usedColors));
  }

  var format = options.format;
  if (!_.isFunction(format.color)) {
    return [];
  }

  return _.chain(keys)
    .sortBy()
    .map(function(key) {
      var color = settColors[key] || defaultColors[key];
      if (color) {
        return format.color(_.extend({name: key}, color));
      }
      return null;
    })
    .filter(function(str) {
      return _.isString(str) && (str.length > 0);
    })
    .value();
}

function process(block, options, usedColors) {
  var format = options.format;
  if (!_.isFunction(format.stripe) || !_.isFunction(format.block)) {
    return '';
  }

  block = _.clone(block);
  block.formattedItems = _.chain(block.items)
    .map(function(item) {
      if (item.isStripe) {
        usedColors[item.name] = true;
        return format.stripe(item);
      }
      if (item.isBlock) {
        return process(item, options, usedColors);
      }
      return '';
    })
    .filter(function(str) {
      return str.length > 0;
    })
    .value();
  return _.isFunction(format.block) ? format.block(block) : '';
}

function render(sett, options) {
  var warpIsSameAsWeft = sett.warp === sett.weft;

  var usedColors = {};
  var warp = process(sett.warp, options, usedColors);
  var weft = warp;
  if (!warpIsSameAsWeft) {
    weft = process(sett.weft, options, usedColors);
  }

  var colors = processColors(usedColors, sett.colors, options);

  return _.trim(options.join({
    colors: colors,
    warp: warp,
    weft: weft
  }, sett));
}

function factory(options) {
  options = _.merge({}, defaultOptions, options);

  return function(sett) {
    if (!_.isObject(sett)) {
      return '';
    }
    if (_.isFunction(options.transformSyntaxTree)) {
      sett = options.transformSyntaxTree(sett);
    }

    return render(sett, options);
  };
}

module.exports = factory;
