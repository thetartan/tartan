'use strict';

var utils = require('../utils');

module.exports.weave = {
  // Thread above warp, threads under warp
  plain: [1, 1],
  serge: [2, 2]
};

module.exports.colors = utils.color.buildColorMap({
  /* eslint-disable key-spacing */
  B: '#304080', G: '#004c00', K: '#000000',
  N: '#666666', R: '#c80000', T: '#603311',
  W: '#ffffff', Y: '#ffe600'
  /* eslint-enable key-spacing */
});

module.exports.warpAndWeftSeparator = '//';

module.exports.insignificantTokens = [
  'invalid',
  'whitespace'
];
