# Tartan Definition Format

# Palette

Palette is included into threadount. Entries are usually placed from a newline
each, but may be not separated at all. Entry format:
```bnf
<color> ::= { a..z, A..Z } '#' 6 * { 0..9, a..f, A..F }
```

Palette is always placed before threadcount. Between palette and threadcount
can be placed opening square bracket: `[`.

## Threadcount and reflections

Threadcount entries are using common format:
```bnf
<entry> ::= { a..z, A..Z } { 0..9 }
```

Entries can be separated by whitespaces, or not separated.

To indicate that threadcount is reflective, all entries except first and last
are captured into parenthesis. The first and last entry are pivots.

## Different warp and weft sequences
 
Different warp and weft sequences should be separated by a newline:
```
B#2C2C80 
G#006818 
R#C80000 
K#000000 
W#FFFFFF
B24 W4 B24 R2 
K24 G24 W2
``` 

## Examples

Repeating sett:
```
B#2C2C80 
G#006818 
R#C80000 
K#000000 
W#FFFFFF
B24 W4 B24 R2 K24 G24 W2
```

Another variant:
```
B#2C2C80G#006818R#C80000K#000000W#FFFFFF[B24 W4 B24 R2 K24 G24 W2
```

Reflective sett:
```
B24 (W4 B24 R2 K24 G24) W2
```