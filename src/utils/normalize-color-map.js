'use strict';

var isValidColor = require('./is-valid-color');

module.exports = function(colors) {
  var pattern = /^[a-z]$/im;

  return _.chain(colors)
    .map(function(value, key) {
      var isKeyValid = pattern.test(key);
      if (isKeyValid && isValidColor(value)) {
        if (value.length == 4) {
          value = value.replace(/[0-9a-f]/g, '$&$&');
        }
        return [key.toUpperCase(), value.toLowerCase()];
      }
    })
    .filter()
    .fromPairs()
    .value();
};
