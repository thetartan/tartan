# Parenthesis parser

Allows to parenthesis. Syntax:
```bnf
<bracket> ::= '(' | ')' 
```

**Usage:** 
```javascript
var parser = tartan.parse.parenthesis();
```

Returned token for string `'('`:
```json
{
  "type": "parenthesis",
  "value": "("
}
```
