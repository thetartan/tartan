'use strict';

var _ = require('lodash');
var utils = require('../utils');

var pattern = /^(palette|warp|weft)\:(.*)$/i;

function factory(string) {
  return function() {
    if (!_.isObject(string)) {
      string = ('' + string).split('\n');
    }
    return _.chain(string)
      .map(function(value) {
        value = utils.trim(value);
        var matches = pattern.exec(value);
        if (matches) {
          return [matches[1], matches[2]];
        } else {
          if (value != '') {
            return ['warp', value];
          }
        }
      })
      .filter()
      .fromPairs()
      .value();
  }
}

module.exports = factory;
