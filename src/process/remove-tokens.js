'use strict';

var _ = require('lodash');

function needToRemove(token, tokensToRemove) {
  if (!_.isObject(token)) {
    return true;
  }
  return tokensToRemove.indexOf(token.token) >= 0;
}

module.exports = function(tokensToRemove) {
  tokensToRemove = _.isArray(tokensToRemove) ? tokensToRemove :
    [tokensToRemove];
  return function(tokens) {
    var wasSomethingRemoved = false;
    var result = _.filter(tokens, function(token) {
      var flag = needToRemove(token, tokensToRemove);
      if (flag) {
        wasSomethingRemoved = true;
        return false;
      }
      return true;
    });

    return wasSomethingRemoved ? result : tokens;
  };
};
