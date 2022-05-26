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

  get size() {
    return this.length;
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

/**
 * Convert the first character of the string to uppercase
 *
 * @returns {string} the string with the first character converted to uppercase
 */
String.prototype.capitalize = function() {
  return this[0].toUpperCase() + this.slice(1);
}

/**
 * Convert the string to lowercase
 *
 * @returns {string} the string converted to lowercase
 */
String.prototype.casefold = function() {
  return this.toLowerCase();
}

/**
 * Return a centered string of length width.
 *
 * @param {number} - the length of the string to be returned
 * @param {string} - the string to be used for padding
 * @returns {string} the centered string
 * @throws {TypeError} if width is not an integer
 * @throws {Error} if width is less than zero
 */
String.prototype.center = function(width, fillchar = " ") {
  if (typeof width !== "number" || width % 1 !== 0) {
    throw new TypeError("width must be an integer");
  }
  if (width < 0) {
    throw new Error("width must be greater than or equal to zero");
  }
  const pad = fillchar.repeat(width - this.length);
  return (
    pad.slice(0, Math.floor(pad.length / 2)) +
    this +
    pad.slice(Math.floor(pad.length / 2))
  );
}

/**
 * Return the number of non-overlapping occurrences of substring sub in the range [start, end].
 *
 * @param {string} - the substring to be counted
 * @param {number} - the start index
 * @param {number} - the end index
 * @returns {number} the number of occurrences
 * @throws {TypeError} if start is not an integer
 * @throws {TypeError} if end is not an integer
 * @throws {Error} if start or end is less than zero or end > start
 */
String.prototype.count = function(sub, start = 0, end = this.length) {
  if (typeof start !== "number" || start % 1 !== 0) {
    throw new TypeError("start must be an integer");
  }
  if (start < 0) {
    throw new Error("start must be greater than or equal to zero");
  }
  if (typeof end !== "number" || end % 1 !== 0) {
    throw new TypeError("end must be an integer");
  }
  if (end < 0) {
    throw new Error("end must be greater than or equal to zero");
  }
  if (end > this.length) {
    throw new Error(
      "end must be less than or equal to the length of the string"
    );
  }
  if (start > end) {
    throw new Error("start must be less than or equal to end");
  }
  let count = 0;
  for (let i = start; i < end; i++) {
    if (this.slice(i, i + sub.length) === sub) {
      count++;
    }
  }
  return count;
}

// encode()
/**
 * Encode the string using the codec registered for encoding. Default encoding is 'utf-8'.
 *
 * @param {string} - the encoding to be used
 * @returns {string} the encoded string
 * @throws {TypeError} if encoding is not a string
 * @throws {Error} if encoding is not a valid encoding
 */
String.prototype.encode = function(encoding = "utf-8") {
  const encodings = [
    "utf8", "utf-8",
    "utf16le", "utf-16le",
    "latin1",
    "base64",
    "base64url",
    "hex",
    "ascii",
    "ucs2", "ucs-2",
  ];
  if (typeof encoding !== "string") {
    throw new TypeError("encoding must be a string");
  }
  if (encodings.indexOf(encoding) === -1) {
    throw new Error("encoding must be a valid encoding");
  }
  return Buffer.from(this, encoding).toString();
}

// endswith()
/**
 * Return true if the string ends with the suffix, otherwise return false.
 * If suffix is not a string, it is converted to one using str(suffix).
 * If the optional start, end, or both are supplied, then return true if the string ends with the suffix
 * between start and end positions (including the end position, but not the start position).
 * 
 * @param {string} - the suffix to be checked
 * @param {number} - the start index
 * @param {number} - the end index
 * @returns {boolean} true if the string ends with the suffix
 */
String.prototype.endswith = function(suffix, start = 0, end = this.length) {
  if (typeof suffix !== "string") {
    suffix = str(suffix);
  }
  if (typeof start !== "number" || start % 1 !== 0) {
    throw new TypeError("start must be an integer");
  }
  if (start < 0) {
    throw new Error("start must be greater than or equal to zero");
  }
  if (typeof end !== "number" || end % 1 !== 0) {
    throw new TypeError("end must be an integer");
  }
  if (end < 0) {
    throw new Error("end must be greater than or equal to zero");
  }
  if (end > this.length) {
    throw new Error(
      "end must be less than or equal to the length of the string"
    );
  }
  if (start > end) {
    throw new Error("start must be less than or equal to end");
  }
  return this.slice(start, end).endsWith(suffix);
}

// expandtabs()
/**
 * Return a copy of the string where all tab characters are expanded using spaces.
 * If tabsize is not given, a tab size of 2 characters is assumed.
 * 
 * @param {number} - the tab size
 * @returns {string} the string with tabs expanded
 * @throws {TypeError} if tabsize is not an integer
 * @throws {Error} if tabsize is less than zero
 */
String.prototype.expandtabs = function(tabsize = 2) {
  if (typeof tabsize !== "number" || tabsize % 1 !== 0) {
    throw new TypeError("tabsize must be an integer");
  }
  if (tabsize < 0) {
    throw new Error("tabsize must be greater than or equal to zero");
  }
  let str = this;
  let tabs = 0;
  while (str.indexOf("\t") !== -1) {
    tabs++;
    str = str.replace("\t", " ".repeat(tabsize));
  }
  return str;
}

// find()
/**
 * Return the lowest index in the string where substring sub is found,
 * such that sub is contained in the slice s[start:end].
 * Optional arguments start and end are interpreted as in slice notation.
 * Return -1 on failure.
 * 
 * @param {string} - the substring to be found
 * @param {number} - the start index
 * @param {number} - the end index
 * @returns {number} the index of the substring
 * @throws {TypeError} if start is not an integer
 * @throws {TypeError} if end is not an integer
 * @throws {Error} if start or end is less than zero or end > start
 */
String.prototype.find = function(sub, start = 0, end = this.length) {
  if (typeof start !== "number" || start % 1 !== 0) {
    throw new TypeError("start must be an integer");
  }
  if (start < 0) {
    throw new Error("start must be greater than or equal to zero");
  }
  if (typeof end !== "number" || end % 1 !== 0) {
    throw new TypeError("end must be an integer");
  }
  if (end < 0) {
    throw new Error("end must be greater than or equal to zero");
  }
  if (end > this.length) {
    throw new Error(
      "end must be less than or equal to the length of the string"
    );
  }
  if (start > end) {
    throw new Error("start must be less than or equal to end");
  }
  return this.slice(start, end).indexOf(sub) + start;
}

/**
 * Return a formatted version of the string using the format string.
 * The format string may contain literal text or replacement fields.
 * The fields are identified by braces {fieldNumber}.
 * Each replacement field contains one or more format specifiers,
 * which define how the corresponding value is converted to a string.
 * The field number is optional, but may be present in the specifiers.
 * If the field number is not present, the fields are filled in in the order
 * they appear in the format string. If field numbers are present,
 * they are used to order the fields in the format string.
 * 
 * @param {string} - the format string
 * @returns {string} the formatted string
 * @throws {Error} if format is not a valid format string
 * @throws {Error} if there is a mismatch between the number of arguments and the number of specifiers
 */
String.prototype.format = function(...args) {
  let str = this.valueOf();
  const specifiers = str.match(/{([^}]*)}/g);
  if (specifiers === null) {
    throw new Error("format must be a valid format string");
  }
  if (args.length !== specifiers.length) {
    throw new Error("there is a mismatch between the number of arguments and the number of specifiers");
  }
  let numbered = null;
  for (let i = 0; i < specifiers.length; i++) {
    const innerNumber = specifiers[i].match(/^{([\d]+)}/);
    if (innerNumber) {
      if (numbered === false) {
        throw new Error("there is a mix of named and unnamed specifiers");
      }
      numbered = true;
      str = str.replace(specifiers[i], args[parseInt(innerNumber[0].slice(1, -1))]);

    } else {
      if (numbered === true) {
        throw new Error("there is a mix of named and unnamed specifiers");
      }
      numbered = false;
      str = str.replace(specifiers[i], args[i], 1);
    }
  }
  return str;
}

