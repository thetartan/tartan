'use strict';

var _ = require('lodash');
var process = require('../../process');
var format = require('../../render/format');

var defaultOptions = {
  formatters: {
    color: function(token) {
      return token.name + '=' + token.color.substr(1, 7).toUpperCase() +
        (token.comment ? token.comment : '') + ';';
    },
    stripe: function(token) {
      return token.name + token.count;
    },
    pivot: function(token) {
      return token.name + '/' + token.count;
    }
  },
  defaultFormatter: function(token) {
    return '';
  },
  joinComponents: function(sett) {
    var result = [sett.colors];
    if ((sett.warp != '') && (sett.weft != '')) {
      result.push(sett.warp + ' . ' + sett.weft);
    } else {
      result.push(sett.warp + sett.weft);
    }
    return result.join('\n');
  }
};

function factory(options, preprocess, postprocess) {
  // This is not a mistake - we need to force some options for formatter
  options = _.extend({}, options, defaultOptions);
  return format(options, process([
    preprocess,
    process([
      process.unfold(),
      process.mergeStripes(),
      process.fold({
        allowNestedBlocks: false
      }),
      process.squareBracketsToPivots()
    ], {
      // This combination will do its job in a single iteration
      runUntilUnmodified: false
    }),
    postprocess
  ]));
}

module.exports = factory;
