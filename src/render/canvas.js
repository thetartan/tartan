'use strict';

var _ = require('lodash');
var defaults = require('../defaults');
var utils = require('../utils');

var defaultOptions = {
  weave: defaults.weave.serge,
  zoom: 1,
  defaultColors: null,
  transformSyntaxTree: null,
  hooks: {
    // Called after renderer fills up all options; it's a good place
    // to modify options object
    configure: function(options) {},
    // `stage`: `false` on before-action and `true` on after-action
    // `options` can mutate here; `context` is new for each repaint but
    // the same for each call during single repaint
    clear: function(context, options, stage) {},
    render: function(context, options, stage) {},
    renderWarp: function(context, options, stage) {},
    renderWeft: function(context, options, stage) {}
  }
};

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
  var zoom = options.zoom;
  var i;
  var first;
  var item;

  // Find first visible pattern item and its offset
  var x = options.offset.x;
  for (i = 0; i < pattern.length; i++) {
    item = pattern[i];
    if (x + item[1] * zoom > 0) {
      first = i;
      break;
    }
    x += item[1] * zoom;
  }

  while (x <= options.width) {
    for (i = first; i < pattern.length; i++) {
      item = pattern[i];
      context.fillStyle = item[0];
      context.fillRect(x, 0, item[1] * zoom, options.height);
      x += item[1] * zoom;
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
  var zoom = options.zoom;
  var first;
  var item;
  var y = options.offset.y;
  var offsetX = options.offset.x;
  var offsetY = options.offset.y;
  var n = _.sum(options.weave);
  var offset;

  // Find first visible pattern item and its offset
  for (i = 0; i < pattern.length; i++) {
    item = pattern[i];
    if (y + item[1] * zoom > 0) {
      first = i;
      break;
    }
    y += item[1] * zoom;
  }

  context.setLineDash(_.map(options.weave, function(value) {
    return value * zoom;
  }));

  while (y <= options.height) {
    for (i = first; i < pattern.length; i++) {
      item = pattern[i];
      context.strokeStyle = item[0];

      // Do not draw outside of visible area
      j = y < 0 ? 0 : y;
      y += item[1] * zoom;
      for (j; j < y; j++) {
        // Correct offset of each line relating to global (0, 0) point
        offset = n - Math.floor((j - offsetY) / zoom) % n;
        offset = offset * zoom - offsetX;
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

function preparePattern(node, weave, colors, defaultColors) {
  var items = _.isObject(node) && node.isBlock ? node.items : [];
  var pattern = [];
  if (items.length > 0) {
    pattern = utils.sett.compile(items, colors, defaultColors);
  }
  var metrics = utils.sett.getPatternMetrics(pattern, weave);

  return {
    pattern: pattern,
    lengthOfPattern: metrics.length,
    lengthOfCycle: metrics.fullCycle
  };
}

function prepareOffset(offset, warp, weft, zoom) {
  var x = 0;
  var y = 0;
  if (_.isObject(offset)) {
    x = parseInt(offset.x, 10) || 0;
    y = parseInt(offset.y, 10) || 0;
  }

  // `lengthOfCycle` is a number when pattern completely repeats
  // (including line offsets), so we can reduce size of offset to
  // avoid numeric overflows
  x %= (warp.lengthOfCycle * zoom);
  if (x > 0) {
    x -= (warp.lengthOfCycle * zoom);
  }

  y %= (weft.lengthOfCycle * zoom);
  if (y > 0) {
    y -= (weft.lengthOfCycle * zoom);
  }

  return {
    x: x,
    y: y
  };
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

function renderEmpty(canvas) {
  var width = canvas.offsetWidth;
  var height = canvas.offsetHeight;
  if ((width > 0) && (height > 0)) {
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, width, height);
  }
  return {x: 0, y: 0};
}

renderEmpty.metrics = getMetrics(defaultOptions.weave,
  preparePattern(null, defaultOptions.weave, {}, {}),
  preparePattern(null, defaultOptions.weave, {}, {})
);

function factory(sett, options) {
  if (!_.isObject(sett)) {
    return renderEmpty;
  }

  options = _.merge({}, defaultOptions, options);
  // Validate hooks
  var hooks = options.hooks;
  if (!_.isObject(options.hooks)) {
    hooks = options.hooks = {};
  }
  _.each(defaultOptions.hooks, function(value, key) {
    if (!_.isFunction(hooks[key])) {
      hooks[key] = defaultOptions.hooks[key];
    }
  });

  if (_.isFunction(options.transformSyntaxTree)) {
    sett = options.transformSyntaxTree(sett);
  }

  var zoom = parseInt(options.zoom, 10) || 0;
  if (zoom < 1) {
    zoom = 1;
  }

  var warpIsSameAsWeft = sett.weft === sett.warp;

  var weave = prepareWeave(options.weave, defaults.weave.serge);

  var warp = preparePattern(sett.warp || sett.weft, weave,
    sett.colors, options.defaultColors);
  var weft = warp;
  if (!warpIsSameAsWeft) {
    weft = preparePattern(sett.weft || sett.warp, weave,
      sett.colors, options.defaultColors);
  }

  if ((warp.lengthOfPattern == 0) && (weft.lengthOfPattern == 0)) {
    return renderEmpty;
  }

  var result = function(canvas, offset, repeat) {
    repeat = (arguments.length == 2) || !!repeat;

    offset = repeat ? prepareOffset(offset, warp, weft, zoom) : {x: 0, y: 0};

    var options = {
      warp: warp,
      weft: weft,
      weave: weave,
      zoom: zoom,
      width: Math.ceil(parseFloat(canvas.width) || 0),
      height: Math.ceil(parseFloat(canvas.height) || 0),
      offset: offset,
      repeat: repeat,
      canvas: canvas
    };
    hooks.configure(canvas, options);

    if ((options.width > 0) && (options.height > 0)) {
      var context = canvas.getContext('2d');
      hooks.render(context, options, false);

      hooks.clear(context, options, false);
      options = clearCanvas(context, options);
      hooks.clear(context, options, true);

      hooks.renderWarp(context, options, false);
      renderWarp(context, options);
      hooks.renderWarp(context, options, true);

      hooks.renderWeft(context, options, false);
      renderWeft(context, options);
      hooks.renderWeft(context, options, true);

      hooks.render(context, options, true);
    }

    return offset;
  };

  result.metrics = getMetrics(weave, warp, weft);

  return result;
}

module.exports = factory;
// Define some properties for `factory()` function
Object.defineProperty(module.exports, 'id', {
  enumerable: true,
  value: 'canvas'
});
Object.defineProperty(module.exports, 'name', {
  enumerable: true,
  value: 'Simple'
});
