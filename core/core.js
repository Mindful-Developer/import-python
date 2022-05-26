const { isIterable } = require("../util/util");
const {
  Complex,
  Dict,
  FrozenSet,
  Tuple,
  List,
  FileObject,
 } = require("./core-classes.js");

/**
 * Return the absolute value of a number. The argument may be an integer, a floating point number.
 * 
 * @param {number} - The number to take the absolute value of.
 * @returns {number} - The absolute value of x.
 */
function abs(x) {
  return Math.abs(x);
}

/**
 * Return True if all elements of the iterable are true.
 * 
 * @param {iterable} - The iterable to check.
 * @returns {boolean}
 */
function all(array) {
  array = [...array];
  return array.reduce((a, b) => bool(a) && bool(b));
}

/**
 * Return True if any element of the iterable is true.
 * 
 * @param {iterable} - The iterable to check.
 * @returns {boolean}
 */
function any(array) {
  array = [...array];
  return array.reduce((a, b) => bool(a) || bool(b));
}

/**
 * return a string containing a printable representation of an object, but escape the non-ASCII characters in the string.
 * 
 * @param {Object} - the object
 * @returns {string}
 */
function ascii(obj) {
  if (obj === null) {
    return "None";
  }
  if (obj === undefined) {
    return "undefined";
  }
  if (typeof obj === "string") {
    return `${obj}`;
  }
  if (
    typeof obj === "number" ||
    typeof obj === "boolean" ||
    typeof obj === "function"
  ) {
    return obj.toString();
  }
  if (obj instanceof Array) {
    return `[${obj.map((item) => ascii(item)).join(", ")}]`;
  }
  if (obj instanceof Object) {
    return `{${Object.keys(obj)
      .map((key) => `${key}: ${ascii(obj[key])}`)
      .join(", ")}}`;
  }
  return obj.toString();
}

/**
 * Convert an integer number to a binary string
 *
 * @param {number} - the number to convert
 * @returns {string}
 */
function bin(x) {
  return x.toString(2);
}

/**
 * Returns a boolean. X is converted to a boolean
 * Using a truth test.
 *
 * @param {Object} - the object to convert
 * @returns {boolean}
 */
function bool(x) {
  if (isIterable(x)) {
    return x.length > 0;
  } else {
    return !!x;
  }
}

/** This function is used to pause the debugger. */
function breakpoint() {
  debugger;
}

/**
 * Return a new array of bytes. The Uint8Array is a typed array that is used to store the bytes
 * and is a mutable sequence of integers in the range 0 to 255.
 * 
 * @param {iterable} - The iterable to convert to a Uint8Array. 
 * @returns {Uint8Array}
 */
function bytearray(data) {
  if (typeof data === "string") {
    data = Buffer.from(data);
  }
  return new Uint8Array(data);
}

/**
 * Return a tuple containing an immutable sequence of integers from 0 to 255.
 * 
 * @param {iterable} - The iterable to convert to a byte array.
 * @returns {Tuple}
 */
function bytes(data) {
  if (typeof data === "string") {
    data = Buffer.from(data);
  }
  arr = new Uint8Array(data);
  a2 = [];
  for (let item of arr.values()) {
    if (!!item) {
      a2.push(item);
    }
  }
  return tuple(a2);
}

/**
 * Return true if the given object is a function or class and false otherwise.
 * 
 * @param {Object} - The object to check. 
 * @returns {boolean}
 */
function callable(obj) {
  return typeof obj === "function";
}

/**
 * Return a string containing a character whose Unicode code is the integer i. This
 * is the inverse of ord().
 * 
 * @param {number} - The integer to convert to a character. 
 * @returns {string}
 */
function chr(i) {
  return String.fromCharCode(i);
}

