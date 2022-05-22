const { Buffer } = require("node:buffer");

// String constants

/** The concatenation of the ascii_lowercase and ascii_uppercase constants */
const ascii_letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

/** The lowercase letters 'abcdefghijklmnopqrstuvwxyz'. */
const ascii_lowercase = "abcdefghijklmnopqrstuvwxyz";

/** The uppercase letters 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'. */
const ascii_uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/** The string '0123456789'. */
const digits = "0123456789";

/** The string '0123456789abcdefABCDEF'. */
const hexdigits = "0123456789abcdefABCDEF";

/** The string '01234567'. */
const octdigits = "01234567";

/** String of ASCII characters which are considered punctuation characters in the C locale.
 * !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~
 */
const punctuation = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";

/** String of ASCII characters which are considered printable. This is a combination of
 * the ascii_letters, digits, punctuation and whitespace constants.
 */
const printable =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~ \t\n\r\x0b\x0c";

/** The whitespace characters ' \t\n\x0b\x0c\r'. */
const whitespace = " \t\n\x0b\x0c\r";

/** Class representing Python's Str */
class Str extends String {
  /**
   * Create a new Str object
   *
   * @param {string} - the string to be wrapped
   */
  constructor(value) {
    super(value);
  }

  /**
   * Convert the first character of the string to uppercase
   *
   * @returns {string} the string with the first character converted to uppercase
   */
  capitalize() {
    return this[0].toUpperCase() + this.slice(1);
  }

  // casefold()
  /**
   * Convert the string to lowercase
   *
   * @returns {string} the string converted to lowercase
   */
  casefold() {
    return this.toLowerCase();
  }

