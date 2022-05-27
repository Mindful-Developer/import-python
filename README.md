# import-python
Python's built-in functions, classes and (some) modules ported to JavaScript. Most are pretty close to the same functionality as the python version of the function or class. 

**not web friendly - please use import-python-web for web projects**

This package is under active development.

Completed modules:
  - core (base python without importing)
  - random
  - itertools
  - string

Full documentation can be located at:
https://import-python.readthedocs.io/en/latest/index.html


# Usage

## Installation:
```
npm install import-python
```

## QuickStart:
To import python functions, you can add this to the top of your code:
```js
const { py_import_star, py_import } = require("import-python")

// Import everything from a module into global variables
py_import_star("core")

// Load specific functions, classes or modules (supports destructuring)
const random = py_import("random")


// example usage
for (let [i, number] of enumerate(range(10, 20, 2))) {
  print(`(${i}:${number})`, end=", ")
}

print(random.randint(1, 5))
```


# Core
  - String methods (built into existing String class)
  - Complex,
  - Dict,
  - FileObject,
  - FrozenSet,
  - List,
  - Tuple,
  - abs,
  - all,
  - any,
  - assert,
  - ascii,
  - bin,
  - bool,
  - breakpoint,
  - bytearray,
  - bytes,
  - callable,
  - chr,
  - complex,
  - delattr,
  - dict,
  - dir,
  - divmod,
  - enumerate,
  - exec,
  - filter,
  - float,
  - format,
  - frozenset,
  - getattr,
  - hasattr,
  - hex,
  - input,
  - int,
  - isinstance,
  - issubclass,
  - iter,
  - len,
  - list,
  - locals,
  - map,
  - max,
  - min,
  - next,
  - oct,
  - open,
  - ord,
  - pow,
  - print,
  - raise
  - range,
  - repr,
  - reversed,
  - round,
  - set,
  - setattr,
  - slice,
  - sorted,
  - str,
  - sum,
  - tuple,
  - type,
  - zip,

# Random:
  - Random,
  - seed,
  - random,
  - randint,
  - randrange,
  - choice,
  - choices,
  - sample,
  - shuffle,
  - uniform

# Itertools:
  - accumulate,
  - chain,
  - combinations,
  - combinations_with_replacement,
  - compress,
  - count,
  - cycle,
  - dropwhile,
  - filterfalse,
  - groupby,
  - islice,
  - pairwise,
  - permutations,
  - product,
  - repeat,
  - starmap,
  - takewhile,
  - tee,
  - zip_longest

# String
  - ascii_letters,
  - ascii_lowercase,
  - ascii_uppercase,
  - digits,
  - hexdigits,
  - octdigits,
  - punctuation,
  - whitespace,
  - printable  