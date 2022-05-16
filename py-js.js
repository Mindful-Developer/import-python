const util = require("util");
const fs = require("fs");
const os = require("os");
const child_process = require("child_process");


function isIterable(obj) {
  if (obj == null) {
    return false;
  }
  return typeof obj[Symbol.iterator] === "function";
}


class Complex {
  real;
  imaginary;

  constructor(real, imaginary) {
    if (!real || typeof real !== "number") {
      this.real = 0;
    } else {
      this.real = real;
    }
    if (!imaginary || typeof imaginary !== "number") {
      this.imaginary = 0;
    } else {
      this.imaginary = imaginary;
    }
  }

  [util.inspect.custom]() {
    return this.toString();
  }

  add(other) {
    return new Complex(
      this.real + other.real,
      this.imaginary + other.imaginary
    );
  }

  sub(other) {
    return new Complex(
      this.real - other.real,
      this.imaginary - other.imaginary
    );
  }

  mul(other) {
    return new Complex(
      this.real * other.real - this.imaginary * other.imaginary,
      this.real * other.imaginary + this.imaginary * other.real
    );
  }

  div(other) {
    return new Complex(
      (this.real * other.real + this.imaginary * other.imaginary) /
        (other.real * other.real + other.imaginary * other.imaginary),
      (this.imaginary * other.real - this.real * other.imaginary) /
        (other.real * other.real + other.imaginary * other.imaginary)
    );
  }

  toString() {
    return `(${this.real} ${this.imaginary > 0 ? "+" : "-"} ${Math.abs(
      this.imaginary
    )}i)`;
  }

  conjugate() {
    return new Complex(this.real, -this.imaginary);
  }

  get polar() {
    return new Tuple([this.magnitude, this.phase]);
  }

  get magnitude() {
    return Math.sqrt(this.real * this.real + this.imaginary * this.imaginary);
  }

  get phase() {
    return Math.atan2(this.imaginary, this.real);
  }

  static fromPolar(magnitude, phase) {
    const real = magnitude * Math.cos(phase);
    const imaginary = magnitude * Math.sin(phase);
    return new Complex(round(real, 14), round(imaginary, 14));
  }

  static fromString(str) {
    const match = str.match(/^\(?([\-\d\s]+)\s*([\+\-])\s*([\-\d\s]+)\s*i\)?$/);
    if (match) {
      return new Complex(parseFloat(match[1]), parseFloat(match[2] + match[3]));
    } else {
      throw new Error("Invalid complex number");
    }
  }
}


class Dict extends Object {
  constructor(iterable) {
    super();
    if (iterable && isIterable(iterable)) {
      iterable = [...iterable];
    }
    if (iterable && iterable.length !== undefined) {
      for (let [key, value] of iterable) {
        this.set(key, value);
      }
    } else if (iterable) {
      for (const [key, value] of Object.entries(iterable)) {
        this.set(key, value);
      }
    }
  }

  [Symbol.iterator]() {
    let keys = Object.keys(this);
    return {
      next: () => {
        if (keys.length > 0) {
          let key = keys.shift();
          return { value: key, done: false };
        } else {
          return { value: null, done: true };
        }
      },
    };
  }

  [util.inspect.custom]() {
    return this.toString();
  }

  get(key) {
    return this[key];
  }

  set(key, value) {
    this[key] = value;
  }

  pop(key) {
    let value = this[key];
    delete this[key];
    return value;
  }

  copy() {
    let newDict = new Dict();
    for (let [key, value] of Object.entries(this)) {
      newDict.set(key, value);
    }
    return newDict;
  }

  keys() {
    return new Tuple(Object.keys(this));
  }

  values() {
    return new Tuple(Object.values(this));
  }

  items() {
    let items = new List();
    for (let [key, value] of Object.entries(this)) {
      items.push(new Tuple([key, value]));
    }
    return items;
  }