/**
 * Return a formatted version of the string using the format map.
 * The format map should be a Dict or Map but can also be an iterable.
 * of key-value pairs.
 * The fields are identified by braces {} and must contain names that match
 * the keys in the format map.
 * 
 * @param {Map | Dict} - the format map
 * @returns {string} the formatted string
 * @throws {TypeError} if map is not a Map, Dict or iterable of key-value pairs
 * @throws {Error} if map is empty
 * @throws {Error} if there is an empty specifier in the format string
 * @throws {Error} if there is a mismatch between the number of arguments and the number of specifiers
 */
String.prototype.format_map = function(map) {
  if (!(map instanceof Map || map instanceof Dict)) {
    try {
      map = new Dict(map);
    } catch (e) {
      throw new TypeError(
        "map must be a Map, Dict or iterable of key-value pairs"
      );
    }
  };
  if (map.size === 0) {
    throw new Error("map must not be empty");
  };
  let str = this.valueOf();
  const invalidSpecifier = str.match(/{}/g);
  if (invalidSpecifier !== null) {
    throw new Error("Invalid specifier at index " + invalidSpecifier.index);
  };
  const specifiers = str.match(/{([^}]*)}/g);
  if (specifiers === null) {
    return str;
  };
  for (let i = 0; i < specifiers.length; i++) {
    const key = specifiers[i].slice(1, -1);
    if (!map.get(key)) {
      throw new Error("map must contain all specifiers. Missing key: " + key);
    }
    str = str.replace(specifiers[i], map.get(key));
  };
  return str;
};

