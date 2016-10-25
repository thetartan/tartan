# Unfolding sequence

This processor allows to split warp and weft sequence if they are separated by
specific token. 

**Usage:** 
```javascript
var processor = tartan.process.splitWarpAndWeft(function(token) {
  // return `true` if token is a delimiter between warp and weft
});
```

**Options**
Processor requires a predicate to know which token is a delimiter between
warp and weft sequence. Predicate is a function that accepts token and should
return `true` if this token is a delimiter between warp and weft. If there are 
more than one delimiter - next delimiters will be ignored and removed from list. 
 