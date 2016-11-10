'use strict';

var _ = require('lodash');
var utils = require('../utils');

var defaultOptions = {
  // Error handler
  errorHandler: function(error, data, severity) {
    // Do nothing
  },
  // function to filter parsed tokens: (tokens) => { return modifiedTokens; }
  processTokens: null,
  // function to transform newly built AST: (ast) => { return modifiedAst; }
  transformSyntaxTree: null
};

/*
  <sett> ::= [ { <color> } ]
    <sequence> |
    <warp> [ <weft> ] |
    [ <warp> ] <weft> |
    <weft> <warp>

  <warp> ::= '[' <sequence>
  <weft> ::= ']' <sequence>

  <sequence> ::= <reflected> | <repetitive>
  <reflected> ::= <stripe> '(' { <stripe> } ')' <stripe>
  <repetitive> ::= [ '(' ] { <stripe> } [ ')' ]
*/

function buildTree(tokens, options) {
  var first;
  var last;
  var isReflected = false;

  tokens = _.filter(tokens, function(token) {
    return !token.isWarpStart && !token.isWeftStart;
  });

  // Strip parenthesis at beginning and end
  if (tokens.length >= 2) {
    first = _.first(tokens);
    last = _.last(tokens);
    if (first.isBlockBodyStart && last.isBlockBodyEnd) {
      tokens.splice(0, 1);
      tokens.splice(-1, 1);
    } else {
      if (first.isBlockBodyStart) {
        options.errorHandler(
          new Error(utils.error.message.unexpectedToken),
          {token: first},
          utils.error.severity.error
        );
        tokens.splice(0, 1);
      }
      if (last.isBlockBodyStart) {
        options.errorHandler(
          new Error(utils.error.message.unexpectedToken),
          {token: last},
          utils.error.severity.error
        );
        tokens.splice(-1, 1);
      }
    }
  }

  // Check if sequence is reflected
  if (tokens.length >= 4) {
    first = _.first(tokens);
    last = _.last(tokens);
    if (first.isStripe && last.isStripe) {
      first = tokens[1];
      last = tokens[tokens.length - 2];
      if (first.isBlockBodyStart && last.isBlockBodyEnd) {
        isReflected = true;
        tokens.splice(1, 1);
        tokens.splice(-2, 1);
      }
    }
  }

  // Convert all tokens to items
  var items = _.chain(tokens)
    .map(function(token) {
      if (token.isStripe) {
        return utils.node.newStripe(token);
      }
      options.errorHandler(
        new Error(utils.error.message.unexpectedToken),
        {token: token},
        utils.error.severity.error
      );
      return null;
    })
    .filter()
    .value();

  // Check for <stripe> '(' ')' <stripe>
  if (items.length <= 2) {
    isReflected = false;
  }

  return utils.node.newRootBlock(items, isReflected);
}

function extractSequence(tokens, result, options, shouldBreak) {
  var first = _.first(tokens);
  _.each(tokens, function(token) {
    if (shouldBreak(token)) {
      return false; // Break
    }
    if (token.isWarpStart && (token !== first)) {
      options.errorHandler(
        new Error(utils.error.message.multipleWarpAnWeftSeparator),
        {token: token},
        utils.error.severity.warning
      );
    }
    result.push(token);
  });
}

function extractWarpAndWeft(tokens, warp, weft, options) {
  if (tokens.length == 0) {
    return;
  }

  var first;
  var isWarpExtracted = false;

  // Try to extract warp
  first = _.first(tokens);
  if (first.isWarpStart || first.isStripe || first.isBlockBodyStart) {
    extractSequence(tokens, warp, options, function(token) {
      return token.isWeftStart;
    });
    tokens.splice(0, warp.length);
    isWarpExtracted = true;
  }

  // Try to extract weft
  first = _.first(tokens);
  if (first && first.isWeftStart) {
    extractSequence(tokens, weft, options, function(token) {
      return token.isWarpStart;
    });
    tokens.splice(0, weft.length);
  }

  // If warp was not extracted, try again, but more strict
  if (!isWarpExtracted) {
    first = _.first(tokens);
    if (first && first.isWarpStart) {
      extractSequence(tokens, warp, options, function(token) {
        return token.isWeftStart;
      });
      tokens.splice(0, warp.length);
    }
  }

  // Trigger error for rest tokens
  _.each(tokens, function(token) {
    options.errorHandler(
      new Error(utils.error.message.extraTokenInInputSequence),
      {token: token},
      utils.error.severity.warning
    );
  });
}

function buildSyntaxTree(tokens, options) {
  // Some pre-validation and filtering
  if (!_.isArray(tokens)) {
    return tokens;
  }
  if (_.isFunction(options.processTokens)) {
    tokens = options.processTokens(tokens);
    if (!_.isArray(tokens)) {
      return tokens;
    }
  }

  // Extract colors; split warp and weft
  var colorTokens = _.filter(tokens, function(token) {
    return token.isColor;
  });
  var warpTokens = [];
  var weftTokens = [];
  extractWarpAndWeft(_.filter(tokens, function(token) {
    return !token.isColor;
  }), warpTokens, weftTokens, options);
  if (warpTokens.length == 0) {
    warpTokens = weftTokens;
    weftTokens = [];
  }
  if (weftTokens.length == 0) {
    weftTokens = warpTokens;
  }

  var result = {};
  result.colors = utils.color.buildColorMap(colorTokens);
  result.warp = buildTree(warpTokens, options);
  if (weftTokens === warpTokens) {
    result.weft = result.warp;
  } else {
    result.weft = buildTree(weftTokens, options);
  }

  if (_.isFunction(options.transformSyntaxTree)) {
    result = options.transformSyntaxTree(result);
  }
  return result;
}

function factory(options) {
  options = _.extend({}, defaultOptions, options);
  if (!_.isFunction(options.errorHandler)) {
    options.errorHandler = defaultOptions.errorHandler;
  }
  return function(tokens) {
    return buildSyntaxTree(tokens, options);
  };
}

module.exports = factory;
