'use strict';

module.exports.id = 'stwr';
module.exports.name = 'Scottish Register of Tartans / ' +
  'Scottish Tartans World Register';
module.exports.parse = require('./parse');
module.exports.format = require('./format');
module.exports.colors = {
  /* eslint-disable key-spacing */
  K:  '#000000', LP: '#9966ff', P:  '#9933ff',
  DP: '#990099', W:  '#dddddd', DW: '#e1dfd0',
  LY: '#ffff66', Y:  '#ffff00', DY: '#ffcc00',
  O:  '#ddaa00', LT: '#ffce24', T:  '#bb5e00',
  DT: '#663300', LN: '#999999', N:  '#666666',
  DN: '#333333', R:  '#fd024e', LR: '#ff6262',
  DR: '#ce0000', MR: '#a40004', LG: '#336633',
  G:  '#339900', DG: '#1b5300', OG: '#484e05',
  BG: '#074b32', AB: '#229f7a', LB: '#88a8aa',
  B:  '#333399', DB: '#1e1e5b', RB: '#171366',
  NB: '#171366'
  /* eslint-enable key-spacing */
};
