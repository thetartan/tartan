# Rendering

## Description

- `tartan.render.format(options)` - factory, returns
renderer function with prototype `function(object sett): string`. 
Can be used to convert `sett` to a pretty-formatted string 
(threadcount). `sett` is an object returned by parser (see [parsing docs](parse.md)).
Available options:

  - `outputOnlyUsedColors: false` - add all defined colors or only used 
  in stripes/pivot point definitions.
  
  - `formatter: {...}` - map with functions that will be used to
  format specific tokens. This renderer already supports 
  `color`, `pivot` and `stripe` tokens. You can re-define or
  add support for other tokens. Formatter should have prototype:
  `function(object token): string`.
  
  - `defaultFormatter: function` - formatter that will be used 
  for tokens that were not defined in `formatter` option. Should have 
  the same prototype. Default implementation just returns 
  `token.value` which is suitable for tokens like `square-braces`,
  `invalid`, `whitespace`.

- `tartan.render.pattern(processors, options)` - factory, returns
renderer function with prototype `function(object sett): string`.  
This renderer returns a array with pairs `[color, count]` (color is 
a normalized color in html format and count is a positive integer). 
This render can be used to unfold all reflections and prepare sett to render by 
`tartan.render.canvas()` or other similar purposes. Also notice that all 
color definitions will be converted to actual colors (i.e. `R` will be replaced 
with `#ff0000`). Processors is an array with function that will be used 
to pre-process tokens ([read more](process.md)). Available options:

  - `skipUnsupportedTokens: false` - this renderer can process only tokens that 
  describe stripes - `stripe` and `pivot`. This options allows to specify what 
  to do with unsupported tokens - throw an exception or silently skip.
  
  - `skipInvalidColors: false` - this options allows to specify what to do 
  when color definition cannot be mapped to color value neither using color map 
  from sett not default color map. Default behavior is to throw exception, but 
  renderer can also silently ignore such definitions.
  
  - `defaultColors: tartan.defaults.colors` - normalized color map with 
  default colors. 

- `tartan.render.canvas(options)` - the most useful renderer. It allows 
to display sett in visual form using [html canvas](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas) 
element. This renderer is a bit different that others - sett should be 
provided when constructing renderer (instead of passing it each time), also it 
should be already flattened (say, by `tartan.render.pattern()`). It is needed for 
better drawing performance. Also this renderer accepts sett twice: one will be used 
to draw warp an another - to draw weft lines. Usually they are the same, so you can
pass the same array twice. Also you can specify weaving configuration: how much lines 
should be _above_ and _below_ warp lines. Default value is `[2, 2]` - a classic 
[serge](https://en.wikipedia.org/wiki/Serge_(fabric)) weave 
([2x2 twill](https://en.wikipedia.org/wiki/Twill)). Example: 
`var renderer = tartan.render.canvas({warp: [['#ff0000', 10], ['#000000', 10]], weft: [['#ff0000', 10], ['#000000', 10]]});`.
The only argument accepted by renderer is a canvas DOM node: `renderer(document.querySelector('canvas'))`;  
Also renderer instance has useful method that can be used to specify offsets:
`renderer.offset(x, y)` or `renderer.offset({x: x, y:y })` - for example please refer to
 library's example files.

## Example

Assume that we already have a `sett` variable returned by a [parser](parse.md):

```javascript
/* var sett = {colors: {...}, tokens: [...]}; */

// Prepare pattern
var patternRenderer = tartan.render.pattern();
var pattern = patternRenderer(sett);
  
var canvasRenderer = tartan.render.canvas({
  warp: pattern,
  weft: pattern,
  weave: [2, 2] // Another examples: [1, 1], [3, 5], etc.
});

var canvasElement = document.querySelector('canvas');
canvasRenderer.offset(10, 20);
canvasRenderer(canvasElement);
```
