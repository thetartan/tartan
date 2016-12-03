'use strict';

var _ = require('lodash');

function factory(source) {
  return _.extend({threadcount: ''}, source);
}

module.exports = factory;
