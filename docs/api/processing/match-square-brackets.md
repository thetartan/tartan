# Auto-matching square brackets

This processor allows to automatically open and close
unmatched square brackets. New opening square brackets are adding 
at the beginning of the token list, and new closing ones - at 
the ending of the list respectively.  

**Usage:** 
```javascript
var processor = tartan.process.matchSquareBrackets();
```
 