  // center()
  /**
   * Return a centered string of length width.
   *
   * @param {number} - the length of the string to be returned
   * @param {string} - the string to be used for padding
   * @returns {string} the centered string
   * @throws {TypeError} if width is not an integer
   * @throws {Error} if width is less than zero
   */
  center(width, fillchar = " ") {
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

  // count()
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
  count(sub, start = 0, end = this.length) {
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
  encode(encoding = "utf-8") {
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
  endswith(suffix, start = 0, end = this.length) {
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
  expandtabs(tabsize = 2) {
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
      str = str.replace("\t", " ".repeat(tabsize - tabs % tabsize));
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
  find(sub, start = 0, end = this.length) {
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
    return this.slice(start, end).indexOf(sub);
  }

  // format()
  /**
   * Return a formatted version of the string using the format string.
   * The format string may contain literal text or replacement fields.
   * The fields are identified by braces {}.
   * Each replacement field contains one or more format specifiers,
   * which define how the corresponding value is converted to a string.
   * The field name is optional, but may be present in the specifiers.
   * 
   * @param {string} - the format string
   * @returns {string} the formatted string
   * @throws {TypeError} if format is not a string
   * @throws {Error} if format is not a valid format string
   * @throws {Error} if there is a mismatch between the number of arguments and the number of specifiers
   */
  format(format) {
    if (typeof format !== "string") {
      throw new TypeError("format must be a string");
    }
    const specifiers = format.match(/{([^}]+)}/g);
    if (specifiers === null) {
      throw new Error("format must be a valid format string");
    }
    if (specifiers.length !== arguments.length - 1) {
      throw new Error(
        "there is a mismatch between the number of arguments and the number of specifiers"
      );
    }
    let str = format;
    for (let i = 0; i < specifiers.length; i++) {
      str = str.replace(specifiers[i], str(arguments[i + 1]));
    }
    return str;
  }

  // format_map()
  /**
   * Return a formatted version of the string using the format string.
   * The format string may contain literal text or replacement fields.
   * The fields are identified by braces {}.
   * Each replacement field contains one or more format specifiers,
   * which define how the corresponding value is converted to a string.
   * The field name is optional, but may be present in the specifiers.
   * 
   * @param {Map} - the map of values
   * @returns {string} the formatted string
   * @throws {TypeError} if map is not a map
   * @throws {Error} if map is empty
   * @throws {Error} if there is a mismatch between the number of arguments and the number of specifiers
   */
  format_map(map) {
    if (!(map instanceof Map)) {
      throw new TypeError("map must be a map");
    }
    if (map.size === 0) {
      throw new Error("map must not be empty");
    }
    const specifiers = this.match(/{([^}]+)}/g);
    if (specifiers === null) {
      throw new Error("format must be a valid format string");
    }
    if (specifiers.length !== map.size) {
      throw new Error(
        "there is a mismatch between the number of arguments and the number of specifiers"
      );
    }
    let str = this;
    for (let i = 0; i < specifiers.length; i++) {
      str = str.replace(specifiers[i], str(map.get(specifiers[i])));
    }
    return str;
  }

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
  index(sub, start = 0, end = this.length) {
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
    return this.slice(start, end).indexOf(sub);
  }

  // isalnum()
  /**
   * Return true if all characters in the string are alphanumeric and there is at least one character, false otherwise.
   * 
   * @returns {boolean} true if all characters in the string are alphanumeric and there is at least one character, false otherwise
   */
  isalnum() {
    return /^[a-zA-Z0-9]+$/.test(this);
  }

  // isalpha()
  /**
   * Return true if all characters in the string are alphabetic and there is at least one character, false otherwise.
   * 
   * @returns {boolean} true if all characters in the string are alphabetic and there is at least one character, false otherwise
   */
  isalpha() {
    return /^[a-zA-Z]+$/.test(this);
  }

  // isascii()
  /**
   * Return true if all characters in the string are ASCII, false otherwise.
   * 
   * @returns {boolean} true if all characters in the string are ASCII, false otherwise
   */
  isascii() {
    return /^[\x00-\x7F]+$/.test(this);
  }

  // isdecimal()
  /**
   * Return true if all characters in the string are decimal digits, false otherwise.
   * 
   * @returns {boolean} true if all characters in the string are decimal digits, false otherwise
   */
  isdecimal() {
    return /^[0-9]+$/.test(this);
  }

  // isdigit()
  /**
   * Return true if all characters in the string are digits, false otherwise.
   * 
   * @returns {boolean} true if all characters in the string are digits, false otherwise
   */
  isdigit() {
    return /^[0-9]+$/.test(this);
  }

  // isidentifier()
  /**
   * Return true if the string is a valid identifier according to the language definition, false otherwise.
   * 
   * @returns {boolean} true if the string is a valid identifier according to the language definition, false otherwise
   */
  isidentifier() {
    return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(this);
  }

  // islower()
  /**
   * Return true if all characters in the string are lowercase and there is at least one character, false otherwise.
   * 
   * @returns {boolean} true if all characters in the string are lowercase and there is at least one character, false otherwise
   */
  islower() {
    return /^[a-z]+$/.test(this);
  }

  // isnumeric()
  /**
   * Return true if all characters in the string are numeric and there is at least one character, false otherwise.
   * 
   * @returns {boolean} true if all characters in the string are numeric and there is at least one character, false otherwise
   */
  isnumeric() {
    return /^[0-9]+$/.test(this);
  }

  // isprintable()
  /**
   * Return true if all characters in the string are printable, false otherwise.
   * 
   * @returns {boolean} true if all characters in the string are printable, false otherwise
   */
  isprintable() {
    return /^[\x20-\x7E]+$/.test(this);
  }

  // isspace()
  /**
   * Return true if all characters in the string are whitespace and there is at least one character, false otherwise.
   *  
   * @returns {boolean} true if all characters in the string are whitespace and there is at least one character, false otherwise
   */
  isspace() {
    return /^[\s]+$/.test(this);
  }

  // istitle()
  /**
   * Return true if the string is a titlecased string, false otherwise.
   * 
   * @returns {boolean} true if the string is a titlecased string, false otherwise
   */
  istitle() {
    return /^[A-Z][a-z]+$/.test(this);
  }

  // isupper()
  /**
   * Return true if all characters in the string are uppercase and there is at least one character, false otherwise.
   * 
   * @returns {boolean} true if all characters in the string are uppercase and there is at least one character, false otherwise
   */
  isupper() {
    return /^[A-Z]+$/.test(this);
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
  join(iterable) {
    if (!(iterable instanceof Iterable)) {
      throw new TypeError("iterable must be iterable");
    }
    let result = "";
    for (let item of iterable) {
      if (typeof item !== "string") {
        throw new TypeError("iterable must contain only strings");
      }
      result += item;
    }
    return result;
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
  ljust(width, fillchar = " ") {
    if (!(width instanceof Number)) {
      throw new TypeError("width must be a number");
    }
    return this.padEnd(width, fillchar);
  }

  // lower()
  /**
   * Return a lowercased version of the string.
   * 
   * @returns {string} the lowercased string
   */
  lower() {
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
  lstrip(chars = " ") {
    if (!(chars instanceof String)) {
      throw new TypeError("chars must be a string");
    }
    return this.replace(new RegExp("^[" + chars + "]+"), "");
  }

  // maketrans()
  /**
   * Return a translation table to be used in a str.translate() method.
   * 
   * @param {string} [from=""] - the characters to replace
   * @param {string} [to=""] - the replacement characters
   * @returns {string} the translation table
   * @throws {TypeError} if from is not a string
   * @throws {TypeError} if to is not a string
   * @throws {TypeError} if from and to are not the same length
   */
  maketrans(from = "", to = "") {
    if (!(from instanceof String)) {
      throw new TypeError("from must be a string");
    }
    if (!(to instanceof String)) {
      throw new TypeError("to must be a string");
    }
    if (from.length !== to.length) {
      throw new TypeError("from and to must be the same length");
    }
    let table = "";
    for (let i = 0; i < from.length; i++) {
      table += from[i];
      table += to[i];
    }
    return table;
  }

  // partition()
  /**
   * Return a tuple containing the string itself, followed by the first occurrence of sep, and the remainder of the string.
   * 
   * @param {string} sep - the separator
   * @returns {string[]} the tuple containing the string itself, followed by the first occurrence of sep, and the remainder of the string
   * @throws {TypeError} if sep is not a string
   * @throws {ValueError} if sep is empty
   */
  partition(sep) {
    if (!(sep instanceof String)) {
      throw new TypeError("sep must be a string");
    }
    if (sep.length === 0) {
      throw new ValueError("sep cannot be empty");
    }
    let index = this.indexOf(sep);
    if (index === -1) {
      return [this, "", ""];
    }
    return [this.substring(0, index), sep, this.substring(index + sep.length)];
  }

  // replace()
  /**
   * Return a copy of the string with all occurrences of substring old replaced by new.
   * 
   * @param {string} old - the substring to replace
   * @param {string} new - the replacement substring
   * @returns {string} the copy of the string with all occurrences of substring old replaced by new
   */
  replace(old, new_) {
    return this.split(old).join(new_);
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
  rfind(sub, start = 0, end = -1) {
    if (!(sub instanceof String)) {
      throw new TypeError("sub must be a string");
    }
    if (!(start instanceof Number)) {
      throw new TypeError("start must be a number");
    }
    if (!(end instanceof Number)) {
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
  rindex(sub, start = 0, end = -1) {
    if (!(sub instanceof String)) {
      throw new TypeError("sub must be a string");
    }
    if (!(start instanceof Number)) {
      throw new TypeError("start must be a number");
    }
    if (!(end instanceof Number)) {
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
  rjust(width, fillchar = " ") {
    if (!(width instanceof Number)) {
      throw new TypeError("width must be a number");
    }
    if (!(fillchar instanceof String)) {
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
   * Return a tuple containing the string itself, followed by the first occurrence of sep, and the remainder of the string.
   * 
   * @param {string} sep - the separator
   * @returns {string[]} the tuple containing the string itself, followed by the first occurrence of sep, and the remainder of the string
   * @throws {TypeError} if sep is not a string
   * @throws {ValueError} if sep is empty
   * @throws {ValueError} if sep is not in the string
   */
  rpartition(sep) {
    if (!(sep instanceof String)) {
      throw new TypeError("sep must be a string");
    }
    if (sep.length === 0) {
      throw new ValueError("sep cannot be empty");
    }
    if (!this.includes(sep)) {
      throw new ValueError("sep must be in the string");
    }
    let index = this.lastIndexOf(sep);
    return [this.substring(0, index), sep, this.substring(index + sep.length)];
  }

  // rsplit()
  /**
   * Return a list of the words in the string, using sep as the delimiter string.
   * 
   * @param {string} [sep=" "] - the delimiter string
   * @param {number} [maxsplit=-1] - the maximum number of splits
   * @returns {string[]} the list of the words in the string, using sep as the delimiter string
   * @throws {TypeError} if sep is not a string
   * @throws {TypeError} if maxsplit is not a number
   * @throws {ValueError} if maxsplit is less than zero
   */
  rsplit(sep = " ", maxsplit = -1) {
    if (!(sep instanceof String)) {
      throw new TypeError("sep must be a string");
    }
    if (!(maxsplit instanceof Number)) {
      throw new TypeError("maxsplit must be a number");
    }
    if (maxsplit < 0) {
      throw new ValueError("maxsplit must be greater than or equal to zero");
    }
    let list = [];
    let index = this.length;
    while (maxsplit !== 0) {
      let nextIndex = this.rindex(sep, 0, index);
      if (nextIndex === -1) {
        list.push(this.substring(0, index));
        break;
      }
      list.push(this.substring(nextIndex + sep.length, index));
      index = nextIndex;
      maxsplit--;
    }
    return list.reverse();
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
  rstrip(chars = " ") {
    if (!(chars instanceof String)) {
      throw new TypeError("chars must be a string");
    }
    if (chars.length === 0) {
      throw new ValueError("chars cannot be empty");
    }
    if (!this.includes(chars)) {
      throw new ValueError("chars must be in the string");
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

  // split()
  /**
   * Return a list of the words in the string, using sep as the delimiter string.
   *  
   * @param {string} [sep=" "] - the delimiter string
   * @param {number} [maxsplit=-1] - the maximum number of splits
   * @returns {string[]} the list of the words in the string, using sep as the delimiter string
   * @throws {TypeError} if sep is not a string
   * @throws {ValueError} if sep is empty
   * @throws {ValueError} if sep is not in the string
   */
  split(sep = " ", maxsplit = -1) {
    if (!(sep instanceof String)) {
      throw new TypeError("sep must be a string");
    }
    if (sep.length === 0) {
      throw new ValueError("sep cannot be empty");
    }
    if (!this.includes(sep)) {
      throw new ValueError("sep must be in the string");
    }
    let list = [];
    let index = 0;
    while (maxsplit !== 0) {
      let nextIndex = this.indexOf(sep, index);
      if (nextIndex === -1) {
        list.push(this.substring(index));
        break;
      }
      list.push(this.substring(index, nextIndex));
      index = nextIndex + sep.length;
      maxsplit--;
    }
    return list;
  }

  // swapcase()
  /**
   * Return a copy of the string with uppercase characters converted to lowercase and vice versa.
   * 
   * @returns {string} a copy of the string with uppercase characters converted to lowercase and vice versa
   * @throws {ValueError} if the string is empty
   */
  swapcase() {
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
  title() {
    if (this.length === 0) {
      throw new ValueError("string cannot be empty");
    }
    if (this.trim().length === 0) {
      throw new ValueError("string cannot be empty");
    }
    let result = "";
    let isFirst = true;
    for (let i = 0; i < this.length; i++) {
      let char = this[i];
      if (char.toUpperCase() === char) {
        if (isFirst) {
          result += char.toLowerCase();
        } else {
          result += char.toUpperCase();
        }
        isFirst = false;
      } else {
        result += char.toLowerCase();
        isFirst = true;
      }
    }
    return result;
  }

  // translate()
  /**
   * Return a copy of the string where all characters have been mapped to their uppercase equivalent.
   *  
   * @param {string} [table=""] - the mapping table
   * @returns {string} a copy of the string where all characters have been mapped to their uppercase equivalent
   * @throws {TypeError} if table is not a string
   * @throws {ValueError} if table is empty
   * @throws {ValueError} if table is not in the string
   */
  translate(table = "") {
    if (!(table instanceof String)) {
      throw new TypeError("table must be a string");
    }
    if (table.length === 0) {
      throw new ValueError("table cannot be empty");
    }
    if (!this.includes(table)) {
      throw new ValueError("table must be in the string");
    }
    let result = "";
    for (let i = 0; i < this.length; i++) {
      let char = this[i];
      let index = table.indexOf(char);
      if (index === -1) {
        result += char;
      } else {
        result += table[index + 1];
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
  upper() {
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
  zfill(width) {
    if (!(width instanceof Number)) {
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
}


module.exports = {
  Str,
  ascii_letters,
  ascii_lowercase,
  ascii_uppercase,
  digits,
  hexdigits,
  octdigits,
  punctuation,
  whitespace,
  printable
};
