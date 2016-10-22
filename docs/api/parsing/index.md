# Parsing

To construct parser object, use factory:
```javascript
var parser = tartan.parse([
  // List of parsers
], {
  // Options
}, function(sett) {
  // Optional function to post-process parsed sett
  return sett;
});
```

List of parsers is an array of function. Each function 
takes source string and offset as its arguments and should
return token object or `false` (or `null` or `undefined`).

To create instance of parser, use its factory, in example:
```javascript
var colorParser = tartan.parse.color();
```

Library has some built-in parsers:
* [tartan.parse.color()](color.md) 
* [tartan.parse.stripe()](stripe.md) 
* [tartan.parse.pivot()](pivot.md) 
* [tartan.parse.squareBrackets()](square-brackets.md)
 
Also there are two internally used parsers: `whitespace` and `invalid`.
`whitespace` parser is always prepended to array of parsers and is used to
skip spaces between tokens. `invalid` parser as always appended to list of 
parsers. It should handle a case when all parsers refused to recognize next
token - so `invalid` triggers an error or returns special token depending on
its options. Actually, `options` passed to `tartan.parse()` will be used as 
options for this two internal parsers.

The last optional argument is a function that takes a sett and should also 
return a sett. This function is a hook where sett can be modified after parsing.
Library has a lot of predefined [processors](../processing/index.md) that can do a lot of
useful stuff.
 
To parse a threadcount source, parser will ask each parser to recognize a text at
specific offset (initially `0`). When one of parsers returns token, parser appends 
this token to result, increases offset by length of token and repeats the cycle,
until reaching end of source.
 
To create new parsers, use information above and source codes of built-in parsers
as examples.
  