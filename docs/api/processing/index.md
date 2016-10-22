# Processing

Processors are the functions that accepts the only argument -
sett object and returns also a sett object - source or new one.
As parser just returns raw tokens parsed from threadcount source,
processors can do something useful with that parsed tokens, for example
auto-match square braces, remove empty square brace pairs, remove or change 
some tokens, convert pivot points to square braces and back, unfold all 
reflections and so on.
  
You can use any function you wish for any place where `processor` argument is 
required. However, library provides a set of built-in processors and pipeline
that allows to combine them.

To create a pipeline instance, use factory:
```javascript
var process = tartan.process([
  // List of processors  
], {
  // Options for pipeline
})
```

Options (with default values):
* `runUntilUnmodified: true` - if true, pipeline will invoke processors until
all of them will stop changing sett. See details below in this document. If set 
this option to `false`, pipeline will run each processor only once.
* `maxIterations: 2000` - this options is affected only if `runUntilUnmodified` 
is set to `true`. It determines how much iterations can perform pipeline before
stop even if processors are still modifying sett. This option is a guard that
prevents pipeline from hung up. Value `0` allows remove this limit, so pipeline 
can run infinitely.

Processors are functions that accepts sett object, but can return sett object or
`false` (or `null` or `undefined`) if they did not modify source sett. Otherwise
they should return new sett object. This convention allows pipeline to detect 
which processors are still modifying sett without a need to deeply compare object 
properties.

There are a lot of pre-built processors:
* [tartan.process.extractColors()](extract-colors.md) 
* [tartan.process.matchSquareBrackets()](match-square-brackets.md) 
* [tartan.process.mergeStripes()](merge-stripes.md) 
* [tartan.process.optimize()](optimize.md) 
* [tartan.process.pivotsToSquareBrackets()](pivots-to-square-brackets.md) 
* [tartan.process.removeEmptySquareBrackets()](remove-empty-square-brackets.md) 
* [tartan.process.removeTokens()](remove-tokens.md) 
* [tartan.process.removeZeroWidthStripes()](remove-zero-width-stripes.md) 
* [tartan.process.unfold()](unfold.md) 

To create new parsers, use information above and source codes of built-in parsers
as examples.
    