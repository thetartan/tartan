# Literal parser

Allows to extract fixed substring as a token. 

**Usage:** 
```javascript
var parser = tartan.parse.literal({
  string: 'example',
  ignoreCase: true
});
```

**Options (with default values):**
* `string: ''` - string to parse. If empty - parser will not parse anything.
* `ignoreCase: false` - if true, `string: 'example'` will match word `example`
in any case: `Example`, `EXAMPLE` and so on.

Returned token for string `'['`:
```json
{
  "type": "literal",
  "value": "Example"
}
```
