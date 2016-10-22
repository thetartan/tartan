# Converting pivot points to square brackets

This processor allows to convert pivot points to pairs of square bracket and
stripe tokens. For example, `R/20 W10 K/10` will become `[R20 W10 K10]`.
This processor tries to find matching pivot until it reaches any square brace
(opening or closing) or and of list. Unmatched pivots are called orphaned and 
may be converted to stripes.  

**Usage:** 
```javascript
var processor = tartan.process.pivotsToSquareBrackets({
  ignoreOrphanedPivots: false
});
```

**Options (with default values):**
* `ignoreOrphanedPivots: false` - allows to convert orphaned pivots to stripes
without triggering error.
 