  clear() {
    for (let key of Object.keys(this)) {
      delete this[key];
    }
  }

  update(other) {
    for (let [key, value] of Object.entries(other)) {
      this.set(key, value);
    }
  }

  popitem() {
    if (this.keys().length > 0) {
      let key = this.keys()[this.keys().length - 1];
      let value = this.pop(key);
      return new Tuple([key, value]);
    } else {
      throw new Error("Dictionary is empty");
    }
  }

  static fromkeys(keys, value = null) {
    let newDict = new Dict();
    for (let key of keys) {
      newDict.set(key, value);
    }
    return newDict;
  }

  get length() {
    return Object.keys(this).length;
  }

  toString() {
    let output = "";
    for (let [key, value] of Object.entries(this)) {
      if (typeof key !== "number" && key !== undefined && key !== null) {
        key = key.toString();
      }
      if (typeof value !== "number" && value !== undefined && value !== null) {
        value = value.toString();
      }
      output += `${key}: ${value}, `;
    }
    return `{${output.slice(0, -2)}}`;
  }
}


class FrozenSet extends Set {
  constructor(iterable) {
    super();
    if (!iterable) {
    } else if (isIterable(iterable)) {
      iterable = [...iterable];
      for (let item of iterable) {
        this.add(item);
      }
    } else {
      throw new Error("Invalid iterable");
    }
    this.add = () => {
      throw new Error("FrozenSet is immutable");
    };
    Object.freeze(this);
  }

  [util.inspect.custom]() {
    return this.toString();
  }

  toString() {
    let output = "";
    for (let item of this) {
      if (typeof item === "number") {
        output += item + ", ";
      } else {
        output += item.toString() + ", ";
      }
    }
    return `FrozenSet({${output.slice(0, -2)}})`;
  }
}


class Tuple extends Array {
  constructor(iterable) {
    if (isIterable(iterable)) {
      super();
      iterable = [...iterable];
      for (let item of iterable) {
        this.push(item);
      }
    } else {
      throw new Error("Invalid iterable");
    }
    Object.freeze(this);
  }

  [util.inspect.custom]() {
    return this.toString();
  }

  toString() {
    let output = "";
    for (let item of this) {
      if (typeof item === "number") {
        output += item + ", ";
      } else {
        output += item.toString() + ", ";
      }
    }
    if (this.length === 1) {
      return `(${output.slice(0, -1)})`;
    }
    return `(${output.slice(0, -2)})`;
  }

  count(num) {
    let count = 0;
    for (let i = 0; i < this.length; i++) {
      if (this[i] === num) {
        count++;
      }
    }
    return count;
  }

  index(num) {
    for (let i = 0; i < this.length; i++) {
      if (this[i] === num) {
        return i;
      }
    }
  }
}


class List extends Array {
  constructor(iterable) {
    if (!iterable) {
      super();
    } else if (isIterable(iterable)) {
      super();
      iterable = [...iterable];
      for (let item of iterable) {
        this.push(item);
      }
    } else if (typeof iterable === "number") {
      super(iterable);
    } else {
      throw new Error("Invalid iterable");
    }
  }

  [util.inspect.custom]() {
    return this.toString();
  }

  append(x) {
    this.push(x);
  }

  clear() {
    this.length = 0;
  }

  copy() {
    return new list(this);
  }

  count(x) {
    let count = 0;
    for (let item of this) {
      if (item === x) {
        count++;
      }
    }
    return count;
  }

  extend(iterable) {
    for (let item of iterable) {
      this.push(item);
    }
  }

  index(x, start = 0, stop = this.length) {
    for (let i = start; i < stop; i++) {
      if (this[i] === x) {
        return i;
      }
    }
    throw new Error(`ValueError: ${x} not in list`);
  }

  insert(index, x) {
    this.splice(index, 0, x);
  }
  pop(index = this.length - 1) {
    return this.splice(index, 1)[0];
  }

