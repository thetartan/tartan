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

function isMatchingToken(opening, closing) {
  return (
    utils.token.isOpeningSquareBracket(opening) &&
    utils.token.isClosingSquareBracket(closing)
  ) || (
    utils.token.isOpeningParenthesis(opening) &&
    utils.token.isClosingParenthesis(closing)
  );
}

/*
  <sett> ::= <sequence> [ '//' <sequence> ]
  <sequence> ::= {
    <color> |
    [ <repeat> ] <stripe> [ <repeat> ] |
    <pivots> |
    [ <repeat> ] <block> [ <repeat> ]
  }
  <block> ::= '[' <sequence> ']' | '(' <sequence> ')'
  <pivots> ::=
    [ <repeat> ] <pivot> [ <repeat> ]
    [{ <color> | [ <repeat> ] <stripe> [ <repeat> ] }]
    [ <repeat> ] <pivot> [ <repeat> ]
*/

function buildTree(tokens, options) {
  var stack = [{
    isRegularBlock: true,
    items: []
  }];
  var current;
  var parent;

  _.each(tokens, function(token) {
    if (token.isStripe) {
      current = _.last(stack);
      current.items.push(utils.node.newStripe(token));
      return;
    }
    if (token.isPivot) {
      current = _.last(stack);
      if (current.isPivotBlock) {
        current.items.push(utils.node.newStripe(token));
        stack.pop();
        parent = _.last(stack);
        parent.items.push(utils.node.newBlock(current.items, true));
      } else {
        stack.push({
          isPivotBlock: true,
          token: token,
          items: [utils.node.newStripe(token)]
        });
      }
      return;
    }
    if (token.isBlockStart || token.isBlockEnd) {
      current = _.last(stack);
      if (current.isPivotBlock) {
        options.errorHandler(
          new Error(utils.error.message.orphanedPivot),
          {token: current.token},
          utils.error.severity.warning
        );
        stack.pop();
        parent = _.last(stack);
        [].push.apply(parent.items, current.items);
      }
    }
    if (token.isBlockStart) {
      stack.push({
        isRegularBlock: true,
        token: token,
        items: []
      });
      return;
    }
    if (token.isBlockEnd) {
      if (stack.length > 1) {
        current = stack.pop();
        if (isMatchingToken(current.token, token)) {
          if (current.items.length > 0) {
            parent = _.last(stack);
            parent.items.push(utils.node.newBlock(
              current.items, // items
              utils.token.isClosingSquareBracket(token), // reflect
              current.token.repeat * token.repeat // repeat
            ));
          }
          return;
        }
        // Put block back onto stack and proceed to showing an error
        stack.push(current);
      }
      options.errorHandler(
        new Error(utils.error.message.unmatchedBlockEnd),
        {token: token},
        utils.error.severity.error
      );
      return;
    }
    options.errorHandler(
      new Error(utils.error.message.unexpectedToken),
      {token: token},
      utils.error.severity.error
    );
  });

  while (stack.length > 1) {
    current = stack.pop();
    parent = _.last(stack);
    if (current.items.length > 0) {
      [].push.apply(parent.items, current.items);
    }
    if (current.isPivotBlock) {
      options.errorHandler(
        new Error(utils.error.message.orphanedPivot),
        {token: current.token},
        utils.error.severity.warning
      );
    } else {
      options.errorHandler(
        new Error(utils.error.message.unmatchedBlockStart),
        {token: current.token},
        utils.error.severity.error
      );
    }
  }

  current = _.first(stack).items;
  var isReflected = false;
  if ((current.length == 1) && current[0].isBlock && current[0].reflect) {
    isReflected = true;
    current = current[0].items;
  }
  return utils.node.newRootBlock(current, isReflected);
}

function processRepeats(tokens, options) {
  return _.chain(tokens)
    // Process suffix repeats
    .reduce(function(accumulator, item) {
      if (item.isRepeat && item.isSuffix) {
        var last = accumulator.pop();
        if (last) {
          last = _.clone(last);
          last.repeat = last.repeat > 1 ? last.repeat : 1;
          last.repeat *= item.count;
          accumulator.push(last);
        } else {
          options.errorHandler(
            new Error(utils.error.message.unexpectedToken),
            {token: item},
            utils.error.severity.error
          );
        }
      } else {
        item = _.clone(item);
        item.repeat = item.repeat > 1 ? item.repeat : 1;
        accumulator.push(item);
      }
      return accumulator;
    }, [])
    // Process prefix repeats; result will be reversed - so after this
    // turn it back
    .reduceRight(function(accumulator, item) {
      if (item.isRepeat && item.isPrefix) {
        var last = accumulator.pop();
        if (last) {
          last = _.clone(last);
          last.repeat = last.repeat > 1 ? last.repeat : 1;
          last.repeat *= item.count;
          accumulator.push(last);
        } else {
          options.errorHandler(
            new Error(utils.error.message.unexpectedToken),
            {token: item},
            utils.error.severity.error
          );
        }
      } else {
        item = _.clone(item);
        item.repeat = item.repeat > 1 ? item.repeat : 1;
        accumulator.push(item);
      }
      return accumulator;
    }, [])
    .reverse()
    // Apply repeats to stripes and pivots
    .map(function(item) {
      if ((item.isStripe || item.isPivot) && (item.repeat > 1)) {
        item = _.clone(item);
        item.count *= item.repeat;
        item.repeat = 1;
      }
      return item;
    })
    .value();
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
  var colorTokens = [];
  var warpTokens = [];
  var weftTokens = [];
  var current = warpTokens;
  _.each(tokens, function(token) {
    if (token.isColor) {
      colorTokens.push(token);
      return;
    }
    if (token.isWarpAndWeftSeparator) {
      if (current === weftTokens) {
        options.errorHandler(
          new Error(utils.error.message.multipleWarpAnWeftSeparator),
          {token: token},
          utils.error.severity.warning
        );
      }
      current = weftTokens;
    } else {
      current.push(token);
    }
  });

  warpTokens = processRepeats(warpTokens, options);
  weftTokens = processRepeats(weftTokens, options);

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
