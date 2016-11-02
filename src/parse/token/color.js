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
  // Color can be in short format (#fc0)
  allowShortFormat: true,
  // Comment after color value: 'none', 'allow', 'require'.
  // If `comment` != 'none' and `semicolonBeforeComment` != 'require',
  // `allowShortFormat` is forced to true
  comment: 'none',
  // Semicolon between value and comment: 'none', 'allow', 'require'.
  // Ignored if `comment` options has value 'none'
  semicolonBeforeComment: 'require',
  // Semicolon at the end of color definition: 'none', 'allow', 'require'
  semicolonAtTheEnd: 'allow'
};

function validateOptions(options) {
  var keys = [
    'valueAssignment',
    'colorPrefix',
    'comment',
    'semicolonBeforeComment',
    'semicolonAtTheEnd'
  ];
  _.each(keys, function(key) {
    var value = utils.trim(('' + options[key]).toLowerCase());
    if ((value != 'allow') && (value != 'require')) {
      value = 'none';
    }
    options[key] = value;
  });

  // If comment is allowed and may be not separated from color
  // by a semicolon, require long color format - since it is the only
  // 100% way to extract color value
  if (options.comment != 'none') {
    if (options.semicolonBeforeComment != 'require') {
      options.allowShortFormat = false;
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

  if (options.allowShortFormat) {
    result.push('([0-9a-f]{6}|[0-9a-f]{3})');
  } else {
    result.push('([0-9a-f]{6})');
  }

  // Comments

  switch (options.comment) {
    case 'allow':
      switch (options.semicolonBeforeComment) {
        case 'allow': result.push('(;?([^;]*?))'); break;
        case 'require': result.push('(;([^;]*?))'); break;
        default: break;
      }
      break;
    case 'require':
      switch (options.semicolonBeforeComment) {
        case 'allow': result.push('(;?([^;]+?))'); break;
        case 'require': result.push('(;([^;]+?))'); break;
        default: break;
      }
      break;
    default: break;
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
      comment: utils.trim(matches[4]),
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
