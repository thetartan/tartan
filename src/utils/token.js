'use strict';

var _ = require('lodash');

var tokenType = {
  invalid: 'invalid',
  whitespace: 'whitespace',
  color: 'color',
  stripe: 'stripe',
  pivot: 'pivot',
  literal: 'literal'
};

function isToken(token, type) {
  return _.isObject(token) && (token.type == type);
}

function isInvalid(token) {
  return isToken(token, tokenType.invalid);
}

function isWhitespace(token) {
  return isToken(token, tokenType.whitespace);
}

function isColor(token) {
  return isToken(token, tokenType.color);
}

function isStripe(token) {
  return isToken(token, tokenType.stripe);
}

function isPivot(token) {
  return isToken(token, tokenType.pivot);
}

function isLiteral(token) {
  return isToken(token, tokenType.literal);
}

function isSquareBracket(token) {
  return isLiteral(token) && ((token.value == '[') || (token.value == ']'));
}

function isOpeningSquareBracket(token) {
  return isLiteral(token) && (token.value == '[');
}

function isClosingSquareBracket(token) {
  return isLiteral(token) && (token.value == ']');
}

function isParenthesis(token) {
  return isLiteral(token) && ((token.value == '(') || (token.value == ')'));
}

function isOpeningParenthesis(token) {
  return isLiteral(token) && (token.value == '(');
}

function isClosingParenthesis(token) {
  return isLiteral(token) && (token.value == ')');
}

function pivotToStripe(token) {
  if (isPivot(token)) {
    token = _.clone(token);
    token.type = tokenType.stripe;
  }
  return token;
}

function stripeToPivot(token) {
  if (isStripe(token)) {
    token = _.clone(token);
    token.type = tokenType.pivot;
  }
  return token;
}

function newToken(type, value) {
  var result = {
    type: type,
    source: '',
    offset: -1,
    length: -1
  };
  if (_.isString(value)) {
    result.value = value;
    result.length = value.length;
  }
  return result;
}

function newInvalid(value) {
  return newToken(tokenType.invalid, value);
}

function newWhitespace(value) {
  return newToken(tokenType.whitespace, value);
}

function newColor(name, value) {
  var result = newToken(tokenType.color);
  result.name = name;
  result.color = value;
  return result;
}

function newStripe(name, count) {
  count = parseInt(count, 10) || 0;
  if (count < 0) {
    count = 0;
  }

  var result = newToken(tokenType.stripe);
  result.name = name;
  result.count = count;
  return result;
}

function newPivot(name, count) {
  count = parseInt(count, 10) || 0;
  if (count < 0) {
    count = 0;
  }

  var result = newToken(tokenType.pivot);
  result.name = name;
  result.count = count;
  return result;
}

function newSquareBracket(value) {
  return newToken(tokenType.literal, value);
}

function newOpeningSquareBracket() {
  return newToken(tokenType.literal, '[');
}

function newClosingSquareBracket() {
  return newToken(tokenType.literal, ']');
}

function newParenthesis(value) {
  return newToken(tokenType.literal, value);
}

function newOpeningParenthesis() {
  return newToken(tokenType.literal, '(');
}

function newClosingParenthesis() {
  return newToken(tokenType.literal, ')');
}

function newLiteral(value) {
  return newToken(tokenType.literal, value);
}

module.exports = tokenType;

module.exports.isToken = isToken;
module.exports.isInvalid = isInvalid;
module.exports.isWhitespace = isWhitespace;
module.exports.isColor = isColor;
module.exports.isStripe = isStripe;
module.exports.isPivot = isPivot;
module.exports.isSquareBracket = isSquareBracket;
module.exports.isOpeningSquareBracket = isOpeningSquareBracket;
module.exports.isClosingSquareBracket = isClosingSquareBracket;
module.exports.isParenthesis = isParenthesis;
module.exports.isOpeningParenthesis = isOpeningParenthesis;
module.exports.isClosingParenthesis = isClosingParenthesis;
module.exports.isLiteral = isLiteral;

module.exports.pivotToStripe = pivotToStripe;
module.exports.stripeToPivot = stripeToPivot;

module.exports.newToken = newToken;
module.exports.newInvalid = newInvalid;
module.exports.newWhitespace = newWhitespace;
module.exports.newColor = newColor;
module.exports.newStripe = newStripe;
module.exports.newPivot = newPivot;
module.exports.newSquareBracket = newSquareBracket;
module.exports.newOpeningSquareBracket = newOpeningSquareBracket;
module.exports.newClosingSquareBracket = newClosingSquareBracket;
module.exports.newParenthesis = newParenthesis;
module.exports.newOpeningParenthesis = newOpeningParenthesis;
module.exports.newClosingParenthesis = newClosingParenthesis;
module.exports.newLiteral = newLiteral;
