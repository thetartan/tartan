'use strict';

var _ = require('lodash');
var utils = require('../../utils');

var defaultOptions = {
  // Name can have more than one character
  allowLongNames: true,
  // Regular expression or string; case-insensitive
  colorPrefix: /[=]?[#]/,
  // Regular expression or string; case-insensitive
  colorSuffix: /;?/,
  // Formats: `short` (#fc0), `long` (#ffcc00) or `both`
  colorFormat: 'both',
  allowComment: false,
  // Regular expression or string; case-insensitive
  commentSuffix: /;/,
  requireCommentSuffix: true,
  // Regular expression; value of first group will be used to modify
  // comment (if available)
  commentFormat: /^\s*(.*)\s*;\s*$/
};

function validateOptions(options) {
  options.colorFormat = _.trim(('' + options.colorFormat).toLowerCase());
  if (['long', 'short', 'both'].indexOf(options.colorFormat) == -1) {
    options.colorFormat = defaultOptions.colorFormat;
  }

  if (options.colorPrefix instanceof RegExp) {
    options.colorPrefix = options.colorPrefix.source;
  } else
  if (!_.isString(options.colorPrefix)) {
    options.colorPrefix = '';
  }

  if (options.colorSuffix instanceof RegExp) {
    options.colorSuffix = options.colorSuffix.source;
  } else
  if (!_.isString(options.colorSuffix)) {
    options.colorSuffix = '';
  }

  if (options.commentSuffix instanceof RegExp) {
    var flags = options.commentSuffix.ignoreCase ? 'i' : '';
    options.commentSuffix = new RegExp(
      '^' + options.commentSuffix.source, flags);
  } else {
    options.commentSuffix = null;
  }

  if (!(options.commentFormat instanceof RegExp)) {
    options.commentFormat = null;
  }

  return options;
}

function buildRegExp(options) {
  var result = ['^'];

  // Name part
  var part = '[a-z]';
  if (options.allowLongNames) {
    part += '{1,100}';
  }
  result.push('(' + part + ')');

  // Color format
  result.push('(' + options.colorPrefix + ')');
  switch (options.colorFormat) {
    case 'long':
      result.push('([0-9a-f]{6})');
      break;
    case 'short':
      result.push('([0-9a-f]{3})');
      break;
    case 'both':
      result.push('([0-9a-f]{6}|[0-9a-f]{3})');
      break;
    default:
      break;
  }
  result.push(options.colorSuffix);

  return new RegExp(result.join(''), 'i');
}

function parser(context, offset, pattern, options) {
  var source = context.source;
  var matches;
  var chunk;
  var i;

  chunk = source.substr(offset, 200);

  matches = pattern.exec(chunk);
  if (matches) {
    var result = {
      type: utils.token.color,
      name: matches[1].toUpperCase(),
      // matches[2] is color prefix
      color: utils.color.normalizeColor(matches[3]),
      comment: '',
      length: matches[0].length
    };

    if (!context.inForesee) {
      if (options.allowComment) {
        var commentOffset = offset + result.length;
        if (options.commentSuffix && options.requireCommentSuffix) {
          // Fast case - just search for suffix
          for (i = commentOffset; i < source.length; i++) {
            chunk = source.substr(i, 10);
            matches = options.commentSuffix.exec(chunk);
            if (matches) {
              result.comment = source.substr(commentOffset,
                i - commentOffset + matches[0].length);
              break;
            }
          }
          if (i >= source.length) {
            result.comment = source.substr(commentOffset, source.length);
          }
        } else {
          var ignoreTokens = ['whitespace', 'invalid'];
          // Slow - search for next token or suffix (if available)
          for (i = commentOffset; i < source.length; i++) {
            chunk = source.substr(i, 10);
            matches = options.commentSuffix.exec(chunk);
            if (matches) {
              result.comment = source.substr(commentOffset,
                i - commentOffset + matches[0].length);
              break;
            }
            var token = context.foresee(i);
            if (_.isObject(token) && (ignoreTokens.indexOf(token.type) == -1)) {
              result.comment = source.substr(commentOffset,
                i - commentOffset);
              break;
            }
          }
          if (i >= source.length) {
            result.comment = source.substr(commentOffset, source.length);
          }
        }
      }

      result.length += result.comment.length;

      if (options.commentFormat) {
        matches = options.commentFormat.exec(result.comment);
        if (matches && _.isString(matches[1])) {
          result.comment = matches[1];
        }
      }
      result.comment = _.trim(result.comment);
    }

    return result;
  }
}

function factory(options) {
  options = validateOptions(_.extend({}, defaultOptions, options));
  var pattern = buildRegExp(options);
  return function(context, offset) {
    return parser(context, offset, pattern, options);
  };
}

module.exports = factory;
