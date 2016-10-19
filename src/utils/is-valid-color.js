'use strict';

var _ = require('lodash');

var pattern = /^#[0-9a-f]{3}([0-9a-f]{3})?$/im;

module.exports = function(str) {
  return _.isString(str) ? pattern.test(str) : false;
};
