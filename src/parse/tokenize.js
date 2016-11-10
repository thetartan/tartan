'use strict';

var _ = require('lodash');
var whitespace = require('./token/whitespace');
var invalid = require('./token/invalid');

function Context(source, parsers, options) {
  this.source = _.isString(source) ? source : '';

  parsers = _.filter(parsers, _.isFunction);
  parsers.splice(0, 0, whitespace()); // Prepend this parser to skip spaces
  parsers.push(invalid()); // This parser will handle invalid tokens
  this.parsers = parsers;
  this.options = options;

  this.inForesee = 0;

  if (_.isFunction(options.errorHandler)) {
    this.errorHandler = function(error, data, severity) {
      options.errorHandler(error, data, severity || 'error');
    };
  }
}

Context.prototype = {};

Context.prototype.errorHandler = function(error, data, severity) {
  // Do nothing - default error handler will just ignore all errors.
};

function getToken(context, offset) {
  var result = null;

  _.each(context.parsers, function(parser) {
    result = parser(context, offset);
    if (_.isObject(result)) {
      result.offset = result.offset || offset;
      return false; // Break
    }
  });

  return result;
}

Context.prototype.foresee = function(offset) {
  var foreseeLimit = this.options.foreseeLimit;
  if (this.inForesee >= foreseeLimit) {
    return null;
  }

  offset = parseInt(offset, 10) || 0;
  if (offset < 0) {
    offset = 0;
  }

  if (offset <= this.offset) {
    this.errorHandler(new Error('Parser should not go back.'), {
      currentOffset: this.offset,
      requestedOffset: offset,
      source: this.source
    });
    return null;
  }

  this.inForesee++;
  var result = getToken(this, offset);
  if (this.inForesee > 0) {
    this.inForesee--;
  }
  return result;
};

Context.prototype.parse = function(offset) {
  var result = [];

  offset = parseInt(offset, 10) || 0;
  if (offset < 0) {
    offset = 0;
  }

  while (offset < this.source.length) {
    this.offset = offset;
    var token = getToken(this, offset);
    if (_.isObject(token)) {
      result.push(token);
      offset = token.offset + token.length;
    }
  }

  return result;
};

function factory(source, parsers, options) {
  options = _.extend({}, options);
  options.foreseeLimit = parseInt(options.foreseeLimit, 10) || 0;
  if (options.foreseeLimit < 1) {
    options.foreseeLimit = 1;
  }
  return new Context(source, parsers, options);
}

module.exports = factory;
