'use strict';

var _ = require('lodash');

_.extend(module.exports, require('./package'));

module.exports.parse = require('./parse');
module.exports.filter = require('./filter');
module.exports.syntax = require('./syntax');
module.exports.transform = require('./transform');
module.exports.render = require('./render');
module.exports.schema = require('./schema');
module.exports.utils = require('./utils');
module.exports.helpers = require('./helpers');

module.exports.defaults = require('./defaults');
