'use strict';

module.exports.id = 'weddslist';
module.exports.name = 'Syntax by Weddslist (TDF)';
module.exports.parse = require('./parse');
module.exports.format = require('./format');

module.exports.colors = {
  /* eslint-disable key-spacing */
  W:  '#ffffff', TR: '#ffffe9', R: '#800000',
  A:  '#80ffff', X:  '#00ff00', D: '#404040',
  LG: '#80ff80', J:  '#400080', Y: '#808000',
  U:  '#ff00ff', K:  '#000000', H: '#004080',
  G:  '#008000', LB: '#8080ff', F: '#800040',
  T:  '#00ffff', I:  '#008040', E: '#c0c0c0',
  N:  '#808080', V:  '#ffff80', M: '#800080',
  S:  '#ffff00', L:  '#408000', P: '#ff0000',
  C:  '#008080', Q:  '#0000ff', B: '#000080',
  Z:  '#ff7dff', LR: '#ff8080', O: '#804000'
  /* eslint-enable key-spacing */
};
