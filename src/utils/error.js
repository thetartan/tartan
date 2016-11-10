'use strict';

var severity = {
  error: 'error',
  warning: 'warning',
  notice: 'notice'
};

var message = {
  invalidToken: 'Invalid token',
  zeroWidthStripe: 'Zero-width stripe',
  unexpectedToken: 'Unexpected token',
  orphanedPivot: 'Orphaned pivot',
  multipleWarpAnWeftSeparator: 'Only one warp/weft separator is allowed',
  unmatchedBlockStart: 'Unmatched block start',
  unmatchedBlockEnd: 'Unmatched block end',
  extraTokenInInputSequence: 'Extra token in input sequence'
};

module.exports.severity = severity;
module.exports.message = message;
