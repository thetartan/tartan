'use strict';

var _ = require('lodash');
var errors = require('../errors');

// Only entire threadcount may be reflected; no sub-blocks allowed
function processTokens(tokens) {
  var hasNestedBlocks = !!_.find(tokens, _.isArray);
  if (hasNestedBlocks) {
    if (tokens.length == 1) {
      hasNestedBlocks = !!_.find(tokens[0], _.isArray);
      if (hasNestedBlocks) {
        throw new errors.ClassicSyntaxError();
      }
    } else {
      throw new errors.ClassicSyntaxError();
    }
  }

  return tokens;
}

function transform(sett, options) {
  var result = _.clone(sett);

  var warpIsSameAsWeft = sett.warp === sett.weft;
  if (_.isArray(sett.warp)) {
    result.warp = processTokens(sett.warp, options);
  }
  if (_.isArray(sett.weft)) {
    if (warpIsSameAsWeft) {
      result.weft = result.warp;
    } else {
      result.weft = processTokens(sett.weft, options);
    }
  }

  return result;
}

function factory() {
  return transform;
}

module.exports = factory;