/**
 * Return a complex number with the given real and imaginary parts. If a string
 * is given, it must be in the form "r [+-] xi". Ex: complex("2 + 3i").
 * 
 * @param {number | string} - The real part of the complex number or a string in the form "r [+-] xi".
 * @param {number} - The imaginary part of the complex number.
 * @returns {Complex}
 */
function complex(x, i = 0) {
  if (typeof x === "string" && !i) {
    return Complex.fromString(x);
  } else if (typeof x === "number" && typeof i === "number") {
    return new Complex(x, i);
  } else {
    throw new TypeError("complex() requires a string or 2 numbers");
  }
}

/**
 * Delete an attribute from an object. If the attribute is a method, 
 * it is removed from the object’s method table.
 * 
 * @param {Object} - The object to delete the attribute from.
 * @param {string} - The name of the attribute to delete.
 */
function delattr(obj, name) {
  delete obj[name];
}

/**
 * Return a dictionary created from the given iterable. The iterable must be an iterable containing
 * two-element iterables representing key-value pairs.
 * 
 * @param {iterable} - The iterable to create a dictionary from.
 * @returns {Dict}
 */
function dict(iterable) {
  return new Dict(iterable);
}

/**
 * Return a list of names in the given object.
 * 
 * @param {Object} - The object to get the names from. Defaults to the global object.
 * @returns {Array}
 */
