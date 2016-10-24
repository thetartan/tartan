# Canvas renderer

This renderer allows do get some metrics for sett.

**Usage:**

```javascript
var render = tartan.render.metrics(options, process);
```
where `options` and `process` are the same as for 
[tartan.rendering.pattern()](pattern.md) renderer as metrics renderer 
is internally using it.

Render function accepts a `sett` object to format:
```javascript
console.log(render(sett));
```
