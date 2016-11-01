# Tartan

This is javascript library that allows 
to parse, validate and render tartan 
patterns. See also article in 
[Wikipedia](https://en.wikipedia.org/wiki/Tartan).
Library is distributed under the 
[MIT license](LICENSE).

## Install

To use library in your projects, run 
`npm install tartan`. Sources are available
in `/src` directory, and pre-build bundles
will be available in `/dist` directory
after installation.
 
## Usage

Add `dist/tartan.js` or `dist/tartan.min.js` to your page and use
global `tartan` variable to access library API.

To use this library in CommonJS style use `require`:
```javascript
var tartan = require('tartan');

// Now you can access library
console.log(tartan.version);
```

Since this library is frontend-oriented, some features may be unavailable
when using it on a back-end (like rendering to HTML canvas). But you can still
use parser and some renderers (like `tartan.render.format()`). Also you can try
to use [this Canvas library](https://github.com/Automattic/node-canvas) for Node.js
(I did not check it yet).

## Examples
 
Run `npm start` or open `index.html` in your favorite browser to see 
live example of some features of this library. More info can be found 
in the [docs](docs/index.md).
