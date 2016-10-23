# Pivot parser

Allows to parse pivot definitions. Syntax:
```bnf
<letter> ::= 'a'..'z', 'A'..'Z'
<digit> ::= '0'..'9'
<name> ::= { <letter }
<number> ::= { <digit> }
<pivot> ::= <name> '/' <number> 
```

**Usage:** 
```javascript
var parser = tartan.parse.pivot({
  allowZeroWidthStripes: false
});
```

Name is converted to upper-case and number is converted
to `integer` value.

Returned token for string `'r/20'`:
```json
{
  "type": "pivot",
  "name": "R",
  "count": 20
}
```

**Options (with default values):**

* `allowZeroWidthStripes: false` - if set to `true` - parser will return
tokens with `count = 0`; otherwise it will throw an exception.
* `allowLongNames: true` - if set to true - pivot name can contain more than
one character.
