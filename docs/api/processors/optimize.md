# Optimizing sequence

This is very heavy processor that allows to perform set of optimizations.
Internally it consists of several other processors:
```javascript
var processor = tartan.process([
  tartan.process.removeTokens(tartan.defaults.insignificantTokens),
  tartan.process.removeEmptySquareBrackets(),
  tartan.process.mergeStripes(),
  tartan.process.matchSquareBrackets()
], {
  runUntilUnmodified: true
});
```

Please refer to docs for that processors for more info.
