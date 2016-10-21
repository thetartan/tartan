'use strict';

var _ = require('lodash');

function isOpenSquareBrace(token) {
  return _.isObject(token) &&
    (token.token == 'square-brace') && (token.value == '[');
}

function isCloseSquareBrace(token) {
  return _.isObject(token) &&
    (token.token == 'square-brace') && (token.value == ']');
}

function squareBrace(value) {
  return {
    token: 'square-brace',
    value: value,
    offset: -1,
    length: 1
  };
}

function isPivot(token) {
  return _.isObject(token) && (token.token == 'pivot');
}

function pivotToStripe(token) {
  token = _.clone(token);
  token.token = 'stripe';
  return token;
}

module.exports.isOpenSquareBrace = isOpenSquareBrace;
module.exports.isCloseSquareBrace = isCloseSquareBrace;
module.exports.squareBrace = squareBrace;
module.exports.isPivot = isPivot;
module.exports.pivotToStripe = pivotToStripe;
