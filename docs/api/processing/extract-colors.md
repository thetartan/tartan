# Extracting colors

This processor allows to extract colors from list of 
tokens into has table.

**Usage:** 
```javascript
var processor = tartan.process.extractColors({
  keepColorTokens: false
});
```

**Options (with default values):**
* `keepColorTokens: false` - if `true`, then processor will not remove color
tokens from list of tokens.
