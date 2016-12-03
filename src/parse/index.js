'use strict';

var _ = require('lodash');
var autodetectSource = require('./source/autodetect');
var tokenize = require('./tokenize');
var utils = require('../utils');
var defaults = require('../defaults');

var defaultOptions = {
  errorHandler: null,
  processTokens: null,
  buildSyntaxTree: null,
  foreseeLimit: 1,
  getSourceMeta: function(source) {
    return _.omit(source, [
      'warp', 'weft', 'threadcount', 'sett', 'palette', 'colors'
    ]);
  },
  // Used only if `source` is an object (or JSON) and has different
  // warp and weft, and `buildSyntaxTree` is not specified
  warpAndWeftSeparator: defaults.warpAndWeftSeparator
};

function chooseNonEmptyString(values) {
  var result = _.filter(values, function(value) {
    return _.isString(value) && (value.length > 0);
  });
  return result.length > 0 ? _.first(result) : '';
}

function chooseRootBlock(values) {
  var result = _.filter(values, function(value) {
    return _.isObject(value) && value.isBlock && value.isRoot &&
      _.isArrayLike(value.items);
  });
  return result.length > 0 ? _.first(result) : utils.node.newRootBlock([]);
}

function parse(parsers, source, options) {
  var context = tokenize(source, parsers, options);
  var result = context.parse();
  if (_.isFunction(options.processTokens)) {
    result = options.processTokens(result);
  }
  if (_.isFunction(options.buildSyntaxTree)) {
    result = options.buildSyntaxTree(result);
  }
  return result;
}

function factory(parsers, options) {
  options = _.extend({}, defaultOptions, options);

  return function(source) {
    source = autodetectSource(source);

    var result;

    if (_.isString(source.warp) || _.isString(source.weft)) {
      var warp = _.trim(chooseNonEmptyString([source.warp, source.weft]));
      var weft = _.trim(chooseNonEmptyString([source.weft, source.warp]));
      var warpIsSameAsWeft = warp == weft;
      warp = parse(parsers, warp, options);
      if (warpIsSameAsWeft) {
        // Create AST with same warp and weft; use meta from warp;
        // do not use palette
        result = {
          meta: _.extend({}, warp.meta),
          warp: chooseRootBlock([warp.warp, warp.weft])
        };
        result.weft = result.warp;
      } else {
        weft = parse(parsers, weft, options);
        if (_.isArrayLike(warp) && _.isArrayLike(weft)) {
          // Merge tokens together;
          result = _.concat(warp,
            utils.token.newLiteral(options.warpAndWeftSeparator),
            weft);
        } else
        if (_.isObject(warp) && _.isObject(weft)) {
          // Create AST with different warp and weft; merge meta;
          // do not use palette
          result = {
            meta: _.extend({}, warp.meta, weft.meta),
            warp: chooseRootBlock([warp.warp, warp.weft]),
            weft: chooseRootBlock([weft.warp, weft.weft])
          };
        }
      }
    } else
    if (_.isString(source.threadcount) || _.isString(source.sett)) {
      // Try to parse entire threadcount
      var threadcount = chooseNonEmptyString([source.threadcount, source.sett]);
      result = parse(parsers, threadcount, options);
    } else {
      // Create empty result
      result = parse(parsers, '', options);
    }

    if (_.isString(source.palette) || _.isString(source.colors)) {
      // Try to add palette - as tokens or as color map
      var palette = chooseNonEmptyString([source.palette, source.colors]);
      palette = parse(parsers, palette, options);
      if (_.isArrayLike(result)) {
        if (_.isArrayLike(palette)) {
          result = _.concat(palette, result);
        }
      } else
      if (_.isObject(result)) {
        if (_.isObject(palette)) {
          result.colors = palette.colors;
          result.meta = _.extend({}, palette.meta, result.meta);
        }
      }
    }

    if (_.isObject(result)) {
      result.colors = _.extend({}, result.colors);
      if (_.isFunction(options.getSourceMeta)) {
        result.meta = _.extend({}, result.meta, options.getSourceMeta(source));
      } else {
        result.meta = _.extend({}, result.meta);
      }
    }

    return result;
  };
}

module.exports = factory;

module.exports.source = require('./source');

module.exports.color = require('./token/color');
module.exports.stripe = require('./token/stripe');
module.exports.pivot = require('./token/pivot');
module.exports.repeat = require('./token/repeat');
module.exports.literal = require('./token/literal');
