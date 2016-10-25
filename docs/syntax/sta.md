# Syntax by Scottish Tartans Authority

## Palette

Palette is stored apart from threadcount.
Colors are can be separated by whitespaces or not 
separated. Each palette entry should follow the format:
```bnf
<color> ::= { a..z, A..Z } '=' 6 * { 0..9, a..f, A..F } 
  [ [ ';' ] { <any character> } ] ';'
```

## Threadcount and reflections

Threadcount entries are using common format:
```bnf
<entry> ::= { a..z, A..Z } { 0..9 }
```

Entries can be separated by whitespaces, or not separated.

Reflections are usually defined with `/` between name and count part (called pivots):
```bnf
<entry> ::= { a..z, A..Z } '/' { 0..9 }
``` 

Only first and last entry can be marked as pivots, and if one ot them is a pivot -
another should also be a pivot.

But, in practice, this is not always the case: reflection can be 
set as some external flag. Weird.

## Different warp and weft

If warp and weft have different threadount, their threadounts are 
separated by a dot `.` character:
```
B24 W4 B24 R2 . K24 G24 W2
```

## Examples

Repeating sett:
```
B24 W4 B24 R2 K24 G24 W2
```

Reflective sett:
```
B/24 W4 B24 R2 K24 G24 W/2
```

Palette: 
```
B=2C2C80BLUE;G=006818;GREEN; R=C80000RED;K=000000;W=FFFFFF;
```
