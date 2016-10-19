'use strict';

var _ = require('lodash');

var defaultOptions = {
  weave: [2, 2]
};

function renderWarp(context, options) {
  var pattern = options.warp.pattern;
  var i;
  var first;
  var item;

  // Find first visible pattern item and its offset
  var x = options.offset.x;
  for (i = 0; i < pattern.length; i++) {
    item = pattern[i];
    if (x + item[1] > 0) {
      first = i;
      break;
    }
    x += item[1];
  }

  while (x <= options.width) {
    for (i = first; i < pattern.length; i++) {
      item = pattern[i];
      context.fillStyle = item[0];
      context.fillRect(x, 0, item[1], options.height);
      x += item[1];
      if (x >= options.width) {
        break;
      }
    }
    first = 0;
  }
}

function renderWeft(context, options) {
  var pattern = options.weft.pattern;
  var i;
  var j;
  var first;
  var item;
  var y = options.offset.y;
  var n = _.sum(options.weave);
  var offsetX = (options.offset.x) % n;
  var offsetY = (options.offset.y) % n;
  var offset;

  // Find first visible pattern item and its offset
  for (i = 0; i < pattern.length; i++) {
    item = pattern[i];
    if (y + item[1] > 0) {
      first = i;
      break;
    }
    y += item[1];
  }

  context.setLineDash(options.weave);

  while (y <= options.height) {
    for (i = first; i < pattern.length; i++) {
      item = pattern[i];
      context.strokeStyle = item[0];

      // Do not draw outside of visible area
      j = y < 0 ? 0 : y;
      y += item[1];
      for (j; j < y; j++) {
        // Correct offset of each line relating to global (0, 0) point
        offset = n - (j - offsetY) % n + 1;
        offset = (offset - offsetX) % n;
        context.lineDashOffset = offset;

        context.beginPath();
        context.moveTo(0, j + 0.5);
        context.lineTo(options.width, j + 0.5);
        context.stroke();
      }

      if (y >= options.height) {
        break;
      }
    }
    first = 0;
  }
}

function prepareWeave(weave, defaultWeave) {
  return _.isArray(weave) && weave.length > 0 ? weave : defaultWeave;
}

function preparePattern(pattern, weave) {
  pattern = _.filter(pattern, function(item) {
    return _.isArray(item) && (item.length >= 2) && (item[1] > 0);
  });
  var lengthOfPattern = _.reduce(pattern, function(result, item) {
    return result + item[1];
  }, 0);

  var weaveLength = _.sum(weave);
  var lengthOfCycle = lengthOfPattern;
  while (lengthOfCycle % weaveLength != 0) {
    lengthOfCycle += lengthOfPattern;
  }

  return {
    pattern: pattern,
    lengthOfPattern: lengthOfPattern,
    lengthOfCycle: lengthOfCycle
  };
}

function prepareOffset(offset, warp, weft) {
  var x = 0;
  var y = 0;
  if (_.isObject(offset)) {
    x = parseInt(offset.x, 10) || 0;
    y = parseInt(offset.y, 10) || 0;
  }

  // `lengthOfCycle` is a number when pattern completely repeats
  // (including line offsets), so we can reduce size of offset to
  // avoid numeric overflows
  x %= warp.lengthOfCycle;
  if (x > 0) {
    x -= warp.lengthOfCycle;
  }

  y %= weft.lengthOfCycle;
  if (y > 0) {
    y -= weft.lengthOfCycle;
  }

  return {
    x: x,
    y: y
  };
}

function factory(options) {
  var weave = prepareWeave(options.weave, defaultOptions.weave);
  var warp = preparePattern(options.warp, weave);
  var weft = preparePattern(options.weft, weave);

  if ((warp.length == 0) && (weft.length == 0)) {
    return _.identity;
  }

  var offset = prepareOffset({}, warp, weft);

  var result = function(canvas) {
    var options = {
      warp: warp,
      weft: weft,
      weave: weave,
      width: parseInt(canvas.width, 10),
      height: parseInt(canvas.height, 10),
      offset: offset
    };
    if ((options.width > 0) && (options.height > 0)) {
      var context = canvas.getContext('2d');
      renderWarp(context, options);
      renderWeft(context, options);
    }
  };

  result.offset = function(x, y) {
    switch (arguments.length) {
      case 0:
        return offset;
      case 1:
        offset = prepareOffset(x, warp, weft);
        break;
      default:
        offset = prepareOffset({x: x, y: y}, warp, weft);
        break;
    }
    return this;
  };

  return result;
}

module.exports = function(options) {
  return factory(_.extend({}, defaultOptions, options));
};
