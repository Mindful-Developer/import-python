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
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~ \t\n\r\v\f";

/** The whitespace characters ' \\t\\n\\r\\v\\f'. */
const whitespace = " \t\n\r\v\f";


module.exports = {
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
