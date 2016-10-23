# Color parser

Allows to parse color definitions. Syntax:
```bnf
<letter> ::= 'a'..'z', 'A'..'Z'
<hex> ::= '0'..'9', 'a'..'f', 'A'..'F'
<name> ::= { <letter }
<short color> ::= 3 * { <hex> }
<long color> ::= 6 * { <hex> }
<comment> ::= { <any symbol> }
<color> ::= <name> ['='] ['#'] (<short color> | <long color>) 
  [ [';'] <comment> ] [';']  
```

**Usage:** 
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

**Options (with default values):**

* `allowLongNames: true` - name can have more than one character.
* `valueAssignment: 'allow'` - how to parse '=' symbol between name and value.
Possible values: 'none', 'allow', 'require'.
* `colorPrefix: 'require'` - parse '#' as color prefix: 'none', 'allow', 'require'.
* `allowShortFormat: true` - color can be in short format (i.e. `#fc0`)
* `comment: 'none'` - is comment after color value allowed: 'none', 'allow', 'require'
* `semicolonBeforeComment: 'require'` - parse semicolon between value and 
comment: 'none', 'allow', 'require'. Ignored if `comment` is `none`. 
* `semicolonAtTheEnd: 'allow'` - parse semicolon at the end of color 
definition: 'none', 'allow', 'require'

If comment is allowed (`allow` or `require`) and may be not separated from color
by a semicolon (`semicolonBeforeComment` is `none` or `allow`), 
`allowShortFormat` is forced to `false`.

If `colorPrefix` is 'none', `valueAssignment` is forced to `require`.
