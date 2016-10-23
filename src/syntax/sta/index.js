'use strict';

// Syntax by Scottish Tartans Authority

var parse = require('../../parse');
var process = require('../../process');

function factory(options, processors) {
  // TODO: Allow to use more options from `options`
  return parse([
    parse.color({
      allowLongNames: true,
      valueAssignment: 'require',
      colorPrefix: 'none',
      allowShortFormat: false,
      comment: 'allow',
      semicolonBeforeComment: 'allow',
      semicolonAtTheEnd: 'require'
    }),
    parse.stripe({
      allowLongNames: true
    }),
    parse.pivot({
      allowLongNames: true
    })
  ], options, process([
    process.extractColors(),
    process.optimize()
  ].concat(_.isArray(processors) ? processors : [])));
}

module.exports = factory;
