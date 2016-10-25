'use strict';

var _ = require('lodash');
var utils = require('../../utils');
var process = require('../../process');
var format = require('../../render/format');

var defaultOptions = {
  formatters: {
    color: function(token) {
      return token.name + token.color + '\n';
    },
    stripe: function(token) {
      return token.name + token.count;
    },
    parenthesis: function(token) {
      return token.value;
    }
  },
  defaultFormatter: function(token) {
    return '';
  },
  joinComponents: function(sett) {
    var result = [utils.trim(sett.colors), sett.warp, sett.weft];
    return result.join('\n').replace(/\(\s/g, '(').replace(/\s\)/g, ')');
  }
};

function factory(options, preprocess, postprocess) {
  // This is not a mistake - we need to force some options for formatter
  options = _.extend({}, options, defaultOptions);
  return format(options, process([
    preprocess,
    process.unfold(),
    process.mergeStripes(),
    process.fold({
      allowNestedBlocks: false
    }),
    process.squareBracketsToParenthesis(),
    postprocess
  ]));
}

module.exports = factory;
