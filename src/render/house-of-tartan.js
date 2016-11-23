'use strict';

var _ = require('lodash');
var canvas = require('./canvas');
var defaults = require('../defaults');

var shadow = new Image();
shadow.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAAD' +
  'ED76LAAAABHNCSVQICAgIfAhkiAAAAFVJREFUGJV1jsENgEAIBGcTCvBrJbbi90qgEuu6buw' +
  'AHx4mKjcfkg0MS0Qs3KyA5xy5m6TGmwPokk4AcnNm0gidPxvQn4uZyb4/i051+zQZsFft03Q' +
  'B/booYDTfo3wAAAAASUVORK5CYII=';

function renderWeft(context, options, stage) {
  if (stage) {
    var dx = options.offset.x;
    var dy = options.offset.y;

    context.save();
    context.translate(dx, dy);

    context.fillStyle = context.createPattern(shadow, 'repeat');
    context.fillRect(-dx, -dy, options.width, options.height);

    context.restore();
  }
}

function factory(sett, options) {
  return canvas(sett, _.extend(options, {
    weave: defaults.weave.serge,
    zoom: 2,
    hooks: {
      renderWeft: renderWeft
    }
  }));
}

module.exports = factory;
