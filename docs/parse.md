# Parsing

## Description

To parse a string that describes tartan pattern  
use `tartan.parse()` factory: `tartan.parse(parsers, processors, options)`.
It requires three arguments: 

- `parsers` is an array of functions. Each function 
accepts source string and offset and should return token
object if it can be parsed from specified offset, or 
value that can be cast to false (`null`, `false`, `undefined`).
parser prototype: `function(string source, int offset): object|null`.

- `processors` is an array of functions. Parser will run
each function on set of tokens after parsing. For more details 
see [Processing](process.md) docs.

- `options` is an object with additional options.
Currently these options are supported:
  
  - `failOnInvalidTokens: bool`. Defaults to `true`. If true - 
  parser will throw an exception for invalid tokens. If false -
  all invalid tokens will be parsed and added to results array.
  
Parser can throw some exceptions - it depends on options for 
parser and its modules. On success parser returns _sett_ object:
```json
{
  "colors": {
    "R": "#ff0000",
    "Y": "#ffff00"
  },
  "tokens": [] 
}
```

where `colors` contains normalized color map (when each key is in 
upper case and each color value is in lower case and has six 
hexadecimal digits) and `tokens` is an array that contains all tokens 
except of colors.
  
## Available parsers
  
- `tartan.parser.color()` Use it to parse color 
definitions (like `R#f00` or `T#603311`).

- `tartan.parse.stripe()` Use it to parse stripe 
definitions (like `R10`).
   
- `tartan.parse.pivot()` Use it to parse pivots - 
stripes that are markers for mirror sequence.

- `tartan.parse.squareBraces()` Use it to parse 
square braces (supports both opening and closing brace).

## Example

```javascript
var parser = tartan.parse([
  tartan.parse.color(),
  tartan.parse.stripe(),
  tartan.parse.pivot()
], [], {
  failOnInvalidTokens: false
});

console.log(parser('R#f00 K#000 R/10 K4 R/4'));
```

Output:

```json
{
  "colors": {
    "R": "#ff0000",
    "K": "#000000"
  },
  "tokens": [
    {
      "token": "whitespace",
      "value": " ",
      "length": 1,
      "offset": 5,
      "source": "R#f00 K#000 R/10 K4 R/4"
    },
    {
      "token": "whitespace",
      "value": " ",
      "length": 1,
      "offset": 11,
      "source": "R#f00 K#000 R/10 K4 R/4"
    },
    {
      "token": "pivot",
      "name": "R",
      "count": 10,
      "length": 4,
      "offset": 12,
      "source": "R#f00 K#000 R/10 K4 R/4"
    },
    {
      "token": "whitespace",
      "value": " ",
      "length": 1,
      "offset": 16,
      "source": "R#f00 K#000 R/10 K4 R/4"
    },
    {
      "token": "stripe",
      "name": "K",
      "count": 4,
      "length": 2,
      "offset": 17,
      "source": "R#f00 K#000 R/10 K4 R/4"
    },
    {
      "token": "whitespace",
      "value": " ",
      "length": 1,
      "offset": 19,
      "source": "R#f00 K#000 R/10 K4 R/4"
    },
    {
      "token": "pivot",
      "name": "R",
      "count": 4,
      "length": 3,
      "offset": 20,
      "source": "R#f00 K#000 R/10 K4 R/4"
    }
  ]
}
```
