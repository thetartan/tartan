'use strict';

var utils = require('../utils');

module.exports.weave = {
  plain: [1, 1],
  serge: [2, 2]
};

module.exports.colors = utils.normalizeColorMap({
  /* eslint-disable key-spacing */
  B: '#304080', G: '#004c00', K: '#000000',
  N: '#666666', R: '#c80000', T: '#603311',
  W: '#ffffff', Y: '#ffe600'
  /* eslint-enable key-spacing */
});

module.exports.insignificantTokens = [
  utils.TokenType.invalid,
  utils.TokenType.whitespace
];
