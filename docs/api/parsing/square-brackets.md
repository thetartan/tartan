# Square brackets parser

Allows to parse square brackets that are used to make reflecting block. Syntax:
```bnf
<bracket> ::= '[' | ']' 
```

**Usage:** 
```javascript
var parser = tartan.parse.squareBrackets();
```

Returned token for string `'['`:
```json
{
  "type": "square-bracket",
  "value": "["
}
```
