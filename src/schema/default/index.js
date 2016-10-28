'use strict';

var defaults = require('../../defaults');

module.exports.id = 'default';
module.exports.name = 'Default';
module.exports.parse = require('./parse');
module.exports.format = require('./format');
module.exports.colors = defaults.colors;