  remove(x) {
    let index = this.indexOf(x);
    if (index === -1) {
      throw new ValueError(`${x} not in list`);
    }
    this.splice(index, 1);
  }

  sort(key = undefined, reverse = false) {
    if (typeof key === "boolean") {
      [key, reverse] = [undefined, key];
    }
    if (reverse) {
      super.sort(key).reverse();
    } else {
      super.sort(key);
    }
  }

  toString() {
    let output = "";
    for (let item of this) {
      if (typeof item === "number") {
        output += item + ", ";
      } else {
        output += item.toString() + ", ";
      }
    }
    return `[${output.slice(0, -2)}]`;
  }
}


class Random {
  constructor(seed = null) {
    if (typeof seed === "string") {
      this.seed = seed.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
    } else if (typeof seed === "number") {
      this.seed = seed;
    } else if (typeof seed === "boolean") {
      this.seed = seed ? 1 : 0;
    } else {
      this.seed = Math.random();
    }
    if (this.seed > 1) {
      while (this.seed > 1) {
        this.seed = this.seed / 10;
      }
    }
  }

  #mulberry32(a) {
    return function () {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  random() {
    this.seed = this.#mulberry32(this.seed * 1000000)();
    return this.seed;
  }

  randint = (start, end) =>
    Math.floor(this.random() * (end - start + 1)) + start;

  choice = (iterable) => iterable[this.randint(0, len(iterable) - 1)];

  choices = (iterable, k) => {
    let result = list();
    for (let i = 0; i < k; i++) {
      result.append(this.choice(iterable));
    }
    return result;
  };

  shuffle = (array) => {
    let result = [...array];
    for (let i = 0; i < len(result); i++) {
      let j = this.randint(0, len(result) - 1);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  };

  sample = (array, k = 1) => {
    array = [...array];
    let result = [];
    for (let i = 0; i < k; i++) {
      let j = this.randint(0, len(array) - 1);
      result.push(array[j]);
      array.splice(j, 1);
    }
    return result;
  };

  uniform(start, end) {
    return this.random() * (end - start) + start;
  }

  randrange(stop, start = null, step = 1) {
    if (start !== null) {
      [stop, start] = [start, stop];
    }

    let n = stop - start;
    if (n < 0) {
      n = -n;
    }
    if (step == 0) {
      raise(new ValueError("zero step"));
    }
    if (step > 0) {
      return start + Math.floor((this.random() * n) / step) * step;
    } else {
      return start + Math.floor((this.random() * n) / -step) * -step;
    }
  }
}


class FileObject {
  constructor(path, mode = "r") {
    this.path = path;
    this.mode = mode;
    if (!["r", "r+", "w", "w+", "a", "a+"].includes(mode)) {
      throw new Error(`Invalid mode: ${mode}`);
    }
    if (this.mode !== "r") {
      fs.writeFileSync(this.path, "");
    }
    this.open = true;
  }

  close() {
    this.open = false;
    Object.freeze(this);
  }

  read() {
    if (!this.open) {
      throw new Error("File is closed");
    }
    if (["r", "r+", "a+", "w+"].includes(this.mode)) {
      return fs.readFileSync(this.path, "utf8");
    } else {
      throw new Error("File not open for reading");
    }
  }

  readline(i = 0) {
    if (!this.open) {
      throw new Error("File is closed");
    }
    if (["r", "r+", "a+", "w+"].includes(this.mode)) {
      let lines = this.read().split("\n");
      return lines[i] + "\n";
    } else {
      throw new Error("File not open for reading");
    }
  }

  readlines(start = 0, stop = null) {
    if (!this.open) {
      throw new Error("File is closed");
    }
    if (["r", "r+", "a+", "w+"].includes(this.mode)) {
      let lines = this.read().split("\n");
      if (stop === null) {
        stop = len(lines);
      }
      return list(map((line) => line + "\n", lines.slice(start, stop)));
    } else {
      throw new Error("File not open for reading");
    }
  }

  splitlines() {
    if (!this.open) {
      throw new Error("File is closed");
    }
    if (["r", "r+", "a+", "w+"].includes(this.mode)) {
      return list(this.read().split("\n"));
    } else {
      throw new Error("File not open for reading");
    }
  }

  truncate(size = null) {
    if (!this.open) {
      throw new Error("File is closed");
    }
    if (["w", "w+", "r+"].includes(this.mode)) {
      if (size === null) {
        size = 0;
      }
      fs.truncateSync(this.path, size);
    } else {
      throw new Error(
        "File not open for trucating. Use mode 'w' or 'w+' or 'r+'"
      );
    }
  }

  write(data) {
    if (!this.open) {
      throw new Error("File is closed");
    }
    if (["w", "w+", "a", "a+"].includes(this.mode)) {
      fs.appendFileSync(this.path, data);
    } else {
      throw new Error("File not open for writing");
    }
  }

  writelines(iterable) {
    if (!this.open) {
      throw new Error("File is closed");
    }
    if (["w", "w+", "a", "a+"].includes(this.mode)) {
      for (let line of iterable) {
        fs.appendFileSync(this.path, line);
      }
    } else {
      throw new Error("File not open for writing");
    }
  }
}

function abs(num) {
  return Math.abs(num);
}

// async function aiter(iterable) {
//   return {
//     [Symbol.asyncIterator]() {
//       return {
//         next: async () => {
//           let result = iterable.next();
//           if (result.done) {
//             return { done: true, value: null };
//           }
//           return { done: false, value: result.value };
//         },
//       };
//     },
//   };
// }

function all(array) {
  array = [...array];
  return array.reduce((a, b) => bool(a) && bool(b));
}

function any(array) {
  array = [...array];
  return array.reduce((a, b) => bool(a) || bool(b));
}

// function anext(iterator) {
//   let result = iterator.next();
//   if (result.done) {
//     throw new Error("StopIteration");
//   }
//   return result.value;
// }

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

// compile = (source, filename, mode) => {
//   if (mode === "exec") {
//     mode = "eval";
//   }
//   return new Function(...Object.keys(global), source);
// };

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
      if (obj instanceof iterable) {
        return obj[Symbol.iterator]();
      }
    }
    throw new TypeError("iter() argument must be iterable");
  }
}

