# Canvas renderer

This renderer allows do display sett using 
[html canvas](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas)
element.

**Usage:**

```javascript
var render = tartan.render.canvas(sett, options, process);
```

where `sett` is a sett object and `options` and `process` are 
the same as for [tartan.rendering.pattern()](pattern.md)
renderer as canvas renderer is internally using it.

Render function accepts two arguments: `canvas` and `offset`.
`canvas` is a html canvas DOM node, and offset is an object that specifies
offset for warp and weft (in threads): `{x: 0, y: 0}`. Example:

```javascript
var offset = render(document.querySelector('canvas'), {x: 10, y: 20})
```

Render function return actual offset that was using for rendering. Tartan
pattern has a period when it repeats, and offset and be simplified by extracting
that period as much times as possible.   
