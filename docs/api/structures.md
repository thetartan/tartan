# Structures used by API

## Token

Common format:
```javascript
var token = {
  type: 'invalid', // string; type of token (i.e. 'stripe', 'pivot', 'invalid', etc.)
  value: 'token value', // string; parsed fragment
  source: '', // string; original parsed source; is filled automatically
  offset: 0, // integer; token's position; is filled automatically if not specified
  length: 0 // integer; token's length; is filled automaticaly as token.value.length if not specified       
}
```

Color definition:
```javascript
var token = {
  type: 'color', // string; always 'color'
  name: 'R', // string; name of color
  color: '#ff0000', // string; color in html format
  source: '', // same as for common format
  offset: 0, // same as for common format
  length: 0 // same as for common format             
}
```

Stripe and pivot point:
```javascript
var token = {
  type: 'stripe', // string; 'stripe' or 'pivot'
  name: 'R', // string; reference to color
  count: 10, // integer; count of threads 
  source: '', // same as for common format
  offset: 0, // same as for common format
  length: 0 // same as for common format      
}
```

## Sett

```javascript
var sett = {
  colors: {}, // object; color map (should be normalized)
  weave: [2, 2], // array of two integers - number of warp threads to pass weft over and under
  warp: [], // array of tokens
  weft: [], // array of tokens          
}
```
