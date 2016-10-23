# Stripe parser

Allows to parse stripe definitions. Syntax:
```bnf
<letter> ::= 'a'..'z', 'A'..'Z'
<digit> ::= '0'..'9'
<name> ::= { <letter }
<number> ::= { <digit> }
<stripe> ::= <name> <number> 
```

**Usage:** 
```javascript
var parser = tartan.parse.stripe({
  allowZeroWidthStripes: false
});
```

Name is converted to upper-case and number is converted
to `integer` value.

Returned token for string `'r20'`:
```json
{
  "type": "stripe",
  "name": "R",
  "count": 20
}
```

**Options (with default values):**
* `allowZeroWidthStripes: false` - if set to `true` - parser will return
tokens with `count = 0`; otherwise it will throw an exception.
* `allowLongNames: true` - if set to true - stripe name can contain more than
one character.
