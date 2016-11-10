'use strict';

var _ = require('lodash');

function isValidColor(str, acceptShortFormat) {
  if (acceptShortFormat) {
    return /^#[0-9a-f]{3}([0-9a-f]{3})?$/i.test(str);
  }
  return /^#[0-9a-f]{6}$/i.test(str);
}

function isSameColor(left, right) {
  left = left.replace(/^\s*#/g, '').replace(/\s+$/g, '').toUpperCase();
  right = right.replace(/^\s*#/g, '').replace(/\s+$/g, '').toUpperCase();
  return left == right;
}

function normalizeColor(str) {
  if (/^#?[0-9a-f]{6}$/i.test(str)) {
    return '#' + str.replace(/^#/, '').toUpperCase();
  }
  if (/^#?[0-9a-f]{3}$/i.test(str)) {
    // Duplicate each hexadecimal character
    return '#' + str.replace(/^#/, '')
      .replace(/[0-9a-f]/ig, '$&$&').toUpperCase();
  }
  return str;
}

function buildColorMap(colors) {
  var result = {};
  if (_.isArray(colors)) {
    _.each(colors, function(token) {
      result[token.name.toUpperCase()] = {
        value: normalizeColor(token.color),
        comment: _.isString(token.comment) ? token.comment : ''
      };
    });
  } else
  if (_.isObject(colors)) {
    _.each(colors, function(value, name) {
      result[name.toUpperCase()] = {
        value: normalizeColor(value),
        comment: ''
      };
    });
  }
  return result;
}

module.exports.isValidColor = isValidColor;
module.exports.isSameColor = isSameColor;
module.exports.normalizeColor = normalizeColor;
module.exports.buildColorMap = buildColorMap;
