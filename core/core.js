const util = require("util");
const os = require("os");
const child_process = require("child_process");
const { isIterable } = require("../util/util");
const {
  Complex,
  Dict,
  FrozenSet,
  Tuple,
  List,
  FileObject,
 } = require("./core-classes.js");

function abs(num) {
  return Math.abs(num);
}

function all(array) {
  array = [...array];
  return array.reduce((a, b) => bool(a) && bool(b));
}

function any(array) {
  array = [...array];
  return array.reduce((a, b) => bool(a) || bool(b));
}

function assert(condition, message, expected = true) {
  if (condition !== expected) {
    throw new Error(message || "Assertion failed");
  }
}

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

function bin(x) {
  return x.toString(2);
}

function bool(x) {
  if (isIterable(x)) {
    return x.length > 0;
  } else {
    return !!x;
  }
}

function breakpoint() {
  debugger;
}

function bytearray(data) {
  if (typeof data === "string") {
    data = Buffer.from(data);
  }
  return new Uint8Array(data);
}

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

function callable(obj) {
  return typeof obj === "function";
}

function chr(x) {
  return String.fromCharCode(x);
}

function complex(x, i = 0) {
  if (typeof x === "string" && !i) {
    return Complex.fromString(x);
  } else if (typeof x === "number" && typeof i === "number") {
    return new Complex(x, i);
  } else {
    throw new TypeError("complex() requires a string or 2 numbers");
  }
}

function delattr(obj, name) {
  delete obj[name];
}

function dir(obj = global) {
  let result = [];
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      result.push(key);
    }
  }
  return result;
}

function dict(iterable) {
  return new Dict(iterable);
}

function divmod(num, den) {
  return tuple([Math.floor(num / den), num % den]);
}

function enumerate(array, start = 0, step = 1) {
  array = [...array];
  return {
    [Symbol.iterator]() {
      return this;
    },
    next() {
      if (!this.value) {
        this.value = start;
      }
      if (this.value < start + step * array.length) {
        this.value = this.value + step;
        return {
          value: tuple([
            this.value - step,
            array[(this.value - step - start) / step],
          ]),
          done: false,
        };
      }
      return { done: true, value: null };
    },
  };
}

function exec(code, globals = global, locals = {}) {
  let result = eval(code);
  if (result instanceof Function) {
    result = result(...Object.values(globals), ...Object.values(locals));
  }
  return result;
}

function filter(func, iterable) {
  iterable = [...iterable];
  return iterable.filter(func);
}

function float(x) {
  return parseFloat(x) / 1;
}

function format(string, ...args) {
  let result = string;
  for (let i = 0; i < len(args); i++) {
    result = result.replace(`{}`, args[i]);
  }
  return result;
}

function frozenset(iterable) {
  return new FrozenSet(iterable);
}

function getattr(obj, name, defaultValue = undefined) {
  if (obj[name] !== undefined) {
    return obj[name];
  }
  if (defaultValue !== undefined) {
    return defaultValue;
  }
  throw new AttributeError(`${name}`);
}

function hasattr(obj, name) {
  return obj[name] !== undefined;
}

function help(obj) {
  if (obj === undefined) {
    return "";
  }
  if (typeof obj === "function") {
    return obj.toString();
  }
  if (typeof obj === "object") {
    return `${obj.constructor.name}`;
  }
  return "";
}

function hex(x) {
  return x.toString(16);
}

function input(message = "") {
  process.stdout.write(message);
  let cmd;
  let args;
  if (os.platform() == "win32") {
    cmd = "cmd";
    args = ["/V:ON", "/C", "set /p response= && echo !response!"];
  } else {
    cmd = "bash";
    args = ["-c", 'read response; echo "$response"'];
  }
  let opts = {
    stdio: ["inherit", "pipe", "inherit"],
    shell: false,
  };
  return child_process.spawnSync(cmd, args, opts).stdout.toString().trim();
}

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

function isinstance(x, Type) {
  try {
    return typeof x === typeof Type();
  } catch (e) {
    return x instanceof Type;
  }
}

function issubclass(x, type) {
  return x.prototype instanceof type;
}

function iter(obj, sentinal) {
  if (sentinal) {
    return obj[Symbol.iterator]();
  } else {
    const iterables = [Array, Set, Map, String];
    for (let iterable of iterables) {
      if (isinstance(obj, iterable)) {
        return obj[Symbol.iterator]();
      }
    }
    throw new TypeError("iter() argument must be iterable");
  }
}

function len(array) {
  if (isIterable(array)) {
    array = [...array];
  }
  return array.length;
}

function list(iterable) {
  return new List(iterable);
}

function locals() {
  return { ...global };
}

// multiple iterables
function map(func, iterable) {
  iterable = [...iterable];
  return iterable.map(func);
}

function max(array) {
  if (isIterable(array)) {
    array = [...array];
  }
  return Math.max(...array);
}

function min(array) {
  if (isIterable(array)) {
    array = [...array];
  }
  return Math.min(...array);
}

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

function oct(x) {
  return x.toString(8);
}

function open(file, mode = "r") {
  return new FileObject(file, mode);
}

function ord(x) {
  return x.charCodeAt(0);
}

function pow(num, exp) {
  return Math.pow(num, exp);
}

function print(text, end = "\n", sep = " ", ...args) {
  let result = "";
  if (typeof text === "string") {
    result = text;
  } else if (typeof text === "number") {
    result = text.toString();
  } else if (typeof text === "object") {
    result = text.toString();
  } else if (typeof text === "boolean") {
    result = text.toString();
  }
  for (let i = 0; i < len(args); i++) {
    if (typeof args[i] === "string") {
      result = result + sep + args[i];
    } else if (typeof args[i] === "number") {
      result = result + sep + args[i].toString();
    } else if (typeof args[i] === "object") {
      result = result + sep + args[i].toString();
    } else if (typeof text === "boolean") {
      result = result + sep + args[i].toString();
    }
  }
  result += end;
  process.stdout.write(result);
}

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

function reversed(iterable) {
  iterable = [...iterable];
  let result = [];
  for (let item of iterable) {
    result.unshift(item);
  }
  return result;
}

function round(num, ndigits = 0) {
  return Math.round(num * Math.pow(10, ndigits)) / Math.pow(10, ndigits);
}

function set(array) {
  array = [...array];
  return new Set(array);
}

function setattr(obj, name, value) {
  obj[name] = value;
}

function slice(array, start, stop, step = 1) {
  array = [...array];
  let result = [];
  for (let i = start; i < stop; i += step) {
    result.push(array[i]);
  }
  return result;
}

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

function str(x) {
  if (typeof x === "string") {
    return x;
  } else if (typeof x === "number") {
    return x.toString();
  } else {
    return util.inspect(x);
  }
}

function sum(array) {
  array = [...array];
  return array.reduce((a, b) => a + b, 0);
}

function tuple(iterable) {
  return new Tuple(iterable);
}

function type(obj) {
  return typeof obj;
}

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

function raise(exception) {
  throw exception;
}

module.exports = {
  Complex,
  Dict,
  FrozenSet,
  Tuple,
  List,
  FileObject,
  abs,
  all,
  any,
  assert,
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
  filter,
  float,
  format,
  frozenset,
  getattr,
  hasattr,
  help,
  hex,
  input,
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
  tuple,
  type,
  zip,
  raise,
};
