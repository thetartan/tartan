'use strict';

var defaults = require('../../defaults');

module.exports.id = 'classic';
module.exports.name = 'Classic (strict syntax)';
module.exports.parse = require('./parse');
module.exports.format = require('./format');
module.exports.colors = defaults.colors;
