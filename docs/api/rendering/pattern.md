# Generating raw sett pattern

This renderer returns an array created from with flat list of tokens.
Each item is a pair of `[color, count]` elements where `color` is a html color
in long format (i.e. `#ff0000`) and `count` is an integer number greater than zero.
This representation may be useful when implementing other renderers. 
[tartan.render.canvas()](canvas.md) internally uses it.    

**Usage:**

```javascript
var render = tartan.render.pattern(options, process);
```

where `process` is a function for pre-processing sett.

**Options:**

* `skipUnsupportedTokens: false` - renderer supports only `stripe` and `pivot`
tokens. Other tokens can be skipped, or renderer can throw an exception.
* `skipInvalidColors: false` - if `true` - renderer will silently skip stripes
which colors cannot be found in map or has invalid format. With `false` value
renderer will throw an exception.
* `defaultColors: {}` - default color map. Defaults to `tartan.defaults.colors`.

Render function accepts a `sett` object:
```javascript
console.log(render(sett));
```
