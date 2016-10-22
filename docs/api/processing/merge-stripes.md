# Merging stripes with the same colors

This processor allows to merge sequences of stripe tokens with the same color
name into single token. For example, `R10 R20` will become `R30`.  

**Usage:** 
```javascript
var processor = tartan.process.mergeStripes();
```
 