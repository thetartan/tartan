'use strict';

var _ = require('lodash');

function factory(source) {
  return _.extend(
    {threadcount: ''},
    _.isString(source) ? JSON.parse(source) : source
  );
}

module.exports = factory;
