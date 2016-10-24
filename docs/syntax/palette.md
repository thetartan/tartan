# Define a palette

Palette is a set of named colors which are used in
threadcount. Different sources are using different formats
for palette: it can be included into threadcount or loaded from
external source; colors usually have formats based on html hexadecimal
notation, but with some variations. Generally, color definition consists of
color name (one or more latin letter) followed by color value. Color value
can have long (6 digits) or short (3 digits) format; sometimes html color names
are used; also sometimes optional description is added.

Possible variants: 
```
<name> '=' <value>  
<name> '=' <value> ';'  
<name> '=' <value> <comment> ';'
<name> '=' <value> ';' <comment> ';'

<name> '#' <value>  
<name> '#' <value> ';'  
<name> '#' <value> <comment> ';'
<name> '#' <value> ';' <comment> ';'
``` 

Several color definitions are also combined in several ways: each color in new line;
separated by space or other delimiter; not separated at all.

If some color is not mentioned in the palette, it has to be one of default or
predefined colors.
 