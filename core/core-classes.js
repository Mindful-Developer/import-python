const fs = require("fs");
const util = require("util");
const { isIterable } = require("../util/util");

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

class FileObject {
  constructor(path, mode = "r") {
    this.path = path;
    this.mode = mode;
    if (!["r", "r+", "w", "w+", "a", "a+"].includes(mode)) {
      throw new Error(`Invalid mode: ${mode}`);
    }
    if (!["r", "a", "a+"].includes(mode)) {
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

module.exports = {
  Complex,
  Dict,
  FrozenSet,
  Tuple,
  List,
  FileObject,
};