function len(array) {
  array = [...array];
  return array.length;
}

function list(iterable) {
  return new List(iterable);
}

function locals() {
  return { ...global };
}

function map(func, iterable) {
  iterable = [...iterable];
  return iterable.map(func);
}

function max(array) {
  array = [...array];
  return Math.max(...array);
}

function min(array) {
  array = [...array];
  return Math.min(...array);
}

function next(iterator) {
  let result = iterator.next();
  if (result.done) {
    throw new Error("StopIteration");
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

function print(text, sep = " ", end = "\n", ...args) {
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
  for (let i = 0; i < len(arrays); i++) {
    arrays[i] = [...arrays[i]];
  }

  return {
    [Symbol.iterator]() {
      return this;
    },
    next() {
      if (!this.value) {
        this.value = [];
        const arrayLengths = arrays.map((a) => a.length);
        const shortestArray = arrayLengths.reduce((a, b) => (a < b ? a : b));
        const arraysSum = shortestArray * arrays.length;

        for (let i = 0; i < shortestArray; i++) {
          let temp = [];
          for (let j = 0; j < arrays.length; j++) {
            temp.push(arrays[j][i]);
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

function __import__(name) {
  const result = require(name);
  return result;
}

function raise(exception) {
  throw exception;
}

function random(seed = null) {
  return new Random(seed);
}

module.exports = {
  Complex,
  Tuple,
  Random,
  List,
  Dict,
  FrozenSet,
  FileObject,
  abs,
  // aiter,
  // anext,
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
  __import__,
  raise,
  random,
};
