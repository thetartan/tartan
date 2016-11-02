'use strict';

var _ = require('lodash');
var utils = require('../../utils');

var defaultOptions = {
  // Name can have more than one character
  allowLongNames: true,
  // Use '=' symbol between name and value: 'none', 'allow', 'require'
  valueAssignment: 'allow',
  // Use '#' as color prefix: 'none', 'allow', 'require'
  colorPrefix: 'require',
  // Formats: `short` (#fc0), `long` (#ffcc00) or `both`
  colorFormat: 'both',
  // Comment after color value: 'none', 'allow', 'require'.
  // If `comment` != 'none' and `whitespaceBeforeComment` != 'require',
  // `colorFormat` is forced to `long`
  comment: 'none',
  // Whitespace between value and comment: 'none', 'allow', 'require'.
  // Ignored if `comment` options has value 'none'
  whitespaceBeforeComment: 'require',
  // Semicolon at the end of color definition: 'none', 'allow', 'require'
  semicolonAtTheEnd: 'allow'
};

function validateOptions(options) {
  var keys = [
    'valueAssignment',
    'colorPrefix',
    'comment',
    'whitespaceBeforeComment',
    'semicolonAtTheEnd'
  ];
  var values = ['none', 'allow', 'require'];
  _.each(keys, function(key) {
    var value = utils.trim(('' + options[key]).toLowerCase());
    if (values.indexOf(value) == -1) {
      value = defaultOptions[key];
    }
    options[key] = value;
  });

  options.colorFormat = utils.trim(('' + options.colorFormat).toLowerCase());
  if (['long', 'short', 'both'].indexOf(options.colorFormat) == -1) {
    options.colorFormat = defaultOptions.colorFormat;
  }

  // If comment is allowed and may be not separated from color
  // by a whitespace, require long color format - since it is the only
  // 100% way to extract color value
  if (options.comment != 'none') {
    if (options.whitespaceBeforeComment != 'require') {
      options.colorFormat = 'long';
    }
  }

  // If color prefix is 'none', require value assignment
  if (options.colorPrefix == 'none') {
    options.valueAssignment = 'require';
  }

  return options;
}

function buildRegExp(options) {
  /* eslint-disable max-statements-per-line */
  var result = ['^'];

  // Name part
  var part = '[a-z]';
  if (options.allowLongNames) {
    part += '{1,100}';
  }
  result.push('(' + part + ')');

  // Value assignment
  switch (options.valueAssignment) {
    case 'allow': result.push('=?'); break;
    case 'require': result.push('='); break;
    default: break;
  }

  // Color format
  switch (options.colorPrefix) {
    case 'allow': result.push('#?'); break;
    case 'require': result.push('#'); break;
    default: break;
  }

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

  // Comments
  if (options.comment != 'none') {
    switch (options.whitespaceBeforeComment) {
      case 'allow': result.push('\\s?'); break;
      case 'require': result.push('\\s'); break;
      default: break;
    }

    part = '';
    switch (options.semicolonAtTheEnd) {
      case 'none': part = '[^\\s]'; break;
      case 'allow': part = '[^;\\s]'; break;
      case 'require': part = '[^;]'; break;
      default: break;
    }

    switch (options.comment) {
      case 'allow': result.push('(' + part + '*)'); break;
      case 'require': result.push('(' + part + '+)'); break;
      default: break;
    }
  }

  // Semicolon at the end
  switch (options.semicolonAtTheEnd) {
    case 'none': break;
    case 'allow': result.push(';?'); break;
    case 'require': result.push(';'); break;
    default: break;
  }

  return new RegExp(result.join(''), 'i');
  /* eslint-enable max-statements-per-line */
}

function parser(str, offset, pattern) {
  var matches;

  // Color definition can have at most 107 characters
  str = str.substr(offset, 110);

  matches = pattern.exec(str);
  if (matches) {
    return {
      type: utils.TokenType.color,
      name: matches[1].toUpperCase(),
      color: utils.normalizeColor('#' + matches[2]),
      comment: utils.trim(matches[3]),
      length: matches[0].length
    };
  }
}

function factory(options) {
  options = validateOptions(_.extend({}, defaultOptions, options));
  var pattern = buildRegExp(options);
  return function(str, offset) {
    return parser(str, offset, pattern);
  };
}

module.exports = factory;
