'use strict';

var _ = require('lodash');
var utils = require('../../utils');

function parse(context, offset) {
  var source = context.source;
  var result = source.charAt(offset);

  if (!context.inForesee) {
    var foreseeOffset = offset + 1;
    while (true) {
      var token = context.foresee(foreseeOffset);
      if (_.isObject(token) && (token.type == 'invalid')) {
        result += token.value;
        foreseeOffset += token.length;
        continue;
      }
      break;
    }
  }

  if (result != '') {
    result = {
      type: utils.token.invalid,
      value: result,
      length: result.length
    };
    if (!context.inForesee) {
      context.errorHandler(
        new Error(utils.error.message.invalidToken),
        {token: result},
        utils.error.severity.error
      );
    }
    return result;
  }
}

function factory() {
  return parse;
}

module.exports = factory;