// index()
/**
 * Return the lowest index in the string where substring sub is found,
 * such that sub is contained in the slice s[start:end].
 * Optional arguments start and end are interpreted as in slice notation.
 * Return -1 on failure.
 * 
 * @param {string} - the substring to be found
 * @param {number} - the start index
 * @param {number} - the end index
 * @returns {number} the index of the substring
 * @throws {TypeError} if start is not an integer
 * @throws {TypeError} if end is not an integer
 * @throws {Error} if start or end is less than zero or end > start
 */
String.prototype.index = function(sub, start = 0, end = this.length) {
  if (typeof start !== "number" || start % 1 !== 0) {
    throw new TypeError("start must be an integer");
  }
  if (start < 0) {
    throw new Error("start must be greater than or equal to zero");
  }
  if (typeof end !== "number" || end % 1 !== 0) {
    throw new TypeError("end must be an integer");
  }
  if (end < 0) {
    throw new Error("end must be greater than or equal to zero");
  }
  if (end > this.length) {
    throw new Error(
      "end must be less than or equal to the length of the string"
    );
  }
  if (start > end) {
    throw new Error("start must be less than or equal to end");
  }
  return this.slice(start, end).indexOf(sub) + start;
}

// isalnum()
/**
 * Return true if all characters in the string are alphanumeric and there is at least one character, false otherwise.
 * 
 * @returns {boolean} true if all characters in the string are alphanumeric and there is at least one character, false otherwise
 */
String.prototype.isalnum = function() {
  return /^[a-zA-Z0-9]+$/.test(this);
}

// isalpha()
/**
 * Return true if all characters in the string are alphabetic and there is at least one character, false otherwise.
 * 
 * @returns {boolean} true if all characters in the string are alphabetic and there is at least one character, false otherwise
 */
String.prototype.isalpha = function() {
  return /^[a-zA-Z]+$/.test(this);
}

// isascii()
/**
 * Return true if all characters in the string are ASCII, false otherwise.
 * 
 * @returns {boolean} true if all characters in the string are ASCII, false otherwise
 */
String.prototype.isascii = function() {
  return /^[\x00-\x7F]+$/.test(this);
}

// isdecimal()
/**
 * Return true if all characters in the string are decimal digits, false otherwise.
 * 
 * @returns {boolean} true if all characters in the string are decimal digits, false otherwise
 */
String.prototype.isdecimal = function() {
  return /^[0-9.]+$/.test(this);
}

// isdigit()
/**
 * Return true if all characters in the string are digits, false otherwise.
 * 
 * @returns {boolean} true if all characters in the string are digits, false otherwise
 */
String.prototype.isdigit = function() {
  return /^[0-9]+$/.test(this);
}

// isidentifier()
/**
 * A string is considered a valid identifier if it only contains alphanumeric letters (a-z) and (0-9), or underscores (_). 
 * A valid identifier cannot start with a number, or contain any spaces.
 * 
 * @returns {boolean} true if the string is a valid identifier, false otherwise
 */
String.prototype.isidentifier = function() {
  return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(this);
}

// islower()
/**
 * Return true if all characters in the string are lowercase and there is at least one character, false otherwise.
 * 
 * @returns {boolean} true if all characters in the string are lowercase and there is at least one character, false otherwise
 */
String.prototype.islower = function() {
  return /^[a-z\s]+$/.test(this) && /[a-z]/.test(this);
}

