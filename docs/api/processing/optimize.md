# Optimizing sequence

This is very heavy processor that allows to perform set of optimizations.
Internally it consists of several other processors:
```javascript
var processor = tartan.process([
  tartan.process.removeTokens(tartan.defaults.insignificantTokens),
  
  // Added if options.extractColors = true
  tartan.process.extractColors({
    keepColorTokens: false
  }),
  
  // This two are added if forceSquareBrackets == true
  tartan.process.pivotsToSquareBrackets(),
  tartan.process.parenthesisToSquareBrackets(),
 
  tartan.process.matchSquareBrackets(),
  tartan.process.removeEmptySquareBrackets(),
  tartan.process.mergeStripes()
], {
  runUntilUnmodified: true
});
```

**Options (with default values):**
* `extractColors: true` - extract colors and remove color tokens (makes 
optimizations more effective).
* `forceSquareBrackets: true` - Force converting of pivots and parenthesis to 
square brackets. This makes optimizations for square brackets more effective.  

Please refer to docs for that processors for more info.
