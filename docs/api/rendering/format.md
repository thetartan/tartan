# Formatting sett

This renderer returns a string with formatted threadcount source.  

**Usage:**

```javascript
var render = tartan.render.format(options, process);
```

where `process` is a function for pre-processing sett.

**Options:**

* `formatters: {}` - a has table with formatting function for each token type.
Formatting function accepts token object as an argument and should return string
with tokens representation.  
* `defaultFormatter: function` - default formatting function.
* `defaultColors: {}` color map with additional colors to be included into output;
by default is empty.
* `outputOnlyUsedColors: false` - output only colors that are used by `pivot` 
and `stripe` tokens.

Render function accepts a `sett` object to format:
```javascript
console.log(render(sett));
```
