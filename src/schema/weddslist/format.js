'use strict';

var _ = require('lodash');
var index = require('./index');
var render = require('../../render');
var transform = require('../../transform');
var defaults = require('../../defaults');

function formatPivot(str) {
  return str.replace(/^([a-z]+)([0-9]+)$/i, '$1/$2');
}

var defaultOptions = {
  format: {
    color: function(item) {
      return item.name + item.value;
    },
    stripe: function(item) {
      return item.name + item.count;
    },
    block: function(block) {
      var items = block.formattedItems;
      if (block.reflect && (items.length >= 3)) {
        items.splice(1, 0, '(');
        items.splice(-1, 0, ')');
      }
      return _.chain(items).join(' ').trim().value()
        .replace(/\(\s+/g, '(')
        .replace(/\s+\)/g, ')');
    }
  },
  join: function(components) {
    var parts = [];
    if (components.colors.length > 0) {
      parts.push(components.colors.join(' '));
    }

    var warp = components.warp;
    var weft = components.weft;
    if (warp == '') {
      warp = weft;
      weft = '';
    }
    if (components.warp == components.weft) {
      weft = '';
    }

    if (warp != '') {
      parts.push('[ ' + warp);
    }
    if (weft != '') {
      parts.push('] ' + weft);
    }

    return parts.join('\n');
  }
};

// Options same as for tartan.render.format():
// - format
// - join
function factory(options) {
  options = _.extend({}, options, defaultOptions);

  options.transformSyntaxTree = transform([
    options.transformSyntaxTree,
    transform.flatten(),
    transform.fold()
  ]);

  return render.format(options);
}

module.exports = factory;
