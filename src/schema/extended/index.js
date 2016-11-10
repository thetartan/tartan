'use strict';

var defaults = require('../../defaults');

module.exports.id = 'extended';
module.exports.name = 'Extended syntax';
module.exports.parse = require('./parse');
module.exports.format = require('./format');
module.exports.colors = defaults.colors;
module.exports.warpAndWeftSeparator = defaults.warpAndWeftSeparator;
