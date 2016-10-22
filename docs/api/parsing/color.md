# Color parser

Allows to parse color definitions. Syntax:
```bnf
<letter> ::= 'a'..'z', 'A'..'Z'
<hex> ::= '0'..'9', 'a'..'f', 'A'..'F'
<name> ::= { <letter }
<short color> ::= '#' 3 * { <hex> }
<long color> ::= '#' 6 * { <hex> }
<color> ::= <name> '=' (<short color> | <long color>) ';' 
```

Usage: 
```javascript
var parser = tartan.parse.color();
```

Color name and value are normalized: name is converted
to upper-case, and value is converted to lower-case end
expanding to long form.

Returned token for string `"r=#f00;`:
```json
{
  "type": "color",
  "name": "R",
  "color": "#ff0000"
}
```
