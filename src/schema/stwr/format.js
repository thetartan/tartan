'use strict';

var _ = require('lodash');
var index = require('./index');
var render = require('../../render');
var transform = require('../../transform');

function formatPivot(str) {
  return str.replace(/^([a-z]+)([0-9]+)$/i, '$1/$2');
}

var defaultOptions = {
  format: {
    color: function(item) {
      var comment = item.comment != '' ? ' ' + item.comment : '';
      return item.name + '=' + item.value + comment + ';';
    },
    stripe: function(item) {
      return item.name + item.count;
    },
    block: function(block) {
      var items = block.formattedItems;
      if (block.reflect && (items.length >= 2)) {
        // Convert first and last to pivots
        items[0] = formatPivot(items[0]);
        items[items.length - 1] = formatPivot(items[items.length - 1]);
      }
      return _.chain(items).join(' ').trim().value();
    }
  }
};

// Options same as for tartan.render.format():
// + warpAndWeftSeparator: index.warpAndWeftSeparator
// - format
// - join
function factory(options) {
  options = _.extend({}, options, defaultOptions);

  if (!_.isString(options.warpAndWeftSeparator)) {
    options.warpAndWeftSeparator = '';
  }
  if (options.warpAndWeftSeparator == '') {
    options.warpAndWeftSeparator = index.warpAndWeftSeparator;
  }

  options.transformSyntaxTree = transform([
    options.transformSyntaxTree,
    transform.flatten(),
    transform.fold()
  ]);

  options.join = function(components) {
    var parts = [];
    if (components.colors.length > 0) {
      parts.push(components.colors.join(' '));
    }
    if (components.warp != components.weft) {
      parts.push(components.warp + ' ' + options.warpAndWeftSeparator +
        ' ' + components.weft);
    } else {
      parts.push(components.warp);
    }
    return parts.join('\n');
  };

  return render.format(options);
}

module.exports = factory;
