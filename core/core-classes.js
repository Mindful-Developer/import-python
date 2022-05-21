const fs = require("fs");
const util = require("util");
const { isIterable } = require("../util/util");

/** Class to represent a complex number system (real and imaginary) */
class Complex {
  /**
   *
   * @param {number} - the real number
   * @param {number} - the imaginary number
   * @returns {Complex}
   */
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

  /**
   * Add two complex numbers.
   *
   * @param {Complex} - the complex number to compare
   * @returns {Complex}
   */
  add(other) {
    return new Complex(
      this.real + other.real,
      this.imaginary + other.imaginary
    );
  }

  /**
   * Subtract two complex numbers.
   *
   * @param {Complex} - the complex number to compare
   * @returns {Complex}
   */
  sub(other) {
    return new Complex(
      this.real - other.real,
      this.imaginary - other.imaginary
    );
  }

  /**
   * Multiply two complex numbers.
   *
   * @param {Complex} - the complex number to compare
   * @returns {Complex}
   */
  mul(other) {
    return new Complex(
      this.real * other.real - this.imaginary * other.imaginary,
      this.real * other.imaginary + this.imaginary * other.real
    );
  }

  /**
   * Divide two complex numbers.
   *
   * @param {Complex} - the complex number to compare
   * @returns {Complex}
   */
  div(other) {
    return new Complex(
      (this.real * other.real + this.imaginary * other.imaginary) /
        (other.real * other.real + other.imaginary * other.imaginary),
      (this.imaginary * other.real - this.real * other.imaginary) /
        (other.real * other.real + other.imaginary * other.imaginary)
    );
  }

  /**
   * Return the complex number as a string in the format (a + bi).
   *
   * @returns {string}
   */
  toString() {
    return `(${this.real} ${this.imaginary > 0 ? "+" : "-"} ${Math.abs(
      this.imaginary
    )}i)`;
  }

  /**
   * Conjugate a complex number.
   *
   * @returns {Complex}
   */
  conjugate() {
    return new Complex(this.real, -this.imaginary);
  }

  /**
   * Gets the polar coordinates of the complex number.
   *
   * @returns {number}
   */
  get polar() {
    return new Tuple([this.magnitude, this.phase]);
  }

  /**
   * Gets the magnitude of the complex number.
   *
   * @returns {number}
   */
  get magnitude() {
    return Math.sqrt(this.real * this.real + this.imaginary * this.imaginary);
  }

  /**
   * Gets the phase of the complex number.
   *
   * @returns {number}
   */
  get phase() {
    return Math.atan2(this.imaginary, this.real);
  }

  /**
   * Create a complex number from polar coordinates.
   * 
   * @param {number} - the magnitude
   * @param {number} - the phase
   * @returns {Complex}
   */
  static fromPolar(magnitude, phase) {
    const real = magnitude * Math.cos(phase);
    const imaginary = magnitude * Math.sin(phase);
    return new Complex(round(real, 14), round(imaginary, 14));
  }

  /**
   * Create a complex number from a string (a + bi).
   * 
   * @param {string} - the string to parse 
   * @returns {Complex}
   */
  static fromString(str) {
    const match = str.match(/^\(?([\-\d\s]+)\s*([\+\-])\s*([\-\d\s]+)\s*i\)?$/);
    if (match) {
      return new Complex(parseFloat(match[1]), parseFloat(match[2] + match[3]));
    } else {
      throw new Error("Invalid complex number");
    }
  }
}

/** Class to represent Python's dictionary */
class Dict extends Object {

