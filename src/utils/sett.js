'use strict';

var _ = require('lodash');
var color = require('./color');

function getColor(name, colors, defaultColors) {
  var temp = colors[name];
  if (_.isObject(temp) && color.isValidColor(temp.value)) {
    return temp.value;
  }
  temp = defaultColors[name];
  if (_.isObject(temp) && color.isValidColor(temp.value)) {
    return temp.value;
  }
  return null;
}

function compile(items, colors, defaultColors) {
  colors = _.extend({}, colors);
  defaultColors = _.extend({}, defaultColors);
  return _.chain(items)
    .map(function(item) {
      if (_.isObject(item) && item.isStripe) {
        var count = parseInt(item.count, 10) || 0;
        if (count > 0) {
          var color = getColor(item.name, colors, defaultColors);
          if (color) {
            return [color, count];
          }
        }
      }
      return null;
    })
    .filter()
    // Merge stripes with same colors
    .reduce(function(accumulator, item) {
      var prev = _.last(accumulator);
      if (prev) {
        if (color.isSameColor(prev[0], item[0])) {
          prev[1] += item[1];
          return accumulator;
        }
      }
      accumulator.push(item);
      return accumulator;
    }, [])
    .value();
}

function getPatternMetrics(pattern, weave) {
  if (!_.isArray(weave) || (weave.length < 2)) {
    weave = [1, 1];
  } else {
    weave = weave.slice(0, 2);
  }
  pattern = _.filter(pattern, function(item) {
    return _.isArray(item) && (item.length >= 2) && (item[1] > 0);
  });

  var lengthOfPattern = 0;
  var lengthOfCycle = 0;
  if (pattern.length > 0) {
    lengthOfPattern = _.reduce(pattern, function(result, item) {
      return result + item[1];
    }, 0);

    var weaveLength = _.sum(weave);
    lengthOfCycle = lengthOfPattern;
    while (lengthOfCycle % weaveLength != 0) {
      lengthOfCycle += lengthOfPattern;
    }
  }

  return {
    length: lengthOfPattern,
    fullCycle: lengthOfCycle
  };
}

function reflectAndRepeat(block) {
  var items = block.items;
  var repeat = block.repeat;
  var reflect = block.reflect;

  // Special case - single item cannot be reflected, but can be repeated
  if (items.length <= 1) {
    if ((items.length == 1) && (repeat > 1)) {
      var item = _.clone(items[0]);
      item.count *= repeat;
      block = _.clone(block);
      block.items = [item];
    }
    return block;
  }

  var result;
  var temp;

  if (reflect) {
    temp = items.slice(1, -1);
    temp.reverse();
    result = items.concat(temp);
  } else {
    result = items;
  }

  temp = [];
  for (var i = 1; i <= repeat; i++) {
    [].push.apply(temp, result);
  }
  result = temp;

  if (reflect && !block.isRoot) {
    result.push(items[0]);
  }

  block = _.clone(block);
  block.items = result;
  block.reflect = false;
  block.repeat = 1;

  return block;
}

module.exports.compile = compile;
module.exports.getPatternMetrics = getPatternMetrics;
module.exports.reflectAndRepeat = reflectAndRepeat;
