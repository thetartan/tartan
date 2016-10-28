'use strict';

function substrNearOffset(str, offset) {
  var part = '';
  if (offset - 5 < 0) {
    part = str.substr(0, 10);
  } else {
    part = '...' + str.substr(offset - 5, 10);
  }
  if (offset + 5 < str.length) {
    part += '...';
  }

  return 'near ' + part;
}

function sourceFragmentData(source, offset, length) {
  return {
    source: source,
    offset: parseInt(offset, 10) || 0,
    length: parseInt(length, 10) || 0
  };
}

function NotImplemented() {
  return new Error('This feature is not implemented');
}

function CreateTokenError(message) {
  return new Error(message);
}

function InvalidToken(source, offset, length) {
  var error = new Error('Invalid token ' +
    substrNearOffset(source, offset));
  error.data = sourceFragmentData(source, offset, length);
  return error;
}

function ZeroWidthStripe(source, offset, length) {
  var error = new Error('Zero-width stripe ' +
    substrNearOffset(source, offset));
  error.data = sourceFragmentData(source, offset, length);
  return error;
}

function OrphanedPivot(token) {
  var source = token.source;
  var offset = token.offset;
  var length = token.length;

  var error = new Error('Orphaned pivot ' +
    substrNearOffset(source, offset));
  error.data = sourceFragmentData(source, offset, length);
  error.data.token = token;
  return error;
}

function UnsupportedToken(token) {
  var source = token.source;
  var offset = token.offset;
  var length = token.length;

  var error = new Error('Unsupported token ' +
    substrNearOffset(source, offset));
  error.data = sourceFragmentData(source, offset, length);
  error.data.token = token;
  return error;
}

function ColorNotFound(token, colorMap) {
  var source = token.source;
  var offset = token.offset;
  var length = token.length;

  var error = new Error('No entry in color map for ' + token.name);
  error.data = sourceFragmentData(source, offset, length);
  error.data.token = token;
  error.data.colors = colorMap;
  return error;
}

function InvalidColorFormat(token, colorMap) {
  var source = token.source;
  var offset = token.offset;
  var length = token.length;

  var error = new Error('Invalid color format: ' + colorMap[token.name]);
  error.data = sourceFragmentData(source, offset, length);
  error.data.token = token;
  error.data.colors = colorMap;
  return error;
}

function ClassicSyntaxError(message) {
  message = 'Strict syntax: only entire threadcount may be reflected';
  return new Error(message);
}

module.exports.NotImplemented = NotImplemented;
module.exports.CreateTokenError = CreateTokenError;
module.exports.InvalidToken = InvalidToken;
module.exports.ZeroWidthStripe = ZeroWidthStripe;
module.exports.OrphanedPivot = OrphanedPivot;
module.exports.UnsupportedToken = UnsupportedToken;
module.exports.ColorNotFound = ColorNotFound;
module.exports.InvalidColorFormat = InvalidColorFormat;
module.exports.ClassicSyntaxError = ClassicSyntaxError;
