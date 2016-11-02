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
      return token.name + token.color;
    },
    stripe: function(token) {
      return token.name + token.count;
    }
  };
  options.prepareNestedBlock = function(nestedBlock) {
    var result = _.clone(nestedBlock);
    if (nestedBlock.length > 2) {
      result.splice(1, 0, utils.newTokenOpeningParenthesis());
      result.splice(-1, 0, utils.newTokenClosingParenthesis());
    }
    return result;
  };
  options.prepareRootBlock = function(block) {
    var result = _.clone(block);
    if ((result.length == 1) && _.isArray(result[0])) {
      return result;
    }
    result.splice(0, 0, utils.newTokenOpeningParenthesis());
    result.push(utils.newTokenClosingParenthesis());
    return result;
  };
  options.joinComponents = function(formattedSett, originalSett) {
    var warp = '[ ' + formattedSett.warp
      .replace(/\(\s/g, '(').replace(/\s\)/g, ')');
    var weft = '';
    if (formattedSett.weft != formattedSett.warp) {
      if (formattedSett.weft != '') {
        weft = '] ' + formattedSett.weft
          .replace(/\(\s/g, '(').replace(/\s\)/g, ')');
      }
    }

    return utils.trim([formattedSett.colors, warp, weft].join('\n'));
  };
  return render.format(options);
}

module.exports = factory;
