'use strict';

var _ = require('lodash');
var render = require('../../render');
var transform = require('../../transform');

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
    transform.fold({
      allowRootReorder: false,
      allowNestedBlocks: false,
      maxFoldLevels: 2,
      minBlockSize: 3,
      greedy: false,
      allowSplitStripe: false,
      processExistingBlocks: false
    })
  ]);

  return render.format(options);
}

module.exports = factory;
