'use strict';

var _ = require('lodash');

function factory(source) {
  return _.extend(
    {threadcount: ''},
    _.isString(source) ? JSON.parse(source) : source
  );
}

module.exports = factory;
// Define some properties for `factory()` function
Object.defineProperty(module.exports, 'id', {
  enumerable: true,
  value: 'json'
});
Object.defineProperty(module.exports, 'name', {
  enumerable: true,
  value: 'JSON'
});
