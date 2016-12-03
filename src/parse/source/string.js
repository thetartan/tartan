'use strict';

var _ = require('lodash');

function factory(source) {
  return {
    threadcount: _.isString(source) ? source : ''
  };
}

module.exports = factory;
