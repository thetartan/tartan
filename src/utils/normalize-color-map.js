'use strict';

var _ = require('lodash');
var isValidColor = require('./is-valid-color');

module.exports = function(colors) {
  var pattern = /^[a-z]$/i;

  return _.chain(colors)
    .map(function(value, key) {
      var isKeyValid = pattern.test(key);
      if (isKeyValid && isValidColor(value)) {
        if (value.length == 4) {
          value = value.replace(/[0-9a-f]/ig, '$&$&');
        }
        return [key.toUpperCase(), value.toLowerCase()];
      }
      return null;
    })
    .filter()
    .fromPairs()
    .value();
};
