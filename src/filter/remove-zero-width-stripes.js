'use strict';

var _ = require('lodash');
var utils = require('../utils');

// Warning! This filter just removes stripes with zero width.
// It may cause issues when using square brackets, for example:
// [R0 K10 W10 Y2]:
// Right: R0 K10 W10 Y2 W10 K10
// Wring (with this filter): [K10 W10 Y2] => K10 W10 Y2 W10
// Be careful! Use tartan.transform.removeZeroWidthStripes() as
// it respects this case

function processTokens(tokens) {
  return _.filter(tokens, function(token) {
    // Do not remove zero-length pivots as it will break pattern
    var isZeroWidthStripe = utils.isStripe(token) && (token.count <= 0);
    return !isZeroWidthStripe;
  });
}

function factory() {
  return processTokens;
}

module.exports = factory;