// isnumeric()
/**
 * Return true if all characters in the string are numeric and there is at least one character, false otherwise.
 * 
 * @returns {boolean} true if all characters in the string are numeric and there is at least one character, false otherwise
 */
String.prototype.isnumeric = function() {
  return /^[0-9]+$/.test(this);
}

// isprintable()
/**
 * Return true if all characters in the string are printable, false otherwise.
 * 
 * @returns {boolean} true if all characters in the string are printable, false otherwise
 */
String.prototype.isprintable = function() {
  return /^[\x20-\x7E]+$/.test(this);
}

// isspace()
/**
 * Return true if all characters in the string are whitespace and there is at least one character, false otherwise.
 *  
 * @returns {boolean} true if all characters in the string are whitespace and there is at least one character, false otherwise
 */
String.prototype.isspace = function() {
  return /^[\s]+$/.test(this);
}

// istitle()
/**
 * Return true if the string is a titlecased string, false otherwise.
 * 
 * @returns {boolean} true if the string is a titlecased string, false otherwise
 */
String.prototype.istitle = function() {
  let words = this.split(" ");
  for (let word of words) {
    if (!/^[A-Z]+$/.test(word[0])) {
      return false;
    } else {
      for (let i = 1; i < word.length; i++) {
        if (!/^[^A-Z]+$/.test(word[i])) {
          return false;
        }
      }
    }
  }
  return true;
}

// isupper()
/**
 * Return true if all characters in the string are uppercase and there is at least one character, false otherwise.
 * 
 * @returns {boolean} true if all characters in the string are uppercase and there is at least one character, false otherwise
 */
String.prototype.isupper = function() {
  return /^[A-Z\s]+$/.test(this) && /[A-Z]/.test(this);
}

// join()
/**
 * Join the elements of an iterable to the end of the string.
 * 
 * @param {Iterable} iterable - the iterable to join
 * @returns {string} the joined string
 * @throws {TypeError} if iterable is not iterable
 * @throws {TypeError} if iterable contains a non-string
 */
String.prototype.join = function(iterable) {
  return iterable.join(this);
}

// ljust()
/**
 * Return a left-justified version of the string, padding on the right with the specified fill character.
 * 
 * @param {number} width - the minimum width of the resulting string
 * @param {string} [fillchar=" "] - the fill character
 * @returns {string} the left-justified string
 * @throws {TypeError} if width is not a number
 */
String.prototype.ljust = function(width, fillchar = " ") {
  if (!(typeof width === "number")) {
    throw new TypeError("width must be a number");
  }
  if (typeof fillchar !== "string") {
    throw new TypeError("fillchar must be a string");
  }
  if (width < 0) {
    throw new TypeError("width must be greater than or equal to 0");
  }
  return this.padEnd(width, fillchar);
}

// lower()
/**
 * Return a lowercased version of the string.
 * 
 * @returns {string} the lowercased string
 */
String.prototype.lower = function() {
  return this.toLowerCase();
}

// lstrip()
/**
 * Return a left-stripped version of the string.
 * 
 * @param {string} [chars=" "] - the characters to strip
 * @returns {string} the left-stripped string
 * @throws {TypeError} if chars is not a string
 */
String.prototype.lstrip = function(chars = " ") {
  if (!(typeof chars === "string")) {
    throw new TypeError("chars must be a string");
  }
  return this.jsReplace(new RegExp("^[" + chars + "]+"), "");
}

// maketrans()
/**
 * Return a translation table to be used in a str.translate() method.
 * 
 * @param {string} [from=""] - the characters to replace
 * @param {string} [to=""] - the replacement characters
 * @returns {Dict} the translation table
 * @throws {TypeError} if from is not a string
 * @throws {TypeError} if to is not a string
 * @throws {TypeError} if from and to are not the same length
 */
String.maketrans = function(from, to) {
  if (!(typeof from === "string")) {
    throw new TypeError("from must be a string");
  }
  if (!(typeof to === "string")) {
    throw new TypeError("to must be a string");
  }
  if (from.length !== to.length) {
    throw new TypeError("from and to must be the same length");
  }
  const table = new Dict();
  for (let i = 0; i < from.length; i++) {
    table[from.charCodeAt(i)] = to.charCodeAt(i);
  }
  return table;
}