function dir(obj = global) {
  let result = [];
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Return a tuple containing the integer division of x and y and the remainder.
 * 
 * @param {number} - The dividend.
 * @param {number} - The divisor.
 * @returns {Tuple} - The quotient and remainder.
 */
function divmod(num, den) {
  return tuple([Math.floor(num / den), num % den]);
}

/**
 * Return an enumerate object. It contains a pair (index, value) for each item in the array.
 * This is a generator object that returns a tuple containing the index and value of each item.
 * 
 * @param {iterable} - The iterable to enumerate. 
 * @param {number} - The starting index. Defaults to 0.
 * @param {number} - The step. Defaults to 1.
 * @returns {Tuple} The enumerate object.
 */
function* enumerate(array, start = 0, step = 1) {
  array = [...array];
  for (let i = start; i < array.length * step + start; i += step) {
    yield tuple([i, array[(i - start) / step]]);
  }
}

/**
 * Execute the given code in a new context. The code must be a string.
 * 
 * @param {string} - The code to execute.
 * @param {Object} - The global object. Defaults to the global object.
 * @param {Object} - The local object. Defaults to an empty object.
 * @returns {Object} The result of the code.
 */
function exec(code, globals = global, locals = {}) {
  let result = eval(code);
  if (result instanceof Function) {
    result = result(...Object.values(globals), ...Object.values(locals));
  }
  return result;
}

/**
 * Return a list of those items in iterable for which function(item) is true.
 * 
 * @param {function} - The function to filter by.
 * @param {iterable} - The iterable to filter.
 * @returns {Array}
 */
function filter(func, iterable) {
  iterable = [...iterable];
  return iterable.filter(func);
}

/**
 * Return a floating point number constructed from a string.
 * 
 * @param {string} - The string to convert to a floating point number.
 * @returns {number}
 */
function float(x) {
  return parseFloat(x);
}

/**
 * Convert a value to a string using the given format specifier. 
 * Replaces all {} placeholders with the corresponding argument.
 * 
 * @param {string} - String to format.
 * @param  {...any} - The arguments to format.
 * @returns {string}
 */
function format(string, ...args) {
  return string.format(...args);
}

/**
 * Returns a new frozen set containing the items in iterable.
 * 
 * @param {iterable} - The iterable to freeze.
 * @returns {FrozenSet}
 */
function frozenset(iterable) {
  return new FrozenSet(iterable);
}

/**
 * Return the value of the named attribute of object. If the attribute is not
 * found, default is returned if provided, otherwise AttributeError is raised.
 * 
 * @param {Object} - The object to get the attribute from.
 * @param {string} - The name of the attribute to get.
 * @param {any} - The default value to return if the attribute is not found.
 * @returns {any}
 * @throws {Error} If the attribute is not found and no default value is provided.
 */
function getattr(obj, name, defaultValue = undefined) {
  if (obj[name] !== undefined) {
    return obj[name];
  }
  if (defaultValue !== undefined) {
    return defaultValue;
  }
  throw new Error(`AttributeError: '${name}' not found`);
}

/**
 * Return True if the named attribute is found in the given object, otherwise False.
 * 
 * @param {Object} - The object to check the attribute in.
 * @param {string} - The name of the attribute to check.
 * @returns {boolean}
 */
function hasattr(obj, name) {
  return obj[name] !== undefined;
}

/**
 * Convert an integer to a hexadecimal string.
 * 
 * @param {number} - The integer to convert to a hexadecimal string.
 * @returns {string}
 */
function hex(x) {
  return x.toString(16);
}

/**
 * Return the integer value of x. If base is given, the string x is first converted 
 * to a number in base base. If the string cannot be converted to an integer, a TypeError is raised.
 * 
 * @param {string} - The string to convert to an integer.
 * @param {number} - The base to convert the string to. Defaults to 10.
 * @returns {number}
 */
function int(x, base = 10) {
  if (typeof x === "number") {
    if (base !== 10) {
      throw new TypeError("int() can't convert non-string with explicit base");
    }
    return Math.floor(x);
  } else if (typeof x === "string") {
    return parseInt(x, base);
  } else {
    throw new TypeError("int() argument must be a string or a number");
  }
}

/**
 * Return True if the given object is an instance of the given type.
 * 
 * @param {any} - The object to check.
 * @param {type} - The type to check against.
 * @returns {boolean}
 */
function isinstance(x, Type) {
  try {
    return typeof x === typeof Type();
  } catch (e) {
    return x instanceof Type;
  }
}

/**
 * Return True if the given object is a subclass of the given type.
 * 
 * @param {any} - The object to check.
 * @param {type} - The type to check against.
 * @returns {boolean}
 */
function issubclass(x, type) {
  return x.prototype instanceof type;
}

/**
 * Return an iterator over the given iterable.
 * 
 * @param {iterable} - The iterable to iterate over.
 * @returns {Iterator}
 */
function iter(obj) {
  const iterables = [Array, Set, Map, String];
  for (let iterable of iterables) {
    if (isinstance(obj, iterable)) {
      return obj[Symbol.iterator]();
    }
  }
  throw new TypeError("iter() argument must be iterable");
}

/**
 * Return the length of the given object.
 * 
 * @param {iterable} - The object to get the length of.
 * @returns {number}
 */
function len(array) {
  if (isIterable(array)) {
    array = [...array];
  }
  return array.length;
}

/**
 * Create a list containing the items in iterable.
 * 
 * @param {iterable} - The iterable to create a list from.
 * @returns {List}
 */
function list(iterable) {
  return new List(iterable);
}

/**
 * return the global objects.
 * 
 * @returns {Object}
 */
function locals() {
  return { ...global };
}

// map
/**
 * Return a new list containing the items returned by applying the given function 
 * to the items of the given iterable.
 * 
 * @param {function} - The function to apply to each item.
 * @param {iterable} - The iterable to map over.
 * @returns {Array}
 */
function map(func, iterable) {
  iterable = [...iterable];
  return iterable.map(func);
}

/**
 * Returns the maximum value in the given iterable.
 * 
 * @param {iterable} - The iterable to get the maximum value from.
 * @returns {number}
 */
function max(array) {
  if (isIterable(array)) {
    array = [...array];
  }
  return Math.max(...array);
}

/**
 * Return the minimum value in the given iterable.
 * 
 * @param {iterable} - The iterable to get the minimum value from.
 * @returns {number}
 */
function min(array) {
  if (isIterable(array)) {
    array = [...array];
  }
  return Math.min(...array);
}

/**
 * Return the next item from the iterator.
 * 
 * @param {Iterator} - The iterator to get the next item from.
 * @param {any} - The default value to return if the iterator is exhausted.
 * @returns {any}
 */
function next(iterator, def=undefined) {
  let result = iterator.next();
  if (result.done) {
    if (def !== undefined) {
      return def;
    } else {
      throw new Error('StopIteration');
    }
  }
  return result.value;
}

/**
 * Return the octal representation of an integer.
 * 
 * @param {number} - The integer to convert to an octal string.
 * @returns {string}
 */
function oct(x) {
  return x.toString(8);
}

/**
 * Return the Unicode code point for the given character.
 * 
 * @param {string} - The character to get the Unicode code point for.
 * @returns {number}
 */
function ord(x) {
  return x.charCodeAt(0);
}

/**
 * Return x to the power of y.
 * 
 * @param {number} - The base.
 * @param {number} - The exponent.
 * @returns {number}
 */
function pow(num, exp) {
  return Math.pow(num, exp);
}

/**
 * Print the given object to the console *no end or sep abilities in web version*.
 * 
 * @param {any} - The object to print.
 * @param  {...any} - Any additional objects to print.
 */
function print(text, ...args) {
  console.log(text, ...args);
}

// range
/**
 * Return an iterator that produces a range of integers.
 *
 * @param {number} - The stop value of the range(exclusive). Will be the start value if
 *                  the start value is given.
 * @param {number} - The start value of the range(inclusive). Defaults to 0.
 * @param {number} - The step value of the range. Defaults to 1.
 * @returns {Iterator}
 */
function range(stop, start = null, step = 1) {
  let reversed = false;
  if (step < 0) {
    reversed = true;
    stop -= step;
    start -= step;
  }
  if (start !== null) {
    [stop, start] = [start, stop];
  }
  return {
    [Symbol.iterator]() {
      return this;
    },
    next() {
      if (reversed) {
        if (start > stop) {
          start += step;
          return { done: false, value: start };
        }
        return { done: true, value: start };
      } else {
        if (start < stop) {
          start += step;
          return { value: start - step, done: false };
        }
        return { done: true, value: stop };
      }
    },
  };
}

/**
 * Returns a string containing the printable representation of the given object.
 * 
 * @param {any} - The object to convert to a string.
 * @returns {string}
 */
function repr(obj) {
  if (obj === null) {
    return "null";
  } else if (obj === undefined) {
    return "undefined";
  } else if (typeof obj === "function") {
    return obj.toString();
  } else if (typeof obj === "object") {
    return `'${obj}'`;
  } else if (typeof obj === "string") {
    return `'${obj}'`;
  } else if (typeof obj === "number") {
    return `${obj}`;
  } else if (typeof obj === "boolean") {
    return `${obj}`;
  }
}

/**
 * Reverse the order of the given iterable.
 * 
 * @param {iterable} - The iterable to reverse.
 * @returns {iterable}
 */
function reversed(iterable) {
  iterable = [...iterable];
  let result = [];
  for (let item of iterable) {
    result.unshift(item);
  }
  return result;
}

/**
 * Return the rounded value of x to the given number of decimal places.
 * 
 * @param {number} - The number to round.
 * @param {number} - The number of decimal places to round to.
 * @returns {number}
 */
function round(num, ndigits = 0) {
  return Math.round(num * Math.pow(10, ndigits)) / Math.pow(10, ndigits);
}

/**
 * Create a set from the given iterable.
 * 
 * @param {iterable} - The iterable to create a set from.
 * @returns {Set}
 */
function set(array) {
  array = [...array];
  return new Set(array);
}

/**
 * Set the value of an attribute of an object. If the attribute is not present,
 * it will be added.
 * 
 * @param {object} - The object to set the attribute on.
 * @param {string} - The name of the attribute to set.
 * @param {any} - The value to set the attribute to.
 */
function setattr(obj, name, value) {
  obj[name] = value;
}

/**
 * Return a slice of the given iterable.
 * 
 * @param {iterable} - The iterable to slice.
 * @param {number} - The start index of the slice.
 * @param {number} - The stop index of the slice.
 * @param {number} - The step value of the slice.
 * @returns {iterable}
 */
function slice(array, start, stop, step = 1) {
  array = [...array];
  let result = [];
  for (let i = start; i < stop; i += step) {
    result.push(array[i]);
  }
  return result;
}

/**
 * Return a sorted list of the given iterable.
 * 
 * @param {iterable} - The iterable to sort.
 * @param {function} - The function to use to sort the iterable.
 * @returns {iterable}
 */
function sorted(iterable, key = undefined, reverse = false) {
  iterable = [...iterable];
  let result = [];
  for (let item of iterable) {
    result.push(item);
  }
  if (typeof key === "boolean") {
    reverse = key;
    key = undefined;
  }
  result.sort(key);
  if (reverse) {
    result.reverse();
  }
  return result;
}

/**
 * Return the string representation of the given object.
 * 
 * @param {any} - The object to convert to a string.
 * @returns {string}
 */
function str(x) {
  if (typeof x === "string") {
    return x;
  } else {
    return x.toString();
  }
}

/**
 * Return the sum of the given iterable.
 * 
 * @param {iterable} - The iterable to sum.
 * @returns {number}
 */
function sum(array) {
  array = [...array];
  return array.reduce((a, b) => a + b, 0);
}

/**
 * Return a tuple of the given iterable.
 * 
 * @param {iterable} - The iterable to create a tuple from.
 * @returns {Tuple}
 */
function tuple(iterable) {
  return new Tuple(iterable);
}

/**
 * Return the type of the given object.
 * 
 * @param {any} - The object to get the type of.
 * @returns {string}
 */
function type(obj) {
  return typeof obj;
}

/**
 * Return a list of tuples, where the i-th tuple contains the i-th element from
 * each of the argument sequences or iterables.
 * 
 * @param  {...any} - The iterables to zip.
 * @returns {iterable}
 */
function zip(...arrays) {
  arrayCopy = list([]);
  for (arr of arrays) {
    arrayCopy.append(list([...arr]));
  }
  return {
    [Symbol.iterator]() {
      return this;
    },
    next() {
      if (!this.value) {
        this.value = [];
        const arrayLengths = arrayCopy.map((a) => a.length);
        const shortestArray = arrayLengths.reduce((a, b) => (a < b ? a : b));
        const arraysSum = shortestArray * arrayCopy.length;

        for (let i = 0; i < shortestArray; i++) {
          let temp = [];
          for (let j = 0; j < arrayCopy.length; j++) {
            temp.push(arrayCopy[j][i]);
          }
          this.value.push(tuple(temp));
        }
      }
      if (this.value.length > 0) {
        let result = this.value.shift();
        return { value: result, done: false };
      }
      return { done: true, value: null };
    },
  };
}

module.exports = {
  Complex,
  Dict,
  FrozenSet,
  Tuple,
  List,
  abs,
  all,
  any,
  ascii,
  bin,
  bool,
  breakpoint,
  bytearray,
  bytes,
  callable,
  chr,
  complex,
  delattr,
  dict,
  dir,
  divmod,
  enumerate,
  exec,
  False: false,
  filter,
  float,
  format,
  frozenset,
  getattr,
  hasattr,
  hex,
  int,
  isinstance,
  issubclass,
  iter,
  len,
  list,
  locals,
  map,
  max,
  min,
  next,
  None: null,
  oct,
  open,
  ord,
  pow,
  print,
  range,
  repr,
  reversed,
  round,
  set,
  setattr,
  slice,
  sorted,
  str,
  sum,
  True: true,
  tuple,
  type,
  zip,
};
