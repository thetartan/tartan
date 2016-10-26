'use strict';

var _ = require('lodash');
var errors = require('../errors');

var TokenType = {
  invalid: 'invalid',
  whitespace: 'whitespace',
  color: 'color',
  stripe: 'stripe',
  pivot: 'pivot',
  literal: 'literal'
};

function trim(str) {
  return str.replace(/^\s+/i, '').replace(/\s+$/i, '');
}

function isValidName(str) {
  return /^[a-z]+$/i.test(str);
}

function isValidColor(str, acceptShortFormat) {
  if (acceptShortFormat) {
    return /^#[0-9a-f]{3}([0-9a-f]{3})?$/i.test(str);
  }
  return /^#[0-9a-f]{6}$/i.test(str);
}

function normalizeColor(str) {
  if (/^#[0-9a-f]{6}$/i.test(str)) {
    return str.toLowerCase();
  }
  if (/^#[0-9a-f]{3}$/i.test(str)) {
    // Duplicate each hexadecimal character
    return str.replace(/[0-9a-f]/ig, '$&$&').toLowerCase();
  }
  return false;
}

function normalizeColorMap(colors) {
  var result = {};
  _.each(colors, function(value, name) {
    name = isValidName(name) ? name : null;
    value = normalizeColor(value);
    if (name && value) {
      result[name.toUpperCase()] = value;
    }
  });
  return result;
}

function isToken(token, type) {
  return _.isObject(token) && (token.type == type);
}

function isInvalid(token) {
  return isToken(token, TokenType.invalid);
}

function isWhitespace(token) {
  return isToken(token, TokenType.whitespace);
}

function isColor(token) {
  return isToken(token, TokenType.color);
}

function isStripe(token) {
  return isToken(token, TokenType.stripe);
}

function isPivot(token) {
  return isToken(token, TokenType.pivot);
}

function isLiteral(token) {
  return isToken(token, TokenType.literal);
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
    token.type = TokenType.stripe;
  }
  return token;
}

function stripeToPivot(token) {
  if (isStripe(token)) {
    token = _.clone(token);
    token.type = TokenType.pivot;
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

function newTokenInvalid(value) {
  return newToken(TokenType.invalid, value);
}

function newTokenWhitespace(value) {
  return newToken(TokenType.whitespace, value);
}

function newTokenColor(name, value) {
  if (!isValidName(name)) {
    throw new errors.CreateTokenError('Invalid color name ' +
      JSON.stringify(name));
  }
  if (!isValidColor(value)) {
    throw new errors.CreateTokenError('Invalid color ' + JSON.stringify(name));
  }
  var result = newToken(TokenType.color);
  result.name = name;
  result.color = value;
  return result;
}

function newTokenStripe(name, count) {
  if (!isValidName(name)) {
    throw new errors.CreateTokenError('Invalid color name ' +
      JSON.stringify(name));
  }
  count = parseInt(count, 10) || 0;
  if (count < 0) {
    throw new errors.CreateTokenError('Count of threads should be >= 0');
  }

  var result = newToken(TokenType.stripe);
  result.name = name;
  result.count = count;
  return result;
}

function newTokenPivot(name, count) {
  if (!isValidName(name)) {
    throw new errors.CreateTokenError('Invalid color name ' +
      JSON.stringify(name));
  }
  count = parseInt(count, 10) || 0;
  if (count < 0) {
    throw new errors.CreateTokenError('Count of threads should be >= 0');
  }

  var result = newToken(TokenType.pivot);
  result.name = name;
  result.count = count;
  return result;
}

function newTokenSquareBracket(value) {
  if ((value != '[') && (value != ']')) {
    throw new errors.CreateTokenError('Invalid value ' + JSON.stringify(value));
  }
  return newToken(TokenType.literal, value);
}

function newTokenOpeningSquareBracket() {
  return newToken(TokenType.literal, '[');
}

function newTokenClosingSquareBracket() {
  return newToken(TokenType.literal, ']');
}

function newTokenParenthesis(value) {
  if ((value != '(') && (value != ')')) {
    throw new errors.CreateTokenError('Invalid value ' + JSON.stringify(value));
  }
  return newToken(TokenType.literal, value);
}

function newTokenOpeningParenthesis() {
  return newToken(TokenType.literal, '(');
}

function newTokenClosingParenthesis() {
  return newToken(TokenType.literal, ')');
}

function newTokenLiteral(value) {
  return newToken(TokenType.literal, value);
}

module.exports.TokenType = TokenType;

module.exports.trim = trim;

module.exports.isValidName = isValidName;
module.exports.isValidColor = isValidColor;
module.exports.normalizeColor = normalizeColor;
module.exports.normalizeColorMap = normalizeColorMap;

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
module.exports.newTokenInvalid = newTokenInvalid;
module.exports.newTokenWhitespace = newTokenWhitespace;
module.exports.newTokenColor = newTokenColor;
module.exports.newTokenStripe = newTokenStripe;
module.exports.newTokenPivot = newTokenPivot;
module.exports.newTokenSquareBracket = newTokenSquareBracket;
module.exports.newTokenOpeningSquareBracket = newTokenOpeningSquareBracket;
module.exports.newTokenClosingSquareBracket = newTokenClosingSquareBracket;
module.exports.newTokenParenthesis = newTokenParenthesis;
module.exports.newTokenOpeningParenthesis = newTokenOpeningParenthesis;
module.exports.newTokenClosingParenthesis = newTokenClosingParenthesis;
module.exports.newTokenLiteral = newTokenLiteral;
