'use strict';

var _ = require('lodash');

var defaultOptions = {
};

function trim(str) {
  return str.replace(/^\s+/i, '').replace(/\s+$/i, '');
}

function render(tokens, colors, options) {
  colors = _.chain(colors)
    .map(function(value, key) {
      return key + value;
    })
    .join(' ')
    .value();

  tokens = _.chain(tokens)
    .map(function(token) {
      switch (token.token) {
        case 'stripe': return token.name + token.count;
        case 'pivot': return token.name + '/' + token.count;
        default: return token.formatted || token.token;
      }
    })
    .filter()
    .join(' ')
    .value();

  tokens = tokens.replace(/\[\s/ig, '[').replace(/\s\]/ig, ']');

  return trim(colors + '\n' + tokens);
}

function factory(options) {
  options = _.extend({}, defaultOptions, options);
  return function(sett) {
    var tokens = _.isObject(sett) ? sett.tokens : [];
    var colors = _.isObject(sett) ? sett.colors : {};
    return render(tokens, _.extend({}, colors), options);
  };
}

module.exports = factory;
