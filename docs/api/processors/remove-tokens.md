# Removing some tokens

This processor allows to remove tokens from list by set of types or 
using function to check each token.

**Usage:** 
```javascript
var processor = tartan.process.removeTokens([
  tartan.utils.TokenType.invalid
]);

// or

var processor = tartan.process.removeTokens(
  function(token) {
    // return `true` to remove token
    return tartan.utils.isInvalid(token);
  }
);
```

**Useful tip:**
`tartan.defaults.insignificantTokens` contains an array with types of
tokens that can be safely removed from list, such as invalid tokens and
whitespaces.