// partition()
/**
 * Return a tuple containing the string itself, followed by the first occurrence of sep, and the remainder of the string.
 * 
 * @param {string} sep - the separator
 * @returns {Tuple} the tuple containing the string itself, followed by the first occurrence of sep, and the remainder of the string
 * @throws {TypeError} if sep is not a string
 * @throws {ValueError} if sep is empty
 */
String.prototype.partition = function(sep) {
  if (!(typeof sep === "string")) {
    throw new TypeError("sep must be a string");
  }
  if (sep.length === 0) {
    throw new ValueError("sep cannot be empty");
  }
  let index = this.indexOf(sep);
  if (index === -1) {
    return new Tuple([this, "", ""]);
  }
  return new Tuple([this.substring(0, index), sep, this.substring(index + sep.length)]);
}

/**
 * JS's original string replace() method
 */
String.prototype.jsReplace = String.prototype.replace;

// replace()
/**
 * Return a copy of the string with all occurrences of substring old replaced by new.
 * 
 * @param {string} old - the substring to replace
 * @param {string} new - the replacement substring
 * @param {number} - the maximum number of occurrences to replace
 * @returns {string} the copy of the string with all occurrences of substring old replaced by new
 */
String.prototype.replace = function(old, new_, count = -1) {
  let result = this;
  let index = 0;
  while (count !== 0 && index !== -1) {
    index = result.indexOf(old);
    if (index === -1) {
      break;
    }
    result =
      result.substring(0, index) + new_ + result.substring(index + old.length);
    count--;
  }
  return result.valueOf();
}

// rfind()
/**
 * Return the highest index in the string where substring sub is found, starting at the end.
 * 
 * @param {string} sub - the substring to find
 * @param {number} [start=0] - the index to start the search
 * @param {number} [end=-1] - the index to end the search
 * @returns {number} the highest index in the string where substring sub is found, starting at the end
 * @throws {TypeError} if sub is not a string
 * @throws {TypeError} if start is not a number
 * @throws {TypeError} if end is not a number
 * @throws {ValueError} if start is not in the range [0, len(string)]
 */
String.prototype.rfind = function(sub, start = 0, end = -1) {
  if (!(typeof sub === "string")) {
    throw new TypeError("sub must be a string");
  }
  if (!(typeof start === "number")) {
    throw new TypeError("start must be a number");
  }
  if (!(typeof end === "number")) {
    throw new TypeError("end must be a number");
  }
  if (start < 0 || start > this.length) {
    throw new ValueError("start must be in the range [0, len(string)]");
  }
  if (end < -1 || end > this.length) {
    throw new ValueError("end must be in the range [-1, len(string)]");
  }
  if (end === -1) {
    end = this.length;
  }
  let index = this.lastIndexOf(sub, end);
  if (index < start) {
    return -1;
  }
  return index;
}

// rindex()
/**
 * Return the highest index in the string where substring sub is found, starting at the end.
 * 
 * @param {string} sub - the substring to find
 * @param {number} [start=0] - the index to start the search
 * @param {number} [end=-1] - the index to end the search
 * @returns {number} the highest index in the string where substring sub is found, starting at the end
 * @throws {TypeError} if sub is not a string
 * @throws {TypeError} if start is not a number
 * @throws {TypeError} if end is not a number
 * @throws {ValueError} if start is not in the range [0, len(string)]
 */
String.prototype.rindex = function(sub, start = 0, end = -1) {
  if (!(typeof sub === "string")) {
    throw new TypeError("sub must be a string");
  }
  if (!(typeof start === "number")) {
    throw new TypeError("start must be a number");
  }
  if (!(typeof end === "number")) {
    throw new TypeError("end must be a number");
  }
  if (start < 0 || start > this.length) {
    throw new ValueError("start must be in the range [0, len(string)]");
  }
  if (end < -1 || end > this.length) {
    throw new ValueError("end must be in the range [-1, len(string)]");
  }
  if (end === -1) {
    end = this.length;
  }
  let index = this.lastIndexOf(sub, end);
  if (index < start) {
    throw new ValueError("substring not found");
  }
  return index;
}

// rjust()
/**
 * Return the string right justified in a string of length width.
 * 
 * @param {number} width - the length of the resulting string
 * @param {string} [fillchar=" "] - the character to pad the string with
 * @returns {string} the string right justified in a string of length width
 * @throws {TypeError} if width is not a number
 * @throws {TypeError} if fillchar is not a string
 * @throws {ValueError} if width is less than zero
 */
