'use strict';

var _ = require('lodash');

// Function to check processor's return value
function isValueChanged(oldValue, newValue) {
  return _.isObject(newValue) && (newValue !== oldValue);
}

function makeProcessorResult(result, modifiedFlag) {
  // If we did something - return modified tokens, otherwise return false
  return modifiedFlag ? result : false;
}

function createSimpleProcessor(processTokens, preprocess, postprocess) {
  return function(sett) {
    if (_.isObject(sett)) {
      if (_.isFunction(preprocess)) {
        sett = preprocess(sett);
      }
      var result = _.clone(sett);
      var weftIsSameAsWarp = sett.weft === sett.warp;
      var warp = _.isArray(sett.warp) ?
        processTokens(sett.warp, result) : false;
      var weft = false;
      if (!weftIsSameAsWarp) {
        weft = _.isArray(sett.weft) ?
          processTokens(sett.weft, result) : false;
      }
      var warpChanged = isValueChanged(sett.warp, warp);
      var weftChanged = isValueChanged(sett.weft, weft);
      if (warpChanged || weftChanged) {
        if (warpChanged) {
          result.warp = warp;
          if (weftIsSameAsWarp) {
            result.weft = result.warp;
          }
        }
        if (weftChanged) {
          result.weft = weft;
        }
        if (_.isFunction(postprocess)) {
          result = postprocess(result);
        }
        return result;
      }
    }
    return false;
  };
}

module.exports.isValueChanged = isValueChanged;
module.exports.makeProcessorResult = makeProcessorResult;
module.exports.createSimpleProcessor = createSimpleProcessor;
