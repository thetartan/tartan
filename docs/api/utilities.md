# Utilities, helpers and presets

## tartan.version

String that contains current version of library (same as in `package.json`).
For example, `2.0.0`.

## tartan.defaults

Contains some presets used by processors, renderers, etc.

* `tartan.defaults.weave.plain` - twill 1x1.
* `tartan.defaults.weave.serge` - twill 2x2 (used as default value in
[tartan.parse()](parsing/index.md)) and [tartan.render.canvas()](rendering/canvas.md)).
* `tartan.defaults.colors` - predefined color map; is used as by default by
renderers ans some processors.
* `tartan.defaults.insignificantTokens` - list of types of tokens that can be 
safely removed from a token list. If you wish to detect such tokens - use this list
instead of hard-coding conditions. Is used as default option in 
[tartan.process.removeTokens()](processing/remove-tokens.md).
 
## tartan.helpers 

Some helpers that may be useful in your application.

### tartan.helpers.repaint

Allows to optimize repaint operations using 
[window.requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) 
API. 

**Usage:**

```javascript
var repaint = tartan.helpers.repaint(callback);
```

`callback` is a function that should perform repainting stuff. It may receive
one argument - context, passed to `repaint()` on invoke.

To request repaint, use `repaint(context)`. `context` is optional and will be
passed to repaint callback. Subsequent calls to `repaint()` will not register 
new callbacks until next `animation frame` occurs. This means that if you call
`repaint()` several times until next `animation frame` - your repaint callback
will be called only once (with context passed to last `repaint()` call).    

**Example:** 

```javascript
var repaint = tartan.helpers.repaint(function(context) {
  console.log('Repainting', context);
});

repaint('context #1');
repaint('context #2');

// Output:
// > "Repainting", "context #2"
```

Another example can be found in `index.html` file that is located in the root
of this repository.
