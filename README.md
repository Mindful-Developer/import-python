# import-python
Python's built-in functions and classes ported to JavaScript + the random library. Most are pretty close to the same functionality as the python version of the function or class.

To import all python functions, you can can add this to the top of your code:
```js
const { py_import_star, py_import } = require("import-python")

// Import everything from a module into global variables
py_import_star("core")

// Load specific functions, classes or modules
const { random } = py_import("random")


for (let [i, number] of enumerate(range(10, 20, 2))) {
  print(`(${i}:${number})`, end=", ")
}
```

# Core Classes
  - Complex,
  - Tuple,
  - List,
  - Dict,
  - FrozenSet,
  - FileObject,
  
# Core Functions
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
  - help,
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
  - raise,

# Random:
  - Random,
  - random