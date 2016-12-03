'use strict';

var _ = require('lodash');
var stringSource = require('./string');
var objectSource = require('./object');

function factory(source) {
  if (_.isFunction(source)) {
    source = source();
  }
  if (_.isString(source)) {
    return stringSource(source);
  }
  return objectSource(source);
}

module.exports = factory;
// Define some properties for `factory()` function
Object.defineProperty(module.exports, 'id', {
  enumerable: true,
  value: 'autodetect'
});
Object.defineProperty(module.exports, 'name', {
  enumerable: true,
  value: 'Autodetect'
});
