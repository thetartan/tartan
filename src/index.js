'use strict';

var _ = require('lodash');

_.extend(module.exports, require('./package'));

module.exports.errors = require('./errors');
module.exports.parse = require('./parse');
module.exports.process = require('./process');
module.exports.render = require('./render');
module.exports.helpers = require('./helpers');
module.exports.utils = require('./utils');

module.exports.defaults = require('./defaults');
