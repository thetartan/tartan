'use strict';

var _ = require('lodash');

function factory(source) {
  return _.extend({threadcount: ''}, source);
}

module.exports = factory;
// Define some properties for `factory()` function
Object.defineProperty(module.exports, 'id', {
  enumerable: true,
  value: 'object'
});
Object.defineProperty(module.exports, 'name', {
  enumerable: true,
  value: 'Object'
});