String.prototype.rjust = function(width, fillchar = " ") {
  if (!(typeof width === "number")) {
    throw new TypeError("width must be a number");
  }
  if (!(typeof fillchar === "string")) {
    throw new TypeError("fillchar must be a string");
  }
  if (width < 0) {
    throw new ValueError("width must be greater than or equal to zero");
  }
  let padding = "";
  for (let i = 0; i < width - this.length; i++) {
    padding += fillchar;
  }
  return padding + this;
}

// rpartition()
/**
 * Return a tuple containing the string itself, followed by the last occurrence of sep, and the remainder of the string.
 * 
 * @param {string} sep - the separator
 * @returns {Tuple} the tuple containing the string itself, followed by the first occurrence of sep, and the remainder of the string
 * @throws {TypeError} if sep is not a string
 * @throws {ValueError} if sep is empty
 * @throws {ValueError} if sep is not in the string
 */
String.prototype.rpartition = function(sep) {
  if (!(typeof sep === "string")) {
    throw new TypeError("sep must be a string");
  }
  if (sep.length === 0) {
    throw new ValueError("sep cannot be empty");
  }
  if (!this.includes(sep)) {
    return new Tuple("", "", this);
  }
  let index = this.lastIndexOf(sep);
  return new Tuple([this.substring(0, index), sep, this.substring(index + sep.length)]);
}

// rsplit()
/**
 * Return a list of the words in the string, using sep as the delimiter string starting from the right.
 * 
 * @param {string} [sep=" "] - the delimiter string
 * @param {number} [maxsplit=-1] - the maximum number of splits
 * @returns {string[]} the list of the words in the string, using sep as the delimiter string
 * @throws {TypeError} if sep is not a string
 * @throws {TypeError} if maxsplit is not a number
 * @throws {ValueError} if maxsplit is less than zero
 */
String.prototype.rsplit = function(sep = " ", maxsplit = -1) {
  if (!(typeof sep === "string")) {
    throw new TypeError("sep must be a string");
  }
  if (!(typeof maxsplit === "number")) {
    throw new TypeError("maxsplit must be a number");
  }
  let words = this.split(sep, maxsplit);
  return new List(words.reverse());
}

// rstrip()
/**
 * Return a copy of the string with trailing whitespace removed.
 * 
 * @param {string} [chars=" "] - the characters to be stripped
 * @returns {string} a copy of the string with trailing whitespace removed
 * @throws {TypeError} if chars is not a string
 * @throws {ValueError} if chars is empty
 * @throws {ValueError} if chars is not in the string
 */
String.prototype.rstrip = function(chars = " ") {
  if (!(typeof chars === "string")) {
    throw new TypeError("chars must be a string");
  }
  if (chars.length === 0) {
    throw new ValueError("chars cannot be empty");
  }
  let index = this.length;
  while (index > 0) {
    if (chars.includes(this[index - 1])) {
      index--;
    } else {
      break;
    }
  }
  return this.substring(0, index);
}

/**
 * The JS implementatino of split()
 */
String.prototype.jsSplit = String.prototype.split;

// split()
/**
 * splits the string into a list of words using sep as the delimiter string and the maxsplit as the maximum number of splits.
 * 
 * @param {string} [sep=" "] - the delimiter string
 * @param {number} [maxsplit=-1] - the maximum number of splits 
 * @returns {List}
 */
String.prototype.split = function(sep = " ", maxsplit = -1) {
  return new List(this.jsSplit(sep, maxsplit));
}

// splitlines()
/**
 * Return a list of the lines in the string, breaking at line boundaries.
 *  
 * @param {boolean} [keepends=false] - if true, retain line breaks in the resulting list
 * @returns {string[]} the list of the lines in the string, breaking at line boundaries
 * @throws {TypeError} if keepends is not a boolean
 */
String.prototype.splitlines = function(keepends = false) {
  if (!(keepends instanceof Boolean || typeof keepends === "boolean")) {
    throw new TypeError("keepends must be a boolean");
  }
  if (keepends) {
    return list(this.split("\n"));
  } else {
    return new List(this.split("\n").map(line => line.rstrip()));
  }
}

// startswith()
/**
 * Return true if the string starts with the prefix, otherwise return false.
 * 
 * @param {string} prefix - the prefix
 * @param {number} [start=0] - the index to start searching from
 * @returns {boolean} true if the string starts with the prefix, otherwise return false
 */
