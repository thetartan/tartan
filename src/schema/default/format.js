'use strict';

var render = require('../../render');
var utils = require('../../utils');

function factory(options) {
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