  /**
   * Creates a dictionary from a list of key-value pairs.
   * 
   * @param {iterable | Object} - iterable or object containing the keys and values grouped together.
   * @returns {Dict}
   */
  constructor(iterable) {
    super();
    if (iterable && isIterable(iterable)) {
      iterable = [...iterable];
    }
    if (iterable && iterable.length !== undefined) {
      for (let [key, value] of iterable) {
        this.setItem(key, value);
      }
    } else if (iterable) {
      for (const [key, value] of Object.entries(iterable)) {
        this.setItem(key, value);
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

  /**
   * Gets the value of a key.
   * 
   * @param {string} - the key
   * @returns {any}
   */
  get(key) {
    return this[key];
  }

  /**
   * Sets the key-value pair.
   *  
   * @param {string} - the key
   * @param {any} - the value
   */
  setItem(key, value) {
    this[key] = value;
  }

  /**
   * Removes a key from the dictionary. Returns the value of the key.
   * 
   * @param {string} - the key
   * @returns {any}
   */
  pop(key) {
    let value = this[key];
    delete this[key];
    return value;
  }

  /**
   * Returns a copy of the dictionary.
   * 
   * @returns {Dict}
   */
  copy() {
    let newDict = new Dict();
    for (let [key, value] of Object.entries(this)) {
      newDict.setItem(key, value);
    }
    return newDict;
  }

  /**
   * Returns the keys of the dictionary.
   * 
   * @returns {Tuple}
   */
  keys() {
    return new Tuple(Object.keys(this));
  }

  /**
   * Returns the values of the dictionary.
   * 
   * @returns {Tuple}
   */
  values() {
    return new Tuple(Object.values(this));
  }

  /**
   * Returns the key-value pairs of the dictionary as a list of tuples.
   * 
   * @returns {List}
   */
  items() {
    let items = new List();
    for (let [key, value] of Object.entries(this)) {
      items.push(new Tuple([key, value]));
    }
    return items;
  }

  /** Clears the dictionary of all key-value pairs. */
  clear() {
    for (let key of Object.keys(this)) {
      delete this[key];
    }
  }

  /**
   * Updates the dictionary with the key-value pairs of another dictionary.
   * 
   * @param {Dict} - the dictionary to update with
   */
  update(other) {
    for (let [key, value] of Object.entries(other)) {
      this.setItem(key, value);
    }
  }

  /**
   * Removes the last key-value pair from the dictionary and returns it.
   * 
   * @returns {Tuple}
   */
  popitem() {
    if (this.keys().length > 0) {
      let key = this.keys()[this.keys().length - 1];
      let value = this.pop(key);
      return new Tuple([key, value]);
    } else {
      throw new Error("Dictionary is empty");
    }
  }

  /**
   * Creates a dictionary from a list of keys using a default value.
   * 
   * @param {iterable} - the keys
   * @param {any} - the default value
   * @returns {Dict}
   */
  static fromkeys(keys, value = null) {
    let newDict = new Dict();
    for (let key of keys) {
      newDict.setItem(key, value);
    }
    return newDict;
  }

  get length() {
    return Object.keys(this).length;
  }

  /**
   * Returns a string representation of the dictionary.
   * 
   * @returns {string}
   */
  toString() {
    let output = "";
    for (let [key, value] of Object.entries(this)) {
      if (typeof key !== "number" && key !== undefined && key !== null) {
        key = key.toString();
      }
      if (typeof value !== "number" && value !== undefined && value !== null) {
        value = value.toString();
      } else if (value === null) {
        value = "null";
      } else if (value === undefined) {
        value = "undefined";
      }
      output += `${key}: ${value}, `;
    }
    return `{${output.slice(0, -2)}}`;
  }
}

/** Class representing Python's FrozenSet */
class FrozenSet extends Set {
  /**
   * Creates a frozen set from an iterable.
   * 
   * @param {iterable} - the iterable
   * @returns {FrozenSet}
   * @throws {Error} - if the iterable is not iterable
   */
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

  /**
   * Returns a string representation of the frozen set.
   * 
   * @returns {string}
   */
  toString() {
    let output = "";
    for (let item of this) {
      if (typeof item === "number") {
        output += item + ", ";
      } else if (item === null) {
        output += "null, ";
      } else if (item === undefined) {
        output += "undefined, ";
      } else {
        output += item.toString() + ", ";
      }
    }
    return `FrozenSet({${output.slice(0, -2)}})`;
  }
}

/** Class representing Python's Tuple */
class Tuple extends Array {
  /**
   * Creates a tuple from an iterable.
   * 
   * @param {iterable} - the iterable
   * @returns {Tuple}
   * @throws {Error} - if the iterable is not iterable
   */
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

  /**
   * Returns a string representation of the tuple.
   * 
   * @returns {string}
   */
  toString() {
    let output = "";
    for (let item of this) {
      if (typeof item === "number") {
        output += item + ", ";
      } else if (item === null) {
        output += "null, ";
      } else if (item === undefined) {
        output += "undefined, ";
      } else {
        output += item.toString() + ", ";
      }
    }
    if (this.length === 1) {
      return `(${output.slice(0, -1)})`;
    }
    return `(${output.slice(0, -2)})`;
  }

  /**
   * Counts the number of occurrences of an item in the tuple.
   * 
   * @param {any} - the item to count
   * @returns {number}
   */
  count(num) {
    let count = 0;
    for (let i = 0; i < this.length; i++) {
      if (this[i] === num) {
        count++;
      }
    }
    return count;
  }

  /**
   * Returns the index of the first occurrence of an item in the tuple.
   * 
   * @param {any} - the item to find
   * @returns {number}
   */
  index(num) {
    for (let i = 0; i < this.length; i++) {
      if (this[i] === num) {
        return i;
      }
    }
  }
}

/** Class representing Python's List */
class List extends Array {
  /**
   * Creates a list from an iterable.
   * 
   * @param {iterable} - the iterable
   * @returns {List}
   * @throws {Error} - if the iterable is not iterable
   */
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

  /**
   * Appends an item to the end of the list.
   * 
   * @param {any} - the item to append
   */
  append(x) {
    this.push(x);
  }

  /** Clears the list of all items. */
  clear() {
    this.length = 0;
  }

  /**
   * Returns a copy of the list.
   * 
   * @returns {List}
   */
  copy() {
    return new List(this);
  }

  /**
   * Counts the number of occurrences of an item in the list.
   * 
   * @param {any} - the item to count
   * @returns {number}
   */
  count(x) {
    let count = 0;
    for (let item of this) {
      if (item === x) {
        count++;
      }
    }
    return count;
  }

  /**
   * Extends the list with an iterable.
   * 
   * @param {iterable} - the iterable
   * @returns {List}
   */
  extend(iterable) {
    for (let item of iterable) {
      this.push(item);
    }
  }

  /**
   * Returns the index of the first occurrence of an item in the list.
   * 
   * @param {any} - the item to find
   * @param {number} - the index to start searching from
   * @param {number} - the index to end searching at
   * @returns {number}
   * @throws {Error} - if the index is out of range
   * @throws {Error} - if the value is not found
   */
  index(x, start = 0, stop = this.length) {
    for (let i = start; i < stop; i++) {
      if (this[i] === x) {
        return i;
      }
    }
    throw new Error(`ValueError: ${x} not in list`);
  }

  /**
   * Inserts an item at the specified index.
   * 
   * @param {number} - the index to insert at
   * @param {any} - the item to insert
   * @throws {Error} - if the index is out of range
   */
  insert(index, x) {
    this.splice(index, 0, x);
  }

  /**
   * removes the last index of the list and returns it. If an index is specified,
   * it removes the item at that index and returns it.
   * 
   * @param {number} - the index to remove
   * @returns {any}
   * @throws {Error} - if the index is out of range
   */
  pop(index = this.length - 1) {
    return this.splice(index, 1)[0];
  }

  /**
   * Removes the first occurrence of an item in the list.
   * 
   * @param {any} - the item to remove
   */
  remove(x) {
    let index = this.indexOf(x);
    if (index === -1) {
      throw new ValueError(`${x} not in list`);
    }
    this.splice(index, 1);
  }

  /**
   * Sort the list in place. If a key function is specified, the list is sorted
   * according to the key function. If a key function is not specified, the list
   * is sorted according to the value of the items. If a reverse flag is specified,
   * the list is sorted in reverse order.
   * 
   * @param {function} - the key function
   * @param {boolean} - the reverse flag
   */
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

  /**
   * Returns a string representation of the list.
   * 
   * @returns {string}
   */
  toString() {
    let output = "";
    for (let item of this) {
      if (typeof item === "number") {
        output += item + ", ";
      } else if (item === null) {
        output += "null, ";
      } else if (item === undefined) {
        output += "undefined, ";
      } else {
        output += item.toString() + ", ";
      }
    }
    return `[${output.slice(0, -2)}]`;
  }
}

/** Class to represent an open file */
class FileObject {
  /**
   * Creates a file object.
   * 
   * @param {string} - the file path
   * @param {string} - the file mode (r, r+, w, w+, a, a+)
   */
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

  /** Closes the file. */
  close() {
    this.open = false;
    Object.freeze(this);
  }

  /**
   * Reads the file.
   * 
   * @returns {string}
   * @throws {Error} - if the file is not open in reading mode
   * @throws {Error} - if the file does not exist
   * @throws {Error} - if the file is closed
   */
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

  /**
   * Reads one line from the file.
   * 
   * @param {number} - the line to read
   * @returns {string}
   * @throws {Error} - if the file is not open in reading mode
   * @throws {Error} - if the file does not exist
   * @throws {Error} - if the file is closed
   */
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

  /**
   * Reads all lines from the file and returns them as a list.
   * A newline character is appended to the end of each line.
   * 
   * @param {number} - the starting line
   * @param {number} - the ending line
   * @returns {List}
   * @throws {Error} - if the file is not open in reading mode
   * @throws {Error} - if the file does not exist
   * @throws {Error} - if the file is closed
   */
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

  /**
   * Reads the file and returns it as a list of lines. Newline characters are
   * removed.
   * 
   * @returns {List}
   * @throws {Error} - if the file is not open in reading mode
   * @throws {Error} - if the file does not exist
   * @throws {Error} - if the file is closed
   */
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

  /**
   * Truncates the file to the specified length.
   * 
   * @param {number} - the length
   * @throws {Error} - if the file is not open in writing mode
   * @throws {Error} - if the file is closed
   */
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

  /**
   * Writes the specified string to the file.
   * 
   * @param {string} - the string to write
   * @throws {Error} - if the file is not open in writing or appending mode
   * @throws {Error} - if the file is closed
   */
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

  /**
   * Writes the list of strings to the file.
   * 
   * @param {iterable} - the iterable of strings to write
   * @throws {Error} - if the file is not open in writing or appending mode
   * @throws {Error} - if the file is closed
   */
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
