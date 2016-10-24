'use strict';

var _ = require('lodash');
var defaults = require('../defaults');
var rendering = require('./index');

function clearCanvas(context, options) {
  if (!options.repeat) {
    context.clearRect(0, 0, options.width, options.height);
    options.width = Math.min(options.width, options.warp.lengthOfPattern);
    options.height = Math.min(options.height, options.warp.lengthOfPattern);
  }
  return options;
}

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

    if (!options.repeat) {
      break;
    }
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

    if (!options.repeat) {
      break;
    }
  }
}

function prepareWeave(weave, defaultWeave) {
  return _.isArray(weave) && weave.length == 2 ? weave : defaultWeave;
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

function chooseFirstArray() {
  return _.find(arguments, _.isArray) || [];
}

function getMetrics(weave, preparedWarp, preparedWeft) {
  return {
    weave: weave,
    warp: {
      length: preparedWarp.lengthOfPattern,
      fullCycle: preparedWarp.lengthOfCycle
    },
    weft: {
      length: preparedWeft.lengthOfPattern,
      fullCycle: preparedWeft.lengthOfCycle
    }
  };
}

function renderEmpty() {
  return {x: 0, y: 0};
}

function factory(sett, options, process) {
  if (!_.isObject(sett)) {
    return renderEmpty;
  }
  sett = rendering.pattern(options, process)(sett);

  var weave = prepareWeave(sett.weave, defaults.weave.serge);
  var warp = preparePattern(chooseFirstArray(sett.warp, sett.weft), weave);
  var weft = preparePattern(chooseFirstArray(sett.weft, sett.warp), weave);

  if ((warp.length == 0) && (weft.length == 0)) {
    return renderEmpty;
  }

  var result = function(canvas, offset, repeat) {
    repeat = (arguments.length == 2) || !!repeat;

    offset = repeat ? prepareOffset(offset, warp, weft) : {x: 0, y: 0};

    var options = {
      warp: warp,
      weft: weft,
      weave: weave,
      width: Math.ceil(parseFloat(canvas.width) || 0),
      height: Math.ceil(parseFloat(canvas.height) || 0),
      offset: offset,
      repeat: repeat
    };

    if ((options.width > 0) && (options.height > 0)) {
      var context = canvas.getContext('2d');
      options = clearCanvas(context, options);
      renderWarp(context, options);
      renderWeft(context, options);
    }

    return offset;
  };

  result.metrics = getMetrics(weave, warp, weft);

  return result;
}

module.exports = factory;
