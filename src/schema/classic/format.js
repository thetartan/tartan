'use strict';

var _ = require('lodash');
var render = require('../../render');
var transform = require('../../transform');
var utils = require('../../utils');

function factory(options) {
  options = _.extend({}, options);
  options.transformSett = transform([
    options.transformSett,
    transform.flatten(options),
    transform.fold()
  ]);
  options.formatters = {
    color: function(token) {
      var comment = _.isString(token.comment) && (token.comment.length > 0) ?
        ' ' + utils.trim(token.comment) : '';
      return token.name + token.color + comment + ';';
    },
    stripe: function(token) {
      return token.name + token.count;
    },
    pivot: function(token) {
      return token.name + '/' + token.count;
    }
  };
  options.prepareNestedBlock = function(nestedBlock) {
    var result = [];
    result.push(utils.stripeToPivot(_.first(nestedBlock)));
    if (nestedBlock.length > 2) {
      result = result.concat(nestedBlock.slice(1, nestedBlock.length - 1));
    }
    result.push(utils.stripeToPivot(_.last(nestedBlock)));
    return result;
  };
  options.prepareRootBlock = function(block) {
    return block;
  };
  options.joinComponents = function(formattedSett, originalSett) {
    var threadcount = formattedSett.warp;
    var weft = formattedSett.weft;
    if ((weft != '') && (weft != formattedSett.warp)) {
      threadcount += ' // ' + formattedSett.weft;
    }
    return utils.trim([formattedSett.colors, threadcount].join('\n'));
  };
  return render.format(options);
}

module.exports = factory;
