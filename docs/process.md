# Processing

## Overview

Sett returned by [parser](parse.md) is not very useful - it's just a list of 
tokens that can be used only to re-assemble original source back. Really useful 
stuff is performed by _processors_: functions that can transform that list of 
tokens. For example, processors can auto-match square braces, remove empty 
square brace pairs, remove or change some tokens, convert pivot points to square 
braces and back, unfold all reflections and so on.
 
Processor function should have next prototype: ```function(array tokens): array|false```
and follow this convention:

1. processor should never modify source array; instead it should create new array 
and put modified data there.

2. if processor has performed some changes with source tokens, it should return 
modified array; otherwise it should return its argument or value that can be 
evaluated as false (`null`, `false`, `undefined`). This condition is required 
to avoid infinite loops: processors may be run continuously until it stops 
modifying tokens.  

# Description

- `tartan.process.removeTokens(array tokensToRemove)`. Filters out tokens with 
specified types. Is useful to remove whitespace and invalid tokens, etc.
 
- `tartan.process.pivotsToSquareBraces(options)` - allows to convert pivot points
to braces + stripes definitions. Available options:
 
  - `skipOrphanedPivots: false`. If there are pivots without matching pair, 
  this processor can throw an exception or silently convert them to stripes.
   
- `tartan.process.unfold(options)` - allows to unfold all reflections into flat 
list of stripes. Internally it uses `tartan.process.pivotsToSquareBraces()` and 
therefore has the same options.
   
- `tartan.process.optimize()` - heavy processor completely without options :smile:
It will:

  - remove `invalid` and `whitespace` tokens;
  
  - remove zero-width stripes;
      
  - remove empty square braces (`[]` in threadcount);
        
  - merge stripes with same colors: `R10 R20` will become `R30`; but **will not**
  merge stripe with pivot - this will break tartan pattern;
            
  - auto-match square braces.             
