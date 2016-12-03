'use strict';

var _ = require('lodash');

function factory(source) {
  return {
    threadcount: _.isString(source) ? source : ''
  };
}

module.exports = factory;
// Define some properties for `factory()` function
Object.defineProperty(module.exports, 'id', {
  enumerable: true,
  value: 'string'
});
Object.defineProperty(module.exports, 'name', {
  enumerable: true,
  value: 'String'
});