String.prototype.startswith = function(prefix, start = 0) {
  if (!(typeof prefix === "string")) {
    throw new TypeError("prefix must be a string");
  }
  if (!(typeof start === "number")) {
    throw new TypeError("start must be a number");
  }
  if (start < 0) {
    throw new Error("start must be greater than or equal to zero");
  }
  if (start > this.length) {
    return false;
  }
  return this.substring(start, start + prefix.length) === prefix;
}

// strip()
/**
 * Return a copy of the string with leading and trailing whitespace removed.
 * 
 * @param {string} [chars=" "] - the characters to be stripped
 * @returns {string} a copy of the string with leading and trailing whitespace removed
 */
String.prototype.strip = function(chars = " ") {
  return this.lstrip(chars).rstrip(chars);
}

// swapcase()
/**
 * Return a copy of the string with uppercase characters converted to lowercase and vice versa.
 * 
 * @returns {string} a copy of the string with uppercase characters converted to lowercase and vice versa
 * @throws {ValueError} if the string is empty
 */
String.prototype.swapcase = function() {
  if (this.length === 0) {
    throw new ValueError("string cannot be empty");
  }
  let result = "";
  for (let i = 0; i < this.length; i++) {
    let char = this[i];
    if (char.toUpperCase() === char) {
      result += char.toLowerCase();
    } else {
      result += char.toUpperCase();
    }
  }
  return result;
}

// title()
/**
 * Return a titlecased version of the string where words start with an uppercase character and the remaining characters are lowercase.
 * 
 * @returns {string} a titlecased version of the string where words start with an uppercase character and the remaining characters are lowercase
 * @throws {ValueError} if the string is empty
 * @throws {ValueError} if the string contains only whitespace
 */
String.prototype.title = function() {
  if (this.length === 0) {
    throw new ValueError("string cannot be empty");
  }
  if (this.trim().length === 0) {
    throw new ValueError("string cannot be empty");
  }
  let result = "";
  let words = this.split();
  for (let i = 0; i < words.length; i++) {
    result += words[i].substring(0, 1).toUpperCase() + words[i].substring(1).toLowerCase();
    if (i < words.length - 1) {
      result += " ";
    }
  }
  return result;
}

// translate()
/**
 * Return a copy of the string in which each character has been mapped through the given translation table.
 * You can use String.maketrans() to create a translation map from character-to-character mappings in different formats.
 *  
 * @param {string} [table=""] - the mapping table
 * @returns {string} a copy of the string where all characters have been mapped to their uppercase equivalent
 * @throws {TypeError} if table is not a Dict or Map
 */
String.prototype.translate = function(table) {
  if (!(table instanceof Dict || table instanceof Map)) {
    throw new TypeError("table must be a Dict or Map. You can use String.maketrans() to create a translation map from character-to-character mappings in different formats.");
  }
  let result = "";
  for (let i = 0; i < this.length; i++) {
    let char = this[i];
    if (table.get(char.charCodeAt(0))) {
      result += String.fromCharCode(table.get(char.charCodeAt(0)));
    } else {
      result += char;
    }
  }
  return result;
}

// upper()
/**
 * Return a copy of the string where all characters have been mapped to their uppercase equivalent.
 * 
 * @returns {string} a copy of the string where all characters have been mapped to their uppercase equivalent
 * @throws {ValueError} if the string is empty
 */
String.prototype.upper = function() {
  if (this.length === 0) {
    throw new ValueError("string cannot be empty");
  }
  let result = "";
  for (let i = 0; i < this.length; i++) {
    result += this[i].toUpperCase();
  }
  return result;
}

// zfill()
/**
 * Return a string of length width padded with zeros on the left.
 * 
 * @param {number} width - the length of the resulting string
 * @returns {string} a string of length width padded with zeros on the left
 * @throws {TypeError} if width is not a number
 * @throws {ValueError} if width is not a positive integer
 * @throws {ValueError} if the string is empty
 */
String.prototype.zfill = function(width) {
  if (!(typeof width === "number")) {
    throw new TypeError("width must be a number");
  }
  if (width < 1) {
    throw new ValueError("width must be a positive integer");
  }
  if (this.length === 0) {
    throw new ValueError("string cannot be empty");
  }
  let result = "";
  for (let i = 0; i < width - this.length; i++) {
    result += "0";
  }
  result += this;
  return result;
}

module.exports = {
  Complex,
  Dict,
  FrozenSet,
  Tuple,
  List
};
